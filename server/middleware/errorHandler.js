import { sendError, ERROR_MESSAGES, ERROR_CODES } from '../utils/errorResponse.js'

export const errorHandler = (err, _req, res, _next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    return sendError(res, 404, ERROR_MESSAGES.RESOURCE_NOT_FOUND, null, ERROR_CODES.NOT_FOUND_ERROR);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    return sendError(res, 400, ERROR_MESSAGES.DUPLICATE_RESOURCE, null, ERROR_CODES.VALIDATION_ERROR);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const validationErrors = Object.values(err.errors)
      .map((val) => ({
        field: val.path,
        message: val.message,
        value: val.value
      }));
    return sendError(res, 400, ERROR_MESSAGES.VALIDATION_FAILED, { validationErrors }, ERROR_CODES.VALIDATION_ERROR);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return sendError(res, 401, ERROR_MESSAGES.INVALID_TOKEN, null, ERROR_CODES.AUTH_ERROR);
  }

  if (err.name === "TokenExpiredError") {
    return sendError(res, 401, ERROR_MESSAGES.TOKEN_EXPIRED, null, ERROR_CODES.AUTH_ERROR);
  }

  // Rate limiting errors
  if (err.status === 429) {
    return sendError(res, 429, ERROR_MESSAGES.RATE_LIMIT_EXCEEDED, null, ERROR_CODES.RATE_LIMIT_ERROR);
  }

  // Default server error
  return sendError(res, error.statusCode || 500, error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR, {
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  }, ERROR_CODES.SERVER_ERROR);
};
