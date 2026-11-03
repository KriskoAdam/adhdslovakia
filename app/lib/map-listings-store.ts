import { Redis } from "@upstash/redis";
import type { MapListing } from "./map-listing-types";

export const mapListingKey = "map:listings:v1";

export async function getMapListings(): Promise<MapListing[]> {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return [];

  try {
    const redis = Redis.fromEnv();
    const stored = await redis.lrange<string | MapListing>(mapListingKey, 0, 499);
    return stored.flatMap((item) => {
      if (typeof item !== "string") return [item];
      try {
        return [JSON.parse(item) as MapListing];
      } catch {
        return [];
      }
    });
  } catch {
    return [];
  }
}
