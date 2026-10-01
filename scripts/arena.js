/* ===================================================
   BULL ROYALE - DUEL ENGINE, ORACLES & WAGERING
   =================================================== */

// WAGER CONSTRAINTS
const MIN_WAGER = 0.20;
const MAX_WAGER = 5.00;

// ORACLE BOT ENDPOINT
const RENDER_BOT_API = "https://bull-royale-bot.onrender.com/api/current-round";

// ACTIVE WAGERS STORAGE
let myActiveWagers = localStorage.getItem('bull_my_wagers')
  ? JSON.parse(localStorage.getItem('bull_my_wagers'))
  : [];

window.clearMyWagers = function() {
  myActiveWagers = [];
  localStorage.setItem('bull_my_wagers', JSON.stringify(myActiveWagers));
  renderMyWagers();
};

// DYNAMIC FIGHTERS CONFIGURATION
let fighterA = {
  name: 'BONK',
  symbol: 'BONK',
  mint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
  icon: 'https://cryptologos.cc/logos/bonk1-bonk-logo.png?v=035',
  sub: 'Solana Ecosystem Flagship'
};

let fighterB = {
  name: 'dogwifhat',
  symbol: 'WIF',
  mint: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
  icon: 'https://cryptologos.cc/logos/dogwifhat-wif-logo.png?v=035',
  sub: 'Momentum Challenger'
};

let currentArenaMode = '1h';
let currentPipelineRoom = 'active';

const pipelineState = {
  '30m': {
    active: {
      roundId: 501,
      title: "TURBO ARENA (LIVE)",
      division: "🔥 TURBO ARENA • DUEL #501",
      stakedBonk: 45.80,
      stakedWif: 38.20,
      isLocked: false
    },
    next: {
      roundId: 502,
      title: "TURBO ARENA (NEXT)",
      division: "🔥 TURBO ARENA • DUEL #502 (OPEN)",
      stakedBonk: 6.00,
      stakedWif: 4.50,
      isLocked: false
    }
  },
  '1h': {
    active: {
      roundId: 105,
      title: "FLASH ARENA (LIVE)",
      division: "⚔️ FLASH ARENA • DUEL #105",
      stakedBonk: 142.39,
      stakedWif: 103.11,
      isLocked: false
    },
    next: {
      roundId: 106,
      title: "FLASH ARENA (NEXT)",
      division: "⚔️ FLASH ARENA • DUEL #106 (OPEN)",
      stakedBonk: 12.50,
      stakedWif: 8.00,
      isLocked: false
    }
  },
  '24h': {
    active: {
      roundId: 18,
      title: "DAILY ROYALE (LIVE)",
      division: "🏆 DAILY ROYALE • ROUND #18",
      stakedBonk: 840.50,
      stakedWif: 615.20,
      isLocked: false
    },
    next: {
      roundId: 19,
      title: "DAILY ROYALE (NEXT)",
      division: "🏆 DAILY ROYALE • ROUND #19 (OPEN)",
      stakedBonk: 140.00,
      stakedWif: 95.00,
      isLocked: false
    }
  }
};

let historyData = {
  '30m': [
    { round: 500, pair: "BONK vs WIF", winner: "BONK", delta: "+8.4%", pool: "62.40 SOL", payout: "1.78x" }
  ],
  '1h': [
    { round: 104, pair: "WIF vs PEPE", winner: "WIF", delta: "+14.2%", pool: "88.50 SOL", payout: "1.85x" },
    { round: 103, pair: "BONK vs POPCAT", winner: "BONK", delta: "+18.9%", pool: "112.00 SOL", payout: "1.62x" }
  ],
  '24h': [
    { round: 17, pair: "BONK vs WIF", winner: "BONK", delta: "+28.4%", pool: "1,240.00 SOL", payout: "1.74x" },
    { round: 16, pair: "WIF vs PEPE", winner: "WIF", delta: "+34.1%", pool: "980.50 SOL", payout: "1.92x" }
  ]
};

