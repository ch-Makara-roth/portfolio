import { Router } from 'express';
import { userController } from '../controller/userController';
import { authenticate, optionalAuth, requireAdmin, requireModerator } from '../middleware/auth';
import { validateBody, validateQuery, validateParams } from '../middleware/validation';
import { userValidation, queryValidation } from '../utils/validation';

const router = Router();

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes (require authentication)
router.get('/profile', authenticate, userController.getProfile);
router.put('/profile', authenticate, userController.updateProfile);
router.put('/password', authenticate, userController.changePassword);
router.delete('/deactivate', authenticate, userController.deactivateAccount);

// User interactions
router.get('/search', optionalAuth, userController.searchUsers);
router.get('/:id', optionalAuth, validateParams(queryValidation.id), userController.getUserById);
router.get('/:id/followers', optionalAuth, validateParams(queryValidation.id), userController.getFollowers);
router.get('/:id/following', optionalAuth, validateParams(queryValidation.id), userController.getFollowing);

// Follow/unfollow routes
router.post('/:id/follow', authenticate, validateParams(queryValidation.id), userController.followUser);
router.delete('/:id/follow', authenticate, validateParams(queryValidation.id), userController.unfollowUser);

// Admin routes
router.get('/', authenticate, requireAdmin, userController.getUsers);
router.get('/stats/overview', authenticate, requireAdmin, userController.getUserStats);
router.delete('/:id', authenticate, requireAdmin, validateParams(queryValidation.id), userController.deleteUser);
router.put('/:id/reactivate', authenticate, requireAdmin, validateParams(queryValidation.id), userController.reactivateAccount);

export default router;
