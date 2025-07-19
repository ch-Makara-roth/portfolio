import dotenv from "dotenv";

// Load environment variables
dotenv.config({
  path: `.env.${process.env.NODE_ENV || "development"}.local`
});

// If no local env file, try default .env file
if (!process.env.DATABASE_URL) {
  dotenv.config();
}

export const {
  PORT,
  NODE_ENV,
  DATABASE_URL,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD
} = process.env;