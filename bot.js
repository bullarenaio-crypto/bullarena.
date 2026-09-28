require('dotenv').config();
const cron = require('node-cron');
const { Telegraf } = require('telegraf');
const { TwitterApi } = require('twitter-api-v2');

// Inicialização
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

  console.log(`[${new Date().toISOString()}] Executando disparo automático...`);

  // Disparo Telegram
  try {
    await tgBot.telegram.sendMessage(process.env.TELEGRAM_CHAT_ID, text);
    console.log('✅ Telegram: Enviado com sucesso!');
  } catch (err) {
    console.error('❌ Erro Telegram:', err.message);
  }

  // Disparo X (Twitter)
  try {
    await twitterClient.v2.tweet(text);
    console.log('✅ X: Postado com sucesso!');
  } catch (err) {
    console.error('❌ Erro X:', err.data || err.message);
  }
}

// Executa no momento do arranque
postAnnouncement();

// Agenda para rodar no minuto 0 de cada hora (ex: 09:00, 10:00, 11:00...)
cron.schedule('0 * * * *', () => {
  postAnnouncement();
});

console.log('🚀 Bull Royale Bot iniciado e rodando 24/7!');
