import { NextResponse } from "next/server"
import { createContact } from "@/lib/db"

export async function POST(request: Request) {
    try {
        const payload = await request.json()

        // Validate required fields
        if (!payload.name || !payload.email || !payload.subject || !payload.message) {
            return NextResponse.json(
                { error: "Vui lòng điền đầy đủ thông tin bắt buộc" },
                { status: 400 }
            )
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(payload.email)) {
            return NextResponse.json(
                { error: "Email không hợp lệ" },
                { status: 400 }
            )
        }

        const contact = await createContact({
            name: payload.name.trim(),
            email: payload.email.trim(),
            phone: payload.phone?.trim() || undefined,
            subject: payload.subject.trim(),
            message: payload.message.trim(),
        })

        if (!contact) {
            return NextResponse.json(
                { error: "Không thể gửi liên hệ. Vui lòng thử lại sau." },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            message: "Gửi liên hệ thành công. Chúng tôi sẽ phản hồi sớm nhất có thể.",
        })
    } catch (error) {
        console.error("Error creating contact:", error)
        return NextResponse.json(
            { error: "Có lỗi xảy ra khi gửi liên hệ" },
            { status: 500 }
        )
    }
}

