#!/bin/bash

# =============================================================================
# Next.js VPS Deployment Script
# =============================================================================
# This script securely uploads built Next.js files to a VPS server
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

pull_latest_code() {
    log_info "Pulling latest code from GitHub ($GIT_BRANCH branch) on VPS..."
    
    sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_HOST" << EOF
        # Navigate to repository directory
        cd $VPS_REPO_PATH || {
            echo "Error: Repository path $VPS_REPO_PATH not found!"
            echo "Please ensure the repository is cloned at this location."
            exit 1
        }
        
        # Check if we're in a git repository
        if [ ! -d ".git" ]; then
            echo "Error: Not a git repository. Please ensure $VPS_REPO_PATH is a valid git repository."
            exit 1
        fi
        
        echo "Fetching latest changes from origin..."
        git fetch origin || {
            echo "Error: Failed to fetch from origin"
            exit 1
        }
        
        # Check current branch
        CURRENT_BRANCH=\$(git branch --show-current)
        if [ "\$CURRENT_BRANCH" != "$GIT_BRANCH" ]; then
            echo "Switching from \$CURRENT_BRANCH to $GIT_BRANCH branch..."
            git checkout $GIT_BRANCH || {
                echo "Error: Failed to checkout $GIT_BRANCH branch"
                exit 1
            }
        fi
        
        # Pull latest changes
        echo "Pulling latest changes from $GIT_BRANCH..."
        git pull origin $GIT_BRANCH || {
            echo "Error: Failed to pull latest changes from $GIT_BRANCH"
            exit 1
        }
        
        # Get latest commit info
        LATEST_COMMIT=\$(git log -1 --pretty=format:"%h - %s (%an, %ar)")
        echo "✅ Code updated to latest commit: \$LATEST_COMMIT"
        
        # Copy updated files to deployment directory
        echo "Copying updated files to deployment directory..."
        rsync -av --exclude='.git' --exclude='node_modules' --exclude='.next' $VPS_REPO_PATH/ $VPS_DEPLOY_PATH/
        
        echo "Latest code pulled and copied successfully"
EOF
    
    if [ $? -eq 0 ]; then
        log_success "Latest code pulled from GitHub and copied to deployment directory"
    else
        log_error "Failed to pull latest code from GitHub"
        exit 1
    fi
}

build_application_on_vps() {
    log_info "Building Next.js application on VPS..."
    
    sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_HOST" << EOF
        # Navigate to deployment directory
        cd $VPS_DEPLOY_PATH || {
            echo "Error: Deployment path $VPS_DEPLOY_PATH not found!"
            exit 1
        }
        
        # Install dependencies if package.json exists
        if [ -f "package.json" ]; then
            echo "Installing dependencies..."
            if command -v bun &> /dev/null && [ -f "bun.lockb" ]; then
                echo "Using Bun to install dependencies..."
                bun install --production
            elif command -v npm &> /dev/null; then
                echo "Using npm to install dependencies..."
                npm ci --production
            else
                echo "Error: Neither npm nor bun found on VPS"
                exit 1
            fi
        fi
        
        # Build the application
        echo "Building Next.js application..."
        if command -v bun &> /dev/null && [ -f "bun.lockb" ]; then
            echo "Using Bun to build..."
            bun run build
        elif command -v npm &> /dev/null; then
            echo "Using npm to build..."
            npm run build
        else
            echo "Error: Neither npm nor bun found on VPS"
            exit 1
        fi
        
        echo "Application built successfully"
EOF
    
    if [ $? -eq 0 ]; then
        log_success "Application built successfully on VPS"
    else
        log_error "Failed to build application on VPS"
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

upload_build_files() {
    log_info "Uploading Next.js build files and dependencies to VPS..."
    
    # Upload .next directory
    log_info "Uploading .next build directory..."
    sshpass -p "$VPS_PASSWORD" rsync -avz --progress --delete \
        -e "ssh -o StrictHostKeyChecking=no" \
        "$LOCAL_BUILD_DIR/" "$VPS_USER@$VPS_HOST:$VPS_DEPLOY_PATH/.next/"
    
    if [ $? -ne 0 ]; then
        log_error "Failed to upload .next directory"
        exit 1
    fi
    
    # Upload node_modules directory
    log_info "Uploading node_modules directory (this may take a while)..."
    sshpass -p "$VPS_PASSWORD" rsync -avz --progress --delete \
        -e "ssh -o StrictHostKeyChecking=no" \
        "$LOCAL_NODE_MODULES/" "$VPS_USER@$VPS_HOST:$VPS_DEPLOY_PATH/node_modules/"
    
    if [ $? -ne 0 ]; then
        log_error "Failed to upload node_modules directory"
        exit 1
    fi
    
    # Upload public directory if it exists
    if [ -d "$LOCAL_PUBLIC_DIR" ]; then
        log_info "Uploading public directory..."
        sshpass -p "$VPS_PASSWORD" rsync -avz --progress \
            -e "ssh -o StrictHostKeyChecking=no" \
            "$LOCAL_PUBLIC_DIR/" "$VPS_USER@$VPS_HOST:$VPS_DEPLOY_PATH/public/"
        
        if [ $? -ne 0 ]; then
            log_error "Failed to upload public directory"
            exit 1
        fi
    fi
    
    # Upload package.json if it exists
    if [ -f "$LOCAL_PACKAGE_JSON" ]; then
        log_info "Uploading package.json..."
        sshpass -p "$VPS_PASSWORD" scp -o StrictHostKeyChecking=no \
            "$LOCAL_PACKAGE_JSON" "$VPS_USER@$VPS_HOST:$VPS_DEPLOY_PATH/"
        
        if [ $? -ne 0 ]; then
            log_error "Failed to upload package.json"
            exit 1
        fi
    fi
    
    # Upload package-lock.json if it exists
    if [ -f "$LOCAL_PACKAGE_LOCK" ]; then
        log_info "Uploading package-lock.json..."
        sshpass -p "$VPS_PASSWORD" scp -o StrictHostKeyChecking=no \
            "$LOCAL_PACKAGE_LOCK" "$VPS_USER@$VPS_HOST:$VPS_DEPLOY_PATH/"
        
        if [ $? -ne 0 ]; then
            log_error "Failed to upload package-lock.json"
            exit 1
        fi
    fi
    
    log_success "All files and dependencies uploaded successfully"
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
    log_info "Starting Next.js deployment to VPS with latest code from GitHub..."
    echo "=================================="
    echo "VPS Host: $VPS_HOST"
    echo "Deploy Path: $VPS_DEPLOY_PATH"
    echo "Repository Path: $VPS_REPO_PATH"
    echo "Git Branch: $GIT_BRANCH"
    echo "Local Build Dir: $LOCAL_BUILD_DIR"
    echo "Local Node Modules: $LOCAL_NODE_MODULES"
    echo "=================================="
    
    # Run all deployment steps
    check_dependencies
    test_ssh_connection
    pull_latest_code
    build_application_on_vps
    set_file_permissions
    
    log_success "Deployment completed successfully!"
    log_info "Your Next.js application has been deployed to: $VPS_HOST:$VPS_DEPLOY_PATH"
    log_info "Latest code from GitHub $GIT_BRANCH branch has been pulled and built on VPS"
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