"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageSquare, Send } from "lucide-react"
import { useState } from "react"

export default function ChatBar() {
    const [query, setQuery] = useState("")

    return (
        <div className="w-full max-w-4xl mx-auto px-4">
            <div className="flex items-center gap-2 p-4 border rounded-lg bg-card shadow-sm">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Hỏi bất cứ điều gì về AI..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && query.trim()) {
                            window.location.href = `/tro-chuyen?q=${encodeURIComponent(query)}`
                        }
                    }}
                    className="flex-1 outline-none bg-transparent text-foreground placeholder:text-muted-foreground"
                />
                <Link href={`/tro-chuyen${query ? `?q=${encodeURIComponent(query)}` : ""}`}>
                    <Button size="sm" className="gap-2">
                        <Send className="h-4 w-4" />
                        Trò chuyện
                    </Button>
                </Link>
            </div>
        </div>
    )
}

