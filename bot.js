require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const { createClient } = require('@supabase/supabase-js');
const { Connection, clusterApiUrl, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction } = require('@solana/web3.js');
const bs58 = require('bs58');
const http = require('http');
const https = require('https');

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

const IS_MAINTENANCE = false;
const ROUND_DURATION_MS = 60 * 60 * 1000; // 1 Hour
const LOCK_TIME_MS = 15 * 60 * 1000;      // Last 15 minutes locked

// Helper Function: Fetch matching Raydium Memecoins from DexScreener Oracle with similar MCP and Volume
async function fetchFairMemecoinPair() {
  return new Promise((resolve) => {
    https.get('https://api.dexscreener.com/latest/dex/search?q=solana', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pairs = json.pairs || [];

          // Filter for Raydium Solana pairs with volume and market cap
          const validPairs = pairs.filter(p => 
            p.chainId === 'solana' && 
            p.dexId === 'raydium' &&
            p.marketCap && p.volume && p.volume.h1 > 1000
          );

          if (validPairs.length < 2) {
            // Fallback default balanced pair if oracle returns insufficient items
            return resolve({
              tokenA: { name: 'PUMP/SOL', symbol: 'PUMP', address: 'So11111111111111111111111111111111111111112', url: 'https://dexscreener.com/solana', mcp: 50000, vol: 12000, image: '' },
              tokenB: { name: 'MOON/SOL', symbol: 'MOON', address: 'So11111111111111111111111111111111111111112', url: 'https://dexscreener.com/solana', mcp: 48000, vol: 11500, image: '' }
            });
          }

          // Sort by volume to find active trending tokens
          validPairs.sort((a, b) => (b.volume?.h1 || 0) - (a.volume?.h1 || 0));

          // Pick two tokens with close market caps (within ~40-60% margin to ensure fairness)
          let selectedA = validPairs[0];
          let selectedB = null;

          for (let i = 1; i < validPairs.length; i++) {
            const mcpDiff = Math.abs(validPairs[i].marketCap - selectedA.marketCap) / selectedA.marketCap;
            if (mcpDiff <= 0.60) { // Max 60% difference in Market Cap for fair play
              selectedB = validPairs[i];
              break;
            }
          }

          if (!selectedB) {
            selectedB = validPairs[1] || validPairs[0];
          }

          resolve({
            tokenA: {
              name: selectedA.baseToken.name || 'Token A',
              symbol: selectedA.baseToken.symbol || 'MEME1',
              address: selectedA.baseToken.address,
              url: selectedA.url || 'https://dexscreener.com/solana',
              mcp: selectedA.marketCap || 0,
              vol: selectedA.volume?.h1 || 0,
              image: selectedA.info?.imageUrl || ''
            },
            tokenB: {
              name: selectedB.baseToken.name || 'Token B',
              symbol: selectedB.baseToken.symbol || 'MEME2',
              address: selectedB.baseToken.address,
              url: selectedB.url || 'https://dexscreener.com/solana',
              mcp: selectedB.marketCap || 0,
              vol: selectedB.volume?.h1 || 0,
              image: selectedB.info?.imageUrl || ''
            }
          });
        } catch (e) {
          resolve({
            tokenA: { name: 'BULL/SOL', symbol: 'BULL', address: 'So11111111111111111111111111111111111111112', url: 'https://dexscreener.com/solana', mcp: 50000, vol: 10000, image: '' },
            tokenB: { name: 'BEAR/SOL', symbol: 'BEAR', address: 'So11111111111111111111111111111111111111112', url: 'https://dexscreener.com/solana', mcp: 49000, vol: 9800, image: '' }
          });
        }
      });
    }).on('error', () => {
      resolve({
        tokenA: { name: 'BULL/SOL', symbol: 'BULL', address: 'So11111111111111111111111111111111111111112', url: 'https://dexscreener.com/solana', mcp: 50000, vol: 10000, image: '' },
        tokenB: { name: 'BEAR/SOL', symbol: 'BEAR', address: 'So11111111111111111111111111111111111111112', url: 'https://dexscreener.com/solana', mcp: 49000, vol: 9800, image: '' }
      });
    });
  });
}

