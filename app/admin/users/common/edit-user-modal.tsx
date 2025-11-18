"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { User } from "@/lib/db"

interface EditUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
  onUpdate: (userId: string, data: { name?: string; role?: string }) => Promise<void>
  loading?: boolean
}

export function EditUserModal({ open, onOpenChange, user, onUpdate, loading }: EditUserModalProps) {
  const [form, setForm] = useState({
    name: "",
    role: "user" as "user" | "admin" | "superadmin",
  })

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        role: (user.role as "user" | "admin" | "superadmin") || "user",
      })
    }
  }, [user])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    await onUpdate(user.id, {
      name: form.name,
      role: form.role,
    })
  }

  const closeModal = () => {
    onOpenChange(false)
    if (user) {
      setForm({
        name: user.name || "",
        role: (user.role as "user" | "admin" | "superadmin") || "user",
      })
    }
  }

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
          <DialogDescription>Cập nhật thông tin tên và vai trò của người dùng</DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">Email</label>
            <Input value={user.email} disabled className="bg-muted" />
            <p className="text-xs text-muted-foreground">Email không thể thay đổi</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">Tên hiển thị</label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="VD: Nguyễn Văn A"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">Vai trò</label>
            <select
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value as "user" | "admin" | "superadmin" })
              }
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="user">Người dùng</option>
              <option value="admin">Quản trị viên</option>
              <option value="superadmin">Superadmin</option>
            </select>
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" type="button" onClick={closeModal} disabled={loading}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

