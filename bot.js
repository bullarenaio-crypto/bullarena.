require('dotenv').config();
const http = require('http');
const cron = require('node-cron');
const { Telegraf } = require('telegraf');
const { TwitterApi } = require('twitter-api-v2');

const PORT = process.env.PORT || 3000;

// Helper dinâmico para fetch no CommonJS
const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

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
// 2. CATEGORIAS DE TOKENS
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
// 3. CONSULTA DE VOLUME PARA CHECAGEM DE PARIDADE
// ============================================================
async function fetchTokenVolumeUSD(mintAddress) {
  try {
    const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${mintAddress}`);
    const data = await res.json();
    if (!data.pairs || data.pairs.length === 0) return 0;
    const solPairs = data.pairs.filter(p => p.chainId === 'solana');
    if (solPairs.length === 0) return data.pairs[0].volume?.h24 || 0;
    return solPairs.reduce((acc, p) => acc + (p.volume?.h24 || 0), 0);
  } catch (err) {
    console.warn(`Erro ao consultar volume de ${mintAddress}:`, err.message);
    return 0;
  }
}

// Verifica se a diferença percentual entre os volumes é menor ou igual a 30%
function isBalancedVolume(volA, volB, maxGapRatio = 0.30) {
  if (volA <= 0 || volB <= 0) return false;
  const max = Math.max(volA, volB);
  const diff = Math.abs(volA - volB);
  return (diff / max) <= maxGapRatio;
}

// ============================================================
// 4. RADAR DEXSCREENER (COM FILTRO DE PARIDADE)
// ============================================================
async function fetchTrendingRadarTokens() {
  try {
    const res = await fetch('https://api.dexscreener.com/token-boosts/top/v1');
    const data = await res.json();

    if (!Array.isArray(data)) return null;

    const solTokens = data.filter(t => t.chainId === 'solana');
    if (solTokens.length < 2) return null;

    for (let i = 0; i < Math.min(solTokens.length - 1, 5); i++) {
      const tokenAAddr = solTokens[i].tokenAddress;
      const tokenBAddr = solTokens[i + 1].tokenAddress;

      const detailsRes = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${tokenAAddr},${tokenBAddr}`);
      const details = await detailsRes.json();

      if (!details.pairs || details.pairs.length < 2) continue;

      const pairA = details.pairs.find(p => p.baseToken.address === tokenAAddr);
      const pairB = details.pairs.find(p => p.baseToken.address === tokenBAddr);

      if (!pairA || !pairB) continue;

      const volA = pairA.volume?.h24 || 0;
      const volB = pairB.volume?.h24 || 0;

      // Exige liquidez mínima e gap de no máximo 30% de volume
      if ((pairA.liquidity?.usd || 0) >= 50000 && (pairB.liquidity?.usd || 0) >= 50000 && isBalancedVolume(volA, volB, 0.30)) {
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

    console.log('⚠️ Nenhum par no Radar com paridade de volume <= 30%. Usando fallback da lista.');
    return null;
  } catch (err) {
    console.error('Falha ao consultar DexScreener Radar:', err.message);
    return null;
  }
}

// ============================================================
// 5. ROTAÇÃO COM FILTRO ELETIVO DE PARIDADE (MAX 30% DIFERENÇA)
// ============================================================
async function rotateNextRound() {
  const currentHour = new Date().getUTCHours();
  currentDuel.roundId++;

  const isEvenHour = currentHour % 2 === 0;

  // Horas Ímpares: Tenta Radar balanceado
  if (!isEvenHour) {
    console.log('🔍 Buscando duelo balanceado no TRENDING RADAR da DexScreener...');
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

  // Horas Pares: Sorteia par dentro da mesma categoria com teste de volume parelho
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

  let selectedPair = null;
  let attempts = 0;

  console.log(`⚖️ Buscando par equilibrado em [${categoryKey}] (Diferença max 30% de volume)...`);

  // Tenta até 6 combinações aleatórias para encontrar um gap de volume <= 30%
  while (!selectedPair && attempts < 6) {
    attempts++;
    const shuffled = [...tokenList].sort(() => 0.5 - Math.random());
    const candidateA = shuffled[0];
    const candidateB = shuffled[1];

    const volA = await fetchTokenVolumeUSD(candidateA.mint);
    const volB = await fetchTokenVolumeUSD(candidateB.mint);

    const diffPct = Math.round((Math.abs(volA - volB) / Math.max(volA, volB || 1)) * 100);
    console.log(`Tentativa ${attempts}: ${candidateA.symbol} ($${(volA/1e6).toFixed(2)}M) vs ${candidateB.symbol} ($${(volB/1e6).toFixed(2)}M) -> Gap: ${diffPct}%`);

    if (isBalancedVolume(volA, volB, 0.30)) {
      selectedPair = [candidateA, candidateB];
      console.log(`🎯 Par Aprovado com paridade! Gap de apenas ${diffPct}%.`);
    }
  }

  // Se nenhuma combinação tiver gap < 30%, pega o par padrão de memecoins mais balanceadas
  if (!selectedPair) {
    console.log('⚠️ Sem match estrito de 30% após tentativas, usando par padrão de alta liquidez.');
    selectedPair = [TOKENS_BY_CATEGORY.MEMES[0], TOKENS_BY_CATEGORY.MEMES[1]]; // BONK vs WIF
    categoryKey = 'MEMES';
    categoryTitle = '🎭 MEME WARFARE';
  }

  currentDuel.modeType = categoryKey;
  currentDuel.title = `${categoryTitle} • DUEL #${currentDuel.roundId}`;
  currentDuel.fighterA = selectedPair[0];
  currentDuel.fighterB = selectedPair[1];
  currentDuel.updatedAt = new Date().toISOString();

  console.log(`✅ Novo Duelo Definido: ${selectedPair[0].symbol} vs ${selectedPair[1].symbol}`);
}

// Executa um sorteio logo ao ligar para aplicar o filtro imediatamente
rotateNextRound();

// Agenda para o minuto 0 de toda hora
cron.schedule('0 * * * *', () => {
  rotateNextRound();
});

// ============================================================
// 6. SERVIDOR HTTP (API DO BULL ROYALE)
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
  console.log('⏸️ Bull Royale Bot online com algoritmo de paridade de volume.');
});
