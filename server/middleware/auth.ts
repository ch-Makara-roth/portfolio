import { Request, Response, NextFunction } from 'express';
import { token } from '../utils/auth';
import { response, ApiError } from '../utils/response';
import { db } from '../database';
import { User } from '../generated/prisma';

// Authentication middleware
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    const jwtToken = token.extractFromHeader(authHeader);

    if (!jwtToken) {
      return response.unauthorized(res, 'Access token required');
    }

    // Verify token
    const payload = token.verify(jwtToken);
    if (!payload) {
      return response.unauthorized(res, 'Invalid or expired token');
    }

    // Get user from database
    const user = await db.client.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        bio: true,
        isActive: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return response.unauthorized(res, 'User not found');
    }

    if (!user.isActive) {
      return response.unauthorized(res, 'Account is disabled');
    }

    // Attach user to request
    req.user = user as User;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return response.unauthorized(res, 'Authentication failed');
  }
};

// Optional authentication middleware
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const jwtToken = token.extractFromHeader(authHeader);

    if (jwtToken) {
      const payload = token.verify(jwtToken);
      if (payload) {
        const user = await db.client.user.findUnique({
          where: { id: payload.id },
          select: {
            id: true,
            email: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
            bio: true,
            isActive: true,
            role: true,
            createdAt: true,
            updatedAt: true
          }
        });

        if (user && user.isActive) {
          req.user = user as User;
        }
      }
    }

    next();
  } catch (error) {
    console.error('Optional authentication error:', error);
    next();
  }
};

// Role-based authorization middleware
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return response.unauthorized(res, 'Authentication required');
    }

    if (!roles.includes(req.user.role)) {
      return response.forbidden(res, 'Insufficient permissions');
    }

    next();
  };
};

// Admin authorization middleware
export const requireAdmin = authorize(['ADMIN']);

// Moderator or admin authorization middleware
export const requireModerator = authorize(['MODERATOR', 'ADMIN']);

// Owner or admin authorization middleware
export const requireOwnerOrAdmin = (getUserId: (req: Request) => string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return response.unauthorized(res, 'Authentication required');
    }

    const resourceUserId = getUserId(req);
    const isOwner = req.user.id === resourceUserId;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return response.forbidden(res, 'Access denied');
    }

    next();
  };
};

// Check if user is authenticated
export const isAuthenticated = (req: Request): boolean => {
  return !!req.user;
};

// Check if user has role
export const hasRole = (req: Request, role: string): boolean => {
  return req.user?.role === role;
};

// Check if user is admin
export const isAdmin = (req: Request): boolean => {
  return hasRole(req, 'ADMIN');
};

// Check if user is moderator
export const isModerator = (req: Request): boolean => {
  return hasRole(req, 'MODERATOR') || isAdmin(req);
};

// Check if user is owner of resource
export const isOwner = (req: Request, resourceUserId: string): boolean => {
  return req.user?.id === resourceUserId;
};

// Check if user can access resource
export const canAccess = (req: Request, resourceUserId: string): boolean => {
  return isOwner(req, resourceUserId) || isAdmin(req);
}; 