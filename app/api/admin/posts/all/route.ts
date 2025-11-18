import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth-supabase"
import { getAllPosts } from "@/lib/db"

export async function GET() {
    try {
        await requireAdmin()

        const posts = await getAllPosts()

        return NextResponse.json(posts)
    } catch (error) {
        console.error("Error fetching posts:", error)
        return NextResponse.json(
            { error: "Failed to fetch posts" },
            { status: 500 }
        )
    }
}

