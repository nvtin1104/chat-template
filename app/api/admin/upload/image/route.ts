import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth-supabase"
import { createSupabaseAdminClient } from "@/lib/supabase"

function sanitizeFolder(folder?: string | null) {
  if (!folder) return "posts"
  return folder.replace(/^\/*/, "").replace(/\/*$/, "").replace(/\.\./g, "") || "posts"
}

export async function POST(request: Request) {
  try {
    await requireAdmin()

    const formData = await request.formData()
    const file = formData.get("file") as File
    const bucket = (formData.get("bucket") as string) || "images"
    const folder = sanitizeFolder(formData.get("folder") as string | null)

    if (!file) {
      return NextResponse.json({ error: "Không có file được tải lên" }, { status: 400 })
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File phải là ảnh" }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Kích thước file không được vượt quá 5MB" }, { status: 400 })
    }

    const supabase = createSupabaseAdminClient()

    const fileExt = file.name.split(".").pop()
    const fileName = `${Math.random().toString(36).substring(7)}-${Date.now()}.${fileExt}`
    const filePath = folder ? `${folder}/${fileName}` : fileName

    const arrayBuffer = await file.arrayBuffer()

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error("Supabase upload error:", uploadError)
      
      if (uploadError.message?.includes("row-level security policy") || uploadError.message?.includes("RLS")) {
        return NextResponse.json(
          { 
            error: "Lỗi RLS policy. Vui lòng chạy SQL script trong supabase/migrations/002_storage_policies.sql trong Supabase SQL Editor" 
          },
          { status: 500 }
        )
      }
      
      return NextResponse.json({ error: uploadError.message || "Không thể tải ảnh lên" }, { status: 500 })
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(filePath)

    return NextResponse.json({ url: publicUrl })
  } catch (error: any) {
    console.error("Error uploading image:", error)
    const message = error?.message || "Không thể tải ảnh lên"
    const status = message === "Unauthorized" || message === "Forbidden" ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }
}

