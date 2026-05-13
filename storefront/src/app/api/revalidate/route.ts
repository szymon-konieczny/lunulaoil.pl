import { revalidatePath, revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

const ALL_CONTENT_TAGS = [
  "products",
  "categories",
  "collections",
  "regions",
  "variants",
]

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-revalidate-secret")
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: { tags?: string[]; all?: boolean } = {}
  try {
    body = await req.json()
  } catch {
    // empty body is allowed → treated as "all"
  }

  const tags =
    body.all === true || !body.tags || body.tags.length === 0
      ? ALL_CONTENT_TAGS
      : body.tags

  for (const tag of tags) {
    revalidateTag(tag)
  }

  // Also nuke router cache for every page so server components re-run on next visit
  revalidatePath("/", "layout")

  return NextResponse.json({ revalidated: true, tags })
}
