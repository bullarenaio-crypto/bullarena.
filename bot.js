require('dotenv').config();
const http = require('http');
const cron = require('node-cron');
const { Telegraf } = require('telegraf');
const { TwitterApi } = require('twitter-api-v2');

const PORT = process.env.PORT || 3000;

// ============================================================
// 1. CATEGORIAS TEMÁTICAS (NUNCA MISTURA CATEGORIAS DIFERENTES)
// ============================================================
const TOKENS_BY_CATEGORY = {
  // CATEGORIA 1: MEME COINS (Meme vs Meme)
  MEMES: [
    { name: 'BONK', symbol: 'BONK', mint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', icon: 'https://cryptologos.cc/logos/bonk1-bonk-logo.png?v=035', sub: 'Solana Ecosystem Flagship' },
    { name: 'dogwifhat', symbol: 'WIF', mint: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm', icon: 'https://assets.coingecko.com/coins/images/33566/standard/dogwifhat.jpg', sub: 'Momentum Challenger' },
    { name: 'POPCAT', symbol: 'POPCAT', mint: '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr', icon: 'https://assets.coingecko.com/coins/images/33760/standard/popcat.png', sub: 'Viral Cat Sensation' },
    { name: 'cat in a dogs world', symbol: 'MEW', mint: 'MEW1gQWJ3nEXg2qgEriKu7FAFj79PHvQVREQUzScPP5', icon: 'https://assets.coingecko.com/coins/images/36440/standard/mew.png', sub: 'Canine Nemesis' },
    { name: 'BOOK OF MEME', symbol: 'BOME', mint: 'ukHH6c7mMyiWCf1b9pnWe25TSpkDDt3H5pQZgZ74J82', icon: 'https://assets.coingecko.com/coins/images/36071/standard/bome.png', sub: 'Immortalized Ledger' },
    { name: 'PONKE', symbol: 'PONKE', mint: '5z3eqYQo9rGHdrUWVoQQvu5MY852whPrT9HypTDpump', icon: 'https://assets.coingecko.com/coins/images/34009/standard/ponke.png', sub: 'Solana Degens Monkey' }
  ],

  // CATEGORIA 2: DEFI & DEX (DEX vs DEX)
  DEFI: [
    { name: 'Jupiter', symbol: 'JUP', mint: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN', icon: 'https://assets.coingecko.com/coins/images/34188/standard/jup.png', sub: 'Solana Liquidity Aggregator' },
    { name: 'Raydium', symbol: 'RAY', mint: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R', icon: 'https://cryptologos.cc/logos/raydium-ray-logo.png', sub: 'AMM & Yield Engine' }
  ],

  // CATEGORIA 3: ORÁCULOS & DATA FEEDS (Oráculo vs Oráculo)
  ORACLES: [
    { name: 'Pyth Network', symbol: 'PYTH', mint: 'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3', icon: 'https://assets.coingecko.com/coins/images/31924/standard/pyth.png', sub: 'Next-Gen Financial Oracle' },
    { name: 'Chainlink', symbol: 'LINK', mint: '2wp3DvCBduaUBCSGdNxHgphxcAYcpvPvTTBy7YJLgTpx', icon: 'https://cryptologos.cc/logos/chainlink-link-logo.png', sub: 'Decentralized Oracle Standard' }
  ]
};

// Estado atual mantido em memória
let currentDuel = {
  roundId: 105,
  modeType: 'MEME_WARFARE',
  title: '🎭 MEME WARFARE • DUEL #105',
  fighterA: TOKENS_BY_CATEGORY.MEMES[0],
  fighterB: TOKENS_BY_CATEGORY.MEMES[1],
  updatedAt: new Date().toISOString()
};

// ============================================================
// 2. RADAR DEXSCREENER (HORAS ÍMPARES)
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

    if ((pairA.liquidity?.usd || 0) < 50000 || (pairB.liquidity?.usd || 0) < 50000) {
      console.log('⚠️ Tokens do radar com baixa liquidez, usando categoria fechada.');
      return null;
    }

    return {
      fighterA: {
        name: pairA.baseToken.name,
        symbol: pairA.baseToken.symbol,
        mint: pairA.baseToken.address,
        icon: pairA.info?.imageUrl || 'https://cryptologos.cc/logos/solana-sol-logo.png',
        sub: `Radar Vol: $${((pairA.volume?.h24 || 0) / 1e6).toFixed(2)}M`
      },
      fighterB: {
        name: pairB.baseToken.name,
        symbol: pairB.baseToken.symbol,
        mint: pairB.baseToken.address,
        icon: pairB.info?.imageUrl || 'https://cryptologos.cc/logos/solana-sol-logo.png',
        sub: `Radar Vol: $${((pairB.volume?.h24 || 0) / 1e6).toFixed(2)}M`
      }
    };
  } catch (err) {
    console.error('Falha ao consultar DexScreener Radar:', err.message);
    return null;
  }
}

// ============================================================
// 3. ROTAÇÃO AUTOMÁTICA POR CATEGORIA PAREADA
// ============================================================
async function rotateNextRound() {
  const currentHour = new Date().getUTCHours();
  currentDuel.roundId++;

  const isEvenHour = currentHour % 2 === 0;

  // Horas Ímpares: Tenta Radar de Tendências
  if (!isEvenHour) {
    console.log('🔍 Buscando duelo no TRENDING RADAR da DexScreener...');
    const radarPair = await fetchTrendingRadarTokens();
    if (radarPair) {
      currentDuel.modeType = 'TRENDING_RADAR';
      currentDuel.title = `🔥 TRENDING RADAR • DUEL #${currentDuel.roundId}`;
      currentDuel.fighterA = radarPair.fighterA;
      currentDuel.fighterB = radarPair.fighterB;
      currentDuel.updatedAt = new Date().toISOString();
      console.log(`✅ Novo Duelo Radar: ${radarPair.fighterA.symbol} vs ${radarPair.fighterB.symbol}`);
      return;
    }
  }

  // Horas Pares: Sorteia uma categoria fechada (Meme, DeFi ou Oráculo)
  // Damos 70% de chance para Memes e 30% para DeFi/Oráculos
  const rand = Math.random();
  let categoryKey = 'MEMES';
  let categoryTitle = '🎭 MEME WARFARE';

  if (rand > 0.70 && rand <= 0.85) {
    categoryKey = 'DEFI';
    categoryTitle = '⚔️ DEFI TITANS';
  } else if (rand > 0.85) {
    categoryKey = 'ORACLES';
    categoryTitle = '🔮 ORACLE CLASH';
  }

  const tokenList = TOKENS_BY_CATEGORY[categoryKey];
  const shuffled = [...tokenList].sort(() => 0.5 - Math.random());

  currentDuel.modeType = categoryKey;
  currentDuel.title = `${categoryTitle} • DUEL #${currentDuel.roundId}`;
  currentDuel.fighterA = shuffled[0];
  currentDuel.fighterB = shuffled[1];
  currentDuel.updatedAt = new Date().toISOString();

  console.log(`✅ Categoria Selecionada [${categoryKey}]: ${shuffled[0].symbol} vs ${shuffled[1].symbol}`);
}

// Roda uma rodada imediatamente na inicialização
rotateNextRound();

// Agenda para o minuto 0 de cada hora
cron.schedule('0 * * * *', () => {
  rotateNextRound();
});

// ============================================================
// 4. SERVIDOR HTTP (API DO BULL ROYALE)
// ============================================================
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === '/api/current-round') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(currentDuel));
    return;
  }

  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', uptime: process.uptime() }));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bull Royale Bot is standing by (development phase).\n');
});

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log('⏸️ Bull Royale Bot pronto com confrontos categorizados.');
});
