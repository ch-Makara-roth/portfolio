# Backend API Project Prompt - Portfolio Management System

## 🎯 Project Overview

Create a comprehensive standalone backend API service that extends and enhances the existing Next.js portfolio API structure. This backend will serve as a robust, scalable API service with advanced features including authentication, database integration, file management, and admin capabilities.

## 📋 Project Requirements

### **Core Technology Stack**
- **Runtime**: Node.js 18+ with TypeScript
- **Framework**: Express.js with modern middleware
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with refresh tokens
- **File Storage**: Local storage with cloud integration options
- **Testing**: Jest with Supertest
- **Documentation**: Swagger/OpenAPI 3.0
- **Deployment**: Docker containerization

### **Project Structure**
```
portfolio-backend-api/
├── src/
│   ├── controllers/          # Route handlers
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── project.controller.ts
│   │   ├── blog.controller.ts
│   │   ├── contact.controller.ts
│   │   └── admin.controller.ts
│   ├── middleware/           # Custom middleware
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   ├── upload.middleware.ts
│   │   └── rateLimit.middleware.ts
│   ├── models/              # Database models
│   │   ├── User.model.ts
│   │   ├── Project.model.ts
│   │   ├── BlogPost.model.ts
│   │   └── Contact.model.ts
│   ├── routes/              # API routes
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── project.routes.ts
│   │   ├── blog.routes.ts
│   │   ├── contact.routes.ts
│   │   └── admin.routes.ts
│   ├── services/            # Business logic
│   │   ├── auth.service.ts
│   │   ├── email.service.ts
│   │   ├── upload.service.ts
│   │   └── analytics.service.ts
│   ├── utils/               # Utility functions
│   │   ├── logger.ts
│   │   ├── validation.ts
│   │   ├── encryption.ts
│   │   └── helpers.ts
│   ├── config/              # Configuration
│   │   ├── database.ts
│   │   ├── swagger.ts
│   │   └── environment.ts
│   ├── types/               # TypeScript types
│   │   ├── auth.types.ts
│   │   ├── api.types.ts
│   │   └── database.types.ts
│   └── server.ts            # Application entry point
├── prisma/
│   ├── schema.prisma        # Database schema
│   ├── migrations/          # Database migrations
│   └── seed.ts             # Database seeding
├── tests/                   # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/                    # Documentation
├── uploads/                 # File uploads directory
├── .env.example            # Environment variables template
├── Dockerfile              # Docker configuration
├── docker-compose.yml      # Docker compose for development
└── README.md               # Project documentation
```

## 🚀 API Endpoints Specification

### **Authentication Endpoints** (`/api/auth`)
```
POST   /api/auth/register          # User registration
POST   /api/auth/login             # User login
POST   /api/auth/refresh           # Refresh access token
POST   /api/auth/logout            # User logout
POST   /api/auth/forgot-password   # Password reset request
POST   /api/auth/reset-password    # Password reset confirmation
GET    /api/auth/verify-email      # Email verification
POST   /api/auth/resend-verification # Resend verification email
```

### **User Management** (`/api/users`)
```
GET    /api/users/profile          # Get user profile
PUT    /api/users/profile          # Update user profile
POST   /api/users/avatar           # Upload user avatar
DELETE /api/users/avatar           # Delete user avatar
PUT    /api/users/password         # Change password
GET    /api/users/activity         # User activity log
```

### **Projects Management** (`/api/projects`)
```
GET    /api/projects               # Get all projects (public)
GET    /api/projects/:id           # Get project by ID
POST   /api/projects               # Create new project (auth)
PUT    /api/projects/:id           # Update project (auth)
DELETE /api/projects/:id           # Delete project (auth)
POST   /api/projects/:id/images    # Upload project images
GET    /api/projects/featured      # Get featured projects
GET    /api/projects/technologies  # Get all technologies used
```

