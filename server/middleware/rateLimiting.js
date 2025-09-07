import rateLimit from 'express-rate-limit'

// Create rate limiter factory
export const createRateLimiter = (windowMs, max, message, skipSuccessfulRequests = false) => {
  return rateLimit({
    windowMs,
    max,
    message: { 
      success: false, 
      message,
      retryAfter: Math.ceil(windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message,
        retryAfter: Math.ceil(windowMs / 1000),
        limit: max,
        windowMs
      })
    }
  })
}

// Authentication rate limiting (stricter)
export const authLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // 5 attempts
  'Too many authentication attempts. Please try again later.',
  true // Skip successful requests
)

// API rate limiting (general)
export const apiLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests
  'Too many API requests. Please try again later.'
)

// Upload rate limiting
export const uploadLimiter = createRateLimiter(
  60 * 1000, // 1 minute
  10, // 10 uploads
  'Too many upload attempts. Please try again later.'
)

// Interview creation limiting
export const interviewLimiter = createRateLimiter(
  60 * 1000, // 1 minute
  5, // 5 interviews
  'Too many interview creation attempts. Please try again later.'
)

// Admin operations limiting
export const adminLimiter = createRateLimiter(
  60 * 1000, // 1 minute
  30, // 30 requests
  'Too many admin requests. Please try again later.'
)

// Payment operations limiting
export const paymentLimiter = createRateLimiter(
  60 * 1000, // 1 minute
  3, // 3 payment attempts
  'Too many payment attempts. Please try again later.'
)

export default {
  createRateLimiter,
  authLimiter,
  apiLimiter,
  uploadLimiter,
  interviewLimiter,
  adminLimiter,
  paymentLimiter
}