"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import type { User } from "@/lib/db"

interface ViewUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
}

export function ViewUserModal({ open, onOpenChange, user }: ViewUserModalProps) {
  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Thông tin người dùng</DialogTitle>
          <DialogDescription>Xem chi tiết thông tin của người dùng</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted-foreground">Tên hiển thị</label>
            <p className="text-sm">{user.name || "Không có tên"}</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <p className="text-sm">{user.email}</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted-foreground">Vai trò</label>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium w-fit ${
                user.role === "admin" || user.role === "superadmin"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
              }`}
            >
              {user.role === "admin"
                ? "Quản trị viên"
                : user.role === "superadmin"
                ? "Superadmin"
                : "Người dùng"}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted-foreground">Ngày tham gia</label>
            <p className="text-sm">
              {format(new Date(user.createdAt), "dd MMMM yyyy 'lúc' HH:mm", { locale: vi })}
            </p>
          </div>

          {user.updatedAt && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Cập nhật lần cuối</label>
              <p className="text-sm">
                {format(new Date(user.updatedAt), "dd MMMM yyyy 'lúc' HH:mm", { locale: vi })}
              </p>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Đóng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

