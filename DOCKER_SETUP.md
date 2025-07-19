# Portfolio Docker Setup - Complete Guide

## 🚀 **Quick Start**

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

## 📦 **Services Overview**

| Service | Port | URL | Description |
|---------|------|-----|-------------|
| Frontend | 3000 | http://localhost:3000 | Next.js application |
| Backend | 3001 | http://localhost:3001 | Express API server |
| Database | 5432 | localhost:5432 | PostgreSQL database |
| Redis | 6379 | localhost:6379 | Redis cache |

## 🔧 **Service Communication**

### Frontend → Backend
- **Inside Docker**: `http://backend:3000`
- **From Host**: `http://localhost:3001`

### Backend → Database
- **Connection**: `postgresql://portfolio_user:portfolio_password@database:5432/portfolio`

### Backend → Redis
- **Connection**: `redis://redis:6379`

## 📋 **Environment Variables**

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL=postgresql://portfolio_user:portfolio_password@database:5432/portfolio

# Server Configuration
PORT=3000
NODE_ENV=production

# Next.js Configuration (for host access)
NEXT_PUBLIC_API_URL=http://localhost:3001

# JWT Secret
JWT_SECRET=your-super-secure-jwt-secret-key-here

# Redis Configuration
REDIS_URL=redis://redis:6379
```

## 🛠️ **Docker Commands**

### Basic Operations
```bash
# Start all services
docker-compose up

# Start with rebuild
docker-compose up --build

# Start in background
docker-compose up -d

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# View logs
docker-compose logs

# View specific service logs
docker-compose logs frontend
docker-compose logs backend
docker-compose logs database
```

### Development Commands
```bash
# Rebuild specific service
docker-compose build frontend
docker-compose build backend

# Restart specific service
docker-compose restart frontend
docker-compose restart backend

# Execute commands in running container
docker-compose exec backend bun run db:generate
docker-compose exec backend bun run db:migrate
```

## 🔍 **Health Checks**

All services include health checks:

- **Backend**: `curl -f http://localhost:3000/health`
- **Database**: `pg_isready -U portfolio_user -d portfolio`
- **Redis**: `redis-cli ping`

## 🐛 **Troubleshooting**

### Common Issues

1. **Port conflicts**
   ```bash
   # Check if ports are in use
   lsof -i :3000
   lsof -i :3001
   lsof -i :5432
   ```

2. **Database connection issues**
   ```bash
   # Check database logs
   docker-compose logs database
   
   # Wait for database to be ready
   docker-compose up database
   # Then start other services
   ```

3. **Build failures**
   ```bash
   # Clean rebuild
   docker-compose down -v
   docker system prune -a
   docker-compose up --build
   ```

4. **Frontend can't connect to backend**
   - Check if `NEXT_PUBLIC_API_URL` is set correctly
   - Verify backend is running: `curl http://localhost:3001/health`
   - Check network connectivity between containers

### Debugging Commands
```bash
# Check container status
docker-compose ps

# Inspect networks
docker network ls
docker network inspect portfolio_portfolio-network

# Check container logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Execute shell in container
docker-compose exec backend bash
docker-compose exec frontend bash
```

## 📊 **Monitoring**

### Service Status
- **Frontend**: http://localhost:3000
- **Backend Health**: http://localhost:3001/health
- **Backend API**: http://localhost:3001/api/v1

### Database Management
```bash
# Connect to database
docker-compose exec database psql -U portfolio_user -d portfolio

# Run migrations
docker-compose exec backend bun run db:migrate

# Open Prisma Studio
docker-compose exec backend bun run db:studio
```

## 🚀 **Production Deployment**

For production:

1. **Update environment variables**
2. **Use proper secrets**
3. **Configure SSL/TLS**
4. **Set up reverse proxy (nginx)**
5. **Configure monitoring and logging**

### Production Docker Compose
```yaml
# Add to docker-compose.prod.yml
version: '3.8'
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - frontend
      - backend
```

## 📝 **Development Workflow**

1. **Start services**: `docker-compose up -d`
2. **Check health**: Visit health endpoints
3. **View logs**: `docker-compose logs -f`
4. **Make changes**: Code changes will require rebuild
5. **Rebuild**: `docker-compose up --build`
6. **Stop services**: `docker-compose down`

## 🔐 **Security Notes**

- Change default passwords in production
- Use environment-specific secrets
- Enable SSL/TLS for production
- Implement proper authentication
- Use secure JWT secrets
- Configure firewall rules 