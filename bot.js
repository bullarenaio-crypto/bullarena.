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

const solanaConnection = new Connection(clusterApiUrl('devnet'), 'confirmed');

let houseKeypair = null;
try {
  const secretKeyEnv = process.env.HOUSE_WALLET_PRIVATE_KEY;
  if (secretKeyEnv) {
    let secretKeyBytes = secretKeyEnv.trim().startsWith('[') 
      ? Uint8Array.from(JSON.parse(secretKeyEnv)) 
      : bs58.decode(secretKeyEnv.trim());
    houseKeypair = Keypair.fromSecretKey(secretKeyBytes);
    console.log(`🔐 House Wallet Loaded: ${houseKeypair.publicKey.toBase58()}`);
  } else {
    houseKeypair = Keypair.generate();
  }
} catch (err) {
  houseKeypair = Keypair.generate();
}

const IS_MAINTENANCE = false;

// 15-Minute Flash Round Configuration (3 minutes lock before settlement)
const ROUND_DURATION_MS = 15 * 60 * 1000; // 15 Minutes
const LOCK_TIME_MS = 3 * 60 * 1000;       // Last 3 minutes locked (anti-snipe)

// Helper: Fetch ultra-fresh memecoins for the 15-minute flash arena
async function fetch15MinFlashTokens() {
  return new Promise((resolve) => {
    https.get('https://api.dexscreener.com/latest/dex/search?q=solana', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pairs = json.pairs || [];

          // Filter for very fresh/new tokens with high initial volume velocity
          const freshPairs = pairs.filter(p => {
            const mcp = p.marketCap || p.fdv || 0;
            const vol = p.volume?.h1 || 0;
            return mcp > 2000 && mcp <= 3000000 && vol > 1000;
          });

          if (freshPairs.length < 2) {
            return resolve({
              tokenA: { name: 'FLASH A', symbol: 'FLA1', url: 'https://dexscreener.com/solana', mcp: 25000, vol: 4500 },
              tokenB: { name: 'FLASH B', symbol: 'FLB2', url: 'https://dexscreener.com/solana', mcp: 24000, vol: 4300 }
            });
          }

          freshPairs.sort((a, b) => (b.volume?.h1 || 0) - (a.volume?.h1 || 0));

          resolve({
            tokenA: {
              name: freshPairs[0].baseToken.name || 'Token A',
              symbol: freshPairs[0].baseToken.symbol || 'FLA',
              url: freshPairs[0].url || 'https://dexscreener.com/solana',
              mcp: freshPairs[0].marketCap || freshPairs[0].fdv || 0,
              vol: freshPairs[0].volume?.h1 || 0
            },
            tokenB: {
              name: freshPairs[1].baseToken.name || 'Token B',
              symbol: freshPairs[1].baseToken.symbol || 'FLB',
              url: freshPairs[1].url || 'https://dexscreener.com/solana',
              mcp: freshPairs[1].marketCap || freshPairs[1].fdv || 0,
              vol: freshPairs[1].volume?.h1 || 0
            }
          });
        } catch (e) {
          resolve({
            tokenA: { name: 'FLASH A', symbol: 'FLA1', url: 'https://dexscreener.com/solana', mcp: 25000, vol: 4500 },
            tokenB: { name: 'FLASH B', symbol: 'FLB2', url: 'https://dexscreener.com/solana', mcp: 24000, vol: 4300 }
          });
        }
      });
    }).on('error', () => {
      resolve({
        tokenA: { name: 'FLASH A', symbol: 'FLA1', url: 'https://dexscreener.com/solana', mcp: 25000, vol: 4500 },
        tokenB: { name: 'FLASH B', symbol: 'FLB2', url: 'https://dexscreener.com/solana', mcp: 24000, vol: 4300 }
      });
    });
  });
}

function calculateBetSplit(amount) {
  const houseFee = amount * 0.05;
  const prizePool = amount * 0.95;
  return { houseFee: Number(houseFee.toFixed(9)), prizePool: Number(prizePool.toFixed(9)) };
}

