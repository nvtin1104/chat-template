
export function isSupabaseStorageUrl(url: string): boolean {
  return url.includes("supabase.co/storage")
}

export function getProxyImageUrl(url: string): string {
  if (!url) return url
  
  if (!isSupabaseStorageUrl(url)) {
    return url
  }

  const encodedUrl = encodeURIComponent(url)
  return `/api/admin/images/proxy?url=${encodedUrl}`
}

export function getImageUrl(url: string, useProxy: boolean = true): string {
  if (!url) return url
  
  if (useProxy && isSupabaseStorageUrl(url)) {
    return getProxyImageUrl(url)
  }
  
  return url
}


export function transformHtmlImageUrls(html: string, useProxy: boolean = true): string {
  if (!html || !useProxy) return html

  const supabaseUrlRegex = /(<img[^>]+src=["'])(https?:\/\/[^"']*supabase\.co\/storage[^"']*)(["'][^>]*>)/gi

  return html.replace(supabaseUrlRegex, (match, prefix, url, suffix) => {
    const proxyUrl = getProxyImageUrl(url)
    return `${prefix}${proxyUrl}${suffix}`
  })
}

