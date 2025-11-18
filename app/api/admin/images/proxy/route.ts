import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const url = searchParams.get("url")

    if (!url) {
      return NextResponse.json({ error: "Thiếu tham số url" }, { status: 400 })
    }

    if (!url.includes("supabase.co/storage")) {
      return NextResponse.json({ error: "URL không hợp lệ" }, { status: 400 })
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: "Không thể tải ảnh" },
        { status: response.status }
      )
    }

    const imageBuffer = await response.arrayBuffer()
    const contentType = response.headers.get("content-type") || "image/png"

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
      },
    })
  } catch (error: any) {
    console.error("Error proxying image:", error)
    return NextResponse.json(
      { error: "Không thể proxy ảnh" },
      { status: 500 }
    )
  }
}

