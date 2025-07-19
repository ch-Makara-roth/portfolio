import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { response } from '../utils/response';
import { validate } from '../utils/validation';

// Generic validation middleware
export const validateRequest = <T>(schema: z.ZodSchema<T>, target: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = target === 'body' ? req.body : target === 'query' ? req.query : req.params;
    
    const result = validate.data(schema, data);
    
    if (!result.success) {
      return response.validationError(res, result.errors);
    }

    // Replace the original data with validated data
    if (target === 'body') {
      req.body = result.data;
    } else if (target === 'query') {
      req.query = result.data as any;
    } else {
      req.params = result.data as any;
    }

    next();
  };
};

// Body validation middleware
export const validateBody = <T>(schema: z.ZodSchema<T>) => {
  return validateRequest(schema, 'body');
};

// Query validation middleware
export const validateQuery = <T>(schema: z.ZodSchema<T>) => {
  return validateRequest(schema, 'query');
};

// Params validation middleware
export const validateParams = <T>(schema: z.ZodSchema<T>) => {
  return validateRequest(schema, 'params');
};

// File upload validation middleware
export const validateFile = (
  fieldName: string,
  options: {
    required?: boolean;
    maxSize?: number; // in bytes
    allowedTypes?: string[];
  } = {}
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const file = req.file;
    const { required = false, maxSize = 5 * 1024 * 1024, allowedTypes = [] } = options;

    if (required && !file) {
      return response.validationError(res, [`${fieldName} is required`]);
    }

    if (file) {
      // Check file size
      if (file.size > maxSize) {
        return response.validationError(res, [
          `${fieldName} size must be less than ${maxSize / 1024 / 1024}MB`
        ]);
      }

      // Check file type
      if (allowedTypes.length > 0 && !allowedTypes.includes(file.mimetype)) {
        return response.validationError(res, [
          `${fieldName} must be one of: ${allowedTypes.join(', ')}`
        ]);
      }
    }

    next();
  };
};

// Multi-file upload validation middleware
export const validateFiles = (
  fieldName: string,
  options: {
    required?: boolean;
    maxCount?: number;
    maxSize?: number;
    allowedTypes?: string[];
  } = {}
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as Express.Multer.File[];
    const { required = false, maxCount = 5, maxSize = 5 * 1024 * 1024, allowedTypes = [] } = options;

    if (required && (!files || files.length === 0)) {
      return response.validationError(res, [`${fieldName} is required`]);
    }

    if (files && files.length > 0) {
      // Check file count
      if (files.length > maxCount) {
        return response.validationError(res, [
          `Cannot upload more than ${maxCount} files`
        ]);
      }

      // Check each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Check file size
        if (file.size > maxSize) {
          return response.validationError(res, [
            `File ${i + 1} size must be less than ${maxSize / 1024 / 1024}MB`
          ]);
        }

        // Check file type
        if (allowedTypes.length > 0 && !allowedTypes.includes(file.mimetype)) {
          return response.validationError(res, [
            `File ${i + 1} must be one of: ${allowedTypes.join(', ')}`
          ]);
        }
      }
    }

    next();
  };
};

// Content-Type validation middleware
export const validateContentType = (allowedTypes: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const contentType = req.headers['content-type'];
    
    if (!contentType) {
      return response.validationError(res, ['Content-Type header is required']);
    }

    const isValidType = allowedTypes.some(type => contentType.includes(type));
    
    if (!isValidType) {
      return response.validationError(res, [
        `Content-Type must be one of: ${allowedTypes.join(', ')}`
      ]);
    }

    next();
  };
};

// JSON content type validation
export const validateJsonContent = validateContentType(['application/json']);

// Form data content type validation
export const validateFormContent = validateContentType(['application/x-www-form-urlencoded', 'multipart/form-data']);

// Sanitize input middleware
export const sanitizeInput = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fields.forEach(field => {
      if (req.body[field] && typeof req.body[field] === 'string') {
        // Basic sanitization
        req.body[field] = req.body[field]
          .trim()
          .replace(/[<>]/g, '') // Remove basic HTML tags
          .replace(/javascript:/gi, '') // Remove javascript: protocol
          .replace(/on\w+=/gi, ''); // Remove event handlers
      }
    });

    next();
  };
};

// Rate limiting validation middleware
export const validateRateLimit = (windowMs: number, maxRequests: number) => {
  const requests = new Map<string, { count: number; resetTime: number }>();

  return (req: Request, res: Response, next: NextFunction) => {
    const clientId = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean up old entries
    for (const [key, value] of requests.entries()) {
      if (value.resetTime < windowStart) {
        requests.delete(key);
      }
    }

    // Get or create client record
    const clientRecord = requests.get(clientId) || { count: 0, resetTime: now + windowMs };

    // Check if within rate limit
    if (clientRecord.count >= maxRequests) {
      return response.tooManyRequests(res, 'Too many requests');
    }

    // Update client record
    clientRecord.count++;
    requests.set(clientId, clientRecord);

    next();
  };
}; 