bot.use(async (ctx, next) => {
  if (IS_MAINTENANCE) return next();
  return next();
});

// Telegram Bot Start Command - Dedicated to 15-Minute Flash Arena
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

  const pair = await fetch15MinFlashTokens();

  await ctx.reply(
    `⚡ **BULL ROYALE — 15-MINUTE FLASH ARENA** ⚡\n\n` +
    `🔥 Pure adrenaline! Freshly launched tokens competing in a 15-minute volume momentum race.\n\n` +
    `🟢 **Token A:** ${pair.tokenA.name} ($${pair.tokenA.symbol})\n` +
    `   • MCP: $${Math.round(pair.tokenA.mcp).toLocaleString()} | Vol: $${Math.round(pair.tokenA.vol).toLocaleString()}\n\n` +
    `🔴 **Token B:** ${pair.tokenB.name} ($${pair.tokenB.symbol})\n` +
    `   • MCP: $${Math.round(pair.tokenB.mcp).toLocaleString()} | Vol: $${Math.round(pair.tokenB.vol).toLocaleString()}\n\n` +
    `📥 **Step 1:** Link your payout wallet:\n` +
    '`/wallet YOUR_SOLANA_WALLET`\n\n`' +
    `Place your flash bet below:`,
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback(`🐶 Bet 0.5 SOL [${pair.tokenA.symbol}]`, 'bet_flash_05_a'),
          Markup.button.callback(`🐸 Bet 0.5 SOL [${pair.tokenB.symbol}]`, 'bet_flash_05_b')
        ],
        [
          Markup.button.url(`📈 Chart ${pair.tokenA.symbol}`, pair.tokenA.url),
          Markup.button.url(`📈 Chart ${pair.tokenB.symbol}`, pair.tokenB.url)
        ],
        [
          Markup.button.callback(`🐶 Bet 2 SOL [${pair.tokenA.symbol}]`, 'bet_flash_2_a'),
          Markup.button.callback(`🐸 Bet 2 SOL [${pair.tokenB.symbol}]`, 'bet_flash_2_b')
        ]
      ])
    }
  );
});

bot.command('wallet', async (ctx) => {
  const text = ctx.message.text;
  const parts = text.split(' ');
  const telegramId = ctx.from.id;

  if (parts.length < 2) return ctx.reply('⚠️ Use: `/wallet YourSolanaAddress`', { parse_mode: 'Markdown' });
  const address = parts[1].trim();

  try {
    new PublicKey(address);
    await supabase.from('users').update({ solana_wallet: address, updated_at: new Date() }).eq('telegram_id', telegramId);
    await ctx.reply(`✅ **Payout Wallet Linked Successfully!**\n\`${address}\``, { parse_mode: 'Markdown' });
  } catch (err) {
    ctx.reply('❌ **Invalid Solana Wallet Address.**', { parse_mode: 'Markdown' });
  }
});

// Flash Bet Handler
bot.action(/^bet_flash_(05|2)_([ab])$/, async (ctx) => {
  const amount = ctx.match[1] === '05' ? 0.5 : 2;
  const choice = ctx.match[2] === 'a' ? 'token_a' : 'token_b';
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

    const elapsed = Date.now() - new Date(round.created_at).getTime();
    if ((ROUND_DURATION_MS - elapsed) <= LOCK_TIME_MS) {
      return ctx.answerCbQuery('⚠️ Betting locked for this 15m flash round (Anti-snipe active).');
    }

    await supabase.from('bets').insert({ round_id: round.id, telegram_id: telegramId, amount, choice, status: 'pending' });
    await supabase.from('rounds').update({
      total_pool: Number(round.total_pool) + amount,
      house_fee: Number(round.house_fee) + split.houseFee,
      winner_payout: Number(round.winner_payout) + split.prizePool
    }).eq('id', round.id);

    await ctx.answerCbQuery(`Flash bet registered! (${amount} SOL)`);
    await ctx.reply(`✅ **15-Min Flash Bet Placed!**\n💰 Amount: \`${amount} SOL\`\n🏆 Prize Pool Share: \`${split.prizePool} SOL\``, { parse_mode: 'Markdown' });
  } catch (err) {
    await ctx.answerCbQuery('❌ Error processing bet.');
  }
});

