# Technology Stack

## Core Framework

- **Next.js 14** with App Router (server-side rendering, file-based routing)
- **React 18.3** with TypeScript for type safety
- **TypeScript 5.3** with strict mode enabled

## Styling & UI

- **Tailwind CSS 3.3** for utility-first styling
- **Framer Motion** for animations and transitions
- **Radix UI** for accessible component primitives
- **Lucide React** for icons
- **class-variance-authority** and **clsx** for conditional styling

## Data & Forms

- **TanStack React Query** for data fetching and caching
- **React Hook Form** with **Zod** for form validation
- **React Markdown** with **remark-gfm** and **rehype-highlight** for markdown rendering

## Testing

- **Jest** with **jsdom** environment
- **React Testing Library** for component testing
- **@testing-library/user-event** for user interaction testing

## Build & Development

- **SWC** for fast compilation and minification
- **PostCSS** with **Autoprefixer** for CSS processing
- **ESLint** with Next.js config for code quality

## Analytics & Monitoring

- **Vercel Analytics** for performance tracking
- **Ahrefs** and **Google Search Console** for SEO monitoring

## Common Commands

```bash
# Development
npm run dev              # Start dev server on localhost:3000
npm run dev:network      # Start dev server accessible on network (0.0.0.0)

# Building
npm run build            # Create production build
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript compiler check

# Testing
npm test                 # Run tests once
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
```

## Configuration Files

- `next.config.js` - Next.js configuration with image optimization, headers, and redirects
- `tailwind.config.js` - Custom theme with extended colors, animations, and breakpoints
- `tsconfig.json` - TypeScript configuration with path aliases (@/*)
- `.eslintrc.json` - ESLint rules (extends next/core-web-vitals)
- `jest.config.js` - Jest testing configuration
- `postcss.config.js` - PostCSS with Tailwind

## Environment Variables

Create `.env.local` for local development:
- `NEXT_PUBLIC_SITE_URL` - Site URL for metadata
- `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` - Google Analytics tracking ID
