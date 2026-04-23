---
name: portfolio-content
description: Help write, edit, and optimize blog posts, project descriptions, and portfolio content. Use when creating or modifying content for the portfolio website including blog articles, project case studies, about page text, or SEO metadata.
---

# Portfolio Content Writing

## Overview
Guidelines for creating high-quality content for the Chhuon Makara Roth portfolio website.

## Content Types

### 1. Blog Posts
- Located in external backend (fetched via `NEXT_PUBLIC_BACKEND_BASE_URL`)
- Written in Markdown with proper heading hierarchy
- Include code blocks with language tags for syntax highlighting
- Target length: 800-2000 words
- Structure:
  - Catchy title (H1)
  - Brief intro paragraph
  - Table of contents (auto-generated from headings)
  - Main content with H2/H3 sections
  - Code examples where relevant
  - Conclusion with key takeaways

### 2. Project Descriptions
- Stored in `lib/mockData.ts`
- Each project needs:
  - `title`: Clear, descriptive name
  - `description`: 2-3 sentences explaining the project
  - `longDescription`: Detailed case study (optional)
  - `technologies`: Array of tech used
  - `category`: web, mobile, api, etc.
  - `image`: Screenshot URL
  - `githubUrl` / `liveUrl`: Links

### 3. About Page Content
- Personal bio (short + long version)
- Skills/tech stack organized by category
- Experience timeline
- Education/certifications

## Writing Guidelines

### Tone & Style
- Professional but approachable
- Developer-focused technical depth
- First person ("I built...", "My approach...")
- Active voice preferred
- Avoid jargon without explanation

### SEO Best Practices
- Include target keywords naturally in H1, H2, first paragraph
- Meta description: 150-160 characters
- Use `generateMetadata()` from `lib/metadata.ts` for all pages
- Add alt text to all images
- Internal linking between related content

### Markdown Formatting
```markdown
# H1 - Main title (one per post)
## H2 - Major sections
### H3 - Subsections

**Bold** for emphasis
`inline code` for technical terms

```typescript
// Code blocks with language
const example = true;
```

- Bullet lists for features
- Numbered lists for steps
> Blockquotes for important notes
```

## File Locations
- Blog content: External backend (via API)
- Project data: `lib/mockData.ts`
- About content: `lib/mockData.ts` (about section)
- Metadata: `lib/metadata.ts`
- Static pages: `app/[route]/page.tsx`

## Content Checklist
- [ ] Proper heading hierarchy (H1 → H2 → H3)
- [ ] Code blocks have language tags
- [ ] All links work and open in new tab if external
- [ ] Images have descriptive alt text
- [ ] Meta title under 60 characters
- [ ] Meta description 150-160 characters
- [ ] Content renders correctly on mobile
- [ ] No spelling/grammar errors
