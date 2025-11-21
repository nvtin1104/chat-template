"use client"

import Image from 'next/image'
import { getActiveFeatures, getSiteInfoRecord } from '@/lib/db'
import { convertColorForCSS } from '@/lib/color-utils'
import { useEffect, useState } from 'react'

const FALLBACK_TITLE = 'Tại sao chọn AI nha khoa?'
const FALLBACK_DESCRIPTION = 'Nền tảng AI cơ mối phần khoa, tư vấn chăm sóc răng miệng từ đội ngũ bác sĩ chuyên môn'

export default function FeaturesSection() {
    const [features, setFeatures] = useState<any[]>([])
    const [siteInfo, setSiteInfo] = useState<any>(null)

    useEffect(() => {
        Promise.all([getActiveFeatures(), getSiteInfoRecord()]).then(([feats, info]) => {
            setFeatures(feats)
            setSiteInfo(info)
        })
    }, [])

    if (!features.length) return null

    return (
        <section 
            className="w-full py-8 px-4"
            style={{
                background: `linear-gradient(to bottom, ${convertColorForCSS("var(--home-gradient-from)")}, ${convertColorForCSS("var(--home-gradient-to)")})`,
            }}
        >
            <div className="container mx-auto">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {features.map((feature) => (
                        <article
                            key={feature.id}
                            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow flex flex-col h-full"
                        >
                            <div className="flex items-start gap-4 mb-4">
                                {feature.icon?.startsWith('http') ? (
                                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-blue-50 flex-shrink-0">
                                        <Image
                                            src={feature.icon}
                                            alt={feature.title}
                                            fill
                                            sizes="56px"
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
                                        {feature.icon || '✨'}
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed flex-1">{feature.description}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}
