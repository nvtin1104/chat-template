"use client"

import { useEffect, useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

interface SessionUser {
    id: string
    email: string
    name?: string | null
    role: string
    image?: string | null
}

export function useSupabaseSession() {
    const [user, setUser] = useState<SessionUser | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createSupabaseClient()

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                fetchUserData(session.user)
            } else {
                setUser(null)
                setLoading(false)
            }
        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                fetchUserData(session.user)
            } else {
                setUser(null)
                setLoading(false)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    const fetchUserData = async (supabaseUser: User) => {
        try {
            const response = await fetch(`/api/auth/user?email=${supabaseUser.email}`)
            if (response.ok) {
                const dbUser = await response.json()
                setUser({
                    id: dbUser.id,
                    email: dbUser.email,
                    name: dbUser.name,
                    role: dbUser.role,
                    image: dbUser.image,
                })
            } else {
                setUser(null)
            }
        } catch (error) {
            console.error('Error fetching user data:', error)
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    return { user, loading }
}

