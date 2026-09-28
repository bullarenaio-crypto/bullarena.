require('dotenv').config();
const { Telegraf } = require('telegraf');
const { TwitterApi } = require('twitter-api-v2');

// Inicialização dos clientes
const tgBot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const twitterClient = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function runTest() {
  const text = 
    `🚨 BULL ROYALE • LIVE TEST 🚨\n\n` +
    `⚡ System status: Online\n` +
    `🐂 Arena: Ready for battles\n\n` +
    `👉 https://bullroyale.io\n\n` +
    `#Solana #BULL #DeFi`;

  console.log('Enviando mensagem para o Telegram...');
  try {
    await tgBot.telegram.sendMessage(process.env.TELEGRAM_CHAT_ID, text);
    console.log('✅ Telegram: Enviado com sucesso!');
  } catch (err) {
    console.error('❌ Erro no Telegram:', err.message);
  }

  console.log('Enviando tweet para o X...');
  try {
    await twitterClient.v2.tweet(text);
    console.log('✅ X (Twitter): Postado com sucesso!');
  } catch (err) {
    console.error('❌ Erro no X:', err.data || err.message);
  }
}

runTest();
