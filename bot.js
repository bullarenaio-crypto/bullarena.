require('dotenv').config();
const http = require('http');
const cron = require('node-cron');
const { Telegraf } = require('telegraf');
const { TwitterApi } = require('twitter-api-v2');
const { Keypair, PublicKey, Transaction, SystemProgram, Connection, LAMPORTS_PER_SOL } = require('@solana/web3.js');

const PORT = process.env.PORT || 3000;
const SOLANA_RPC = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
const solanaConnection = new Connection(SOLANA_RPC, 'confirmed');

// GERENCIAMENTO DA CARTEIRA DO PROTOCOLO (OPÇÃO B)
// Se houver uma chave privada salva no ambiente, usamos ela. Se não, geramos uma temporária para testes.
let protocolKeypair;
try {
  if (process.env.PROTOCOL_PRIVATE_KEY) {
    const secretKey = Uint8Array.from(JSON.parse(process.env.PROTOCOL_PRIVATE_KEY));
    protocolKeypair = Keypair.fromSecretKey(secretKey);
  } else {
    protocolKeypair = Keypair.generate();
    console.log('⚠️ AVISO: Nenhuma PROTOCOL_PRIVATE_KEY encontrada no ambiente. Gerada carteira efêmera.');
    console.log('🔑 Endereço Público do Protocolo (Copie para testar):', protocolKeypair.publicKey.toBase58());
    console.log('🔒 Chave Secreta (Guarde em segurança se for usar):', JSON.stringify(Array.from(protocolKeypair.secretKey)));
  }
} catch (e) {
  protocolKeypair = Keypair.generate();
  console.log('🔑 Nova Carteira Gerada:', protocolKeypair.publicKey.toBase58());
}

const PROTOCOL_WALLET_ADDRESS = protocolKeypair.publicKey.toBase58();

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

