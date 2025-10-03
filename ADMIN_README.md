# Admin System Documentation

This document provides comprehensive information about the admin system for the Makara Roth Portfolio website.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Getting Started](#getting-started)
4. [Authentication](#authentication)
5. [Admin Pages](#admin-pages)
6. [API Endpoints](#api-endpoints)
7. [Components & Utilities](#components--utilities)
8. [Security](#security)
9. [Development](#development)
10. [Deployment](#deployment)

## 🔍 Overview

The admin system is a comprehensive dashboard that allows administrators to manage the portfolio website's content, users, and settings. Built with Next.js 14, TypeScript, and Tailwind CSS, it provides a modern and intuitive interface for content management.

### Architecture

```
portfolio/chhuonmakararoth/
├── app/
│   ├── admin/                    # Admin pages
│   │   ├── layout.tsx           # Admin layout with sidebar
│   │   ├── page.tsx            # Dashboard
│   │   ├── posts/              # Posts management
│   │   ├── users/              # Users management
│   │   ├── analytics/          # Analytics dashboard
│   │   └── settings/           # Settings page
│   ├── api/admin/              # Admin API endpoints
│   └── login/                  # Admin login page
├── lib/admin/                  # Admin utilities
│   ├── api-client.ts          # API client
│   └── hooks.ts               # React hooks
├── middleware.ts              # Authentication middleware
└── ADMIN_README.md           # This file
```

## ✨ Features

### Dashboard
- **Overview Statistics**: Key metrics and performance indicators
- **Recent Activity**: Latest posts, users, and comments
- **Quick Actions**: Shortcuts to common tasks
- **Analytics Summary**: Traffic and engagement data

### Posts Management
- **CRUD Operations**: Create, read, update, and delete posts
- **Bulk Actions**: Publish/unpublish, feature/unfeature multiple posts
- **Search & Filter**: Find posts by title, content, tags, or status
- **Status Management**: Draft, published, and featured posts
- **Rich Metadata**: Tags, author, creation/update dates

### Users Management
- **User Directory**: View all registered users
- **Role Management**: Admin, Moderator, User roles
- **Status Control**: Activate/deactivate user accounts
- **Bulk Operations**: Delete multiple users at once
- **User Analytics**: Posts, comments, and engagement stats

### Analytics
- **Traffic Metrics**: Page views, unique visitors, session duration
- **Content Performance**: Most viewed pages and posts
- **Device Analytics**: Desktop, mobile, tablet breakdown
- **Traffic Sources**: Direct, search, social media, referrals
- **Time-based Analysis**: 7 days, 30 days, 90 days, 1 year

### Settings
- **General Settings**: Site name, description, URL, timezone
- **Appearance**: Theme, colors, logo, favicon
- **SEO Configuration**: Meta titles, descriptions, analytics
- **Social Media Links**: Twitter, LinkedIn, GitHub, Instagram
- **Notifications**: Email and system notification preferences
- **Security**: Authentication, registration, session settings

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Next.js 14+
- TypeScript
- Tailwind CSS

### Installation

1. **Clone the repository** (if not already done)
   ```bash
   git clone <repository-url>
   cd portfolio/chhuonmakararoth
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

4. **Access the admin system**
   - Navigate to `http://localhost:3000/login`
   - Use demo credentials:
     - Email: `admin@makararoth.com`
     - Password: `admin123`

## 🔐 Authentication

### Login Process

1. **Login Page**: `/login`
   - Email/password authentication
   - "Remember me" functionality
   - Password visibility toggle

2. **Token Management**
   - JWT-style tokens (currently simplified for demo)
   - Stored in HTTP-only cookies
   - Automatic token refresh

3. **Route Protection**
   - Middleware protects `/admin/*` routes
   - API routes require valid tokens
   - Automatic redirects for unauthenticated users

### Demo Credentials

For development and testing:
- **Email**: `admin@makararoth.com`
- **Password**: `admin123`

> ⚠️ **Security Note**: Change these credentials in production!

## 📱 Admin Pages

### Dashboard (`/admin`)
- Overview metrics and statistics
- Recent activity feed
- Quick action buttons
- Performance indicators

### Posts Management (`/admin/posts`)
- **List View**: Paginated posts with filters
- **Search**: Find posts by title, content, or tags
- **Bulk Actions**: Select multiple posts for batch operations
- **Status Management**: Publish, unpublish, feature posts
- **CRUD Operations**: Create, edit, delete individual posts

### Users Management (`/admin/users`)
- **User Directory**: All registered users with profiles
- **Role Assignment**: Change user roles dynamically
- **Status Control**: Activate/deactivate accounts
- **Bulk Operations**: Delete multiple users
- **Activity Tracking**: User engagement metrics

### Analytics (`/admin/analytics`)
- **Traffic Overview**: Views, visitors, session duration
- **Top Pages**: Most popular content
- **Device Breakdown**: Desktop, mobile, tablet usage
- **Traffic Sources**: Where visitors come from
- **Time Range Filters**: Customizable date ranges

### Settings (`/admin/settings`)
- **Tabbed Interface**: Organized settings categories
- **General**: Basic site configuration
- **Appearance**: Visual customization
- **SEO**: Search engine optimization
- **Social**: Social media integration
- **Notifications**: Alert preferences
- **Security**: Authentication settings

## 🛠 API Endpoints

### Authentication
```
POST /api/auth/login     # User login
POST /api/auth/logout    # User logout
POST /api/auth/refresh   # Token refresh
```

### Posts Management
```
GET    /api/admin/posts           # List posts with pagination
POST   /api/admin/posts           # Create new post
PUT    /api/admin/posts           # Bulk update posts
DELETE /api/admin/posts           # Bulk delete posts
GET    /api/admin/posts/:id       # Get single post
PUT    /api/admin/posts/:id       # Update single post
DELETE /api/admin/posts/:id       # Delete single post
```

### Users Management
```
GET    /api/admin/users           # List users with pagination
POST   /api/admin/users           # Create new user
DELETE /api/admin/users           # Bulk delete users
GET    /api/admin/users/:id       # Get single user
PUT    /api/admin/users/:id       # Update single user
DELETE /api/admin/users/:id       # Delete single user
```

### Analytics & Dashboard
```
GET    /api/admin/analytics       # Get analytics data
GET    /api/admin/dashboard       # Get dashboard statistics
```

### Settings
```
GET    /api/admin/settings        # Get all settings
PUT    /api/admin/settings        # Update settings
```

### File Management
```
POST   /api/admin/upload          # Upload files
```

## 🧩 Components & Utilities

### API Client (`lib/admin/api-client.ts`)
- Centralized API communication
- Automatic token management
- Error handling and response parsing
- Built-in request/response interceptors

```typescript
import adminApiClient from '@/lib/admin/api-client';

// Example usage
const response = await adminApiClient.getPosts({
  page: 1,
  limit: 10,
  search: 'nextjs'
});
```

### React Hooks (`lib/admin/hooks.ts`)
- **`usePosts()`**: Posts management
- **`useUsers()`**: Users management
- **`useAnalytics()`**: Analytics data
- **`useDashboardStats()`**: Dashboard statistics
- **`useSettings()`**: Settings management
- **`useFileUpload()`**: File upload handling
- **`useAuth()`**: Authentication state

```typescript
import { usePosts } from '@/lib/admin/hooks';

function PostsPage() {
  const { posts, loading, error, createPost } = usePosts();
  // Component logic
}
```

### Layout Components
- **AdminLayout**: Sidebar navigation and responsive design
- **Navigation**: Dynamic menu with active states
- **Breadcrumbs**: Page navigation trail

## 🔒 Security

### Current Implementation
- **Route Protection**: Middleware-based authentication
- **API Security**: Token validation for all endpoints
- **CSRF Protection**: Built-in Next.js protection
- **Input Validation**: Client and server-side validation

### Production Recommendations
1. **JWT Implementation**: Replace demo tokens with proper JWT
2. **Password Hashing**: Use bcrypt or similar for password storage
3. **Rate Limiting**: Implement API rate limiting
4. **HTTPS**: Always use HTTPS in production
5. **Environment Variables**: Store secrets in environment variables
6. **Session Management**: Implement proper session handling
7. **Audit Logging**: Log all admin actions

### Environment Variables
```env
# Database
DATABASE_URL=postgresql://...

# Authentication
JWT_SECRET=your-secret-key
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=secure-password

# External Services
ANALYTICS_ID=your-analytics-id
UPLOAD_SECRET=your-upload-secret
```

## 💻 Development

### Code Structure
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Tailwind CSS**: Utility-first styling

### Adding New Features

1. **Create API Endpoint**
   ```typescript
   // app/api/admin/new-feature/route.ts
   export async function GET(request: NextRequest) {
     // Implementation
   }
   ```

2. **Add React Hook**
   ```typescript
   // lib/admin/hooks.ts
   export function useNewFeature() {
     // Hook implementation
   }
   ```

3. **Create Admin Page**
   ```typescript
   // app/admin/new-feature/page.tsx
   export default function NewFeaturePage() {
     // Page component
   }
   ```

4. **Update Navigation**
   ```typescript
   // app/admin/layout.tsx
   const navigation = [
     // Add new menu item
   ];
   ```

### Testing
- **Unit Tests**: Test individual components and functions
- **Integration Tests**: Test API endpoints
- **E2E Tests**: Test user workflows
- **Security Tests**: Test authentication and authorization

## 🚢 Deployment

### Production Checklist
- [ ] Update authentication system with proper JWT
- [ ] Configure environment variables
- [ ] Set up database connection
- [ ] Enable HTTPS
- [ ] Configure file upload storage
- [ ] Set up monitoring and logging
- [ ] Test all functionality
- [ ] Update default credentials

### Environment Setup
1. **Database**: Configure PostgreSQL with Prisma
2. **File Storage**: Set up cloud storage for uploads
3. **Analytics**: Configure Google Analytics integration
4. **Email**: Set up email service for notifications
5. **Monitoring**: Set up error tracking and monitoring

## 📞 Support

### Common Issues
1. **Login Problems**: Check credentials and token storage
2. **API Errors**: Verify authentication headers
3. **File Uploads**: Check file size limits and storage
4. **Performance**: Monitor database queries and optimize

### Development Help
- Check browser console for errors
- Use React Developer Tools
- Monitor network requests in DevTools
- Check server logs for API errors

### Contact
For questions or issues:
- Create GitHub issues for bugs
- Check documentation first
- Review console errors before reporting

---

**Last Updated**: January 2024
**Version**: 1.0.0
**Author**: Makara Roth Portfolio Team