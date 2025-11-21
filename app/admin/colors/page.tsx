"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/toast"
import { Spinner } from "@/components/ui/spinner"
import { Palette, RefreshCw } from "lucide-react"
import { OklchColorPicker } from "@/components/admin/oklch-color-picker"
import { convertColorForCSS, oklchToHex } from "@/lib/color-utils"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

// Danh sách các key màu sắc được phép chỉnh sửa (cố định)
const ALLOWED_COLOR_KEYS = [
    {
        key: "primary",
        label: "Màu chính",
        description: "Màu chủ đạo của website",
        category: "Màu chính và nút",
    },
    {
        key: "button",
        label: "Màu nút",
        description: "Màu nền của các nút bấm",
        category: "Màu chính và nút",
    },
    {
        key: "buttonText",
        label: "Màu chữ nút",
        description: "Màu chữ trên các nút bấm",
        category: "Màu chính và nút",
    },
    {
        key: "headerBg",
        label: "Màu nền Header",
        description: "Màu nền của phần header",
        category: "Màu Header",
    },
    {
        key: "headerText",
        label: "Màu chữ Header",
        description: "Màu chữ trong phần header",
        category: "Màu Header",
    },
    {
        key: "homeGradientFrom",
        label: "Màu gradient từ (trang chủ)",
        description: "Màu bắt đầu của gradient background trang chủ",
        category: "Màu trang chủ",
    },
    {
        key: "homeGradientTo",
        label: "Màu gradient đến (trang chủ)",
        description: "Màu kết thúc của gradient background trang chủ",
        category: "Màu trang chủ",
    },
    {
        key: "homeText",
        label: "Màu chữ trang chủ",
        description: "Màu chữ chính trên trang chủ",
        category: "Màu trang chủ",
    },
    {
        key: "chatInputBg",
        label: "Màu nền input chat",
        description: "Màu nền của ô nhập tin nhắn",
        category: "Màu Chat",
    },
    {
        key: "chatInputBorder",
        label: "Màu viền input chat",
        description: "Màu viền của ô nhập tin nhắn",
        category: "Màu Chat",
    },
    {
        key: "chatInputText",
        label: "Màu chữ input chat",
        description: "Màu chữ trong ô nhập tin nhắn",
        category: "Màu Chat",
    },
    {
        key: "chatInputPlaceholder",
        label: "Màu placeholder input chat",
        description: "Màu chữ placeholder trong ô nhập tin nhắn",
        category: "Màu Chat",
    },
    {
        key: "chatUserMessageBg",
        label: "Màu nền tin nhắn người dùng",
        description: "Màu nền của tin nhắn do người dùng gửi",
        category: "Màu Chat",
    },
    {
        key: "chatUserMessageText",
        label: "Màu chữ tin nhắn người dùng",
        description: "Màu chữ của tin nhắn do người dùng gửi",
        category: "Màu Chat",
    },
] as const

type ColorConfig = {
    key: string
    value: string
    rgbValue?: string | null
    description?: string | null
}

