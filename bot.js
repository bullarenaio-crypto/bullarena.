require('dotenv').config();
const http = require('http');
const cron = require('node-cron');
const { Telegraf } = require('telegraf');
const { TwitterApi } = require('twitter-api-v2');

const PORT = process.env.PORT || 3000;

// Helper dinâmico para fetch no CommonJS
const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

// Tolerância máxima de diferença de volume entre os lutadores (60%)
const MAX_VOLUME_GAP_RATIO = 0.60;

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

  try {
    await tgBot.telegram.sendMessage(process.env.TELEGRAM_CHAT_ID, text);
    console.log('✅ Telegram: Enviado com sucesso!');
  } catch (err) {
    console.error('❌ Erro Telegram:', err.message);
  }

  try {
    await twitterClient.v2.tweet(text);
    console.log('✅ X: Postado com sucesso!');
  } catch (err) {
    console.error('❌ Erro X:', err.data || err.message);
  }
}

// ============================================================
// 2. LISTAS TEMÁTICAS DE TOKENS
// ============================================================
const TOKENS_BY_CATEGORY = {
  MEMES: [
    { name: 'BONK', symbol: 'BONK', mint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', icon: 'https://cryptologos.cc/logos/bonk1-bonk-logo.png?v=035', sub: 'Solana Ecosystem Flagship' },
    { name: 'dogwifhat', symbol: 'WIF', mint: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm', icon: 'https://assets.coingecko.com/coins/images/33566/standard/dogwifhat.jpg', sub: 'Momentum Challenger' },
    { name: 'POPCAT', symbol: 'POPCAT', mint: '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr', icon: 'https://assets.coingecko.com/coins/images/33760/standard/popcat.png', sub: 'Viral Cat Sensation' },
    { name: 'cat in a dogs world', symbol: 'MEW', mint: 'MEW1gQWJ3nEXg2qgEriKu7FAFj79PHvQVREQUzScPP5', icon: 'https://assets.coingecko.com/coins/images/36440/standard/mew.png', sub: 'Canine Nemesis' },
    { name: 'BOOK OF MEME', symbol: 'BOME', mint: 'ukHH6c7mMyiWCf1b9pnWe25TSpkDDt3H5pQZgZ74J82', icon: 'https://assets.coingecko.com/coins/images/36071/standard/bome.png', sub: 'Immortalized Ledger' },
    { name: 'PONKE', symbol: 'PONKE', mint: '5z3eqYQo9rGHdrUWVoQQvu5MY852whPrT9HypTDpump', icon: 'https://assets.coingecko.com/coins/images/34009/standard/ponke.png', sub: 'Solana Degens Monkey' }
  ],
  DEFI: [
    { name: 'Jupiter', symbol: 'JUP', mint: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN', icon: 'https://assets.coingecko.com/coins/images/34188/standard/jup.png', sub: 'Solana Liquidity Aggregator' },
    { name: 'Raydium', symbol: 'RAY', mint: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R', icon: 'https://cryptologos.cc/logos/raydium-ray-logo.png', sub: 'AMM & Yield Engine' }
  ],
  ORACLES: [
    { name: 'Pyth Network', symbol: 'PYTH', mint: 'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3', icon: 'https://assets.coingecko.com/coins/images/31924/standard/pyth.png', sub: 'Next-Gen Financial Oracle' },
    { name: 'Chainlink', symbol: 'LINK', mint: '2wp3DvCBduaUBCSGdNxHgphxcAYcpvPvTTBy7YJLgTpx', icon: 'https://cryptologos.cc/logos/chainlink-link-logo.png', sub: 'Decentralized Oracle Standard' }
  ]
};

let currentDuel = {
  roundId: 105,
  modeType: 'MEME_WARFARE',
  title: '🎭 MEME WARFARE • DUEL #105',
  fighterA: TOKENS_BY_CATEGORY.MEMES[2], // POPCAT
  fighterB: TOKENS_BY_CATEGORY.MEMES[3], // MEW
  updatedAt: new Date().toISOString()
};

// Checa lote de volumes na DexScreener
async function fetchBatchVolumes(mintAddresses) {
  try {
    const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${mintAddresses.join(',')}`);
    const data = await res.json();
    const volMap = {};

    if (data.pairs) {
      data.pairs.forEach(p => {
        if (p.chainId === 'solana') {
          const addr = p.baseToken.address;
          volMap[addr] = (volMap[addr] || 0) + (p.volume?.h24 || 0);
        }
      });
    }
    return volMap;
  } catch (err) {
    console.warn('Erro ao consultar lote de volumes:', err.message);
    return {};
  }
}

// Verifica se a diferença de volume respeita a margem de 60%
function isBalancedVolume(volA, volB, maxGapRatio = MAX_VOLUME_GAP_RATIO) {
  if (volA <= 0 || volB <= 0) return true; // Se volume for zero ou indetectável, não barra
  const max = Math.max(volA, volB);
  const diff = Math.abs(volA - volB);
  return (diff / max) <= maxGapRatio;
}

// ============================================================
// 3. RADAR DEXSCREENER (HORAS ÍMPARES)
// ============================================================
async function fetchTrendingRadarTokens() {
  try {
    const res = await fetch('https://api.dexscreener.com/token-boosts/top/v1');
    const data = await res.json();
    if (!Array.isArray(data)) return null;

    const solTokens = data.filter(t => t.chainId === 'solana');
    if (solTokens.length < 2) return null;

    const topAddresses = solTokens.slice(0, 8).map(t => t.tokenAddress);
    const detailsRes = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${topAddresses.join(',')}`);
    const details = await detailsRes.json();

    if (!details.pairs || details.pairs.length < 2) return null;

    const validPairs = details.pairs
      .filter(p => p.chainId === 'solana' && (p.liquidity?.usd || 0) >= 50000 && (p.volume?.h24 || 0) > 0)
      .sort((a, b) => (b.volume?.h24 || 0) - (a.volume?.h24 || 0));

    if (validPairs.length < 2) return null;

    // Procura dois pares com diferença de volume <= 60%
    for (let i = 0; i < validPairs.length - 1; i++) {
      const pairA = validPairs[i];
      const pairB = validPairs[i + 1];
      const volA = pairA.volume?.h24 || 0;
      const volB = pairB.volume?.h24 || 0;

      if (isBalancedVolume(volA, volB, MAX_VOLUME_GAP_RATIO)) {
        return {
          fighterA: {
            name: pairA.baseToken.name,
            symbol: pairA.baseToken.symbol,
            mint: pairA.baseToken.address,
            icon: pairA.info?.imageUrl || 'https://cryptologos.cc/logos/solana-sol-logo.png',
            sub: `Radar Vol: $${(volA / 1e6).toFixed(2)}M`
          },
          fighterB: {
            name: pairB.baseToken.name,
            symbol: pairB.baseToken.symbol,
            mint: pairB.baseToken.address,
            icon: pairB.info?.imageUrl || 'https://cryptologos.cc/logos/solana-sol-logo.png',
            sub: `Radar Vol: $${(volB / 1e6).toFixed(2)}M`
          }
        };
      }
    }

    return null;
  } catch (err) {
    console.error('Falha no Trending Radar:', err.message);
    return null;
  }
}

// ============================================================
// 4. ROTAÇÃO COM FILTRO DE 60% DE DISPARIDADE MÁXIMA
// ============================================================
async function rotateNextRound() {
  const currentHour = new Date().getUTCHours();
  currentDuel.roundId++;

  const isEvenHour = currentHour % 2 === 0;

  // Horas Ímpares: Tenta Radar DexScreener
  if (!isEvenHour) {
    console.log('🔍 Buscando duelo no TRENDING RADAR da DexScreener (tolerância 60%)...');
    const radarPair = await fetchTrendingRadarTokens();
    if (radarPair) {
      currentDuel.modeType = 'TRENDING_RADAR';
      currentDuel.title = `🔥 TRENDING RADAR • DUEL #${currentDuel.roundId}`;
      currentDuel.fighterA = radarPair.fighterA;
      currentDuel.fighterB = radarPair.fighterB;
      currentDuel.updatedAt = new Date().toISOString();
      console.log(`✅ Duelo Radar Balanceado: ${radarPair.fighterA.symbol} vs ${radarPair.fighterB.symbol}`);
      return;
    }
  }

  // Horas Pares: Sorteia por categoria (70% Memes / 30% DeFi ou Oráculos)
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

  if (tokenList.length === 2) {
    currentDuel.modeType = categoryKey;
    currentDuel.title = `${categoryTitle} • DUEL #${currentDuel.roundId}`;
    currentDuel.fighterA = tokenList[0];
    currentDuel.fighterB = tokenList[1];
    currentDuel.updatedAt = new Date().toISOString();
    console.log(`✅ Duelo Direto [${categoryKey}]: ${tokenList[0].symbol} vs ${tokenList[1].symbol}`);
    return;
  }

  // Memecoins: Consulta volumes e encontra dois pares com até 60% de diferença
  console.log(`⚖️ Buscando duelo de Memes com diferença máxima de 60% no volume...`);
  const mints = tokenList.map(t => t.mint);
  const volMap = await fetchBatchVolumes(mints);

  const tokensWithVol = tokenList.map(t => ({
    ...t,
    volumeUSD: volMap[t.mint] || 0
  })).sort((a, b) => b.volumeUSD - a.volumeUSD);

  let selectedFighterA = null;
  let selectedFighterB = null;

  // Embaralha pares vizinhos para garantir variação
  const candidateIndices = [];
  for (let i = 0; i < tokensWithVol.length - 1; i++) {
    candidateIndices.push(i);
  }
  candidateIndices.sort(() => 0.5 - Math.random());

  for (const idx of candidateIndices) {
    const candA = tokensWithVol[idx];
    const candB = tokensWithVol[idx + 1];

    if (isBalancedVolume(candA.volumeUSD, candB.volumeUSD, MAX_VOLUME_GAP_RATIO)) {
      selectedFighterA = candA;
      selectedFighterB = candB;
      const diffPct = Math.round((Math.abs(candA.volumeUSD - candB.volumeUSD) / Math.max(candA.volumeUSD, candB.volumeUSD || 1)) * 100);
      console.log(`🎯 Par Encontrado! ${candA.symbol} ($${(candA.volumeUSD/1e6).toFixed(2)}M) vs ${candB.symbol} ($${(candB.volumeUSD/1e6).toFixed(2)}M) -> Diferença: ${diffPct}%`);
      break;
    }
  }

  // Fallback seguro caso os volumes não estejam disponíveis
  if (!selectedFighterA || !selectedFighterB) {
    const shuffled = [...tokenList].sort(() => 0.5 - Math.random());
    selectedFighterA = shuffled[0];
    selectedFighterB = shuffled[1];
  }

  currentDuel.modeType = categoryKey;
  currentDuel.title = `${categoryTitle} • DUEL #${currentDuel.roundId}`;
  currentDuel.fighterA = selectedFighterA;
  currentDuel.fighterB = selectedFighterB;
  currentDuel.updatedAt = new Date().toISOString();

  console.log(`✅ Novo Confronto Definido: ${selectedFighterA.symbol} vs ${selectedFighterB.symbol}`);
}

// Executa um sorteio na inicialização
rotateNextRound();

// Agenda para o minuto 0 de toda hora
cron.schedule('0 * * * *', () => {
  rotateNextRound();
});

// ============================================================
// 5. SERVIDOR HTTP (API)
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
  console.log(`⏸️ Bull Royale Bot ativo (Filtro de Paridade configurado em ${MAX_VOLUME_GAP_RATIO * 100}%).`);
});
