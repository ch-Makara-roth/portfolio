# Next.js VPS Deployment Script - Optimized for Low-Resource Servers

 git worktree

A secure and optimized deployment script for Next.js applications designed specifically for VPS servers with limited CPU, memory, and storage resources.

## 🚀 Key Optimizations

- **No VPS Build Operations**: Avoids `npm install` and `npm run build` on the server
- **Pre-built File Transfer**: Uses locally built files to reduce VPS resource usage
- **Compressed Transfers**: Optimized rsync with compression for faster uploads
- **Lightweight Git Operations**: Minimal Git commands with `--quiet` flags
- **Selective File Exclusion**: Skips unnecessary files (tests, cache, source maps)
- **Resource-Conscious Design**: Perfect for low-spec VPS environments

## Features

- ✅ **Resource-Optimized**: No build/install operations on VPS
- ✅ **GitHub Integration**: Syncs latest source code from repository
- ✅ **Pre-built Deployment**: Uses locally built .next directory
- ✅ **Secure SSH**: Password-based authentication with sshpass
- ✅ **Compressed Transfers**: Efficient file synchronization with rsync
- ✅ **Smart Exclusions**: Skips tests, cache, and development files
- ✅ **Error Handling**: Comprehensive validation and error reporting
- ✅ **Connection Testing**: Validates SSH connectivity before deployment

## Prerequisites

### Required Dependencies

1. **sshpass** - For password-based SSH authentication
   ```bash
   # macOS
   brew install sshpass
   
   # Ubuntu/Debian
   sudo apt-get install sshpass
   
   # CentOS/RHEL
   sudo yum install sshpass
   ```

2. **rsync** - For efficient file synchronization (usually pre-installed)

3. **ssh** - SSH client (usually pre-installed)

### Local Build Requirements

⚠️ **IMPORTANT**: Build your application locally before deployment to avoid resource usage on VPS:

```bash
# Install dependencies locally
npm install
# or
bun install

# Build the application locally
npm run build
# or  
bun run build
```

### VPS Setup Requirements

1. **Git Repository**: Ensure your project repository is cloned on the VPS:
   ```bash
   # On your VPS
   cd ~/repositories
   git clone https://github.com/your-username/your-repo.git portfolio
   ```

2. **Directory Structure**: The script expects this structure on your VPS:
   ```
   ~/repositories/portfolio/    # Git repository
   /var/www/portfolio/         # Deployment directory
   ```

## Usage

### Deployment Options

You have two deployment options:

#### Option 1: Transfer node_modules (Default)
This transfers your local `node_modules` directory to the VPS.

1. Make the script executable:
   ```bash
   chmod +x scripts/deploy-to-vps.sh
   ```

2. Run the deployment script:
   ```bash
   ./scripts/deploy-to-vps.sh
   ```

#### Option 2: Remote Installation (Recommended)
This installs dependencies directly on the VPS, which is faster and more efficient.

1. Make the script executable:
   ```bash
   chmod +x scripts/deploy-to-vps-remote-install.sh
   ```

2. Run the remote install deployment script:
   ```bash
   ./scripts/deploy-to-vps-remote-install.sh
   ```

**Note**: The remote installation option requires Node.js and npm to be installed on your VPS.

3. Confirm the deployment when prompted.

### Script Configuration

The script uses the following default configuration:

```bash
VPS_HOST="47.79.18.132"
VPS_USER="root"
VPS_PASSWORD="k6p1:Y3M5cr(IQ"
VPS_DEPLOY_PATH="/var/www/portfolio"
LOCAL_BUILD_DIR=".next"
LOCAL_PUBLIC_DIR="public"
LOCAL_NODE_MODULES="node_modules"
LOCAL_PACKAGE_LOCK="package-lock.json"
```

To modify these settings, edit the configuration variables at the top of the script.

## Security Recommendations

### 🔒 SSH Key Authentication (Recommended for Production)

For enhanced security, use SSH key-based authentication instead of passwords:

#### 1. Generate SSH Key Pair

```bash
# Generate a new SSH key pair
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"

# Or use Ed25519 (more secure)
ssh-keygen -t ed25519 -C "your-email@example.com"
```

#### 2. Copy Public Key to VPS

