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

const PROTOCOL_FEE_PERCENT = 1.5;
const WINNER_POOL_PERCENT = 98.5;

const navigationItems = [
  {
    id: "rooms",
    label: "ROOMS",
    subtitle: "Join battles",
    icon: "⚔",
  },
  {
    id: "profile",
    label: "MY PROFILE",
    subtitle: "Wallet & history",
    icon: "♙",
  },
  {
    id: "launchpad",
    label: "LAUNCHPAD",
    subtitle: "Launch new projects",
    icon: "◇",
  },
  {
    id: "leaderboard",
    label: "LEADERBOARD",
    subtitle: "Top traders",
    icon: "♜",
  },
  {
    id: "rewards",
    label: "REWARDS",
    subtitle: "XP & achievements",
    icon: "✧",
  },
  {
    id: "settings",
    label: "SETTINGS",
    subtitle: "Preferences",
    icon: "⚙",
  },
];

const participants = [
  { name: "ShibaTeam_97", side: "SHIBA", time: "2 min" },
  { name: "DogeWolf_72", side: "DOGE", time: "2 min" },
  { name: "CryptoLuna", side: "SHIBA", time: "3 min" },
  { name: "TraderAlpha", side: "DOGE", time: "4 min" },
  { name: "SolMaster", side: "SHIBA", time: "5 min" },
];

