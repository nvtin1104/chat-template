import { getPublishedPosts as getPublishedPostsFromDb } from "@/lib/db"

export async function getPublishedPosts(limit?: number) {
    return getPublishedPostsFromDb(limit)
}

