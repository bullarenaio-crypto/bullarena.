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
    console.log(`🔐 Solana House Wallet Loaded: ${houseKeypair.publicKey.toBase58()}`);
  } else {
    houseKeypair = Keypair.generate();
  }
} catch (err) {
  houseKeypair = Keypair.generate();
}

const IS_MAINTENANCE = false;

// Helper: Fetch Multi-Chain Memecoin Pairs from DexScreener
async function fetchMultiChainMemecoinPair(chain = 'solana', category = '1h') {
  return new Promise((resolve) => {
    let apiUrl = `https://api.dexscreener.com/latest/dex/search?q=${chain}`;
    
    https.get(apiUrl, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pairs = json.pairs || [];

          const validPairs = pairs.filter(p => {
            if (p.chainId !== chain) return false;
            const mcp = p.marketCap || p.fdv || 0;
            const vol = p.volume?.h1 || 0;
            
            if (category === '15m') return mcp > 1000 && mcp <= 5000000 && vol > 200;
            if (category === '1h') return mcp > 50000 && mcp <= 500000000 && vol > 2000;
            if (category === '24h') return mcp > 20000000 && vol > 10000;
            return true;
          });

          if (validPairs.length < 2) {
            const defaultSymbol = chain === 'solana' ? 'SOL' : 'ETH';
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

bot.use(async (ctx, next) => {
  if (IS_MAINTENANCE) return next();
  return next();
});

// Telegram Bot Start Command with Dual-Wallet Instructions & Multi-Chain Selector
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
    '⚡ Trade memecoin momentum across Solana, Base, and Arbitrum in 15m, 1h, or 24h arenas!\n\n' +
    '📥 **Step 1:** Link your payout wallets:\n' +
    '• Solana Wallet: `/wallet SOL_ADDRESS`\n' +
    '• EVM Wallet (Base/Arbitrum): `/evm_wallet 0x_ADDRESS`\n\n' +
    '🎯 **Select Arena Category:**',
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback('⚡ 15m Flash [Solana]', 'arena_15m_solana'),
          Markup.button.callback('⏳ 1h Mid-Cap [Solana]', 'arena_1h_solana')
        ],
        [
          Markup.button.callback('👑 24h Royale [Solana]', 'arena_24h_solana'),
          Markup.button.callback('🌐 Switch to Base / Arbitrum', 'switch_chain_menu')
        ]
      ])
    }
  );
});

// Switch Chain Menu
bot.action('switch_chain_menu', async (ctx) => {
  await ctx.editMessageText(
    '🌐 **Select Network & Arena:**\n\nChoose your preferred blockchain ecosystem:',
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback('🟣 Solana (1h)', 'arena_1h_solana'),
          Markup.button.callback('🔵 Base (1h)', 'arena_1h_base'),
          Markup.button.callback('🔷 Arbitrum (1h)', 'arena_1h_arbitrum')
        ],
        [
          Markup.button.callback('⚡ Base 15m Flash', 'arena_15m_base'),
          Markup.button.callback('👑 Arbitrum 24h Royale', 'arena_24h_arbitrum')
        ],
        [
          Markup.button.callback('⬅️ Back to Main', 'back_to_main')
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
          Markup.button.callback('⚡ 15m Flash [Solana]', 'arena_15m_solana'),
          Markup.button.callback('⏳ 1h Mid-Cap [Solana]', 'arena_1h_solana')
        ],
        [
          Markup.button.callback('👑 24h Royale [Solana]', 'arena_24h_solana'),
          Markup.button.callback('🌐 Switch to Base / Arbitrum', 'switch_chain_menu')
        ]
      ])
    }
  );
});

