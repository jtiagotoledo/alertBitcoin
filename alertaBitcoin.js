require('dotenv').config();
const nodemailer = require('nodemailer');
const { pegarPrecoBTCBRL } = require('./modules/binance');

// Configuração do transporte SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

// Variável global para controlar último preço
let ultimoPreco = null;

// Função principal de checagem
async function checarPreco() {
  const precoAtual = await pegarPrecoBTCBRL();
  if (!precoAtual) return;

  // Só envia e-mail se houver variação > 500 BRL
  if (ultimoPreco === null || Math.abs(precoAtual - ultimoPreco) > 500) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: process.env.EMAIL,
        subject: 'Alerta Bitcoin BRL',
        text: `O preço atual do BTC é R$${precoAtual.toFixed(2)}`
      });
      console.log(`[${new Date().toISOString()}] E-mail enviado: R$${precoAtual.toFixed(2)}`);
    } catch (err) {
      console.error('Erro ao enviar e-mail:', err.message);
    }
  }

  ultimoPreco = precoAtual;
}

// Executa imediatamente ao iniciar
checarPreco();

// Executa a cada 2 minutos
setInterval(checarPreco, 2 * 60 * 1000);
