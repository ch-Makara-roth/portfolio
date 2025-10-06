#!/bin/bash

# =============================================================================
# Next.js VPS Deployment Script (Remote Dependency Installation)
# =============================================================================
# This script uploads build files and installs dependencies on the VPS
# Author: Portfolio Deployment Script
# Version: 1.0 (Remote Install Variant)
# =============================================================================

set -e  # Exit on any error

# =============================================================================
# Configuration Variables
# =============================================================================
VPS_HOST="47.79.18.132"
VPS_USER="root"
VPS_PASSWORD="k6p1:Y3M5cr(IQ"
VPS_DEPLOY_PATH="/var/www/portfolio"
LOCAL_BUILD_DIR=".next"
LOCAL_PUBLIC_DIR="public"
LOCAL_PACKAGE_JSON="package.json"
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
    log_info "Checking for Next.js build files..."
    
    if [ ! -d "$LOCAL_BUILD_DIR" ]; then
        log_error "Build directory '$LOCAL_BUILD_DIR' not found!"
        log_info "Please run 'npm run build' first to generate the build files."
        exit 1
    fi
    
    if [ ! -d "$LOCAL_PUBLIC_DIR" ]; then
        log_warning "Public directory '$LOCAL_PUBLIC_DIR' not found!"
    fi
    
    if [ ! -f "$LOCAL_PACKAGE_JSON" ]; then
        log_error "package.json not found in current directory!"
        log_info "package.json is required for dependency installation on VPS."
        exit 1
    fi
    
    log_success "Build files validation completed"
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

check_vps_node() {
    log_info "Checking Node.js and npm on VPS..."
    
    sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_HOST" << 'EOF'
        # Check if Node.js is installed
        if ! command -v node &> /dev/null; then
            echo "ERROR: Node.js is not installed on VPS"
            echo "Please install Node.js first:"
            echo "  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -"
            echo "  sudo apt-get install -y nodejs"
            exit 1
        fi
        
        # Check if npm is installed
        if ! command -v npm &> /dev/null; then
            echo "ERROR: npm is not installed on VPS"
            exit 1
        fi
        
        echo "Node.js version: $(node --version)"
        echo "npm version: $(npm --version)"
EOF
    
    if [ $? -eq 0 ]; then
        log_success "Node.js and npm are available on VPS"
    else
        log_error "Node.js or npm not found on VPS"
        exit 1
    fi
}

# =============================================================================
# Deployment Functions
# =============================================================================

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
    log_info "Uploading Next.js build files to VPS..."
    
    # Upload .next directory
    log_info "Uploading .next build directory..."
    sshpass -p "$VPS_PASSWORD" rsync -avz --progress --delete \
        -e "ssh -o StrictHostKeyChecking=no" \
        "$LOCAL_BUILD_DIR/" "$VPS_USER@$VPS_HOST:$VPS_DEPLOY_PATH/.next/"
    
    if [ $? -ne 0 ]; then
        log_error "Failed to upload .next directory"
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
    
    # Upload package.json
    log_info "Uploading package.json..."
    sshpass -p "$VPS_PASSWORD" scp -o StrictHostKeyChecking=no \
        "$LOCAL_PACKAGE_JSON" "$VPS_USER@$VPS_HOST:$VPS_DEPLOY_PATH/"
    
    if [ $? -ne 0 ]; then
        log_error "Failed to upload package.json"
        exit 1
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
    
    log_success "All files uploaded successfully"
}

install_dependencies_on_vps() {
    log_info "Installing dependencies on VPS (this may take a while)..."
    
    sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_HOST" << EOF
        cd $VPS_DEPLOY_PATH
        
        echo "Current directory: \$(pwd)"
        echo "Installing production dependencies..."
        
        # Install only production dependencies
        npm ci --only=production
        
        if [ \$? -eq 0 ]; then
            echo "Dependencies installed successfully"
        else
            echo "Failed to install dependencies"
            exit 1
        fi
EOF
    
    if [ $? -eq 0 ]; then
        log_success "Dependencies installed successfully on VPS"
    else
        log_error "Failed to install dependencies on VPS"
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
    log_info "Starting Next.js deployment to VPS (Remote Install Mode)..."
    echo "=================================="
    echo "VPS Host: $VPS_HOST"
    echo "Deploy Path: $VPS_DEPLOY_PATH"
    echo "Local Build Dir: $LOCAL_BUILD_DIR"
    echo "Dependency Installation: Remote (on VPS)"
    echo "=================================="
    
    # Run all deployment steps
    check_dependencies
    check_build_files
    test_ssh_connection
    check_vps_node
    prepare_vps_directory
    upload_build_files
    install_dependencies_on_vps
    set_file_permissions
    
    log_success "Deployment completed successfully!"
    log_info "Your Next.js application has been deployed to: $VPS_HOST:$VPS_DEPLOY_PATH"
    log_info "Dependencies were installed directly on the VPS for optimal performance."
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
    log_info "REMOTE INSTALL MODE:"
    echo "This script installs dependencies on the VPS instead of transferring node_modules."
    echo "Benefits: Faster uploads, platform-specific binaries, smaller transfer size"
    echo "Requirements: Node.js and npm must be installed on the VPS"
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