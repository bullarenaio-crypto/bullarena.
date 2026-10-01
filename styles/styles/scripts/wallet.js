/* ===================================================
   BULL ROYALE - WEB3 WALLET & BALANCES ENGINE
   =================================================== */

const SOLANA_RPC_URL = "https://api.mainnet-beta.solana.com";

let walletConnected = false;
let currentProvider = null;
let currentPublicKey = null;
let balanceSolNum = 0;

// TEST CREDITS STORAGE
let fakeCredits = localStorage.getItem('bull_fake_credits')
  ? parseFloat(localStorage.getItem('bull_fake_credits'))
  : 1000.00;

// BATTLE XP ENGINE (1 SOL = 1 XP | WIN = +20% XP)
let userBattleXP = localStorage.getItem('bull_user_xp')
  ? parseFloat(localStorage.getItem('bull_user_xp'))
  : 0.00;

function arcadeSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(750, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {}
}

function renderBattleXP() {
  const el = document.getElementById('user-battle-xp');
  if (el) {
    el.innerText = userBattleXP.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
}

function addBattleXP(amount, isVictoryBonus = false) {
  userBattleXP += amount;
  localStorage.setItem('bull_user_xp', userBattleXP);
  renderBattleXP();
}

async function syncWalletXP(walletPubkey) {
  if (!walletPubkey) return;
  try {
    const res = await fetch(`https://bull-royale-bot.onrender.com/api/xp/${walletPubkey}`);
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data.xp === 'number') {
        userBattleXP = data.xp;
        localStorage.setItem('bull_user_xp', userBattleXP);
        renderBattleXP();
      }
    }
  } catch (e) {
    console.warn("Server XP sync fallback active:", e);
  }
}

async function recordXPOnServer(walletPubkey, xpAmount, reason) {
  if (!walletPubkey) return;
  try {
    await fetch('https://bull-royale-bot.onrender.com/api/xp/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wallet: walletPubkey,
        amount: xpAmount,
        reason: reason,
        timestamp: Date.now()
      })
    });
  } catch (e) {
    console.warn("Failed to record XP on server:", e);
  }
}

function renderFakeBalance() {
  const el = document.getElementById('fake-balance-val');
  if (el) {
    el.innerText = fakeCredits.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
}

function addFakeCredits(amount = 500) {
  arcadeSound();
  fakeCredits += amount;
  localStorage.setItem('bull_fake_credits', fakeCredits);
  renderFakeBalance();
  alert(`🎉 +${amount} Test Credits added successfully!`);
}

function resetFakeCredits() {
  arcadeSound();
  fakeCredits = 1000.00;
  if (window.clearMyWagers) window.clearMyWagers();
  localStorage.setItem('bull_fake_credits', fakeCredits);
  renderFakeBalance();
  alert(`🔄 Balance reset to 1,000.00 PTS and active wagers cleared!`);
}

async function fetchBalances(publicKeyStr) {
  const pill = document.getElementById('wallet-balance-pill');
  const solEl = document.getElementById('val-sol');

  try {
    const respSol = await fetch(SOLANA_RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getBalance',
        params: [publicKeyStr]
      })
    });
    const dataSol = await respSol.json();
    if (dataSol?.result?.value !== undefined) {
      balanceSolNum = (dataSol.result.value / 1e9);
      solEl.innerText = balanceSolNum.toFixed(3);
    } else {
      balanceSolNum = 0;
      solEl.innerText = '0.000';
    }

    if (window.innerWidth > 680 && pill) {
      pill.style.display = 'flex';
    }
  } catch (err) {
    console.warn('RPC Balance query fallback:', err);
  }
}

function manageWallet() {
  arcadeSound();
  if (walletConnected) {
    if (confirm("Disconnect your Web3 wallet from Bull Royale?")) {
      disconnectWallet();
    }
    return;
  }
  document.getElementById('wallet-modal-overlay').style.display = 'flex';
}

function closeWalletModal(e) {
  if (e && e.target !== document.getElementById('wallet-modal-overlay') && !e.target.classList.contains('modal-close')) return;
  document.getElementById('wallet-modal-overlay').style.display = 'none';
}

async function connectProvider(type) {
  arcadeSound();
  closeWalletModal();
  const btn = document.getElementById('btn-wallet');

  try {
    let provider = null;
    if (type === 'phantom') provider = window.phantom?.solana || (window.solana?.isPhantom ? window.solana : null);
    else if (type === 'solflare') provider = window.solflare;
    else if (type === 'backpack') provider = window.backpack;
    else if (type === 'okx') provider = window.okxwallet?.solana;

    if (!provider) {
      alert(`${type.toUpperCase()} Wallet not detected! Please install the browser extension.`);
      return;
    }

    const resp = await provider.connect();
    currentProvider = provider;
    currentPublicKey = (resp.publicKey || provider.publicKey).toString();
    walletConnected = true;

    btn.innerText = `${currentPublicKey.slice(0, 4)}...${currentPublicKey.slice(-4)}`;
    btn.classList.add("connected");
    btn.title = "Connected • Click to Disconnect";

    fetchBalances(currentPublicKey);
    syncWalletXP(currentPublicKey);

    if (provider.on) {
      provider.on('disconnect', disconnectWallet);
    }
  } catch (err) {
    console.warn("Wallet connection aborted:", err);
  }
}

function disconnectWallet() {
  try {
    if (currentProvider && currentProvider.disconnect) currentProvider.disconnect();
  } catch (e) {}
  walletConnected = false;
  currentProvider = null;
  currentPublicKey = null;
  balanceSolNum = 0;

  const btn = document.getElementById('btn-wallet');
  const pill = document.getElementById('wallet-balance-pill');
  if (btn) {
    btn.innerText = "CONNECT WALLET";
    btn.classList.remove("connected");
    btn.title = "";
  }
  if (pill) pill.style.display = "none";
}
