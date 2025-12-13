/**
 * Rate Limiting Utility
 * Simple in-memory rate limiting (for small scale, can be upgraded to Redis)
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Cleanup expired entries every minute
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.store.entries()) {
        if (entry.resetAt < now) {
          this.store.delete(key);
        }
      }
    }, 60000);
  }

  /**
   * Check if request should be rate limited
   */
  check(
    identifier: string,
    maxRequests: number,
    windowSeconds: number
  ): { limited: boolean; remaining: number; resetAt: number } {
    const now = Date.now();
    const entry = this.store.get(identifier);

    // No entry or expired
    if (!entry || entry.resetAt < now) {
      this.store.set(identifier, {
        count: 1,
        resetAt: now + windowSeconds * 1000,
      });

      return {
        limited: false,
        remaining: maxRequests - 1,
        resetAt: now + windowSeconds * 1000,
      };
    }

    // Entry exists and not expired
    if (entry.count >= maxRequests) {
      return {
        limited: true,
        remaining: 0,
        resetAt: entry.resetAt,
      };
    }

    // Increment count
    entry.count++;
    this.store.set(identifier, entry);

    return {
      limited: false,
      remaining: maxRequests - entry.count,
      resetAt: entry.resetAt,
    };
  }

  /**
   * Reset limit for identifier (admin override)
   */
  reset(identifier: string): void {
    this.store.delete(identifier);
  }

  /**
   * Cleanup on shutdown
   */
  destroy(): void {
    clearInterval(this.cleanupInterval);
  }
}

export const rateLimiter = new RateLimiter();

/**
 * Rate limit middleware for API routes
 */
export function createRateLimitMiddleware(maxRequests: number, windowSeconds: number) {
  return (identifier: string) => {
    const result = rateLimiter.check(identifier, maxRequests, windowSeconds);

    if (result.limited) {
      const waitSeconds = Math.ceil((result.resetAt - Date.now()) / 1000);
      throw new Error(
        `Rate limit exceeded. Try again in ${waitSeconds} seconds. (Max: ${maxRequests} requests per ${windowSeconds}s)`
      );
    }

    return result;
  };
}
