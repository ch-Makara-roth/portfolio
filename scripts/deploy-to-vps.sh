#!/bin/bash

# =============================================================================
# Next.js VPS Deployment Script - Optimized for Low-Resource Servers
# =============================================================================
# This script deploys a Next.js application to a VPS server with limited resources.
# It syncs the latest source code from GitHub and uploads pre-built files from
# the local machine to avoid resource-intensive build operations on the VPS.
#
# 🚀 OPTIMIZATION FEATURES:
# - No npm install/build operations on VPS (saves CPU/memory)
# - Uses pre-built .next directory from local machine
# - Compressed file transfers with rsync
# - Excludes unnecessary files (tests, cache, source maps)
# - Lightweight Git operations only
#
# Prerequisites:
# - sshpass installed on local machine
# - rsync installed on local machine  
# - Git repository cloned on VPS at ~/repositories/portfolio
# - SSH access to VPS configured
# - Next.js application built locally (.next directory exists)
# - Run 'npm run build' or 'bun run build' locally before deployment
#
# Usage: ./deploy-to-vps.sh
# Author: Portfolio Deployment Script
# Version: 1.0
# =============================================================================

set -e  # Exit on any error

# =============================================================================
# Configuration Variables
# =============================================================================
VPS_HOST="47.79.18.132"
VPS_USER="root"
VPS_PASSWORD="k6p1:Y3M5cr(IQ"
VPS_DEPLOY_PATH="/var/www/portfolio"
VPS_REPO_PATH="~/repositories/portfolio"
GIT_BRANCH="main"
LOCAL_BUILD_DIR=".next"
LOCAL_PUBLIC_DIR="public"
LOCAL_PACKAGE_JSON="package.json"
LOCAL_NODE_MODULES="node_modules"
LOCAL_PACKAGE_LOCK="package-lock.json"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# =============================================================================
# Utility Functions
# =============================================================================

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# =============================================================================
# Validation Functions
# =============================================================================

check_dependencies() {
    log_info "Checking required dependencies..."
    
    # Check if sshpass is installed
    if ! command -v sshpass &> /dev/null; then
        log_error "sshpass is required but not installed."
        log_info "Install it using:"
        log_info "  macOS: brew install sshpass"
        log_info "  Ubuntu/Debian: sudo apt-get install sshpass"
        log_info "  CentOS/RHEL: sudo yum install sshpass"
        exit 1
    fi
    
    # Check if rsync is installed
    if ! command -v rsync &> /dev/null; then
        log_error "rsync is required but not installed."
        exit 1
    fi
    
    log_success "All dependencies are available"
}

check_build_files() {
    log_info "Checking for Next.js build files and dependencies..."
    
    if [ ! -d "$LOCAL_BUILD_DIR" ]; then
        log_error "Build directory '$LOCAL_BUILD_DIR' not found!"
        log_info "Please run 'npm run build' first to generate the build files."
        exit 1
    fi
    
    if [ ! -d "$LOCAL_PUBLIC_DIR" ]; then
        log_warning "Public directory '$LOCAL_PUBLIC_DIR' not found!"
    fi
    
    if [ ! -f "$LOCAL_PACKAGE_JSON" ]; then
        log_warning "package.json not found in current directory!"
    fi
    
    if [ ! -d "$LOCAL_NODE_MODULES" ]; then
        log_error "node_modules directory '$LOCAL_NODE_MODULES' not found!"
        log_info "Please run 'npm install' first to install dependencies."
        exit 1
    fi
    
    if [ ! -f "$LOCAL_PACKAGE_LOCK" ]; then
        log_warning "package-lock.json not found! This may cause dependency version issues."
    fi
    
    log_success "Build files and dependencies validation completed"
}

test_ssh_connection() {
    log_info "Testing SSH connection to VPS..."
    
    if sshpass -p "$VPS_PASSWORD" ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no "$VPS_USER@$VPS_HOST" "echo 'Connection successful'" &> /dev/null; then
        log_success "SSH connection to VPS established successfully"
        return 0
    else
        log_error "Failed to establish SSH connection to VPS"
        log_error "Please check:"
        log_error "  - VPS IP address: $VPS_HOST"
        log_error "  - Username: $VPS_USER"
        log_error "  - Password credentials"
        log_error "  - Network connectivity"
        return 1
    fi
}

# =============================================================================
# Deployment Functions
# =============================================================================