let isBufferActive = false;
let volA = 54820000;
let changeA = 18.4;
let volB = 49150000;
let changeB = 11.2;

function resolveFighterIcon(fighter) {
  const defaultIcon = 'https://cryptologos.cc/logos/solana-sol-logo.png?v=035';
  const cdnMap = {
    'MEW': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/MEW1gQWJ3nEXg2qgEriKu7FAFj79PHvQVREQUzScPP5/logo.png',
    'BONK': 'https://cryptologos.cc/logos/bonk1-bonk-logo.png?v=035',
    'WIF': 'https://cryptologos.cc/logos/dogwifhat-wif-logo.png?v=035',
    'POPCAT': 'https://cryptologos.cc/logos/popcat-sol-popcat-logo.png?v=035',
    'BOME': 'https://cryptologos.cc/logos/book-of-meme-bome-logo.png?v=035',
    'PONKE': 'https://cryptologos.cc/logos/ponke-ponke-logo.png?v=035',
    'JUP': 'https://cryptologos.cc/logos/jupiter-ag-jup-logo.png?v=035',
    'RAY': 'https://cryptologos.cc/logos/raydium-ray-logo.png?v=035',
    'PYTH': 'https://cryptologos.cc/logos/pyth-network-pyth-logo.png?v=035',
    'LINK': 'https://cryptologos.cc/logos/chainlink-link-logo.png?v=035'
  };

  if (cdnMap[fighter.symbol]) return cdnMap[fighter.symbol];
  if (fighter.icon && !fighter.icon.includes('coingecko.com')) return fighter.icon;
  return defaultIcon;
}

// AUTOMATIC SYNC ENGINE (RENDER BACKEND)
async function syncDuelFromBot() {
  try {
    const res = await fetch(RENDER_BOT_API);
    if (!res.ok) return;
    const data = await res.json();

    if (data && data.fighterA && data.fighterB) {
      fighterA = data.fighterA;
      fighterB = data.fighterB;
      pipelineState['1h'].active.roundId = data.roundId || pipelineState['1h'].active.roundId;
      pipelineState['1h'].active.division = data.title || `⚔️ FLASH ARENA • DUEL #${pipelineState['1h'].active.roundId}`;
      pipelineState['1h'].next.roundId = pipelineState['1h'].active.roundId + 1;
      pipelineState['1h'].next.division = `⚔️ FLASH ARENA • DUEL #${pipelineState['1h'].next.roundId} (OPEN)`;

      updateFightersUI();
      fetchDexScreenerOracle();
    }
  } catch (e) {
    console.warn('Bot Render syncing fallback active:', e);
  }
}

