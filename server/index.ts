import express, { Request, Response } from "express";
import cors from "cors";
import { db } from "./database";
import { PORT, NODE_ENV, DATABASE_URL } from "./config/env";
import { response } from "./utils/response";
import { errorHandler, notFoundHandler } from "./middleware/error";

// Routes
import userRoutes from "./routes/userRoutes";

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req: Request, res: Response, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/v1/users', userRoutes);

// Root endpoint
app.get("/", (req: Request, res: Response) => {
  return response.success(res, {
    message: "Portfolio API Server",
    version: "1.0.0",
    environment: NODE_ENV,
    database: DATABASE_URL ? "Connected" : "Not configured",
    endpoints: {
      health: "/health",
      users: "/api/v1/users",
    },
  }, "API Server is running");
});

// Health check endpoint
app.get("/health", async (req: Request, res: Response) => {
  try {
    const dbHealth = await db.healthCheck();
    return response.success(res, {
      status: "healthy",
      database: dbHealth.status,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    }, "Health check passed");
  } catch (error) {
    return response.internalError(res, "Health check failed");
  }
});

// API info endpoint
app.get("/api/v1", (req: Request, res: Response) => {
  return response.success(res, {
    message: "Portfolio API v1",
    version: "1.0.0",
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
    endpoints: {
      users: "/api/v1/users",
      health: "/health",
    },
  }, "API information");
});

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize database connection
async function initializeApp() {
  try {
    // Connect to database
    await db.connect();
    console.log("✅ Database connected successfully");
    
    // Start server
    const server = app.listen(Number(PORT) || 3000, () => {
      console.log(`🚀 Server is running on URL: http://localhost:${PORT}`);
      console.log(`🌍 Environment: ${NODE_ENV}`);
      console.log(`📊 Database: ${DATABASE_URL ? "Connected" : "Not configured"}`);
      console.log(`📝 API Documentation: http://localhost:${PORT}/api/v1`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n${signal} received, shutting down gracefully...`);
      
      server.close(async () => {
        try {
          await db.disconnect();
          console.log("✅ Database disconnected successfully");
          process.exit(0);
        } catch (error) {
          console.error("❌ Error during shutdown:", error);
          process.exit(1);
        }
      });
    };

    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

  } catch (error) {
    console.error("❌ Failed to initialize application:", error);
    process.exit(1);
  }
}

// Start the application
initializeApp();