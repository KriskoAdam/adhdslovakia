import { createHash, randomUUID } from "node:crypto";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";
import { getMapListings, mapListingKey } from "../../lib/map-listings-store";
import type { MapListing } from "../../lib/map-listing-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const redis = Redis.fromEnv();
const daySeconds = 60 * 60 * 24;

const clean = (value: unknown, maxLength: number) => typeof value === "string" ? value.trim().slice(0, maxLength) : "";
const publicUrl = (value: unknown) => {
  const input = clean(value, 500);
  if (!input) return "";
  try { const parsed = new URL(input); return ["http:", "https:"].includes(parsed.protocol) ? parsed.toString() : ""; } catch { return ""; }
};
const normalize = (value: string) => value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

export async function GET() {
  const listings = await getMapListings();
  return NextResponse.json({ listings }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const ipHash = createHash("sha256").update(ip).digest("hex").slice(0, 24);
  const rateKey = `map:listing-rate:${ipHash}`;
  const requests = await redis.incr(rateKey);
  if (requests === 1) await redis.expire(rateKey, daySeconds);
  if (requests > 8) return NextResponse.json({ error: "rate_limit" }, { status: 429 });

  let input: Record<string, unknown>;
  try {
    input = await request.json() as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  // Honeypot field for simple automated spam.
  if (clean(input.companyWebsite, 200)) return NextResponse.json({ ok: true }, { status: 201 });

  const name = clean(input.name, 120);
  const city = clean(input.city, 80);
  const address = clean(input.address, 180);
  const providerKind = input.providerKind;
  const listingType = input.listingType;
  const serviceMode = input.serviceMode;
  const audience = input.audience;
  const locale = input.locale === "en" ? "en" : "sk";
  const coords = Array.isArray(input.coordinates) && input.coordinates.length === 2 ? input.coordinates.map(Number) : null;
  const onlineOnly = serviceMode === "online";

  if (!name || (!city && !onlineOnly) || !["workplace", "professional"].includes(String(listingType)) || input.consent !== "on" || !["psychologist", "psychiatrist", "neurologist", "therapist", "support", "other"].includes(String(providerKind)) || !["inPerson", "online", "both"].includes(String(serviceMode)) || !["adults", "youngPeople", "both"].includes(String(audience))) {
    return NextResponse.json({ error: "invalid_listing" }, { status: 400 });
  }
  if (!onlineOnly && (!coords || !Number.isFinite(coords[0]) || !Number.isFinite(coords[1]) || coords[0] < 47.6 || coords[0] > 49.9 || coords[1] < 16.5 || coords[1] > 22.7)) {
    return NextResponse.json({ error: "coordinates_required" }, { status: 400 });
  }

  const services = Array.isArray(input.services) ? input.services.filter((service): service is string => typeof service === "string" && ["assessment", "diagnosis", "medication", "therapy", "support", "biofeedback", "other"].includes(service)).slice(0, 7) : [];
  const listing: MapListing = {
    id: randomUUID(), listingType: listingType as MapListing["listingType"], name, city, regionId: Number.isInteger(Number(input.regionId)) && Number(input.regionId) >= 1 && Number(input.regionId) <= 8 ? Number(input.regionId) : null,
    address, providerKind: providerKind as MapListing["providerKind"], serviceMode: serviceMode as MapListing["serviceMode"], audience: audience as MapListing["audience"], services,
    price: clean(input.price, 120), insuranceType: ["contracted", "selfPay", "mixed"].includes(String(input.insuranceType)) ? input.insuranceType as MapListing["insuranceType"] : "unknown",
    insuranceDetails: clean(input.insuranceDetails, 160), waitingTime: clean(input.waitingTime, 100), accepting: ["yes", "no"].includes(String(input.accepting)) ? input.accepting as MapListing["accepting"] : "unknown",
    phone: clean(input.phone, 40), email: clean(input.email, 160), website: publicUrl(input.website), mapUrl: publicUrl(input.mapUrl), sourceUrl: publicUrl(input.sourceUrl), details: clean(input.details, 1000), locale,
    coordinates: onlineOnly ? null : coords as [number, number], createdAt: new Date().toISOString(),
  };

  const identity = normalize(`${listing.name}|${listing.city}|${listing.address}|${listing.phone}|${listing.email}`);
  const duplicateKey = `map:listing-duplicate:${createHash("sha256").update(identity).digest("hex")}`;
  const created = await redis.createScript<number>(
    'if redis.call("SET", KEYS[1], ARGV[1], "NX") then redis.call("LPUSH", KEYS[2], ARGV[2]); return 1 else return 0 end',
  ).eval([duplicateKey, mapListingKey], [listing.id, JSON.stringify(listing)]);
  if (!created) return NextResponse.json({ error: "duplicate" }, { status: 409 });
  return NextResponse.json({ listing }, { status: 201, headers: { "Cache-Control": "no-store" } });
}
