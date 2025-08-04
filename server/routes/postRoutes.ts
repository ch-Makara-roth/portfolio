import { Router } from 'express';
import { postController } from '../controller/postController';

const router = Router();

// Public routes
router.get('/', postController.getPosts);
router.get('/featured', postController.getFeaturedPosts);
router.get('/:slug', postController.getPostBySlug);

export default router;