function ArenaTerminal() {
  const { connection } = useConnection();
  const { publicKey, connected, disconnect } = useWallet();

  const [activeTab, setActiveTab] = useState("rooms");
  const [balance, setBalance] = useState(null);
  const [timeLeft, setTimeLeft] = useState(28 * 60 + 17);
  const [selectedSide, setSelectedSide] = useState(null);
  const [notification, setNotification] = useState("");
  const [chartMode, setChartMode] = useState("TOTAL");
  const [isLoading, setIsLoading] = useState(true);

  const shortAddress = publicKey
    ? `${publicKey.toString().slice(0, 4)}...${publicKey
        .toString()
        .slice(-4)}`
    : "Not Connected";

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoading(false);
    }, 900);

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
    if (!notification) return undefined;

    const timer = window.setTimeout(() => {
      setNotification("");
    }, 3500);

    return () => window.clearTimeout(timer);
  }, [notification]);

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  }, [timeLeft]);

  function navigateTo(tab) {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function selectSide(side) {
    if (!connected) {
      setNotification("Connect your wallet before choosing a side.");
      return;
    }

    setSelectedSide(side);
    setNotification(`${side} selected for this battle.`);
  }

  function enterRoom() {
    if (!connected) {
      setNotification("Connect your wallet before entering the room.");
      return;
    }

    if (!selectedSide) {
      setNotification("Choose SHIBA or DOGE before entering the room.");
      return;
    }

    setNotification(
      `${selectedSide} selected. Battle entry will be enabled when settlement is connected.`
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

  function renderArena() {
    return (
      <section className="arena-page">
        <div className="arena-main-column">
          <section className="battle-hero">
            <div className="energy energy-shiba" />
            <div className="energy energy-doge" />

            <button
              type="button"
              className={`hero-team hero-team-shiba ${
                selectedSide === "SHIBA" ? "selected" : ""
              }`}
              onClick={() => selectSide("SHIBA")}
            >
              <div className="team-orbit shiba-orbit">
                <div className="team-avatar">SH</div>
              </div>

              <div className="hero-side-data">
                <strong>SHIBA SIDE</strong>
                <span>50 PARTICIPANTS</span>
                <small>VOLUME DEX: 12.4M USDT</small>
              </div>
            </button>

            <div className="battle-center">
              <span className="active-room-badge">● ACTIVE ROOM</span>

              <h1>
                SHIBA <span>VS</span> DOGE
              </h1>

              <p>30 MINUTES • 100 PARTICIPANTS</p>

              <div className="timer-frame">
                <span>TIME REMAINING</span>
                <strong>{formattedTime}</strong>
              </div>
            </div>

            <button
              type="button"
              className={`hero-team hero-team-doge ${
                selectedSide === "DOGE" ? "selected" : ""
              }`}
              onClick={() => selectSide("DOGE")}
            >
              <div className="team-orbit doge-orbit">
                <div className="team-avatar">DG</div>
              </div>

              <div className="hero-side-data">
                <strong>DOGE SIDE</strong>
                <span>50 PARTICIPANTS</span>
                <small>VOLUME DEX: 10.8M USDT</small>
              </div>
            </button>
          </section>

          <section className="volume-panel">
            <div className="panel-heading">
              <div>
                <span className="panel-icon">⌁</span>
                <strong>VOLUME ON DEX</strong>
                <small>(LAST 30 MIN)</small>
              </div>

              <div className="chart-tabs">
                {["TOTAL", "SHIBA", "DOGE"].map((mode) => (
                  <button
                    type="button"
                    key={mode}
                    className={chartMode === mode ? "active" : ""}
                    onClick={() => setChartMode(mode)}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="chart-area">
              <div className="chart-grid" />

              <div className="chart-y-axis">
                <span>25M</span>
                <span>20M</span>
                <span>15M</span>
                <span>10M</span>
                <span>5M</span>
                <span>0</span>
              </div>

              <svg
                className="volume-chart"
                viewBox="0 0 900 270"
                preserveAspectRatio="none"
                aria-label="Battle volume chart"
              >
                <defs>
                  <linearGradient
                    id="shibaArea"
                    x1="0"
                    x2="0"
                    y1="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#ff26f8"
                      stopOpacity="0.38"
                    />
                    <stop
                      offset="100%"
                      stopColor="#ff26f8"
                      stopOpacity="0"
                    />
                  </linearGradient>

                  <linearGradient
                    id="dogeArea"
                    x1="0"
                    x2="0"
                    y1="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#00f5ff"
                      stopOpacity="0.35"
                    />
                    <stop
                      offset="100%"
                      stopColor="#00f5ff"
                      stopOpacity="0"
                    />
                  </linearGradient>

                  <filter id="pinkGlow">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  <filter id="cyanGlow">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <path
                  d="M0,190
                     C45,178 80,165 120,158
                     C160,150 190,125 230,142
                     C275,160 310,148 350,153
                     C395,158 430,170 470,162
                     C515,153 545,169 585,151
                     C625,133 660,151 700,139
                     C745,126 780,139 815,119
                     C850,98 875,118 900,92
                     L900,270 L0,270 Z"
                  fill="url(#shibaArea)"
                />

                <path
                  d="M0,190
                     C45,178 80,165 120,158
                     C160,150 190,125 230,142
                     C275,160 310,148 350,153
                     C395,158 430,170 470,162
                     C515,153 545,169 585,151
                     C625,133 660,151 700,139
                     C745,126 780,139 815,119
                     C850,98 875,118 900,92"
                  fill="none"
                  stroke="#ff26f8"
                  strokeWidth="4"
                  filter="url(#pinkGlow)"
                />

                <path
                  d="M0,230
                     C45,210 80,220 120,205
                     C165,190 195,207 235,194
                     C280,180 315,190 355,175
                     C400,160 435,178 475,151
                     C515,123 545,160 585,139
                     C625,118 660,145 700,124
                     C745,102 775,133 815,101
                     C850,72 875,105 900,75
                     L900,270 L0,270 Z"
                  fill="url(#dogeArea)"
                />

                <path
                  d="M0,230
                     C45,210 80,220 120,205
                     C165,190 195,207 235,194
                     C280,180 315,190 355,175
                     C400,160 435,178 475,151
                     C515,123 545,160 585,139
                     C625,118 660,145 700,124
                     C745,102 775,133 815,101
                     C850,72 875,105 900,75"
                  fill="none"
                  stroke="#00f5ff"
                  strokeWidth="4"
                  filter="url(#cyanGlow)"
                />
              </svg>

              <div className="chart-times">
                <span>14:05</span>
                <span>14:10</span>
                <span>14:15</span>
                <span>14:20</span>
                <span>14:25</span>
                <span>14:30</span>
              </div>

              <div className="chart-values">
                <span className="doge-value">10.8M</span>
                <span className="shiba-value">12.4M</span>
              </div>
            </div>

            <div className="chart-legend">
              <span>
                <i className="legend-shiba" /> SHIBA (12.4M)
              </span>

              <span>
                <i className="legend-doge" /> DOGE (10.8M)
              </span>

              <small>LIVE MARKET FEED</small>
            </div>
          </section>

          <div className="arena-information-grid">
            <section className="how-panel terminal-panel">
              <h2>HOW IT WORKS?</h2>

              <div className="instruction">
                <span>1</span>
                <div>
                  <strong>Choose a side</strong>
                  <small>SHIBA or DOGE.</small>
                </div>
              </div>

              <div className="instruction">
                <span>2</span>
                <div>
                  <strong>Enter the room</strong>
                  <small>Join the active participant pool.</small>
                </div>
              </div>

              <div className="instruction">
                <span>3</span>
                <div>
                  <strong>Follow the volume</strong>
                  <small>
                    The side with the strongest qualifying market volume wins.
                  </small>
                </div>
              </div>

              <div className="risk-note">
                <strong>!</strong>
                <span>
                  Markets involve risk. Only participate with funds you can
                  afford to lose.
                </span>
              </div>
            </section>

            <section className="statistics-panel terminal-panel">
              <h2>ROOM STATISTICS</h2>

              <div className="statistics-teams">
                <div className="statistics-team shiba-stat">
                  <div className="mini-token">SH</div>
                  <div>
                    <strong>SHIBA</strong>
                    <span>50 participants</span>
                  </div>
                </div>

                <div className="statistics-team doge-stat">
                  <div className="mini-token">DG</div>
                  <div>
                    <strong>DOGE</strong>
                    <span>50 participants</span>
                  </div>
                </div>
              </div>

              <div className="statistics-volume">
                <div>
                  <span>Current Volume (30m)</span>
                  <strong>12.4M USDT</strong>
                </div>

                <div>
                  <span>Current Volume (30m)</span>
                  <strong>10.8M USDT</strong>
                </div>
              </div>

              <div className="volume-difference">
                <span>Volume Difference</span>

                <div className="difference-track">
                  <div className="difference-shiba" />
                  <div className="difference-doge" />
                </div>

                <strong>1.6M USDT</strong>
              </div>

              <div className="payout-policy">
                <span>WINNER DISTRIBUTION</span>
                <strong>{WINNER_POOL_PERCENT}%</strong>

                <span>PROTOCOL FEE</span>
                <strong>{PROTOCOL_FEE_PERCENT}%</strong>
              </div>
            </section>
          </div>

          <section className="battle-process">
            <div>
              <span className="process-icon">ϟ</span>
              <p>
                <strong>ENTER THE ROOM</strong>
                <small>Choose your side and join the battle.</small>
              </p>
              <b>›</b>
            </div>

            <div>
              <span className="process-icon">◎</span>
              <p>
                <strong>PLACE YOUR STRATEGY</strong>
                <small>Follow the market momentum.</small>
              </p>
              <b>›</b>
            </div>

            <div>
              <span className="process-icon">♜</span>
              <p>
                <strong>TAKE THE VICTORY</strong>
                <small>The winning side receives 98.5% of the prize pool.</small>
              </p>
            </div>
          </section>
        </div>

        <aside className="arena-right-column">
          <section className="room-card terminal-panel">
            <div className="room-card-top">
              <span>ROOM #4827</span>
              <strong>● IN PROGRESS</strong>
            </div>

            <h2>SHIBA VS DOGE</h2>
            <p>Battle for the strongest qualifying market volume.</p>

            <div className="room-details">
              <div>
                <span>◷</span>
                <p>
                  <small>Duration</small>
                  <strong>30 minutes</strong>
                </p>
              </div>

              <div>
                <span>♙</span>
                <p>
                  <small>Participants</small>
                  <strong>100 / 100</strong>
                </p>
              </div>

              <div>
                <span>◇</span>
                <p>
                  <small>Protocol Fee</small>
                  <strong>1.5%</strong>
                </p>
              </div>

              <div>
                <span>↺</span>
                <p>
                  <small>One-Sided Round</small>
                  <strong>Full Refund</strong>
                </p>
              </div>
            </div>

            <div className="side-selector">
              <button
                type="button"
                className={selectedSide === "SHIBA" ? "active shiba" : ""}
                onClick={() => selectSide("SHIBA")}
              >
                SHIBA
              </button>

              <button
                type="button"
                className={selectedSide === "DOGE" ? "active doge" : ""}
                onClick={() => selectSide("DOGE")}
              >
                DOGE
              </button>
            </div>

            <button
              type="button"
              className="enter-room-button"
              onClick={enterRoom}
            >
              ENTER ROOM <span>→</span>
            </button>
          </section>

          <section className="participants-panel terminal-panel">
            <div className="participants-heading">
              <h2>PARTICIPANTS (100)</h2>
              <span>LIVE</span>
            </div>

            <div className="participant-summary">
              <div className="participant-team shiba-summary">
                <span className="mini-token">SH</span>
                <p>
                  <small>SHIBA</small>
                  <strong>50</strong>
                </p>
              </div>

              <div className="participant-team doge-summary">
                <span className="mini-token">DG</span>
                <p>
                  <small>DOGE</small>
                  <strong>50</strong>
                </p>
              </div>
            </div>

            <div className="participant-list">
              {participants.map((participant) => (
                <div
                  className={`participant-row ${participant.side.toLowerCase()}`}
                  key={participant.name}
                >
                  <span className="participant-avatar">
                    {participant.name.charAt(0)}
                  </span>

                  <p>
                    <strong>{participant.name}</strong>
                    <small>Joined the {participant.side} side</small>
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
                  "The complete participant list will be connected to live room data."
                )
              }
            >
              View all participants (100) →
            </button>
          </section>

          <section className="right-brand-card">
            <img src={BULL_LOGO_URL} alt="Bull Protocol" />

            <div>
              <strong>BULL PROTOCOL</strong>
              <span>MOMENTUM WINS</span>
            </div>
          </section>
        </aside>
      </section>
    );
  }

  function renderProfile() {
    return (
      <section className="dashboard-page">
        <div className="dashboard-heading">
          <span>ACCOUNT CENTER</span>
          <h1>MY PROFILE</h1>
          <p>Manage your wallet and review your Bull Arena activity.</p>
        </div>

        <div className="profile-grid">
          <section className="dashboard-card profile-wallet">
            <img src={BULL_LOGO_URL} alt="Bull Protocol" />

            <span>WALLET STATUS</span>

            <h2>{connected ? "CONNECTED" : "NOT CONNECTED"}</h2>

            <p>{connected ? publicKey.toString() : "Connect your wallet to begin."}</p>

            {connected && (
              <button type="button" onClick={handleDisconnect}>
                DISCONNECT WALLET
              </button>
            )}
          </section>

          <section className="dashboard-card metric-card">
            <span>WALLET BALANCE</span>
            <strong>
              {balance !== null ? balance.toFixed(4) : "0.0000"}
            </strong>
            <small>Connected wallet balance</small>
          </section>

          <section className="dashboard-card metric-card">
            <span>BATTLE XP</span>
            <strong>0</strong>
            <small>Competitive experience</small>
          </section>
        </div>
      </section>
    );
  }

  function renderLaunchpad() {
    return (
      <section className="dashboard-page">
        <div className="dashboard-heading">
          <span>BULL ECOSYSTEM</span>
          <h1>LAUNCHPAD</h1>
          <p>Discover upcoming projects inside the Bull ecosystem.</p>
        </div>

        <div className="dashboard-card coming-soon-card">
          <img src={BULL_LOGO_URL} alt="Bull Protocol" />
          <span>LAUNCHPAD</span>
          <h2>PROJECT LAUNCHES ARE COMING</h2>
          <p>
            Launch functionality will be enabled when the production launch
            infrastructure is connected.
          </p>
        </div>
      </section>
    );
  }

  function renderLeaderboard() {
    const leaders = [
      ["01", "BullMaster", "12,840 XP"],
      ["02", "MomentumKing", "11,420 XP"],
      ["03", "ArenaWolf", "10,885 XP"],
      ["04", "MarketBull", "9,740 XP"],
      ["05", "AlphaTrader", "8,920 XP"],
    ];

    return (
      <section className="dashboard-page">
        <div className="dashboard-heading">
          <span>COMPETITIVE RANKING</span>
          <h1>LEADERBOARD</h1>
          <p>Top performers across Bull Arena.</p>
        </div>

        <section className="dashboard-card leaderboard-list">
          {leaders.map(([rank, name, xp]) => (
            <div className="leader-row" key={rank}>
              <span>#{rank}</span>
              <div className="leader-avatar">{name.charAt(0)}</div>
              <p>
                <strong>{name}</strong>
                <small>Active Trader</small>
              </p>
              <b>{xp}</b>
            </div>
          ))}
        </section>
      </section>
    );
  }

  function renderRewards() {
    return (
      <section className="dashboard-page">
        <div className="dashboard-heading">
          <span>REWARD CENTER</span>
          <h1>REWARDS</h1>
          <p>Track competitive progress and available achievements.</p>
        </div>

        <div className="reward-dashboard">
          <section className="dashboard-card">
            <span>BATTLE XP</span>
            <strong>0</strong>
            <p>Earn XP through eligible arena activity.</p>
          </section>

          <section className="dashboard-card">
            <span>CURRENT RANK</span>
            <strong>ROOKIE</strong>
            <p>Compete in eligible rooms to progress.</p>
          </section>

          <section className="dashboard-card">
            <span>AVAILABLE REWARDS</span>
            <strong>LOCKED</strong>
            <p>Reward claims will appear here when available.</p>
          </section>
        </div>
      </section>
    );
  }

  function renderSettings() {
    return (
      <section className="dashboard-page">
        <div className="dashboard-heading">
          <span>TERMINAL CONTROL</span>
          <h1>SETTINGS</h1>
          <p>Manage your Bull Arena experience.</p>
        </div>

        <section className="dashboard-card settings-list">
          <div>
            <p>
              <strong>Network Status</strong>
              <small>Primary wallet network</small>
            </p>
            <span className="setting-online">● ONLINE</span>
          </div>

          <div>
            <p>
              <strong>Wallet</strong>
              <small>{connected ? shortAddress : "Not connected"}</small>
            </p>
            <span>{connected ? "CONNECTED" : "DISCONNECTED"}</span>
          </div>

          <div>
            <p>
              <strong>Interface Language</strong>
              <small>United States English</small>
            </p>
            <span>EN-US</span>
          </div>

          <div>
            <p>
              <strong>Winner Distribution</strong>
              <small>Distribution from eligible settled prize pools</small>
            </p>
            <span>98.5%</span>
          </div>

          <div>
            <p>
              <strong>Protocol Fee</strong>
              <small>Applied to eligible settled rounds</small>
            </p>
            <span>1.5%</span>
          </div>

          <div>
            <p>
              <strong>One-Sided Round Protection</strong>
              <small>No opponent-side participation</small>
            </p>
            <span>100% REFUND / ZERO FEE</span>
          </div>
        </section>
      </section>
    );
  }

  function renderCurrentPage() {
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
        return renderArena();
    }
  }

  if (isLoading) {
    return (
      <div className="bull-loading">
        <div className="loading-logo">
          <img src={BULL_LOGO_URL} alt="Bull Protocol" />
        </div>

        <h1>
          BULL <span>PROTOCOL</span>
        </h1>

        <div className="loading-track">
          <div />
        </div>

        <p>INITIALIZING MOMENTUM TERMINAL</p>
      </div>
    );
  }

  return (
    <div className="bull-app">
      {notification && (
        <div className="app-notification">
          <span>●</span>
          {notification}
        </div>
      )}

      <header className="bull-header">
        <button
          type="button"
          className="header-brand"
          onClick={() => navigateTo("rooms")}
        >
          <img src={BULL_LOGO_URL} alt="Bull Protocol" />

          <div className="header-brand-name">
            <strong>BULL</strong>
            <span>PROTOCOL</span>
          </div>
        </button>

        <div className="header-divider" />

        <div className="terminal-title">
          <strong>MOMENTUM TRADING TERMINAL</strong>

          <div>
            <span>TRADES</span>
            <span>POOLS</span>
            <span>REAL MARKET</span>
          </div>
        </div>

        <div className="header-actions">
          <div className="online-pill">
            <span>●</span>
            Online
          </div>

          <WalletMultiButton className="wallet-button" />
        </div>
      </header>

      <div className="bull-layout">
        <aside className="bull-sidebar">
          <nav>
            {navigationItems.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`sidebar-link ${
                  activeTab === item.id ? "active" : ""
                }`}
                onClick={() => navigateTo(item.id)}
              >
                <span className="sidebar-icon">{item.icon}</span>

                <span className="sidebar-copy">
                  <strong>{item.label}</strong>
                  <small>{item.subtitle}</small>
                </span>

                {item.id === "rooms" && (
                  <span className="sidebar-live">LIVE</span>
                )}
              </button>
            ))}
          </nav>

          <section className="momentum-card">
            <img src={BULL_LOGO_URL} alt="" />

            <h3>
              MORE <span>MOMENTUM,</span>
              <br />
              LESS EMOTION
            </h3>

            <p>
              Here, every move matters. The game never stops in the market for
              30 minutes, pay and play.
            </p>

            <button
              type="button"
              onClick={() =>
                setNotification(
                  "Choose a side, enter the room, and follow qualifying market volume."
                )
              }
            >
              HOW IT WORKS?
            </button>
          </section>

          <div className="sidebar-wave" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>

          <div className="powered-by">
            <small>POWERED BY</small>

            <div>
              <img src={BULL_LOGO_URL} alt="" />
              <p>
                <strong>BULL PROTOCOL</strong>
                <span>MOMENTUM WINS</span>
              </p>
            </div>
          </div>
        </aside>

        <main className="bull-content">{renderCurrentPage()}</main>
      </div>

      <footer className="bull-footer">
        <span>© 2026 BULL PROTOCOL</span>
        <span>98.5% WINNER DISTRIBUTION</span>
        <span>1.5% PROTOCOL FEE</span>
        <span>ONE-SIDED ROUND: FULL REFUND</span>
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
          <ArenaTerminal />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