function updateFightersUI() {
  const defaultIcon = 'https://cryptologos.cc/logos/solana-sol-logo.png?v=035';

  const imgA = document.getElementById('fighter-a-img');
  const imgB = document.getElementById('fighter-b-img');

  if (imgA) {
    imgA.onerror = function() { if (this.src !== defaultIcon) this.src = defaultIcon; };
    imgA.src = resolveFighterIcon(fighterA);
  }
  if (imgB) {
    imgB.onerror = function() { if (this.src !== defaultIcon) this.src = defaultIcon; };
    imgB.src = resolveFighterIcon(fighterB);
  }

  const nameA = document.getElementById('fighter-a-name');
  const subA = document.getElementById('fighter-a-sub');
  const btnA = document.getElementById('btn-enter-fighter-a');
  if (nameA) nameA.innerText = fighterA.symbol;
  if (subA) subA.innerText = fighterA.sub || fighterA.name;
  if (btnA) btnA.innerText = `ENTER DUEL • ${fighterA.symbol}`;

  const nameB = document.getElementById('fighter-b-name');
  const subB = document.getElementById('fighter-b-sub');
  const btnB = document.getElementById('btn-enter-fighter-b');
  if (nameB) nameB.innerText = fighterB.symbol;
  if (subB) subB.innerText = fighterB.sub || fighterB.name;
  if (btnB) btnB.innerText = `ENTER DUEL • ${fighterB.symbol}`;

  const iframeA = document.getElementById('fighter-a-dex-iframe');
  const iframeB = document.getElementById('fighter-b-dex-iframe');
  const linkA = document.getElementById('fighter-a-dex-link');
  const linkB = document.getElementById('fighter-b-dex-link');

  if (iframeA && fighterA.mint) iframeA.src = `https://dexscreener.com/solana/${fighterA.mint}?embed=1&theme=dark&trades=0&info=0`;
  if (iframeB && fighterB.mint) iframeB.src = `https://dexscreener.com/solana/${fighterB.mint}?embed=1&theme=dark&trades=0&info=0`;
  if (linkA && fighterA.mint) linkA.href = `https://dexscreener.com/solana/${fighterA.mint}`;
  if (linkB && fighterB.mint) linkB.href = `https://dexscreener.com/solana/${fighterB.mint}`;

  const tabActive = document.getElementById('tab-label-active');
  const tabNext = document.getElementById('tab-label-next');
  if (tabActive) tabActive.innerText = `🟢 LIVE ROOM • DUEL #${pipelineState[currentArenaMode].active.roundId} (CLOSING SOON)`;
  if (tabNext) tabNext.innerText = `🚀 NEXT ROOM • DUEL #${pipelineState[currentArenaMode].next.roundId} (OPEN FOR WAGERS)`;
}

function switchArenaMode(mode) {
  if (window.arcadeSound) arcadeSound();
  currentArenaMode = mode;

  const btn30m = document.getElementById('tab-30m');
  const btn1h = document.getElementById('tab-1h');
  const btn24h = document.getElementById('tab-24h');

  if (btn30m) btn30m.classList.toggle('active-tab', mode === '30m');
  if (btn1h) btn1h.classList.toggle('active-tab', mode === '1h');
  if (btn24h) btn24h.classList.toggle('active-tab', mode === '24h');

  let poolTagText = 'FLASH POOL';
  if (mode === '30m') poolTagText = 'TURBO POOL (30M)';
  else if (mode === '24h') poolTagText = 'DAILY ROYALE';

  const tagA = document.getElementById('fighter-a-pool-tag');
  const tagB = document.getElementById('fighter-b-pool-tag');
  if (tagA) tagA.innerText = poolTagText;
  if (tagB) tagB.innerText = poolTagText;

  let metricLabel = 'ACTIVE DUEL POOL';
  let historyLabel = '1H ON-CHAIN SETTLED DUELS';
  if (mode === '30m') {
    metricLabel = 'ACTIVE TURBO POOL';
    historyLabel = '30M TURBO SETTLED DUELS';
  } else if (mode === '24h') {
    metricLabel = 'ACTIVE GRAND POOL';
    historyLabel = '24H DAILY ROYALE SETTLEMENTS';
  }

  const elMetric = document.getElementById('metric-pool-label');
  const elHistory = document.getElementById('history-header-title');
  if (elMetric) elMetric.innerText = metricLabel;
  if (elHistory) elHistory.innerText = historyLabel;

  updateFightersUI();
  renderHistory();
  renderMyWagers();
  updateArenaMath();
  updateEngineTimer();
}

function switchPipelineRoom(room) {
  if (window.arcadeSound) arcadeSound();
  currentPipelineRoom = room;

  const rActive = document.getElementById('room-active');
  const rNext = document.getElementById('room-next');
  if (rActive) rActive.classList.toggle('active-room', room === 'active');
  if (rNext) rNext.classList.toggle('active-room', room === 'next');

  renderMyWagers();
  updateArenaMath();
  updateEngineTimer();
}

