require('dotenv').config();
const http = require('http');
const cron = require('node-cron');
const { Telegraf } = require('telegraf');
const { TwitterApi } = require('twitter-api-v2');

const PORT = process.env.PORT || 3000;

// ============================================================
// 1. CONFIGURAÇÃO DOS BOTS (TELEGRAM & X / TWITTER)
// ============================================================
const tgBot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const twitterClient = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function postAnnouncement() {
  const text = 
    `🚨 BULL ROYALE ARENA 🚨\n\n` +
    `⚡ The arena is open! Connect and battle.\n` +
    `🐂 Claim your rewards now.\n\n` +
    `👉 https://bullarenaa.io\n\n` +
    `#Solana #Crypto #Gaming #BullRoyale`;

  console.log(`[${new Date().toISOString()}] Disparo automatico iniciado...`);

  // Telegram
  try {
    await tgBot.telegram.sendMessage(process.env.TELEGRAM_CHAT_ID, text);
    console.log('✅ Telegram: Enviado com sucesso!');
  } catch (err) {
    console.error('❌ Erro Telegram:', err.message);
  }

  // X (Twitter)
  try {
    await twitterClient.v2.tweet(text);
    console.log('✅ X: Postado com sucesso!');
  } catch (err) {
    console.error('❌ Erro X:', err.data || err.message);
  }
}

