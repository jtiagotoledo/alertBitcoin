require('dotenv').config();
const nodemailer = require('nodemailer');
const { pegarPrecoBTCBRL } = require('./modules/binance');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASS }
});

let ultimoPreco = null;

async function checarPreco() {
    const precoAtual = await pegarPrecoBTCBRL();
    if (!precoAtual) return;

    await transporter.sendMail({
        from: process.env.EMAIL,
        to: process.env.EMAIL,
        subject: 'Alerta Bitcoin BRL',
        text: `O preço atual do BTC é R$${precoAtual.toFixed(2)}`
    });
    console.log(`[${new Date().toISOString()}] E-mail enviado: R$${precoAtual.toFixed(2)}`);
}

ultimoPreco = precoAtual;

// Executa o script (PM2 cron pode chamar a cada 2 minutos)
checarPreco();
