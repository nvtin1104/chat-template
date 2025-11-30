"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PaginationProps {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    onPageChange: (page: number) => void
    className?: string
}

export function Pagination({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    className,
}: PaginationProps) {
    if (totalPages <= 1) return null

    const startItem = (currentPage - 1) * itemsPerPage + 1
    const endItem = Math.min(currentPage * itemsPerPage, totalItems)

    return (
        <div className={cn("flex items-center justify-between px-2 py-4", className)}>
            <div className="flex-1 text-sm text-muted-foreground">
                Hiển thị {startItem} đến {endItem} trong tổng số {totalItems} mục
            </div>
            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0"
                >
                    <span className="sr-only">Trang đầu</span>
                    <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0"
                >
                    <span className="sr-only">Trang trước</span>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center space-x-1">
                    <span className="text-sm text-muted-foreground">
                        Trang {currentPage} / {totalPages}
                    </span>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0"
                >
                    <span className="sr-only">Trang sau</span>
                    <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0"
                >
                    <span className="sr-only">Trang cuối</span>
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

