// Mock data for the frontend-only application

// Service interfaces
export interface ServiceProcess {
  step: string
  title: string
  description: string
}

export interface ServiceWorkflow {
  title: string
  description: string
}

export interface Service {
  id: string
  slug: string
  icon: string // String identifier for the icon component
  title: string
  description: string
  features: string[]
  color: string
  workflow: ServiceWorkflow[]
  process: ServiceProcess[]
}

// About page interfaces
export interface PersonalInfo {
  name: string
  title: string
  location: string
  phone: string
  email: string

  hobbies: string[]
  profileImage: string
  story: string[]
}

export interface Experience {
  role: string
  type: string
  company: string
  period: string
  location: string
  skills: string[]
}

export interface Education {
  degree: string
  school: string
  period: string
  location: string
  description: string
}

export interface AboutData {
  personalInfo: PersonalInfo
  skills: string[]
  experiences: Experience[]
  education: Education[]
}

export interface User {
  id: string
  name: string
  username: string
  email: string
  avatar: string | null
  createdAt: string
  updatedAt: string
}

export interface Post {
  id: string
  title: string
  content: string
  slug: string
  createdAt: string
  updatedAt: string
  authorId: string
  image?: string
  excerpt: string
  publishedAt: string
  tags: string[]
  readTime: number
  likes: number
  comments: number
  views: number
}

export interface PostWithAuthor extends Post {
  author: User
  _count: {
    likes: number
    comments: number
  }
}