bot.launch().then(() => console.log('🚀 Bull Royale 15-Minute Flash Arena Bot Active!'));

// Web DApp Server (`bullarenaa.io`) focused on 15m Flash Arena
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bull Royale | 15-Minute Flash Memecoin Arena</title>
        <script src="https://unpkg.com/@solana/web3.js@latest/lib/index.iife.js"></script>
        <style>
            body { background: #0b0f19; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; text-align: center; }
            .container { max-width: 680px; width: 90%; padding: 40px; background: #131b2e; border-radius: 16px; border: 1px solid #1f2937; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
            h1 { color: #f59e0b; font-size: 2.3rem; margin-bottom: 10px; }
            p { color: #9ca3af; font-size: 1.05rem; margin-bottom: 25px; line-height: 1.5; }
            .btn { background: #2563eb; color: #ffffff; padding: 12px 22px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; border: none; cursor: pointer; margin: 6px; font-size: 0.95rem; }
            .btn-wallet { background: #9333ea; }
            .btn-flash-a { background: #10b981; }
            .btn-flash-b { background: #ef4444; }
            .arena-box { background: #0f172a; padding: 20px; border-radius: 12px; margin-top: 20px; border: 1px solid #334155; }
            .wallet-info { font-size: 0.85rem; color: #10b981; margin-top: 10px; word-break: break-all; }
            .footer { margin-top: 30px; font-size: 0.85rem; color: #6b7280; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>⚡ BULL ROYALE — 15M FLASH ⚡</h1>
            <p>High-frequency memecoin volume battles. Predict fresh launches velocity in 15-minute rounds.</p>
            
            <div style="margin-bottom: 20px;">
                <button class="btn btn-wallet" onclick="connectWallet()">Connect Phantom Wallet</button>
            </div>
            <div id="walletInfo" class="wallet-info">No wallet connected</div>

            <div class="arena-box">
                <h3>Live 15-Minute Flash Duel</h3>
                <p style="font-size: 0.9rem; color: #9ca3af;">Fresh Raydium Launches Momentum</p>
                <div>
                    <button class="btn btn-flash-a" onclick="alert('Placing Flash Bet on Token A')">Bet Token A</button>
                    <button class="btn btn-flash-b" onclick="alert('Placing Flash Bet on Token B')">Bet Token B</button>
                </div>
                <div style="margin-top: 15px;">
                    <a href="https://dexscreener.com/solana" target="_blank" class="btn" style="background:#3b82f6; font-size:0.85rem;">📈 Chart Token A</a>
                    <a href="https://dexscreener.com/solana" target="_blank" class="btn" style="background:#3b82f6; font-size:0.85rem;">📈 Chart Token B</a>
                </div>
            </div>

            <div style="margin-top: 25px;">
                <a href="https://t.me/BullRoyaleBot" class="btn" target="_blank">Open Telegram Flash Bot</a>
            </div>

            <div class="footer">Powered by Solana & DexScreener Oracles ⚡</div>
        </div>

        <script>
            async function connectWallet() {
                if ('solana' in window && window.solana.isPhantom) {
                    try {
                        const res = await window.solana.connect();
                        document.getElementById('walletInfo').innerText = 'Connected: ' + res.publicKey.toString();
                    } catch (err) { alert('Connection rejected.'); }
                } else {
                    window.open('https://phantom.app/', '_blank');
                }
            }
        </script>
    </body>
    </html>
  `);
});

server.listen(process.env.PORT || 3000, () => console.log('🌐 15-Minute Flash Arena Web Server Active'));
