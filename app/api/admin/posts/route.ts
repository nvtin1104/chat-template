import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth-supabase"
import { getPublishedPosts, createPost, countPosts, countPublishedPosts } from "@/lib/db"

export async function GET() {
    try {
        console.log('[API /api/posts] GET request received')

        const totalPosts = await countPosts()
        const publishedPostsCount = await countPublishedPosts()
        console.log('[API /api/posts] Total posts in DB:', totalPosts)
        console.log('[API /api/posts] Published posts:', publishedPostsCount)

        const posts = await getPublishedPosts()

        console.log('[API /api/posts] Returning posts:', posts.length)
        console.log('[API /api/posts] Post titles:', posts.map(p => p.title))

        return NextResponse.json(posts)
    } catch (error) {
        console.error("[API /api/posts] Error fetching posts:", error)
        return NextResponse.json(
            { error: "Failed to fetch posts" },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const user = await requireAdmin()

        const body = await request.json()
        const { title, slug, content, excerpt, coverImage, published } = body

        if (!title || !slug || !content) {
            return NextResponse.json(
                { error: "Title, slug, and content are required" },
                { status: 400 }
            )
        }

        const post = await createPost({
            title,
            slug,
            content,
            excerpt,
            coverImage,
            published: published ?? false,
            authorId: user.id,
        })

        if (!post) {
            return NextResponse.json(
                { error: "Failed to create post" },
                { status: 500 }
            )
        }

        return NextResponse.json(post)
    } catch (error) {
        console.error("Error creating post:", error)
        return NextResponse.json(
            { error: "Failed to create post" },
            { status: 500 }
        )
    }
}