// Mock Services Data
export const mockServices: Service[] = [
  {
    id: '1',
    slug: 'web-development',
    icon: 'Code',
    title: 'Web Development',
    description: 'Custom web applications built with modern technologies like React, Next.js, and TypeScript.',
    color: 'from-blue-600 to-cyan-500',
    features: ['Responsive Design', 'SEO Optimization', 'Performance Tuning', 'Modern UI/UX'],
    workflow: [
      {
        title: 'Requirement Analysis',
        description: 'We start by gathering all the necessary requirements and understanding your business goals.'
      },
      {
        title: 'Tech Stack Selection',
        description: 'Choosing the right technologies that fit your project needs and scalability requirements.'
      },
      {
        title: 'Architecture Design',
        description: 'Designing a robust and scalable architecture for your web application.'
      }
    ],
    process: [
      {
        step: '01',
        title: 'Discovery',
        description: 'Understanding your requirements and project goals through detailed consultation.'
      },
      {
        step: '02',
        title: 'Design',
        description: 'Creating wireframes and UI/UX designs to visualize the end product.'
      },
      {
        step: '03',
        title: 'Development',
        description: 'Coding the application with clean, maintainable, and efficient code.'
      },
      {
        step: '04',
        title: 'Testing & Launch',
        description: 'Rigorous testing to ensure bug-free deployment and successful launch.'
      }
    ]
  },
  {
    id: '2',
    slug: 'mobile-development',
    icon: 'Smartphone',
    title: 'Mobile Development',
    description: 'Cross-platform mobile apps using React Native and Flutter for iOS and Android.',
    color: 'from-secondary to-secondary/60',
    features: ['Native Performance', 'Push Notifications', 'App Store Deployment', 'Offline Support'],
    workflow: [
      {
        title: 'Prototyping',
        description: 'Creating interactive prototypes to validate app flow and user experience.'
      },
      {
        title: 'Cross-Platform Dev',
        description: 'Developing for both iOS and Android using a single codebase for efficiency.'
      },
      {
        title: 'Native Integration',
        description: 'Integrating with native device features like camera, GPS, and sensors.'
      }
    ],
    process: [
      {
        step: '01',
        title: 'Concept',
        description: 'Refining your app idea and defining core features.'
      },
      {
        step: '02',
        title: 'UI/UX',
        description: 'Designing intuitive interfaces for mobile screens.'
      },
      {
        step: '03',
        title: 'Build',
        description: 'Developing the app using React Native or Flutter.'
      },
      {
        step: '04',
        title: 'Release',
        description: 'Publishing your app to the Apple App Store and Google Play Store.'
      }
    ]
  },
  {
    id: '3',
    slug: 'api-development',
    icon: 'Database',
    title: 'API Development',
    description: 'RESTful APIs and GraphQL services with robust authentication and real-time capabilities.',
    color: 'from-blue-500 to-blue-400',
    features: ['RESTful APIs', 'GraphQL', 'Authentication', 'Real-time Updates'],
    workflow: [
      {
        title: 'Schema Design',
        description: 'Defining data models and API contracts (Swagger/OpenAPI or GraphQL Schema).'
      },
      {
        title: 'Security Implementation',
        description: 'Implementing OAuth, JWT, and rate limiting to secure your endpoints.'
      },
      {
        title: 'Optimization',
        description: 'Caching, database indexing, and query optimization for high performance.'
      }
    ],
    process: [
      {
        step: '01',
        title: 'Planning',
        description: 'Defining endpoints, data structures, and access patterns.'
      },
      {
        step: '02',
        title: 'Development',
        description: 'Building the API logic, connecting to databases and external services.'
      },
      {
        step: '03',
        title: 'Documentation',
        description: 'Creating comprehensive API documentation for developers.'
      },
      {
        step: '04',
        title: 'Deployment',
        description: 'Deploying to cloud infrastructure with auto-scaling capabilities.'
      }
    ]
  },
  {
    id: '4',
    slug: 'ui-ux-design',
    icon: 'Palette',
    title: 'UI/UX Design',
    description: 'User-centered design solutions that prioritize usability and aesthetic appeal.',
    color: 'from-purple-500 to-purple-400',
    features: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
    workflow: [
      {
        title: 'User Research',
        description: 'Analyzing target audience, competitors, and user needs.'
      },
      {
        title: 'Information Architecture',
        description: 'Structuring content and flow for intuitive navigation.'
      },
      {
        title: 'Visual Design',
        description: 'Crafting the look and feel with typography, color, and imagery.'
      }
    ],
    process: [
      {
        step: '01',
        title: 'Research',
        description: 'Gathering insights to inform design decisions.'
      },
      {
        step: '02',
        title: 'Wireframes',
        description: 'Creating low-fidelity layout sketches.'
      },
      {
        step: '03',
        title: 'Prototype',
        description: 'Building interactive high-fidelity mockups.'
      },
      {
        step: '04',
        title: 'Handoff',
        description: 'Preparing assets and style guides for developers.'
      }
    ]
  },
  {
    id: '5',
    slug: 'ecommerce-solutions',
    icon: 'Globe',
    title: 'E-Commerce Solutions',
    description: 'Complete e-commerce platforms with payment integration and inventory management.',
    color: 'from-green-500 to-green-400',
    features: ['Payment Integration', 'Inventory Management', 'Order Tracking', 'Admin Dashboard'],
    workflow: [
      {
        title: 'Platform Setup',
        description: 'Setting up the storefront, cart, and checkout flows.'
      },
      {
        title: 'Payment Gateway',
        description: 'Secure integration with Stripe, PayPal, or other providers.'
      },
      {
        title: 'Product Management',
        description: 'Tools for easy inventory updates and order processing.'
      }
    ],
    process: [
      {
        step: '01',
        title: 'Strategy',
        description: 'Defining product catalog and sales channels.'
      },
      {
        step: '02',
        title: 'Setup',
        description: 'Configuring the e-commerce engine and database.'
      },
      {
        step: '03',
        title: 'Integration',
        description: 'Connecting payments, shipping, and email services.'
      },
      {
        step: '04',
        title: 'Launch',
        description: 'Going live and monitoring sales performance.'
      }
    ]
  },
  {
    id: '6',
    slug: 'security-performance',
    icon: 'Shield',
    title: 'Security & Performance',
    description: 'Application security audits and performance optimization for better user experience.',
    color: 'from-red-500 to-red-400',
    features: ['Security Audits', 'Performance Optimization', 'Load Testing', 'Monitoring'],
    workflow: [
      {
        title: 'Audit & Analysis',
        description: 'Scanning for vulnerabilities and performance bottlenecks.'
      },
      {
        title: 'Remediation',
        description: 'Fixing values, patching security holes, and optimizing code.'
      },
      {
        title: 'Continuous Monitoring',
        description: 'Setting up alerts and dashboards for real-time health checks.'
      }
    ],
    process: [
      {
        step: '01',
        title: 'Audit',
        description: 'Comprehensive assessment of current system state.'
      },
      {
        step: '02',
        title: 'Plan',
        description: 'Prioritizing fixes and optimization tasks.'
      },
      {
        step: '03',
        title: 'Execute',
        description: 'Applying updates, code fixes, and configuration changes.'
      },
      {
        step: '04',
        title: 'Verify',
        description: 'Retesting to confirm improvements and security.'
      }
    ]
  }
]

