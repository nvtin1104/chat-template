"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// Utility functions to convert between OKLCH and other color formats
function oklchToHex(oklch: string): string {
    try {
        const match = oklch.match(/oklch\(([^)]+)\)/)
        if (!match) return "#000000"

        const values = match[1].trim().split(/\s+/).map(parseFloat)
        const [l, c, h] = values

        // Special case: when chroma is 0, color is grayscale (r = g = b)
        if (c === 0 || Math.abs(c) < 0.0001) {
            const toSRGB = (c: number) => {
                if (c <= 0.0031308) return c * 12.92
                return 1.055 * Math.pow(c, 1 / 2.4) - 0.055
            }
            const gray = Math.max(0, Math.min(1, l))
            const gray255 = Math.round(toSRGB(gray) * 255)
            const hex = gray255.toString(16).padStart(2, "0")
            return `#${hex}${hex}${hex}`
        }

        // Convert OKLCH to OKLAB
        const hRad = (h * Math.PI) / 180
        const a = c * Math.cos(hRad)
        const b = c * Math.sin(hRad)

        // Convert OKLAB to linear LMS
        const l_ = l + 0.3963377774 * a + 0.2158037573 * b
        const m_ = l - 0.1055613458 * a - 0.0638541728 * b
        const s_ = l - 0.0894841775 * a - 1.291485548 * b

        // Convert linear LMS to linear RGB
        const rLinear = +1.2270138511 * l_ - 0.5577999807 * m_ - 0.2812561490 * s_
        const gLinear = -0.0405801784 * l_ + 1.1122568696 * m_ - 0.0716766787 * s_
        const bLinear = -0.0769367721 * l_ - 0.4215562348 * m_ + 1.5861632204 * s_

        // Clamp to valid range
        const r = Math.max(0, Math.min(1, rLinear))
        const g = Math.max(0, Math.min(1, gLinear))
        const b_ = Math.max(0, Math.min(1, bLinear))

        // Gamma correction to sRGB
        const toSRGB = (c: number) => {
            if (c <= 0.0031308) return c * 12.92
            return 1.055 * Math.pow(c, 1 / 2.4) - 0.055
        }

        const r255 = Math.round(toSRGB(r) * 255)
        const g255 = Math.round(toSRGB(g) * 255)
        const b255 = Math.round(toSRGB(b_) * 255)

        return `#${[r255, g255, b255].map((x) => x.toString(16).padStart(2, "0")).join("")}`
    } catch {
        return "#000000"
    }
}

function hexToOklch(hex: string): string {
    try {
        const r = parseInt(hex.slice(1, 3), 16) / 255
        const g = parseInt(hex.slice(3, 5), 16) / 255
        const b = parseInt(hex.slice(5, 7), 16) / 255

        // Convert sRGB to linear RGB
        const toLinear = (c: number) => {
            if (c <= 0.04045) return c / 12.92
            return Math.pow((c + 0.055) / 1.055, 2.4)
        }

        const rLinear = toLinear(r)
        const gLinear = toLinear(g)
        const bLinear = toLinear(b)

        // Convert linear RGB to OKLAB (simplified)
        const l = 0.4122214708 * rLinear + 0.5363325363 * gLinear + 0.0514459929 * bLinear
        const m = 0.2119034982 * rLinear + 0.6806995451 * gLinear + 0.1073969566 * bLinear
        const s = 0.0883024619 * rLinear + 0.2817188376 * gLinear + 0.6299787005 * bLinear

        const l_ = Math.cbrt(l)
        const m_ = Math.cbrt(m)
        const s_ = Math.cbrt(s)

        const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_
        const aLab = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_
        const bLab = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_

        const C = Math.sqrt(aLab * aLab + bLab * bLab)
        let H = (Math.atan2(bLab, aLab) * 180) / Math.PI
        if (H < 0) H += 360

        return `oklch(${L.toFixed(3)} ${C.toFixed(3)} ${H.toFixed(1)})`
    } catch {
        return "oklch(0.5 0 0)"
    }
}

interface OklchColorPickerProps {
    value: string
    onChange: (value: string) => void
    label?: string
    description?: string
    className?: string
}

