---
name: deployment-guide
description: Steps for deploying the portfolio to VPS with PM2, managing CI/CD workflows, and handling production configuration. Use when deploying, updating server config, or troubleshooting production issues.
---

# Deployment Guide

## Production Environment

### Server Setup
- **Location**: VPS at `/var/www/portfolio`
- **Process Manager**: PM2 (`ecosystem.config.js`)
- **Web Server**: Nginx (reverse proxy)
- **Node Version**: 20.x

### Key Files
- `ecosystem.config.js` — PM2 configuration
- `.github/workflows/ci-cd.yml` — CI/CD pipeline (currently commented out)
- `.github/workflows/pr-tests.yml` — PR test automation (active)
- `next.config.js` — Production headers, CSP, image config

## Deploy Steps

### Manual Deploy
```bash
# On VPS
cd /var/www/portfolio
git pull origin main
npm ci --production
npm run build
pm2 reload portfolio
pm2 save
```

### PM2 Commands
```bash
pm2 list              # List processes
pm2 logs portfolio    # View logs
pm2 restart portfolio # Restart app
pm2 stop portfolio    # Stop app
pm2 delete portfolio  # Remove from PM2
pm2 save              # Save process list
pm2 startup           # Enable auto-start on boot
```

### Log Locations
- Combined: `/var/log/pm2/portfolio-combined.log`
- Output: `/var/log/pm2/portfolio-out.log`
- Error: `/var/log/pm2/portfolio-error.log`

## CI/CD Pipeline

### PR Tests (Active)
`.github/workflows/pr-tests.yml` runs on every PR:
1. Install dependencies (bun if `bun.lockb` exists, else npm)
2. Lint → Type-check → Test → Build
3. Upload coverage report
4. Comment PR with results

### Full CI/CD (Commented Out)
`.github/workflows/ci-cd.yml` is disabled. To enable:
1. Uncomment the workflow file
2. Set up `DEPLOY_KEY`, `DEPLOY_HOST`, `DEPLOY_USER` secrets
3. Push to `main` or `develop` branch

## Environment Variables

### Required for Production
```bash
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://www.chhuonmakararoth.site
NEXT_PUBLIC_BACKEND_BASE_URL=<external-api-url>
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<turnstile-key>
TURNSTILE_SECRET_KEY=<turnstile-secret>
JWT_SECRET=<jwt-secret>
```

### CSP Considerations
- Production CSP does NOT include `'unsafe-eval'`
- Dev mode adds `'unsafe-eval'` for Fast Refresh
- See `next.config.js` headers section

## Nginx Config (Reference)
```nginx
server {
    listen 443 ssl;
    server_name www.chhuonmakararoth.site;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Troubleshooting

### App Won't Start
```bash
pm2 logs portfolio --lines 100
cat /var/log/pm2/portfolio-error.log
```

### Build Fails
- Check Node version: `node -v` (need 20.x)
- Clear cache: `rm -rf .next node_modules && npm ci && npm run build`
- Check env vars: `env | grep NEXT_`

### Memory Issues
- PM2 config: `max_memory_restart: '500M'`
- Check usage: `pm2 monit`
- Increase if needed in `ecosystem.config.js`

## Release Process
- Semantic release configured (`.releaserc.json`)
- Conventional commits required
- Branches: `main` (stable), `develop` (beta)
- Auto-generates CHANGELOG.md and GitHub releases
