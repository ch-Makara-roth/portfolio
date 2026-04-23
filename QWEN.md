# QWEN.md - Portfolio Website Context

## Project Overview

**Name:** Chhuon Makara Roth - Portfolio  
**Type:** Modern, SEO-optimized portfolio website  
**Owner:** Chhuon Makara Roth (Full-stack developer based in Phnom Penh, Cambodia)  
**Domain:** chhuonmakararoth.site

This is a professional portfolio website built with Next.js 14, featuring server-side rendering, comprehensive metadata, performance optimizations, and CI/CD deployment to a VPS.

---

## Tech Stack

### Core
- **Next.js 14** (App Router)
- **TypeScript** (strict mode enabled)
- **React 18**
- **Tailwind CSS** for styling
- **Framer Motion** for animations

### Data & Forms
- **React Query** (@tanstack/react-query) for data fetching
- **React Hook Form** with **Zod** validation
- **MDX/Markdown** support for blog posts

### UI & Icons
- **Headless UI** for accessible components
- **Radix UI** primitives
- **Lucide React** for icons
- **Prism.js** for code syntax highlighting

### Testing & Quality
- **Jest** with React Testing Library
- **ESLint** (next/core-web-vitals)
- **Babel** presets for Jest compatibility

### Deployment & CI/CD
- **GitHub Actions** for CI/CD
- **PM2** for process management
- **Docker** support (Bun-based image)
- **Vercel Analytics** for monitoring
- **Ahrefs Analytics** for SEO tracking

---

## Project Structure

```
portfolio/
├── app/                    # Next.js App Router
│   ├── about/              # About page
│   ├── blogs/              # Blog listing & detail pages
│   ├── contact/            # Contact form page
│   ├── projects/           # Projects showcase
│   ├── services/           # Services page
│   ├── api/                # API routes
│   │   ├── about/          # About data endpoint
│   │   ├── contact/        # Contact form handler
│   │   ├── health/         # Health check endpoint
│   │   ├── mock-posts/     # Mock blog posts
│   │   ├── projects/       # Projects data
│   │   ├── public/         # Public endpoints
│   │   └── v1/             # API versioning
│   ├── layout.tsx          # Root layout (metadata, providers)
│   ├── page.tsx            # Home page
│   ├── sitemap.ts          # Dynamic sitemap generation
│   ├── globals.css         # Global styles
│   └── not-found.tsx       # 404 page
├── components/             # React components
│   ├── animations/         # Animation components
│   ├── ui/                 # UI primitives
│   ├── HomePage.tsx        # Home page component
│   ├── AboutPage.tsx       # About page component
│   ├── ProjectsPage.tsx    # Projects page component
│   ├── BlogPost.tsx        # Blog post component
│   ├── BlogsPage.tsx       # Blog listing component
│   ├── ContactPage.tsx     # Contact form component
│   ├── DockNavigation.tsx  # macOS-style dock navigation
│   ├── QueryProvider.tsx   # React Query provider
│   └── ...                 # Other components
├── lib/                    # Utilities & shared logic
│   ├── api/                # API client utilities
│   ├── metadata.ts         # SEO metadata generator
│   ├── mockData.ts         # Mock data for development
│   └── utils.ts            # Helper functions
├── public/                 # Static assets
│   ├── robots.txt          # SEO robots file
│   └── manifest.json       # PWA manifest
├── __tests__/              # Jest test files
├── __mocks__/              # Jest mocks
├── types/                  # TypeScript type definitions
├── hooks/                  # Custom React hooks
├── scripts/                # Build & deployment scripts
├── .github/workflows/      # GitHub Actions CI/CD
├── middleware.ts           # Next.js middleware (auth)
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── jest.config.js          # Jest configuration
├── Dockerfile              # Docker build configuration
└── ecosystem.config.js     # PM2 process configuration
```

---

## Building and Running

### Development

```bash
# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev

# Start development server accessible on network
npm run dev:network
```

### Production

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Testing & Linting

```bash
# Run ESLint
npm run lint

# TypeScript type checking
npm run type-check

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Docker

```bash
# Build Docker image
docker build -t portfolio .

