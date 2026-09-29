require('dotenv').config();
const { Telegraf } = require('telegraf');

// Validação da chave do Telegram
const botToken = process.env.BOT_TOKEN;

if (!botToken) {
  console.error('ERRO: BOT_TOKEN não está definido nas variáveis de ambiente!');
  process.exit(1);
}

const tgBot = new Telegraf(botToken);

// Comando /start para o bot interagir no Telegram
tgBot.start((ctx) => {
  ctx.reply(
    '🚨 **BULL ROYALE ARENA** 🚨\n\n' +
    '⚡ The arena is open! Connect and battle.\n' +
    '🐂 Claim your rewards now.\n\n' +
    '👉 https://bullroyale.io',
    { parse_mode: 'Markdown' }
  );
});

// Lança o bot
tgBot.launch()
  .then(() => {
    console.log('🚀 Bull Royale Bot iniciado e rodando 24/7!');
  })
  .catch((err) => {
    console.error('Erro ao iniciar o bot:', err);
  });

// Encerramento limpo
process.once('SIGINT', () => tgBot.stop('SIGINT'));
process.once('SIGTERM', () => tgBot.stop('SIGTERM'));
