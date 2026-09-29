require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const http = require('http');

const botToken = process.env.BOT_TOKEN;

if (!botToken) {
  console.error('ERROR: Missing BOT_TOKEN environment variable!');
  process.exit(1);
}

const bot = new Telegraf(botToken);

// Maintenance Mode Configuration (True = closed to public, accessible for testing)
const IS_MAINTENANCE = true;

// Maintenance middleware (All responses in English)
bot.use(async (ctx, next) => {
  if (IS_MAINTENANCE) {
    return ctx.reply(
      '🚧 **BULL ROYALE ARENA - UNDER MAINTENANCE** 🚧\n\n' +
      '⚡ Our betting arena is currently being prepared.\n' +
      '🐂 The official launch will be announced soon!',
      { parse_mode: 'Markdown' }
    );
  }
  return next();
});

bot.start(async (ctx) => {
  await ctx.reply(
    '🚨 **BULL ROYALE ARENA** 🚨\n\n' +
    '⚡ Arena is currently under maintenance mode.',
    { parse_mode: 'Markdown' }
  );
});

bot.launch()
  .then(() => {
    console.log('🚀 Bull Royale Bot successfully started and running at 100%!');
  })
  .catch((err) => {
    console.error('Error starting the bot:', err);
  });

// HTTP server for Render health checks (prevents port binding timeouts)
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bull Royale Bot Engine is running!\n');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🌐 HTTP Web Server active on port ${PORT}`);
});
