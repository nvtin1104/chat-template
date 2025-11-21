"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { useToast } from "@/components/ui/toast"
import { Spinner } from "@/components/ui/spinner"
import { Skeleton } from "@/components/ui/skeleton"
import { Mail, Phone, User, MessageSquare, Trash2, Eye, EyeOff, Calendar, RefreshCw } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface Contact {
    id: string
    name: string
    email: string
    phone?: string | null
    subject: string
    message: string
    read: boolean
    createdAt: Date
    updatedAt: Date
}

export default function AdminContactsPage() {
    const [contacts, setContacts] = useState<Contact[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
    const [viewingContact, setViewingContact] = useState<Contact | null>(null)
    const [filter, setFilter] = useState<"all" | "unread">("all")
    const { showToast } = useToast()

    useEffect(() => {
        fetchContacts()
    }, [])

    const fetchContacts = async (showRefreshing = false) => {
        if (showRefreshing) {
            setRefreshing(true)
        } else {
            setLoading(true)
        }
        try {
            const response = await fetch("/api/admin/contacts")
            if (response.ok) {
                const data = await response.json()
                setContacts(data)
                if (showRefreshing) {
                    showToast("success", "Đã làm mới danh sách liên hệ")
                }
            } else {
                showToast("error", "Không thể tải danh sách liên hệ")
            }
        } catch (error) {
            console.error("Error fetching contacts:", error)
            showToast("error", "Không thể tải danh sách liên hệ")
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    const handleRefresh = () => {
        fetchContacts(true)
    }

    const handleMarkAsRead = async (id: string, read: boolean) => {
        try {
            const response = await fetch("/api/admin/contacts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, read }),
            })

            if (response.ok) {
                setContacts((prev) =>
                    prev.map((contact) =>
                        contact.id === id ? { ...contact, read } : contact
                    )
                )
                showToast("success", read ? "Đã đánh dấu đã đọc" : "Đã đánh dấu chưa đọc")
            } else {
                showToast("error", "Không thể cập nhật trạng thái")
            }
        } catch (error) {
            console.error("Error updating contact:", error)
            showToast("error", "Có lỗi xảy ra khi cập nhật")
        }
    }

    const handleDelete = async (id: string) => {
        setDeletingId(id)
        try {
            const response = await fetch(`/api/admin/contacts/${id}`, {
                method: "DELETE",
            })

            if (response.ok) {
                setContacts(contacts.filter((contact) => contact.id !== id))
                showToast("success", "Đã xóa liên hệ thành công")
            } else {
                const error = await response.json()
                showToast("error", error.error || "Không thể xóa liên hệ")
            }
        } catch (error) {
            console.error("Error deleting contact:", error)
            showToast("error", "Có lỗi xảy ra khi xóa liên hệ")
        } finally {
            setDeletingId(null)
            setConfirmDeleteId(null)
        }
    }

    const filteredContacts =
        filter === "unread" ? contacts.filter((c) => !c.read) : contacts

    const unreadCount = contacts.filter((c) => !c.read).length

    const ContactSkeletonCard = () => (
        <Card className="animate-pulse">
            <CardHeader>
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-5 w-12 rounded-full" />
                    </div>
                    <div className="flex items-center gap-4 flex-wrap">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-4 w-36" />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-24 w-full rounded-md" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-9 w-32" />
                        <Skeleton className="h-9 w-36" />
                        <Skeleton className="h-9 w-24" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )

    if (loading) {
        return (
            <main className="p-4">
                <div className="mb-8">
                    <Skeleton className="h-10 w-64 mb-2" />
                    <Skeleton className="h-5 w-96" />
                </div>
                <div className="mb-6 flex gap-2">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <ContactSkeletonCard key={i} />
                    ))}
                </div>
            </main>
        )
    }

    return (
        <main className="p-4">
            <div className="mb-8 flex items-start justify-between">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
                        <Mail className="h-8 w-8" />
                        Quản lý liên hệ
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Quản lý các tin nhắn liên hệ từ người dùng
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={handleRefresh}
                    disabled={refreshing || loading}
                >
                    <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                    {refreshing ? "Đang làm mới..." : "Làm mới"}
                </Button>
            </div>

            <div className="mb-6 flex gap-2">
                <Button
                    variant={filter === "all" ? "default" : "outline"}
                    onClick={() => setFilter("all")}
                >
                    Tất cả ({contacts.length})
                </Button>
                <Button
                    variant={filter === "unread" ? "default" : "outline"}
                    onClick={() => setFilter("unread")}
                >
                    Chưa đọc ({unreadCount})
                </Button>
            </div>

            {filteredContacts.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">
                            {filter === "unread"
                                ? "Không có liên hệ chưa đọc"
                                : "Chưa có liên hệ nào"}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {filteredContacts.map((contact) => (
                        <Card
                            key={contact.id}
                            className={!contact.read ? "border-primary" : ""}
                        >
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CardTitle className="text-lg">{contact.subject}</CardTitle>
                                            {!contact.read && (
                                                <Badge variant="default">Mới</Badge>
                                            )}
                                        </div>
                                        <CardDescription className="flex items-center gap-4 flex-wrap">
                                            <span className="flex items-center gap-1">
                                                <User className="h-4 w-4" />
                                                {contact.name}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Mail className="h-4 w-4" />
                                                {contact.email}
                                            </span>
                                            {contact.phone && (
                                                <span className="flex items-center gap-1">
                                                    <Phone className="h-4 w-4" />
                                                    {contact.phone}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                {format(new Date(contact.createdAt), "dd/MM/yyyy HH:mm", {
                                                    locale: vi,
                                                })}
                                            </span>
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            Nội dung tin nhắn:
                                        </p>
                                        <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded-md">
                                            {contact.message}
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setViewingContact(contact)}
                                        >
                                            <Eye className="h-4 w-4 mr-2" />
                                            Xem chi tiết
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                handleMarkAsRead(contact.id, !contact.read)
                                            }
                                            disabled={deletingId === contact.id}
                                        >
                                            {contact.read ? (
                                                <>
                                                    <EyeOff className="h-4 w-4 mr-2" />
                                                    Đánh dấu chưa đọc
                                                </>
                                            ) : (
                                                <>
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    Đánh dấu đã đọc
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => setConfirmDeleteId(contact.id)}
                                            disabled={deletingId === contact.id}
                                        >
                                            {deletingId === contact.id ? (
                                                <Spinner className="h-4 w-4" />
                                            ) : (
                                                <>
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Xóa
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* View Contact Dialog */}
            <Dialog
                open={!!viewingContact}
                onOpenChange={(open) => !open && setViewingContact(null)}
            >
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{viewingContact?.subject}</DialogTitle>
                        <DialogDescription>
                            Chi tiết tin nhắn liên hệ
                        </DialogDescription>
                    </DialogHeader>
                    {viewingContact && (
                        <div className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <p className="text-sm font-medium mb-1">Họ và tên</p>
                                    <p className="text-sm text-muted-foreground">
                                        {viewingContact.name}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium mb-1">Email</p>
                                    <p className="text-sm text-muted-foreground">
                                        {viewingContact.email}
                                    </p>
                                </div>
                                {viewingContact.phone && (
                                    <div>
                                        <p className="text-sm font-medium mb-1">Số điện thoại</p>
                                        <p className="text-sm text-muted-foreground">
                                            {viewingContact.phone}
                                        </p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm font-medium mb-1">Ngày gửi</p>
                                    <p className="text-sm text-muted-foreground">
                                        {format(
                                            new Date(viewingContact.createdAt),
                                            "dd/MM/yyyy HH:mm",
                                            { locale: vi }
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-medium mb-1">Nội dung</p>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted p-3 rounded-md">
                                    {viewingContact.message}
                                </p>
                            </div>
                            <div className="flex gap-2 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        handleMarkAsRead(viewingContact.id, !viewingContact.read)
                                    }
                                >
                                    {viewingContact.read ? (
                                        <>
                                            <EyeOff className="h-4 w-4 mr-2" />
                                            Đánh dấu chưa đọc
                                        </>
                                    ) : (
                                        <>
                                            <Eye className="h-4 w-4 mr-2" />
                                            Đánh dấu đã đọc
                                        </>
                                    )}
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => {
                                        setConfirmDeleteId(viewingContact.id)
                                        setViewingContact(null)
                                    }}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Xóa
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                open={!!confirmDeleteId}
                onOpenChange={(open) => !open && setConfirmDeleteId(null)}
                title="Xác nhận xóa liên hệ"
                description="Bạn có chắc muốn xóa liên hệ này? Hành động này không thể hoàn tác."
                confirmText="Xóa"
                cancelText="Hủy"
                destructive={true}
                onConfirm={() => confirmDeleteId && handleDelete(confirmDeleteId)}
                loading={!!deletingId}
            />
        </main>
    )
}

