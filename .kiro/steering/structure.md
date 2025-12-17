# Project Structure

## Directory Organization

```
├── app/                    # Next.js App Router pages and layouts
│   ├── about/             # About page
│   ├── blogs/             # Blog listing and detail pages
│   │   └── [slug]/        # Dynamic blog post routes
│   ├── contact/           # Contact page
│   ├── projects/          # Projects listing and detail pages
│   │   └── [slug]/        # Dynamic project routes
│   ├── services/          # Services page
│   ├── api/               # API routes
│   │   ├── contact/       # Contact form submission
│   │   ├── health/        # Health check endpoint
│   │   ├── projects/      # Projects data API
│   │   └── v1/            # Versioned API endpoints
│   ├── layout.tsx         # Root layout with metadata and providers
│   ├── page.tsx           # Home page
│   ├── globals.css        # Global styles and Tailwind imports
│   ├── sitemap.ts         # Dynamic sitemap generation
│   └── not-found.tsx      # 404 page
│
├── components/            # Reusable React components
│   ├── ui/               # Base UI components (button, card, input, badge)
│   ├── animations/       # Animation components (ShinyText, StarryBackground)
│   ├── *Page.tsx         # Page-level components (HomePage, ProjectsPage, etc.)
│   ├── *Card.tsx         # Card components for content display
│   └── QueryProvider.tsx # React Query provider wrapper
│
├── lib/                   # Utility functions and shared logic
│   ├── metadata.ts       # SEO metadata generation helpers
│   ├── mockData.ts       # Mock data for development
│   └── utils.ts          # General utility functions
│
├── types/                 # TypeScript type definitions
│   └── jest-globals.d.ts # Jest type declarations
│
├── __tests__/            # Test files (mirrors component structure)
│   ├── HomePage.test.tsx
│   ├── ContactPage.test.tsx
│   └── ProjectCard.test.tsx
│
├── public/               # Static assets
│   ├── images/          # Image assets
│   │   ├── Logo/        # Logo and favicon files
│   │   └── projects/    # Project thumbnails
│   ├── avatars/         # User avatar images
│   ├── robots.txt       # Search engine crawling rules
│   └── manifest.json    # PWA manifest
│
├── scripts/              # Deployment and utility scripts
│   └── deploy*.sh       # Deployment scripts for VPS
│
└── .kiro/                # Kiro AI assistant configuration
    └── steering/         # AI steering rules and guidelines
```

## Key Conventions

### File Naming
- **Pages**: Use `page.tsx` in app directory folders
- **Components**: PascalCase (e.g., `ProjectCard.tsx`, `HomePage.tsx`)
- **Utilities**: camelCase (e.g., `metadata.ts`, `utils.ts`)
- **Tests**: Match component name with `.test.tsx` suffix

### Component Organization
- Page-level components in `/components` (e.g., `HomePage.tsx`)
- Reusable UI components in `/components/ui`
- Animation components in `/components/animations`
- Each component should be self-contained with minimal dependencies

### Routing
- File-based routing using Next.js App Router
- Dynamic routes use `[slug]` folder naming
- API routes in `app/api/` directory
- Trailing slashes enabled in `next.config.js`

### Styling
- Tailwind utility classes for styling
- Custom theme extensions in `tailwind.config.js`
- Global styles in `app/globals.css`
- Dark mode as default (`className="dark"` on html element)

### Data Fetching
- Server components for initial data loading
- React Query for client-side data fetching and caching
- API routes for backend functionality

### Path Aliases
- Use `@/` prefix for imports from root (e.g., `@/components/Button`)
- Configured in `tsconfig.json` paths

### Metadata & SEO
- Centralized metadata configuration in `lib/metadata.ts`
- Use `generateMetadata()` function for page-specific metadata
- Structured data (JSON-LD) in root layout
- Dynamic sitemap generation in `app/sitemap.ts`