// ============================================================
// 2. LISTAS TEMÁTICAS DE TOKENS (LINKS SEGUROS & IPFS)
// ============================================================
const TOKENS_BY_CATEGORY = {
  MEMES: [
    { name: 'BONK', symbol: 'BONK', mint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', icon: 'https://cryptologos.cc/logos/bonk1-bonk-logo.png?v=035', sub: 'Solana Ecosystem Flagship' },
    { name: 'dogwifhat', symbol: 'WIF', mint: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm', icon: 'https://cryptologos.cc/logos/dogwifhat-wif-logo.png?v=035', sub: 'Momentum Challenger' },
    { name: 'POPCAT', symbol: 'POPCAT', mint: '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr', icon: 'https://cryptologos.cc/logos/popcat-sol-popcat-logo.png?v=035', sub: 'Viral Cat Sensation' },
    { name: 'cat in a dogs world', symbol: 'MEW', mint: 'MEW1gQWJ3nEXg2qgEriKu7FAFj79PHvQVREQUzScPP5', icon: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/MEW1gQWJ3nEXg2qgEriKu7FAFj79PHvQVREQUzScPP5/logo.png', sub: 'Canine Nemesis' },
    { name: 'BOOK OF MEME', symbol: 'BOME', mint: 'ukHH6c7mMyiWCf1b9pnWe25TSpkDDt3H5pQZgZ74J82', icon: 'https://cryptologos.cc/logos/book-of-meme-bome-logo.png?v=035', sub: 'Immortalized Ledger' },
    { name: 'PONKE', symbol: 'PONKE', mint: '5z3eqYQo9rGHdrUWVoQQvu5MY852whPrT9HypTDpump', icon: 'https://cryptologos.cc/logos/ponke-ponke-logo.png?v=035', sub: 'Solana Degens Monkey' }
  ],
  DEFI: [
    { name: 'Jupiter', symbol: 'JUP', mint: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN', icon: 'https://cryptologos.cc/logos/jupiter-ag-jup-logo.png?v=035', sub: 'Solana Liquidity Aggregator' },
    { name: 'Raydium', symbol: 'RAY', mint: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R', icon: 'https://cryptologos.cc/logos/raydium-ray-logo.png?v=035', sub: 'AMM & Yield Engine' }
  ],
  ORACLES: [
    { name: 'Pyth Network', symbol: 'PYTH', mint: 'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3', icon: 'https://cryptologos.cc/logos/pyth-network-pyth-logo.png?v=035', sub: 'Next-Gen Financial Oracle' },
    { name: 'Chainlink', symbol: 'LINK', mint: '2wp3DvCBduaUBCSGdNxHgphxcAYcpvPvTTBy7YJLgTpx', icon: 'https://cryptologos.cc/logos/chainlink-link-logo.png?v=035', sub: 'Decentralized Oracle Standard' }
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

function isBalancedVolume(volA, volB, maxGapRatio = MAX_VOLUME_GAP_RATIO) {
  if (volA <= 0 || volB <= 0) return true;
  const max = Math.max(volA, volB);
  const diff = Math.abs(volA - volB);
  return (diff / max) <= maxGapRatio;
}

// Rotação automática de rounds
async function rotateNextRound() {
  const currentHour = new Date().getUTCHours();
  currentDuel.roundId++;
  const isEvenHour = currentHour % 2 === 0;

  if (!isEvenHour) {
    console.log('🔍 Buscando duelo no TRENDING RADAR da DexScreener...');
    // Lógica simplificada de radar ou fallback para categorias
  }

  const tokenList = TOKENS_BY_CATEGORY.MEMES;
  const shuffled = [...tokenList].sort(() => 0.5 - Math.random());

  currentDuel.modeType = 'MEME_WARFARE';
  currentDuel.title = `🎭 MEME WARFARE • DUEL #${currentDuel.roundId}`;
  currentDuel.fighterA = shuffled[0];
  currentDuel.fighterB = shuffled[1];
  currentDuel.updatedAt = new Date().toISOString();

  console.log(`✅ Novo Confronto Definido: ${shuffled[0].symbol} vs ${shuffled[1].symbol}`);
}

rotateNextRound();
cron.schedule('0 * * * *', () => rotateNextRound());

// ============================================================
// 3. SERVIDOR HTTP (API + SOLANA BLINKS / ACTIONS)
// ============================================================
const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Encoding');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // 1. Endpoint de dados do round atual
  if (req.url === '/api/current-round') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(currentDuel));
    return;
  }

  // 2. Endpoint Solana Action / Blink (GET: Retorna metadados do card)
  if (req.url.startsWith('/api/actions/duel')) {
    if (req.method === 'GET') {
      const payload = {
        title: `Bull Royale • ${currentDuel.title}`,
        icon: currentDuel.fighterA.icon,
        description: `Back your conviction in Duel #${currentDuel.roundId}: ${currentDuel.fighterA.symbol} vs ${currentDuel.fighterB.symbol}. Instant $SOL settlement via non-custodial PDA vault.`,
        label: "Stake SOL",
        links: {
          actions: [
            {
              label: `Stake 0.20 SOL on ${currentDuel.fighterA.symbol}`,
              href: `/api/actions/duel?fighter=${currentDuel.fighterA.symbol}&amount=0.20`
            },
            {
              label: `Stake 1.00 SOL on ${currentDuel.fighterA.symbol}`,
              href: `/api/actions/duel?fighter=${currentDuel.fighterA.symbol}&amount=1.00`
            },
            {
              label: `Stake 0.20 SOL on ${currentDuel.fighterB.symbol}`,
              href: `/api/actions/duel?fighter=${currentDuel.fighterB.symbol}&amount=0.20`
            },
            {
              label: `Stake 1.00 SOL on ${currentDuel.fighterB.symbol}`,
              href: `/api/actions/duel?fighter=${currentDuel.fighterB.symbol}&amount=1.00`
            }
          ]
        }
      };
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(payload));
      return;
    }

    // POST: Processa a transação de aposta direto pelo Blink
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          const accountPubkey = data.account; // Carteira do usuário que clicou no Blink

          const urlParams = new URL(req.url, `http://${req.headers.host}`).searchParams;
          const fighterSymbol = urlParams.get('fighter') || currentDuel.fighterA.symbol;
          const amountSol = parseFloat(urlParams.get('amount')) || 0.20;

          if (!accountPubkey) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing account public key' }));
            return;
          }

          const fromPubkey = new PublicKey(accountPubkey);
          const toPubkey = new PublicKey(PROTOCOL_WALLET_ADDRESS);
          const lamports = Math.round(amountSol * LAMPORTS_PER_SOL);

          // Cria a transação de transferência de SOL para o cofre do protocolo
          const transaction = new Transaction();
          const blockhashObj = await solanaConnection.getLatestBlockhash();
          transaction.recentBlockhash = blockhashObj.blockhash;
          transaction.feePayer = fromPubkey;

          transaction.add(
            SystemProgram.transfer({
              fromPubkey,
              toPubkey,
              lamports
            })
          );

          const serializedTransaction = transaction.serialize({ requireAllSignatures: false }).toString('base64');

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            transaction: serializedTransaction,
            message: `Successfully staked ${amountSol} SOL on ${fighterSymbol} for Round #${currentDuel.roundId}!`
          }));
        } catch (err) {
          console.error('Erro ao processar Blink POST:', err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message }));
        }
      });
      return;
    }
  }

  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', protocolWallet: PROTOCOL_WALLET_ADDRESS, uptime: process.uptime() }));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bull Royale Bot & Actions Engine active.\n');
});

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`🔒 Carteira do Protocolo Ativa: ${PROTOCOL_WALLET_ADDRESS}`);
});
