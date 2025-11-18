import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'

export async function POST() {
    try {
        const supabase = await createSupabaseServerClient()
        await supabase.auth.signOut()

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Sign out error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

