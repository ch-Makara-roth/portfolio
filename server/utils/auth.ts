import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../generated/prisma';

// JWT secret from environment variables
const JWT_SECRET: string = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '7d';

// Password utilities
export const password = {
  // Hash a password
  async hash(plainPassword: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(plainPassword, saltRounds);
  },

  // Compare password with hash
  async compare(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  },

  // Generate a random password
  generate(length: number = 12): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  }
};

// JWT token utilities
export const token = {
  // Generate JWT token
  generate(payload: { id: string; email: string; role: string }): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
  },

  // Verify JWT token
  verify(token: string): { id: string; email: string; role: string } | null {
    try {
      return jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
    } catch (error) {
      return null;
    }
  },

  // Generate refresh token
  generateRefresh(payload: { id: string }): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
  },

  // Extract token from authorization header
  extractFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }
};

// User utilities
export const userUtils = {
  // Generate username from email
  generateUsername(email: string): string {
    const baseUsername = email.split('@')[0];
    const randomSuffix = Math.floor(Math.random() * 1000);
    return `${baseUsername}${randomSuffix}`;
  },

  // Create user payload for JWT
  createTokenPayload(user: User): { id: string; email: string; role: string } {
    return {
      id: user.id,
      email: user.email,
      role: user.role
    };
  },

  // Sanitize user data (remove sensitive info)
  sanitize(user: User): Omit<User, 'password'> {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}; 