// Mock users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Makara Roth',
    username: 'roth',
    email: 'chhuonmakara@gmail.com',
    avatar: '/avatars/roth.jpg',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Jane Smith',
    username: 'smith',
    email: 'jane.smith@example.com',
    avatar: '/avatars/jane.png',
    createdAt: '2024-01-10T08:30:00Z',
    updatedAt: '2024-01-10T08:30:00Z'
  },
  {
    id: '3',
    name: 'Alex Chen',
    username: 'chen',
    email: 'alex.chen@example.com',
    avatar: null,
    createdAt: '2024-01-05T14:20:00Z',
    updatedAt: '2024-01-05T14:20:00Z'
  }
]

// Mock posts
export const mockPosts: PostWithAuthor[] = [
  {
    id: '1',
    title: 'Getting Started with Next.js 14 and TypeScript',
    image: '/images/projects/nextjs-typescript.png',
    excerpt: 'Next.js 14 brings exciting new features including the stable App Router, improved performance, and better developer experience. Learn how to set up a new project with TypeScript.',
    publishedAt: '2024-01-20T09:00:00Z',
    tags: ['Next.js', 'TypeScript', 'React', 'Web Development'],
    readTime: 8,
    likes: 42,
    comments: 8,
    views: 1250,
    content: `# Getting Started with Next.js 14 and TypeScript

Next.js 14 brings exciting new features including the stable App Router, improved performance, and better developer experience. In this comprehensive guide, we'll explore how to set up a new project with TypeScript.

## Key Features

- **App Router**: Stable and production-ready
- **Server Components**: Better performance by default
- **Improved TypeScript**: Enhanced type safety
- **Turbopack**: Faster development builds

## Installation

\`\`\`bash
npx create-next-app@latest my-app --typescript --tailwind --eslint
cd my-app
npm run dev
\`\`\`

## Project Structure

\`\`\`
my-app/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
├── lib/
│   └── public/
\`\`\`

### Server vs Client Components

By default, components in the \`app\` directory are **Server Components**:

\`\`\`tsx
// This is a Server Component
export default function HomePage() {
  return <h1>Welcome to Next.js 14!</h1>
}
\`\`\`

For client-side interactivity, use the \`"use client"\` directive:

\`\`\`tsx
"use client"

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}
\`\`\`

## Best Practices

1. **Use Server Components by default** - They're faster and more SEO-friendly
2. **Minimize Client Components** - Only use when you need interactivity
3. **Leverage TypeScript** - Take advantage of improved type inference
4. **Optimize Images** - Use Next.js Image component for better performance

> **Pro Tip**: Always start with Server Components and only add \`"use client"\` when you need browser APIs or state management.

Happy coding! 🚀`,
    slug: 'getting-started-nextjs-14-typescript',
    createdAt: '2024-01-20T09:00:00Z',
    updatedAt: '2024-01-20T09:00:00Z',
    authorId: '1',
    author: mockUsers[0],
    _count: {
      likes: 42,
      comments: 8
    }
  },
  {
    id: '2',
    title: 'Building Responsive UIs with Tailwind CSS',
    image: '/images/projects/tailwind-responsive.jpg',
    excerpt: 'Tailwind CSS has revolutionized how we approach styling in modern web development. Explore advanced techniques for creating responsive, accessible, and maintainable user interfaces.',
    publishedAt: '2024-01-18T14:30:00Z',
    tags: ['Tailwind CSS', 'CSS', 'Responsive Design', 'UI/UX'],
    readTime: 6,
    likes: 35,
    comments: 12,
    views: 890,
    content: `# Building Responsive UIs with Tailwind CSS

Tailwind CSS has revolutionized how we approach styling in modern web development. This article explores advanced techniques for creating responsive, accessible, and maintainable user interfaces.

## Why Tailwind CSS?

- ⚡ **Utility-first**: Build complex components from simple utilities
- 📱 **Mobile-first**: Responsive design made easy
- 🎨 **Customizable**: Extend and customize to match your design system
- 🚀 **Performance**: Purge unused CSS automatically

## Responsive Design Patterns

### Breakpoint System

Tailwind uses a mobile-first breakpoint system:

| Breakpoint | Min Width | CSS |
|------------|-----------|-----|
| \`sm\` | 640px | \`@media (min-width: 640px)\` |
| \`md\` | 768px | \`@media (min-width: 768px)\` |
| \`lg\` | 1024px | \`@media (min-width: 1024px)\` |
| \`xl\` | 1280px | \`@media (min-width: 1280px)\` |

### Example: Responsive Card Layout

\`\`\`tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
    <h3 className="text-lg font-semibold mb-2">Card Title</h3>
    <p className="text-gray-600">Card content goes here...</p>
  </div>
</div>
\`\`\`

## Advanced Techniques

### Custom Components with \`@apply\`

\`\`\`css
.btn-primary {
  @apply bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded;
}
\`\`\`

### Dark Mode Support

\`\`\`tsx
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  <h1 className="text-2xl font-bold">Hello World</h1>
</div>
\`\`\`

## Performance Tips

1. **Use PurgeCSS**: Remove unused styles in production
2. **Minimize custom CSS**: Leverage utilities whenever possible
3. **Use JIT mode**: Just-in-time compilation for faster builds

\`\`\`javascript
// tailwind.config.js
module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  // ...
}
\`\`\`

> Remember: The key to mastering Tailwind is thinking in utilities rather than components. Start small and build up! 💪`,
    slug: 'building-responsive-uis-tailwind-css',
    createdAt: '2024-01-18T14:30:00Z',
    updatedAt: '2024-01-18T14:30:00Z',
    authorId: '1',
    author: mockUsers[0],
    _count: {
      likes: 35,
      comments: 12
    }
  },
  {
    id: '3',
    title: 'State Management in React: A Complete Guide',
    image: '/images/projects/react-state-management.jpg',
    excerpt: 'Managing state effectively is crucial for building robust React applications. This comprehensive guide covers everything from basic hooks to advanced patterns.',
    publishedAt: '2024-01-16T11:15:00Z',
    tags: ['React', 'State Management', 'Hooks', 'Redux', 'Zustand'],
    readTime: 12,
    likes: 67,
    comments: 23,
    views: 1580,
    content: `# State Management in React: A Complete Guide

Managing state effectively is crucial for building robust React applications. This comprehensive guide covers everything from basic hooks to advanced patterns.

## State Management Options

### 1. Built-in React Hooks

#### useState
Perfect for local component state:

\`\`\`tsx
const [count, setCount] = useState(0)
const [user, setUser] = useState<User | null>(null)
\`\`\`

#### useReducer
Better for complex state logic:

\`\`\`tsx
const initialState = { count: 0, loading: false }

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + 1 }
    case 'setLoading':
      return { ...state, loading: action.payload }
    default:
      return state
  }
}

const [state, dispatch] = useReducer(reducer, initialState)
\`\`\`

### 2. Context API

Great for sharing state across components:

\`\`\`tsx
const ThemeContext = createContext()

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
\`\`\`

### 3. External Libraries

#### Zustand (Recommended)

\`\`\`tsx
import { create } from 'zustand'

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}))
\`\`\`

#### Redux Toolkit

\`\`\`tsx
import { createSlice } from '@reduxjs/toolkit'

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    }
  }
})
\`\`\`

## When to Use What?

| Scenario | Recommendation |
|----------|----------------|
| Local component state | \`useState\` |
| Complex local state | \`useReducer\` |
| Sharing state (few components) | Context API |
| Global app state | Zustand or Redux Toolkit |
| Server state | React Query / SWR |

## Best Practices

1. **Keep state as local as possible**
2. **Use the right tool for the job**
3. **Avoid prop drilling with Context**
4. **Separate server state from client state**
5. **Use TypeScript for better type safety**

\`\`\`tsx
// Good: Typed state
interface User {
  id: string
  name: string
  email: string
}

const [user, setUser] = useState<User | null>(null)
\`\`\`

Remember: **Start simple and scale up as needed!** 🎯`,
    slug: 'state-management-react-complete-guide',
    createdAt: '2024-01-16T11:15:00Z',
    updatedAt: '2024-01-16T11:15:00Z',
    authorId: '2',
    author: mockUsers[1],
    _count: {
      likes: 67,
      comments: 23
    }
  },
  {
    id: '4',
    title: 'Optimizing Web Performance: Core Web Vitals',
    excerpt: 'Web performance directly impacts user experience and SEO rankings. Learn about Core Web Vitals and essential optimization techniques.',
    publishedAt: '2024-01-14T16:45:00Z',
    tags: ['Performance', 'Web Vitals', 'SEO', 'Optimization'],
    readTime: 10,
    likes: 54,
    comments: 15,
    views: 1120,
    content: `# Optimizing Web Performance: Core Web Vitals

Web performance directly impacts user experience and SEO rankings. This article focuses on Core Web Vitals - the essential metrics that Google uses to evaluate page experience.

## The Three Core Web Vitals

### 1. Largest Contentful Paint (LCP)
**Target: < 2.5 seconds**

Measures loading performance. To improve LCP:

- Optimize images with modern formats (WebP, AVIF)
- Use a CDN for faster content delivery
- Minimize render-blocking resources

\`\`\`html
<!-- Good: Optimized image -->
<img 
  src="hero.webp" 
  alt="Hero image"
  width="800" 
  height="600"
  loading="eager"
/>
\`\`\`

### 2. First Input Delay (FID)
**Target: < 100 milliseconds**

Measures interactivity. To improve FID:

- Minimize JavaScript execution time
- Use code splitting
- Defer non-critical JavaScript

\`\`\`javascript
// Good: Code splitting with dynamic imports
const LazyComponent = lazy(() => import('./LazyComponent'))
\`\`\`

### 3. Cumulative Layout Shift (CLS)
**Target: < 0.1**

Measures visual stability. To improve CLS:

- Always include size attributes for images and videos
- Reserve space for ads and embeds
- Avoid inserting content above existing content

## Performance Optimization Techniques

### Image Optimization

\`\`\`tsx
// Next.js Image component (recommended)
import Image from 'next/image'

<Image
  src="/hero.jpg"
  alt="Hero"
  width={800}
  height={600}
  priority // For above-the-fold images
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
\`\`\`

### Code Splitting

\`\`\`tsx
// Route-based splitting
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))

// Component-based splitting
const HeavyComponent = lazy(() => 
  import('./components/HeavyComponent')
)
\`\`\`

### Resource Hints

\`\`\`html
<!-- Preload critical resources -->
<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin>

<!-- Prefetch likely next pages -->
<link rel="prefetch" href="/about">

<!-- Preconnect to external domains -->
<link rel="preconnect" href="https://fonts.googleapis.com">
\`\`\`

## Measuring Performance

### Tools to Use

1. **Lighthouse** - Built into Chrome DevTools
2. **PageSpeed Insights** - Google's web performance tool
3. **Web Vitals Extension** - Real-time Core Web Vitals
4. **WebPageTest** - Detailed performance analysis

### Monitoring in Production

\`\`\`javascript
// Web Vitals library
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

getCLS(console.log)
getFID(console.log)
getFCP(console.log)
getLCP(console.log)
getTTFB(console.log)
\`\`\`

## Performance Budget

Set performance budgets to maintain standards:

\`\`\`json
{
  "budget": [
    {
      "path": "/*",
      "timings": [
        { "metric": "LCP", "budget": 2500 },
        { "metric": "FID", "budget": 100 },
        { "metric": "CLS", "budget": 0.1 }
      ]
    }
  ]
}
\`\`\`

> **Remember**: Performance is not a one-time task - it's an ongoing process. Monitor, measure, and optimize continuously! 📊`,
    slug: 'optimizing-web-performance-core-web-vitals',
    createdAt: '2024-01-14T16:45:00Z',
    updatedAt: '2024-01-14T16:45:00Z',
    authorId: '3',
    author: mockUsers[2],
    _count: {
      likes: 54,
      comments: 15
    }
  },
  {
    id: '5',
    title: 'Modern Authentication Patterns in Web Apps',
    excerpt: 'Security is paramount in modern web applications. Explore contemporary authentication patterns and best practices for protecting user data.',
    publishedAt: '2024-01-12T13:20:00Z',
    tags: ['Authentication', 'Security', 'JWT', 'OAuth', 'Web Security'],
    readTime: 14,
    likes: 38,
    comments: 9,
    views: 920,
    content: `# Modern Authentication Patterns in Web Apps

Security is paramount in modern web applications. This deep dive explores contemporary authentication patterns and best practices for protecting user data.

## Authentication vs Authorization

- **Authentication**: *Who are you?* (Login process)
- **Authorization**: *What can you do?* (Permissions)

## Common Authentication Methods

### 1. JWT (JSON Web Tokens)

\`\`\`javascript
// JWT Structure: header.payload.signature
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

// Decode payload
const payload = {
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022,
  "exp": 1516242622
}
\`\`\`

#### Pros and Cons

✅ **Pros:**
- Stateless
- Cross-domain support
- Mobile-friendly

❌ **Cons:**
- Cannot be revoked easily
- Larger than session IDs
- Vulnerable if not handled properly

### 2. Session-Based Authentication

\`\`\`javascript
// Server-side session storage
app.post('/login', (req, res) => {
  // Validate credentials
  if (validUser) {
    req.session.userId = user.id
    res.json({ success: true })
  }
})
\`\`\`

### 3. OAuth 2.0 / OpenID Connect

\`\`\`typescript
// Example with NextAuth.js
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    }
  }
})
\`\`\`

## Security Best Practices

### 1. Password Security

\`\`\`javascript
const bcrypt = require('bcrypt')

// Hash password
const saltRounds = 12
const hashedPassword = await bcrypt.hash(password, saltRounds)

// Verify password
const isValid = await bcrypt.compare(password, hashedPassword)
\`\`\`

### 2. Secure Token Storage

| Storage Method | Security Level | Use Case |
|----------------|----------------|----------|
| localStorage | ❌ Low | Never for sensitive data |
| sessionStorage | ⚠️ Medium | Temporary data only |
| httpOnly Cookies | ✅ High | Recommended for tokens |
| Memory | ✅ Highest | Short-lived tokens |

### 3. CSRF Protection

\`\`\`javascript
// CSRF token in forms
<form>
  <input type="hidden" name="_token" value="{{ csrf_token() }}" />
  <!-- form fields -->
</form>
\`\`\`

## Modern Patterns

### 1. Passwordless Authentication

\`\`\`typescript
// Magic link implementation
async function sendMagicLink(email: string) {
  const token = generateSecureToken()
  await saveToken(email, token, { expiresIn: '15m' })
  
  const magicLink = \`\${baseUrl}/auth/verify?token=\${token}\`
  await sendEmail(email, magicLink)
}
\`\`\`

### 2. Multi-Factor Authentication (MFA)

\`\`\`javascript
// TOTP (Time-based One-Time Password)
const speakeasy = require('speakeasy')

// Generate secret
const secret = speakeasy.generateSecret({
  name: 'MyApp',
  length: 32
})

// Verify token
const verified = speakeasy.totp.verify({
  secret: secret.base32,
  encoding: 'base32',
  token: userToken,
  window: 2
})
\`\`\`

### 3. Biometric Authentication

\`\`\`javascript
// WebAuthn API
if (window.PublicKeyCredential) {
  const credential = await navigator.credentials.create({
    publicKey: {
      challenge: new Uint8Array(32),
      rp: { name: "MyApp" },
      user: {
        id: new TextEncoder().encode(userId),
        name: userEmail,
        displayName: userName
       },
      pubKeyCredParams: [{ alg: -7, type: "public-key" }]
    }
  })
}
\`\`\`

## Implementation Checklist

- [ ] Use HTTPS everywhere
- [ ] Implement proper password policies
- [ ] Add rate limiting for login attempts
- [ ] Use secure session management
- [ ] Implement CSRF protection
- [ ] Add proper logout functionality
- [ ] Monitor for suspicious activities
- [ ] Regular security audits

> **Security Tip**: Always assume your authentication system will be attacked. Design with security in mind from day one! 🔒`,
    slug: 'modern-authentication-patterns-web-apps',
    createdAt: '2024-01-12T13:20:00Z',
    updatedAt: '2024-01-12T13:20:00Z',
    authorId: '1',
    author: mockUsers[0],
    _count: {
      likes: 38,
      comments: 9
    }
  },
  {
    id: '6',
    title: 'Database Design for Scalable Applications',
    excerpt: 'Designing databases that scale with your application is both an art and a science. Learn fundamental principles and practical strategies for building robust data architectures.',
    publishedAt: '2024-01-10T10:30:00Z',
    tags: ['Database', 'SQL', 'NoSQL', 'Scalability', 'Architecture'],
    readTime: 16,
    likes: 29,
    comments: 7,
    views: 680,
    content: `# Database Design for Scalable Applications

Designing databases that scale with your application is both an art and a science. This article covers fundamental principles and practical strategies for building robust data architectures.

## Database Design Principles

### 1. Normalization vs Denormalization

- **Normalization**: Reducing data redundancy and improving integrity.
- **Denormalization**: Optimizing for read performance by adding redundant data.

### 2. Indexing Strategies

Indexes are critical for query performance.

\`\`\`sql
-- Creating an index on frequently queried columns
CREATE INDEX idx_users_email ON users(email);
\`\`\`

### 3. Sharding and Partitioning

Splitting data across multiple machines or tables to improve scalability.

## Practical Strategies

1. **Use optimal data types**
2. **Handle concurrency correctly** (Transactions, Locks)
3. **Plan for growth** (Capacity planning)
4. **Regular backups and disaster recovery**

## Conclusion

A well-designed database is the foundation of a scalable application. Invest time in the design phase to save headaches later!`,
    slug: 'database-design-scalable-applications',
    createdAt: '2024-01-10T10:30:00Z',
    updatedAt: '2024-01-10T10:30:00Z',
    authorId: '1',
    author: mockUsers[0],
    _count: {
      likes: 29,
      comments: 7
    }
  }
]

