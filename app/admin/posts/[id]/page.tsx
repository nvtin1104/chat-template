"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CKEditorComponent } from "@/components/editor/ckeditor"
import { ImageUpload } from "@/components/editor/image-upload"
import { useToast } from "@/components/ui/toast"

export default function EditPostPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string
    // Auth is already checked in admin layout
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const { showToast } = useToast()
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        coverImage: "",
        published: false,
    })

    useEffect(() => {
        fetchPost()
    }, [id])

    const fetchPost = async () => {
        if (!id) {
            setLoading(false)
            return
        }

        try {
            const response = await fetch(`/api/admin/posts/${id}`)
            if (response.ok) {
                const post = await response.json()
                setFormData({
                    title: post.title,
                    slug: post.slug,
                    content: post.content,
                    excerpt: post.excerpt || "",
                    coverImage: post.coverImage || "",
                    published: post.published,
                })
            } else {
                const errorData = await response.json().catch(() => ({}))
                console.error("Error fetching post:", errorData.error || response.statusText)
                showToast("error", errorData.error || "Không thể tải bài viết")
            }
        } catch (error: any) {
            console.error("Error fetching post:", error)
            showToast("error", error.message || "Có lỗi xảy ra khi tải bài viết")
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const response = await fetch(`/api/admin/posts/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                const result = await response.json()
                showToast(
                    "success",
                    `Đã cập nhật bài viết thành công${result.deletedImagesCount > 0 ? ` và xóa ${result.deletedImagesCount} ảnh không sử dụng` : ""}`
                )
                router.push("/admin/posts")
            } else {
                const error = await response.json()
                showToast("error", error.error || "Có lỗi xảy ra khi cập nhật bài viết")
            }
        } catch (error: any) {
            console.error("Error updating post:", error)
            showToast("error", error.message || "Có lỗi xảy ra khi cập nhật bài viết")
        } finally {
            setSaving(false)
        }
    }

    return (
        <main className="py-12 px-4">
            <Card>
                <CardHeader>
                    <CardTitle>Chỉnh sửa bài viết</CardTitle>
                    <CardDescription>
                        Cập nhật thông tin bài viết
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {
                        !loading ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="title" className="text-sm font-medium">
                                        Tiêu đề *
                                    </label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) =>
                                            setFormData({ ...formData, title: e.target.value })
                                        }
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
                                        Đã xuất bản
                                    </label>
                                </div>

                                <div className="flex gap-4">
                                    <Button type="submit" disabled={saving}>
                                        {saving ? "Đang lưu..." : "Lưu thay đổi"}
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
                        ) : (
                            <p>Đang tải bài viết...</p>
                        )
                    }
                </CardContent>
            </Card>
        </main>
    )
}

