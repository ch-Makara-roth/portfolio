module.exports = {
  apps: [
    {
      // Next.js Application on Claw Cloud
      name: 'nextjs-app',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/app',
      instances: 2, // Optimized for Claw Cloud VPS resources
      exec_mode: 'cluster',
      
      // Environment variables for Claw Cloud
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOST: '0.0.0.0',
        NEXT_TELEMETRY_DISABLED: 1
      },
      
      // Logging
      log_file: '/var/log/pm2/nextjs-app.log',
      out_file: '/var/log/pm2/nextjs-app-out.log',
      error_file: '/var/log/pm2/nextjs-app-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Process management
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      restart_delay: 4000,
      
      // Health monitoring
      min_uptime: '10s',
      max_restarts: 10,
      
      // Advanced settings
      kill_timeout: 5000,
      listen_timeout: 8000,
      
      // Source map support
      source_map_support: true,
      
      // Merge logs from all instances
      merge_logs: true,
      
      // Time zone
      time: true
    },
    
    // Optional: Static file server (if using separate static server)
    {
      name: 'static-server',
      script: 'serve',
      args: '-s /var/www/html -l 8080',
      instances: 1,
      exec_mode: 'fork',
      
      env: {
        NODE_ENV: 'production'
      },
      
      // Logging
      log_file: '/var/log/pm2/static-server.log',
      out_file: '/var/log/pm2/static-server-out.log',
      error_file: '/var/log/pm2/static-server-error.log',
      
      // Process management
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      
      // Health monitoring
      min_uptime: '10s',
      max_restarts: 5,
      
      // Only start if serve package is available
      ignore_watch: ['node_modules', 'logs'],
      
      // Disable if not needed
      // Set to false to disable this app
      // disabled: true
    }
  ],
  
  // Deployment configuration for Claw Cloud
  deploy: {
    production: {
      user: 'root', // Default Claw Cloud user
      host: ['your-claw-cloud-ip'],
      ref: 'origin/main',
      repo: 'git@github.com:username/repository.git',
      path: '/var/www/app',
      'pre-deploy-local': '',
      'post-deploy': 'bun install --production && bun run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': 'mkdir -p /var/www/app /var/log/pm2',
      'ssh_options': 'StrictHostKeyChecking=no',
      'env': {
        'NODE_ENV': 'production'
      }
    }
  }
};