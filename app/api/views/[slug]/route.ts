import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

const redis = Redis.fromEnv();
type Params = { params: Promise<{ slug: string }> };

export async function POST(_request: NextRequest, { params }: Params) {
  const { slug } = await params;
  if (!slug || slug.length > 180 || slug.includes("/") || slug.includes("\\")) {
    return NextResponse.json({ error: "Invalid article slug" }, { status: 400 });
  }
  const count = await redis.incr(`views:${slug}`);
  return NextResponse.json({ count }, { headers: { "Cache-Control": "no-store" } });
}
