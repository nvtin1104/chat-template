import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth-supabase"
import { createSupabaseAdminClient } from "@/lib/supabase"

function sanitizePrefix(prefix?: string | null) {
  if (!prefix) return ""
  return prefix.replace(/^\/*/, "").replace(/\/*$/, "").replace(/\.\./g, "")
}

export async function GET(request: Request) {
  try {
    await requireAdmin()

    const supabase = createSupabaseAdminClient()
    const { searchParams } = new URL(request.url)
    const bucket = searchParams.get("bucket") ?? "images"
    const prefix = sanitizePrefix(searchParams.get("prefix")) || "posts"
    const limit = Math.min(Number(searchParams.get("limit") ?? "60"), 200)

    const { data, error } = await supabase.storage
      .from(bucket)
      .list(prefix, {
        limit: Number.isNaN(limit) ? 60 : limit,
        sortBy: { column: "created_at", order: "desc" },
      })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const files = (data ?? [])
      .filter((item) => item.name)
      .map((item) => {
        const path = prefix ? `${prefix}/${item.name}` : item.name
        const {
          data: { publicUrl },
        } = supabase.storage.from(bucket).getPublicUrl(path)

        return {
          name: item.name,
          path,
          size: item.metadata?.size ?? 0,
          updatedAt: item.updated_at,
          createdAt: item.created_at,
          url: publicUrl,
        }
      })

    return NextResponse.json({ files })
  } catch (error: any) {
    console.error("Error fetching image library:", error)
    const message = error?.message || "Failed to fetch images"
    const status = message === "Unauthorized" || message === "Forbidden" ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }
}

