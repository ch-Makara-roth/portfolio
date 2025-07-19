import { PrismaClient } from '../generated/prisma';

// Global variable to store the Prisma client instance
declare global {
  var prisma: PrismaClient | undefined;
}

// Create a single instance of PrismaClient
const prisma = globalThis.prisma || new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// In development, store the client in the global object to prevent multiple instances
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

// Database connection utility functions
export const db = {
  // Get the Prisma client instance
  client: prisma,

  // Test database connection
  async connect() {
    try {
      await prisma.$connect();
      console.log('✅ Database connected successfully');
      return true;
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      return false;
    }
  },

  // Disconnect from database
  async disconnect() {
    try {
      await prisma.$disconnect();
      console.log('✅ Database disconnected successfully');
    } catch (error) {
      console.error('❌ Database disconnection failed:', error);
    }
  },

  // Health check
  async healthCheck() {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return {
        status: 'healthy',
        message: 'Database connection is working',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: error instanceof Error ? error.message : 'Unknown database error',
        timestamp: new Date().toISOString(),
      };
    }
  },

  // Reset database (use with caution!)
  async reset() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot reset database in production');
    }
    
    try {
      await prisma.$executeRaw`TRUNCATE TABLE "users", "posts", "comments", "likes", "follows" RESTART IDENTITY CASCADE`;
      console.log('✅ Database reset successfully');
    } catch (error) {
      console.error('❌ Database reset failed:', error);
      throw error;
    }
  }
};

// Export the Prisma client as default
export default prisma;

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Received SIGINT, disconnecting from database...');
  await db.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, disconnecting from database...');
  await db.disconnect();
  process.exit(0);
}); 