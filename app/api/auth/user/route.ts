import { NextResponse } from 'next/server'
import { createUser, getUserByEmail } from '@/lib/db'
import { createSupabaseServerClient } from '@/lib/supabase'
import bcrypt from 'bcryptjs'
import { requireSuperadmin } from '@/lib/auth-supabase'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const email = searchParams.get('email')

        // Verify Supabase session
        const supabase = await createSupabaseServerClient()
        const {
            data: { user: supabaseUser },
        } = await supabase.auth.getUser()

        if (!supabaseUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // If email provided, verify it matches the session user
        if (email && email !== supabaseUser.email) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        // Get user from database
        const dbUser = await getUserByEmail(supabaseUser.email!)

        if (!dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
            role: dbUser.role,
            image: dbUser.image,
        })
    } catch (error) {
        console.error('Error fetching user:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
