---
name: architecture-and-algorithm
description: System architecture design, algorithm optimization, and performance tuning for Next.js portfolio applications. Use when discussing system design, architecture patterns, performance optimization, data flow, caching strategies, or algorithmic improvements.
---

# Architecture & Algorithm Design

## Overview
Comprehensive guidelines for designing and optimizing the architecture of the Chhuon Makara Roth portfolio website built with Next.js 14, TypeScript, and modern web technologies.

## System Architecture

### Current Architecture Pattern
```
┌─────────────────────────────────────────┐
│         Client (Browser)                │
│  ┌───────────────────────────────────┐  │
│  │    React Components (App Router)  │  │
│  │    ├── Pages (SSR/SSG)            │  │
│  │    ├── UI Components              │  │
│  │    └── Animations (Framer Motion) │  │
│  └───────────────────────────────────┘  │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│      Next.js Server Layer               │
│  ┌───────────────────────────────────┐  │
│  │    API Routes                     │  │
│  │    ├── /api/health                │  │
│  │    ├── /api/contact               │  │
│  │    ├── /api/projects              │  │
│  │    ├── /api/about                 │  │
│  │    └── /api/mock-posts            │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │    Middleware (Auth)              │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │    Data Layer (lib/)              │  │
│  │    ├── metadata.ts                │  │
│  │    ├── utils.ts                   │  │
│  │    └── api/                       │  │
│  └───────────────────────────────────┘  │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│      External Services                  │
│  ├── Vercel Analytics                   │
│  ├── Ahrefs Analytics                   │
│  ├── Cloudflare Turnstile               │
│  └── Email Service (SMTP/Resend)        │
└─────────────────────────────────────────┘
```

### Design Principles

1. **Separation of Concerns**
   - Pages handle routing and metadata
   - Components handle UI and presentation
   - lib/ handles business logic and data fetching
   - API routes handle server-side operations

2. **Data Flow Pattern**
   - Client → API Routes → External Services
   - Server Components for SEO-critical content
   - Client Components for interactivity
   - React Query for caching and state management

3. **Performance Strategy**
   - SSR for pages (Home, About, Projects, Blogs)
   - SSG for static content (if applicable)
   - ISR for frequently updated content
   - Client-side fetching for dynamic data

## Algorithm Optimization

### 1. Data Fetching Algorithm
```typescript
// Optimized data fetching pattern with React Query
export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await fetch('/api/projects');
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    gcTime: 1000 * 60 * 30,   // Garbage collect after 30 minutes
  });
};
```

### 2. Search & Filter Algorithm
```typescript
// Efficient filtering with memoization
const filteredProjects = useMemo(() => {
  return projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || project.category === selectedCategory;
    const matchesTech = selectedTechnologies.length === 0 || 
                       selectedTechnologies.every(tech => project.technologies.includes(tech));
    return matchesSearch && matchesCategory && matchesTech;
  });
}, [projects, searchQuery, selectedCategory, selectedTechnologies]);
```

### 3. Image Optimization Strategy
- Use Next.js Image component with proper sizes
- Implement lazy loading for below-fold images
- Use WebP/AVIF formats (configured in next.config.js)
- Set proper priority for LCP images

### 4. Caching Strategy
- React Query cache for API responses
- Browser cache for static assets (1 year)
- CDN cache for global distribution
- Stale-while-revalidate for better UX

## Performance Optimization Checklist

### Bundle Optimization
- ✅ Code splitting (automatic with Next.js)
- ✅ Tree shaking (automatic with Webpack)
- ✅ Dynamic imports for heavy components
- ✅ Image optimization with next/image
- ✅ Font optimization with next/font

### Runtime Optimization
- ✅ Memoization (useMemo, useCallback)
- ✅ Virtualization for long lists
- ✅ Debounced search inputs
- ✅ Lazy loading for below-fold content
- ✅ GPU-accelerated animations

### Network Optimization
- ✅ HTTP/2 for multiplexing
- ✅ Compression enabled (next.config.js)
- ✅ Image CDN for remote images
- ✅ Prefetching for navigation links

## Scalability Patterns

### 1. Component Composition
```typescript
// Higher-order component pattern
const withSEO = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  return (props: P) => (
    <>
      <Head>
        <title>{props.title || 'Default Title'}</title>
        <meta name="description" content={props.description || 'Default'} />
      </Head>
      <WrappedComponent {...props} />
    </>
  );
};
```

### 2. API Route Organization
- Group by feature (projects, contact, about)
- Version APIs under /api/v1
- Implement rate limiting for public endpoints
- Use middleware for authentication

### 3. State Management Hierarchy
1. **Local State** - useState for component-specific
2. **Shared State** - React Query for server state
3. **Global State** - Context for app-wide (theme, auth)
4. **URL State** - Search params for filters/pagination

## When to Refactor

### Signs Architecture Needs Improvement
- Components exceed 300 lines
- Prop drilling more than 3 levels deep
- Duplicate API calls across components
- Bundle size exceeds 200KB initial load
- LCP > 2.5 seconds
- Memory leaks in React DevTools

### Optimization Triggers
- Page load time > 3 seconds
- Time to Interactive > 3.8 seconds
- Cumulative Layout Shift > 0.1
- First Contentful Paint > 1.8 seconds

## Migration Path (Future)

### Current → Future Architecture
1. **API Routes → Dedicated Backend**
   - Extract to separate Node.js/Python service
   - Implement proper database (PostgreSQL)
   - Add Redis caching layer
   - Use message queues for emails

2. **Static → CMS Integration**
   - Integrate Notion/Sanity/Contentful
   - Keep Next.js for rendering
   - Implement webhook-based revalidation

3. **Monolith → Micro-frontends** (if needed)
   - Split admin panel from public site
   - Independent deployment pipelines
   - Shared component library

## Best Practices

1. **Keep pages under 100 components**
2. **API routes should be < 50 lines**
3. **Use TypeScript strict mode always**
4. **Implement error boundaries for graceful degradation**
5. **Log performance metrics to analytics**
6. **Document architecture decisions in ADRs**
7. **Test critical user paths first**

## Resources
- See `/lib/metadata.ts` for metadata architecture
- See `next.config.js` for performance configuration
- See `middleware.ts` for authentication flow
- See `/components/QueryProvider.tsx` for state management
