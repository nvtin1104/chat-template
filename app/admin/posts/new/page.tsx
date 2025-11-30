"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CKEditorComponent } from "@/components/editor/ckeditor"
import { ImageUpload } from "@/components/editor/image-upload"
import { useToast } from "@/components/ui/toast"

// Slug validation: chỉ chứa chữ thường, số, dấu gạch ngang, không bắt đầu/kết thúc bằng dấu gạch ngang
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

// Schema validation với zod
const postSchema = z.object({
    title: z.string().min(1, "Tiêu đề không được để trống").max(200, "Tiêu đề không được vượt quá 200 ký tự"),
    slug: z.string()
        .min(1, "Slug không được để trống")
        .max(200, "Slug không được vượt quá 200 ký tự")
        .regex(slugRegex, "Slug chỉ được chứa chữ thường, số và dấu gạch ngang. Không được bắt đầu hoặc kết thúc bằng dấu gạch ngang"),
    content: z.string().min(1, "Nội dung không được để trống"),
    excerpt: z.string().max(500, "Mô tả ngắn không được vượt quá 500 ký tự").optional().or(z.literal("")),
    coverImage: z.string().optional().or(z.literal("")),
    published: z.boolean(),
})

type PostFormData = z.infer<typeof postSchema>

export default function NewPostPage() {
    const router = useRouter()
    const { showToast } = useToast()
    
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<PostFormData>({
        resolver: zodResolver(postSchema),
        defaultValues: {
            title: "",
            slug: "",
            content: "",
            excerpt: "",
            coverImage: "",
            published: false,
        },
        mode: "onChange", // Validate on change for better UX
    })

    const watchedTitle = watch("title")
    const watchedSlug = watch("slug")
    const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false)

    // Tự động generate slug từ title
    const generateSlug = (title: string): string => {
        return title
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
            .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with dash
            .replace(/(^-|-$)/g, "") // Remove leading/trailing dashes
            .substring(0, 200) // Limit length
    }

    // Auto-generate slug khi title thay đổi (chỉ khi chưa chỉnh sửa thủ công)
    useEffect(() => {
        if (watchedTitle && !isSlugManuallyEdited) {
            const generatedSlug = generateSlug(watchedTitle)
            setValue("slug", generatedSlug, { shouldValidate: true })
        }
    }, [watchedTitle, isSlugManuallyEdited, setValue])

    const onSubmit = async (data: PostFormData) => {
        try {
            const response = await fetch("/api/admin/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            if (response.ok) {
                showToast("success", "Đã tạo bài viết thành công")
                router.push("/admin/posts")
            } else {
                const errorData = await response.json()
                const errorMessage = errorData.error || "Có lỗi xảy ra khi tạo bài viết"
                
                // Nếu là lỗi trùng slug, set error cho slug field
                if (response.status === 409 && errorMessage.includes("Slug")) {
                    setValue("slug", "", { shouldValidate: true })
                    // Trigger validation để hiển thị error
                    setTimeout(() => {
                        setValue("slug", data.slug, { shouldValidate: true })
                    }, 100)
                }
                
                showToast("error", errorMessage)
            }
        } catch (error: any) {
            console.error("Error creating post:", error)
            showToast("error", error.message || "Có lỗi xảy ra khi tạo bài viết")
        }
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
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">
                                Tiêu đề *
                            </Label>
                            <Input
                                id="title"
                                {...register("title")}
                                placeholder="Nhập tiêu đề bài viết..."
                            />
                            {errors.title && (
                                <p className="text-sm text-red-500">{errors.title.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="slug">
                                    Slug *
                                </Label>
                                {isSlugManuallyEdited && watchedTitle && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            const generatedSlug = generateSlug(watchedTitle)
                                            setValue("slug", generatedSlug, { shouldValidate: true })
                                            setIsSlugManuallyEdited(false)
                                        }}
                                        className="h-7 text-xs"
                                    >
                                        Tự động tạo từ tiêu đề
                                    </Button>
                                )}
                            </div>
                            <Input
                                id="slug"
                                {...register("slug", {
                                    onChange: (e) => {
                                        // Mark as manually edited
                                        setIsSlugManuallyEdited(true)
                                        // Normalize slug khi user nhập thủ công
                                        const value = e.target.value
                                        const normalized = value
                                            .toLowerCase()
                                            .normalize("NFD")
                                            .replace(/[\u0300-\u036f]/g, "")
                                            .replace(/[^a-z0-9-]/g, "-")
                                            .replace(/-+/g, "-")
                                            .replace(/(^-|-$)/g, "")
                                        setValue("slug", normalized, { shouldValidate: true })
                                    }
                                })}
                                placeholder="bai-viet-moi"
                            />
                            {errors.slug && (
                                <p className="text-sm text-red-500">{errors.slug.message}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Slug sẽ được tự động tạo từ tiêu đề. Chỉ chứa chữ thường, số và dấu gạch ngang. Không được bắt đầu hoặc kết thúc bằng dấu gạch ngang.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="excerpt">
                                Mô tả ngắn
                            </Label>
                            <Textarea
                                id="excerpt"
                                {...register("excerpt")}
                                rows={3}
                                placeholder="Nhập mô tả ngắn về bài viết..."
                            />
                            {errors.excerpt && (
                                <p className="text-sm text-red-500">{errors.excerpt.message}</p>
                            )}
                        </div>

                        <Controller
                            name="coverImage"
                            control={control}
                            render={({ field }) => (
                                <ImageUpload
                                    value={field.value || ""}
                                    onChange={field.onChange}
                                    label="Ảnh bìa"
                                    bucket="images"
                                    folder="posts"
                                    enableLibrary
                                />
                            )}
                        />

                        <div className="space-y-2">
                            <Label htmlFor="content">
                                Nội dung *
                            </Label>
                            <Controller
                                name="content"
                                control={control}
                                render={({ field }) => (
                                    <CKEditorComponent
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder="Nhập nội dung bài viết..."
                                    />
                                )}
                            />
                            {errors.content && (
                                <p className="text-sm text-red-500">{errors.content.message}</p>
                            )}
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="published"
                                {...register("published")}
                                className="h-4 w-4"
                            />
                            <Label htmlFor="published" className="cursor-pointer">
                                Xuất bản ngay
                            </Label>
                        </div>

                        <div className="flex gap-4">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Đang tạo..." : "Tạo bài viết"}
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

