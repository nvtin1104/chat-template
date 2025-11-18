import { NextResponse } from "next/server"
import { getActiveSlides } from "@/lib/db"

export async function GET() {
    try {
        const slides = await getActiveSlides()

        return NextResponse.json(slides)
    } catch (error) {
        console.error("Error fetching slides:", error)
        return NextResponse.json(
            { error: "Failed to fetch slides" },
            { status: 500 }
        )
    }
}
