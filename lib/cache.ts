// In-memory cache helper with TTL support

interface CacheEntry {
  value: any
  expiresAt: number
}

// Persist the cache in the global scope during development to survive hot reloading
const globalWithCache = global as typeof globalThis & {
  _apiCache?: Record<string, CacheEntry>
}

if (!globalWithCache._apiCache) {
  globalWithCache._apiCache = {}
}

const cache = globalWithCache._apiCache

/**
 * Get item from cache if it has not expired
 */
export function getCache<T = any>(key: string): T | null {
  const entry = cache[key]
  if (!entry) return null

  if (Date.now() > entry.expiresAt) {
    delete cache[key] // Clear expired cache
    return null
  }

  return entry.value as T
}

/**
 * Set item in cache with a TTL (Time To Live) in seconds
 */
export function setCache<T = any>(key: string, value: T, ttlSeconds: number = 300): void {
  cache[key] = {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  }
}

/**
 * Remove an item from the cache
 */
export function invalidateCache(key: string): void {
  delete cache[key]
}