### **Blog Management** (`/api/blog`)
```
GET    /api/blog/posts             # Get all blog posts (paginated)
GET    /api/blog/posts/:slug       # Get post by slug
POST   /api/blog/posts             # Create new post (auth)
PUT    /api/blog/posts/:id         # Update post (auth)
DELETE /api/blog/posts/:id         # Delete post (auth)
POST   /api/blog/posts/:id/publish # Publish/unpublish post
GET    /api/blog/categories        # Get all categories
POST   /api/blog/categories        # Create category (auth)
GET    /api/blog/tags              # Get all tags
```

### **Contact Management** (`/api/contact`)
```
POST   /api/contact/submit         # Submit contact form
GET    /api/contact/messages       # Get all messages (auth)
GET    /api/contact/messages/:id   # Get message by ID (auth)
PUT    /api/contact/messages/:id   # Mark as read/replied (auth)
DELETE /api/contact/messages/:id   # Delete message (auth)
```

### **File Management** (`/api/files`)
```
POST   /api/files/upload           # Upload files
GET    /api/files/:id              # Get file by ID
DELETE /api/files/:id              # Delete file (auth)
GET    /api/files/gallery          # Get image gallery
POST   /api/files/gallery          # Add to gallery (auth)
```

### **Admin Panel** (`/api/admin`)
```
GET    /api/admin/dashboard        # Dashboard statistics
GET    /api/admin/users            # Manage users
GET    /api/admin/analytics        # Site analytics
GET    /api/admin/logs             # System logs
POST   /api/admin/backup           # Create backup
GET    /api/admin/settings         # Get site settings
PUT    /api/admin/settings         # Update site settings
```

### **System Endpoints** (`/api/system`)
```
GET    /api/system/health          # Health check
GET    /api/system/status          # System status
GET    /api/system/version         # API version info
GET    /api/system/metrics         # Performance metrics
```

## 🔧 Technical Requirements

### **Database Schema (Prisma)**
```prisma
model User {
  id          String   @id @default(cuid())
  email       String   @unique
  username    String   @unique
  firstName   String?
  lastName    String?
  avatar      String?
  bio         String?
  role        Role     @default(USER)
  isVerified  Boolean  @default(false)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  projects    Project[]
  blogPosts   BlogPost[]
  contacts    Contact[]
}

model Project {
  id          String   @id @default(cuid())
  title       String
  description String
  content     String?
  slug        String   @unique
  featured    Boolean  @default(false)
  status      Status   @default(DRAFT)
  githubUrl   String?
  liveUrl     String?
  images      String[]
  technologies String[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  authorId    String
  author      User     @relation(fields: [authorId], references: [id])
}

model BlogPost {
  id          String   @id @default(cuid())
  title       String
  content     String
  excerpt     String?
  slug        String   @unique
  published   Boolean  @default(false)
  featured    Boolean  @default(false)
  coverImage  String?
  tags        String[]
  categories  String[]
  readTime    Int?
  views       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  authorId    String
  author      User     @relation(fields: [authorId], references: [id])
}

model Contact {
  id        String      @id @default(cuid())
  name      String
  email     String
  subject   String
  message   String
  status    ContactStatus @default(UNREAD)
  replied   Boolean     @default(false)
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt
  
  // Relations
  userId    String?
  user      User?       @relation(fields: [userId], references: [id])
}

enum Role {
  USER
  ADMIN
  SUPER_ADMIN
}

enum Status {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum ContactStatus {
  UNREAD
  READ
  REPLIED
  ARCHIVED
}
```

### **Authentication & Security**
- **JWT Implementation**: Access tokens (15min) + Refresh tokens (7 days)
- **Password Security**: bcrypt with salt rounds
- **Rate Limiting**: Express rate limit middleware
- **Input Validation**: express-validator with custom rules
- **CORS Configuration**: Configurable origins
- **Helmet**: Security headers
- **File Upload Security**: File type validation, size limits

