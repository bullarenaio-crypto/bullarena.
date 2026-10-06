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
  {
    id: "rooms",
    label: "ROOMS",
    description: "Live battles",
    icon: "⚔",
  },
  {
    id: "profile",
    label: "MY PROFILE",
    description: "Wallet & history",
    icon: "♟",
  },
  {
    id: "launchpad",
    label: "LAUNCHPAD",
    description: "Launch new projects",
    icon: "◆",
  },
  {
    id: "leaderboard",
    label: "LEADERBOARD",
    description: "Top traders",
    icon: "♛",
  },
  {
    id: "rewards",
    label: "REWARDS",
    description: "XP & achievements",
    icon: "✦",
  },
  {
    id: "settings",
    label: "SETTINGS",
    description: "Preferences",
    icon: "⚙",
  },
];

const participants = [
  { name: "ShibaTeam_99", side: "SHIBA", time: "1m" },
  { name: "DogeWolf_78", side: "DOGE", time: "2m" },
  { name: "CryptoLion", side: "SHIBA", time: "3m" },
  { name: "TraderAlpha", side: "DOGE", time: "4m" },
  { name: "BullMatrix", side: "SHIBA", time: "5m" },
];

const leaderboardPlayers = [
  { rank: "01", name: "BullMaster", wins: 128, xp: "12,840 XP" },
  { rank: "02", name: "MomentumKing", wins: 114, xp: "11,420 XP" },
  { rank: "03", name: "ArenaWolf", wins: 106, xp: "10,885 XP" },
  { rank: "04", name: "MarketBull", wins: 97, xp: "9,740 XP" },
  { rank: "05", name: "AlphaTrader", wins: 89, xp: "8,920 XP" },
];

