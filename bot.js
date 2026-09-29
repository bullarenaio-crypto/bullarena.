require('dotenv').config();
const { Telegraf } = require('telegraf');
const { createClient } = require('@supabase/supabase-js');
const { Connection, PublicKey, clusterApiUrl } = require('@solana/web3.js');
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

// Solana Connection (Using Devnet for beta safety, ready to switch to Mainnet later)
const solanaConnection = new Connection(clusterApiUrl('devnet'), 'confirmed');

// Maintenance Mode Configuration
const IS_MAINTENANCE = true;

// Helper Function: Automatic 5% House Fee & 95% Prize Split Calculator
function calculateBetSplit(totalAmount) {
  const houseFee = totalAmount * 0.05;      // 5% for the House/Vault
  const prizePool = totalAmount * 0.95;     // 95% for the Winners
  return {
    houseFee: Number(houseFee.toFixed(9)),
    prizePool: Number(prizePool.toFixed(9))
  };
}

// Maintenance middleware
bot.use(async (ctx, next) => {
  if (IS_MAINTENANCE) {
    return ctx.reply(
      '🚧 **BULL ROYALE ARENA - UNDER MAINTENANCE** 🚧\n\n' +
      '⚡ Solana smart contracts and vault integration in progress.\n' +
      '🐂 The official launch will be announced soon!',
      { parse_mode: 'Markdown' }
    );
  }
  return next();
});

bot.start(async (ctx) => {
  const user = ctx.from;
  
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
    '⚡ Connected to Solana Devnet & Supabase. Preparing final beta features.',
    { parse_mode: 'Markdown' }
  );
});

bot.launch()
  .then(() => {
    console.log('🚀 Bull Royale Bot, Supabase, and Solana Engine running successfully!');
  })
  .catch((err) => {
    console.error('Error starting the bot:', err);
  });

// HTTP server for Render health checks
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bull Royale Bot Engine & Solana Module are running!\n');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🌐 HTTP Web Server active on port ${PORT}`);
});
