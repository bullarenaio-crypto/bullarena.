require('dotenv').config();
const cron = require('node-cron');
const http = require('http');
const { Telegraf } = require('telegraf');
const { TwitterApi } = require('twitter-api-v2');

// Mantem o servico ativo no Render sem enviar nada
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bull Royale Bot is standing by (development phase).\n');
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

// Configuracao dos Bots
const tgBot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const twitterClient = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function postAnnouncement() {
  const text = 
    `🚨 BULL ROYALE ARENA 🚨\n\n` +
    `⚡ The arena is open! Connect and battle.\n` +
    `🐂 Claim your rewards now.\n\n` +
    `👉 https://bullroyale.io\n\n` +
    `#Solana #Crypto #Gaming #BullRoyale`;

  console.log(`[${new Date().toISOString()}] Disparo automatico iniciado...`);

  // Telegram
  try {
    await tgBot.telegram.sendMessage(process.env.TELEGRAM_CHAT_ID, text);
    console.log('✅ Telegram: Enviado com sucesso!');
  } catch (err) {
    console.error('❌ Erro Telegram:', err.message);
  }

  // X (Twitter)
  try {
    await twitterClient.v2.tweet(text);
    console.log('✅ X: Postado com sucesso!');
  } catch (err) {
    console.error('❌ Erro X:', err.data || err.message);
  }
}

// ==========================================
// COMANDOS TRAVADOS (EM DESENVOLVIMENTO)
// ==========================================

// postAnnouncement();

// cron.schedule('0 * * * *', () => {
//   postAnnouncement();
// });

console.log('⏸️ Bull Royale Bot pausado com sucesso. Nenhum disparo sera feito.');