sync_source_code() {
    log_info "Syncing latest source code from GitHub repository..."
    
    sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_HOST" << EOF
        # Navigate to repository path
        cd $VPS_REPO_PATH || {
            echo "Error: Repository path $VPS_REPO_PATH not found!"
            exit 1
        }
        
        # Verify it's a git repository
        if [ ! -d ".git" ]; then
            echo "Error: $VPS_REPO_PATH is not a git repository!"
            exit 1
        fi
        
        # Lightweight git operations only
        echo "Fetching latest changes from origin..."
        git fetch origin --quiet
        
        # Switch to target branch if not already on it
        current_branch=\$(git branch --show-current)
        if [ "\$current_branch" != "$GIT_BRANCH" ]; then
            echo "Switching to $GIT_BRANCH branch..."
            git checkout $GIT_BRANCH --quiet
        fi
        
        # Pull latest changes
        echo "Pulling latest changes from origin/$GIT_BRANCH..."
        git pull origin $GIT_BRANCH --quiet
        
        # Show latest commit
        echo "Latest commit:"
        git log -1 --oneline
        
        # Create deployment directory if it doesn't exist
        mkdir -p $VPS_DEPLOY_PATH
        
        # Copy only essential source files (no build operations)
        echo "Copying source files to deployment directory..."
        rsync -av --quiet \
            --exclude='.git' \
            --exclude='node_modules' \
            --exclude='.next' \
            --exclude='__tests__' \
            --exclude='*.test.*' \
            --exclude='*.spec.*' \
            $VPS_REPO_PATH/ $VPS_DEPLOY_PATH/
        
        echo "Source code sync completed"
EOF
    
    if [ $? -eq 0 ]; then
        log_success "Successfully synced latest source code"
    else
        log_error "Failed to sync source code"
        exit 1
    fi
}



prepare_vps_directory() {
    log_info "Preparing VPS directory structure..."
    
    sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_HOST" << EOF
        # Create deployment directory if it doesn't exist
        mkdir -p $VPS_DEPLOY_PATH
        
        # Create backup of existing deployment (if any)
        if [ -d "$VPS_DEPLOY_PATH/.next" ]; then
            echo "Creating backup of existing deployment..."
            mv $VPS_DEPLOY_PATH $VPS_DEPLOY_PATH.backup.\$(date +%Y%m%d_%H%M%S)
            mkdir -p $VPS_DEPLOY_PATH
        fi
        
        # Set proper ownership
        chown -R $VPS_USER:$VPS_USER $VPS_DEPLOY_PATH
        
        echo "VPS directory prepared successfully"
EOF
    
    if [ $? -eq 0 ]; then
        log_success "VPS directory structure prepared"
    else
        log_error "Failed to prepare VPS directory structure"
        exit 1
    fi
}



set_file_permissions() {
    log_info "Setting proper file permissions on VPS..."
    
    sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_HOST" << EOF
        # Set directory permissions
        find $VPS_DEPLOY_PATH -type d -exec chmod 755 {} \;
        
        # Set file permissions
        find $VPS_DEPLOY_PATH -type f -exec chmod 644 {} \;
        
        # Set executable permissions for specific files if needed
        if [ -f "$VPS_DEPLOY_PATH/package.json" ]; then
            chmod 644 $VPS_DEPLOY_PATH/package.json
        fi
        
        # Set proper ownership
        chown -R $VPS_USER:$VPS_USER $VPS_DEPLOY_PATH
        
        echo "File permissions set successfully"
EOF
    
    if [ $? -eq 0 ]; then
        log_success "File permissions configured properly"
    else
        log_error "Failed to set file permissions"
        exit 1
    fi
}

# =============================================================================
# Main Deployment Function
# =============================================================================

deploy() {
    log_info "Starting optimized Next.js deployment to VPS..."
    echo "=================================="
    echo "VPS Host: $VPS_HOST"
    echo "Deploy Path: $VPS_DEPLOY_PATH"
    echo "Repository Path: $VPS_REPO_PATH"
    echo "Git Branch: $GIT_BRANCH"
    echo "Local Build Dir: $LOCAL_BUILD_DIR"
    echo "Local Node Modules: $LOCAL_NODE_MODULES"
    echo "=================================="
    echo "⚡ Optimized for low-resource VPS"
    echo "📦 Using pre-built files from local machine"
    echo "🚫 No build/install operations on VPS"
    echo "=================================="
    
    # Run optimized deployment steps
    check_dependencies
    check_build_files
    test_ssh_connection
    sync_source_code
    prepare_vps_directory
    upload_prebuilt_files
    set_file_permissions
    
    log_success "Optimized deployment completed successfully!"
    log_info "Your Next.js application has been deployed to: $VPS_HOST:$VPS_DEPLOY_PATH"
    log_info "✅ Latest source code synced from GitHub $GIT_BRANCH branch"
    log_info "✅ Pre-built files uploaded from local machine"
    log_info "✅ No resource-intensive operations performed on VPS"
}

# =============================================================================
# Security Warning and Recommendations
# =============================================================================

show_security_warning() {
    echo ""
    log_warning "SECURITY NOTICE:"
    echo "This script uses password authentication for demonstration purposes."
    echo "For production environments, please consider:"
    echo "  1. Using SSH key-based authentication"
    echo "  2. Storing credentials in environment variables"
    echo "  3. Using a secure secrets management system"
    echo "  4. Implementing proper firewall rules"
    echo "  5. Regular security updates on the VPS"
    echo ""
}

# =============================================================================
# Script Entry Point
# =============================================================================

main() {
    show_security_warning
    
    # Ask for confirmation before proceeding
    read -p "Do you want to proceed with the deployment? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Deployment cancelled by user"
        exit 0
    fi
    
    deploy
}

# Run the main function if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi