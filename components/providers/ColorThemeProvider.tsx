"use client"

import { useEffect, useState } from "react"

// Mapping từ key trong database sang CSS variable trong globals.css
const COLOR_KEY_MAPPING: Record<string, string> = {
    primary: "--primary",
    button: "--button",
    buttonText: "--button-text",
    headerBg: "--header-bg",
    headerText: "--header-text",
    homeGradientFrom: "--home-gradient-from",
    homeGradientTo: "--home-gradient-to",
    homeText: "--home-text",
    chatInputBg: "--chat-input-bg",
    chatInputBorder: "--chat-input-border",
    chatInputText: "--chat-input-text",
    chatInputPlaceholder: "--chat-input-placeholder",
    chatUserMessageBg: "--chat-user-message-bg",
    chatUserMessageText: "--chat-user-message-text",
}

export function ColorThemeProvider({ children }: { children: React.ReactNode }) {
    const [colorConfigs, setColorConfigs] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchColorConfigs()
    }, [])

    const fetchColorConfigs = async () => {
        try {
            const response = await fetch("/api/public/color-config")
            if (response.ok) {
                const data: Record<string, string> = await response.json()
                setColorConfigs(data)
            }
        } catch (error) {
            console.error("Error fetching color configs:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (loading) return

        // Ghi đè các biến CSS trong globals.css bằng màu từ database (giữ nguyên OKLCH format)
        const root = document.documentElement

        Object.entries(colorConfigs).forEach(([key, value]) => {
            const cssVar = COLOR_KEY_MAPPING[key]
            if (cssVar && value) {
                // Giữ nguyên OKLCH format, không convert sang hex
                root.style.setProperty(cssVar, value)
            }
        })
    }, [colorConfigs, loading])

    return <>{children}</>
}
