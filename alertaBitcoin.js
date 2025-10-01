require('dotenv').config();
const nodemailer = require('nodemailer');
const { pegarPrecoBTCBRL } = require('./modules/binance');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

let ultimoPreco = null;
const ALVO_VARIACAO = 0.1; 
const INTERVALO_MINUTOS = 10;

async function checarPreco() {
  const precoAtual = await pegarPrecoBTCBRL();
  if (!precoAtual) return;

  let enviarAlerta = false;
  let mensagem = '';

  if (ultimoPreco === null) {
    enviarAlerta = true;
    mensagem = `Preço inicial do BTC: R$${precoAtual.toFixed(2)}`;
  } else {
    const variacaoPercentual = ((precoAtual - ultimoPreco) / ultimoPreco) * 100;

    if (Math.abs(variacaoPercentual) >= ALVO_VARIACAO) {
      enviarAlerta = true;

      if (variacaoPercentual > 0) {
        mensagem = `⬆️ O preço do BTC AUMENTOU ${variacaoPercentual.toFixed(2)}%\n` +
                   `Último preço: R$${ultimoPreco.toFixed(2)}\n` +
                   `Preço atual: R$${precoAtual.toFixed(2)}`;
      } else {
        mensagem = `⬇️ O preço do BTC DIMINUIU ${Math.abs(variacaoPercentual).toFixed(2)}%\n` +
                   `Último preço: R$${ultimoPreco.toFixed(2)}\n` +
                   `Preço atual: R$${precoAtual.toFixed(2)}`;
      }
    }
  }

  if (enviarAlerta) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: process.env.EMAIL,
        subject: '📢 Alerta Bitcoin BRL',
        text: mensagem
      });
      console.log(`[${new Date().toISOString()}] E-mail enviado: ${mensagem}`);
    } catch (err) {
      console.error('Erro ao enviar e-mail:', err.message);
    }
  }

  ultimoPreco = precoAtual;
}

checarPreco();

setInterval(checarPreco, INTERVALO_MINUTOS * 60 * 1000);