"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageSquare, ArrowRight } from "lucide-react"
import { useSiteInfo } from "./providers/SiteInfoProvider"
import { convertColorForCSS } from "@/lib/color-utils"

export default function Banner() {
    const siteInfo = useSiteInfo()
    
    if (!siteInfo) {
        return null
    }

    return (
        <section
            className="relative w-full py-16 md:py-24 flex justify-center"
            style={{
                background: `linear-gradient(to top, ${convertColorForCSS("var(--home-gradient-from)")}, ${convertColorForCSS("var(--home-gradient-to)")})`,
            }}
        >
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h1
                            className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
                            style={{ color: "var(--home-text)" }}
                        >
                            {siteInfo.bannerTitle || siteInfo.title}
                        </h1>
                        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl" style={{ color: "var(--home-text)" }}>
                            {siteInfo.bannerDescription || siteInfo.description}
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/tro-chuyen">
                            <Button 
                                size="lg" 
                                className="gap-2"
                                style={{
                                    backgroundColor: convertColorForCSS("var(--button)"),
                                    color: convertColorForCSS("var(--button-text)"),
                                }}
                            >
                                <MessageSquare className="h-5 w-5" />
                                Bắt đầu chat ngay
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href="/bai-viet">
                            <Button size="lg" variant="outline" style={{ color: "var(--home-text)" }}>
                                Xem bài viết
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

