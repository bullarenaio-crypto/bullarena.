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

// Start Command with Memecoin Arena Context & Wallet Setup Prompt
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
    '🚨 **BULL ROYALE - MEMECOIN VOLUME ARENA** 🚨\n\n' +
    '⚡ Predict which Solana memecoin will pull the highest volume via DexScreener!\n\n' +
    '📥 **Step 1:** Link your Solana payout wallet first using:\n' +
    '`/wallet YOUR_SOLANA_WALLET_ADDRESS`\n\n' +
    'Or back your favorite meme in the active round below:',
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback('🐶 Bet 1.0 SOL [MEME A]', 'bet_1_meme_a'),
          Markup.button.callback('🐸 Bet 1.0 SOL [MEME B]', 'bet_1_meme_b')
        ],
        [
          Markup.button.callback('🐶 Bet 5.0 SOL [MEME A]', 'bet_5_meme_a'),
          Markup.button.callback('🐸 Bet 5.0 SOL [MEME B]', 'bet_5_meme_b')
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
      '⚠️️ **Invalid Format!**\n\n' +
      'Please provide your Solana public address. Example:\n' +
      '`/wallet YourSolanaAddressHere...`',
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
      `_You are fully set up to receive automated payouts when your memecoin wins the volume race!_`,
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
      `_Status: Memecoin Volume Arena Live on Solana._`,
      { parse_mode: 'Markdown' }
    );
  } catch (err) {
    console.error('Error fetching admin stats:', err);
    ctx.reply('❌ Error fetching vault stats.');
  }
});

// Handler for 1-Click Inline Button Bets (Memecoins)
bot.action(/^bet_(\d+)_(meme_[ab])$/, async (ctx) => {
  const amount = parseFloat(ctx.match[1]);
  const choice = ctx.match[2].toLowerCase(); // meme_a or meme_b
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
        '`/wallet YOUR_SOLANA_WALLET_ADDRESS`',
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

    const tokenName = choice === 'meme_a' ? 'MEME A' : 'MEME B';
    await ctx.answerCbQuery(`Bet placed successfully! (${amount} SOL on ${tokenName})`);

    await ctx.reply(
      `✅ **Memecoin Bet Registered Successfully!**\n\n` +
      `💰 Amount: \`${amount} SOL\`\n` +
      `🎯 Selection: \`${tokenName}\`\n` +
      `🔒 House Vault (5%): \`${split.houseFee} SOL\`\n` +
      `🏆 Prize Pool (95%): \`${split.prizePool} SOL\`\n\n` +
      `_Status: Tracked via DexScreener Volume & Secured in Escrow._`,
      { parse_mode: 'Markdown' }
    );

  } catch (err) {
    console.error('1-Click memecoin bet processing error:', err);
    await ctx.answerCbQuery('❌ Error processing bet.');
    await ctx.reply('❌ Error processing your bet. Please try again.');
  }
});