function Terminal() {
  const { connection } = useConnection();
  const { publicKey, connected, disconnect } = useWallet();

  const [activeTab, setActiveTab] = useState("rooms");
  const [balance, setBalance] = useState(null);
  const [timeLeft, setTimeLeft] = useState(14 * 60 + 38);
  const [selectedSide, setSelectedSide] = useState(null);
  const [notification, setNotification] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [chartFilter, setChartFilter] = useState("TOTAL");

  const shortAddress = publicKey
    ? `${publicKey.toString().slice(0, 4)}...${publicKey
        .toString()
        .slice(-4)}`
    : "NOT CONNECTED";

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTimeLeft((current) => (current > 0 ? current - 1 : 30 * 60));
    }, 1000);

    return () => window.clearInterval(interval);
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

    const timeout = window.setTimeout(() => {
      setNotification("");
    }, 3500);

    return () => window.clearTimeout(timeout);
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

  function handleSideSelection(side) {
    setSelectedSide(side);
    setNotification(`${side} selected for this room.`);
  }

  function handleEnterRoom() {
    if (!connected) {
      setNotification("Connect your wallet before entering the room.");
      return;
    }

    if (!selectedSide) {
      setNotification("Choose SHIBA or DOGE before entering the room.");
      return;
    }

    setNotification(
      `${selectedSide} selected. Entry execution will be enabled when the arena contract is connected.`
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

  function renderMomentumChart() {
    return (
      <div className="chart-panel">
        <div className="panel-heading chart-heading">
          <div>
            <span className="panel-kicker">LIVE MARKET FEED</span>
            <h3>VOLUME ON DEX <small>(LAST 30 MIN)</small></h3>
          </div>

          <div className="chart-filters">
            {["TOTAL", "SHIBA", "DOGE"].map((filter) => (
              <button
                key={filter}
                type="button"
                className={chartFilter === filter ? "active" : ""}
                onClick={() => setChartFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className={`volume-chart filter-${chartFilter.toLowerCase()}`}>
          <div className="chart-grid-lines">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>

          <div className="chart-y-axis">
            <span>25M</span>
            <span>20M</span>
            <span>15M</span>
            <span>10M</span>
            <span>5M</span>
            <span>0</span>
          </div>

          <svg
            className="volume-lines"
            viewBox="0 0 1000 300"
            preserveAspectRatio="none"
            aria-label="SHIBA and DOGE market volume chart"
          >
            <defs>
              <linearGradient
                id="shibaArea"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#ef48ff" stopOpacity="0.34" />
                <stop offset="100%" stopColor="#ef48ff" stopOpacity="0" />
              </linearGradient>

              <linearGradient
                id="dogeArea"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#1ee8ff" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#1ee8ff" stopOpacity="0" />
              </linearGradient>
            </defs>

            <path
              className="chart-area shiba-area"
              d="M0,228
                 C70,210 100,196 145,202
                 C195,208 230,165 285,177
                 C345,190 365,151 420,159
                 C480,168 515,128 570,144
                 C630,163 670,120 725,132
                 C785,145 825,99 880,113
                 C930,126 970,76 1000,88
                 L1000,300 L0,300 Z"
              fill="url(#shibaArea)"
            />

            <path
              className="chart-area doge-area"
              d="M0,260
                 C55,270 95,218 150,229
                 C210,242 245,199 300,210
                 C360,223 400,177 455,191
                 C515,205 550,166 610,179
                 C675,194 710,145 765,161
                 C825,178 865,137 915,146
                 C955,154 980,119 1000,126
                 L1000,300 L0,300 Z"
              fill="url(#dogeArea)"
            />

            <path
              className="chart-line shiba-line"
              d="M0,228
                 C70,210 100,196 145,202
                 C195,208 230,165 285,177
                 C345,190 365,151 420,159
                 C480,168 515,128 570,144
                 C630,163 670,120 725,132
                 C785,145 825,99 880,113
                 C930,126 970,76 1000,88"
            />

            <path
              className="chart-line doge-line"
              d="M0,260
                 C55,270 95,218 150,229
                 C210,242 245,199 300,210
                 C360,223 400,177 455,191
                 C515,205 550,166 610,179
                 C675,194 710,145 765,161
                 C825,178 865,137 915,146
                 C955,154 980,119 1000,126"
            />
          </svg>

          <div className="chart-time-axis">
            <span>14:00</span>
            <span>14:05</span>
            <span>14:10</span>
            <span>14:15</span>
            <span>14:20</span>
            <span>14:25</span>
            <span>14:30</span>
          </div>

          <div className="chart-value shiba-value">12.4M</div>
          <div className="chart-value doge-value">10.8M</div>
        </div>

        <div className="chart-legend">
          <span className="legend-shiba">
            <i /> SHIBA 12.4M
          </span>

          <span className="legend-doge">
            <i /> DOGE 10.8M
          </span>

          <span className="chart-source">LIVE MARKET DATA</span>
        </div>
      </div>
    );
  }

  function renderRooms() {
    return (
      <section className="arena-page">
        <div className="arena-grid">
          <div className="arena-main-column">
            <div className="battle-hero">
              <div className="energy energy-left" />
              <div className="energy energy-right" />

              <div className="battle-side shiba-side">
                <div className="asset-orb shiba-orb">
                  <span>SH</span>
                </div>

                <div className="side-stats">
                  <span>SHIBA SIDE</span>
                  <strong>50 PARTICIPANTS</strong>
                  <small>VOLUME DEX: 12.4M USDT</small>
                </div>
              </div>

              <div className="battle-center">
                <div className="active-room-badge">
                  <span className="status-dot" />
                  ACTIVE ROOM
                </div>

                <h1>
                  SHIBA <span>VS</span> DOGE
                </h1>

                <p>30 MINUTES • 100 PARTICIPANTS</p>

                <div className="hero-timer">
                  <span>TIME REMAINING</span>
                  <strong>{formattedTime}</strong>
                </div>
              </div>

              <div className="battle-side doge-side">
                <div className="asset-orb doge-orb">
                  <span>DG</span>
                </div>

                <div className="side-stats">
                  <span>DOGE SIDE</span>
                  <strong>50 PARTICIPANTS</strong>
                  <small>VOLUME DEX: 10.8M USDT</small>
                </div>
              </div>
            </div>

            {renderMomentumChart()}

            <div className="arena-information-grid">
              <div className="arena-panel how-it-works">
                <div className="panel-heading">
                  <div>
                    <span className="panel-kicker">ARENA GUIDE</span>
                    <h3>HOW IT WORKS</h3>
                  </div>
                </div>

                <div className="steps-list">
                  <div>
                    <span>01</span>
                    <p>
                      <strong>Choose a side</strong>
                      Select SHIBA or DOGE.
                    </p>
                  </div>

                  <div>
                    <span>02</span>
                    <p>
                      <strong>Enter the room</strong>
                      Join before the active round closes.
                    </p>
                  </div>

                  <div>
                    <span>03</span>
                    <p>
                      <strong>Track the market</strong>
                      Follow live volume throughout the round.
                    </p>
                  </div>
                </div>

                <div className="winner-rule">
                  <span>!</span>
                  <p>
                    <strong>WIN CONDITION</strong>
                    The side with the stronger qualifying market performance
                    wins the round.
                  </p>
                </div>
              </div>

              <div className="arena-panel room-statistics">
                <div className="panel-heading">
                  <div>
                    <span className="panel-kicker">LIVE COMPARISON</span>
                    <h3>ROOM STATISTICS</h3>
                  </div>
                </div>

                <div className="statistics-assets">
                  <button
                    type="button"
                    className={`stat-asset shiba-stat ${
                      selectedSide === "SHIBA" ? "selected" : ""
                    }`}
                    onClick={() => handleSideSelection("SHIBA")}
                  >
                    <span className="mini-orb">SH</span>

                    <span>
                      <strong>SHIBA</strong>
                      <small>50 participants</small>
                    </span>

                    <b>12.4M USDT</b>
                  </button>

                  <div className="statistics-vs">VS</div>

                  <button
                    type="button"
                    className={`stat-asset doge-stat ${
                      selectedSide === "DOGE" ? "selected" : ""
                    }`}
                    onClick={() => handleSideSelection("DOGE")}
                  >
                    <span className="mini-orb">DG</span>

                    <span>
                      <strong>DOGE</strong>
                      <small>50 participants</small>
                    </span>

                    <b>10.8M USDT</b>
                  </button>
                </div>

                <div className="volume-comparison">
                  <div className="comparison-labels">
                    <span>VOLUME DIFFERENCE</span>
                    <strong>1.6M USDT</strong>
                  </div>

                  <div className="comparison-track">
                    <div className="comparison-shiba" />
                    <div className="comparison-doge" />
                  </div>

                  <div className="comparison-note">
                    SHIBA currently leads the live volume comparison.
                  </div>
                </div>
              </div>
            </div>

            <div className="arena-process">
              <div>
                <span className="process-icon">◆</span>
                <p>
                  <strong>ENTER THE ROOM</strong>
                  Join the live battle.
                </p>
              </div>

              <span className="process-arrow">›</span>

              <div>
                <span className="process-icon">◎</span>
                <p>
                  <strong>PLACE YOUR STRATEGY</strong>
                  Choose your market side.
                </p>
              </div>

              <span className="process-arrow">›</span>

              <div>
                <span className="process-icon">♛</span>
                <p>
                  <strong>TAKE THE VICTORY</strong>
                  Follow the final result.
                </p>
              </div>
            </div>
          </div>

          <aside className="room-sidebar">
            <div className="room-status-card">
              <div className="room-card-topline">
                <span>ROOM #4827</span>
                <b>
                  <i className="status-dot" />
                  IN PROGRESS
                </b>
              </div>

              <h2>SHIBA VS DOGE</h2>
              <p>Battle for the strongest qualifying market performance.</p>

              <div className="room-details">
                <div>
                  <span>◷</span>
                  <p>
                    <small>DURATION</small>
                    <strong>30 minutes</strong>
                  </p>
                </div>

                <div>
                  <span>♟</span>
                  <p>
                    <small>CAPACITY</small>
                    <strong>100 / 100</strong>
                  </p>
                </div>

                <div>
                  <span>◆</span>
                  <p>
                    <small>STATUS</small>
                    <strong>Live round</strong>
                  </p>
                </div>
              </div>

              <div className="side-selector">
                <button
                  type="button"
                  className={selectedSide === "SHIBA" ? "selected shiba" : ""}
                  onClick={() => handleSideSelection("SHIBA")}
                >
                  SHIBA
                </button>

                <button
                  type="button"
                  className={selectedSide === "DOGE" ? "selected doge" : ""}
                  onClick={() => handleSideSelection("DOGE")}
                >
                  DOGE
                </button>
              </div>

              <button
                type="button"
                className="enter-room-button"
                onClick={handleEnterRoom}
              >
                ENTER ROOM
                <span>→</span>
              </button>
            </div>

            <div className="participants-panel">
              <div className="participants-heading">
                <div>
                  <span className="panel-kicker">LIVE ROOM</span>
                  <h3>PARTICIPANTS (100)</h3>
                </div>

                <span className="live-pulse">LIVE</span>
              </div>

              <div className="participant-summary">
                <div className="shiba-summary">
                  <span>SH</span>
                  <p>
                    <small>SHIBA</small>
                    <strong>50</strong>
                  </p>
                </div>

                <div className="doge-summary">
                  <span>DG</span>
                  <p>
                    <small>DOGE</small>
                    <strong>50</strong>
                  </p>
                </div>
              </div>

              <div className="participant-list">
                {participants.map((participant, index) => (
                  <div className="participant-row" key={participant.name}>
                    <span
                      className={`participant-avatar ${participant.side.toLowerCase()}`}
                    >
                      {index + 1}
                    </span>

                    <p>
                      <strong>{participant.name}</strong>
                      <small>
                        Joined the {participant.side.toLowerCase()} side
                      </small>
                    </p>

                    <time>{participant.time}</time>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="view-participants"
                onClick={() =>
                  setNotification(
                    "The complete participant directory will be connected to live room data."
                  )
                }
              >
                VIEW ALL PARTICIPANTS
                <span>→</span>
              </button>
            </div>

            <div className="integrity-card">
              <img src={BULL_LOGO_URL} alt="Bull Protocol" />

              <div>
                <span>ARENA STATUS</span>
                <strong>PROTOCOL ONLINE</strong>
                <small>Live interface connected</small>
              </div>
            </div>
          </aside>
        </div>
      </section>
    );
  }

  function renderProfile() {
    return (
      <section className="dashboard-page">
        <div className="page-heading">
          <span>ACCOUNT CENTER</span>
          <h1>MY PROFILE</h1>
          <p>Manage your wallet connection and Bull Arena account.</p>
        </div>

        <div className="profile-grid">
          <div className="dashboard-card profile-primary">
            <img src={BULL_LOGO_URL} alt="Bull Protocol" />

            <span>WALLET STATUS</span>

            <h2>{connected ? "CONNECTED" : "NOT CONNECTED"}</h2>

            <p>
              {connected
                ? publicKey.toString()
                : "Connect your wallet to access your arena profile."}
            </p>

            {connected && (
              <button
                type="button"
                className="secondary-action"
                onClick={handleDisconnect}
              >
                DISCONNECT WALLET
              </button>
            )}
          </div>

          <div className="dashboard-card metric-card">
            <span>WALLET BALANCE</span>
            <strong>
              {balance !== null ? balance.toFixed(4) : "0.0000"}
            </strong>
            <small>Connected wallet balance</small>
          </div>

          <div className="dashboard-card metric-card">
            <span>BATTLE XP</span>
            <strong>0</strong>
            <small>Arena experience</small>
          </div>

          <div className="dashboard-card metric-card">
            <span>VICTORIES</span>
            <strong>0</strong>
            <small>Completed winning rounds</small>
          </div>
        </div>
      </section>
    );
  }

  function renderLaunchpad() {
    return (
      <section className="dashboard-page">
        <div className="page-heading">
          <span>BULL ECOSYSTEM</span>
          <h1>LAUNCHPAD</h1>
          <p>
            Discover projects preparing to enter the Bull ecosystem.
          </p>
        </div>

        <div className="launch-grid">
          <article className="dashboard-card launch-project featured-project">
            <div className="project-status live">ECOSYSTEM</div>
            <img src={BULL_LOGO_URL} alt="Bull Protocol" />
            <h2>BULL PROTOCOL</h2>
            <p>
              The competitive momentum ecosystem powering the Bull Arena
              experience.
            </p>

            <button
              type="button"
              className="secondary-action"
              onClick={() =>
                setNotification("Bull Protocol is the active ecosystem.")
              }
            >
              VIEW PROJECT
            </button>
          </article>

          <article className="dashboard-card launch-project">
            <div className="project-status">UPCOMING</div>
            <div className="project-placeholder">01</div>
            <h2>NEXT LAUNCH</h2>
            <p>
              Verified upcoming projects will appear here when launch data is
              available.
            </p>

            <button
              type="button"
              className="secondary-action"
              onClick={() =>
                setNotification("No additional launch is available yet.")
              }
            >
              COMING SOON
            </button>
          </article>
        </div>
      </section>
    );
  }

  function renderLeaderboard() {
    return (
      <section className="dashboard-page">
        <div className="page-heading">
          <span>COMPETITIVE RANKING</span>
          <h1>LEADERBOARD</h1>
          <p>Top Bull Arena competitors and their current performance.</p>
        </div>

        <div className="dashboard-card leaderboard-table">
          {leaderboardPlayers.map((player) => (
            <div className="leaderboard-entry" key={player.rank}>
              <span className="leaderboard-rank">#{player.rank}</span>
              <span className="leaderboard-avatar">
                {player.name.charAt(0)}
              </span>

              <p>
                <strong>{player.name}</strong>
                <small>{player.wins} victories</small>
              </p>

              <b>{player.xp}</b>
            </div>
          ))}
        </div>
      </section>
    );
  }

  function renderRewards() {
    return (
      <section className="dashboard-page">
        <div className="page-heading">
          <span>PROGRESSION SYSTEM</span>
          <h1>REWARDS</h1>
          <p>Track arena progression, achievements, and future rewards.</p>
        </div>

        <div className="rewards-grid">
          <div className="dashboard-card reward-box">
            <span className="reward-symbol">✦</span>
            <small>BATTLE XP</small>
            <strong>0 XP</strong>
            <p>Earn experience through eligible arena activity.</p>
          </div>

          <div className="dashboard-card reward-box">
            <span className="reward-symbol">♛</span>
            <small>CURRENT RANK</small>
            <strong>ROOKIE</strong>
            <p>Progress through the Bull Arena competitive ranks.</p>
          </div>

          <div className="dashboard-card reward-box">
            <span className="reward-symbol">◆</span>
            <small>CLAIMABLE</small>
            <strong>LOCKED</strong>
            <p>Eligible rewards will become available here.</p>
          </div>
        </div>
      </section>
    );
  }

  function renderSettings() {
    return (
      <section className="dashboard-page">
        <div className="page-heading">
          <span>TERMINAL CONTROL</span>
          <h1>SETTINGS</h1>
          <p>Review your Bull Arena terminal configuration.</p>
        </div>

        <div className="dashboard-card settings-panel">
          <div className="settings-row">
            <p>
              <strong>NETWORK STATUS</strong>
              <small>Primary wallet network connection</small>
            </p>

            <span className="online-setting">
              <i className="status-dot" />
              ACTIVE
            </span>
          </div>

          <div className="settings-row">
            <p>
              <strong>WALLET</strong>
              <small>{shortAddress}</small>
            </p>

            <span>{connected ? "CONNECTED" : "DISCONNECTED"}</span>
          </div>

          <div className="settings-row">
            <p>
              <strong>INTERFACE LANGUAGE</strong>
              <small>United States English</small>
            </p>

            <span>EN-US</span>
          </div>

          <div className="settings-row">
            <p>
              <strong>ARENA INTERFACE</strong>
              <small>Professional trading terminal mode</small>
            </p>

            <span>ENABLED</span>
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
        <div className="splash-emblem">
          <img src={BULL_LOGO_URL} alt="Bull Protocol" />
        </div>

        <div className="splash-brand">
          BULL <span>PROTOCOL</span>
        </div>

        <p>MOMENTUM TRADING TERMINAL</p>

        <div className="splash-progress">
          <span />
        </div>

        <small>INITIALIZING ARENA SYSTEMS...</small>
      </div>
    );
  }

  return (
    <div className="terminal-shell">
      {notification && (
        <div className="terminal-notification">
          <span className="status-dot" />
          {notification}
        </div>
      )}

      <header className="terminal-header">
        <button
          type="button"
          className="terminal-brand"
          onClick={() => handleNavigation("rooms")}
        >
          <img src={BULL_LOGO_URL} alt="Bull Protocol" />

          <div>
            <strong>
              BULL <span>PROTOCOL</span>
            </strong>
            <small>MOMENTUM TRADING TERMINAL</small>
          </div>
        </button>

        <div className="header-market-labels">
          <span>TRADES</span>
          <span>POOLS</span>
          <span>REAL MARKET</span>
        </div>

        <div className="header-actions">
          <div className="online-pill">
            <span className="status-dot" />
            ONLINE
          </div>

          {connected && (
            <div className="wallet-balance">
              {balance !== null ? balance.toFixed(4) : "0.0000"} SOL
            </div>
          )}

          <WalletMultiButton className="wallet-button" />
        </div>
      </header>

      <div className="terminal-body">
        <aside className="main-sidebar">
          <nav className="terminal-navigation">
            {navigationItems.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`navigation-button ${
                  activeTab === item.id ? "active" : ""
                }`}
                onClick={() => handleNavigation(item.id)}
              >
                <span className="navigation-icon">{item.icon}</span>

                <span className="navigation-copy">
                  <strong>{item.label}</strong>
                  <small>{item.description}</small>
                </span>

                {item.id === "rooms" && (
                  <span className="navigation-live">LIVE</span>
                )}
              </button>
            ))}
          </nav>

          <div className="momentum-card">
            <img src={BULL_LOGO_URL} alt="" />

            <span>MORE MOMENTUM</span>
            <strong>LESS EMOTION</strong>

            <p>
              Every round has a defined market window. Follow the data and
              execute with discipline.
            </p>

            <button
              type="button"
              onClick={() => handleNavigation("rooms")}
            >
              HOW IT WORKS
            </button>
          </div>

          <div className="sidebar-system">
            <span className="status-dot" />

            <p>
              <strong>BULL PROTOCOL</strong>
              <small>SYSTEMS OPERATIONAL</small>
            </p>
          </div>
        </aside>

        <main className="terminal-content">{renderContent()}</main>
      </div>

      <footer className="terminal-footer">
        <span>© 2026 BULL PROTOCOL</span>
        <span>MOMENTUM WINS</span>
        <span>ARENA SYSTEM ONLINE</span>
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
