# Node.js + Express + Prisma + PostgreSQL Docker Setup

A complete Docker setup for a Node.js application with Express, Prisma ORM, and PostgreSQL database.

## 🚀 Quick Start

### Prerequisites
- Docker
- Docker Compose

### One-Click Setup
```bash
./docker-setup.sh
```

### Manual Setup

1. **Create environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Start the database**:
   ```bash
   docker compose up -d postgres
   ```

3. **Run database migrations**:
   ```bash
   docker compose run --rm app bunx prisma migrate deploy
   ```

4. **Start the application**:
   ```bash
   docker compose up -d app
   ```

## 📋 Available Services

- **Application**: http://localhost:3000
- **PostgreSQL**: localhost:5432
- **Prisma Studio**: http://localhost:5555 (development only)

## 🔧 Development Commands

### Docker Commands
```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# View logs
docker compose logs -f app

# Rebuild containers
docker compose build --no-cache

# Start with Prisma Studio
docker compose --profile dev up -d
```

### Database Commands
```bash
# Generate Prisma client
docker compose run --rm app bunx prisma generate

# Run migrations
docker compose run --rm app bunx prisma migrate deploy

# Create new migration
docker compose run --rm app bunx prisma migrate dev

# Reset database
docker compose run --rm app bunx prisma migrate reset

# Access database shell
docker compose exec postgres psql -U postgres -d myapp
```

### Package Management
```bash
# Install new package
docker compose run --rm app bun add package-name

# Install dev dependency
docker compose run --rm app bun add -d package-name
```

## 📁 Project Structure

```
server/
├── config/
│   └── env.js              # Environment configuration
├── prisma/
│   └── schema.prisma       # Database schema
├── generated/
│   └── prisma/             # Generated Prisma client
├── index.ts                # Main application file
├── Dockerfile              # Docker configuration
├── docker-compose.yml      # Docker Compose configuration
├── docker-setup.sh         # Setup script
├── .dockerignore          # Docker ignore file
├── .env.example           # Environment template
└── package.json           # Dependencies
```

## 🌐 API Endpoints

- `GET /api/v1` - Hello World endpoint
- `GET /health` - Health check endpoint

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Application port | `3000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/myapp` |
| `POSTGRES_DB` | Database name | `myapp` |
| `POSTGRES_USER` | Database user | `postgres` |
| `POSTGRES_PASSWORD` | Database password | `postgres` |

### Docker Compose Profiles

- **Default**: Runs app and database
- **Dev**: Includes Prisma Studio for database management

## 🚀 Deployment

### Building for Production
```bash
# Build the Docker image
docker build -t server .

# Run with production settings
docker run -p 3000:3000 --env-file .env server
```

### Using Docker Compose
```bash
# Production deployment
docker compose -f docker-compose.yml up -d
```

## 📊 Monitoring

### Health Checks
The application includes health check endpoints:
- Container health: Built into Docker
- Database health: `GET /health`

### Logs
```bash
# View application logs
docker compose logs -f app

# View database logs
docker compose logs -f postgres
```

## 🔒 Security Notes

- Change default passwords in production
- Use environment-specific `.env` files
- Regularly update Docker images
- Enable SSL/TLS in production

## 🛠️ Troubleshooting

### Common Issues

1. **Port already in use**:
   ```bash
   # Stop conflicting services
   docker compose down
   ```

2. **Database connection issues**:
   ```bash
   # Check database status
   docker compose exec postgres pg_isready -U postgres
   ```

3. **Prisma client issues**:
   ```bash
   # Regenerate Prisma client
   docker compose run --rm app bunx prisma generate
   ```

### Development Tips

- Use `bun --watch` for hot reloading in development
- Set up database seeding for consistent development data
- Use Prisma Studio for database visualization
- Configure your IDE for Docker development 