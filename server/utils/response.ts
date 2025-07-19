import { Response } from 'express';

// Standard API response interface
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  timestamp: string;
}

// Response utility functions
export const response = {
  // Success response
  success<T>(res: Response, data?: T, message: string = 'Success', statusCode: number = 200): Response {
    const responseData: ApiResponse<T> = {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    };
    return res.status(statusCode).json(responseData);
  },

  // Error response
  error(res: Response, message: string = 'Error', statusCode: number = 500, errors?: string[]): Response {
    const responseData: ApiResponse = {
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString()
    };
    return res.status(statusCode).json(responseData);
  },

  // Validation error response
  validationError(res: Response, errors: string[], message: string = 'Validation failed'): Response {
    return response.error(res, message, 400, errors);
  },

  // Not found response
  notFound(res: Response, message: string = 'Resource not found'): Response {
    return response.error(res, message, 404);
  },

  // Unauthorized response
  unauthorized(res: Response, message: string = 'Unauthorized'): Response {
    return response.error(res, message, 401);
  },

  // Forbidden response
  forbidden(res: Response, message: string = 'Forbidden'): Response {
    return response.error(res, message, 403);
  },

  // Conflict response
  conflict(res: Response, message: string = 'Conflict'): Response {
    return response.error(res, message, 409);
  },

  // Too many requests response
  tooManyRequests(res: Response, message: string = 'Too many requests'): Response {
    return response.error(res, message, 429);
  },

  // Internal server error response
  internalError(res: Response, message: string = 'Internal server error'): Response {
    return response.error(res, message, 500);
  },

  // Paginated response
  paginated<T>(
    res: Response,
    data: T[],
    page: number,
    limit: number,
    total: number,
    message: string = 'Success'
  ): Response {
    const totalPages = Math.ceil(total / limit);
    const responseData: ApiResponse<T[]> = {
      success: true,
      message,
      data,
      meta: {
        page,
        limit,
        total,
        totalPages
      },
      timestamp: new Date().toISOString()
    };
    return res.status(200).json(responseData);
  },

  // Created response
  created<T>(res: Response, data: T, message: string = 'Created successfully'): Response {
    return response.success(res, data, message, 201);
  },

  // Updated response
  updated<T>(res: Response, data: T, message: string = 'Updated successfully'): Response {
    return response.success(res, data, message, 200);
  },

  // Deleted response
  deleted(res: Response, message: string = 'Deleted successfully'): Response {
    return response.success(res, undefined, message, 200);
  },

  // No content response
  noContent(res: Response): Response {
    return res.status(204).send();
  }
};

// HTTP status codes
export const httpStatus = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503
} as const;

// Error types
export enum ErrorType {
  VALIDATION = 'VALIDATION_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  AUTHORIZATION = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND_ERROR',
  CONFLICT = 'CONFLICT_ERROR',
  RATE_LIMIT = 'RATE_LIMIT_ERROR',
  SERVER = 'SERVER_ERROR',
  DATABASE = 'DATABASE_ERROR'
}

// Custom error class
export class ApiError extends Error {
  public statusCode: number;
  public type: ErrorType;
  public errors?: string[];

  constructor(
    message: string,
    statusCode: number = 500,
    type: ErrorType = ErrorType.SERVER,
    errors?: string[]
  ) {
    super(message);
    this.statusCode = statusCode;
    this.type = type;
    this.errors = errors;
    this.name = 'ApiError';
  }

  static validation(message: string, errors?: string[]): ApiError {
    return new ApiError(message, httpStatus.BAD_REQUEST, ErrorType.VALIDATION, errors);
  }

  static authentication(message: string = 'Authentication failed'): ApiError {
    return new ApiError(message, httpStatus.UNAUTHORIZED, ErrorType.AUTHENTICATION);
  }

  static authorization(message: string = 'Access denied'): ApiError {
    return new ApiError(message, httpStatus.FORBIDDEN, ErrorType.AUTHORIZATION);
  }

  static notFound(message: string = 'Resource not found'): ApiError {
    return new ApiError(message, httpStatus.NOT_FOUND, ErrorType.NOT_FOUND);
  }

  static conflict(message: string = 'Resource already exists'): ApiError {
    return new ApiError(message, httpStatus.CONFLICT, ErrorType.CONFLICT);
  }

  static rateLimit(message: string = 'Too many requests'): ApiError {
    return new ApiError(message, httpStatus.TOO_MANY_REQUESTS, ErrorType.RATE_LIMIT);
  }

  static server(message: string = 'Internal server error'): ApiError {
    return new ApiError(message, httpStatus.INTERNAL_SERVER_ERROR, ErrorType.SERVER);
  }

  static database(message: string = 'Database error'): ApiError {
    return new ApiError(message, httpStatus.INTERNAL_SERVER_ERROR, ErrorType.DATABASE);
  }
} 