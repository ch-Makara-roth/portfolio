# Agent Instructions — Chhuon Makara Roth Portfolio

## Commands

```bash
npm run dev          # Dev server (or `bun run dev`)
npm run build        # Production build
npm run lint         # ESLint
npm run type-check   # TypeScript check
npm run test         # Jest (single run)
npm run test:watch   # Jest watch mode
npm run test:coverage
```

**Single test file:** `npx jest __tests__/ProjectCard.test.tsx`

**CI order:** lint → type-check → test → build

## Architecture

**Next.js 14 App Router.** Each `app/[route]/page.tsx` exports metadata and renders a single page component from `components/`:

```
app/[route]/page.tsx       → exports metadata + renders <RoutePage />
components/RoutePage.tsx   → full page layout ('use client')
```

**Data fetching:** Client-side via React Query (TanStack v5). Hooks in `hooks/`, API client in `lib/api/blogService.ts` (`BlogApiService` class). Points to `NEXT_PUBLIC_BACKEND_BASE_URL` (external backend).

**No database.** `lib/mockData.ts` feeds local API routes (`/api/projects`, `/api/about`, `/api/mock-posts`).

**Middleware** (`middleware.ts`) protects only `/admin` and `/api/admin` routes.

## Key Conventions

### Metadata
Always use `generateMetadata()` from `lib/metadata.ts` — never write raw `Metadata` objects:

```typescript
export const metadata = generateMetadata({
  title: 'About',
  description: '...',
  path: '/about',
})
```

### Styling
- Use `cn()` from `lib/utils.ts` for conditional class merging.
- Custom theme colors: `bg`, `text`, `accent` (#64ffda), `secondary` (#ff79c6), `dimmed`.
- Font: Fira Code (monospace). Custom sizes defined in `tailwind.config.js`.
- Custom scrollbar class: `custom-scrollbar`.

### Components
- `'use client'` on any component with hooks, interactivity, or animations.
- Framer Motion is globally mocked in `jest.setup.js` — do not re-mock per test.
- `next/navigation` (`useRouter`, `useSearchParams`, `usePathname`) is globally mocked.

### Testing
- Tests in `__tests__/`. Use `@testing-library/react`.
- Mock API calls with `jest.mock('@/lib/api/blogService')`.
- Do NOT re-mock `framer-motion` or `next/navigation` — already in `jest.setup.js`.

### Path Aliases
`@/` maps to project root. Use for all internal imports.

### API Routes
Versioned endpoints under `/api/v1/`. Use `NextRequest`/`NextResponse`.

## CSP / Dev Mode Gotcha

`next.config.js` sets a strict Content-Security-Policy header. In development, `'unsafe-eval'` must be included or Next.js Fast Refresh breaks. The config already handles this with a NODE_ENV check — if you see `EvalError: 'unsafe-eval' is not an allowed source`, verify the CSP line in `next.config.js` includes the dev-mode conditional.

## Environment

Key variables:
- `NEXT_PUBLIC_BACKEND_BASE_URL` — external blog/posts API
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` — Cloudflare CAPTCHA
- `NEXT_PUBLIC_SITE_URL` — canonical URL
- `JWT_SECRET` — admin auth (middleware)

See `.env.example` for full list.

## Deployment

- PR workflow (`.github/workflows/pr-tests.yml`) runs lint → type-check → test → build on every PR.
- CI/CD workflow (`ci-cd.yml`) is **commented out** — not active.
- Production uses PM2 (`ecosystem.config.js`) on a VPS at `/var/www/portfolio`.
- Semantic release configured (`.releaserc.json`) with conventional commits.

## Package Manager

Both `npm` and `bun` are supported. CI uses `bun` when `bun.lockb` exists. Use whichever is already in use — don't switch lockfiles.
