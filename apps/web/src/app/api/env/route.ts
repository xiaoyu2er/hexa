import { DISABLE_CLOUDFLARE_TURNSTILE, PUBLIC_URL } from "@/lib/const";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    PUBLIC_URL,
    DISABLE_CLOUDFLARE_TURNSTILE,
  });
}