// Mock About Data
export const mockAboutData: AboutData = {
  personalInfo: {
    name: ' Makara Roth',
    title: 'Frontend Developer',
    location: 'Phnom Penh, Cambodia',
    phone: '(+855) 81693071',
    email: 'chhuonmakararoth@gmail.com',

    hobbies: ['Learning', 'Coding', 'Music', 'Reading'],
    profileImage: '/avatars/roth.jpg',
    story: [
      "Hi! I'm Makara, a passionate frontend developer from Cambodia. At 20 years old, I'm currently pursuing my Computer Science degree at Royal University of Phnom Penh while actively building my skills in web development.",
      "My journey into web development began during my university studies, which led me to complete an intensive web development training program at KiloIT. I've had the privilege of volunteering at major international sporting events, including the 32nd SEA Games and 12th ASEAN Para Games.",
      "I specialize in creating responsive, user-friendly web applications using modern technologies like React, JavaScript, and various CSS frameworks. I'm passionate about clean code, intuitive user interfaces, and continuous learning.",
      "When I'm not coding, you can find me exploring new technologies, listening to music, reading, or enjoying a good cup of coffee while working on personal projects. I believe in the power of technology to create positive change and meaningful user experiences."
    ]
  },
  skills: [
    'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js',
    'HTML5', 'CSS3', 'Tailwind CSS', 'PostgreSQL', 'MongoDB',
    'Git', 'Docker', 'AWS'
  ],
  experiences: [
    {
      role: 'Web Developer / Frontend Developer',
      type: 'Training Program',
      company: 'KiloIT',
      period: 'Nov 2023 - May 2024',
      location: 'Phnom Penh, Cambodia',
      skills: ['React', 'JavaScript', 'HTML', 'CSS', 'SCSS', 'Git', 'Figma', 'REST APIs', 'Responsive Design']
    },
    {
      role: 'Game IT Volunteer',
      type: 'Volunteer',
      company: '32nd SEA Games 2023',
      period: '5 - 17 May, 2023',
      location: 'Phnom Penh, Cambodia',
      skills: ['Technical Support', 'Event Management', 'Team Collaboration', 'Problem Solving']
    },
    {
      role: 'Game IT Volunteer',
      type: 'Volunteer',
      company: '12th ASEAN Para Games 2023',
      period: '3 - 9 Jan, 2023',
      location: 'Phnom Penh, Cambodia',
      skills: ['Technical Support', 'Event Management', 'Team Collaboration', 'Problem Solving']
    }
  ],
  education: [
    {
      degree: 'Web Developer Course',
      school: 'KiloIT',
      period: 'Nov 2023 - May 2024',
      location: 'Phnom Penh, Cambodia',
      description: 'Intensive web development training program focusing on modern frontend technologies'
    },
    {
      degree: 'Bachelor of Computer Science',
      school: 'Royal University of Phnom Penh',
      period: '2021 - 2024',
      location: 'Phnom Penh, Cambodia',
      description: 'Graduated with Computer Science degree, specializing in software development'
    },
    {
      degree: 'Freshman in Computer Science',
      school: 'Royal University of Phnom Penh',
      period: '2021 - 2022',
      location: 'Phnom Penh, Cambodia',
      description: 'Foundation year in Computer Science program'
    },
    {
      degree: 'High School Diploma (Baccii Grade 12)',
      school: 'Somlout High School',
      period: '2018 - 2022',
      location: 'Phnom Penh, Cambodia',
      description: 'Completed secondary education with focus on science and mathematics'
    }
  ]
}

