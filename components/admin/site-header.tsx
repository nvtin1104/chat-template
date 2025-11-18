"use client"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { useMemo } from "react"

const titleMap: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/posts": "Bài viết",
  "/admin/posts/new": "Tạo bài viết",
  "/admin/settings": "Cài đặt",
  "/admin/users": "Người dùng",
}

function getTitle(pathname: string) {
  const exactMatch = titleMap[pathname]
  if (exactMatch) return exactMatch

  const partial = Object.entries(titleMap).find(([key]) =>
    key !== "/admin" && pathname.startsWith(key)
  )
  return partial ? partial[1] : "Documents"
}

export function SiteHeader() {
  const pathname = usePathname()
  const title = useMemo(() => getTitle(pathname), [pathname])

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="text-base font-medium truncate">{title}</h1>
      </div>
    </header>
  )
}
