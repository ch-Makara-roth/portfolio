# Copilot Instructions

## Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # ESLint (next/core-web-vitals)
npm run type-check   # TypeScript check without emit
npm run test         # Jest single run
npm run test:watch   # Jest watch mode
npm run test:coverage
```

**Run a single test file:**
```bash
npx jest __tests__/ProjectCard.test.tsx
npx jest --testPathPattern=ProjectCard
```

## Architecture

**Next.js 14 App Router** — pages live in `app/[route]/page.tsx`. Each page file just exports metadata and renders a single page component from `components/`.

```
app/[route]/page.tsx  →  exports metadata + renders <RoutePage />
components/RoutePage.tsx  →  full page layout (client component)
```

**Data fetching** is done entirely client-side via React Query (TanStack v5). All query hooks live in `hooks/useBlogQueries.ts`. The API client is `lib/api/blogService.ts` (`BlogApiService` class), which points to `NEXT_PUBLIC_BACKEND_BASE_URL` (external backend).

**Mock data** in `lib/mockData.ts` is used by the local API routes (`/api/projects`, `/api/about`, `/api/mock-posts`) as the data source — there is no database connection.

**Middleware** (`middleware.ts`) protects `/admin` and `/api/admin` routes only.

## Key Conventions

### Metadata / SEO
Every page uses the `generateMetadata()` helper from `lib/metadata.ts`:
```typescript
export const metadata = generateMetadata({
  title: 'About',
  description: '...',
  path: '/about',
})
```
Never write raw `Metadata` objects directly on pages — always use this helper.

### Styling
Use the `cn()` utility from `lib/utils.ts` for conditional class merging (wraps `clsx` + `tailwind-merge`). CSS custom properties for design tokens are defined in `app/globals.css` (`--accent`, `--bg`, `--text`, etc.).

### Component patterns
- `'use client'` is used on any component with interactivity, hooks, or animations
- Framer Motion is globally mocked in tests (`jest.setup.js`) — no need to mock it per-test
- `next/navigation` (`useRouter`, `useSearchParams`, `usePathname`) is also globally mocked

### API routes
Follow REST style under `/api/v1/` for versioned endpoints. Use `NextRequest`/`NextResponse`. Throw/return a custom `ApiError` (from `lib/api/blogService.ts`) for typed error responses.

### Testing
Tests live in `__tests__/`. Mock external dependencies with `jest.mock()`. Global mocks for `next/navigation` and `framer-motion` are already set up in `jest.setup.js` — don't re-mock them in individual test files.

```typescript
// Standard test file structure
import { render, screen } from '@testing-library/react'
import Component from '@/components/Component'

jest.mock('@/lib/api/blogService') // mock API calls

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component />)
    expect(screen.getByText('...')).toBeInTheDocument()
  })
})
```

### Path aliases
`@/` maps to the project root. Use it for all internal imports.

## Environment Variables

Key variables to know:
- `NEXT_PUBLIC_BACKEND_BASE_URL` — external backend for blog/posts API
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` — Cloudflare CAPTCHA (contact form)
- `NEXT_PUBLIC_SITE_URL` — canonical site URL

See `.env.example` for the full list.
