# CI/CD Deployment Setup Guide

This guide will help you set up automated CI/CD deployment for your portfolio website.

## 📋 Prerequisites

- Your VPS is running Ubuntu with nginx and Node.js installed
- Your domain (chhuonmakararoth.site) is pointed to your VPS
- SSH access to your VPS is configured
- GitHub repository access

## 🔐 Required GitHub Secrets

Go to your GitHub repository → Settings → Secrets and Variables → Actions, then add these secrets:

### 1. **DEPLOY_HOST**
```
47.79.18.132
```
*Your VPS IP address (IPv4)*

### 2. **DEPLOY_USER**
```
root
```
*SSH username for your VPS*

### 3. **DEPLOY_KEY**
Your SSH private key for accessing the VPS. Generate it if you don't have one:

```bash
# On your local machine or VPS
ssh-keygen -t ed25519 -C "github-actions@chhuonmakararoth.site" -f ~/.ssh/portfolio_deploy

# Copy the private key content
cat ~/.ssh/portfolio_deploy
```

Then add the public key to your VPS:
```bash
# Copy the public key to your VPS authorized_keys
cat ~/.ssh/portfolio_deploy.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### 4. **NPM_TOKEN** (Optional)
Your NPM authentication token if you're publishing to NPM registry:
```bash
# Get NPM token
npm login
npm token create --read-only
```

### 5. **GITHUB_TOKEN** ✅
*Already provided by GitHub Actions automatically*

### 6. **CODECOV_TOKEN** (Optional)
If using Codecov for coverage reports:
- Go to https://codecov.io
- Connect your repository
- Copy the token from repository settings

### 7. **SLACK_WEBHOOK_URL** (Optional)
For Slack notifications:
- Create a Slack app at https://api.slack.com/apps
- Add Incoming Webhooks feature
- Create webhook URL for your channel

## 🚀 VPS Preparation

### 1. Install Required Tools

```bash
# Install Node.js 20 (if not already installed)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install Bun (optional, for faster builds)
curl -fsSL https://bun.sh/install | bash

# Create necessary directories
sudo mkdir -p /var/www/portfolio
sudo mkdir -p /var/log/pm2
sudo mkdir -p /var/backups/portfolio

# Set ownership
sudo chown -R $USER:$USER /var/www/portfolio
```

### 2. Configure PM2 for Auto-start

```bash
# Setup PM2 to start on boot
pm2 startup
pm2 save
```

### 3. Nginx Configuration Check

Ensure your nginx configuration is correct:
```bash
# Check nginx config
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

## 📝 How Deployment Works

### Automated Deployment (Recommended)
1. Push code to `main` branch
2. GitHub Actions automatically:
   - Builds and tests the application
   - Deploys to your VPS
   - Restarts the application with PM2
   - Performs health checks
   - Sends notifications (if configured)

### Manual Deployment
You can also deploy manually from the VPS:
```bash
cd /var/www/portfolio
./scripts/deploy.sh
```

## 🔍 Monitoring & Health Checks

### Health Check Endpoint
```
GET https://chhuonmakararoth.site/api/health
```

### PM2 Monitoring
```bash
# Check application status
pm2 status

# View logs
pm2 logs portfolio

# Restart application
pm2 restart portfolio
```

### Nginx Logs
```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

## 🛠️ Troubleshooting

### Common Issues

1. **SSH Connection Failed**
   - Verify DEPLOY_HOST and DEPLOY_USER secrets
   - Check SSH key format in DEPLOY_KEY secret
   - Ensure SSH key is added to VPS authorized_keys

2. **Build Failures**
   - Check GitHub Actions logs
   - Verify Node.js version compatibility
   - Check for TypeScript/linting errors

3. **Application Won't Start**
   - Check PM2 logs: `pm2 logs portfolio`
   - Verify port 3000 is available: `netstat -tuln | grep 3000`
   - Check application logs: `tail -f /var/log/portfolio.log`

4. **Nginx 502 Bad Gateway**
   - Ensure Next.js is running on port 3000
   - Check nginx error logs
   - Verify nginx configuration

### Debugging Commands

```bash
# Check if application is running
ps aux | grep next

# Check port usage
netstat -tuln | grep 3000

# Check disk space
df -h

# Check memory usage
free -h

# Test health endpoint locally
curl http://localhost:3000/api/health
```

## 🔄 Rollback Procedure

If deployment fails, you can rollback:

```bash
cd /var/www/portfolio

# Stop current application
pm2 stop portfolio

# List available backups
ls /var/backups/portfolio/

# Restore from backup (replace with actual backup name)
rm -rf .next
cp -r /var/backups/portfolio/portfolio-20241003_090000 .next

# Restart application
pm2 start ecosystem.config.js
```

## 📊 Performance Optimization

### PM2 Optimization
The current PM2 configuration is optimized for your VPS:
- Single instance (suitable for VPS resources)
- Memory restart at 500MB
- Auto-restart enabled
- Log rotation configured

### Nginx Optimization
Consider adding to your nginx config:
```nginx
# Enable gzip compression
gzip on;
gzip_vary on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;

# Enable browser caching
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## 🎯 Next Steps

1. ✅ Add all required GitHub secrets
2. ✅ Push a commit to main branch
3. ✅ Watch GitHub Actions deployment
4. ✅ Verify site is accessible
5. ✅ Test health check endpoint
6. ✅ Monitor PM2 and nginx logs

## 📞 Support

If you encounter issues:
1. Check GitHub Actions logs
2. Review VPS logs (`/var/log/deployment.log`)
3. Verify all secrets are correctly set
4. Ensure VPS has sufficient resources

---

**Your deployment is now configured for automatic CI/CD! 🚀**

Site: https://chhuonmakararoth.site
Health Check: https://chhuonmakararoth.site/api/health
