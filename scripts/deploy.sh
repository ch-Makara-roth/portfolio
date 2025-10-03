#!/bin/bash

# Portfolio Deployment Script for VPS
# Usage: ./scripts/deploy.sh [environment]

set -e  # Exit on error

# Configuration
APP_NAME="portfolio"
APP_PATH="/var/www/portfolio"
PM2_ECOSYSTEM="ecosystem.config.js"
BACKUP_DIR="/var/backups/portfolio"
LOG_FILE="/var/log/deployment.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Error handling
error_exit() {
    log "${RED}ERROR: $1${NC}"
    exit 1
}

# Success message
success() {
    log "${GREEN}✅ $1${NC}"
}

# Info message
info() {
    log "${BLUE}ℹ️  $1${NC}"
}

# Warning message
warn() {
    log "${YELLOW}⚠️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    error_exit "package.json not found. Please run this script from the project root."
fi

# Create necessary directories
mkdir -p "$BACKUP_DIR"
mkdir -p "/var/log/pm2"

info "Starting deployment of $APP_NAME..."

# Step 1: Create backup
info "Creating backup..."
if [ -d ".next" ]; then
    BACKUP_NAME="portfolio-$(date +%Y%m%d_%H%M%S)"
    cp -r .next "$BACKUP_DIR/$BACKUP_NAME"
    success "Backup created: $BACKUP_DIR/$BACKUP_NAME"
fi

# Step 2: Install dependencies
info "Installing dependencies..."
if [ -f "bun.lockb" ]; then
    if ! command -v bun &> /dev/null; then
        info "Installing Bun..."
        curl -fsSL https://bun.sh/install | bash
        export PATH="$PATH:$HOME/.bun/bin"
    fi
    bun install --production
else
    npm ci --production
fi
success "Dependencies installed"

# Step 3: Build application
info "Building application..."
if [ -f "bun.lockb" ]; then
    bun run build
else
    npm run build
fi
success "Application built successfully"

# Step 4: Stop current application
info "Stopping current application..."
if command -v pm2 &> /dev/null && pm2 list | grep -q "$APP_NAME"; then
    pm2 stop "$APP_NAME" || true
    success "PM2 application stopped"
elif [ -f "/tmp/portfolio.pid" ]; then
    PID=$(cat /tmp/portfolio.pid)
    if ps -p $PID > /dev/null 2>&1; then
        kill $PID
        sleep 2
        success "Application stopped (PID: $PID)"
    fi
fi

# Kill any remaining Next.js processes
pkill -f "next-server" || true
pkill -f "next start" || true

# Step 5: Start application
info "Starting application..."
if [ -f "$PM2_ECOSYSTEM" ]; then
    if ! command -v pm2 &> /dev/null; then
        info "Installing PM2..."
        npm install -g pm2
    fi
    pm2 start "$PM2_ECOSYSTEM" --env production
    pm2 save
    success "Application started with PM2"
else
    # Fallback to direct start
    nohup npm start > /var/log/portfolio.log 2>&1 &
    echo $! > /tmp/portfolio.pid
    success "Application started directly"
fi

# Step 6: Health check
info "Performing health check..."
sleep 5

# Check if port 3000 is listening
if netstat -tuln | grep -q ":3000 "; then
    success "Application is listening on port 3000"
else
    error_exit "Application is not listening on port 3000"
fi

# Step 7: Reload nginx
info "Reloading nginx..."
if systemctl is-active --quiet nginx; then
    systemctl reload nginx
    success "Nginx reloaded"
else
    warn "Nginx not running or systemctl not available"
fi

# Step 8: Cleanup old backups (keep last 5)
info "Cleaning up old backups..."
find "$BACKUP_DIR" -name "portfolio-*" -type d | sort -r | tail -n +6 | xargs rm -rf 2>/dev/null || true
success "Old backups cleaned up"

# Step 9: Final check
info "Final health check..."
sleep 3

if curl -f -s "http://localhost:3000" > /dev/null; then
    success "✅ Deployment completed successfully!"
    info "🌐 Site should be accessible at: https://chhuonmakararoth.site"
else
    error_exit "Health check failed - application may not be running correctly"
fi

info "🎉 Deployment completed! Check logs at: $LOG_FILE"
