import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, isValidToken } from "@/lib/seo/auth";
import { getPageSpeedScores } from "@/lib/seo/pagespeed";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const jar = await cookies();
  if (!isValidToken(jar.get(COOKIE_NAME)?.value)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  if (!url || !URL.canParse(url)) {
    return NextResponse.json({ ok: false, error: "invalid-url" }, { status: 400 });
  }

  const scores = await getPageSpeedScores(url);
  return NextResponse.json({ ok: true, url, scores });
}
