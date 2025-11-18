"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-primary">404</p>
        <h1 className="text-3xl font-bold">Trang bạn tìm không tồn tại</h1>
        <p className="text-muted-foreground">
          Có thể liên kết bị lỗi hoặc trang đã được di chuyển. Hãy quay lại trang chủ hoặc thử lại sau.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/">Về trang chủ</Link>
        </Button>
      </div>
    </div>
  )
}

