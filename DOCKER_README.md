# Portfolio Docker Setup

This setup provides a complete Docker environment for your portfolio application with frontend (Next.js), backend (Express + Bun), and PostgreSQL database.

## Services

- **Frontend**: Next.js application (http://localhost:3000)
- **Backend**: Express API server (http://localhost:3001)
- **Database**: PostgreSQL database (port 5432)
- **Redis**: Redis cache (port 6379) - optional

## Quick Start

1. **Clone and navigate to the project:**
   ```bash
   cd portfolio
   ```

2. **Build and start all services:**
   ```bash
   docker-compose up --build
   ```

3. **Access the applications:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Health Check: http://localhost:3001/health

## Environment Variables

Create a `.env` file in the root directory with:

```env
# Database Configuration
DATABASE_URL=postgresql://portfolio_user:portfolio_password@database:5432/portfolio

# Server Configuration
PORT=3000
NODE_ENV=production

# Next.js Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# JWT Secret (generate a secure random string)
JWT_SECRET=your-super-secure-jwt-secret-key-here
```

## Available Commands

```bash
# Start all services
docker-compose up

# Start in detached mode
docker-compose up -d

# Build and start
docker-compose up --build

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# View logs
docker-compose logs

# View logs for specific service
docker-compose logs frontend
docker-compose logs backend
docker-compose logs database
```

## Development Mode

For development with hot reload:

```bash
# Frontend only
cd chhuonmakararoth && npm run dev

# Backend only
cd server && bun run dev

# Or use Docker with volume mounts (already configured)
docker-compose up
```

## Database Management

```bash
# Run database migrations
docker-compose exec backend bun run db:migrate

# Generate Prisma client
docker-compose exec backend bun run db:generate

# Open Prisma Studio
docker-compose exec backend bun run db:studio
```

## Troubleshooting

1. **Port conflicts**: Make sure ports 3000, 3001, and 5432 are available
2. **Database connection**: Wait for database health check to pass before backend starts
3. **Build issues**: Try `docker-compose down -v` and `docker-compose up --build`
4. **Logs**: Use `docker-compose logs [service-name]` to debug issues

## Production Deployment

For production deployment:

1. Update environment variables in `.env`
2. Set `NODE_ENV=production`
3. Use proper secrets for `JWT_SECRET`
4. Configure proper database credentials
5. Consider using Docker Swarm or Kubernetes for scaling 