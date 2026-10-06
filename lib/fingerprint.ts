/**
 * Browser fingerprint utility for guest user interactions (likes, views)
 */

export function getBrowserFingerprint(): string {
  if (typeof window === 'undefined') {
    return 'server'
  }

  try {
    const STORAGE_KEY = 'client_fp_uuid'
    let fp = localStorage.getItem(STORAGE_KEY)

    if (!fp) {
      // Generate a persistent unique guest ID
      if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        fp = crypto.randomUUID()
      } else {
        fp = 'fp_' + Math.random().toString(36).substring(2, 15) + '_' + Date.now().toString(36)
      }
      localStorage.setItem(STORAGE_KEY, fp)
    }

    return fp
  } catch {
    return 'anonymous_visitor'
  }
}