### **Middleware Stack**
```typescript
// Security middleware
app.use(helmet())
app.use(cors(corsOptions))
app.use(compression())
app.use(morgan('combined'))

// Rate limiting
app.use('/api/', rateLimitMiddleware)

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Custom middleware
app.use(authMiddleware)
app.use(validationMiddleware)
app.use(errorHandlerMiddleware)
```

### **Error Handling**
```typescript
interface ApiError {
  status: number
  message: string
  code?: string
  details?: any
  timestamp: string
  path: string
}

// Standard error responses
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": {
      "field": "email",
      "message": "Invalid email format"
    },
    "timestamp": "2024-01-01T00:00:00.000Z",
    "path": "/api/auth/register"
  }
}
```

## 📊 Advanced Features

### **Analytics & Monitoring**
- Request logging with Winston
- Performance metrics collection
- Error tracking and reporting
- Database query optimization
- API usage statistics

### **Email Service Integration**
- Welcome emails for new users
- Password reset emails
- Contact form notifications
- Newsletter functionality
- Email templates with HTML/text versions

### **File Management**
- Image optimization and resizing
- Multiple file format support
- Cloud storage integration (AWS S3, Cloudinary)
- File metadata extraction
- Automatic backup system

### **Caching Strategy**
- Redis integration for session storage
- API response caching
- Database query caching
- File caching with CDN support

### **API Documentation**
- Swagger/OpenAPI 3.0 specification
- Interactive API explorer
- Code examples in multiple languages
- Authentication flow documentation
- Error code reference

## 🧪 Testing Strategy

### **Test Coverage Requirements**
- **Unit Tests**: 90%+ coverage for services and utilities
- **Integration Tests**: All API endpoints
- **E2E Tests**: Critical user flows
- **Performance Tests**: Load testing for key endpoints

### **Test Structure**
```typescript
// Example test structure
describe('Auth Controller', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user with valid data', async () => {
      // Test implementation
    })
    
    it('should return 400 for invalid email', async () => {
      // Test implementation
    })
  })
})
```

## 🚀 Deployment & DevOps

### **Docker Configuration**
- Multi-stage Docker build
- Production-optimized image
- Health check endpoints
- Environment variable management

### **CI/CD Pipeline**
- Automated testing on PR
- Code quality checks (ESLint, Prettier)
- Security vulnerability scanning
- Automated deployment to staging/production

### **Environment Configuration**
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/portfolio"

# Authentication
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# File Upload
MAX_FILE_SIZE="10mb"
UPLOAD_PATH="./uploads"

# Redis (optional)
REDIS_URL="redis://localhost:6379"

# External APIs
CLOUDINARY_URL="cloudinary://api_key:api_secret@cloud_name"
```

## 📈 Performance Requirements

### **Response Time Targets**
- Authentication endpoints: < 200ms
- CRUD operations: < 300ms
- File uploads: < 2s (depending on size)
- Database queries: < 100ms

### **Scalability Considerations**
- Horizontal scaling support
- Database connection pooling
- Stateless architecture
- Load balancer compatibility

## 🔒 Security Checklist

- [ ] Input validation and sanitization
- [ ] SQL injection prevention (Prisma ORM)
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Rate limiting implementation
- [ ] Secure file upload handling
- [ ] Environment variable protection
- [ ] API key management
- [ ] Audit logging
- [ ] Regular security updates

---

## 🎯 Implementation Priority

### **Phase 1: Core Foundation**
1. Project setup and configuration
2. Database schema and migrations
3. Authentication system
4. Basic CRUD operations
5. Error handling and validation

### **Phase 2: Enhanced Features**
1. File upload and management
2. Email service integration
3. Admin panel functionality
4. API documentation
5. Basic testing suite

### **Phase 3: Advanced Features**
1. Analytics and monitoring
2. Caching implementation
3. Performance optimization
4. Comprehensive testing
5. Deployment automation

### **Phase 4: Production Ready**
1. Security hardening
2. Load testing
3. Documentation completion
4. Monitoring setup
5. Production deployment

---

*This backend API will serve as a robust, scalable foundation for portfolio management with enterprise-level features and security.*