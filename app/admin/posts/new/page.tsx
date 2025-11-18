"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CKEditorComponent } from "@/components/editor/ckeditor"
import { ImageUpload } from "@/components/editor/image-upload"
import { useToast } from "@/components/ui/toast"

export default function NewPostPage() {
    const router = useRouter()
    const { showToast } = useToast()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        coverImage: "",
        published: false,
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch("/api/admin/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                showToast("success", "Đã tạo bài viết thành công")
                router.push("/admin/posts")
            } else {
                const error = await response.json()
                showToast("error", error.error || "Có lỗi xảy ra khi tạo bài viết")
            }
        } catch (error: any) {
            console.error("Error creating post:", error)
            showToast("error", error.message || "Có lỗi xảy ra khi tạo bài viết")
        } finally {
            setLoading(false)
        }
    }

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")
    }

    return (
        <main className=" py-12 px-4">
            <Card>
                <CardHeader>
                    <CardTitle>Tạo bài viết mới</CardTitle>
                    <CardDescription>
                        Điền thông tin để tạo bài viết mới
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="title" className="text-sm font-medium">
                                Tiêu đề *
                            </label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        title: e.target.value,
                                        slug: generateSlug(e.target.value),
                                    })
                                }}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="slug" className="text-sm font-medium">
                                Slug *
                            </label>
                            <Input
                                id="slug"
                                value={formData.slug}
                                onChange={(e) =>
                                    setFormData({ ...formData, slug: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="excerpt" className="text-sm font-medium">
                                Mô tả ngắn
                            </label>
                            <Textarea
                                id="excerpt"
                                value={formData.excerpt}
                                onChange={(e) =>
                                    setFormData({ ...formData, excerpt: e.target.value })
                                }
                                rows={3}
                            />
                        </div>

                        <ImageUpload
                            value={formData.coverImage}
                            onChange={(url) => setFormData({ ...formData, coverImage: url })}
                            label="Ảnh bìa"
                            bucket="images"
                            folder="posts"
                            enableLibrary
                        />

                        <div className="space-y-2">
                            <label htmlFor="content" className="text-sm font-medium">
                                Nội dung *
                            </label>
                            <CKEditorComponent
                                value={formData.content}
                                onChange={(data) => setFormData({ ...formData, content: data })}
                                placeholder="Nhập nội dung bài viết..."
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="published"
                                checked={formData.published}
                                onChange={(e) =>
                                    setFormData({ ...formData, published: e.target.checked })
                                }
                                className="h-4 w-4"
                            />
                            <label htmlFor="published" className="text-sm font-medium">
                                Xuất bản ngay
                            </label>
                        </div>

                        <div className="flex gap-4">
                            <Button type="submit" disabled={loading}>
                                {loading ? "Đang tạo..." : "Tạo bài viết"}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                            >
                                Hủy
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </main>
    )
}

