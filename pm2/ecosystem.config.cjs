module.exports = {
  apps: [
    {
      name: 'cafco',
      cwd: process.env.CAFCO_RELEASE_PATH || '/var/www/cafco/current',
      script: '.next/standalone/server.js',
      instances: process.env.WEB_CONCURRENCY || 2,
      exec_mode: 'cluster',
      max_memory_restart: '512M',
      out_file: '/var/log/cafco/pm2-out.log',
      error_file: '/var/log/cafco/pm2-error.log',
      merge_logs: true,
      time: true,
      kill_timeout: 10000,
      listen_timeout: 10000,
      env: {
        NODE_ENV: 'production',
        PORT: '3000',
        HOSTNAME: '127.0.0.1',
        HOST: '127.0.0.1',
        NEXT_TELEMETRY_DISABLED: '1',
      },
    },
  ],
};
