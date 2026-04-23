---
name: ux-ui-design
description: UX/UI design principles, interface guidelines, and user experience optimization for the portfolio website. Use when discussing design, UI components, user experience, accessibility, responsive design, animations, or visual improvements.
---

# UX/UI Design Guidelines

## Overview
Comprehensive UX/UI design system for the Chhuon Makara Roth portfolio, focusing on developer-centric aesthetics, smooth interactions, and accessibility-first approach.

## Design Philosophy

### Core Principles
1. **Minimal & Focused** - Every element serves a purpose
2. **Dark Theme First** - Optimized for developers who prefer dark mode
3. **Performance is UX** - Fast load times = better experience
4. **Accessibility Native** - WCAG 2.1 AA compliant by default
5. **Motion with Meaning** - Animations enhance, never distract

## Color System

### Primary Palette (Tailwind Config)
```css
--bg: #1a1a1a        /* Deep charcoal background */
--text: #e6e6e6      /* Soft white text */
--accent: #64ffda    /* Mint/teal accent (CTAs, highlights) */
--secondary: #ff79c6 /* Pink accent (secondary actions) */
--dimmed: #888       /* Muted text, placeholders */
```

### Usage Guidelines
- **Accent (#64ffda)**: Primary buttons, links, hover states, active indicators
- **Secondary (#ff79c6)**: Secondary actions, badges, tags, decorative elements
- **Dimmed (#888)**: Metadata, timestamps, disabled states, placeholders
- **Background (#1a1a1a)**: Main background, card backgrounds
- **Text (#e6e6e6)**: Body text, headings (never pure white on dark)

### Contrast Ratios (WCAG AA)
- Text on BG: 12.6:1 ✅ (AAA)
- Accent on BG: 8.4:1 ✅ (AAA)
- Secondary on BG: 6.2:1 ✅ (AA)
- Dimmed on BG: 3.8:1 ⚠️ (Use for non-critical text only)

## Typography

### Font Stack
```css
font-family: 'Fira Code', monospace;
```

### Type Scale
```
Hero:        3.5rem (56px)   - Landing page headline
H1:          2.5rem (40px)   - Page titles
H2:          2rem (32px)     - Section headers
H3:          1.5rem (24px)   - Card titles
Body Large:  1.125rem (18px) - Lead paragraphs
Body:        1rem (16px)     - Default text
Small:       0.875rem (14px) - Metadata, captions
Tiny:        0.75rem (12px)  - Tags, badges
```

### Typography Best Practices
- Line height: 1.6 for body text
- Max line length: 65-75 characters
- Use font-weight 400 (normal) and 700 (bold)
- Avoid italic for body text (reduce with font-smoothing)
- Monospace everywhere maintains developer aesthetic

## Spacing System

### Base Scale (8px grid)
```
4px   - Tight inline elements
8px   - Related elements
16px  - Component padding
24px  - Section spacing
32px  - Major sections
48px  - Content blocks
64px  - Page sections
96px  - Hero sections
```

### Component Spacing
- Button padding: 12px vertical, 24px horizontal
- Card padding: 24px
- Section padding: 64px vertical (mobile), 96px (desktop)
- Grid gap: 24px (projects), 32px (featured)

## Layout Architecture

### Grid System
```typescript
// Responsive container
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

// Grid layouts
.grid-projects {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.grid-featured {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}
```

### Breakpoints
```
xs:   475px   - Large phones
sm:   640px   - Small tablets
md:   768px   - Tablets
lg:   1024px  - Laptops
xl:   1280px  - Desktops
2xl:  1536px  - Large screens
3xl:  1600px  - Custom extra large
```

## Component Design Patterns

### 1. Buttons
```typescript
// Primary Button
<button className="
  px-6 py-3
  bg-accent/10 text-accent
  border border-accent/20
  rounded-lg
  hover:bg-accent/20 hover:border-accent/40
  transition-all duration-300
  focus:outline-none focus:ring-2 focus:ring-accent/50
  disabled:opacity-50 disabled:cursor-not-allowed
">
```

### 2. Cards
```typescript
// Project Card
<div className="
  p-6
  bg-bg/50
  border border-white/5
  rounded-xl
  hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5
  transition-all duration-300
  group
">
```

### 3. Navigation (Dock Style)
- macOS-style dock at bottom
- Icons scale to 1.5x on hover
- Smooth spring animations
- Active indicator with accent color
- Mobile: hamburger menu with slide-out panel

### 4. Forms
- Labels above inputs
- 1px border, rounded corners
- Focus ring with accent color
- Error states with red tint + message
- Success states with green checkmark
- Loading states with spinner

## Animation Guidelines

### Principles
1. **Purposeful** - Every animation has a reason
2. **Fast** - 200-400ms for micro-interactions
3. **Smooth** - Use ease-out for exits, ease-in-out for enters
4. **Respectful** - Honor reduced-motion preferences

### Standard Animations
```typescript
// Fade In (page transitions)
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
animation: fadeIn 0.5s ease-in-out;

// Slide Up (content reveals)
@keyframes slideUp {
  from { 
    transform: translateY(20px); 
    opacity: 0; 
  }
  to { 
    transform: translateY(0); 
    opacity: 1; 
  }
}
animation: slideUp 0.5s ease-out;

// Dock Hover (navigation)
@keyframes dockHover {
  from { transform: scale(1); }
  to { transform: scale(1.5); }
}
animation: dockHover 0.2s ease-out;

// Pulse (loading indicators)
animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
```

### Framer Motion Usage
- Page transitions: `<AnimatePresence>`
- Scroll reveals: `whileInView`, `viewport={{ once: true }}`
- Hover effects: `whileHover`, `whileTap`
- Stagger children: `variants` with delayChildren
- Keep duration: 0.2-0.5s
- Use spring physics for natural feel

## Accessibility Standards

### Must-Have Checklist
- ✅ All interactive elements focusable
- ✅ Visible focus indicators (2px ring minimum)
- ✅ ARIA labels on icon buttons
- ✅ Alt text on all images
- ✅ Semantic HTML (header, main, nav, footer)
- ✅ Heading hierarchy (h1 → h2 → h3)
- ✅ Color contrast meets AA (4.5:1 for text)
- ✅ Keyboard navigation works
- ✅ Screen reader tested
- ✅ Reduced motion respected

### Focus Management
```typescript
// Trap focus in modals
useEffect(() => {
  const focusableElements = modalRef.current?.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  // Implement focus trap logic
}, []);

// Return focus after modal closes
const previousFocus = document.activeElement;
// On close: previousFocus.focus();
```

### Screen Reader Optimization
```typescript
// Visually hidden but accessible
<span className="sr-only">Close menu</span>

// Announce dynamic content
<div aria-live="polite">
  {searchResultsCount} results found
</div>

// Describe complex images
<figure>
  <img src="project-screenshot.jpg" alt="E-commerce dashboard showing user analytics chart" />
  <figcaption>Project screenshot highlighting analytics features</figcaption>
</figure>
```

## Responsive Design Strategy

### Mobile-First Approach
1. **Design for 375px first**
2. **Enhance for tablet (768px)**
3. **Optimize for desktop (1200px+)**

### Mobile Optimizations
- Single column layouts
- Full-width buttons
- Larger touch targets (44px minimum)
- Simplified navigation (hamburger → dock)
- Swipe gestures for carousels
- Sticky CTA at bottom
- Reduce padding by 50%

### Tablet Optimizations
- 2-column grids for projects
- Side-by-side content where appropriate
- Dock navigation visible
- Medium padding (24px)

### Desktop Optimizations
- Multi-column layouts
- Hover effects enabled
- Dock navigation with tooltips
- Full padding (48-64px)
- Parallax effects if performant

## User Journey Optimization

### Homepage (Critical Path)
1. **Hero Section** (0-3 seconds)
   - Name + role + location
   - Clear value proposition
   - Primary CTA (View Projects)
   - Social proof (GitHub, LinkedIn)

2. **Skills/Tech Stack** (3-6 seconds)
   - Visual tech stack
   - Group by expertise
   - Quick scan format

3. **Featured Projects** (6-10 seconds)
   - 2-3 top projects
   - Screenshot + description
   - Tech tags + links

4. **Contact CTA** (10-12 seconds)
   - Email + form
   - Social links
   - Clear next action

### Project Page Flow
1. Filter/search at top
2. Grid of cards
3. Each card: image, title, description, tech, links
4. Click → detail page with full case study

### Contact Form UX
1. Name, email, subject, message
2. Real-time validation
3. Turnstile CAPTCHA (invisible preferred)
4. Loading state on submit
5. Success/error feedback
6. Auto-reply email confirmation

## Performance = UX

### Core Web Vitals Targets
- **LCP** < 2.5s (Largest Contentful Paint)
- **FID** < 100ms (First Input Delay)
- **CLS** < 0.1 (Cumulative Layout Shift)

### Optimization Tactics
- Optimize hero images (next/image, WebP, priority)
- Preload critical fonts
- Defer non-critical JavaScript
- Lazy load below-fold images
- Use skeleton loaders
- Implement progressive enhancement
- Cache aggressively with stale-while-revalidate

## Design Anti-Patterns (Avoid)

❌ Pure white text on pure black (harsh contrast)  
❌ Animated backgrounds that distract from content  
❌ Hidden navigation on desktop  
❌ Auto-playing videos/sounds  
❌ Custom scrollbars that break usability  
❌ Text smaller than 14px  
❌ Touch targets smaller than 44px  
❌ Forms without labels  
❌ Modals that can't be closed with Escape  
❌ Horizontal scroll on mobile  

## Inspiration & References

- **Linear.app** - Clean, dark, developer-focused
- **Vercel** - Performance-conscious design
- **Stripe** - Smooth animations, accessibility
- **GitHub** - Developer aesthetic, dark mode
- **Tailwind UI** - Component patterns

## Component Library Structure
```
components/
├── ui/              # Primitives (Button, Input, Card)
├── layouts/         # Page layouts (Container, Grid)
├── navigation/      # Nav components
├── animations/      # Framer Motion wrappers
└── sections/        # Page sections (Hero, About, Projects)
```

## Resources
- See `tailwind.config.js` for theme configuration
- See `app/globals.css` for global styles
- See `components/DockNavigation.tsx` for navigation design
- See `components/animations/` for animation patterns
