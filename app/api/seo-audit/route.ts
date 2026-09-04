import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, isValidToken } from "@/lib/seo/auth";
import { auditSite } from "@/lib/seo/audit";
import { getAllRoutePaths } from "@/lib/seo/routes";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const jar = await cookies();
  if (!isValidToken(jar.get(COOKIE_NAME)?.value)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const baseUrl = searchParams.get("baseUrl") || "https://jetautomation.ca";

  if (!URL.canParse(baseUrl)) {
    return NextResponse.json({ ok: false, error: "invalid-base-url" }, { status: 400 });
  }

  const paths = await getAllRoutePaths();
  const results = await auditSite(baseUrl, paths);
  return NextResponse.json({ ok: true, baseUrl, results });
}