```bash
# Copy your public key to the VPS
ssh-copy-id root@47.79.18.132

# Or manually copy the key
cat ~/.ssh/id_rsa.pub | ssh root@47.79.18.132 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

#### 3. Update Deployment Script for SSH Keys

Create a modified version of the script that uses SSH keys:

```bash
#!/bin/bash
# Remove password-related lines and update SSH commands:

# Instead of:
# sshpass -p "$VPS_PASSWORD" ssh ...

# Use:
# ssh -i ~/.ssh/id_rsa ...

# Instead of:
# sshpass -p "$VPS_PASSWORD" rsync ... -e "ssh -o StrictHostKeyChecking=no"

# Use:
# rsync ... -e "ssh -i ~/.ssh/id_rsa -o StrictHostKeyChecking=no"
```

### 🛡️ Additional Security Measures

1. **Environment Variables**: Store sensitive credentials in environment variables
   ```bash
   export VPS_PASSWORD="your-secure-password"
   export VPS_HOST="your-vps-ip"
   ```

2. **Firewall Configuration**: Restrict SSH access to specific IP addresses
   ```bash
   # On VPS (using ufw)
   sudo ufw allow from YOUR_IP_ADDRESS to any port 22
   sudo ufw deny 22
   ```

3. **SSH Configuration**: Enhance SSH security on your VPS
   ```bash
   # Edit /etc/ssh/sshd_config on VPS
   PermitRootLogin no                    # Disable root login
   PasswordAuthentication no             # Disable password auth
   PubkeyAuthentication yes              # Enable key auth
   Port 2222                            # Change default port
   ```

4. **Regular Updates**: Keep your VPS updated
   ```bash
   # Ubuntu/Debian
   sudo apt update && sudo apt upgrade
   
   # CentOS/RHEL
   sudo yum update
   ```

## Deployment Process

The script performs the following steps:

1. **Dependency Check**: Validates required tools are installed
2. **Build Validation**: Ensures Next.js build files and node_modules exist
3. **Connection Test**: Verifies SSH connectivity to VPS
4. **Directory Preparation**: Creates deployment directory and backup
5. **File Upload**: Transfers build files, dependencies, and assets using rsync
   - `.next` directory (build output)
   - `node_modules` directory (dependencies)
   - `public` directory (static assets)
   - `package.json` and `package-lock.json` (project metadata)
6. **Permission Setup**: Sets appropriate file permissions
7. **Completion**: Reports deployment status

## File Structure

After deployment, your VPS will have the following structure:

```
/var/www/portfolio/
├── .next/                 # Next.js build output
├── node_modules/         # Dependencies and packages
├── public/               # Static assets
├── package.json          # Project metadata
├── package-lock.json     # Dependency lock file
└── [backup directories]  # Previous deployments
```

## Troubleshooting

### Common Issues

1. **sshpass not found**
   ```bash
   # Install sshpass using your package manager
   brew install sshpass  # macOS
   ```

2. **Permission denied**
   ```bash
   # Ensure script is executable
   chmod +x scripts/deploy-to-vps.sh
   ```

3. **SSH connection failed**
   - Verify VPS IP address and credentials
   - Check network connectivity
   - Ensure SSH service is running on VPS

4. **Build directory not found**
   ```bash
   # Build your Next.js application first
   npm run build
   ```

5. **node_modules directory not found**
   ```bash
   # Install dependencies first
   npm install
   ```

6. **Large node_modules upload time**
   - The node_modules directory can be large and may take time to upload
   - Consider using `.rsyncignore` to exclude unnecessary files
   - For faster deployments, you might want to install dependencies directly on the VPS

### Debug Mode

For detailed debugging, you can modify the script to include verbose output:

```bash
# Add to the top of the script after set -e
set -x  # Enable debug mode
```

## Environment Variables

You can override default configuration using environment variables:

```bash
export VPS_HOST="your-vps-ip"
export VPS_USER="your-username"
export VPS_PASSWORD="your-password"
export VPS_DEPLOY_PATH="/your/deploy/path"

./scripts/deploy-to-vps.sh
```

## Contributing

To improve this deployment script:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This deployment script is provided as-is for educational and development purposes. Use at your own risk and ensure proper security measures are in place for production environments.