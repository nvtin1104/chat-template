"use client"

import { useEffect, useState } from "react"

interface ColorConfigs {
    primary?: string
    button?: string
    buttonText?: string
    headerBg?: string
    headerText?: string
    homeGradientFrom?: string
    homeGradientTo?: string
    homeText?: string
}

export function useColorConfig(): ColorConfigs {
    const [colorConfigs, setColorConfigs] = useState<ColorConfigs>({})

    useEffect(() => {
        fetch("/api/public/color-config")
            .then((res) => res.json())
            .then((data) => setColorConfigs(data))
            .catch((error) => console.error("Error fetching color configs:", error))
    }, [])

    return colorConfigs
}