export default function AdminColorsPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [colorConfigs, setColorConfigs] = useState<Record<string, ColorConfig>>({})
    const [showResetDialog, setShowResetDialog] = useState(false)
    const { showToast } = useToast()

    useEffect(() => {
        fetchColorConfigs()
    }, [])

    const fetchColorConfigs = async () => {
        try {
            const response = await fetch("/api/admin/color-config")
            if (response.ok) {
                const data: ColorConfig[] = await response.json()
                const configMap: Record<string, ColorConfig> = {}

                // Initialize với giá trị mặc định nếu chưa có
                ALLOWED_COLOR_KEYS.forEach((allowedKey) => {
                    const existing = data.find((c) => c.key === allowedKey.key)
                    if (existing) {
                        // Đảm bảo có rgbValue, nếu chưa có thì tính toán từ value
                        configMap[allowedKey.key] = {
                            ...existing,
                            rgbValue: existing.rgbValue || (existing.value ? oklchToHex(existing.value) : getDefaultRgbValue(allowedKey.key)),
                        }
                    } else {
                        configMap[allowedKey.key] = {
                            key: allowedKey.key,
                            value: getDefaultValue(allowedKey.key),
                            rgbValue: getDefaultRgbValue(allowedKey.key),
                            description: allowedKey.description,
                        }
                    }
                })

                setColorConfigs(configMap)
            }
        } catch (error) {
            console.error("Error fetching color configs:", error)
            showToast("error", "Không thể tải cấu hình màu sắc")
        } finally {
            setLoading(false)
        }
    }

    const getDefaultValue = (key: string): string => {
        const defaults: Record<string, string> = {
            primary: "oklch(0.21 0.034 264.665)",
            button: "oklch(0.21 0.034 264.665)",
            buttonText: "oklch(0.985 0.002 247.839)",
            headerBg: "oklch(1 0 0)",
            headerText: "oklch(0.13 0.028 261.692)",
            homeGradientFrom: "oklch(1 0 0)",
            homeGradientTo: "oklch(0.967 0.003 264.542)",
            homeText: "oklch(0.13 0.028 261.692)",
            chatInputBg: "oklch(1 0 0)",
            chatInputBorder: "oklch(0.928 0.006 264.531)",
            chatInputText: "oklch(0.13 0.028 261.692)",
            chatInputPlaceholder: "oklch(0.551 0.027 264.364)",
            chatUserMessageBg: "oklch(0.967 0.003 264.542)",
            chatUserMessageText: "oklch(0.13 0.028 261.692)",
        }
        return defaults[key] || "oklch(0.5 0 0)"
    }

    const getDefaultRgbValue = (key: string): string => {
        const defaults: Record<string, string> = {
            primary: "#447e94",
            button: "#447e94",
            buttonText: "#a6fdff",
            headerBg: "#ffffff",
            headerText: "#30657b",
            homeGradientFrom: "#ffffff",
            homeGradientTo: "#a4fbff",
            homeText: "#30657b",
            chatInputBg: "#ffffff",
            chatInputBorder: "#a1f7ff",
            chatInputText: "#30657b",
            chatInputPlaceholder: "#7ac4d3",
            chatUserMessageBg: "#a4fbff",
            chatUserMessageText: "#30657b",
        }
        return defaults[key] || "#808080"
    }

    const handleColorChange = (key: string, value: string) => {
        // Tự động tính toán rgbValue khi thay đổi màu
        const rgbValue = value && value.startsWith("oklch(") ? oklchToHex(value) : (colorConfigs[key]?.rgbValue || getDefaultRgbValue(key))
        
        setColorConfigs((prev) => ({
            ...prev,
            [key]: {
                ...prev[key],
                key,
                value,
                rgbValue,
            },
        }))
    }

    const handleResetClick = () => {
        setShowResetDialog(true)
    }

    const handleResetConfirm = async () => {
        setSaving(true)
        setShowResetDialog(false)
        try {
            const resetConfigs: ColorConfig[] = []
            ALLOWED_COLOR_KEYS.forEach((allowedKey) => {
                const defaultValue = getDefaultValue(allowedKey.key)
                resetConfigs.push({
                    key: allowedKey.key,
                    value: defaultValue,
                    rgbValue: getDefaultRgbValue(allowedKey.key),
                    description: allowedKey.description,
                })
            })

            const response = await fetch("/api/admin/color-config", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(resetConfigs),
            })

            if (response.ok) {
                showToast("success", "Đã đặt lại tất cả màu sắc về mặc định")
                fetchColorConfigs()
            } else {
                const { error } = await response.json().catch(() => ({ error: "Không thể đặt lại" }))
                showToast("error", error || "Không thể đặt lại màu sắc")
            }
        } catch (error) {
            console.error("Error resetting colors:", error)
            showToast("error", "Có lỗi xảy ra khi đặt lại màu sắc")
        } finally {
            setSaving(false)
        }
    }

    const handleSubmit = async () => {
        setSaving(true)
        try {
            const configsArray = Object.values(colorConfigs).map((config) => ({
                key: config.key,
                value: config.value,
                rgbValue: config.rgbValue || (config.value ? oklchToHex(config.value) : getDefaultRgbValue(config.key)),
                description: config.description,
            }))

            const response = await fetch("/api/admin/color-config", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(configsArray),
            })

            if (response.ok) {
                showToast("success", "Đã cập nhật cấu hình màu sắc")
                fetchColorConfigs()
            } else {
                const { error } = await response.json().catch(() => ({ error: "Không thể cập nhật" }))
                showToast("error", error || "Không thể cập nhật màu sắc")
            }
        } catch (error) {
            console.error("Error saving colors:", error)
            showToast("error", "Có lỗi xảy ra khi lưu màu sắc")
        } finally {
            setSaving(false)
        }
    }

    // Group colors by category
    const groupedColors = ALLOWED_COLOR_KEYS.reduce(
        (acc, item) => {
            if (!acc[item.category]) {
                acc[item.category] = []
            }
            acc[item.category].push(item)
            return acc
        },
        {} as Record<string, Array<typeof ALLOWED_COLOR_KEYS[number]>>
    )

    if (loading) {
        return (
            <main className="py-12 px-4">
                <div className="flex justify-center items-center h-full">
                    <Spinner />
                </div>
            </main>
        )
    }

    return (
        <main className="py-12 px-4">
            <div className="mb-8">
                <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
                    <Palette className="h-8 w-8" />
                    Cấu hình màu sắc
                </h1>
                <p className="text-muted-foreground mt-2">
                    Tùy chỉnh màu sắc cho website sử dụng định dạng OKLCH. Các key màu sắc được cố định và có thể chọn từ danh sách.
                </p>
            </div>

            <div className="space-y-6">
                {Object.entries(groupedColors).map(([category, items]) => (
                    <Card key={category}>
                        <CardHeader>
                            <CardTitle>{category}</CardTitle>
                            <CardDescription>Cấu hình màu sắc cho {category.toLowerCase()}</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6 md:grid-cols-2">
                            {items.map((item) => {
                                const config = colorConfigs[item.key]
                                if (!config) return null

                                return (
                                    <OklchColorPicker
                                        key={item.key}
                                        value={config.value}
                                        onChange={(value) => handleColorChange(item.key, value)}
                                        label={item.label}
                                        description={item.description}
                                    />
                                )
                            })}
                        </CardContent>
                    </Card>
                ))}

                {/* Preview Gradient */}
                <Card>
                    <CardHeader>
                        <CardTitle>Xem trước Gradient trang chủ</CardTitle>
                        <CardDescription>Preview gradient từ homeGradientFrom đến homeGradientTo</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="p-6 rounded-lg border-2 border-dashed">
                            <div
                                className="w-full h-32 rounded-md flex items-center justify-center text-xl font-bold"
                                style={{
                                    background: `linear-gradient(to bottom, ${
                                        colorConfigs.homeGradientFrom?.rgbValue || 
                                        (colorConfigs.homeGradientFrom?.value ? oklchToHex(colorConfigs.homeGradientFrom.value) : "#ffffff")
                                    }, ${
                                        colorConfigs.homeGradientTo?.rgbValue || 
                                        (colorConfigs.homeGradientTo?.value ? oklchToHex(colorConfigs.homeGradientTo.value) : "#a4fbff")
                                    })`,
                                    color: colorConfigs.homeText?.rgbValue || 
                                        (colorConfigs.homeText?.value ? oklchToHex(colorConfigs.homeText.value) : "#30657b"),
                                }}
                            >
                                Gradient Preview
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-between items-center">
                    <Button type="button" variant="outline" onClick={handleResetClick} disabled={saving}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Đặt lại mặc định
                    </Button>
                    <Button onClick={handleSubmit} disabled={saving}>
                        {saving ? "Đang lưu..." : "Lưu tất cả"}
                    </Button>
                </div>
            </div>

            <ConfirmDialog
                open={showResetDialog}
                onOpenChange={setShowResetDialog}
                title="Xác nhận đặt lại màu sắc"
                description="Bạn có chắc muốn đặt lại tất cả màu sắc về mặc định? Hành động này không thể hoàn tác."
                confirmText="Đặt lại"
                cancelText="Hủy"
                destructive={true}
                onConfirm={handleResetConfirm}
                loading={saving}
            />
        </main>
    )
}
