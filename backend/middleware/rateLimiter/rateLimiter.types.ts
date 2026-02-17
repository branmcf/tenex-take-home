import type { RequestHandler } from 'express';

/**
 * Configuration options for rate limiter
 */
export interface RateLimiterConfig {

    // Maximum number of requests allowed in the window
    maxRequests: number;

    // Time window in seconds
    windowSeconds: number;

    // Custom key generator function (default: IP address)
    keyGenerator?: ( req: RateLimiterRequest ) => string;

    // Skip rate limiting for certain requests
    skip?: ( req: RateLimiterRequest ) => boolean;

    // Custom message for rate limit exceeded
    message?: string;

    // Include rate limit headers in response
    includeHeaders?: boolean;
}

/**
 * Minimal request interface for rate limiter
 */
export interface RateLimiterRequest {
    ip?: string;
    headers: Record<string, string | string[] | undefined>;
    path: string;
    method: string;
}

/**
 * Express middleware type for rate limiter
 */
export type RateLimiterMiddleware = RequestHandler;

/**
 * Rate limit info returned by the limiter
 */
export interface RateLimitInfo {

    // Whether the request is allowed
    allowed: boolean;

    // Number of requests remaining in the current window
    remaining: number;

    // Total requests allowed
    limit: number;

    // Time in seconds until the rate limit resets
    resetIn: number;

    // Number of requests made in the current window
    current: number;
}

/**
 * Preset rate limit configurations for common use cases
 */
export const RATE_LIMIT_PRESETS = {

    // Standard API endpoints
    standard: {
        maxRequests: 100
        , windowSeconds: 60
    } as RateLimiterConfig

    // Authentication endpoints (stricter)
    , auth: {
        maxRequests: 10
        , windowSeconds: 60
    } as RateLimiterConfig

    // LLM/AI endpoints (expensive operations)
    , llm: {
        maxRequests: 20
        , windowSeconds: 60
    } as RateLimiterConfig

    // Webhook endpoints (more lenient)
    , webhook: {
        maxRequests: 200
        , windowSeconds: 60
    } as RateLimiterConfig

    // Search endpoints
    , search: {
        maxRequests: 30
        , windowSeconds: 60
    } as RateLimiterConfig

} as const;
