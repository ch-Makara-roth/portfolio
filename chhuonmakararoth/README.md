# Chhuon Makara Roth - Portfolio

A modern, SEO-optimized portfolio website built with Next.js 14, featuring server-side rendering, comprehensive metadata, and performance optimizations.

## 🚀 Features

### SEO Optimizations
- **Server-side rendering** for better search engine crawling
- **Comprehensive metadata** including Open Graph and Twitter Cards
- **Structured data** (JSON-LD) for rich snippets
- **Sitemap.xml** for search engines
- **Robots.txt** for crawl optimization
- **Canonical URLs** to prevent duplicate content
- **Optimized images** with Next.js Image component
- **Web app manifest** for PWA features

### Performance Optimizations
- **Font optimization** with display: swap
- **Image optimization** with WebP and AVIF formats
- **Bundle optimization** with SWC minification
- **Lazy loading** for images and components
- **Compression** enabled for better load times
- **GPU acceleration** for smooth animations
- **Reduced motion** support for accessibility

### Technical Features
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Query** for data fetching
- **React Hook Form** with Zod validation
- **Responsive design** with mobile-first approach

## 🛠️ Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Configure environment variables**
   Create a `.env.local` file and add your configuration:
   ```bash
   NEXT_PUBLIC_SITE_URL=https://your-domain.com
   NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=your-ga-id
   ```

4. **Update metadata**
   Edit `lib/metadata.ts` to customize:
   - Site URL
   - Social media handles
   - Verification codes
   - Personal information

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```

6. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## 📁 Project Structure

```
├── app/                 # Next.js app directory
│   ├── about/          # About page
│   ├── contact/        # Contact page
│   ├── projects/       # Projects page
│   ├── api/            # API routes
│   ├── layout.tsx      # Root layout with metadata
│   ├── page.tsx        # Home page
│   └── sitemap.ts      # Dynamic sitemap
├── components/         # Reusable components
├── lib/               # Utility functions
│   ├── metadata.ts    # SEO metadata configuration
│   └── utils.ts       # Helper functions
├── public/            # Static assets
│   ├── robots.txt     # Search engine instructions
│   └── manifest.json  # PWA manifest
└── next.config.js     # Next.js configuration
```

## 🎯 SEO Best Practices Implemented

### 1. **Metadata Management**
- Centralized metadata configuration in `lib/metadata.ts`
- Dynamic metadata generation for each page
- Open Graph and Twitter Card support
- Proper title and description optimization

### 2. **Structured Data**
- Person schema for personal branding
- Website schema for site information
- Article schema for blog posts (if applicable)

### 3. **Performance Optimization**
- Optimized fonts with `font-display: swap`
- Image optimization with modern formats
- Bundle splitting and code optimization
- Lazy loading for better Core Web Vitals

### 4. **Technical SEO**
- Semantic HTML structure
- Proper heading hierarchy
- Alt text for all images
- Mobile-first responsive design
- Fast loading times

## 📊 Performance Metrics

This portfolio is optimized for:
- **Core Web Vitals** compliance
- **Lighthouse** performance scores
- **Mobile-first** indexing
- **Fast loading** times
- **Accessibility** standards

## 🔧 Customization

### Update Personal Information
1. Edit `lib/metadata.ts` for site metadata
2. Update `app/layout.tsx` for structured data
3. Modify pages in `app/` directory
4. Replace placeholder images in `public/`

### Add New Pages
1. Create page in `app/` directory
2. Add metadata using `generateMetadata()`
3. Update sitemap in `app/sitemap.ts`
4. Add navigation links if needed

### Customize Styling
1. Update `tailwind.config.js` for theme
2. Modify `app/globals.css` for global styles
3. Customize components in `components/`

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub repository
2. Connect to Vercel
3. Configure environment variables
4. Deploy automatically

### Other Platforms
- **Netlify**: Configure build settings
- **AWS Amplify**: Set up hosting
- **Custom server**: Use `npm run build` and `npm start`

## 📝 SEO Checklist

- [x] Server-side rendering enabled
- [x] Comprehensive metadata for all pages
- [x] Open Graph and Twitter Cards
- [x] Structured data (JSON-LD)
- [x] Sitemap.xml generated
- [x] Robots.txt configured
- [x] Image optimization with alt text
- [x] Mobile-responsive design
- [x] Fast loading times
- [x] Accessibility features
- [x] Core Web Vitals optimized
- [x] Canonical URLs
- [x] Web app manifest

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

- **Email**: chhuonmakara@gmail.com
- **LinkedIn**: [Chhuon Makara Roth](https://linkedin.com/in/chhuon-makararoth-b66700262/)
- **GitHub**: [ch-Makara-roth](https://github.com/ch-Makara-roth)

---

Built with ❤️ by Chhuon Makara Roth 