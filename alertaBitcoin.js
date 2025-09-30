require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

function enviarAlerta(mensagem) {
  const mailOptions = {
    from: process.env.EMAIL,
    to: process.env.EMAIL,     
    subject: 'Alerta de Bitcoin',
    text: mensagem
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Erro ao enviar e-mail:', error);
    } else {
      console.log('E-mail enviado:', info.response);
    }
  });
}

enviarAlerta('O preço do Bitcoin sofreu grande oscilação!');