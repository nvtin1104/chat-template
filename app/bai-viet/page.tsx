import PostCard from "@/components/PostCard"
import { getPublishedPosts } from "@/lib/db"

async function getPosts() {
    try {
        const posts = await getPublishedPosts()
        return posts
    } catch (error) {
        console.error("Error fetching posts:", error)
        return []
    }
}

export default async function PostsPage() {
    const posts = await getPosts()

    return (
        <main className="flex flex-col items-center justify-center pt-16">
            <div className="container py-12 px-4 ">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold tracking-tight">Tất cả bài viết</h1>
                    <p className="text-muted-foreground mt-2">
                        Khám phá các bài viết về AI và công nghệ
                    </p>
                </div>

                {posts.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post: any) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Chưa có bài viết nào. Hãy quay lại sau!</p>
                    </div>
                )}
            </div>
        </main>
    )
}

