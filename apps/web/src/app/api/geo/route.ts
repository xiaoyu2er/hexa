import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  return NextResponse.json(
    {
      geo: {
        country: req.geo?.country,
        region: req.geo?.region,
        city: req.geo?.city,
        longitude: req.geo?.longitude,
        latitude: req.geo?.latitude,
      },
      ip: req.ip,
      url: req.url,
      nextUrl: req.nextUrl,
      headers: [...req.headers.entries()],
      cookies: req.cookies.getAll(),
      // ua: req.ua,
    },
    { status: 200 }
  );
}