async function fetchDexScreenerOracle() {
  try {
    const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${fighterA.mint},${fighterB.mint}`);
    const data = await response.json();

    if (data && data.pairs && data.pairs.length > 0) {
      const pairsA = data.pairs.filter(p => p.baseToken.address === fighterA.mint);
      const pairsB = data.pairs.filter(p => p.baseToken.address === fighterB.mint);

      if (pairsA.length > 0) {
        volA = pairsA.reduce((acc, p) => acc + (p.volume?.h24 || 0), 0) || volA;
        changeA = pairsA[0].priceChange?.h24 || changeA;
      }

      if (pairsB.length > 0) {
        volB = pairsB.reduce((acc, p) => acc + (p.volume?.h24 || 0), 0) || volB;
        changeB = pairsB[0].priceChange?.h24 || changeB;
      }

      renderOracleUI();
    }
  } catch (err) {
    console.warn('DexScreener API fallback active:', err);
    renderOracleUI();
  }
}

function renderOracleUI() {
  const elA = document.getElementById('fighter-a-dex-vol');
  const elB = document.getElementById('fighter-b-dex-vol');
  if (!elA || !elB) return;

  const aFmt = (volA / 1e6).toFixed(2);
  const bFmt = (volB / 1e6).toFixed(2);

  const aDeltaStr = changeA >= 0 ? `+${changeA}%` : `${changeA}%`;
  const bDeltaStr = changeB >= 0 ? `+${changeB}%` : `${changeB}%`;

  elA.innerHTML = `$${aFmt}M <span style="color:${changeA >= 0 ? 'var(--green)' : 'var(--pink)'}; font-size:10px;">${aDeltaStr}</span>`;
  elB.innerHTML = `$${bFmt}M <span style="color:${changeB >= 0 ? 'var(--green)' : 'var(--pink)'}; font-size:10px;">${bDeltaStr}</span>`;
}

function updateArenaMath() {
  const st = pipelineState[currentArenaMode][currentPipelineRoom];
  const totalPool = st.stakedBonk + st.stakedWif;
  const aPct = Math.round((st.stakedBonk / totalPool) * 100);
  const bPct = 100 - aPct;

  const multA = ((totalPool * 0.95) / st.stakedBonk).toFixed(2);
  const multB = ((totalPool * 0.95) / st.stakedWif).toFixed(2);

  const tagDiv = document.getElementById('arena-division-tag');
  const metricPool = document.getElementById('metric-total-pool');
  const valA = document.getElementById('fighter-a-staked-val');
  const valB = document.getElementById('fighter-b-staked-val');
  const multElA = document.getElementById('fighter-a-multiplier-val');
  const multElB = document.getElementById('fighter-b-multiplier-val');

  if (tagDiv) tagDiv.innerText = st.division;
  if (metricPool) metricPool.innerText = `${totalPool.toFixed(2)} SOL`;
  if (valA) valA.innerText = `${st.stakedBonk.toFixed(2)} SOL (${aPct}%)`;
  if (valB) valB.innerText = `${st.stakedWif.toFixed(2)} SOL (${bPct}%)`;
  if (multElA) multElA.innerText = `${multA}x`;
  if (multElB) multElB.innerText = `${multB}x`;

  const tugA = document.getElementById('tug-label-fighter-a');
  const tugB = document.getElementById('tug-label-fighter-b');
  const tugBar = document.getElementById('tug-fill-bar');

  if (tugA) tugA.innerText = `${fighterA.symbol} MOMENTUM: ${aPct}% (${st.stakedBonk.toFixed(1)} SOL)`;
  if (tugB) tugB.innerText = `${fighterB.symbol} MOMENTUM: ${bPct}% (${st.stakedWif.toFixed(1)} SOL)`;
  if (tugBar) tugBar.style.width = `${aPct}%`;
}

function updateEngineTimer() {
  const now = new Date();
  const timerEl = document.getElementById('clock-timer');
  const timerBox = document.getElementById('timer-pill-box');
  const bufferBadge = document.getElementById('buffer-badge');
  const timerLabel = document.getElementById('timer-label-text');
  const btnA = document.getElementById('btn-enter-fighter-a');
  const btnB = document.getElementById('btn-enter-fighter-b');

  if (!timerEl || !timerBox || !timerLabel || !btnA || !btnB) return;

  if (currentPipelineRoom === 'next') {
    timerLabel.innerText = 'OPENS IN:';
    if (currentArenaMode === '30m') timerEl.innerText = '15m 00s';
    else if (currentArenaMode === '1h') timerEl.innerText = '45m 00s';
    else timerEl.innerText = '23h 45m 00s';

    timerBox.classList.remove('buffer-active');
    if (bufferBadge) bufferBadge.style.display = 'none';
    btnA.classList.remove('btn-locked');
    btnB.classList.remove('btn-locked');
    btnA.innerText = `ENTER PRE-STAKE • ${fighterA.symbol}`;
    btnB.innerText = `ENTER PRE-STAKE • ${fighterB.symbol}`;
    return;
  }

  timerLabel.innerText = 'CLOSES IN:';

  if (currentArenaMode === '30m') {
    const minNow = now.getUTCMinutes();
    const cycleEndMin = minNow < 30 ? 30 : 60;
    const remM = cycleEndMin - 1 - minNow;
    const remS = 59 - now.getUTCSeconds();

    timerEl.innerText = `00h ${String(remM).padStart(2, '0')}m ${String(remS).padStart(2, '0')}s`;
    isBufferActive = (remM < 15);

    if (remM === 0 && remS === 0) settleRound('30m');
  } else if (currentArenaMode === '1h') {
    const m = 59 - now.getUTCMinutes();
    const s = 59 - now.getUTCSeconds();
    timerEl.innerText = `00h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;

    isBufferActive = (m < 15);

    if (m === 0 && s === 0) settleRound('1h');
  } else {
    const h = 23 - now.getUTCHours();
    const m = 59 - now.getUTCMinutes();
    const s = 59 - now.getUTCSeconds();
    timerEl.innerText = `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;

    isBufferActive = (h === 0 && m < 15);

    if (h === 0 && m === 0 && s === 0) settleRound('24h');
  }

  if (isBufferActive) {
    timerBox.classList.add('buffer-active');
    if (bufferBadge) {
      bufferBadge.style.display = 'inline';
      bufferBadge.innerText = '[15M BUFFER ACTIVE]';
    }
    btnA.classList.add('btn-locked');
    btnB.classList.add('btn-locked');
    btnA.innerText = '🔒 ROUND LOCKED (USE NEXT ROOM)';
    btnB.innerText = '🔒 ROUND LOCKED (USE NEXT ROOM)';
  } else {
    timerBox.classList.remove('buffer-active');
    if (bufferBadge) bufferBadge.style.display = 'none';
    btnA.classList.remove('btn-locked');
    btnB.classList.remove('btn-locked');
    btnA.innerText = `ENTER DUEL • ${fighterA.symbol}`;
    btnB.innerText = `ENTER DUEL • ${fighterB.symbol}`;
  }
}

function settleRound(mode) {
  const st = pipelineState[mode].active;
  if (!st || st.isSettling) return;
  st.isSettling = true;

  const winner = (changeA >= changeB) ? fighterA.symbol : fighterB.symbol;
  const winnerVal = (winner === fighterA.symbol ? changeA : changeB);
  const winnerDelta = winnerVal >= 0 ? `+${winnerVal.toFixed(1)}%` : `${winnerVal.toFixed(1)}%`;
  const totalPool = (st.stakedBonk + st.stakedWif).toFixed(2);
  const mult = winner === fighterA.symbol
    ? ((totalPool * 0.95) / st.stakedBonk).toFixed(2)
    : ((totalPool * 0.95) / st.stakedWif).toFixed(2);

  let totalWinnings = 0;
  let totalBonusXP = 0;

  myActiveWagers.forEach(w => {
    if (w.roundId === st.roundId && w.mode === mode) {
      if (w.fighter === winner) {
        totalWinnings += (w.amount * parseFloat(mult));
        const bonusXP = (w.baseXP || w.amount) * 0.20;
        totalBonusXP += bonusXP;
      }
    }
  });

  if (totalBonusXP > 0) {
    if (window.addBattleXP) addBattleXP(totalBonusXP, true);
    if (window.currentPublicKey && window.recordXPOnServer) {
      recordXPOnServer(currentPublicKey, totalBonusXP, 'victory_bonus');
    }
  }

  if (totalWinnings > 0) {
    fakeCredits += totalWinnings;
    localStorage.setItem('bull_fake_credits', fakeCredits);
    if (window.renderFakeBalance) renderFakeBalance();
    alert(`🏆 CONGRATULATIONS! You won duel #${st.roundId} backing ${winner}!\n\nPayout: +${totalWinnings.toFixed(2)} SOL\nVictory XP Bonus (+20%): +${totalBonusXP.toFixed(2)} Battle XP!`);
  }

  myActiveWagers = myActiveWagers.filter(w => !(w.roundId === st.roundId && w.mode === mode));
  localStorage.setItem('bull_my_wagers', JSON.stringify(myActiveWagers));
  renderMyWagers();

  const banner = document.getElementById('round-announcement-banner');
  const bannerText = document.getElementById('round-winner-text');
  if (banner && bannerText) {
    bannerText.innerText = `🏆 ${st.title} #${st.roundId} SETTLED! VICTOR: ${winner} (Δ ${winnerDelta} DEX VELOCITY) • PROTOCOL TREASURY & SETTLEMENT EXECUTED!`;
    banner.style.display = 'block';
  }

  historyData[mode].unshift({
    round: st.roundId,
    pair: `${fighterA.symbol} vs ${fighterB.symbol}`,
    winner: winner,
    delta: winnerDelta,
    pool: `${totalPool} SOL`,
    payout: `${mult}x`
  });

  st.roundId++;
  st.title = mode === '30m' ? 'TURBO ARENA (LIVE)' : (mode === '1h' ? 'FLASH ARENA (LIVE)' : 'DAILY ROYALE (LIVE)');
  st.stakedBonk = mode === '30m' ? 25.0 : (mode === '1h' ? 50.0 : 300.0);
  st.stakedWif = mode === '30m' ? 25.0 : (mode === '1h' ? 50.0 : 300.0);
  st.isLocked = false;
  st.isSettling = false;
  st.division = mode === '30m'
    ? `🔥 TURBO ARENA • DUEL #${st.roundId}`
    : (mode === '1h' ? `⚔️ FLASH ARENA • DUEL #${st.roundId}` : `🏆 DAILY ROYALE • ROUND #${st.roundId}`);

  syncDuelFromBot();

  if (currentArenaMode === mode) {
    renderHistory();
    renderMyWagers();
    updateArenaMath();
  }
}

