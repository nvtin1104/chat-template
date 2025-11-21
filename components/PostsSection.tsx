"use client"

import PostCard from "@/components/PostCard"
import { convertColorForCSS } from "@/lib/color-utils"

interface Post {
    id: string
    title: string
    slug: string
    excerpt?: string | null
    coverImage?: string | null
    publishedAt?: Date | null
    author?: {
        name?: string | null
    }
}

export function PostsSection({ posts }: { posts: Post[] }) {
    return (
        <section 
            className="w-full py-8 px-4"
            style={{
                background: `linear-gradient(to bottom, ${convertColorForCSS("var(--home-gradient-from)")}, ${convertColorForCSS("var(--home-gradient-to)")})`,
            }}
        >
            <div className="container mx-auto space-y-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight" style={{ color: "var(--home-text)" }}>
                        Bài viết mới nhất
                    </h2>
                    <p className="text-muted-foreground mt-2" style={{ color: "var(--home-text)" }}>
                        Khám phá các bài viết về AI và công nghệ
                    </p>
                </div>

                {posts.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground" style={{ color: "var(--home-text)" }}>
                            Chưa có bài viết nào. Hãy quay lại sau!
                        </p>
                    </div>
                )}

                {posts.length > 0 && (
                    <div className="mt-8 text-center">
                        <a
                            href="/bai-viet"
                            className="text-primary hover:underline font-medium"
                            style={{ color: "var(--home-text)" }}
                        >
                            Xem tất cả bài viết →
                        </a>
                    </div>
                )}
            </div>
        </section>
    )
}