// Get about data
export function getAboutData(): AboutData {
  return mockAboutData
}

export async function submitContactForm(data: any): Promise<{ success: boolean; message: string }> {
  await new Promise(resolve => setTimeout(resolve, 1000))
  // Simulate simple validation
  if (!data.email || !data.message) {
    throw new Error('Email and message are required')
  }
  return { success: true, message: 'Message sent successfully!' }
}

export async function getPaginatedPosts(page: number = 1, limit: number = 10, tag?: string) {
  await new Promise(resolve => setTimeout(resolve, 500))

  let filteredPosts = [...mockPosts]

  if (tag) {
    filteredPosts = filteredPosts.filter(post => post.tags.includes(tag))
  }

  // Sort by date desc
  filteredPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

  const total = filteredPosts.length
  const totalPages = Math.ceil(total / limit)
  const offset = (page - 1) * limit
  const posts = filteredPosts.slice(offset, offset + limit)

  return {
    posts,
    metadata: {
      total,
      totalPages,
      currentPage: page,
      limit
    }
  }
}

export async function getPostById(id: string): Promise<PostWithAuthor | undefined> {
  await new Promise(resolve => setTimeout(resolve, 300))
  return mockPosts.find(post => post.id === id)
}

export async function getPostBySlug(slug: string): Promise<PostWithAuthor | undefined> {
  await new Promise(resolve => setTimeout(resolve, 300))
  return mockPosts.find(post => post.slug === slug)
}

export async function updatePostLikes(id: string, increment: boolean): Promise<PostWithAuthor | null> {
  await new Promise(resolve => setTimeout(resolve, 300))
  const postIndex = mockPosts.findIndex(p => p.id === id)

  if (postIndex === -1) return null

  const post = mockPosts[postIndex]
  const newLikes = increment ? post.likes + 1 : Math.max(0, post.likes - 1)

  const updatedPost = {
    ...post,
    likes: newLikes,
    _count: {
      ...post._count,
      likes: newLikes
    }
  }

  // Update the mock data in memory (since it's a mock)
  mockPosts[postIndex] = updatedPost

  return updatedPost
}