function renderHistory() {
  const list = historyData[currentArenaMode];
  const container = document.getElementById('history-container');
  if (!container) return;

  container.innerHTML = list.map(item => `
    <div class="history-row">
      <div class="history-match">
        <span style="color:var(--gold);">ROUND #${item.round}</span>
        <span>${item.pair}</span>
        <span class="badge-winner">SETTLED: ${item.winner} (Δ ${item.delta})</span>
      </div>
      <div class="history-stats">
        <span>Pool: <strong>${item.pool}</strong></span>
        <span>Payout: <strong style="color:var(--gold);">${item.payout}</strong></span>
        <span>Distribution: <strong style="color:var(--green);">Instant</strong></span>
      </div>
    </div>
  `).join('');
}

function renderMyWagers() {
  const box = document.getElementById('my-wagers-box');
  const list = document.getElementById('my-wagers-list');
  if (!box || !list) return;

  const currentSt = pipelineState[currentArenaMode][currentPipelineRoom];
  const relevantWagers = myActiveWagers.filter(w => w.roundId === currentSt.roundId && w.mode === currentArenaMode);

  if (relevantWagers.length === 0) {
    box.style.display = 'none';
    return;
  }

  box.style.display = 'block';
  list.innerHTML = relevantWagers.map(w => `
    <div style="background: #050813; border: 1px solid #141c2c; border-radius: 8px; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center; font-size: 12px; flex-wrap: wrap; gap: 8px;">
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="padding: 2px 8px; border-radius: 4px; font-weight: 900; font-size: 11px; background: ${w.fighter === fighterA.symbol ? 'var(--cyan)' : 'var(--purple)'}; color: ${w.fighter === fighterA.symbol ? '#000' : '#fff'};">
          ${w.fighter}
        </span>
        <span style="color: #cbd5e1; font-weight: 700;">Wager: <strong style="color:#fff;">${w.amount.toFixed(2)} SOL</strong></span>
      </div>
      <div style="display: flex; gap: 14px; align-items: center;">
        <span style="color: #94a3b8; font-weight: 600;">Multiplier: <strong style="color:#fff;">${w.mult}x</strong></span>
        <span style="color: var(--gold); font-weight: 900; font-size: 13px;">Est. Win: +${(w.amount * w.mult).toFixed(2)} SOL</span>
      </div>
    </div>
  `).join('');
}