// Dynamic Arena Display Handler
bot.action(/^arena_(15m|1h|24h)_(solana|base|arbitrum)$/, async (ctx) => {
  const category = ctx.match[1];
  const chain = ctx.match[2];

  const pair = await fetchMultiChainMemecoinPair(chain, category);
  const nativeCurrency = chain === 'solana' ? 'SOL' : 'ETH';

  await ctx.editMessageText(
    `🔥 **${pair.chain} ARENA —${pair.category} DUEL** 🔥\n\n` +
    `🟢 **Token A:** ${pair.tokenA.name} ($${pair.tokenA.symbol})\n` +
    `   • MCP: $${Math.round(pair.tokenA.mcp).toLocaleString()} \vert{} Vol:$${Math.round(pair.tokenA.vol).toLocaleString()}\n\n` +
    `🔴 **Token B:** ${pair.tokenB.name} ($${pair.tokenB.symbol})\n` +
    `   • MCP: $${Math.round(pair.tokenB.mcp).toLocaleString()} \vert{} Vol:$${Math.round(pair.tokenB.vol).toLocaleString()}\n\n` +
    `Place your momentum bet in ${nativeCurrency}:`,
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback(`🐶 Bet 1 ${nativeCurrency} [${pair.tokenA.symbol}]`, `bet_${chain}_${category}_1_a`),
          Markup.button.callback(`🐸 Bet 1 ${nativeCurrency} [${pair.tokenB.symbol}]`, `bet_${chain}_${category}_1_b`)
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

// Wallet Registration Commands
bot.command('wallet', async (ctx) => {
  const text = ctx.message.text;
  const parts = text.split(' ');
  const telegramId = ctx.from.id;

  if (parts.length < 2) return ctx.reply('⚠️ Use: `/wallet YourSolanaAddress`', { parse_mode: 'Markdown' });
  const address = parts[1].trim();

  try {
    new PublicKey(address);
    await supabase.from('users').update({ solana_wallet: address, updated_at: new Date() }).eq('telegram_id', telegramId);
    await ctx.reply(`✅ **Solana Wallet Linked:**\n\`${address}\``, { parse_mode: 'Markdown' });
  } catch (err) {
    ctx.reply('❌ **Invalid Solana Address.**', { parse_mode: 'Markdown' });
  }
});

bot.command('evm_wallet', async (ctx) => {
  const text = ctx.message.text;
  const parts = text.split(' ');
  const telegramId = ctx.from.id;

  if (parts.length < 2 || !parts[1].startsWith('0x')) {
    return ctx.reply('⚠️ Use: `/evm_wallet 0xYourEVMAddress`', { parse_mode: 'Markdown' });
  }
  const address = parts[1].trim();

  try {
    await supabase.from('users').update({ evm_wallet: address, updated_at: new Date() }).eq('telegram_id', telegramId);
    await ctx.reply(`✅ **EVM Wallet (Base/Arbitrum) Linked:**\n\`${address}\``, { parse_mode: 'Markdown' });
  } catch (err) {
    ctx.reply('❌ **Invalid EVM Address.**', { parse_mode: 'Markdown' });
  }
});

bot.launch().then(() => console.log('🚀 Bull Royale Multi-Chain & Multi-Wallet Bot Active!'));

// Web DApp Server (`bullarenaa.io`) with Multi-Wallet Support (Phantom + MetaMask/EVM)
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bull Royale | Multi-Chain & Multi-Wallet Memecoin Arena</title>
        <script src="https://unpkg.com/@solana/web3.js@latest/lib/index.iife.js"></script>
        <style>
            body { background: #0b0f19; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; text-align: center; }
            .container { max-width: 720px; width: 90%; padding: 40px; background: #131b2e; border-radius: 16px; border: 1px solid #1f2937; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
            h1 { color: #f59e0b; font-size: 2.3rem; margin-bottom: 10px; }
            p { color: #9ca3af; font-size: 1.05rem; margin-bottom: 25px; line-height: 1.5; }
            .btn { background: #2563eb; color: #ffffff; padding: 12px 22px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; border: none; cursor: pointer; margin: 6px; font-size: 0.95rem; }
            .btn:hover { background: #1d4ed8; }
            .btn-sol { background: #9333ea; }
            .btn-evm { background: #3b82f6; }
            .arena-box { background: #0f172a; padding: 20px; border-radius: 12px; margin-top: 20px; border: 1px solid #334155; }
            .wallet-info { font-size: 0.85rem; color: #10b981; margin-top: 10px; word-break: break-all; }
            .footer { margin-top: 30px; font-size: 0.85rem; color: #6b7280; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🐂 BULL ROYALE 🐻</h1>
            <p>Multi-Chain Memecoin Momentum Arena. Settle 15m flash, 1h mid-cap, and 24h daily royales across Solana, Base, and Arbitrum.</p>
            
            <div style="margin-bottom: 20px;">
                <button class="btn btn-sol" onclick="connectSolanaWallet()">Connect Phantom (Solana)</button>
                <button class="btn btn-evm" onclick="connectEVMWallet()">Connect MetaMask (Base / Arbitrum)</button>
            </div>
            <div id="walletInfo" class="wallet-info">No wallet connected</div>

            <div class="arena-box">
                <h3>Live Multi-Chain Duel</h3>
                <p style="font-size: 0.9rem; color: #9ca3af;">Select network and place momentum wagers</p>
                <div>
                    <button class="btn" style="background:#10b981;" onclick="alert('Placing Bet on Token A')">Bet Token A</button>
                    <button class="btn" style="background:#ef4444;" onclick="alert('Placing Bet on Token B')">Bet Token B</button>
                </div>
            </div>

            <div style="margin-top: 25px;">
                <a href="https://t.me/BullRoyaleBot" class="btn" target="_blank">Open Telegram Bot Arena</a>
            </div>

            <div class="footer">Powered by Solana, Base, Arbitrum & DexScreener Oracles ⚡</div>
        </div>

        <script>
            async function connectSolanaWallet() {
                if ('solana' in window && window.solana.isPhantom) {
                    try {
                        const res = await window.solana.connect();
                        document.getElementById('walletInfo').innerText = 'Connected Solana: ' + res.publicKey.toString();
                    } catch (err) { alert('Solana connection rejected.'); }
                } else {
                    window.open('https://phantom.app/', '_blank');
                }
            }

            async function connectEVMWallet() {
                if (typeof window.ethereum !== 'undefined') {
                    try {
                        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                        document.getElementById('walletInfo').innerText = 'Connected EVM (Base/Arbitrum): ' + accounts[0];
                    } catch (err) { alert('EVM connection rejected.'); }
                } else {
                    window.open('https://metamask.io/', '_blank');
                }
            }
        </script>
    </body>
    </html>
  `);
});

server.listen(process.env.PORT || 3000, () => console.log('🌐 Multi-Chain Web DApp Server Active'));
