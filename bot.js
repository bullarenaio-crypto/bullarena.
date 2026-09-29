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

// Helper: Fetch Safe Trending Memecoins across chains (solana, base, arbitrum) from DexScreener
async function fetchMultiChainMemecoinPair(chain = 'solana', category = '1h') {
  return new Promise((resolve) => {
    // Search query depending on chain
    let apiUrl = `https://api.dexscreener.com/latest/dex/search?q=${chain}`;
    
    https.get(apiUrl, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pairs = json.pairs || [];

          // Filter safe pairs based on category requirements
          // 15m: very new tokens, low MCP. 1h: mid-cap up to $500M. 24h: established large cap memes.
          const validPairs = pairs.filter(p => {
            if (p.chainId !== chain) return false;
            const mcp = p.marketCap || p.fdv || 0;
            const vol = p.volume?.h1 || 0;
            
            if (category === '15m') return mcp > 5000 && mcp <= 5000000 && vol > 500; // Fresh launches
            if (category === '1h') return mcp > 500000 && mcp <= 500000000 && vol > 5000; // Up to $500M
            if (category === '24h') return mcp > 50000000 && vol > 50000; // Established/Consolidated
            return true;
          });

          if (validPairs.length < 2) {
            return resolve({
              chain: chain.toUpperCase(),
              category: category.toUpperCase(),
              tokenA: { name: 'ALPHA MEME', symbol: 'ALPH', url: 'https://dexscreener.com/' + chain, mcp: 100000, vol: 15000 },
              tokenB: { name: 'BETA MEME', symbol: 'BETA', url: 'https://dexscreener.com/' + chain, mcp: 95000, vol: 14200 }
            });
          }

          validPairs.sort((a, b) => (b.volume?.h1 || 0) - (a.volume?.h1 || 0));

          let tokenA = validPairs[0];
          let tokenB = validPairs[1] || validPairs[0];

          resolve({
            chain: chain.toUpperCase(),
            category: category.toUpperCase(),
            tokenA: {
              name: tokenA.baseToken.name || 'Token A',
              symbol: tokenA.baseToken.symbol || 'MEME1',
              url: tokenA.url || 'https://dexscreener.com/' + chain,
              mcp: tokenA.marketCap || tokenA.fdv || 0,
              vol: tokenA.volume?.h1 || 0
            },
            tokenB: {
              name: tokenB.baseToken.name || 'Token B',
              symbol: tokenB.baseToken.symbol || 'MEME2',
              url: tokenB.url || 'https://dexscreener.com/' + chain,
              mcp: tokenB.marketCap || tokenB.fdv || 0,
              vol: tokenB.volume?.h1 || 0
            }
          });
        } catch (e) {
          resolve({
            chain: chain.toUpperCase(),
            category: category.toUpperCase(),
            tokenA: { name: 'ALPHA MEME', symbol: 'ALPH', url: 'https://dexscreener.com/', mcp: 100000, vol: 15000 },
            tokenB: { name: 'BETA MEME', symbol: 'BETA', url: 'https://dexscreener.com/', mcp: 95000, vol: 14200 }
          });
        }
      });
    }).on('error', () => {
      resolve({
        chain: chain.toUpperCase(),
        category: category.toUpperCase(),
        tokenA: { name: 'ALPHA MEME', symbol: 'ALPH', url: 'https://dexscreener.com/', mcp: 100000, vol: 15000 },
        tokenB: { name: 'BETA MEME', symbol: 'BETA', url: 'https://dexscreener.com/', mcp: 95000, vol: 14200 }
      });
    });
  });
}

function calculateBetSplit(totalAmount) {
  const houseFee = totalAmount * 0.05;
  const prizePool = totalAmount * 0.95;
  return { houseFee: Number(houseFee.toFixed(9)), prizePool: Number(prizePool.toFixed(9)) };
}

bot.use(async (ctx, next) => {
  if (IS_MAINTENANCE) return next();
  return next();
});

// Start Command with Multi-Chain & Multi-Arena Selector
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

  await ctx.reply(
    '🌍 **BULL ROYALE - MULTI-CHAIN & MULTI-ARENA** 🌍\n\n' +
    '⚡ Choose your battle arena and trade momentum across top secure networks (Solana, Base, Arbitrum)!\n\n' +
    '📥 **Step 1:** Link your payout wallet via:\n' +
    '`/wallet YOUR_WALLET_ADDRESS`\n\n' +
    '🎯 **Select Arena Category:**',
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback('⚡ 15m Flash (Fresh Launches)', 'arena_15m_solana'),
          Markup.button.callback('⏳ 1h Mid-Cap (Up to $500M)', 'arena_1h_solana')
        ],
        [
          Markup.button.callback('👑 24h Daily Royale (Consolidated)', 'arena_24h_solana'),
          Markup.button.callback('🌐 Switch to Base / Arbitrum', 'switch_chain_menu')
        ]
      ])
    }
  );
});

