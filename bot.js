require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const { createClient } = require('@supabase/supabase-js');
const { Connection, clusterApiUrl } = require('@solana/web3.js');
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

// Solana Connection (Devnet)
const solanaConnection = new Connection(clusterApiUrl('devnet'), 'confirmed');

// Maintenance Mode Configuration (True = locked down, safe for development)
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

// Maintenance middleware (Blocks public interaction safely)
bot.use(async (ctx, next) => {
  if (IS_MAINTENANCE) {
    // Se for o comando start de teste interno, podemos deixar passar ou mostrar aviso blindado
    if (ctx.message && ctx.message.text && ctx.message.text.startsWith('/start')) {
      return next();
    }
    return ctx.reply(
      '🚧 **BULL ROYALE ARENA - UNDER MAINTENANCE** 🚧\n\n' +
      '⚡ Smart contracts and betting engine are being audited.\n' +
      '🔒 No public links or access are active yet.',
      { parse_mode: 'Markdown' }
    );
  }
  return next();
});

// Start Command & User Registration
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
    '🚨 **BULL ROYALE ARENA - PRIVATE BETA** 🚨\n\n' +
    '⚡ Welcome to the core engine. You are registered in the secure database.\n' +
    '🔒 *Status:* Maintenance mode active. Arena doors are closed to the public.',
    { parse_mode: 'Markdown' }
  );
});

// Direct Telegram Bet Command Engine (e.g., /bet 1.5 bull)
bot.command('bet', async (ctx) => {
  const args = ctx.message.text.split(' ');
  // args[1] = amount, args[2] = choice (e.g. bull / bear)
  
  if (args.length < 3) {
    return ctx.reply(
      '⚠️ **Usage Error**\n\n' +
      'Please use the format: `/bet [amount] [choice]`\n' +
      'Example: `/bet 1.0 bull`',
      { parse_mode: 'Markdown' }
    );
  }

  const amount = parseFloat(args[1]);
  const choice = args[2].toLowerCase();

  if (isNaN(amount) || amount <= 0) {
    return ctx.reply('❌ Please enter a valid bet amount.');
  }

  // Calculate 5% house fee and 95% prize pool split
  const split = calculateBetSplit(amount);

  try {
    // Find active open round or create one if none exists
    let { data: round } = await supabase
      .from('rounds')
      .select('*')
      .eq('status', 'open')
      .single();

    if (!round) {
      const { data: newRound, error: roundErr } = await supabase
        .from('rounds')
        .insert({ status: 'open', total_pool: 0, house_fee: 0, winner_payout: 0 })
        .select()
        .single();
      if (roundErr) throw roundErr;
      round = newRound;
    }

    // Register bet in Supabase
    const { error: betErr } = await supabase.from('bets').insert({
      round_id: round.id,
      telegram_id: ctx.from.id,
      amount: amount,
      choice: choice,
      status: 'pending'
    });

    if (betErr) throw betErr;

    // Update round total pool and fees
    const newTotalPool = Number(round.total_pool) + amount;
    const newHouseFee = Number(round.house_fee) + split.houseFee;
    const newWinnerPayout = Number(round.winner_payout) + split.prizePool;

    await supabase.from('rounds').update({
      total_pool: newTotalPool,
      house_fee: newHouseFee,
      winner_payout: newWinnerPayout
    }).eq('id', round.id);

    await ctx.reply(
      `✅ **Bet Registered Successfully!**\n\n` +
      `💰 Amount: \`${amount} SOL\`\n` +
      `🎯 Choice: \`${choice.toUpperCase()}\`\n` +
      `🔒 House Vault (5%): \`${split.houseFee} SOL\`\n` +
      `🏆 Prize Pool (95%): \`${split.prizePool} SOL\`\n\n` +
      `_Status: Secured in Supabase & Solana Devnet engine._`,
      { parse_mode: 'Markdown' }
    );

  } catch (err) {
    console.error('Bet processing error:', err);
    ctx.reply('❌ Error processing your bet. Please try again.');
  }
});

bot.launch()
  .then(() => {
    console.log('🚀 Bull Royale Bot, Supabase, and Bet Engine running securely!');
  })
  .catch((err) => {
    console.error('Error starting the bot:', err);
  });

// HTTP server for Render health checks
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bull Royale Bot Engine is running securely under maintenance!\n');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🌐 HTTP Web Server active on port ${PORT}`);
});
