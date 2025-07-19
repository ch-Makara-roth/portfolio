import { Request, Response, NextFunction } from 'express';
import { response } from '../utils/response';
import { password, token, userUtils } from '../utils/auth';
import { validate, userValidation } from '../utils/validation';
import { asyncHandler } from '../middleware/error';
import { UserService } from '../model/userModel';

// User controller class
export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  // Register a new user
  register = asyncHandler(async (req: Request, res: Response) => {
    const validationResult = validate.data(userValidation.register, req.body);
    if (!validationResult.success) {
      return response.validationError(res, validationResult.errors);
    }

    const { email, username, password: plainPassword, firstName, lastName, bio } = validationResult.data;

    // Check if user already exists
    const existingUser = await this.userService.findByEmailOrUsername(email, username);
    if (existingUser) {
      return response.conflict(res, 'User already exists');
    }

    // Hash password
    const hashedPassword = await password.hash(plainPassword);

    // Create user
    const user = await this.userService.create({
      email,
      username,
      password: hashedPassword,
      firstName,
      lastName,
      bio,
    });

    // Generate token
    const tokenPayload = userUtils.createTokenPayload(user);
    const accessToken = token.generate(tokenPayload);

    // Return sanitized user data
    const sanitizedUser = userUtils.sanitize(user);

    return response.created(res, {
      user: sanitizedUser,
      accessToken,
    }, 'User registered successfully');
  });

  // Login user
  login = asyncHandler(async (req: Request, res: Response) => {
    const validationResult = validate.data(userValidation.login, req.body);
    if (!validationResult.success) {
      return response.validationError(res, validationResult.errors);
    }

    const { email, password: plainPassword } = validationResult.data;

    // Find user by email
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return response.unauthorized(res, 'Invalid credentials');
    }

    // Check if account is active
    if (!user.isActive) {
      return response.unauthorized(res, 'Account is disabled');
    }

    // Verify password
    const isPasswordValid = await password.compare(plainPassword, user.password);
    if (!isPasswordValid) {
      return response.unauthorized(res, 'Invalid credentials');
    }

    // Generate token
    const tokenPayload = userUtils.createTokenPayload(user);
    const accessToken = token.generate(tokenPayload);

    // Return sanitized user data
    const sanitizedUser = userUtils.sanitize(user);

    return response.success(res, {
      user: sanitizedUser,
      accessToken,
    }, 'Login successful');
  });

  // Get current user profile
  getProfile = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return response.unauthorized(res, 'Authentication required');
    }

    const user = await this.userService.findById(req.user.id);
    if (!user) {
      return response.notFound(res, 'User not found');
    }

    const sanitizedUser = userUtils.sanitize(user);
    return response.success(res, { user: sanitizedUser }, 'Profile retrieved successfully');
  });

  // Update user profile
  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return response.unauthorized(res, 'Authentication required');
    }

    const validationResult = validate.data(userValidation.updateProfile, req.body);
    if (!validationResult.success) {
      return response.validationError(res, validationResult.errors);
    }

    const updatedUser = await this.userService.update(req.user.id, validationResult.data);
    const sanitizedUser = userUtils.sanitize(updatedUser);

    return response.updated(res, { user: sanitizedUser }, 'Profile updated successfully');
  });

  // Change password
  changePassword = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return response.unauthorized(res, 'Authentication required');
    }

    const validationResult = validate.data(userValidation.changePassword, req.body);
    if (!validationResult.success) {
      return response.validationError(res, validationResult.errors);
    }

    const { currentPassword, newPassword } = validationResult.data;

    // Get user with password
    const user = await this.userService.findById(req.user.id);
    if (!user) {
      return response.notFound(res, 'User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await password.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return response.unauthorized(res, 'Current password is incorrect');
    }

    // Hash new password
    const hashedNewPassword = await password.hash(newPassword);

    // Update password
    await this.userService.update(req.user.id, { password: hashedNewPassword });

    return response.success(res, undefined, 'Password changed successfully');
  });

  // Get user by ID
  getUserById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!validate.isValidUuid(id)) {
      return response.validationError(res, ['Invalid user ID']);
    }

    const user = await this.userService.findById(id);
    if (!user) {
      return response.notFound(res, 'User not found');
    }

    const sanitizedUser = userUtils.sanitize(user);
    return response.success(res, { user: sanitizedUser }, 'User retrieved successfully');
  });

  // Get all users (admin only)
  getUsers = asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, search } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const result = await this.userService.findMany({
      page: pageNum,
      limit: limitNum,
      search: search as string,
    });

    const sanitizedUsers = result.users.map(user => userUtils.sanitize(user));

    return response.paginated(
      res,
      sanitizedUsers,
      pageNum,
      limitNum,
      result.total,
      'Users retrieved successfully'
    );
  });

  // Delete user (admin only)
  deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!validate.isValidUuid(id)) {
      return response.validationError(res, ['Invalid user ID']);
    }

    const user = await this.userService.findById(id);
    if (!user) {
      return response.notFound(res, 'User not found');
    }

    await this.userService.delete(id);
    return response.deleted(res, 'User deleted successfully');
  });

  // Deactivate user account
  deactivateAccount = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return response.unauthorized(res, 'Authentication required');
    }

    await this.userService.update(req.user.id, { isActive: false });
    return response.success(res, undefined, 'Account deactivated successfully');
  });

  // Reactivate user account (admin only)
  reactivateAccount = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!validate.isValidUuid(id)) {
      return response.validationError(res, ['Invalid user ID']);
    }

    const user = await this.userService.findById(id);
    if (!user) {
      return response.notFound(res, 'User not found');
    }

    await this.userService.update(id, { isActive: true });
    return response.success(res, undefined, 'Account reactivated successfully');
  });

  // Get user statistics
  getUserStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await this.userService.getStats();
    return response.success(res, stats, 'User statistics retrieved successfully');
  });

  // Search users
  searchUsers = asyncHandler(async (req: Request, res: Response) => {
    const { q, page = 1, limit = 10 } = req.query;

    if (!q) {
      return response.validationError(res, ['Search query is required']);
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const result = await this.userService.search(q as string, pageNum, limitNum);
    const sanitizedUsers = result.users.map(user => userUtils.sanitize(user));

    return response.paginated(
      res,
      sanitizedUsers,
      pageNum,
      limitNum,
      result.total,
      'Search results retrieved successfully'
    );
  });

  // Get user followers
  getFollowers = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!validate.isValidUuid(id)) {
      return response.validationError(res, ['Invalid user ID']);
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const result = await this.userService.getFollowers(id, pageNum, limitNum);
    const sanitizedUsers = result.followers.map(user => userUtils.sanitize(user));

    return response.paginated(
      res,
      sanitizedUsers,
      pageNum,
      limitNum,
      result.total,
      'Followers retrieved successfully'
    );
  });

  // Get user following
  getFollowing = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!validate.isValidUuid(id)) {
      return response.validationError(res, ['Invalid user ID']);
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const result = await this.userService.getFollowing(id, pageNum, limitNum);
    const sanitizedUsers = result.following.map(user => userUtils.sanitize(user));

    return response.paginated(
      res,
      sanitizedUsers,
      pageNum,
      limitNum,
      result.total,
      'Following retrieved successfully'
    );
  });

  // Follow user
  followUser = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return response.unauthorized(res, 'Authentication required');
    }

    const { id } = req.params;

    if (!validate.isValidUuid(id)) {
      return response.validationError(res, ['Invalid user ID']);
    }

    if (req.user.id === id) {
      return response.validationError(res, ['Cannot follow yourself']);
    }

    const targetUser = await this.userService.findById(id);
    if (!targetUser) {
      return response.notFound(res, 'User not found');
    }

    await this.userService.followUser(req.user.id, id);
    return response.success(res, undefined, 'User followed successfully');
  });

  // Unfollow user
  unfollowUser = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return response.unauthorized(res, 'Authentication required');
    }

    const { id } = req.params;

    if (!validate.isValidUuid(id)) {
      return response.validationError(res, ['Invalid user ID']);
    }

    await this.userService.unfollowUser(req.user.id, id);
    return response.success(res, undefined, 'User unfollowed successfully');
  });
}

// Create controller instance
export const userController = new UserController();
