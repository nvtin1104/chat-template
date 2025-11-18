import { NextResponse } from 'next/server'
import { createSupabaseServerClient, createSupabaseAdminClient } from '@/lib/supabase'
import { getUserByEmail } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json()

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            )
        }

        // Find user in database
        const user = await getUserByEmail(email)

        if (!user || !user.password) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            )
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            )
        }

        // Sign in with Supabase Auth
        const supabase = await createSupabaseServerClient()
        let { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password, // Use plaintext password - Supabase will hash it
        })

        // If sign in fails, try to create user in Supabase Auth (for migration)
        if (signInError) {
            // Check if we have service role key to create user
            if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
                const supabaseAdmin = createSupabaseAdminClient()

                // Try to create user in Supabase Auth
                const { data: createData, error: createError } = await supabaseAdmin.auth.admin.createUser({
                    email,
                    password,
                    email_confirm: true,
                })

                if (createError) {
                    // User might already exist with different password - try to update
                    const { data: usersData } = await supabaseAdmin.auth.admin.listUsers()
                    const existingUser = usersData?.users.find(u => u.email === email)

                    if (existingUser) {
                        // Update password
                        await supabaseAdmin.auth.admin.updateUserById(existingUser.id, { password })
                        // Try sign in again
                        const retryResult = await supabase.auth.signInWithPassword({ email, password })
                        if (retryResult.error) {
                            return NextResponse.json(
                                { error: 'Failed to authenticate. Please contact administrator.' },
                                { status: 500 }
                            )
                        }
                        signInData = retryResult.data
                    } else {
                        return NextResponse.json(
                            { error: 'Failed to authenticate. Please contact administrator.' },
                            { status: 500 }
                        )
                    }
                } else {
                    // User created, try sign in
                    const retryResult = await supabase.auth.signInWithPassword({ email, password })
                    if (retryResult.error) {
                        return NextResponse.json(
                            { error: 'Failed to authenticate. Please try again.' },
                            { status: 500 }
                        )
                    }
                    signInData = retryResult.data
                }
            } else {
                // No service role key - user needs to be created manually or via signup
                return NextResponse.json(
                    { error: 'Account not found. Please contact administrator.' },
                    { status: 401 }
                )
            }
        }

        return NextResponse.json({ success: true, user: signInData?.user })
    } catch (error) {
        console.error('Sign in error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

