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

// Maintenance Mode Configuration (False = Open for testing/beta)
const IS_MAINTENANCE = false;

// Round Settings: 1 Hour duration, 15 minutes lock time before closing
const ROUND_DURATION_MS = 60 * 60 * 1000; // 1 Hour
const LOCK_TIME_MS = 15 * 60 * 1000;      // Last 15 minutes locked

// Helper Function: Automatic 5% House Fee & 95% Prize Split Calculator
function calculateBetSplit(totalAmount) {
  const houseFee = totalAmount * 0.05;      // 5% for the House/Vault
  const prizePool = totalAmount * 0.95;     // 95% for the Winners
  return {
    houseFee: Number(houseFee.toFixed(9)),
    prizePool: Number(prizePool.toFixed(9))
  };
}

// Maintenance middleware (Disabled for testing)
bot.use(async (ctx, next) => {
  if (IS_MAINTENANCE) {
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

// Start Command with User Registration & Welcome
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
    '🚨 **BULL ROYALE ARENA - LIVE ROUNDS** 🚨\n\n' +
    '⚡ Welcome! Automated rounds run every hour. Place your bets below:',
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback('🐂 Bet 1.0 SOL [BULL]', 'bet_1_bull'),
          Markup.button.callback('🐻 Bet 1.0 SOL [BEAR]', 'bet_1_bear')
        ],
        [
          Markup.button.callback('🐂 Bet 5.0 SOL [BULL]', 'bet_5_bull'),
          Markup.button.callback('🐻 Bet 5.0 SOL [BEAR]', 'bet_5_bear')
        ]
      ])
    }
  );
});

// Handler for 1-Click Inline Button Bets with Time Lock Validation
bot.action(/^bet_(\d+)_([a-z]+)$/, async (ctx) => {
  const amount = parseFloat(ctx.match[1]);
  const choice = ctx.match[2].toLowerCase();
  const telegramId = ctx.from.id;

  const split = calculateBetSplit(amount);

  try {
    let { data: round } = await supabase
      .from('rounds')
      .select('*')
      .eq('status', 'open')
      .single();

    if (!round) {
      const { data: newRound, error: roundErr } = await supabase
        .from('rounds')
        .insert({ 
          status: 'open', 
          total_pool: 0, 
          house_fee: 0, 
          winner_payout: 0,
          created_at: new Date()
        })
        .select()
        .single();
      if (roundErr) throw roundErr;
      round = newRound;
    }

    const createdAt = new Date(round.created_at).getTime();
    const now = Date.now();
    const elapsed = now - createdAt;
    const timeLeft = ROUND_DURATION_MS - elapsed;

    if (timeLeft <= LOCK_TIME_MS) {
      await ctx.answerCbQuery('⚠️ Betting is closed for this round (Last 15 minutes lock active).');
      return ctx.reply('⚠️ **Bets Closed:** This round is in its final 15-minute lock period. Please wait for the next round!', { parse_mode: 'Markdown' });
    }

    const { error: betErr } = await supabase.from('bets').insert({
      round_id: round.id,
      telegram_id: telegramId,
      amount: amount,
      choice: choice,
      status: 'pending'
    });

    if (betErr) throw betErr;

    const newTotalPool = Number(round.total_pool) + amount;
    const newHouseFee = Number(round.house_fee) + split.houseFee;
    const newWinnerPayout = Number(round.winner_payout) + split.prizePool;

    await supabase.from('rounds').update({
      total_pool: newTotalPool,
      house_fee: newHouseFee,
      winner_payout: newWinnerPayout
    }).eq('id', round.id);

    await ctx.answerCbQuery(`Bet placed successfully! (${amount} SOL on ${choice.toUpperCase()})`);

    await ctx.reply(
      `✅ **1-Click Bet Registered Successfully!**\n\n` +
      `💰 Amount: \`${amount} SOL\`\n` +
      `🎯 Choice: \`${choice.toUpperCase()}\`\n` +
      `🔒 House Vault (5%): \`${split.houseFee} SOL\`\n` +
      `🏆 Prize Pool (95%): \`${split.prizePool} SOL\`\n\n` +
      `_Status: Secured in Supabase._`,
      { parse_mode: 'Markdown' }
    );

  } catch (err) {
    console.error('1-Click bet processing error:', err);
    await ctx.answerCbQuery('❌ Error processing bet.');
    await ctx.reply('❌ Error processing your 1-click bet. Please try again.');
  }
});

