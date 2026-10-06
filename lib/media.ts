import { CoverImageResponsive, ResponsiveMediaVariants } from '@/types/blog'

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:5050/api/v1'

/**
 * Returns the origin base URL for media assets (strips trailing /api/v1 if present)
 */
export function getMediaBaseUrl(): string {
  try {
    const url = new URL(BACKEND_BASE_URL)
    return `${url.protocol}//${url.host}`
  } catch {
    return 'http://localhost:5050'
  }
}

/**
 * Normalizes an image or asset URL to ensure it has a full path if hosted on the backend.
 */
export function getMediaUrl(pathOrUrl?: string | null): string {
  if (!pathOrUrl) return ''
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://') || pathOrUrl.startsWith('data:')) {
    return pathOrUrl
  }
  const cleanPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`
  return `${getMediaBaseUrl()}${cleanPath}`
}

/**
 * Selects the best image URL from responsive image variants with graceful fallback.
 */
export function getResponsiveImageUrl(
  responsive?: CoverImageResponsive | ResponsiveMediaVariants | null,
  preferredVariant: 'desktop' | 'tablet' | 'mobile' | 'thumbnail' | 'original' = 'desktop',
  fallback?: string | null
): string {
  if (!responsive) return getMediaUrl(fallback)

  const variant = (responsive as any)[preferredVariant]
  if (variant) {
    if (typeof variant === 'string') return getMediaUrl(variant)
    if (typeof variant === 'object' && variant.url) return getMediaUrl(variant.url)
  }

  // Fallbacks in order of resolution
  const order: (keyof CoverImageResponsive)[] = ['desktop', 'tablet', 'mobile', 'original', 'thumbnail']
  for (const key of order) {
    const val = (responsive as any)[key]
    if (val) {
      if (typeof val === 'string') return getMediaUrl(val)
      if (typeof val === 'object' && val.url) return getMediaUrl(val.url)
    }
  }

  return getMediaUrl(fallback)
}
