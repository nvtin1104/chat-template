"use client"

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

export function ConfirmPopover({
  children,
  title = "Xác nhận",
  message = "Bạn chắc chắn muốn thực hiện hành động này?",
  confirmText = "Xóa",
  cancelText = "Hủy",
  destructive = false,
  onConfirm,
  open,
  onOpenChange,
  loading = false,
}: {
  children: React.ReactNode
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  destructive?: boolean
  onConfirm: () => void
  open: boolean
  onOpenChange: (v: boolean) => void
  loading?: boolean
}) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>

      <PopoverContent align="end" className="w-56">
        <h4 className="font-semibold text-sm mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground">{message}</p>

        <div className="mt-4 flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            {cancelText}
          </Button>

          <Button
            size="sm"
            variant={destructive ? "destructive" : "default"}
            disabled={loading}
            onClick={() => {
              onConfirm()
            }}
          >
            {loading ? "Đang xóa..." : confirmText}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