// Handler for Arena selection
bot.action(/^arena_(15m|1h|24h)_(solana|base|arbitrum)$/, async (ctx) => {
  const category = ctx.match[1];
  const chain = ctx.match[2];

  const pair = await fetchMultiChainMemecoinPair(chain, category);

  await ctx.editMessageText(
    `🔥 **${pair.chain} ARENA —${pair.category} DUEL** 🔥\n\n` +
    `🟢 **Token A:** ${pair.tokenA.name} ($${pair.tokenA.symbol})\n` +
    `   • MCP: $${Math.round(pair.tokenA.mcp).toLocaleString()} \vert{} Vol:$${Math.round(pair.tokenA.vol).toLocaleString()}\n\n` +
    `🔴 **Token B:** ${pair.tokenB.name} ($${pair.tokenB.symbol})\n` +
    `   • MCP: $${Math.round(pair.tokenB.mcp).toLocaleString()} \vert{} Vol:$${Math.round(pair.tokenB.vol).toLocaleString()}\n\n` +
    `Place your momentum bet below:`,
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback(`🐶 Bet 1 [${pair.tokenA.symbol}]`, `bet_${chain}_${category}_1_a`),
          Markup.button.callback(`🐸 Bet 1 [${pair.tokenB.symbol}]`, `bet_${chain}_${category}_1_b`)
        ],
        [
          Markup.button.url(`📈 Chart A`, pair.tokenA.url),
          Markup.button.url(`📈 Chart B`, pair.tokenB.url)
        ],
        [
          Markup.button.callback('⬅️ Back to Arenas', 'back_to_main')
        ]
      ])
    }
  );
});

bot.action('switch_chain_menu', async (ctx) => {
  await ctx.editMessageText(
    '🌐 **Select Blockchain Network:**\n\nChoose where you want to trade volume momentum:',
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback('🟣 Solana Arena', 'arena_1h_solana'),
          Markup.button.callback('🔵 Base Arena', 'arena_1h_base'),
          Markup.button.callback('🔷 Arbitrum Arena', 'arena_1h_arbitrum')
        ],
        [
          Markup.button.callback('⬅️ Back', 'back_to_main')
        ]
      ])
    }
  );
});

bot.action('back_to_main', async (ctx) => {
  await ctx.editMessageText(
    '🌍 **BULL ROYALE - MULTI-CHAIN & MULTI-ARENA** 🌍\n\nSelect Arena Category:',
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback('⚡ 15m Flash (Fresh Launches)', 'arena_15m_solana'),
          Markup.button.callback('⏳ 1h Mid-Cap (Up to $500M)', 'arena_1h_solana')
        ],
        [
          Markup.button.callback('👑 24h Daily Royale (Consolidated)', 'arena_24h_solana'),
          Markup.button.callback('🌐 Switch to Base / Arbitrum', 'switch_chain_menu')
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
    return ctx.reply('⚠️ Use: `/wallet YourWalletAddress`', { parse_mode: 'Markdown' });
  }

  const walletAddress = parts[1].trim();
  try {
    await supabase.from('users').update({ solana_wallet: walletAddress, updated_at: new Date() }).eq('telegram_id', telegramId);
    await ctx.reply(`✅ **Wallet Linked Successfully!**\n\`${walletAddress}\``, { parse_mode: 'Markdown' });
  } catch (err) {
    await ctx.reply('❌ **Invalid Wallet Address.**', { parse_mode: 'Markdown' });
  }
});

bot.launch().then(() => console.log('🚀 Bull Royale Multi-Chain & Multi-Arena Bot Running!'));

// Web server for bullarenaa.io
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bull Royale | Multi-Chain Memecoin Arena</title>
        <style>
            body { background: #0b0f19; color: #ffffff; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; text-align: center; }
            .container { max-width: 700px; width: 90%; padding: 40px; background: #131b2e; border-radius: 16px; border: 1px solid #1f2937; }
            h1 { color: #f59e0b; font-size: 2.5rem; margin-bottom: 10px; }
            p { color: #9ca3af; font-size: 1.1rem; margin-bottom: 25px; }
            .btn { background: #2563eb; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; border: none; cursor: pointer; margin: 6px; }
            .arena-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🐂 BULL ROYALE 🐻</h1>
            <p>Multi-Chain & Multi-Arena: 15m Flash, 1h Mid-Cap, and 24h Daily Royales across Solana, Base, and Arbitrum.</p>
            <div class="arena-grid">
                <button class="btn" style="background:#10b981;">⚡ 15m Flash</button>
                <button class="btn" style="background:#3b82f6;">⏳ 1h Mid-Cap</button>
                <button class="btn" style="background:#9333ea;">👑 24h Royale</button>
            </div>
            <div style="margin-top: 30px;">
                <a href="https://t.me/BullRoyaleBot" class="btn" target="_blank">Open Telegram Bot Arena</a>
            </div>
        </div>
    </body>
    </html>
  `);
});

server.listen(process.env.PORT || 3000, () => console.log('🌐 Multi-Chain Web DApp Active'));
