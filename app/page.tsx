import Banner from "@/components/Banner"
import SlideShow from "@/components/SlideShow"
import FeaturesSection from "@/components/FeaturesSection"
import ReasonsSection from "@/components/ReasonsSection"
import { PostsSection } from "@/components/PostsSection"
import { getPublishedPosts } from "@/lib/db"

async function getPosts() {
  try {
    const posts = await getPublishedPosts(6)
    return posts
  } catch (error) {
    console.error("[getPosts] Error fetching posts:", error)
    return []
  }
}

export default async function Home() {
  const posts = await getPosts()

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <SlideShow />
      <Banner />
      <FeaturesSection />
      <ReasonsSection />
      <PostsSection posts={posts} />
    </main>
  )
}
