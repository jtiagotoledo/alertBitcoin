module.exports = {
  apps: [
    {
      name: 'alerta-bitcoin',
      script: './alertaBitcoin.js',
      cron_restart: '*/2 * * * *', 
      watch: false,                 
      instances: 1,                 
      autorestart: false,           
      log_date_format: 'YYYY-MM-DD HH:mm:ss'
    }
  ]
};