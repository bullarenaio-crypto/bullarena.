import React, { useEffect, useMemo, useState } from "react";
import {
  ConnectionProvider,
  WalletProvider,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";

const ENDPOINT = clusterApiUrl("mainnet-beta");
const BULL_LOGO_URL = "/bull-logo.png";

const navigationItems = [
  { id: "rooms", label: "Battle Rooms", icon: "⚔" },
  { id: "profile", label: "My Profile", icon: "◉" },
  { id: "launchpad", label: "Launchpad", icon: "◆" },
  { id: "leaderboard", label: "Leaderboard", icon: "♛" },
  { id: "rewards", label: "Rewards", icon: "✦" },
  { id: "settings", label: "Settings", icon: "⚙" },
];

function Terminal() {
  const { connection } = useConnection();
  const { publicKey, connected, disconnect } = useWallet();

  const [activeTab, setActiveTab] = useState("rooms");
  const [balance, setBalance] = useState(null);
  const [timeLeft, setTimeLeft] = useState(28 * 60 + 17);
  const [selectedSide, setSelectedSide] = useState(null);
  const [notification, setNotification] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const shortAddress = publicKey
    ? `${publicKey.toString().slice(0, 4)}...${publicKey
        .toString()
        .slice(-4)}`
    : "Not Connected";

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((current) => (current > 0 ? current - 1 : 28 * 60 + 17));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!publicKey) {
      setBalance(null);
      return;
    }

    let active = true;

    async function loadBalance() {
      try {
        const lamports = await connection.getBalance(publicKey);

        if (active) {
          setBalance(lamports / LAMPORTS_PER_SOL);
        }
      } catch (error) {
        console.error("Unable to load wallet balance:", error);

        if (active) {
          setBalance(null);
        }
      }
    }

    loadBalance();

    return () => {
      active = false;
    };
  }, [connection, publicKey]);

  useEffect(() => {
    if (!notification) return;

    const timeout = setTimeout(() => {
      setNotification("");
    }, 3500);

    return () => clearTimeout(timeout);
  }, [notification]);

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  }, [timeLeft]);

  function handleNavigation(tab) {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBattleSelection(side) {
    if (!connected) {
      setNotification("Connect your wallet before entering a battle.");
      return;
    }

    setSelectedSide(side);

    setNotification(
      `${side} selected. Your wallet is connected and ready for the next step.`
    );
  }

  async function handleDisconnect() {
    try {
      await disconnect();
      setNotification("Wallet disconnected.");
    } catch (error) {
      console.error("Wallet disconnect failed:", error);
    }
  }

  function renderRooms() {
    return (
      <section className="content-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">LIVE ARENA</span>
            <h1>Battle Rooms</h1>
            <p>
              Choose your side, follow the momentum, and enter the next live
              round.
            </p>
          </div>

          <div className="live-status">
            <span className="status-dot" />
            LIVE
          </div>
        </div>

        <div className="market-overview">
          <div className="overview-card">
            <span>ACTIVE PLAYERS</span>
            <strong>100</strong>
          </div>

          <div className="overview-card">
            <span>ROUND POOL</span>
            <strong>245.50</strong>
            <small>TEST SOL</small>
          </div>

          <div className="overview-card">
            <span>ROUND TIME</span>
            <strong>{formattedTime}</strong>
          </div>

          <div className="overview-card">
            <span>MARKET MOMENTUM</span>
            <strong className="positive">+8.42%</strong>
          </div>
        </div>

        <div className="battle-card">
          <div className="battle-card-header">
            <div>
              <span className="eyebrow">ROOM #001</span>
              <h2>SHIBA <span>VS</span> DOGE</h2>
            </div>

            <div className="round-badge">30 MINUTE ROUND</div>
          </div>

          <div className="battle-graph">
            <div className="graph-grid">
              <span />
              <span />
              <span />
              <span />
            </div>

            <svg
              viewBox="0 0 900 260"
              preserveAspectRatio="none"
              className="market-line"
              aria-label="Market momentum chart"
            >
              <defs>
                <linearGradient
                  id="lineGradient"
                  x1="0"
                  x2="1"
                  y1="0"
                  y2="0"
                >
                  <stop offset="0%" stopColor="#16e0ff" />
                  <stop offset="100%" stopColor="#ffd84d" />
                </linearGradient>
              </defs>

              <path
                d="M0 210
                   C50 205 55 160 105 174
                   C150 187 150 130 205 145
                   C250 158 270 105 320 126
                   C370 148 380 80 430 98
                   C480 116 505 62 550 88
                   C600 115 620 45 670 72
                   C720 98 735 42 785 56
                   C830 68 850 35 900 28"
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </svg>

            <div className="chart-label chart-label-top">
              MARKET MOMENTUM
            </div>

            <div className="chart-label chart-label-bottom">
              LIVE FEED
            </div>
          </div>

          <div className="fighters">
            <button
              type="button"
              className={`fighter-card shiba ${
                selectedSide === "SHIBA" ? "selected" : ""
              }`}
              onClick={() => handleBattleSelection("SHIBA")}
            >
              <div className="fighter-avatar">🐕</div>

              <div className="fighter-information">
                <span className="fighter-name">SHIBA</span>
                <span className="fighter-symbol">SHIB</span>
              </div>

              <div className="fighter-stat">
                <span>Momentum</span>
                <strong>+12.8%</strong>
              </div>

              <div className="fighter-action">
                {selectedSide === "SHIBA" ? "SELECTED" : "ENTER"}
              </div>
            </button>

            <div className="versus">
              <span>VS</span>
            </div>

            <button
              type="button"
              className={`fighter-card doge ${
                selectedSide === "DOGE" ? "selected" : ""
              }`}
              onClick={() => handleBattleSelection("DOGE")}
            >
              <div className="fighter-avatar">🐕‍🦺</div>

              <div className="fighter-information">
                <span className="fighter-name">DOGE</span>
                <span className="fighter-symbol">DOGE</span>
              </div>

              <div className="fighter-stat">
                <span>Momentum</span>
                <strong>+7.4%</strong>
              </div>

              <div className="fighter-action">
                {selectedSide === "DOGE" ? "SELECTED" : "ENTER"}
              </div>
            </button>
          </div>

          <div className="battle-footer">
            <div>
              <span>ROUND STATUS</span>
              <strong>OPEN FOR ENTRY</strong>
            </div>

            <div>
              <span>PARTICIPANTS</span>
              <strong>100 / 250</strong>
            </div>

            <div>
              <span>SETTLEMENT</span>
              <strong>INSTANT</strong>
            </div>

            <div>
              <span>PROTOCOL FEE</span>
              <strong>5%</strong>
            </div>
          </div>
        </div>

        <div className="info-grid">
          <div className="info-panel">
            <span className="eyebrow">HOW IT WORKS</span>
            <h3>Choose your momentum.</h3>
            <p>
              Select the asset you believe will show stronger momentum during
              the active round.
            </p>
          </div>

          <div className="info-panel">
            <span className="eyebrow">ROUND PROTECTION</span>
            <h3>Transparent settlement.</h3>
            <p>
              Each round has a defined duration, participant pool, and
              settlement process.
            </p>
          </div>

          <div className="info-panel">
            <span className="eyebrow">YOUR POSITION</span>
            <h3>
              {selectedSide
                ? `${selectedSide} selected`
                : "No side selected"}
            </h3>
            <p>
              {connected
                ? "Your wallet is connected and ready."
                : "Connect your wallet to continue."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  function renderProfile() {
    return (
      <section className="content-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">ACCOUNT</span>
            <h1>My Profile</h1>
            <p>Manage your connected wallet and account information.</p>
          </div>
        </div>

        <div className="profile-layout">
          <div className="profile-card profile-main">
            <div className="profile-logo">
              <img src={BULL_LOGO_URL} alt="Bull Protocol" />
            </div>

            <span className="eyebrow">WALLET STATUS</span>

            <h2>{connected ? "Wallet Connected" : "Wallet Not Connected"}</h2>

            <p className="wallet-address">
              {connected ? publicKey.toString() : "Connect a wallet to begin."}
            </p>

            {connected && (
              <button
                type="button"
                className="secondary-button"
                onClick={handleDisconnect}
              >
                Disconnect Wallet
              </button>
            )}
          </div>

          <div className="profile-card">
            <span className="eyebrow">BALANCE</span>
            <div className="big-number">
              {balance !== null ? balance.toFixed(4) : "0.0000"}
            </div>
            <span className="muted-label">Wallet balance</span>
          </div>

          <div className="profile-card">
            <span className="eyebrow">BATTLE XP</span>
            <div className="big-number">0.00</div>
            <span className="muted-label">Experience points</span>
          </div>
        </div>
      </section>
    );
  }

  function renderLaunchpad() {
    return (
      <section className="content-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">TOKEN PLATFORM</span>
            <h1>Launchpad</h1>
            <p>
              Discover upcoming projects and manage new launches inside the
              Bull ecosystem.
            </p>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={() =>
              setNotification("Launch creation will be available soon.")
            }
          >
            CREATE LAUNCH
          </button>
        </div>

        <div className="launchpad-grid">
          <article className="launch-card featured">
            <div className="launch-status">FEATURED</div>

            <div className="launch-icon">B</div>

            <h2>Bull Protocol</h2>

            <p>
              The core trading ecosystem powering the Bull Arena experience.
            </p>

            <div className="launch-metrics">
              <div>
                <span>STATUS</span>
                <strong>LIVE</strong>
              </div>

              <div>
                <span>COMMUNITY</span>
                <strong>ACTIVE</strong>
              </div>
            </div>

            <button
              type="button"
              className="secondary-button full-width"
              onClick={() => setNotification("Bull Protocol is already live.")}
            >
              VIEW PROJECT
            </button>
          </article>

          <article className="launch-card">
            <div className="launch-status upcoming">UPCOMING</div>

            <div className="launch-icon">01</div>

            <h2>Next Launch</h2>

            <p>
              New projects will appear here once their launch profile is
              published.
            </p>

            <div className="launch-progress">
              <div>
                <span>PROGRESS</span>
                <strong>COMING SOON</strong>
              </div>

              <div className="progress-track">
                <div className="progress-value" />
              </div>
            </div>

            <button
              type="button"
              className="secondary-button full-width"
              onClick={() => setNotification("No new launch is available yet.")}
            >
              VIEW DETAILS
            </button>
          </article>
        </div>
      </section>
    );
  }

  function renderLeaderboard() {
    const players = [
      ["01", "BullMaster", "12,840 XP"],
      ["02", "MomentumKing", "11,420 XP"],
      ["03", "ArenaWolf", "10,885 XP"],
      ["04", "MarketBull", "9,740 XP"],
      ["05", "AlphaTrader", "8,920 XP"],
    ];

    return (
      <section className="content-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">COMPETITION</span>
            <h1>Leaderboard</h1>
            <p>Top performers across the Bull Arena.</p>
          </div>
        </div>

        <div className="leaderboard-card">
          {players.map(([rank, name, xp]) => (
            <div className="leaderboard-row" key={rank}>
              <span className="rank">#{rank}</span>

              <div className="player-avatar">
                {name.charAt(0)}
              </div>

              <div className="player-name">
                <strong>{name}</strong>
                <span>Active Trader</span>
              </div>

              <strong className="player-xp">{xp}</strong>
            </div>
          ))}
        </div>
      </section>
    );
  }

  function renderRewards() {
    return (
      <section className="content-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">REWARD CENTER</span>
            <h1>Rewards</h1>
            <p>Track your progress and available Bull Arena rewards.</p>
          </div>
        </div>

        <div className="reward-grid">
          <div className="reward-card">
            <span className="reward-icon">✦</span>
            <span className="eyebrow">BATTLE XP</span>
            <strong>0.00</strong>
            <p>Earn XP through eligible arena activity.</p>
          </div>

          <div className="reward-card">
            <span className="reward-icon">♛</span>
            <span className="eyebrow">RANK</span>
            <strong>ROOKIE</strong>
            <p>Keep participating to unlock higher ranks.</p>
          </div>

          <div className="reward-card">
            <span className="reward-icon">◆</span>
            <span className="eyebrow">REWARDS</span>
            <strong>LOCKED</strong>
            <p>Reward claims will appear here when available.</p>
          </div>
        </div>
      </section>
    );
  }

  function renderSettings() {
    return (
      <section className="content-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">SYSTEM</span>
            <h1>Settings</h1>
            <p>Manage your Bull Arena experience.</p>
          </div>
        </div>

        <div className="settings-card">
          <div className="setting-row">
            <div>
              <strong>Network Status</strong>
              <span>Primary trading network connection</span>
            </div>

            <div className="setting-value online">
              <span className="status-dot" />
              ACTIVE
            </div>
          </div>

          <div className="setting-row">
            <div>
              <strong>Wallet</strong>
              <span>{connected ? shortAddress : "Not connected"}</span>
            </div>

            <div className="setting-value">
              {connected ? "CONNECTED" : "DISCONNECTED"}
            </div>
          </div>

          <div className="setting-row">
            <div>
              <strong>Interface Language</strong>
              <span>United States English</span>
            </div>

            <div className="setting-value">EN-US</div>
          </div>

          <div className="setting-row">
            <div>
              <strong>Notifications</strong>
              <span>In-app trading notifications</span>
            </div>

            <div className="toggle active">
              <span />
            </div>
          </div>
        </div>
      </section>
    );
  }

  function renderContent() {
    switch (activeTab) {
      case "profile":
        return renderProfile();

      case "launchpad":
        return renderLaunchpad();

      case "leaderboard":
        return renderLeaderboard();

      case "rewards":
        return renderRewards();

      case "settings":
        return renderSettings();

      case "rooms":
      default:
        return renderRooms();
    }
  }

  if (isLoading) {
    return (
      <div className="splash-screen">
        <div className="splash-logo">
          <img src={BULL_LOGO_URL} alt="Bull Protocol" />
        </div>

        <div className="splash-title">
          BULL<span>PROTOCOL</span>
        </div>

        <div className="splash-loader">
          <div />
        </div>

        <p>INITIALIZING TRADING TERMINAL...</p>
      </div>
    );
  }

  return (
    <div className="app-shell">
      {notification && (
        <div className="notification">
          <span className="notification-dot" />
          {notification}
        </div>
      )}

      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">
            <img src={BULL_LOGO_URL} alt="Bull Protocol" />
          </div>

          <div>
            <div className="brand-name">
              BULL<span>PROTOCOL</span>
            </div>

            <div className="brand-subtitle">
              HIGH-YIELD MOMENTUM TERMINAL
            </div>
          </div>
        </div>

        <div className="topbar-actions">
          <div className="network-pill">
            <span className="status-dot" />
            NETWORK ACTIVE
          </div>

          {connected && (
            <div className="balance-pill">
              {balance !== null ? balance.toFixed(4) : "0.0000"} SOL
            </div>
          )}

          <WalletMultiButton className="wallet-button" />
        </div>
      </header>

      <div className="terminal-layout">
        <aside className="sidebar">
          <div className="sidebar-title">NAVIGATION</div>

          <nav>
            {navigationItems.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`nav-item ${
                  activeTab === item.id ? "active" : ""
                }`}
                onClick={() => handleNavigation(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>

                {item.id === "rooms" && (
                  <span className="nav-live">LIVE</span>
                )}
              </button>
            ))}
          </nav>

          <div className="sidebar-footer">
            <div className="protocol-card">
              <span className="protocol-indicator" />
              <div>
                <strong>PROTOCOL ONLINE</strong>
                <span>All systems operational</span>
              </div>
            </div>
          </div>
        </aside>

        <main className="main-content">{renderContent()}</main>
      </div>

      <footer className="terminal-footer">
        <span>© 2026 BULL PROTOCOL</span>
        <span>NON-CUSTODIAL TRADING TERMINAL</span>
        <span>ALL SYSTEMS OPERATIONAL</span>
      </footer>
    </div>
  );
}

export default function App() {
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );

  return (
    <ConnectionProvider endpoint={ENDPOINT}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Terminal />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