// Background Worker: Automated Round Manager & Notifications (Checks every 30 seconds)
setInterval(async () => {
  try {
    let { data: round } = await supabase
      .from('rounds')
      .select('*')
      .eq('status', 'open')
      .single();

    if (!round) {
      const { data: newRound, error: newRoundErr } = await supabase.from('rounds').insert({ 
        status: 'open', 
        total_pool: 0, 
        house_fee: 0, 
        winner_payout: 0,
        notified_lock: false,
        created_at: new Date()
      }).select().single();
      
      if (!newRoundErr && newRound) {
        console.log('🔄 Automated Worker: New round initialized.');
      }
      return;
    }

    const createdAt = new Date(round.created_at).getTime();
    const now = Date.now();
    const elapsed = now - createdAt;
    const timeLeft = ROUND_DURATION_MS - elapsed;

    // Check if we reached the 15-minute mark and haven't notified yet
    if (timeLeft <= LOCK_TIME_MS && timeLeft > 0 && !round.notified_lock) {
      console.log(`⏰ Automated Worker: Round ${round.id} entered the 15-minute lock period.`);

      // Mark as notified in database so it only sends once per round
      await supabase.from('rounds').update({ notified_lock: true }).eq('id', round.id);

      // Fetch all registered users to broadcast the notification and next round link/buttons
      const { data: users } = await supabase.from('users').select('telegram_id');

      if (users && users.length > 0) {
        for (const user of users) {
          try {
            await bot.telegram.sendMessage(
              user.telegram_id,
              '🔒 **BULL ROYALE - BETS LOCKED!** 🔒\n\n' +
              '⚡ The current round has entered its final 15 minutes. Betting is now closed for this cycle.\n\n' +
              '🚀 *The next round is preparing automatically. Get ready to place your bets!*',
              {
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                  [
                    Markup.button.callback('🐂 Bet 1.0 SOL [BULL]', 'bet_1_bull'),
                    Markup.button.callback('🐻 Bet 1.0 SOL [BEAR]', 'bet_1_bear')
                  ]
                ])
              }
            );
          } catch (err) {
            // User might have blocked the bot, safe to ignore per user
          }
        }
      }
    }

    // Check if round time has expired (1 Hour)
    if (elapsed >= ROUND_DURATION_MS) {
      await supabase.from('rounds').update({ status: 'closed' }).eq('id', round.id);
      console.log(`🔒 Automated Worker: Round ${round.id} closed after 1 hour.`);

      // Automatically open the next round
      const { data: newRound, error: newRoundErr } = await supabase
        .from('rounds')
        .insert({ 
          status: 'open', 
          total_pool: 0, 
          house_fee: 0, 
          winner_payout: 0,
          notified_lock: false,
          created_at: new Date()
        })
        .select()
        .single();

      if (!newRoundErr && newRound) {
        console.log(`🚀 Automated Worker: New round ${newRound.id} opened automatically!`);
        
        // Notify users about the brand new round
        const { data: users } = await supabase.from('users').select('telegram_id');
        if (users && users.length > 0) {
          for (const user of users) {
            try {
              await bot.telegram.sendMessage(
                user.telegram_id,
                '🔥 **NEW BULL ROYALE ROUND IS LIVE!** 🔥\n\n' +
                '⚡ A fresh hourly cycle has just started. Place your bets instantly below:',
                {
                  parse_mode: 'Markdown',
                  ...Markup.inlineKeyboard([
                    [
                      Markup.button.callback('🐂 Bet 1.0 SOL [BULL]', 'bet_1_bull'),
                      Markup.button.callback('🐻 Bet 1.0 SOL [BEAR]', 'bet_1_bear')
                    ],
                    [
                      Markup.button.callback('🐂 Bet 5.0 SOL [BULL]', 'bet_5_bull'),
                      Markup.button.callback('🐻 Bet 5.0 SOL [BEAR]', 'bet_5_bear')
                    ]
                  ])
                }
              );
            } catch (err) {
              // Ignore blocked chats
            }
          }
        }
      }
    }
  } catch (err) {
    console.error('Error in automated round worker:', err);
  }
}, 30000); // Runs check every 30 seconds

bot.launch()
  .then(() => {
    console.log('🚀 Bull Royale Bot running with Automated Rounds & Notifications!');
  })
  .catch((err) => {
    console.error('Error starting the bot:', err);
  });

// HTTP server for Render health checks
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bull Royale Bot Engine with Automated Rounds & Notifications is running!\n');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🌐 HTTP Web Server active on port ${PORT}`);
});
