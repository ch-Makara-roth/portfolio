import { Request, Response, NextFunction } from 'express';
import { response, ApiError, ErrorType } from '../utils/response';

// Error handling middleware
export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
    user: req.user?.id || 'anonymous'
  });

  // Handle known API errors
  if (error instanceof ApiError) {
    return response.error(res, error.message, error.statusCode, error.errors);
  }

  // Handle Prisma errors
  if (error.name === 'PrismaClientKnownRequestError') {
    return handlePrismaError(error as any, res);
  }

  // Handle validation errors
  if (error.name === 'ValidationError') {
    return response.validationError(res, [error.message]);
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    return response.unauthorized(res, 'Invalid token');
  }

  if (error.name === 'TokenExpiredError') {
    return response.unauthorized(res, 'Token expired');
  }

  // Handle multer errors (file upload)
  if (error.name === 'MulterError') {
    return handleMulterError(error as any, res);
  }

  // Handle syntax errors (malformed JSON)
  if (error instanceof SyntaxError && 'body' in error) {
    return response.validationError(res, ['Invalid JSON format']);
  }

  // Handle other errors
  return response.internalError(res, 'Something went wrong');
};

// Handle Prisma database errors
const handlePrismaError = (error: any, res: Response) => {
  const { code, meta } = error;

  switch (code) {
    case 'P2002':
      // Unique constraint violation
      const field = meta?.target?.[0] || 'field';
      return response.conflict(res, `${field} already exists`);

    case 'P2025':
      // Record not found
      return response.notFound(res, 'Record not found');

    case 'P2003':
      // Foreign key constraint violation
      return response.validationError(res, ['Invalid reference']);

    case 'P2014':
      // Required relation violation
      return response.validationError(res, ['Required relation missing']);

    case 'P1001':
      // Database connection error
      return response.internalError(res, 'Database connection failed');

    default:
      return response.internalError(res, 'Database operation failed');
  }
};

// Handle multer file upload errors
const handleMulterError = (error: any, res: Response) => {
  switch (error.code) {
    case 'LIMIT_FILE_SIZE':
      return response.validationError(res, ['File too large']);

    case 'LIMIT_FILE_COUNT':
      return response.validationError(res, ['Too many files']);

    case 'LIMIT_UNEXPECTED_FILE':
      return response.validationError(res, ['Unexpected file field']);

    default:
      return response.validationError(res, ['File upload error']);
  }
};

// Not found middleware (404)
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  return response.notFound(res, `Route ${req.originalUrl} not found`);
};

// Async error wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Development error handler (shows stack traces)
export const devErrorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Development error:', error);

  const errorResponse = {
    success: false,
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  };

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json(errorResponse);
  }

  return res.status(500).json(errorResponse);
};

// Production error handler (hides stack traces)
export const prodErrorHandler = errorHandler;

// Create error
export const createError = (message: string, statusCode: number = 500, type: ErrorType = ErrorType.SERVER) => {
  return new ApiError(message, statusCode, type);
}; 