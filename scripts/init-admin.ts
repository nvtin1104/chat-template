import bcrypt from "bcryptjs"
import { createSupabaseAdminClient } from "@/lib/supabase"
import { getUserByEmail, createUser, updateUser } from "@/lib/db"
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

async function main() {

    const email = process.env.ADMIN_EMAIL || "admin@gmail.com"
    const password = process.env.ADMIN_PASSWORD || "admin123"
    const name = process.env.ADMIN_NAME || "Admin"


    const hashedPassword = await bcrypt.hash(password, 10)

    let user = await getUserByEmail(email)

    if (user) {
        user = await updateUser(user.id, {
            password: hashedPassword,
            role: "superadmin",
        })
        console.log("Superadmin user updated in database:", {
            id: user?.id,
            email: user?.email,
            name: user?.name,
            role: user?.role,
        })
    } else {
        user = await createUser({
            email,
            name,
            password: hashedPassword,
            role: "superadmin",
        })
    }

    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
        try {
            const supabase = createSupabaseAdminClient()

            const { data: existingUsers } = await supabase.auth.admin.listUsers()
            const existingUser = existingUsers?.users.find(u => u.email === email)

            if (existingUser) {
                const { data, error } = await supabase.auth.admin.updateUserById(
                    existingUser.id,
                    { password }
                )
                if (error) {
                    console.warn("Warning: Could not update password in Supabase Auth:", error.message)
                    console.log("User can still sign in - password will be synced on first login")
                } else {
                    console.log("Password updated in Supabase Auth")
                }
            } else {
                const { data, error } = await supabase.auth.admin.createUser({
                    email,
                    password,
                    email_confirm: true,
                })
                if (error) {
                    console.warn("Warning: Could not create user in Supabase Auth:", error.message)
                    console.log("User will be created automatically on first login")
                } else {
                    console.log("User created in Supabase Auth:", data.user?.email)
                }
            }
        } catch (error) {
            console.warn("Warning: Could not create user in Supabase Auth:", error)
            console.log("User will be created automatically on first login via /api/auth/signin")
        }
    } else {
        console.log("SUPABASE_SERVICE_ROLE_KEY not set - user will be created in Supabase Auth on first login")
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })

