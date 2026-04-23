---
name: testing-helper
description: Guide for writing, running, and debugging tests for the Next.js portfolio. Use when creating new tests, fixing failing tests, or setting up test coverage for components, hooks, API routes, or utilities.
---

# Testing Guide

## Test Setup

### Framework & Tools
- **Jest** with jsdom environment
- **React Testing Library** for component tests
- **Babel** for TypeScript/JSX transformation
- Config: `jest.config.js`, `jest.setup.js`

### Global Mocks (DO NOT re-mock in tests)
- `framer-motion` → renders as plain elements
- `next/navigation` → useRouter, useSearchParams, usePathname mocked
- `next/router` → legacy router mocked

### Run Commands
```bash
npm run test           # All tests
npm run test:watch     # Watch mode
npm run test:coverage  # With coverage report
npx jest __tests__/ComponentName.test.tsx  # Single file
```

## Test File Structure

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Component from '@/components/Component'

// Mock API calls only (not framer-motion or next/navigation)
jest.mock('@/lib/api/blogService')

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<Component />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })

  it('handles user interaction', async () => {
    render(<Component />)
    fireEvent.click(screen.getByRole('button'))
    await waitFor(() => {
      expect(screen.getByText('Result')).toBeInTheDocument()
    })
  })
})
```

## Testing Patterns

### Components
- Test what users see and do, not implementation details
- Use `getByRole`, `getByText`, `getByLabelText` queries
- Test accessibility: roles, labels, keyboard navigation
- Mock external dependencies (API calls, analytics)

### Hooks
```typescript
import { renderHook, act } from '@testing-library/react'
import { useCustomHook } from '@/hooks/useCustomHook'

describe('useCustomHook', () => {
  it('returns initial state', () => {
    const { result } = renderHook(() => useCustomHook())
    expect(result.current.value).toBe(initialValue)
  })
})
```

### API Routes
- Use `NextRequest`/`NextResponse` mocks
- Test status codes and response bodies
- Mock external service calls

## Common Gotchas

1. **Framer Motion**: Already mocked globally — don't import or mock again
2. **Next.js Navigation**: Already mocked globally — don't mock per test
3. **CSS Modules**: Mapped to `identity-obj-proxy` in jest.config.js
4. **rehype-raw / rehype-prism-plus**: Mocked in `__mocks__/`
5. **Transform Ignore**: Many ESM packages need transformIgnorePatterns (already configured)

## Coverage Targets
- Components: 80%+
- Hooks: 90%+
- Utils: 95%+
- API routes: 85%+

## Test Location
All tests live in `__tests__/` directory at project root.
