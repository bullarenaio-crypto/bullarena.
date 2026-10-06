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

const BULL_LOGO = "/bull-logo.png";

const SHIBA_LOGO =
  "https://s2.coinmarketcap.com/static/img/coins/64x64/5994.png";

const DOGE_LOGO =
  "https://s2.coinmarketcap.com/static/img/coins/64x64/74.png";

const ENDPOINT = clusterApiUrl("mainnet-beta");

const participants = [
  {
    name: "ShibaTeam_97...",
    side: "SHIBA",
    time: "2 min",
    image: SHIBA_LOGO,
  },
  {
    name: "DogeWolf_72...",
    side: "DOGE",
    time: "2 min",
    image: DOGE_LOGO,
  },
  {
    name: "CryptoLuna",
    side: "SHIBA",
    time: "3 min",
    avatar: "CL",
  },
  {
    name: "TraderAlpha",
    side: "DOGE",
    time: "4 min",
    avatar: "TA",
  },
  {
    name: "SolMaster",
    side: "SHIBA",
    time: "5 min",
    avatar: "SM",
  },
];

function Icon({ type }) {
  const common = {
    width: 21,
    height: 21,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  if (type === "rooms") {
    return (
      <svg {...common}>
        <path d="M4 4l16 16" />
        <path d="M20 4L4 20" />
        <path d="M7 4l13 13" />
        <path d="M17 4L4 17" />
      </svg>
    );
  }

  if (type === "profile") {
    return (
      <svg {...common}>
        <circle cx="12" cy="7" r="4" />
        <path d="M4 21c.7-5 3.3-7 8-7s7.3 2 8 7" />
      </svg>
    );
  }

  if (type === "launchpad") {
    return (
      <svg {...common}>
        <path d="M14 4c3-2 5-1 6-1 0 1 1 3-1 6l-6 6-4-4 5-7Z" />
        <path d="M9 11l-4 1-2 4 6-1" />
        <path d="M13 15l-1 6 4-2 1-4" />
        <circle cx="15.5" cy="7.5" r="1.5" />
      </svg>
    );
  }

  if (type === "leaderboard") {
    return (
      <svg {...common}>
        <path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" />
        <path d="M8 6H4v2c0 3 2 4 5 4" />
        <path d="M16 6h4v2c0 3-2 4-5 4" />
        <path d="M12 13v5" />
        <path d="M8 21h8" />
        <path d="M9 18h6" />
      </svg>
    );
  }

  if (type === "rewards") {
    return (
      <svg {...common}>
        <path d="M12 2l2 3 4-.5.5 4 3 2-2 3 1 4-4 .5-2 3-3-2.5-4 .5-.5-4-3-2 2-3-1-4 4-.5L12 2Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }

  if (type === "settings") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19 13.5v-3l-2-.7a7 7 0 0 0-.7-1.7l.9-1.9-2.1-2.1-1.9.9a7 7 0 0 0-1.7-.7L10.5 2h-3l-.7 2.3a7 7 0 0 0-1.7.7l-1.9-.9-2.1 2.1.9 1.9a7 7 0 0 0-.7 1.7L0 10.5v3l2.3.7c.2.6.4 1.2.7 1.7l-.9 1.9 2.1 2.1 1.9-.9c.5.3 1.1.5 1.7.7l.7 2.3h3l.7-2.3c.6-.2 1.2-.4 1.7-.7l1.9.9 2.1-2.1-.9-1.9c.3-.5.5-1.1.7-1.7L19 13.5Z" transform="translate(2)" />
      </svg>
    );
  }

  if (type === "clock") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    );
  }

  if (type === "users") {
    return (
      <svg {...common}>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 19c.5-4 2.5-6 6-6s5.5 2 6 6" />
        <path d="M15 6a3 3 0 0 1 0 6" />
        <path d="M17 13c2.4.6 3.6 2.6 4 5" />
      </svg>
    );
  }

  if (type === "link") {
    return (
      <svg {...common}>
        <path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1" />
        <path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" />
      </svg>
    );
  }

  return null;
}

