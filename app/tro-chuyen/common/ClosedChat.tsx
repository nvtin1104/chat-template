"use client"
import Link from "next/link"
import { Ban, MessageSquare } from "lucide-react"
export default function ClosedChat() {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className=" rounded-xl text-center space-y-4">
                <div className="flex justify-center">
                    <Ban className="w-12 h-12 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">
                    Chat đã tạm thời đóng
                </h1>
                <p className="text-gray-600">
                    Rất tiếc, hiện tại hệ thống chat không khả dụng.
                    Vui lòng quay lại sau hoặc liên hệ trực tiếp với chúng tôi.
                </p>
                <div className="pt-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90"
                    >
                        <MessageSquare className="w-5 h-5" />
                        Quay về Trang chủ
                    </Link>
                </div>
            </div>
        </div>
    )
}