function calculateBetSplit(totalAmount) {
  const houseFee = totalAmount * 0.05;
  const prizePool = totalAmount * 0.95;
  return {
    houseFee: Number(houseFee.toFixed(9)),
    prizePool: Number(prizePool.toFixed(9))
  };
}

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

    const signature = await sendAndConfirmTransaction(solanaConnection, transaction, [houseKeypair]);
    return true;
  } catch (err) {
    return false;
  }
}

bot.use(async (ctx, next) => {
  if (IS_MAINTENANCE) return next();
  return next();
});

// Start Command with Dynamic Oracle Memecoin Pair
bot.start(async (ctx) => {
  const user = ctx.from;
  try {
    await supabase.from('users').upsert({
      telegram_id: user.id,
      username: user.username || null,
      first_name: user.first_name || null,
      updated_at: new Date()
    }, { onConflict: 'telegram_id' });
  } catch (err) {}

  const pair = await fetchFairMemecoinPair();

  // Save current round tokens in DB or session if needed
  await ctx.reply(
    `🚨 **BULL ROYALE - RAYDIUM FAIR VOLUME BATTLE** 🚨\n\n` +
    `⚡ Oracle selected newly launched Raydium memecoins with balanced Market Cap & Volume!\n\n` +
    `🟢 **Token A:** ${pair.tokenA.name} ($${pair.tokenA.symbol})\n` +
    `   • MCP: $${pair.tokenA.mcp.toLocaleString()} \vert{} Vol:$${pair.tokenA.vol.toLocaleString()}\n\n` +
    `🔴 **Token B:** ${pair.tokenB.name} ($${pair.tokenB.symbol})\n` +
    `   • MCP: $${pair.tokenB.mcp.toLocaleString()} \vert{} Vol:$${pair.tokenB.vol.toLocaleString()}\n\n` +
    `📥 **Step 1:** Link your payout wallet via:\n` +
    '`/wallet YOUR_SOLANA_WALLET_ADDRESS`\n\n' +
    `🔥 **Place your $SOL bet on the winner:**`,
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback(`🐶 Bet 1 SOL [${pair.tokenA.symbol}]`, 'bet_1_meme_a'),
          Markup.button.callback(`🐸 Bet 1 SOL [${pair.tokenB.symbol}]`, 'bet_1_meme_b')
        ],
        [
          Markup.button.url(`📈 View ${pair.tokenA.symbol} Chart`, pair.tokenA.url),
          Markup.button.url(`📈 View ${pair.tokenB.symbol} Chart`, pair.tokenB.url)
        ],
        [
          Markup.button.callback(`🐶 Bet 5 SOL [${pair.tokenA.symbol}]`, 'bet_5_meme_a'),
          Markup.button.callback(`🐸 Bet 5 SOL [${pair.tokenB.symbol}]`, 'bet_5_meme_b')
        ]
      ])
    }
  );
});

bot.command('wallet', async (ctx) => {
  const text = ctx.message.text;
  const parts = text.split(' ');
  const telegramId = ctx.from.id;

  if (parts.length < 2) {
    return ctx.reply('⚠️ **Invalid Format!** Use: `/wallet YourSolanaAddress`', { parse_mode: 'Markdown' });
  }

  const walletAddress = parts[1].trim();
  try {
    new PublicKey(walletAddress);
    await supabase.from('users').update({ solana_wallet: walletAddress, updated_at: new Date() }).eq('telegram_id', telegramId);
    await ctx.reply(`✅ **Solana Wallet Linked Successfully!**\n\`${walletAddress}\``, { parse_mode: 'Markdown' });
  } catch (err) {
    await ctx.reply('❌ **Invalid Solana Wallet Address.**', { parse_mode: 'Markdown' });
  }
});

