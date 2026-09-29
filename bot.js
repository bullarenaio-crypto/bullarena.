require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const { createClient } = require('@supabase/supabase-js');
const { Connection, clusterApiUrl, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction } = require('@solana/web3.js');
const bs58 = require('bs58');
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

// Load Secure House/Escrow Wallet
let houseKeypair = null;
try {
  const secretKeyEnv = process.env.HOUSE_WALLET_PRIVATE_KEY;
  if (secretKeyEnv) {
    let secretKeyBytes;
    if (secretKeyEnv.trim().startsWith('[')) {
      secretKeyBytes = Uint8Array.from(JSON.parse(secretKeyEnv));
    } else {
      secretKeyBytes = bs58.decode(secretKeyEnv.trim());
    }
    houseKeypair = Keypair.fromSecretKey(secretKeyBytes);
    console.log(`🔐 Secure House Wallet Loaded: ${houseKeypair.publicKey.toBase58()}`);
  } else {
    houseKeypair = Keypair.generate();
    console.log(`⚠️ Warning: Using generated temporary wallet: ${houseKeypair.publicKey.toBase58()}`);
  }
} catch (err) {
  console.error('Error loading House Wallet keypair:', err);
  houseKeypair = Keypair.generate();
}

// Global & Secure Production Mode (False = Public Live Arena)
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

// Helper Function: Secure Solana SOL Transfer
async function sendSolTransfer(recipientPublicKeyStr, amountSol) {
  try {
    const recipientPubkey = new PublicKey(recipientPublicKeyStr);
    const lamports = Math.floor(amountSol * LAMPORTS_PER_SOL);

    if (lamports <= 0) return false;

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: houseKeypair.publicKey,
        toPubkey: recipientPubkey,
        lamports: lamports,
      })
    );

    const signature = await sendAndConfirmTransaction(
      solanaConnection,
      transaction,
      [houseKeypair]
    );

    console.log(`✅ Solana Transfer Success! Tx Signature: ${signature}`);
    return true;
  } catch (err) {
    console.error('❌ Solana Transfer Failed:', err);
    return false;
  }
}

// Maintenance middleware
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

// Start Command with User Registration & Wallet Setup Prompt
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
    '🚨 **BULL ROYALE ARENA - LIVE PUBLIC LAUNCH** 🚨\n\n' +
    '⚡ Welcome to the ultimate Solana prediction battle!\n\n' +
    '📥 **Step 1:** Link your Solana payout wallet first using:\n' +
    '`/wallet SEU_ENDERECO_SOLANA`\n\n' +
    'Or jump straight into the active hourly rounds below:',
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

// Command to Register User's Payout Solana Wallet
bot.command('wallet', async (ctx) => {
  const text = ctx.message.text;
  const parts = text.split(' ');
  const telegramId = ctx.from.id;

  if (parts.length < 2) {
    return ctx.reply(
      '⚠️ **Invalid Format!**\n\n' +
      'Please provide your Solana public address. Example:\n' +
      '`/wallet SuaCarteiraSolanaAqui...`',
      { parse_mode: 'Markdown' }
    );
  }

  const walletAddress = parts[1].trim();

  try {
    new PublicKey(walletAddress);

    await supabase.from('users').update({
      solana_wallet: walletAddress,
      updated_at: new Date()
    }).eq('telegram_id', telegramId);

    await ctx.reply(
      `✅ **Solana Wallet Linked Successfully!**\n\n` +
      `🔑 Address: \`${walletAddress}\`\n\n` +
      `_You are now fully set up to receive automated payouts when you win rounds!_`,
      { parse_mode: 'Markdown' }
    );
  } catch (err) {
    await ctx.reply('❌ **Invalid Solana Wallet Address.** Please check and try again.', { parse_mode: 'Markdown' });
  }
});

// Admin Command: /stats
bot.command('stats', async (ctx) => {
  try {
    const { data: rounds, error: roundErr } = await supabase
      .from('rounds')
      .select('house_fee, total_pool, status');

    if (roundErr) throw roundErr;

    let totalHouseVault = 0;
    let activePool = 0;
    let closedRoundsCount = 0;

    rounds.forEach(r => {
      totalHouseVault += Number(r.house_fee || 0);
      if (r.status === 'open') activePool += Number(r.total_pool || 0);
      if (r.status === 'closed') closedRoundsCount++;
    });

    await ctx.reply(
      `📊 **BULL ROYALE - GLOBAL VAULT STATS** 📊\n\n` +
      `🔐 **House Wallet Address:** \`${houseKeypair.publicKey.toBase58()}\`\n` +
      `🔒 **House Vault (5% Revenue):** \`${totalHouseVault.toFixed(4)} SOL\`\n` +
      `💰 **Active Round Pool:** \`${activePool.toFixed(4)} SOL\`\n` +
      `🏁 **Completed Rounds:** \`${closedRoundsCount}\`\n\n` +
      `_Status: Public & Secured on Blockchain._`,
      { parse_mode: 'Markdown' }
    );
  } catch (err) {
    console.error('Error fetching admin stats:', err);
    ctx.reply('❌ Error fetching vault stats.');
  }
});

