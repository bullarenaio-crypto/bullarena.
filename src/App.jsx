import React, { useEffect, useMemo, useState } from "react";
import {
  ConnectionProvider,
  WalletProvider,
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
import { clusterApiUrl } from "@solana/web3.js";

const NETWORK_ENDPOINT = clusterApiUrl("mainnet-beta");
const BULL_LOGO = "/bull-logo.png";

const SHIBA_LOGO =
  "https://s2.coinmarketcap.com/static/img/coins/64x64/5994.png";

const DOGE_LOGO =
  "https://s2.coinmarketcap.com/static/img/coins/64x64/74.png";

const participants = [
  {
    name: "ShibaStorm_23",
    side: "SHIBA",
    amount: "1.20",
    time: "2 min ago",
  },
  {
    name: "DogeKing77",
    side: "DOGE",
    amount: "0.85",
    time: "3 min ago",
  },
  {
    name: "CryptoBull",
    side: "SHIBA",
    amount: "2.10",
    time: "4 min ago",
  },
  {
    name: "MoonRunner",
    side: "DOGE",
    amount: "1.45",
    time: "5 min ago",
  },
];

function Icon({ name }) {
  const icons = {
    rooms: (
      <>
        <path d="M5 5h14v14H5z" />
        <path d="M9 9l6 6M15 9l-6 6" />
      </>
    ),
    profile: (
      <>
        <circle cx="12" cy="8" r="3" />
        <path d="M6 19c.6-3.2 2.6-5 6-5s5.4 1.8 6 5" />
      </>
    ),
    launchpad: (
      <>
        <path d="M12 3l7 7-7 11-7-11 7-7z" />
        <path d="M8 10h8" />
      </>
    ),
    leaderboard: (
      <>
        <path d="M5 19h14" />
        <path d="M7 16V9h3v7" />
        <path d="M11 16V5h3v11" />
        <path d="M15 16v-4h3v4" />
      </>
    ),
    rewards: (
      <>
        <path d="M12 3l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4-3.9-3.8 5.4-.8L12 3z" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6L7 7M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="menu-icon"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[name]}
    </svg>
  );
}

function BullMark({ small = false }) {
  return (
    <div className={`bull-mark ${small ? "bull-mark-small" : ""}`}>
      <img src={BULL_LOGO} alt="Bull Protocol" />
    </div>
  );
}

function TokenBadge({ token, size = "large" }) {
  const isShiba = token === "SHIBA";

  return (
    <div
      className={`token-badge ${
        isShiba ? "token-shiba" : "token-doge"
      } token-badge-${size}`}
    >
      <div className="token-ring token-ring-one" />
      <div className="token-ring token-ring-two" />

      <div className="token-logo-shell">
        <img
          src={isShiba ? SHIBA_LOGO : DOGE_LOGO}
          alt={isShiba ? "Shiba Inu" : "Dogecoin"}
        />
      </div>

      <span className="token-code">{isShiba ? "SH" : "DG"}</span>
    </div>
  );
}

function CountdownTimer() {
  const [seconds, setSeconds] = useState(28 * 60 + 17);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSeconds((current) => {
        if (current <= 0) {
          return 30 * 60;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");

  const remainingSeconds = (seconds % 60).toString().padStart(2, "0");

  return (
    <div className="countdown">
      <span>TIME REMAINING</span>
      <strong>
        {minutes}:{remainingSeconds}
      </strong>
    </div>
  );
}

function ArenaEnergy() {
  return (
    <svg
      className="arena-energy"
      viewBox="0 0 1000 420"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="energyMain" x1="0" x2="1">
          <stop offset="0%" stopColor="#8b3dff" />
          <stop offset="50%" stopColor="#4169ff" />
          <stop offset="100%" stopColor="#00f5ff" />
        </linearGradient>

        <filter id="energyGlow">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path
        d="M0 50 L145 105 L260 66 L390 168 L500 92 L625 176 L760 72 L1000 155"
        className="energy-line energy-line-top"
      />

      <path
        d="M0 360 L145 282 L280 346 L402 242 L500 320 L630 236 L770 350 L1000 270"
        className="energy-line energy-line-bottom"
      />

      <path
        d="M0 195 L160 176 L265 214 L390 181 L500 211 L635 170 L780 213 L1000 190"
        className="energy-line energy-line-center"
      />

      <path
        d="M150 105 L210 150 L184 177 L250 205"
        className="energy-branch"
      />

      <path
        d="M760 72 L715 135 L742 170 L680 208"
        className="energy-branch energy-branch-cyan"
      />

      <path
        d="M280 346 L330 296 L310 266 L370 230"
        className="energy-branch"
      />

      <path
        d="M770 350 L725 305 L746 266 L690 235"
        className="energy-branch energy-branch-cyan"
      />
    </svg>
  );
}

function MarketChart({ selectedChart, setSelectedChart }) {
  return (
    <section className="panel market-chart-panel">
      <div className="panel-heading chart-heading">
        <div>
          <span className="eyebrow">LIVE MARKET FEED</span>

          <h2>
            VOLUME ON DEX <small>(LAST 30 MIN)</small>
          </h2>
        </div>

        <div className="chart-tabs">
          {["TOTAL", "SHIBA", "DOGE"].map((tab) => (
            <button
              key={tab}
              type="button"
              className={selectedChart === tab ? "active" : ""}
              onClick={() => setSelectedChart(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className={`market-chart market-chart-${selectedChart.toLowerCase()}`}>
        <svg
          viewBox="0 0 1000 330"
          preserveAspectRatio="none"
          role="img"
          aria-label="Market volume preview chart"
        >
          <defs>
            <linearGradient id="shibaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff61f6" stopOpacity=".42" />
              <stop offset="100%" stopColor="#ff61f6" stopOpacity=".02" />
            </linearGradient>

            <linearGradient id="dogeFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1ce8ff" stopOpacity=".36" />
              <stop offset="100%" stopColor="#1ce8ff" stopOpacity=".02" />
            </linearGradient>

            <filter id="chartGlow">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {[45, 100, 155, 210, 265].map((y) => (
            <line
              key={`horizontal-${y}`}
              x1="65"
              y1={y}
              x2="970"
              y2={y}
              className="chart-grid-line"
            />
          ))}

          {[65, 220, 375, 530, 685, 840, 970].map((x) => (
            <line
              key={`vertical-${x}`}
              x1={x}
              y1="25"
              x2={x}
              y2="285"
              className="chart-grid-line chart-grid-vertical"
            />
          ))}

          <path
            className="chart-area shiba-area"
            d="M65 230
               C120 215 145 190 200 198
               C260 205 286 164 340 174
               C390 184 420 150 470 158
               C520 169 555 130 610 140
               C660 149 690 112 745 124
               C795 136 830 92 875 105
               C920 115 940 76 970 82
               L970 285 L65 285 Z"
            fill="url(#shibaFill)"
          />

          <path
            className="chart-area doge-area"
            d="M65 270
               C120 264 145 228 205 235
               C255 241 290 205 345 214
               C395 223 425 188 475 196
               C525 204 555 169 610 179
               C660 190 700 151 750 161
               C800 170 835 142 880 151
               C920 158 945 126 970 132
               L970 285 L65 285 Z"
            fill="url(#dogeFill)"
          />

          <path
            className="chart-line shiba-line"
            d="M65 230
               C120 215 145 190 200 198
               C260 205 286 164 340 174
               C390 184 420 150 470 158
               C520 169 555 130 610 140
               C660 149 690 112 745 124
               C795 136 830 92 875 105
               C920 115 940 76 970 82"
          />

          <path
            className="chart-line doge-line"
            d="M65 270
               C120 264 145 228 205 235
               C255 241 290 205 345 214
               C395 223 425 188 475 196
               C525 204 555 169 610 179
               C660 190 700 151 750 161
               C800 170 835 142 880 151
               C920 158 945 126 970 132"
          />

          <text x="12" y="48" className="chart-axis-label">
            25M
          </text>
          <text x="12" y="103" className="chart-axis-label">
            20M
          </text>
          <text x="12" y="158" className="chart-axis-label">
            15M
          </text>
          <text x="12" y="213" className="chart-axis-label">
            10M
          </text>
          <text x="24" y="268" className="chart-axis-label">
            5M
          </text>

          <text x="65" y="315" className="chart-time-label">
            14:05
          </text>
          <text x="235" y="315" className="chart-time-label">
            14:10
          </text>
          <text x="405" y="315" className="chart-time-label">
            14:15
          </text>
          <text x="575" y="315" className="chart-time-label">
            14:20
          </text>
          <text x="745" y="315" className="chart-time-label">
            14:25
          </text>
          <text x="925" y="315" className="chart-time-label">
            14:30
          </text>

          <g className="chart-value chart-value-shiba">
            <rect x="902" y="63" width="68" height="28" rx="3" />
            <text x="936" y="82" textAnchor="middle">
              12.4M
            </text>
          </g>

          <g className="chart-value chart-value-doge">
            <rect x="902" y="119" width="68" height="28" rx="3" />
            <text x="936" y="138" textAnchor="middle">
              10.8M
            </text>
          </g>
        </svg>

        <div className="chart-footer">
          <div className="chart-legend">
            <span>
              <i className="legend-dot shiba-dot" />
              SHIBA VOLUME
            </span>

            <span>
              <i className="legend-dot doge-dot" />
              DOGE VOLUME
            </span>
          </div>

          <span className="chart-source">MARKET DATA PREVIEW</span>
        </div>
      </div>
    </section>
  );
}

function Sidebar({ activeSection, setActiveSection }) {
  const items = [
    {
      id: "rooms",
      title: "ROOMS",
      subtitle: "Live battles",
      icon: "rooms",
      badge: "LIVE",
    },
    {
      id: "profile",
      title: "MY PROFILE",
      subtitle: "Wallet & history",
      icon: "profile",
    },
    {
      id: "launchpad",
      title: "LAUNCHPAD",
      subtitle: "Launch new projects",
      icon: "launchpad",
    },
    {
      id: "leaderboard",
      title: "LEADERBOARD",
      subtitle: "Top traders",
      icon: "leaderboard",
    },
    {
      id: "rewards",
      title: "REWARDS",
      subtitle: "XP & achievements",
      icon: "rewards",
    },
    {
      id: "settings",
      title: "SETTINGS",
      subtitle: "Preferences",
      icon: "settings",
    },
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-navigation" aria-label="Main navigation">
        {items.map((item) => (
          <button
            type="button"
            key={item.id}
            className={`sidebar-item ${
              activeSection === item.id ? "active" : ""
            }`}
            onClick={() => setActiveSection(item.id)}
          >
            <span className="sidebar-icon-shell">
              <Icon name={item.icon} />
            </span>

            <span className="sidebar-copy">
              <strong>{item.title}</strong>
              <small>{item.subtitle}</small>
            </span>

            {item.badge && (
              <span className="sidebar-badge">{item.badge}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="momentum-card">
        <div className="momentum-card-glow" />

        <BullMark small />

        <h3>
          MORE MOMENTUM,
          <br />
          LESS EMOTION
        </h3>

        <p>
          Every room has a defined market window. Follow the data, choose your
          side and compete with discipline.
        </p>

        <button
          type="button"
          onClick={() => setActiveSection("rooms")}
          className="text-link"
        >
          HOW IT WORKS?
        </button>
      </div>

      <div className="terrain-visual" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="sidebar-brand-bottom">
        <BullMark small />

        <div>
          <strong>BULL PROTOCOL</strong>
          <span>MOMENTUM WINS</span>
        </div>
      </div>
    </aside>
  );
}

function ArenaHero() {
  return (
    <section className="arena-hero panel">
      <ArenaEnergy />

      <div className="arena-grid-overlay" />

      <div className="arena-side arena-side-shiba">
        <TokenBadge token="SHIBA" />

        <div className="side-stat-card">
          <span>SHIBA SIDE</span>
          <strong>50 PARTICIPANTS</strong>
          <small>VOLUME DEX: 12.4M USDT</small>
        </div>
      </div>

      <div className="arena-center">
        <span className="active-room-badge">
          <i />
          ACTIVE ROOM
        </span>

        <h1>
          <span>SHIBA</span>
          <em>VS</em>
          <span>DOGE</span>
        </h1>

        <p>30 MINUTES • 100 PARTICIPANTS</p>

        <CountdownTimer />
      </div>

      <div className="arena-side arena-side-doge">
        <div className="side-stat-card">
          <span>DOGE SIDE</span>
          <strong>50 PARTICIPANTS</strong>
          <small>VOLUME DEX: 10.8M USDT</small>
        </div>

        <TokenBadge token="DOGE" />
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="panel information-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">BATTLE RULES</span>
          <h2>HOW IT WORKS?</h2>
        </div>
      </div>

      <div className="steps">
        <div className="step">
          <span>01</span>
          <div>
            <strong>CHOOSE A SIDE</strong>
            <p>Select the market side you believe will win the active room.</p>
          </div>
        </div>

        <div className="step">
          <span>02</span>
          <div>
            <strong>FOLLOW THE MARKET</strong>
            <p>Track the market data throughout the room window.</p>
          </div>
        </div>

        <div className="step">
          <span>03</span>
          <div>
            <strong>ROOM SETTLEMENT</strong>
            <p>
              The final result is determined by the room rules and verified
              market data.
            </p>
          </div>
        </div>
      </div>

      <div className="information-notice">
        <span>!</span>
        <p>
          Live settlement and transaction execution will be enabled only after
          the production contract and market-data layer are connected.
        </p>
      </div>
    </section>
  );
}

function RoomStatistics() {
  return (
    <section className="panel statistics-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">LIVE OVERVIEW</span>
          <h2>ROOM STATISTICS</h2>
        </div>
      </div>

      <div className="statistics-columns">
        <div className="statistics-token">
          <div className="statistics-title">
            <span className="stat-token-dot shiba-dot" />
            <strong>SHIBA</strong>
          </div>

          <div className="statistics-row">
            <span>Participants</span>
            <strong>50</strong>
          </div>

          <div className="statistics-row">
            <span>DEX Volume</span>
            <strong>12.4M</strong>
          </div>
        </div>

        <div className="statistics-token">
          <div className="statistics-title">
            <span className="stat-token-dot doge-dot" />
            <strong>DOGE</strong>
          </div>

          <div className="statistics-row">
            <span>Participants</span>
            <strong>50</strong>
          </div>

          <div className="statistics-row">
            <span>DEX Volume</span>
            <strong>10.8M</strong>
          </div>
        </div>
      </div>

      <div className="volume-difference">
        <div className="volume-difference-heading">
          <span>VOLUME DIFFERENCE</span>
          <strong>1.6M</strong>
        </div>

        <div className="difference-track">
          <span className="difference-shiba" />
          <span className="difference-doge" />
        </div>

        <div className="difference-labels">
          <span>SHIBA 53.4%</span>
          <span>DOGE 46.6%</span>
        </div>
      </div>
    </section>
  );
}

function RoomSidebar({ selectedSide, setSelectedSide, openEntry }) {
  return (
    <aside className="room-sidebar">
      <section className="room-details panel">
        <div className="room-status-row">
          <span>ROOM #4827</span>

          <span className="room-progress">
            <i />
            IN PROGRESS
          </span>
        </div>

        <h2>SHIBA VS DOGE</h2>

        <p className="room-description">
          Battle based on the room's configured market-volume rules.
        </p>

        <div className="room-meta-grid">
          <div>
            <span className="meta-icon">◷</span>

            <div>
              <small>DURATION</small>
              <strong>30 Minutes</strong>
            </div>
          </div>

          <div>
            <span className="meta-icon">◉</span>

            <div>
              <small>PARTICIPANTS</small>
              <strong>100 / 100</strong>
            </div>
          </div>

          <div>
            <span className="meta-icon">◇</span>

            <div>
              <small>NETWORK</small>
              <strong>Connected Wallet</strong>
            </div>
          </div>
        </div>

        <div className="side-selector">
          <button
            type="button"
            className={selectedSide === "SHIBA" ? "active shiba" : ""}
            onClick={() => setSelectedSide("SHIBA")}
          >
            SHIBA
          </button>

          <button
            type="button"
            className={selectedSide === "DOGE" ? "active doge" : ""}
            onClick={() => setSelectedSide("DOGE")}
          >
            DOGE
          </button>
        </div>

        <button
          type="button"
          className="enter-room-button"
          onClick={openEntry}
        >
          ENTER ROOM
          <span>→</span>
        </button>
      </section>

      <section className="participants-panel panel">
        <div className="participants-heading">
          <div>
            <span className="eyebrow">ROOM ACTIVITY</span>
            <h3>PARTICIPANTS (100)</h3>
          </div>

          <span className="live-label">LIVE</span>
        </div>

        <div className="participant-totals">
          <div>
            <TokenBadge token="SHIBA" size="small" />
            <span>SHIBA</span>
            <strong>50</strong>
          </div>

          <div>
            <TokenBadge token="DOGE" size="small" />
            <span>DOGE</span>
            <strong>50</strong>
          </div>
        </div>

        <div className="participant-list">
          {participants.map((participant, index) => (
            <div className="participant-row" key={`${participant.name}-${index}`}>
              <div
                className={`participant-avatar ${
                  participant.side === "SHIBA" ? "shiba" : "doge"
                }`}
              >
                {participant.name.slice(0, 1)}
              </div>

              <div className="participant-copy">
                <strong>{participant.name}</strong>
                <span>{participant.time}</span>
              </div>

              <div className="participant-value">
                <strong>{participant.amount}</strong>
                <span>{participant.side}</span>
              </div>
            </div>
          ))}
        </div>

        <button type="button" className="view-participants">
          View all participants (100)
          <span>→</span>
        </button>
      </section>

      <div className="right-brand">
        <BullMark small />

        <div>
          <strong>BULL PROTOCOL</strong>
          <span>MOMENTUM WINS</span>
        </div>
      </div>
    </aside>
  );
}

function BottomStrategyStrip() {
  return (
    <section className="strategy-strip">
      <div>
        <span className="strategy-number">01</span>

        <div>
          <strong>ENTER THE ROOM</strong>
          <p>Choose your side before the room closes.</p>
        </div>
      </div>

      <div>
        <span className="strategy-number">02</span>

        <div>
          <strong>PLACE YOUR STRATEGY</strong>
          <p>Follow the market data and room conditions.</p>
        </div>
      </div>

      <div>
        <span className="strategy-number">03</span>

        <div>
          <strong>COMPLETE THE BATTLE</strong>
          <p>The room closes when the configured timer expires.</p>
        </div>
      </div>
    </section>
  );
}

function RoomsPage({
  selectedChart,
  setSelectedChart,
  selectedSide,
  setSelectedSide,
  openEntry,
}) {
  return (
    <>
      <main className="main-dashboard">
        <ArenaHero />

        <MarketChart
          selectedChart={selectedChart}
          setSelectedChart={setSelectedChart}
        />

        <div className="dashboard-information-grid">
          <HowItWorks />
          <RoomStatistics />
        </div>

        <BottomStrategyStrip />
      </main>

      <RoomSidebar
        selectedSide={selectedSide}
        setSelectedSide={setSelectedSide}
        openEntry={openEntry}
      />
    </>
  );
}

function GenericPage({ eyebrow, title, description, children }) {
  return (
    <main className="secondary-page">
      <section className="secondary-hero panel">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </section>

      {children}
    </main>
  );
}

function ProfilePage({ connected, publicKey }) {
  return (
    <GenericPage
      eyebrow="ACCOUNT CENTER"
      title="MY PROFILE"
      description="Review your connected wallet, room activity and battle history."
    >
      <div className="secondary-grid">
        <section className="panel secondary-card">
          <span className="eyebrow">WALLET STATUS</span>
          <h2>{connected ? "CONNECTED" : "NOT CONNECTED"}</h2>

          <p>
            {connected && publicKey
              ? `${publicKey.toBase58().slice(0, 6)}...${publicKey
                  .toBase58()
                  .slice(-4)}`
              : "Connect your wallet to access account activity."}
          </p>
        </section>

        <section className="panel secondary-card">
          <span className="eyebrow">BATTLE HISTORY</span>
          <h2>NO VERIFIED HISTORY YET</h2>
          <p>
            Production battle history will appear here after the settlement
            layer is connected.
          </p>
        </section>
      </div>
    </GenericPage>
  );
}

function LaunchpadPage() {
  return (
    <GenericPage
      eyebrow="PROJECT ACCESS"
      title="LAUNCHPAD"
      description="A dedicated area for future project launches and verified arena integrations."
    >
      <section className="panel launchpad-preview">
        <div>
          <span className="eyebrow">COMING NEXT</span>
          <h2>BUILD THE NEXT BATTLE</h2>
          <p>
            Launchpad tools will be activated after project verification,
            market-data requirements and production settlement rules are
            finalized.
          </p>
        </div>

        <div className="launchpad-orbit">
          <BullMark />
        </div>
      </section>
    </GenericPage>
  );
}

function LeaderboardPage() {
  const leaders = [
    ["01", "MomentumKing", "2,480 XP"],
    ["02", "BullRunner", "2,210 XP"],
    ["03", "MarketPulse", "1,970 XP"],
    ["04", "AlphaWave", "1,820 XP"],
    ["05", "NeonTrader", "1,640 XP"],
  ];

  return (
    <GenericPage
      eyebrow="GLOBAL RANKING"
      title="LEADERBOARD"
      description="Performance rankings will be based on verified production activity."
    >
      <section className="panel leaderboard-table">
        {leaders.map(([position, name, score]) => (
          <div key={position} className="leaderboard-row">
            <span>{position}</span>
            <strong>{name}</strong>
            <small>{score}</small>
          </div>
        ))}
      </section>
    </GenericPage>
  );
}

function RewardsPage() {
  return (
    <GenericPage
      eyebrow="PROGRESSION"
      title="REWARDS"
      description="Track XP, achievements and future protocol rewards."
    >
      <div className="secondary-grid">
        <section className="panel secondary-card">
          <span className="eyebrow">CURRENT XP</span>
          <h2>0 XP</h2>
          <p>Verified XP will begin accumulating with production activity.</p>
        </section>

        <section className="panel secondary-card">
          <span className="eyebrow">ACHIEVEMENTS</span>
          <h2>0 UNLOCKED</h2>
          <p>Achievements will be tied to verified arena milestones.</p>
        </section>
      </div>
    </GenericPage>
  );
}

function SettingsPage() {
  const [sound, setSound] = useState(true);
  const [animations, setAnimations] = useState(true);
  const [compact, setCompact] = useState(false);

  return (
    <GenericPage
      eyebrow="TERMINAL CONTROL"
      title="SETTINGS"
      description="Customize your Bull Protocol terminal experience."
    >
      <section className="panel settings-list">
        <label>
          <div>
            <strong>SOUND EFFECTS</strong>
            <span>Enable terminal interface sounds.</span>
          </div>

          <input
            type="checkbox"
            checked={sound}
            onChange={(event) => setSound(event.target.checked)}
          />
        </label>

        <label>
          <div>
            <strong>INTERFACE ANIMATIONS</strong>
            <span>Enable glow and motion effects.</span>
          </div>

          <input
            type="checkbox"
            checked={animations}
            onChange={(event) => setAnimations(event.target.checked)}
          />
        </label>

        <label>
          <div>
            <strong>COMPACT DATA MODE</strong>
            <span>Reduce spacing in data-heavy panels.</span>
          </div>

          <input
            type="checkbox"
            checked={compact}
            onChange={(event) => setCompact(event.target.checked)}
          />
        </label>
      </section>
    </GenericPage>
  );
}

function EntryModal({
  open,
  close,
  selectedSide,
  setSelectedSide,
  connected,
}) {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!open) {
      setMessage("");
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const submitEntry = (event) => {
    event.preventDefault();

    if (!connected) {
      setMessage("Connect your wallet before entering a room.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setMessage("Enter a valid participation amount.");
      return;
    }

    setMessage(
      "The interface is ready, but production transaction execution is not connected yet."
    );
  };

  return (
    <div className="modal-backdrop" onMouseDown={close}>
      <div
        className="entry-modal panel"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close"
          onClick={close}
          aria-label="Close"
        >
          ×
        </button>

        <span className="eyebrow">ROOM #4827</span>
        <h2>ENTER THE BATTLE</h2>

        <p>
          Choose your side and participation amount. No transaction will be
          submitted until the production contract is connected.
        </p>

        <form onSubmit={submitEntry}>
          <div className="modal-side-selector">
            <button
              type="button"
              className={selectedSide === "SHIBA" ? "active shiba" : ""}
              onClick={() => setSelectedSide("SHIBA")}
            >
              SHIBA
            </button>

            <button
              type="button"
              className={selectedSide === "DOGE" ? "active doge" : ""}
              onClick={() => setSelectedSide("DOGE")}
            >
              DOGE
            </button>
          </div>

          <label className="amount-field">
            <span>PARTICIPATION AMOUNT</span>

            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="0.00"
            />
          </label>

          <button type="submit" className="enter-room-button">
            CONTINUE
            <span>→</span>
          </button>

          {message && <div className="modal-message">{message}</div>}
        </form>
      </div>
    </div>
  );
}

function Terminal() {
  const { connected, publicKey } = useWallet();

  const [activeSection, setActiveSection] = useState("rooms");
  const [selectedChart, setSelectedChart] = useState("TOTAL");
  const [selectedSide, setSelectedSide] = useState("SHIBA");
  const [entryOpen, setEntryOpen] = useState(false);

  const shortAddress = useMemo(() => {
    if (!publicKey) {
      return "";
    }

    const address = publicKey.toBase58();

    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  }, [publicKey]);

  const renderContent = () => {
    if (activeSection === "profile") {
      return <ProfilePage connected={connected} publicKey={publicKey} />;
    }

    if (activeSection === "launchpad") {
      return <LaunchpadPage />;
    }

    if (activeSection === "leaderboard") {
      return <LeaderboardPage />;
    }

    if (activeSection === "rewards") {
      return <RewardsPage />;
    }

    if (activeSection === "settings") {
      return <SettingsPage />;
    }

    return (
      <RoomsPage
        selectedChart={selectedChart}
        setSelectedChart={setSelectedChart}
        selectedSide={selectedSide}
        setSelectedSide={setSelectedSide}
        openEntry={() => setEntryOpen(true)}
      />
    );
  };

  return (
    <div className="terminal-shell">
      <header className="topbar">
        <button
          type="button"
          className="brand"
          onClick={() => setActiveSection("rooms")}
        >
          <BullMark />

          <div className="brand-copy">
            <strong>
              BULL <span>PROTOCOL</span>
            </strong>
            <small>MOMENTUM TRADING TERMINAL</small>
          </div>
        </button>

        <div className="topbar-divider" />

        <div className="terminal-title">MOMENTUM TRADING TERMINAL</div>

        <nav className="topbar-navigation">
          <button
            type="button"
            onClick={() => setActiveSection("rooms")}
          >
            TRADES
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("rooms")}
          >
            POOLS
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("rooms")}
          >
            MARKET DATA
          </button>
        </nav>

        <div className="topbar-actions">
          <div className="online-indicator">
            <i />
            ONLINE
          </div>

          <WalletMultiButton>
            {connected && shortAddress ? shortAddress : "SELECT WALLET"}
          </WalletMultiButton>
        </div>
      </header>

      <div className="terminal-layout">
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        <div
          className={`terminal-content ${
            activeSection !== "rooms" ? "secondary-content" : ""
          }`}
        >
          {renderContent()}
        </div>
      </div>

      <EntryModal
        open={entryOpen}
        close={() => setEntryOpen(false)}
        selectedSide={selectedSide}
        setSelectedSide={setSelectedSide}
        connected={connected}
      />
    </div>
  );
}

export default function App() {
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );

  return (
    <ConnectionProvider endpoint={NETWORK_ENDPOINT}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Terminal />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
