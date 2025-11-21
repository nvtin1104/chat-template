"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createSupabaseClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignInPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const supabase = createSupabaseClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (supabaseError) {
                if (supabaseError.message?.includes('Invalid login credentials') || supabaseError.code === 'invalid_credentials') {
                    setError("Email hoặc mật khẩu không đúng. Nếu bạn chưa có tài khoản")
                } else {
                    setError(supabaseError.message || "Email hoặc mật khẩu không đúng")
                }
                return
            }

            if (!data.user) {
                setError("Đăng nhập thất bại. Vui lòng thử lại.")
                return
            }
            console.log(data.user, 'data.user')

            if (data.user.role === 'admin' || data.user.role === 'superadmin') {
                router.push("/admin")
            } else {
                router.push("/")
            }

            router.refresh()
        } catch (error) {
            console.error("Sign in error:", error)
            setError("Đã có lỗi xảy ra. Vui lòng thử lại.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex-1 flex items-center justify-center pt-16">
            <div className="container p-4 flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Đăng nhập</CardTitle>
                        <CardDescription>
                            Nhập thông tin đăng nhập của bạn
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                                    {error}
                                </div>
                            )}
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">
                                    Email
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium">
                                    Mật khẩu
                                </label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