// FAQ TOGGLE
function toggleFaq(el) {
  if (window.arcadeSound) arcadeSound();
  const isOpen = el.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(item => item.classList.remove('open'));
  if (!isOpen) el.classList.add('open');
}

// STAKE MODAL CONTROLLER
let selectedFighter = 'BONK';
let currentMultiplier = 1.72;

function openStakeModal(fighterKey) {
  if (window.arcadeSound) arcadeSound();
  if (isBufferActive && currentPipelineRoom === 'active') {
    alert("⚠️ Live room is currently locked by the 15-Minute Anti-Snipe buffer! Switch to the 'NEXT ROOM' above to place your wagers for the upcoming round.");
    return;
  }

  const fighter = (fighterKey === 'A') ? fighterA : fighterB;
  selectedFighter = fighter.symbol;

  const st = pipelineState[currentArenaMode][currentPipelineRoom];
  const totalPool = st.stakedBonk + st.stakedWif;
  currentMultiplier = parseFloat(fighterKey === 'A'
    ? ((totalPool * 0.95) / st.stakedBonk).toFixed(2)
    : ((totalPool * 0.95) / st.stakedWif).toFixed(2)
  );

  document.getElementById('modal-fighter-name').innerText = `${fighter.symbol} (${st.title})`;
  document.getElementById('modal-fighter-mult').innerText = `${currentMultiplier}x`;

  const modalImg = document.getElementById('modal-fighter-img');
  const defaultIcon = 'https://cryptologos.cc/logos/solana-sol-logo.png?v=035';
  if (modalImg) {
    modalImg.onerror = function() { this.src = defaultIcon; };
    modalImg.src = resolveFighterIcon(fighter);
  }

  const userSol = document.getElementById('modal-user-sol');
  if (userSol) userSol.innerText = fakeCredits.toFixed(2);

  const stakeInp = document.getElementById('input-stake-amount');
  if (stakeInp) stakeInp.value = '0.20';
  calculateModalReturn();

  const btnConfirm = document.getElementById('btn-modal-confirm');
  if (btnConfirm) {
    btnConfirm.className = fighterKey === 'A' ? 'btn-arcade btn-arcade-cyan' : 'btn-arcade btn-arcade-purple';
  }
  document.getElementById('stake-modal-overlay').style.display = 'flex';
}

