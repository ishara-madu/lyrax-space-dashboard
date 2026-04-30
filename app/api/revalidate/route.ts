import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  const tag = request.nextUrl.searchParams.get("tag") || "launches";

  try {
    // 1. Bust the data caches (MongoDB unstable_cache + fetch caches)
    // NOTE: Next.js 16 requires a second `profile` argument for revalidateTag.
    // { expire: 0 } means: expire immediately, no TTL.
    revalidateTag(tag, { expire: 0 });

    // 2. Bust the full-page HTML cache for every route that uses launch data.
    //    revalidateTag alone only clears the data layer — Vercel's Full Route
    //    Cache still serves the old rendered HTML until the path is also cleared.
    revalidatePath("/");                      // Homepage
    revalidatePath("/schedule");              // Launch schedule listing
    revalidatePath("/past-missions");         // Mission archive listing
    revalidatePath("/launch/[slug]", "page"); // ALL dynamic launch detail pages
    revalidatePath("/sitemap.xml");           // Sitemap XML

    return NextResponse.json({
      revalidated: true,
      tag,
      paths: ["/", "/schedule", "/past-missions", "/launch/[slug]", "/sitemap.xml"],
      now: Date.now(),
    });
  } catch (err) {
    return NextResponse.json({ message: "Error revalidating", error: err }, { status: 500 });
  }
}
