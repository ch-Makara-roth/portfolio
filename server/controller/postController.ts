import { Request, Response } from 'express';
import { db } from '../database';
import { response } from '../utils/response';

export const postController = {
  // Get all published posts
  async getPosts(req: Request, res: Response) {
    try {
      const posts = await db.client.post.findMany({
        where: { published: true },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              comments: true,
              likes: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return response.success(res, 'Posts fetched successfully', posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      return response.error(res, 'Failed to fetch posts');
    }
  },

  // Get featured posts
  async getFeaturedPosts(req: Request, res: Response) {
    try {
      const posts = await db.client.post.findMany({
        where: { 
          published: true,
          featured: true 
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              comments: true,
              likes: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      });

      return response.success(res, 'Featured posts fetched successfully', posts);
    } catch (error) {
      console.error('Error fetching featured posts:', error);
      return response.error(res, 'Failed to fetch featured posts');
    }
  },

  // Get post by slug
  async getPostBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      
      const post = await db.client.post.findUnique({
        where: { slug },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
              bio: true,
            },
          },
          comments: {
            include: {
              author: {
                select: {
                  id: true,
                  username: true,
                  firstName: true,
                  lastName: true,
                  avatar: true,
                },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
          _count: {
            select: {
              comments: true,
              likes: true,
            },
          },
        },
      });

      if (!post) {
        return response.error(res, 'Post not found', 404);
      }

      return response.success(res, 'Post fetched successfully', post);
    } catch (error) {
      console.error('Error fetching post:', error);
      return response.error(res, 'Failed to fetch post');
    }
  },
};
