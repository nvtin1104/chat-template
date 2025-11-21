import { NextResponse } from "next/server"
import { getColorConfigsByKeys } from "@/lib/db"

// Danh sách các key màu sắc được phép truy cập công khai
const PUBLIC_COLOR_KEYS = [
    "primary",
    "button",
    "buttonText",
    "headerBg",
    "headerText",
    "homeGradientFrom",
    "homeGradientTo",
    "homeText",
    "chatInputBg",
    "chatInputBorder",
    "chatInputText",
    "chatInputPlaceholder",
    "chatUserMessageBg",
    "chatUserMessageText",
]

export async function GET() {
    try {
        const colorConfigs = await getColorConfigsByKeys(PUBLIC_COLOR_KEYS)
        return NextResponse.json(colorConfigs)
    } catch (error) {
        console.error("Error fetching public color configs:", error)
        return NextResponse.json(
            { error: "Failed to fetch color configs" },
            { status: 500 }
        )
    }
}