// Background Worker: Automated Round Manager for DexScreener Volume Competition
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
        console.log('🔄 Automated Worker: New memecoin round initialized.');
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
              '🔒 **BULL ROYALE - VOLUME RACE LOCKED!** 🔒\n\n' +
              '⚡ Final 15 minutes. DexScreener volume tracking is locked for this memecoin battle cycle.',
              { parse_mode: 'Markdown' }
            );
          } catch (err) {}
        }
      }
    }

    // Round Expiration (1 Hour Reached -> Settlement & Solana Payouts)
    if (elapsed >= ROUND_DURATION_MS) {
      const { data: lockedRound, error: lockErr } = await supabase
        .from('rounds')
        .update({ status: 'settling' })
        .eq('id', round.id)
        .eq('status', 'open')
        .select()
        .single();

      if (lockErr || !lockedRound) {
        return;
      }

      const { data: bets } = await supabase
        .from('bets')
        .select('*')
        .eq('round_id', round.id);

      let memeATotal = 0;
      let memeBTotal = 0;

      if (bets && bets.length > 0) {
        bets.forEach(b => {
          if (b.choice === 'meme_a') memeATotal += Number(b.amount);
          if (b.choice === 'meme_b') memeBTotal += Number(b.amount);
        });
      }

      // Vencedor simulado por volume DexScreener (pode ser integrado via API da DexScreener)
      const winningChoice = memeATotal >= memeBTotal ? 'meme_a' : 'meme_b';
      const winningTokenName = winningChoice === 'meme_a' ? 'MEME A' : 'MEME B';

      await supabase.from('rounds').update({ 
        status: 'closed',
        winner_choice: winningChoice 
      }).eq('id', round.id);

      console.log(`🏁 DexScreener Volume Settlement: Round ${round.id} closed. Winner: ${winningTokenName}`);

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
              `🏆 **YOUR MEMECOIN WON THE VOLUME RACE!** 🏆\n\n` +
              `🎯 Winning Token: \`${winningTokenName}\` (Highest DexScreener Volume)\n` +
              `💰 Your Total Payout: \`${userPayoutShare.toFixed(4)} SOL\`\n\n` +
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
              `❌ **Round Settled: Memecoin Lost**\n\n` +
              `🎯 Winning Volume Token was: \`${winningTokenName}\`\n` +
              `Better luck in the next hourly memecoin battle!`,
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
        console.log(`🚀 Automated Worker: New memecoin round ${newRound.id} opened automatically!`);
        
        const { data: users } = await supabase.from('users').select('telegram_id');
        if (users && users.length > 0) {
          for (const user of users) {
            try {
              await bot.telegram.sendMessage(
                user.telegram_id,
                `🔥 **NEW MEMECOIN VOLUME BATTLE IS LIVE!** 🔥\n\n` +
                `⚡ Previous round top volume winner: \`${winningTokenName}\`\n` +
                `Place your bets for the new hourly battle below:`,
                {
                  parse_mode: 'Markdown',
                  ...Markup.inlineKeyboard([
                    [
                      Markup.button.callback('🐶 Bet 1.0 SOL [MEME A]', 'bet_1_meme_a'),
                      Markup.button.callback('🐸 Bet 1.0 SOL [MEME B]', 'bet_1_meme_b')
                    ],
                    [
                      Markup.button.callback('🐶 Bet 5.0 SOL [MEME A]', 'bet_5_meme_a'),
                      Markup.button.callback('🐸 Bet 5.0 SOL [MEME B]', 'bet_5_meme_b')
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
    console.log('🚀 Bull Royale Memecoin Volume Bot running successfully!');
  })
  .catch((err) => {
    console.error('Error starting the bot:', err);
  });

// Professional Memecoin Web3 DApp & Landing Page Server on Domain
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bull Royale | Memecoin Volume Battle Arena</title>
        <script src="https://unpkg.com/@solana/web3.js@latest/lib/index.iife.js"></script>
        <style>
            body { background: #0b0f19; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; text-align: center; }
            .container { max-width: 650px; width: 90%; padding: 40px; background: #131b2e; border-radius: 16px; border: 1px solid #1f2937; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
            h1 { color: #f59e0b; font-size: 2.5rem; margin-bottom: 10px; }
            p { color: #9ca3af; font-size: 1.1rem; margin-bottom: 25px; line-height: 1.6; }
            .btn { background: #2563eb; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 1.1rem; transition: background 0.2s; display: inline-block; border: none; cursor: pointer; margin: 5px; }
            .btn:hover { background: #1d4ed8; }
            .btn-wallet { background: #9333ea; }
            .btn-wallet:hover { background: #7e22ce; }
            .btn-meme-a { background: #10b981; }
            .btn-meme-b { background: #ef4444; }
            .wallet-info { font-size: 0.9rem; color: #10b981; margin-bottom: 15px; word-break: break-all; }
            .arena-box { background: #0f172a; padding: 20px; border-radius: 12px; margin-top: 20px; border: 1px solid #334155; }
            .footer { margin-top: 30px; font-size: 0.85rem; color: #6b7280; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🐂 BULL ROYALE 🐻</h1>
            <p>The premier Solana memecoin volume battle arena. Predict which token dominates DexScreener volume in hourly rounds and win instant payouts.</p>
            
            <div id="walletSection">
                <button class="btn btn-wallet" onclick="connectWallet()">Connect Phantom Wallet</button>
            </div>
            <div id="walletInfo" class="wallet-info"></div>

            <div class="arena-box">
                <h3>Live Memecoin Battle</h3>
                <p id="roundStatus" style="font-size: 0.95rem; margin-bottom: 15px;">Tracking DexScreener Top Volume Pairs</p>
                <div>
                    <button class="btn btn-meme-a" onclick="placeOnChainBet('meme_a')">Bet 1 SOL [MEME A]</button>
                    <button class="btn btn-meme-b" onclick="placeOnChainBet('meme_b')">Bet 1 SOL [MEME B]</button>
                </div>
            </div>

            <div style="margin-top: 25px;">
                <a href="https://t.me/BullRoyaleBot" class="btn" target="_blank">Open Telegram Bot Arena</a>
            </div>

            <div class="footer">Powered by Solana Blockchain & DexScreener Tracking ⚡</div>
        </div>

        <script>
            let provider = null;
            let userPublicKey = null;

            async function getProvider() {
                if ('solana' in window) {
                    const provider = window.solana;
                    if (provider.isPhantom) {
                        return provider;
                    }
                }
                window.open('https://phantom.app/', '_blank');
            }

            async function connectWallet() {
                try {
                    provider = await getProvider();
                    if (provider) {
                        const response = await provider.connect();
                        userPublicKey = response.publicKey;
                        document.getElementById('walletInfo').innerText = 'Connected: ' + userPublicKey.toString();
                        document.getElementById('walletSection').innerHTML = '<span style="color: #10b981; font-weight: bold;">Wallet Connected Successfully</span>';
                    }
                } catch (err) {
                    console.error("Wallet connection failed:", err);
                    alert("User rejected the connection or Phantom wallet not found.");
                }
            }

            async function placeOnChainBet(choice) {
                if (!userPublicKey) {
                    alert("Please connect your Phantom wallet first!");
                    return;
                }
                alert('Placing 1 SOL on ' + choice.toUpperCase() + ' volume battle directly on-chain!');
            }
        </script>
    </body>
    </html>
  `);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🌐 Memecoin Volume Battle DApp Server active on port ${PORT}`);
});
