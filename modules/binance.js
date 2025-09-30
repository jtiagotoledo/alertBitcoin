const axios = require('axios');

async function pegarPrecoBTCBRL() {
  try {
    const response = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCBRL');
    const preco = parseFloat(response.data.price);
    return preco;
  } catch (err) {
    console.error('Erro ao pegar preço do BTC:', err.message);
    return null;
  }
}

module.exports = { pegarPrecoBTCBRL };