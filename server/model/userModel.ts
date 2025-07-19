import { Prisma } from '../generated/prisma';
import { User } from '../generated/prisma';
import { db } from '../database';

// User service class for database operations
export class UserService {
  // Create a new user
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return db.client.user.create({
      data,
    });
  }

  // Find user by ID
  async findById(id: string): Promise<User | null> {
    return db.client.user.findUnique({
      where: { id },
    });
  }

  // Find user by email
  async findByEmail(email: string): Promise<User | null> {
    return db.client.user.findUnique({
      where: { email },
    });
  }

  // Find user by username
  async findByUsername(username: string): Promise<User | null> {
    return db.client.user.findUnique({
      where: { username },
    });
  }

  // Find user by email or username
  async findByEmailOrUsername(email: string, username: string): Promise<User | null> {
    return db.client.user.findFirst({
      where: {
        OR: [
          { email },
          { username },
        ],
      },
    });
  }

  // Update user
  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return db.client.user.update({
      where: { id },
      data,
    });
  }

  // Delete user
  async delete(id: string): Promise<User> {
    return db.client.user.delete({
      where: { id },
    });
  }

  // Find many users with pagination
  async findMany(options: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    isActive?: boolean;
  }): Promise<{ users: User[]; total: number }> {
    const { page = 1, limit = 10, search, role, isActive } = options;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {};

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.role = role as any;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [users, total] = await Promise.all([
      db.client.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      db.client.user.count({ where }),
    ]);

    return { users, total };
  }

  // Search users
  async search(query: string, page: number = 1, limit: number = 10): Promise<{ users: User[]; total: number }> {
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      OR: [
        { email: { contains: query, mode: 'insensitive' } },
        { username: { contains: query, mode: 'insensitive' } },
        { firstName: { contains: query, mode: 'insensitive' } },
        { lastName: { contains: query, mode: 'insensitive' } },
      ],
      isActive: true,
    };

    const [users, total] = await Promise.all([
      db.client.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      db.client.user.count({ where }),
    ]);

    return { users, total };
  }

  // Get user statistics
  async getStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    admins: number;
    moderators: number;
    users: number;
  }> {
    const [total, active, inactive, admins, moderators, users] = await Promise.all([
      db.client.user.count(),
      db.client.user.count({ where: { isActive: true } }),
      db.client.user.count({ where: { isActive: false } }),
      db.client.user.count({ where: { role: 'ADMIN' } }),
      db.client.user.count({ where: { role: 'MODERATOR' } }),
      db.client.user.count({ where: { role: 'USER' } }),
    ]);

    return {
      total,
      active,
      inactive,
      admins,
      moderators,
      users,
    };
  }

  // Get user's followers
  async getFollowers(userId: string, page: number = 1, limit: number = 10): Promise<{ followers: User[]; total: number }> {
    const skip = (page - 1) * limit;

    const [followRecords, total] = await Promise.all([
      db.client.follow.findMany({
        where: { followingId: userId },
        skip,
        take: limit,
        include: {
          follower: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      db.client.follow.count({ where: { followingId: userId } }),
    ]);

    const followers = followRecords.map(record => record.follower);
    return { followers, total };
  }

  // Get user's following
  async getFollowing(userId: string, page: number = 1, limit: number = 10): Promise<{ following: User[]; total: number }> {
    const skip = (page - 1) * limit;

    const [followRecords, total] = await Promise.all([
      db.client.follow.findMany({
        where: { followerId: userId },
        skip,
        take: limit,
        include: {
          following: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      db.client.follow.count({ where: { followerId: userId } }),
    ]);

    const following = followRecords.map(record => record.following);
    return { following, total };
  }

  // Follow a user
  async followUser(followerId: string, followingId: string): Promise<void> {
    await db.client.follow.upsert({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
      create: {
        followerId,
        followingId,
      },
      update: {},
    });
  }

  // Unfollow a user
  async unfollowUser(followerId: string, followingId: string): Promise<void> {
    await db.client.follow.deleteMany({
      where: {
        followerId,
        followingId,
      },
    });
  }

  // Check if user is following another user
  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const follow = await db.client.follow.findFirst({
      where: {
        followerId,
        followingId,
      },
    });

    return !!follow;
  }

  // Get user's posts count
  async getPostsCount(userId: string): Promise<number> {
    return db.client.post.count({
      where: { authorId: userId },
    });
  }

  // Get user's followers count
  async getFollowersCount(userId: string): Promise<number> {
    return db.client.follow.count({
      where: { followingId: userId },
    });
  }

  // Get user's following count
  async getFollowingCount(userId: string): Promise<number> {
    return db.client.follow.count({
      where: { followerId: userId },
    });
  }

  // Get user with counts
  async getUserWithCounts(userId: string): Promise<{
    user: User | null;
    postsCount: number;
    followersCount: number;
    followingCount: number;
  }> {
    const [user, postsCount, followersCount, followingCount] = await Promise.all([
      this.findById(userId),
      this.getPostsCount(userId),
      this.getFollowersCount(userId),
      this.getFollowingCount(userId),
    ]);

    return {
      user,
      postsCount,
      followersCount,
      followingCount,
    };
  }

  // Bulk operations
  async bulkCreate(users: Prisma.UserCreateInput[]): Promise<number> {
    const result = await db.client.user.createMany({
      data: users,
      skipDuplicates: true,
    });

    return result.count;
  }

  // Bulk delete
  async bulkDelete(userIds: string[]): Promise<number> {
    const result = await db.client.user.deleteMany({
      where: {
        id: {
          in: userIds,
        },
      },
    });

    return result.count;
  }

  // Bulk update
  async bulkUpdate(userIds: string[], data: Prisma.UserUpdateInput): Promise<number> {
    const result = await db.client.user.updateMany({
      where: {
        id: {
          in: userIds,
        },
      },
      data,
    });

    return result.count;
  }
}
