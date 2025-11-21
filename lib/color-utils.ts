// Utility functions to convert OKLCH to hex for use in CSS gradients
// CSS gradients don't support OKLCH directly, so we need to convert to hex/rgb

export function oklchToHex(oklch: string): string {
    try {
        const match = oklch.match(/oklch\(([^)]+)\)/)
        if (!match) return "#000000"

        const values = match[1].trim().split(/\s+/).map(parseFloat)
        const [l, c, h] = values

        // Special case: when chroma is 0, color is grayscale (r = g = b)
        if (c === 0 || Math.abs(c) < 0.0001) {
            const toSRGB = (c: number) => {
                if (c <= 0.0031308) return c * 12.92
                return 1.055 * Math.pow(c, 1 / 2.4) - 0.055
            }
            const gray = Math.max(0, Math.min(1, l))
            const gray255 = Math.round(toSRGB(gray) * 255)
            const hex = gray255.toString(16).padStart(2, "0")
            return `#${hex}${hex}${hex}`
        }

        const hRad = (h * Math.PI) / 180
        const a = c * Math.cos(hRad)
        const b = c * Math.sin(hRad)

        // Convert OKLAB to linear LMS
        const l_ = l + 0.3963377774 * a + 0.2158037573 * b
        const m_ = l - 0.1055613458 * a - 0.0638541728 * b
        const s_ = l - 0.0894841775 * a - 1.291485548 * b

        // Convert linear LMS to linear RGB
        const rLinear = +1.2270138511 * l_ - 0.5577999807 * m_ - 0.2812561490 * s_
        const gLinear = -0.0405801784 * l_ + 1.1122568696 * m_ - 0.0716766787 * s_
        const bLinear = -0.0769367721 * l_ - 0.4215562348 * m_ + 1.5861632204 * s_

        // Clamp to valid range
        const r = Math.max(0, Math.min(1, rLinear))
        const g = Math.max(0, Math.min(1, gLinear))
        const b_ = Math.max(0, Math.min(1, bLinear))

        // Gamma correction to sRGB
        const toSRGB = (c: number) => {
            if (c <= 0.0031308) return c * 12.92
            return 1.055 * Math.pow(c, 1 / 2.4) - 0.055
        }

        const r255 = Math.round(toSRGB(r) * 255)
        const g255 = Math.round(toSRGB(g) * 255)
        const b255 = Math.round(toSRGB(b_) * 255)

        return `#${[r255, g255, b255].map((x) => x.toString(16).padStart(2, "0")).join("")}`
    } catch {
        return "#000000"
    }
}

export function oklchToRgb(oklch: string): string {
    try {
        const match = oklch.match(/oklch\(([^)]+)\)/)
        if (!match) return "rgb(0, 0, 0)"

        const values = match[1].trim().split(/\s+/).map(parseFloat)
        const [l, c, h] = values

        const hRad = (h * Math.PI) / 180
        const a = c * Math.cos(hRad)
        const b = c * Math.sin(hRad)

        const l_ = l + 0.3963377774 * a + 0.2158037573 * b
        const m_ = l - 0.1055613458 * a - 0.0638541728 * b
        const s_ = l - 0.0894841775 * a - 1.291485548 * b

        const r = Math.max(0, Math.min(1, l_ + 1.2270138511 * m_ - 0.5577999807 * s_))
        const g = Math.max(0, Math.min(1, l_ - 0.0405801784 * m_ + 0.2814191572 * s_))
        const b_ = Math.max(0, Math.min(1, l_ - 0.0769367721 * m_ - 1.1841439251 * s_))

        const toSRGB = (c: number) => {
            if (c <= 0.0031308) return c * 12.92
            return 1.055 * Math.pow(c, 1 / 2.4) - 0.055
        }

        const r255 = Math.round(toSRGB(r) * 255)
        const g255 = Math.round(toSRGB(g) * 255)
        const b255 = Math.round(toSRGB(b_) * 255)

        return `rgb(${r255}, ${g255}, ${b255})`
    } catch {
        return "rgb(0, 0, 0)"
    }
}

// Helper to convert OKLCH color for use in CSS (returns hex if OKLCH, otherwise returns as-is)
export function convertColorForCSS(color: string | undefined): string {
    if (!color) return "#ffffff" // Fallback to white instead of empty string
    if (color.startsWith("oklch(")) {
        return oklchToHex(color)
    }
    return color
}