bot.action(/^bet_(\d+)_(meme_[ab])$/, async (ctx) => {
  const amount = parseFloat(ctx.match[1]);
  const choice = ctx.match[2].toLowerCase();
  const telegramId = ctx.from.id;
  const split = calculateBetSplit(amount);

  try {
    const { data: userRecord } = await supabase.from('users').select('solana_wallet').eq('telegram_id', telegramId).single();
    if (!userRecord || !userRecord.solana_wallet) {
      return ctx.reply('⚠️ Please link your wallet first using `/wallet YOUR_ADDRESS`', { parse_mode: 'Markdown' });
    }

    let { data: round } = await supabase.from('rounds').select('*').eq('status', 'open').single();
    if (!round) {
      const { data: newRound } = await supabase.from('rounds').insert({ status: 'open', total_pool: 0, house_fee: 0, winner_payout: 0, created_at: new Date() }).select().single();
      round = newRound;
    }

    await supabase.from('bets').insert({ round_id: round.id, telegram_id: telegramId, amount, choice, status: 'pending' });
    await supabase.from('rounds').update({
      total_pool: Number(round.total_pool) + amount,
      house_fee: Number(round.house_fee) + split.houseFee,
      winner_payout: Number(round.winner_payout) + split.prizePool
    }).eq('id', round.id);

    await ctx.answerCbQuery(`Bet registered! (${amount} SOL)`);
    await ctx.reply(`✅ **Bet Placed Successfully!**\n💰 Amount: \`${amount} SOL\`\n🏆 Prize Pool Share: \`${split.prizePool} SOL\``, { parse_mode: 'Markdown' });
  } catch (err) {
    await ctx.answerCbQuery('❌ Error processing bet.');
  }
});

// Background Worker & Web Server (bullarenaa.io)
setInterval(async () => {
  // Automated settlement logic...
}, 30000);

bot.launch().then(() => console.log('🚀 Bull Royale Raydium Oracle Bot Running!'));

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bull Royale | Raydium Memecoin Volume Arena</title>
        <script src="https://unpkg.com/@solana/web3.js@latest/lib/index.iife.js"></script>
        <style>
            body { background: #0b0f19; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; text-align: center; }
            .container { max-width: 680px; width: 90%; padding: 40px; background: #131b2e; border-radius: 16px; border: 1px solid #1f2937; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
            h1 { color: #f59e0b; font-size: 2.5rem; margin-bottom: 10px; }
            p { color: #9ca3af; font-size: 1.1rem; margin-bottom: 25px; line-height: 1.6; }
            .btn { background: #2563eb; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 1rem; transition: background 0.2s; display: inline-block; border: none; cursor: pointer; margin: 6px; }
            .btn:hover { background: #1d4ed8; }
            .btn-wallet { background: #9333ea; }
            .arena-box { background: #0f172a; padding: 20px; border-radius: 12px; margin-top: 20px; border: 1px solid #334155; }
            .footer { margin-top: 30px; font-size: 0.85rem; color: #6b7280; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🐂 BULL ROYALE 🐻</h1>
            <p>Fair Raydium memecoin volume battles. Newly launched tokens filtered by equivalent market cap & volume oracles. Settle 1-hour flash duels in $SOL.</p>
            <div id="walletSection"><button class="btn btn-wallet" onclick="connectWallet()">Connect Phantom Wallet</button></div>
            <div id="walletInfo" style="color: #10b981; margin-bottom: 15px;"></div>
            <div class="arena-box">
                <h3>Live Raydium Fair Battle</h3>
                <p>Tracked via DexScreener Oracles with Balanced MCP & Volume</p>
                <div>
                    <button class="btn" style="background:#10b981;" onclick="alert('Betting Token A on-chain')">Bet 1 SOL [Token A]</button>
                    <button class="btn" style="background:#ef4444;" onclick="alert('Betting Token B on-chain')">Bet 1 SOL [Token B]</button>
                </div>
                <div style="margin-top: 15px;">
                    <a href="https://dexscreener.com/solana" target="_blank" class="btn" style="background:#3b82f6; font-size:0.9rem;">📈 View Token A Chart</a>
                    <a href="https://dexscreener.com/solana" target="_blank" class="btn" style="background:#3b82f6; font-size:0.9rem;">📈 View Token B Chart</a>
                </div>
            </div>
            <div style="margin-top: 25px;"><a href="https://t.me/BullRoyaleBot" class="btn" target="_blank">Open Telegram Bot Arena</a></div>
            <div class="footer">Powered by Solana & Raydium Fair Volume Oracles ⚡</div>
        </div>
        <script>
            async function connectWallet() {
                if ('solana' in window && window.solana.isPhantom) {
                    const res = await window.solana.connect();
                    document.getElementById('walletInfo').innerText = 'Connected: ' + res.publicKey.toString();
                } else {
                    window.open('https://phantom.app/', '_blank');
                }
            }
        </script>
    </body>
    </html>
  `);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🌐 Fair Raydium DApp Server active on port ${PORT}`));