// Handler for 1-Click Inline Button Bets
bot.action(/^bet_(\d+)_([a-z]+)$/, async (ctx) => {
  const amount = parseFloat(ctx.match[1]);
  const choice = ctx.match[2].toLowerCase();
  const telegramId = ctx.from.id;

  const split = calculateBetSplit(amount);

  try {
    const { data: userRecord } = await supabase
      .from('users')
      .select('solana_wallet')
      .eq('telegram_id', telegramId)
      .single();

    if (!userRecord || !userRecord.solana_wallet) {
      await ctx.answerCbQuery('⚠️ Link your payout wallet first!');
      return ctx.reply(
        '⚠️ **Action Required:** Before placing bets, please link your Solana receiving wallet using the command:\n\n' +
        '`/wallet SEU_ENDERECO_SOLANA`',
        { parse_mode: 'Markdown' }
      );
    }

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
          notified_lock: false,
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
      `_Status: Secured in Supabase & Escrow Vault._`,
      { parse_mode: 'Markdown' }
    );

  } catch (err) {
    console.error('1-Click bet processing error:', err);
    await ctx.answerCbQuery('❌ Error processing bet.');
    await ctx.reply('❌ Error processing your 1-click bet. Please try again.');
  }
});

// Background Worker: Automated Round Manager with Atomic Lock Guard against any duplication
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

    // Strict 15-Minute Lock Notification (Runs ONLY ONCE per round)
    if (timeLeft <= LOCK_TIME_MS && timeLeft > 0 && !round.notified_lock) {
      await supabase.from('rounds').update({ notified_lock: true }).eq('id', round.id);
      
      console.log(`⏰ Automated Worker: Round ${round.id} entered lock period. Sending single notification.`);
      const { data: users } = await supabase.from('users').select('telegram_id');

      if (users && users.length > 0) {
        for (const user of users) {
          try {
            await bot.telegram.sendMessage(
              user.telegram_id,
              '🔒 **BULL ROYALE - BETS LOCKED!** 🔒\n\n' +
              '⚡ Final 15 minutes of the round. Betting is now closed for this cycle.',
              { parse_mode: 'Markdown' }
            );
          } catch (err) {}
        }
      }
    }

    // Round Expiration (1 Hour Reached -> Settlement & Solana Payouts)
    if (elapsed >= ROUND_DURATION_MS) {
      // ATOMIC LOCK: Tenta fechar imediatamente na base de dados. Se outra thread/worker tentar ao mesmo tempo, falha e evita duplicar.
      const { data: lockedRound, error: lockErr } = await supabase
        .from('rounds')
        .update({ status: 'settling' })
        .eq('id', round.id)
        .eq('status', 'open')
        .select()
        .single();

      if (lockErr || !lockedRound) {
        // A ronda já está a ser processada por outro ciclo, ignoramos para evitar duplicados.
        return;
      }

      const { data: bets } = await supabase
        .from('bets')
        .select('*')
        .eq('round_id', round.id);

      let bullTotal = 0;
      let bearTotal = 0;

      if (bets && bets.length > 0) {
        bets.forEach(b => {
          if (b.choice === 'bull') bullTotal += Number(b.amount);
          if (b.choice === 'bear') bearTotal += Number(b.amount);
        });
      }

      const winningChoice = bullTotal >= bearTotal ? 'bull' : 'bear';

      // Atualiza para 'closed' definitivo
      await supabase.from('rounds').update({ 
        status: 'closed',
        winner_choice: winningChoice 
      }).eq('id', round.id);

      console.log(`🏁 Blockchain Settlement: Round ${round.id} closed. Winner: ${winningChoice.toUpperCase()}`);

      if (bets && bets.length > 0) {
        const winningBets = bets.filter(b => b.choice === winningChoice);
        const winningPool = Number(round.winner_payout || 0);
        const totalWinningVolume = winningBets.reduce((sum, b) => sum + Number(b.amount), 0);

        const userWinnings = {};
        winningBets.forEach(wb => {
          if (!userWinnings[wb.telegram_id]) {
            userWinnings[wb.telegram_id] = { totalBet: 0, betIds: [] };
          }
          userWinnings[wb.telegram_id].totalBet += Number(wb.amount);
          userWinnings[wb.telegram_id].betIds.push(wb.id);
        });

        for (const [telegramIdStr, data] of Object.entries(userWinnings)) {
          const telegramId = Number(telegramIdStr);
          let userPayoutShare = 0;
          if (totalWinningVolume > 0) {
            userPayoutShare = (data.totalBet / totalWinningVolume) * winningPool;
          }

          const { data: userData } = await supabase
            .from('users')
            .select('solana_wallet')
            .eq('telegram_id', telegramId)
            .single();

          if (userData && userData.solana_wallet && userPayoutShare > 0) {
            await sendSolTransfer(userData.solana_wallet, userPayoutShare);
          }

          for (const bId of data.betIds) {
            await supabase.from('bets').update({
              status: 'won',
              payout: (userPayoutShare / data.betIds.length).toFixed(9)
            }).eq('id', bId);
          }

          try {
            await bot.telegram.sendMessage(
              telegramId,
              `🏆 **YOU WON THE BULL ROYALE ROUND!** 🏆\n\n` +
              `🎯 Winning Side: \`${winningChoice.toUpperCase()}\`\n` +
              `💰 Your Total Payout (95% Pool Share): \`${userPayoutShare.toFixed(4)} SOL\`\n\n` +
              `_Transferred securely from Escrow Vault to your registered wallet._`,
              { parse_mode: 'Markdown' }
            );
          } catch (err) {}
        }

        const losingBets = bets.filter(b => b.choice !== winningChoice);
        const losingUserIds = [...new Set(losingBets.map(lb => lb.telegram_id))];

        for (const lBet of losingBets) {
          await supabase.from('bets').update({ status: 'lost', payout: 0 }).eq('id', lBet.id);
        }

        for (const loseUserId of losingUserIds) {
          try {
            await bot.telegram.sendMessage(
              loseUserId,
              `❌ **Round Settled: You Lost**\n\n` +
              `🎯 Winning Side was: \`${winningChoice.toUpperCase()}\`\n` +
              `Better luck in the next hourly round!`,
              { parse_mode: 'Markdown' }
            );
          } catch (err) {}
        }
      }

      // Automatically Open Next Round
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
        
        const { data: users } = await supabase.from('users').select('telegram_id');
        if (users && users.length > 0) {
          for (const user of users) {
            try {
              await bot.telegram.sendMessage(
                user.telegram_id,
                `🔥 **NEW BULL ROYALE ROUND IS LIVE!** 🔥\n\n` +
                `⚡ Previous round winner: \`${winningChoice.toUpperCase()}\`\n` +
                `Place your bets for the new hourly cycle below:`,
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
            } catch (err) {}
          }
        }
      }
    }
  } catch (err) {
    console.error('Error in automated settlement worker:', err);
  }
}, 30000);

