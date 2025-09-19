/**
 * Standardized error response utility
 * Ensures consistent error format across all API routes
 */

/**
 * Send standardized error response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {Object} details - Additional error details (optional)
 * @param {string} code - Error code for client handling (optional)
 */
export const sendError = (res, statusCode, message, details = null, code = null) => {
  const errorResponse = {
    success: false,
    error: {
      message,
      statusCode,
      timestamp: new Date().toISOString(),
      ...(details && { details }),
      ...(code && { code })
    }
  }

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development' && details?.stack) {
    errorResponse.error.stack = details.stack
  }

  return res.status(statusCode).json(errorResponse)
}

/**
 * Send standardized success response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code (default: 200)
 * @param {string} message - Success message
 * @param {Object} data - Response data (optional)
 * @param {Object} meta - Additional metadata (optional)
 */
export const sendSuccess = (res, message, data = null, statusCode = 200, meta = null) => {
  const response = {
    success: true,
    message,
    timestamp: new Date().toISOString(),
    ...(data && { data }),
    ...(meta && { meta })
  }

  return res.status(statusCode).json(response)
}

/**
 * Send validation error response
 * @param {Object} res - Express response object
 * @param {Array} errors - Validation errors array
 */
export const sendValidationError = (res, errors) => {
  return sendError(res, 400, 'Validation failed', { validationErrors: errors }, 'VALIDATION_ERROR')
}

/**
 * Send authentication error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message (optional)
 */
export const sendAuthError = (res, message = 'Authentication required') => {
  return sendError(res, 401, message, null, 'AUTH_ERROR')
}

/**
 * Send authorization error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message (optional)
 */
export const sendForbiddenError = (res, message = 'Insufficient permissions') => {
  return sendError(res, 403, message, null, 'FORBIDDEN_ERROR')
}

/**
 * Send not found error response
 * @param {Object} res - Express response object
 * @param {string} resource - Resource name (optional)
 */
export const sendNotFoundError = (res, resource = 'Resource') => {
  return sendError(res, 404, `${resource} not found`, null, 'NOT_FOUND_ERROR')
}

/**
 * Send rate limit error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message (optional)
 */
export const sendRateLimitError = (res, message = 'Too many requests') => {
  return sendError(res, 429, message, null, 'RATE_LIMIT_ERROR')
}

/**
 * Send server error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message (optional)
 * @param {Object} details - Error details (optional)
 */
export const sendServerError = (res, message = 'Internal server error', details = null) => {
  return sendError(res, 500, message, details, 'SERVER_ERROR')
}

/**
 * Send service unavailable error response
 * @param {Object} res - Express response object
 * @param {string} service - Service name (optional)
 */
export const sendServiceUnavailableError = (res, service = 'Service') => {
  return sendError(res, 503, `${service} temporarily unavailable`, null, 'SERVICE_UNAVAILABLE_ERROR')
}

/**
 * Common error messages
 */
export const ERROR_MESSAGES = {
  VALIDATION_FAILED: 'Validation failed',
  AUTHENTICATION_REQUIRED: 'Authentication required',
  INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',
  RESOURCE_NOT_FOUND: 'Resource not found',
  RATE_LIMIT_EXCEEDED: 'Too many requests',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  SERVICE_UNAVAILABLE: 'Service temporarily unavailable',
  INVALID_CREDENTIALS: 'Invalid credentials',
  ACCOUNT_DEACTIVATED: 'Account is deactivated',
  TOKEN_EXPIRED: 'Token expired',
  INVALID_TOKEN: 'Invalid token',
  DUPLICATE_RESOURCE: 'Resource already exists',
  PAYMENT_FAILED: 'Payment processing failed',
  WEBHOOK_VERIFICATION_FAILED: 'Webhook verification failed'
}

/**
 * Common error codes
 */
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  FORBIDDEN_ERROR: 'FORBIDDEN_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  SERVICE_UNAVAILABLE_ERROR: 'SERVICE_UNAVAILABLE_ERROR',
  PAYMENT_ERROR: 'PAYMENT_ERROR',
  WEBHOOK_ERROR: 'WEBHOOK_ERROR'
}

export default {
  sendError,
  sendSuccess,
  sendValidationError,
  sendAuthError,
  sendForbiddenError,
  sendNotFoundError,
  sendRateLimitError,
  sendServerError,
  sendServiceUnavailableError,
  ERROR_MESSAGES,
  ERROR_CODES
}