export function OklchColorPicker({
    value,
    onChange,
    label,
    description,
    className,
}: OklchColorPickerProps) {
    const [oklchValue, setOklchValue] = useState(value || "oklch(0.5 0 0)")
    const [hexValue, setHexValue] = useState(() => oklchToHex(value || "oklch(0.5 0 0)"))
    const [isOpen, setIsOpen] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    // Sync với value prop khi thay đổi từ bên ngoài
    useEffect(() => {
        if (value && value !== oklchValue) {
            setOklchValue(value)
            const newHex = oklchToHex(value)
            setHexValue(newHex)
            // Cập nhật input color để đồng bộ với giá trị mới
            if (inputRef.current) {
                inputRef.current.value = newHex
            }
        }
    }, [value])

    const handleHexChange = (hex: string) => {
        // Normalize hex value (đảm bảo đúng format)
        let normalizedHex = hex.trim()
        if (!normalizedHex.startsWith("#")) {
            normalizedHex = `#${normalizedHex}`
        }
        // Đảm bảo có đủ 6 ký tự hex
        if (normalizedHex.length === 4) {
            // Format #RGB -> #RRGGBB
            normalizedHex = `#${normalizedHex[1]}${normalizedHex[1]}${normalizedHex[2]}${normalizedHex[2]}${normalizedHex[3]}${normalizedHex[3]}`
        }
        // Chỉ chấp nhận hex 6 ký tự
        if (normalizedHex.length !== 7) {
            return
        }
        
        setHexValue(normalizedHex)
        
        if (/^#[0-9A-Fa-f]{6}$/i.test(normalizedHex)) {
            const oklch = hexToOklch(normalizedHex)
            setOklchValue(oklch)
            onChange(oklch)
        }
    }

    const handleOklchChange = (oklch: string) => {
        setOklchValue(oklch)
        if (/^oklch\([^)]+\)$/.test(oklch)) {
            const newHex = oklchToHex(oklch)
            setHexValue(newHex)
            // Cập nhật input color để đồng bộ
            if (inputRef.current) {
                inputRef.current.value = newHex
            }
            onChange(oklch)
        }
    }

    const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const hex = e.target.value
        // Input type="color" luôn trả về hex 7 ký tự (#RRGGBB)
        if (hex && /^#[0-9A-Fa-f]{6}$/i.test(hex)) {
            handleHexChange(hex)
        }
    }

    return (
        <div className={cn("space-y-2", className)}>
            {label && <Label className="text-sm font-medium">{label}</Label>}
            {description && <p className="text-xs text-muted-foreground">{description}</p>}

            <div className="flex gap-2 items-center">
                <input
                    ref={inputRef}
                    type="color"
                    value={hexValue}
                    onChange={handleColorPickerChange}
                    className="w-20 h-10 cursor-pointer rounded-md border"
                    style={{ 
                        WebkitAppearance: "none",
                        appearance: "none",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.375rem",
                    }}
                />
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                    <PopoverTrigger asChild>
                        <button
                            type="button"
                            className="w-full h-12 rounded-md border cursor-pointer hover:opacity-80 transition-opacity"
                            style={{ backgroundColor: hexValue }}
                            onClick={(e) => {
                                e.preventDefault()
                                setIsOpen(!isOpen)
                            }}
                        />
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="start" onOpenAutoFocus={(e) => e.preventDefault()}>
                        <div className="space-y-4">
                            <div>
                                <Label className="text-xs">Hex Color</Label>
                                <Input
                                    type="text"
                                    value={hexValue}
                                    onChange={(e) => handleHexChange(e.target.value)}
                                    placeholder="#000000"
                                    className="mt-1 font-mono text-sm"
                                />
                            </div>
                            <div>
                                <Label className="text-xs">OKLCH</Label>
                                <Input
                                    type="text"
                                    value={oklchValue}
                                    onChange={(e) => handleOklchChange(e.target.value)}
                                    placeholder="oklch(0.5 0 0)"
                                    className="mt-1 font-mono text-sm"
                                />
                            </div>
                            <div className="text-xs text-muted-foreground">
                                <p>Format: oklch(lightness chroma hue)</p>
                                <p>Example: oklch(0.5 0.2 180)</p>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            <div className="flex gap-2">
                <Input
                    type="text"
                    value={oklchValue}
                    onChange={(e) => handleOklchChange(e.target.value)}
                    placeholder="oklch(0.5 0 0)"
                    className="flex-1 font-mono text-sm"
                />
            </div>
        </div>
    )
}