bot.launch()
  .then(() => {
    console.log('🚀 Bull Royale Global Public Bot running successfully!');
  })
  .catch((err) => {
    console.error('Error starting the bot:', err);
  });

// Professional Landing Page Web Server on Domain
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bull Royale | Solana Prediction Arena</title>
        <style>
            body { background: #0b0f19; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
            .container { max-width: 600px; padding: 40px; background: #131b2e; border-radius: 16px; border: 1px solid #1f2937; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
            h1 { color: #f59e0b; font-size: 2.5rem; margin-bottom: 10px; }
            p { color: #9ca3af; font-size: 1.1rem; margin-bottom: 30px; line-height: 1.6; }
            .btn { background: #2563eb; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 1.1rem; transition: background 0.2s; display: inline-block; }
            .btn:hover { background: #1d4ed8; }
            .footer { margin-top: 30px; font-size: 0.85rem; color: #6b7280; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🐂 BULL ROYALE 🐻</h1>
            <p>The premier automated, secure Solana-based prediction betting arena on Telegram. Hourly rounds, decentralized escrow payouts, and instant wins.</p>
            <a href="https://t.me/SEU_BOT_USERNAME" class="btn" target="_blank">Launch Telegram Bot</a>
            <div class="footer">Powered by Solana Blockchain & Cloudflare Security ⚡</div>
        </div>
    </body>
    </html>
  `);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🌐 Professional Web Server & Landing Page active on port ${PORT}`);
});