// ============================================================
// 2. LISTA CURADA (TITÃS DE SOLANA - HORAS PARES)
// ============================================================
const CURATED_TOKENS = [
  { name: 'BONK', symbol: 'BONK', mint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', icon: 'https://cryptologos.cc/logos/bonk1-bonk-logo.png?v=035', sub: 'Solana Ecosystem Flagship' },
  { name: 'dogwifhat', symbol: 'WIF', mint: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm', icon: 'https://assets.coingecko.com/coins/images/33566/standard/dogwifhat.jpg', sub: 'Momentum Challenger' },
  { name: 'POPCAT', symbol: 'POPCAT', mint: '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr', icon: 'https://assets.coingecko.com/coins/images/33760/standard/popcat.png', sub: 'Viral Cat Sensation' },
  { name: 'cat in a dogs world', symbol: 'MEW', mint: 'MEW1gQWJ3nEXg2qgEriKu7FAFj79PHvQVREQUzScPP5', icon: 'https://assets.coingecko.com/coins/images/36440/standard/mew.png', sub: 'Canine Nemesis' },
  { name: 'BOOK OF MEME', symbol: 'BOME', mint: 'ukHH6c7mMyiWCf1b9pnWe25TSpkDDt3H5pQZgZ74J82', icon: 'https://assets.coingecko.com/coins/images/36071/standard/bome.png', sub: 'Immortalized Ledger' },
  { name: 'Jupiter', symbol: 'JUP', mint: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN', icon: 'https://assets.coingecko.com/coins/images/34188/standard/jup.png', sub: 'Solana Liquidity Core' },
  { name: 'Raydium', symbol: 'RAY', mint: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R', icon: 'https://cryptologos.cc/logos/raydium-ray-logo.png', sub: 'AMM Powerhouse' }
];

// Estado atual mantido em memória
let currentDuel = {
  roundId: 105,
  modeType: 'CURATED_TITANS',
  title: '⚔️ TITANS CLASH • DUEL #105',
  fighterA: CURATED_TOKENS[0],
  fighterB: CURATED_TOKENS[1],
  updatedAt: new Date().toISOString()
};

// ============================================================
// 3. RADAR DEXSCREENER (HORAS ÍMPARES)
// ============================================================
async function fetchTrendingRadarTokens() {
  try {
    const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));
    const res = await fetch('https://api.dexscreener.com/token-boosts/top/v1');
    const data = await res.json();

    if (!Array.isArray(data)) return null;

    const solTokens = data.filter(t => t.chainId === 'solana');
    if (solTokens.length < 2) return null;

    const tokenAAddr = solTokens[0].tokenAddress;
    const tokenBAddr = solTokens[1].tokenAddress;

    const detailsRes = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${tokenAAddr},${tokenBAddr}`);
    const details = await detailsRes.json();

    if (!details.pairs || details.pairs.length < 2) return null;

    const pairA = details.pairs.find(p => p.baseToken.address === tokenAAddr);
    const pairB = details.pairs.find(p => p.baseToken.address === tokenBAddr);

    if (!pairA || !pairB) return null;

    // Filtro de liquidez mínima ($50k)
    if ((pairA.liquidity?.usd || 0) < 50000 || (pairB.liquidity?.usd || 0) < 50000) {
      console.log('⚠️ Tokens do radar com baixa liquidez, usando lista de segurança.');
      return null;
    }

    return {
      fighterA: {
        name: pairA.baseToken.name,
        symbol: pairA.baseToken.symbol,
        mint: pairA.baseToken.address,
        icon: pairA.info?.imageUrl || 'https://cryptologos.cc/logos/solana-sol-logo.png',
        sub: `Radar Volume: $${((pairA.volume?.h24 || 0) / 1e6).toFixed(2)}M`
      },
      fighterB: {
        name: pairB.baseToken.name,
        symbol: pairB.baseToken.symbol,
        mint: pairB.baseToken.address,
        icon: pairB.info?.imageUrl || 'https://cryptologos.cc/logos/solana-sol-logo.png',
        sub: `Radar Volume: $${((pairB.volume?.h24 || 0) / 1e6).toFixed(2)}M`
      }
    };
  } catch (err) {
    console.error('Falha ao consultar DexScreener Radar:', err.message);
    return null;
  }
}

// ============================================================
// 4. ROTAÇÃO AUTOMÁTICA DE DUELOS
// ============================================================
async function rotateNextRound() {
  const currentHour = new Date().getUTCHours();
  currentDuel.roundId++;

  const isEvenHour = currentHour % 2 === 0;

  if (!isEvenHour) {
    console.log('🔍 Buscando duelo no TRENDING RADAR da DexScreener...');
    const radarPair = await fetchTrendingRadarTokens();
    if (radarPair) {
      currentDuel.modeType = 'TRENDING_RADAR';
      currentDuel.title = `🔥 TRENDING RADAR • DUEL #${currentDuel.roundId}`;
      currentDuel.fighterA = radarPair.fighterA;
      currentDuel.fighterB = radarPair.fighterB;
      currentDuel.updatedAt = new Date().toISOString();
      console.log(`✅ Novo Duelo Radar Ativado: ${radarPair.fighterA.symbol} vs ${radarPair.fighterB.symbol}`);
      return;
    }
  }

  // Fallback ou Horas Pares: Lista Curada
  console.log('⚔️ Sorteando duelo da LISTA CURADA (Titãs)...');
  const shuffled = [...CURATED_TOKENS].sort(() => 0.5 - Math.random());
  currentDuel.modeType = 'CURATED_TITANS';
  currentDuel.title = `⚔️ TITANS CLASH • DUEL #${currentDuel.roundId}`;
  currentDuel.fighterA = shuffled[0];
  currentDuel.fighterB = shuffled[1];
  currentDuel.updatedAt = new Date().toISOString();
  console.log(`✅ Novo Duelo Curado Ativado: ${shuffled[0].symbol} vs ${shuffled[1].symbol}`);
}

// Sorteia imediatamente ao inicializar o servidor
rotateNextRound();

// Roda no minuto 0 de toda hora (ex: 12:00, 13:00, 14:00)
cron.schedule('0 * * * *', () => {
  rotateNextRound();
});

// ============================================================
// 5. SERVIDOR HTTP (MANTÉM RENDER VIVO & FORNECE API)
// ============================================================
const server = http.createServer((req, res) => {
  // Configuração de cabeçalhos CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Endpoint da rodada para o site
  if (req.url === '/api/current-round') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(currentDuel));
    return;
  }

  // Rota de saúde
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', uptime: process.uptime() }));
    return;
  }

  // Resposta padrão
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bull Royale Bot is standing by (development phase).\n');
});

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log('⏸️ Bull Royale Bot pausado com sucesso. Nenhum disparo sera feito.');
});
