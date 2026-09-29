require('dotenv').config();
const { Telegraf } = require('telegraf');
const http = require('http');

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

// Mini servidor HTTP para satisfazer a exigência de porta do Web Service gratuito do Render
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bull Royale Bot is running!\n');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🌐 Servidor HTTP web ativo na porta ${PORT}`);
});

// Encerramento limpo
process.once('SIGINT', () => {
  server.close();
  tgBot.stop('SIGINT');
});
process.once('SIGTERM', () => {
  server.close();
  tgBot.stop('SIGTERM');
});
