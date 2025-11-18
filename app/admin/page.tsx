"use client"

import Link from "next/link"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users, Settings, Images, ImagePlus } from "lucide-react"

export default function AdminPage() {
    return (
        <main className="container py-12 px-4">
            <div className="mb-8">
                <h1 className="text-4xl font-bold tracking-tight">Quản lý</h1>
                <p className="text-muted-foreground mt-2">
                    Quản lý nội dung và cài đặt trang web
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Link href="/admin/posts">
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                            <FileText className="h-8 w-8 mb-2 text-primary" />
                            <CardTitle>Quản lý bài viết</CardTitle>
                            <CardDescription>
                                Tạo, chỉnh sửa và xóa bài viết
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </Link>

                <Link href="/admin/users">
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                            <Users className="h-8 w-8 mb-2 text-primary" />
                            <CardTitle>Quản lý người dùng</CardTitle>
                            <CardDescription>
                                Xem và quản lý tài khoản người dùng
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </Link>

                <Link href="/admin/slides">
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                            <Images className="h-8 w-8 mb-2 text-primary" />
                            <CardTitle>Quản lý Slides</CardTitle>
                            <CardDescription>
                                Quản lý slides hiển thị trên trang chủ
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </Link>

                <Link href="/admin/media">
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                            <ImagePlus className="h-8 w-8 mb-2 text-primary" />
                            <CardTitle>Thư viện ảnh</CardTitle>
                            <CardDescription>
                                Quản lý ảnh trên Supabase Storage
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </Link>

                <Link href="/admin/settings">
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                            <Settings className="h-8 w-8 mb-2 text-primary" />
                            <CardTitle>Cài đặt trang web</CardTitle>
                            <CardDescription>
                                Cấu hình thông tin và cài đặt trang web
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </Link>
            </div>
        </main>
    )
}