function BullBrand({ compact = false }) {
  return (
    <div className={`bull-brand ${compact ? "compact" : ""}`}>
      <div className="brand-logo-shell">
        <img src={BULL_LOGO} alt="Bull Protocol" />
      </div>

      <div className="brand-copy">
        <strong>BULL PROTOCOL</strong>
        <span>MOMENTUM TRADING TERMINAL</span>
      </div>
    </div>
  );
}

function SideNavigation({ activePage, setActivePage }) {
  const items = [
    {
      id: "rooms",
      title: "ROOMS",
      subtitle: "Join battles",
      icon: "rooms",
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
    <aside className="left-sidebar">
      <nav className="side-navigation">
        {items.map((item) => (
          <button
            type="button"
            key={item.id}
            className={`side-nav-item ${
              activePage === item.id ? "active" : ""
            }`}
            onClick={() => setActivePage(item.id)}
          >
            <span className="side-nav-icon">
              <Icon type={item.icon} />
            </span>

            <span className="side-nav-copy">
              <strong>{item.title}</strong>
              <small>{item.subtitle}</small>
            </span>

            {item.id === "rooms" && (
              <span className="live-badge">LIVE</span>
            )}
          </button>
        ))}
      </nav>

      <div className="momentum-card">
        <div className="momentum-bull">
          <img src={BULL_LOGO} alt="" />
        </div>

        <h3>
          MORE MOMENTUM,
          <br />
          LESS EMOTION
        </h3>

        <p>
          Here, every move matters.
          <br />
          The game never stops
          <br />
          in the market for 30 minutes.
        </p>

        <button type="button" className="outline-action">
          HOW IT WORKS?
        </button>
      </div>

      <div className="wireframe-landscape" aria-hidden="true">
        <span className="wire-line line-1" />
        <span className="wire-line line-2" />
        <span className="wire-line line-3" />
        <span className="wire-line line-4" />
        <span className="wire-line line-5" />
      </div>

      <div className="powered-by">
        <span>POWERED BY</span>
        <BullBrand compact />
      </div>
    </aside>
  );
}

function ArenaHero({ timeLeft }) {
  return (
    <section className="arena-hero panel">
      <div className="arena-energy energy-left" />
      <div className="arena-energy energy-right" />

      <svg
        className="arena-lightning"
        viewBox="0 0 1000 330"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          className="lightning purple"
          d="M0 28 L115 78 L210 38 L310 108 L402 72 L475 146 L405 190 L305 166 L225 230 L115 188 L0 218"
        />
        <path
          className="lightning cyan"
          d="M1000 30 L888 84 L805 42 L710 112 L612 74 L528 148 L603 190 L700 166 L792 232 L890 184 L1000 220"
        />
      </svg>

      <div className="arena-status">
        <span className="status-dot" />
        ACTIVE ROOM
      </div>

      <div className="arena-layout">
        <div className="fighter fighter-shiba">
          <div className="fighter-orb">
            <div className="fighter-ring ring-one" />
            <div className="fighter-ring ring-two" />
            <img src={SHIBA_LOGO} alt="Shiba" />
          </div>

          <div className="fighter-data">
            <strong>SHIBA SIDE</strong>
            <span>50 PARTICIPANTS</span>
            <small>VOLUME DEX: 12.4M USDT</small>
          </div>
        </div>

        <div className="arena-center">
          <h1>
            SHIBA <span>VS</span> DOGE
          </h1>

          <p>30 MINUTES • 100 PARTICIPANTS</p>

          <div className="timer-frame">
            <small>TIME REMAINING</small>
            <strong>{timeLeft}</strong>
          </div>
        </div>

        <div className="fighter fighter-doge">
          <div className="fighter-data">
            <strong>DOGE SIDE</strong>
            <span>50 PARTICIPANTS</span>
            <small>VOLUME DEX: 10.8M USDT</small>
          </div>

          <div className="fighter-orb">
            <div className="fighter-ring ring-one" />
            <div className="fighter-ring ring-two" />
            <img src={DOGE_LOGO} alt="Doge" />
          </div>
        </div>
      </div>
    </section>
  );
}

function MarketChart() {
  const [marketTab, setMarketTab] = useState("total");

  return (
    <section className="market-panel panel">
      <div className="section-heading chart-heading">
        <div>
          <span className="eyebrow">LIVE MARKET FEED</span>
          <h2>
            VOLUME ON DEX <small>(LAST 30 MIN)</small>
          </h2>
        </div>

        <div className="chart-tabs">
          {["total", "shiba", "doge"].map((tab) => (
            <button
              type="button"
              key={tab}
              className={marketTab === tab ? "active" : ""}
              onClick={() => setMarketTab(tab)}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="chart-area">
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
          viewBox="0 0 900 245"
          preserveAspectRatio="none"
          role="img"
          aria-label="Market volume chart preview"
        >
          <defs>
            <linearGradient id="shibaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff16ef" stopOpacity="0.48" />
              <stop offset="100%" stopColor="#791aff" stopOpacity="0.03" />
            </linearGradient>

            <linearGradient id="dogeFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00f6f0" stopOpacity="0.42" />
              <stop offset="100%" stopColor="#00a6ff" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          <g className="chart-grid">
            <line x1="0" y1="10" x2="900" y2="10" />
            <line x1="0" y1="54" x2="900" y2="54" />
            <line x1="0" y1="98" x2="900" y2="98" />
            <line x1="0" y1="142" x2="900" y2="142" />
            <line x1="0" y1="186" x2="900" y2="186" />
            <line x1="0" y1="230" x2="900" y2="230" />

            <line x1="0" y1="10" x2="0" y2="230" />
            <line x1="150" y1="10" x2="150" y2="230" />
            <line x1="300" y1="10" x2="300" y2="230" />
            <line x1="450" y1="10" x2="450" y2="230" />
            <line x1="600" y1="10" x2="600" y2="230" />
            <line x1="750" y1="10" x2="750" y2="230" />
            <line x1="900" y1="10" x2="900" y2="230" />
          </g>

          {(marketTab === "total" || marketTab === "shiba") && (
            <>
              <path
                className="chart-fill shiba-fill"
                d="M0 168
                L28 157 L55 149 L83 146 L110 137 L138 132
                L165 119 L193 127 L220 135 L248 132 L275 139
                L303 136 L330 141 L358 137 L385 145 L413 142
                L440 139 L468 146 L495 151 L523 144 L550 152
                L578 142 L605 145 L633 139 L660 142 L688 135
                L715 131 L743 127 L770 129 L798 124 L825 121
                L853 116 L880 112 L900 108
                L900 230 L0 230 Z"
                fill="url(#shibaFill)"
              />

              <path
                className="chart-line shiba-line"
                d="M0 168
                L28 157 L55 149 L83 146 L110 137 L138 132
                L165 119 L193 127 L220 135 L248 132 L275 139
                L303 136 L330 141 L358 137 L385 145 L413 142
                L440 139 L468 146 L495 151 L523 144 L550 152
                L578 142 L605 145 L633 139 L660 142 L688 135
                L715 131 L743 127 L770 129 L798 124 L825 121
                L853 116 L880 112 L900 108"
              />
            </>
          )}

          {(marketTab === "total" || marketTab === "doge") && (
            <>
              <path
                className="chart-fill doge-fill"
                d="M0 205
                L28 197 L55 184 L83 190 L110 180 L138 183
                L165 176 L193 181 L220 169 L248 171 L275 161
                L303 164 L330 153 L358 159 L385 148 L413 151
                L440 141 L468 132 L495 116 L523 129 L550 137
                L578 122 L605 128 L633 111 L660 119 L688 113
                L715 105 L743 111 L770 101 L798 91 L825 103
                L853 97 L880 84 L900 91
                L900 230 L0 230 Z"
                fill="url(#dogeFill)"
              />

              <path
                className="chart-line doge-line"
                d="M0 205
                L28 197 L55 184 L83 190 L110 180 L138 183
                L165 176 L193 181 L220 169 L248 171 L275 161
                L303 164 L330 153 L358 159 L385 148 L413 151
                L440 141 L468 132 L495 116 L523 129 L550 137
                L578 122 L605 128 L633 111 L660 119 L688 113
                L715 105 L743 111 L770 101 L798 91 L825 103
                L853 97 L880 84 L900 91"
              />
            </>
          )}
        </svg>

        <div className="chart-x-axis">
          <span>14:05</span>
          <span>14:10</span>
          <span>14:15</span>
          <span>14:20</span>
          <span>14:25</span>
          <span>14:30</span>
        </div>

        <span className="chart-value doge-value">10.8M</span>
        <span className="chart-value shiba-value">12.4M</span>
      </div>

      <div className="chart-footer">
        <div className="chart-legend">
          <span>
            <i className="legend-dot shiba" />
            Shiba (12.4M)
          </span>

          <span>
            <i className="legend-dot doge" />
            Doge (10.8M)
          </span>
        </div>

        <span className="data-source">MARKET DATA</span>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="how-it-works panel">
      <h2>HOW IT WORKS?</h2>

      <div className="instruction-row">
        <span className="instruction-number">1</span>
        <p>
          <strong>Choose a side</strong>
          <small>Shiba or Doge.</small>
        </p>
      </div>

      <div className="instruction-row">
        <span className="instruction-number">2</span>
        <p>
          <strong>Enter the room</strong>
          <small>Join the participants.</small>
        </p>
      </div>

      <div className="instruction-row">
        <span className="instruction-number">3</span>
        <p>
          <strong>Follow the market</strong>
          <small>The result is determined when the round closes.</small>
        </p>
      </div>

      <div className="risk-notice">
        <span>!</span>
        <p>
          <strong>Round rules apply.</strong>
          <small>Review the room conditions before participating.</small>
        </p>
      </div>
    </section>
  );
}

function RoomStatistics() {
  return (
    <section className="room-statistics panel">
      <h2>ROOM STATISTICS</h2>

      <div className="statistics-sides">
        <div className="statistics-side shiba-stat">
          <div className="stat-token">
            <img src={SHIBA_LOGO} alt="Shiba" />
          </div>

          <div>
            <strong>SHIBA</strong>
            <span>50 participants</span>
          </div>

          <p>
            Current Volume (30m)
            <strong>12.4M USDT</strong>
          </p>
        </div>

        <div className="statistics-divider" />

        <div className="statistics-side doge-stat">
          <div className="stat-token">
            <img src={DOGE_LOGO} alt="Doge" />
          </div>

          <div>
            <strong>DOGE</strong>
            <span>50 participants</span>
          </div>

          <p>
            Current Volume (30m)
            <strong>10.8M USDT</strong>
          </p>
        </div>
      </div>

      <div className="volume-difference">
        <span>Volume Difference</span>

        <div className="difference-track">
          <i />
        </div>

        <strong>1.6M USDT</strong>

        <small>(in favor of Shiba)</small>
      </div>
    </section>
  );
}

function BottomSteps() {
  return (
    <section className="bottom-steps panel">
      <div className="bottom-step">
        <span className="step-symbol">ϟ</span>

        <div>
          <strong>ENTER THE ROOM</strong>
          <small>Join the right side. Rooms are limited.</small>
        </div>

        <b>›</b>
      </div>

      <div className="bottom-step">
        <span className="step-symbol">◎</span>

        <div>
          <strong>PLACE YOUR STRATEGY</strong>
          <small>The market volume decides.</small>
        </div>

        <b>›</b>
      </div>

      <div className="bottom-step">
        <span className="step-symbol">♜</span>

        <div>
          <strong>TAKE THE VICTORY</strong>
          <small>Results are settled when the round ends.</small>
        </div>
      </div>
    </section>
  );
}

function RoomSidebar({
  selectedSide,
  setSelectedSide,
  onEnterRoom,
}) {
  return (
    <aside className="room-sidebar">
      <section className="room-summary panel">
        <div className="room-summary-top">
          <span className="room-number">ROOM #4827</span>

          <span className="progress-badge">
            <i />
            IN PROGRESS
          </span>
        </div>

        <h2>SHIBA VS DOGE</h2>
        <p className="room-description">
          Market volume battle
        </p>

        <div className="room-meta">
          <div>
            <Icon type="clock" />
            <span>
              Duration
              <strong>30 minutes</strong>
            </span>
          </div>

          <div>
            <Icon type="users" />
            <span>
              Participants
              <strong>100/100</strong>
            </span>
          </div>

          <div>
            <Icon type="link" />
            <span>
              Market
              <strong>Live room</strong>
            </span>
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
          onClick={onEnterRoom}
        >
          ENTER ROOM
          <span>→</span>
        </button>
      </section>

      <section className="participants-panel panel">
        <div className="participants-heading">
          <div>
            <span className="eyebrow">ROOM ACTIVITY</span>
            <h2>PARTICIPANTS (100)</h2>
          </div>

          <span className="live-mini">LIVE</span>
        </div>

        <div className="participant-totals">
          <div className="participant-total shiba">
            <img src={SHIBA_LOGO} alt="Shiba" />
            <span>
              SHIBA
              <strong>50</strong>
            </span>
          </div>

          <div className="participant-total doge">
            <img src={DOGE_LOGO} alt="Doge" />
            <span>
              DOGE
              <strong>50</strong>
            </span>
          </div>
        </div>

        <div className="participant-list">
          {participants.map((participant) => (
            <div
              className="participant-row"
              key={`${participant.name}-${participant.side}`}
            >
              <div className="participant-avatar">
                {participant.image ? (
                  <img src={participant.image} alt="" />
                ) : (
                  <span>{participant.avatar}</span>
                )}
              </div>

              <div className="participant-copy">
                <strong>{participant.name}</strong>
                <small>
                  Joined the{" "}
                  <b
                    className={
                      participant.side === "SHIBA"
                        ? "text-shiba"
                        : "text-doge"
                    }
                  >
                    {participant.side.toLowerCase()}
                  </b>{" "}
                  side
                </small>
              </div>

              <time>{participant.time}</time>
            </div>
          ))}
        </div>

        <button type="button" className="view-participants">
          View all participants (100)
          <span>→</span>
        </button>
      </section>

      <div className="sidebar-footer-brand">
        <BullBrand compact />
        <strong>MOMENTUM WINS</strong>
      </div>
    </aside>
  );
}

function RoomsPage({
  timeLeft,
  selectedSide,
  setSelectedSide,
  onEnterRoom,
}) {
  return (
    <div className="rooms-page">
      <main className="battle-content">
        <ArenaHero timeLeft={timeLeft} />

        <MarketChart />

        <div className="information-grid">
          <HowItWorks />
          <RoomStatistics />
        </div>

        <BottomSteps />
      </main>

      <RoomSidebar
        selectedSide={selectedSide}
        setSelectedSide={setSelectedSide}
        onEnterRoom={onEnterRoom}
      />
    </div>
  );
}

function GenericPage({ type }) {
  const content = {
    profile: {
      eyebrow: "ACCOUNT CENTER",
      title: "MY PROFILE",
      description:
        "Connect your wallet to access your account activity and room history.",
    },
    launchpad: {
      eyebrow: "PROJECT CENTER",
      title: "LAUNCHPAD",
      description:
        "A dedicated space for future project launches and new market rooms.",
    },
    leaderboard: {
      eyebrow: "GLOBAL RANKING",
      title: "LEADERBOARD",
      description:
        "Track competitive performance across Bull Protocol rooms.",
    },
    rewards: {
      eyebrow: "ACHIEVEMENTS",
      title: "REWARDS",
      description:
        "Track XP, milestones, achievements, and future protocol rewards.",
    },
    settings: {
      eyebrow: "TERMINAL CONTROL",
      title: "SETTINGS",
      description:
        "Manage your terminal preferences and interface options.",
    },
  };

  const page = content[type] || content.profile;

  return (
    <div className="generic-page">
      <section className="generic-hero panel">
        <span className="eyebrow">{page.eyebrow}</span>
        <h1>{page.title}</h1>
        <p>{page.description}</p>
      </section>

      <section className="generic-grid">
        <article className="generic-card panel">
          <span className="generic-index">01</span>
          <h2>TERMINAL ACCESS</h2>
          <p>
            This module is prepared for the next integration stage.
          </p>
        </article>

        <article className="generic-card panel">
          <span className="generic-index">02</span>
          <h2>LIVE DATA</h2>
          <p>
            Real account and market data will be connected through the
            production data layer.
          </p>
        </article>

        <article className="generic-card panel">
          <span className="generic-index">03</span>
          <h2>PROTOCOL STATUS</h2>
          <p>
            The interface remains synchronized with the main Bull Protocol
            terminal design.
          </p>
        </article>
      </section>
    </div>
  );
}

function EntryModal({
  selectedSide,
  setSelectedSide,
  onClose,
}) {
  const { connected } = useWallet();

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="entry-modal panel"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <span className="eyebrow">ROOM #4827</span>
        <h2>ENTER THE ROOM</h2>

        <p className="modal-description">
          Select your side before continuing.
        </p>

        <div className="modal-side-options">
          <button
            type="button"
            className={selectedSide === "SHIBA" ? "selected shiba" : ""}
            onClick={() => setSelectedSide("SHIBA")}
          >
            <img src={SHIBA_LOGO} alt="" />
            <span>
              SHIBA
              <small>50 participants</small>
            </span>
          </button>

          <button
            type="button"
            className={selectedSide === "DOGE" ? "selected doge" : ""}
            onClick={() => setSelectedSide("DOGE")}
          >
            <img src={DOGE_LOGO} alt="" />
            <span>
              DOGE
              <small>50 participants</small>
            </span>
          </button>
        </div>

        {!connected ? (
          <div className="modal-wallet">
            <p>Connect your wallet to continue.</p>
            <WalletMultiButton />
          </div>
        ) : (
          <div className="integration-notice">
            <strong>WALLET CONNECTED</strong>
            <p>
              The room transaction layer is not connected yet. No transaction
              will be submitted from this preview.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Terminal() {
  const { publicKey, connected } = useWallet();

  const [activePage, setActivePage] = useState("rooms");
  const [selectedSide, setSelectedSide] = useState("SHIBA");
  const [secondsRemaining, setSecondsRemaining] = useState(28 * 60 + 17);
  const [entryOpen, setEntryOpen] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsRemaining((current) => {
        if (current <= 0) {
          return 30 * 60;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const timeLeft = useMemo(() => {
    const minutes = Math.floor(secondsRemaining / 60);
    const seconds = secondsRemaining % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  }, [secondsRemaining]);

  const shortAddress = useMemo(() => {
    if (!publicKey) {
      return "";
    }

    const value = publicKey.toBase58();

    return `${value.slice(0, 4)}...${value.slice(-4)}`;
  }, [publicKey]);

  return (
    <div className="bull-terminal">
      <header className="terminal-header">
        <div className="header-brand-area">
          <BullBrand />

          <div className="header-divider" />

          <div className="terminal-name">
            <strong>MOMENTUM TRADING TERMINAL</strong>

            <div>
              <span>TRADES</span>
              <i>•</i>
              <span>POOLS</span>
              <i>•</i>
              <span>REAL MARKET</span>
            </div>
          </div>
        </div>

        <div className="header-actions">
          <span className="online-indicator">
            <i />
            Online
          </span>

          <div className="wallet-shell">
            {connected && (
              <span className="connected-address">
                {shortAddress}
              </span>
            )}

            <WalletMultiButton />
          </div>
        </div>
      </header>

      <div className="terminal-body">
        <SideNavigation
          activePage={activePage}
          setActivePage={setActivePage}
        />

        <div className="terminal-workspace">
          {activePage === "rooms" ? (
            <RoomsPage
              timeLeft={timeLeft}
              selectedSide={selectedSide}
              setSelectedSide={setSelectedSide}
              onEnterRoom={() => setEntryOpen(true)}
            />
          ) : (
            <GenericPage type={activePage} />
          )}
        </div>
      </div>

      {entryOpen && (
        <EntryModal
          selectedSide={selectedSide}
          setSelectedSide={setSelectedSide}
          onClose={() => setEntryOpen(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
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
