import http from "@/lib/http"
import { getSiteInfoRecord } from "./db"

const FALLBACK_SITE_INFO = {
  siteUrl: "https://example.com",
  title: "AI Platform",
  name: "AI Platform",
  description: "Nền tảng khám phá trí tuệ nhân tạo.",
  author: "AI Platform",
}

export interface SiteInfo {
  siteUrl: string
  title: string
  name?: string
  logo?: string
  bannerTitle?: string
  bannerDescription?: string
  description: string
  keywords?: string
  author: string
  email?: string
  phone?: string
  facebook?: string
  instagram?: string
  twitter?: string
  linkedin?: string
  youtube?: string
  tiktok?: string
  address?: string
  contact?: string
  locale?: string
  language?: string
  charset?: string
  ogImage?: string
  ogType?: string
  twitterCard?: string
}



export async function getSiteInfo(): Promise<SiteInfo> {
  try {
    const { data } = await http.get<SiteInfo>("/api/public/site-info")
    
    return data
  } catch (error) {
    const fallback = await getSiteInfoRecord() ?? FALLBACK_SITE_INFO
    return fallback as SiteInfo
  }
}

