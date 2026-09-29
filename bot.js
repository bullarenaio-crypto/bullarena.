require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const http = require('http');

const botToken = process.env.BOT_TOKEN;

if (!botToken) {
  console.error('ERRO: Falta o BOT_TOKEN!');
  process.exit(1);
}

const bot = new Telegraf(botToken);

// Modo manutenção ativo
const IS_MAINTENANCE = true;

bot.use(async (ctx, next) => {
  if (IS_MAINTENANCE) {
    return ctx.reply('🚧 **BULL ROYALE ARENA - EM MANUTENÇÃO** 🚧\n\n⚡ A arena está a ser preparada. Brevemente disponível!');
  }
  return next();
});

bot.start(async (ctx) => {
  await ctx.reply('🚨 **BULL ROYALE ARENA** 🚨');
});

bot.launch()
  .then(() => {
    console.log('🚀 Bull Royale Bot iniciado com sucesso e a 100%!');
  })
  .catch((err) => {
    console.error('Erro ao iniciar o bot:', err);
  });

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot is running!\n');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🌐 Servidor ativo na porta ${PORT}`);
});
