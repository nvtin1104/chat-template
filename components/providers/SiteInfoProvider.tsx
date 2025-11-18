"use client"

import { createContext, useContext } from "react"
import type { SiteInfo } from "@/lib/site-info"

const SiteInfoContext = createContext<SiteInfo | null>(null)

export function SiteInfoProvider({ siteInfo, children }: { siteInfo: SiteInfo; children: React.ReactNode }) {
  return <SiteInfoContext.Provider value={siteInfo}>{children}</SiteInfoContext.Provider>
}

export function useSiteInfo() {
  const context = useContext(SiteInfoContext)
  if (!context) {
    throw new Error("useSiteInfo must be used within SiteInfoProvider")
  }
  return context
}

