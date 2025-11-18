"use client"

import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"

interface UserListHeaderProps {
    onSearch: (term: string) => void
    totalUsers: number
}

export function UserListHeader({ onSearch, totalUsers }: UserListHeaderProps) {
    return (
        <div className="mb-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Quản lý người dùng</h1>
                <p className="text-sm text-muted-foreground mt-2">
                    Tổng cộng {totalUsers} người dùng
                </p>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                    placeholder="Tìm kiếm theo tên hoặc email..."
                    className="pl-10"
                    onChange={(e) => onSearch(e.target.value)}
                />
            </div>
        </div>
    )
}
