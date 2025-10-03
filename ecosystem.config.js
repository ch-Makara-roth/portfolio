module.exports = {
  apps: [
    {
      name: 'portfolio',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/portfolio',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        NEXT_TELEMETRY_DISABLED: 1
      },
      log_file: '/var/log/pm2/portfolio-combined.log',
      out_file: '/var/log/pm2/portfolio-out.log',
      error_file: '/var/log/pm2/portfolio-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      kill_timeout: 5000,
      restart_delay: 4000,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s'
    }
  ]
}
