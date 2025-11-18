"use client"

import { motion } from "framer-motion"
import { TypeAnimation } from "react-type-animation"

export function TypingLoadingPage() {
    const messages = [
        "Đang khởi tạo hệ thống...",
        1000,
        "Đang kết nối máy chủ...",
        1000,
        "Chuẩn bị sẵn sàng..."
    ]

    return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="flex flex-col items-center gap-4">
                <p className="text-lg font-medium text-gray-700 min-h-[28px]">
                    <TypeAnimation
                        sequence={messages}
                        wrapper="span"
                        speed={50}
                        style={{ fontSize: '16px', display: 'inline-block' }}
                        repeat={Infinity}
                    />
                </p>
                <div className="flex gap-1">
                    <motion.span
                        className="w-2 h-2 rounded-full bg-gray-500"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                    />
                    <motion.span
                        className="w-2 h-2 rounded-full bg-gray-500"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                    />
                    <motion.span
                        className="w-2 h-2 rounded-full bg-gray-500"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                    />
                </div>
            </div>
        </div>
    )
}
