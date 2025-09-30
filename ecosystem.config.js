module.exports = {
  apps: [
    {
      name: 'alerta-bitcoin',
      script: './alertaBitcoin.js',
      cron_restart: '*/2 * * * *', 
      watch: false
    }
  ]
};