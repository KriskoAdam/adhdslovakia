import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

// Redis.fromEnv() automaticky nájde premenné, ktoré do projektu
// doplní Upstash integrácia z Vercel Marketplace (UPSTASH_REDIS_REST_URL
// a UPSTASH_REDIS_REST_TOKEN).
const redis = Redis.fromEnv();

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { slug } = await params;
  const count = (await redis.get<number>(`likes:${slug}`)) ?? 0;
  return NextResponse.json({ count });
}

export async function POST(_req: NextRequest, { params }: Params) {
  const { slug } = await params;
  const count = await redis.incr(`likes:${slug}`);
  return NextResponse.json({ count });
}
