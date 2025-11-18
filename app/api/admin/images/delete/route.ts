import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth-supabase"
import { createSupabaseAdminClient } from "@/lib/supabase"

export async function DELETE(request: Request) {
  try {
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const bucket = searchParams.get("bucket") ?? "images"
    const path = searchParams.get("path")

    if (!path) {
      return NextResponse.json(
        { error: "Path is required" },
        { status: 400 }
      )
    }

    const supabase = createSupabaseAdminClient()
    const { error } = await supabase.storage.from(bucket).remove([path])

    if (error) {
      console.error("Error deleting image:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting image:", error)
    const message = error?.message || "Failed to delete image"
    const status = message === "Unauthorized" || message === "Forbidden" ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
