import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        let body: any = {};
        try {
            body = await req.json();
        } catch {
            return NextResponse.json(
                { message: "Payload không hợp lệ" },
                { status: 400 }
            );
        }

        const threadId = req.headers.get("cookie")
            ?.split("; ")
            .find((c) => c.startsWith("thread_id="))
            ?.split("=")[1];

        if (!threadId) {
            return NextResponse.json(
                { message: "Thread ID không được mở", isOpen: false },
                { status: 400 }
            );
        }

        if (!body.message || typeof body.message !== "string") {
            return NextResponse.json(
                { message: "Tin nhắn không được để trống", isOpen: false },
                { status: 400 }
            );
        }

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BIZINO_API}/botChat/chat`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    bot_uuid: process.env.NEXT_PUBLIC_BIZINO_BOT_UUID,
                    channel_id: "web",
                    environment: "prod",
                    message: body.message,
                    thread_id: threadId,
                }),
            }
        );

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (err: any) {
        return NextResponse.json(
            { message: "Proxy error", error: err.message },
            { status: 500 }
        );
    }
}