function closeStakeModal(e) {
  if (e && e.target !== document.getElementById('stake-modal-overlay') && !e.target.classList.contains('modal-close')) return;
  document.getElementById('stake-modal-overlay').style.display = 'none';
}

function setFixedSol(amount) {
  if (window.arcadeSound) arcadeSound();
  document.getElementById('input-stake-amount').value = amount.toFixed(2);
  calculateModalReturn();
}

function calculateModalReturn() {
  const val = parseFloat(document.getElementById('input-stake-amount').value) || 0;
  const ret = (val * currentMultiplier).toFixed(2);
  const payoutEl = document.getElementById('modal-est-payout');
  if (payoutEl) payoutEl.innerText = ret;
}

async function confirmModalStake() {
  if (window.arcadeSound) arcadeSound();
  const val = parseFloat(document.getElementById('input-stake-amount').value);

  if (!val || isNaN(val)) {
    alert("Please enter a valid amount!");
    return;
  }

  if (val < MIN_WAGER) {
    alert(`⚠️ Minimum wager: ${MIN_WAGER.toFixed(2)} SOL!`);
    return;
  }

  if (val > MAX_WAGER) {
    alert(`⚠️ Maximum allowed wager: ${MAX_WAGER.toFixed(2)} SOL per wager to protect the round multiplier!`);
    return;
  }

  if (val > fakeCredits) {
    alert(`Insufficient Test PTS! You have ${fakeCredits.toFixed(2)} PTS. Use the '+500' button at the top to reload.`);
    return;
  }

  fakeCredits -= val;
  localStorage.setItem('bull_fake_credits', fakeCredits);
  if (window.renderFakeBalance) renderFakeBalance();

  const earnedXP = val;
  if (window.addBattleXP) addBattleXP(earnedXP);

  if (window.currentPublicKey && window.recordXPOnServer) {
    recordXPOnServer(currentPublicKey, earnedXP, 'wager_placed');
  }

  const currentSt = pipelineState[currentArenaMode][currentPipelineRoom];

  myActiveWagers.push({
    fighter: selectedFighter,
    amount: val,
    baseXP: earnedXP,
    mult: currentMultiplier,
    roundId: currentSt.roundId,
    mode: currentArenaMode
  });

  localStorage.setItem('bull_my_wagers', JSON.stringify(myActiveWagers));
  renderMyWagers();

  if (selectedFighter === fighterA.symbol) currentSt.stakedBonk += val;
  else currentSt.stakedWif += val;
  updateArenaMath();

  document.getElementById('stake-modal-overlay').style.display = 'none';

  alert(`🎯 WAGER CONFIRMED SUCCESSFULLY!\n\nFighter: ${selectedFighter}\nAmount: ${val.toFixed(2)} SOL\nMultiplier: ${currentMultiplier}x\nEst. Payout: +${(val * currentMultiplier).toFixed(2)} SOL\n\nYour wager is now visible in the "YOUR ACTIVE WAGERS" panel!`);
}

// TIMERS & BACKGROUND SYNC
setInterval(updateEngineTimer, 1000);
setInterval(fetchDexScreenerOracle, 30000);
setInterval(syncDuelFromBot, 60000);

// INITIALIZE ON DOM READY
document.addEventListener('DOMContentLoaded', () => {
  // Splash Screen Fadeout
  setTimeout(() => {
    const splash = document.getElementById('splash-screen');
    if (splash) {
      splash.classList.add('fade-out');
      setTimeout(() => splash.remove(), 650);
    }
  }, 1400);

  if (window.renderBattleXP) renderBattleXP();
  if (window.renderFakeBalance) renderFakeBalance();
  renderMyWagers();
  renderHistory();
  updateEngineTimer();
  updateArenaMath();
  updateFightersUI();
  fetchDexScreenerOracle();
  syncDuelFromBot();
});
