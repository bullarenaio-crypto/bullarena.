require('dotenv').config();
const { Telegraf } = require('telegraf');
const { createClient } = require('@supabase/supabase-js');
const http = require('http');

const botToken = process.env.BOT_TOKEN;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!botToken || !supabaseUrl || !supabaseKey) {
  console.error('ERROR: Missing environment variables (BOT_TOKEN, SUPABASE_URL, or SUPABASE_KEY)!');
  process.exit(1);
}

const bot = new Telegraf(botToken);
const supabase = createClient(supabaseUrl, supabaseKey);

// Maintenance Mode Configuration
const IS_MAINTENANCE = true;

// Maintenance middleware
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
  const user = ctx.from;
  
  // Save or update user in Supabase automatically
  try {
    await supabase.from('users').upsert({
      telegram_id: user.id,
      username: user.username || null,
      first_name: user.first_name || null,
      updated_at: new Date()
    }, { onConflict: 'telegram_id' });
  } catch (err) {
    console.error('Error saving user to Supabase:', err);
  }

  await ctx.reply(
    '🚨 **BULL ROYALE ARENA** 🚨\n\n' +
    '⚡ Arena is currently under maintenance mode.',
    { parse_mode: 'Markdown' }
  );
});

bot.launch()
  .then(() => {
    console.log('🚀 Bull Royale Bot successfully started with Supabase connected!');
  })
  .catch((err) => {
    console.error('Error starting the bot:', err);
  });

// HTTP server for Render health checks
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bull Royale Bot Engine is running!\n');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🌐 HTTP Web Server active on port ${PORT}`);
});