# Run container
docker run -p 3000:3000 portfolio
```

---

## Key Configuration

### Tailwind Theme
- **Dark mode** by default (class-based)
- **Custom colors:** bg (#1a1a1a), text (#e6e6e6), accent (#64ffda), secondary (#ff79c6)
- **Font:** Fira Code (monospace)
- **Custom breakpoints:** xs (475px), 3xl (1600px)
- **Custom animations:** fade-in, slide-up, dock-hover, shine, bounce-gentle, pulse-slow, gradient

### Next.js Config
- **Compression** enabled
- **Image optimization** with WebP/AVIF formats
- **Trailing slashes** enabled
- **SWC minification** enabled
- **Package import optimization** for framer-motion and lucide-react
- **Security headers** (X-Content-Type-Options, X-Frame-Options, etc.)
- **SEO redirect** `/home` → `/`

### TypeScript
- **Strict mode** enabled
- **Path alias** `@/*` maps to root directory
- **No emit** mode (Next.js handles compilation)

---

## API Endpoints

- `GET /api/health` - Health check endpoint
- `POST /api/contact` - Contact form submission
- `GET /api/about` - About page data
- `GET /api/projects` - Projects listing
- `GET /api/mock-posts` - Mock blog posts for development
- `GET /api/public/*` - Public endpoints
- `GET /api/v1/*` - Versioned API endpoints

---

## SEO Features

- Server-side rendering for better crawlability
- Centralized metadata in `lib/metadata.ts`
- Open Graph and Twitter Cards support
- Structured data (JSON-LD) for Person and Website schemas
- Dynamic sitemap.xml generation
- Robots.txt configuration
- Canonical URLs to prevent duplicate content
- Optimized images with Next.js Image component
- Web app manifest for PWA features
- Ahrefs analytics integration

---

## Authentication & Security

- **Middleware** protects `/admin` and `/api/admin` routes
- Token-based authentication via cookies or Authorization header
- Security headers configured in `next.config.js`
- Cloudflare Turnstile for CAPTCHA protection
- Environment variables for sensitive configuration

---

## Deployment

### VPS Deployment (Production)
- Deployed to VPS (Ubuntu) at `47.79.18.132`
- Domain: `chhuonmakararoth.site`
- PM2 process management with auto-restart
- Nginx reverse proxy
- GitHub Actions CI/CD pipeline
- Health check: `https://chhuonmakararoth.site/api/health`

### CI/CD Pipeline
- Automated testing on push
- Deployment to `main` branch triggers VPS deployment
- Health checks after deployment
- Rollback support via backups

### Vercel (Alternative)
- Vercel Analytics integrated
- One-click deployment from GitHub

---

## Development Conventions

- **TypeScript strict mode** for type safety
- **ESLint** with Next.js recommended rules
- **Component-based architecture** with separation of concerns
- **API routes** organized by feature
- **Metadata** generated centrally via `lib/metadata.ts`
- **Testing** with Jest and React Testing Library
- **Dark theme** by default with custom Tailwind configuration
- **Path aliases** (`@/*`) for cleaner imports

---

## Environment Variables

Key environment variables (see `.env.example` for full list):

- `NEXT_PUBLIC_SITE_URL` - Site base URL
- `NEXT_PUBLIC_SITE_NAME` - Site name for metadata
- `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` - GA tracking
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `NEXT_PUBLIC_TURNSTILE_SECRET_KEY` - CAPTCHA keys
- `NEXTAUTH_SECRET` / `JWT_SECRET` - Authentication secrets
- `DATABASE_URL` - PostgreSQL connection (optional)
- `SMTP_*` / `RESEND_API_KEY` - Email service (optional)

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout with metadata, providers, analytics |
| `app/page.tsx` | Home page entry point |
| `app/sitemap.ts` | Dynamic sitemap generation |
| `middleware.ts` | Authentication middleware for admin routes |
| `lib/metadata.ts` | Centralized SEO metadata generator |
| `next.config.js` | Next.js build configuration |
| `tailwind.config.js` | Tailwind theme customization |
| `ecosystem.config.js` | PM2 process configuration |
| `Dockerfile` | Docker build configuration |

---

## Contact

- **Email:** chhuonmakara@gmail.com
- **LinkedIn:** https://linkedin.com/in/chhuon-makararoth-b66700262/
- **GitHub:** https://github.com/ch-Makara-roth
