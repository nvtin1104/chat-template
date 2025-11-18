"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export interface NewAdminFormState {
  name: string
  email: string
  password: string
}

export function CreateAdminModal({
  open,
  onOpenChange,
  onCreate,
  loading,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  onCreate: (data: NewAdminFormState) => void
  loading: boolean
}) {
  const [form, setForm] = useState<NewAdminFormState>({
    name: "",
    email: "",
    password: "",
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    onCreate(form)
  }

  const closeModal = () => {
    onOpenChange(false)
    setForm({ name: "", email: "", password: "" })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tạo quản trị viên mới</DialogTitle>
          <DialogDescription>Nhập thông tin để tạo tài khoản quản trị viên mới</DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">Tên hiển thị</label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="VD: Nguyễn Admin"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">Email</label>
            <Input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="admin@example.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">Mật khẩu tạm thời</label>
            <Input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" type="button" onClick={closeModal}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang tạo..." : "Tạo admin"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
