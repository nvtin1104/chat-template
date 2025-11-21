"use client"

import { useState } from "react"
import { useSiteInfo } from "@/components/providers/SiteInfoProvider"
import { Facebook, Instagram, Linkedin, Twitter, Youtube, Music2, Mail, Phone, MapPin, Send } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/toast"
import { Spinner } from "@/components/ui/spinner"
import type { ElementType } from "react"

type SocialKey = "facebook" | "instagram" | "twitter" | "linkedin" | "youtube" | "tiktok"

const socialConfigs: Array<{ key: SocialKey; label: string; icon: ElementType }> = [
    { key: "facebook", label: "Facebook", icon: Facebook },
    { key: "instagram", label: "Instagram", icon: Instagram },
    { key: "twitter", label: "Twitter", icon: Twitter },
    { key: "linkedin", label: "LinkedIn", icon: Linkedin },
    { key: "youtube", label: "YouTube", icon: Youtube },
    { key: "tiktok", label: "TikTok", icon: Music2 },
]

export default function ContactPage() {
    const siteInfo = useSiteInfo()
    const socials = socialConfigs.filter(({ key }) => siteInfo[key])
    const { showToast } = useToast()
    const [submitting, setSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        try {
            const response = await fetch("/api/public/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (response.ok) {
                showToast("success", data.message || "Gửi liên hệ thành công!")
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    subject: "",
                    message: "",
                })
            } else {
                showToast("error", data.error || "Không thể gửi liên hệ. Vui lòng thử lại.")
            }
        } catch (error) {
            console.error("Error submitting contact:", error)
            showToast("error", "Có lỗi xảy ra khi gửi liên hệ")
        } finally {
            setSubmitting(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }

    return (
        <div className="pt-16 pb-12">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12 pt-8">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                        Liên hệ với chúng tôi
                    </h1>
                    <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
                        {siteInfo.description || "Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với chúng tôi qua các phương thức dưới đây."}
                    </p>
                </div>

                <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-2">
                    {/* Contact Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Gửi tin nhắn cho chúng tôi</CardTitle>
                            <CardDescription>
                                Điền thông tin vào form bên dưới và chúng tôi sẽ phản hồi sớm nhất có thể.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        Họ và tên <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Nhập họ và tên của bạn"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">
                                        Email <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="your.email@example.com"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Số điện thoại</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="0123456789"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="subject">
                                        Tiêu đề <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="subject"
                                        name="subject"
                                        type="text"
                                        required
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="Tiêu đề tin nhắn"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message">
                                        Nội dung <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        required
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Nhập nội dung tin nhắn của bạn..."
                                        rows={6}
                                    />
                                </div>

                                <Button type="submit" disabled={submitting} className="w-full">
                                    {submitting ? (
                                        <>
                                            <Spinner className="mr-2 h-4 w-4" />
                                            Đang gửi...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="mr-2 h-4 w-4" />
                                            Gửi tin nhắn
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Contact Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin liên hệ</CardTitle>
                            <CardDescription>
                                Bạn cũng có thể liên hệ với chúng tôi qua các phương thức sau:
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-4">
                                    {siteInfo.address && (
                                        <div className="flex items-start gap-3">
                                            <MapPin className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-medium text-slate-900 mb-1">Địa chỉ</p>
                                                <p className="text-sm text-slate-600">{siteInfo.address}</p>
                                            </div>
                                        </div>
                                    )}

                                    {siteInfo.phone && (
                                        <div className="flex items-start gap-3">
                                            <Phone className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-medium text-slate-900 mb-1">Số điện thoại</p>
                                                <a
                                                    href={`tel:${siteInfo.phone}`}
                                                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                                                >
                                                    {siteInfo.phone}
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {siteInfo.email && (
                                        <div className="flex items-start gap-3">
                                            <Mail className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-medium text-slate-900 mb-1">Email</p>
                                                <a
                                                    href={`mailto:${siteInfo.email}`}
                                                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                                                >
                                                    {siteInfo.email}
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {siteInfo.contact && (
                                        <div className="flex items-start gap-3">
                                            <Phone className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-medium text-slate-900 mb-1">Liên hệ</p>
                                                <p className="text-sm text-slate-600">{siteInfo.contact}</p>
                                            </div>
                                        </div>
                                    )}
                            </div>

                            {socials.length > 0 && (
                                <div className="pt-4 border-t">
                                    <p className="text-sm font-medium text-slate-900 mb-3">Theo dõi chúng tôi</p>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        {socials.map(({ key, label, icon: Icon }) => (
                                            <a
                                                key={key}
                                                href={siteInfo[key as SocialKey] as string}
                                                target="_blank"
                                                rel="noreferrer"
                                                aria-label={label}
                                                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-600 transition-colors bg-white"
                                            >
                                                <Icon className="h-4 w-4" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
