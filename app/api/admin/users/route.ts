import { NextResponse } from "next/server"
import { requireAdmin, requireSuperadmin } from "@/lib/auth-supabase"
import { createUser, getAllUsers } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function GET() {
    try {
        await requireAdmin()

        const users = await getAllUsers()

        return NextResponse.json(users)
    } catch (error) {
        console.error("Error fetching users:", error)
        return NextResponse.json(
            { error: "Failed to fetch users" },
            { status: 500 }
        )
    }
}



export async function POST(request: Request) {
    try {
        await requireSuperadmin()
        console.log("Creating user")

        const { name = "admin", email, password, role = "admin" } = await request.json()
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email và mật khẩu là bắt buộc" },
                { status: 400 }
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await createUser({
            email,
            name,
            password: hashedPassword,
            role,
        })
        return NextResponse.json(user, { status: 201 })
    } catch (error: any) {

        const message = error?.message || "Failed to create user"
        const status = message.includes("Email đã tồn tại") ? 409 : 500
        console.log(message, status, 'message, status')
        return NextResponse.json({ error: message }, { status })
    }
}
