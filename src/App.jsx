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

const ENDPOINT = clusterApiUrl("mainnet-beta");

const SHIBA_LOGO =
  "https://s2.coinmarketcap.com/static/img/coins/128x128/5994.png";

const DOGE_LOGO =
  "https://s2.coinmarketcap.com/static/img/coins/128x128/74.png";

const SIDEBAR_ITEMS = [
  { id: "rooms", label: "ROOMS", subtitle: "Join battles", icon: "⚔" },
  { id: "profile", label: "MY PROFILE", subtitle: "Wallet & history", icon: "◉" },
  { id: "launchpad", label: "LAUNCHPAD", subtitle: "Launch new projects", icon: "◆" },
  { id: "leaderboard", label: "LEADERBOARD", subtitle: "Top traders", icon: "♛" },
  { id: "rewards", label: "REWARDS", subtitle: "XP & achievements", icon: "✦" },
  { id: "settings", label: "SETTINGS", subtitle: "Preferences", icon: "⚙" },
];

function Arena() {
  const { connected, publicKey } = useWallet();

  const [secondsLeft, setSecondsLeft] = useState(28 * 60 + 17);
  const [chartFilter, setChartFilter] = useState("TOTAL");
  const [selectedSide, setSelectedSide] = useState(null);
  const [showEntry, setShowEntry] = useState(false);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [activeSection, setActiveSection] = useState("rooms");

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 0) return 30 * 60;
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  }, [secondsLeft]);

  const shortAddress = useMemo(() => {
    if (!publicKey) return "";
    const address = publicKey.toBase58();
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  }, [publicKey]);

  function openEntry(side) {
    setSelectedSide(side);
    setShowEntry(true);
    setMessage("");
  }

  function handleEntry() {
    if (!connected) {
      setMessage("Connect your wallet before entering the room.");
      return;
    }

    if (!selectedSide) {
      setMessage("Choose SHIBA or DOGE.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setMessage("Enter a valid amount.");
      return;
    }

    setMessage(
      "The transaction layer is not connected yet. No funds have been sent."
    );
  }

  return (
    <div className="terminal">
      <header className="terminal-header">
        <div className="brand">
          <div className="brand-logo">
            <img src="/bull-logo.png" alt="Bull Protocol" />
          </div>

          <div className="brand-copy">
            <strong>BULL PROTOCOL</strong>
            <span>MOMENTUM WINS</span>
          </div>

          <div className="brand-divider" />

          <div className="terminal-title">
            <strong>MOMENTUM TRADING TERMINAL</strong>
            <span>TRADES • POOLS • REAL MARKET</span>
          </div>
        </div>

        <div className="header-actions">
          <div className="online-status">
            <span className="online-dot" />
            Online
          </div>

          {connected && (
            <div className="wallet-address">{shortAddress}</div>
          )}

          <WalletMultiButton />
        </div>
      </header>

      <style>{`
        .bull-terminal-shell {
          display: grid;
          grid-template-columns: 220px minmax(0, 1fr);
          gap: 10px;
          width: 100%;
          min-width: 0;
          align-items: stretch;
        }

        .bull-sidebar {
          min-width: 0;
          padding: 14px 10px;
          border-right: 1px solid rgba(0, 246, 255, 0.2);
          border-top: 1px solid rgba(143, 64, 255, 0.13);
          background:
            linear-gradient(180deg, rgba(7, 10, 22, 0.98), rgba(3, 5, 13, 0.98)),
            radial-gradient(circle at 50% 0%, rgba(132, 45, 255, 0.16), transparent 34%);
          box-shadow: inset -10px 0 30px rgba(0, 246, 255, 0.025);
        }

        .bull-sidebar-title {
          padding: 6px 10px 12px;
          color: rgba(255,255,255,.42);
          font-size: 8px;
          font-weight: 800;
          letter-spacing: .22em;
        }

        .bull-sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .bull-sidebar-button {
          width: 100%;
          min-height: 52px;
          display: grid;
          grid-template-columns: 30px 1fr;
          align-items: center;
          gap: 8px;
          padding: 8px 10px;
          border: 1px solid transparent;
          border-radius: 7px;
          color: #b9c1d6;
          background: transparent;
          text-align: left;
          cursor: pointer;
          transition: .2s ease;
        }

        .bull-sidebar-button:hover {
          border-color: rgba(0, 246, 255, .26);
          background: rgba(0, 246, 255, .035);
        }

        .bull-sidebar-button.active {
          border-color: rgba(91, 105, 255, .46);
          background: linear-gradient(90deg, rgba(120, 44, 255, .24), rgba(0, 246, 255, .12));
          box-shadow: 0 0 18px rgba(114, 47, 255, .13), inset 0 0 14px rgba(0, 246, 255, .035);
        }

        .bull-sidebar-icon {
          font-size: 16px;
          color: #8f78ff;
          text-align: center;
          filter: drop-shadow(0 0 7px rgba(115, 63, 255, .65));
        }

        .bull-sidebar-button.active .bull-sidebar-icon {
          color: #00f6ff;
        }

        .bull-sidebar-copy {
          display: flex;
          flex-direction: column;
          gap: 3px;
          min-width: 0;
        }

        .bull-sidebar-copy strong {
          color: #eef5ff;
          font-size: 9px;
          letter-spacing: .08em;
          line-height: 1;
        }

        .bull-sidebar-copy small {
          color: #66708a;
          font-size: 7px;
          letter-spacing: .03em;
        }

        .bull-sidebar-promo {
          position: relative;
          overflow: hidden;
          margin-top: 14px;
          padding: 16px 12px;
          min-height: 220px;
          border: 1px solid rgba(105, 57, 255, .28);
          border-radius: 9px;
          background:
            radial-gradient(circle at 50% 8%, rgba(0, 255, 151, .08), transparent 28%),
            radial-gradient(circle at 20% 85%, rgba(139, 53, 255, .14), transparent 35%),
            rgba(5, 7, 17, .92);
          text-align: center;
        }

        .bull-sidebar-promo img {
          width: 56px;
          height: 56px;
          object-fit: contain;
          filter: drop-shadow(0 0 10px rgba(0, 246, 255, .6)) drop-shadow(0 0 16px rgba(143, 55, 255, .5));
        }

        .bull-sidebar-promo h3 {
          margin: 8px 0 0;
          color: #fff;
          font-size: 11px;
          line-height: 1.35;
          letter-spacing: .09em;
        }

        .bull-sidebar-promo h3 span:first-child { color: #be52ff; }
        .bull-sidebar-promo h3 span:last-child { color: #00f6ff; }

        .bull-sidebar-promo p {
          margin: 10px 0 14px;
          color: #747f98;
          font-size: 7.5px;
          line-height: 1.55;
        }

        .bull-sidebar-promo button {
          width: 100%;
          padding: 8px;
          border: 1px solid rgba(0, 246, 255, .48);
          border-radius: 5px;
          color: #aafaff;
          background: rgba(0, 246, 255, .025);
          font-size: 7px;
          font-weight: 800;
          letter-spacing: .12em;
        }

        .bull-main-stage {
          min-width: 0;
          width: 100%;
          overflow: hidden;
        }

        .bull-main-stage > .arena-page {
          width: 100% !important;
          max-width: none !important;
          min-width: 0;
        }

        .bull-section-placeholder {
          min-height: calc(100vh - 80px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px;
          border: 1px solid rgba(0, 246, 255, .12);
          background: radial-gradient(circle at 50% 25%, rgba(124, 48, 255, .09), transparent 38%), #03050c;
        }

        .bull-section-placeholder > div {
          width: min(560px, 100%);
          padding: 28px;
          border: 1px solid rgba(0, 246, 255, .2);
          border-radius: 10px;
          background: rgba(5, 8, 18, .88);
          text-align: center;
          box-shadow: 0 0 35px rgba(0, 246, 255, .04);
        }

        .bull-section-placeholder small {
          color: #00f6ff;
          font-size: 8px;
          letter-spacing: .2em;
        }

        .bull-section-placeholder h2 {
          margin: 10px 0 8px;
          color: #fff;
          font-size: 25px;
          letter-spacing: .08em;
        }

        .bull-section-placeholder p {
          margin: 0;
          color: #7b859d;
          font-size: 11px;
          line-height: 1.6;
        }

        @media (max-width: 980px) {
          .bull-terminal-shell {
            grid-template-columns: 1fr;
          }

          .bull-sidebar {
            border-right: 0;
            border-bottom: 1px solid rgba(0, 246, 255, 0.2);
          }

          .bull-sidebar-nav {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .bull-sidebar-promo {
            min-height: auto;
          }
        }

        @media (max-width: 620px) {
          .bull-sidebar-nav {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .bull-sidebar-button {
            min-height: 46px;
          }
        }
      `}</style>

      <div className="bull-terminal-shell">
        <aside className="bull-sidebar">
          <div className="bull-sidebar-title">BULL PROTOCOL TERMINAL</div>

          <nav className="bull-sidebar-nav" aria-label="Bull Protocol navigation">
            {SIDEBAR_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`bull-sidebar-button ${activeSection === item.id ? "active" : ""}`}
                onClick={() => setActiveSection(item.id)}
              >
                <span className="bull-sidebar-icon">{item.icon}</span>
                <span className="bull-sidebar-copy">
                  <strong>{item.label}</strong>
                  <small>{item.subtitle}</small>
                </span>
              </button>
            ))}
          </nav>

          <div className="bull-sidebar-promo">
            <img src="/bull-logo.png" alt="Bull Protocol" />
            <h3>
              <span>MORE MOMENTUM,</span><br />
              <span>LESS EMOTION</span>
            </h3>
            <p>
              Every move matters. Follow market momentum, choose your side and
              enter the active room.
            </p>
            <button type="button" onClick={() => setActiveSection("rooms")}>
              HOW IT WORKS?
            </button>
          </div>
        </aside>

        <div className="bull-main-stage">
          {activeSection === "rooms" ? (
            <main className="arena-page">
        <section
          className="battle-hero"
          style={{ backgroundImage: 'url("/arena-battle-bg.png.png")' }}
        >
          <img
            src="/arena-battle-bg.png.png"
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              zIndex: 0,
              pointerEvents: "none",
            }}
          />

          <div className="battle-energy battle-energy-left" />
          <div className="battle-energy battle-energy-right" />

          <svg
            className="energy-lines"
            viewBox="0 0 1600 520"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              className="energy-line purple-line line-one"
              d="M0 105 L150 92 L250 160 L350 95 L465 150 L570 125 L680 230 L800 260"
            />
            <path
              className="energy-line purple-line line-two"
              d="M0 350 L120 290 L230 330 L320 230 L430 270 L530 205 L640 245 L800 260"
            />
            <path
              className="energy-line cyan-line line-three"
              d="M1600 100 L1470 135 L1370 95 L1260 170 L1160 130 L1050 205 L930 210 L800 260"
            />
            <path
              className="energy-line cyan-line line-four"
              d="M1600 365 L1480 305 L1360 350 L1250 245 L1150 285 L1040 215 L930 250 L800 260"
            />
          </svg>

          <div className="active-room-badge">
            <span />
            ACTIVE ROOM
          </div>

          <div className="battle-center">
            <h1>
              <span className="shiba-title">SHIBA</span>
              <small>VS</small>
              <span className="doge-title">DOGE</span>
            </h1>

            <p>30 MINUTES • 100 PARTICIPANTS</p>
          </div>

          <div className="fighter fighter-shiba">
            <button
              className="token-orbit shiba-orbit"
              onClick={() => openEntry("SHIBA")}
              type="button"
            >
              <span className="orbit-ring orbit-ring-one" />
              <span className="orbit-ring orbit-ring-two" />

              <span className="token-image">
                <img src={SHIBA_LOGO} alt="SHIBA" />
              </span>
            </button>

            <div className="fighter-stats">
              <strong>SHIBA SIDE</strong>
              <span>50 PARTICIPANTS</span>
              <span>
                VOLUME DEX: <b>12.4M USDT</b>
              </span>
            </div>
          </div>

          <div className="fighter fighter-doge">
            <button
              className="token-orbit doge-orbit"
              onClick={() => openEntry("DOGE")}
              type="button"
            >
              <span className="orbit-ring orbit-ring-one" />
              <span className="orbit-ring orbit-ring-two" />

              <span className="token-image">
                <img src={DOGE_LOGO} alt="DOGE" />
              </span>
            </button>

            <div className="fighter-stats">
              <strong>DOGE SIDE</strong>
              <span>50 PARTICIPANTS</span>
              <span>
                VOLUME DEX: <b>10.8M USDT</b>
              </span>
            </div>
          </div>

          <div className="countdown">
            <span>TIME REMAINING</span>
            <strong>{formattedTime}</strong>
          </div>
        </section>

        <section className="chart-panel">
          <div className="chart-header">
            <div>
              <span className="chart-icon">↗</span>
              <strong>VOLUME ON DEX</strong>
              <small>(LAST 30 MIN)</small>
            </div>

            <div className="chart-tabs">
              {["TOTAL", "SHIBA", "DOGE"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={chartFilter === tab ? "active" : ""}
                  onClick={() => setChartFilter(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className={`volume-chart filter-${chartFilter.toLowerCase()}`}>
            <div className="y-axis">
              <span>25M</span>
              <span>20M</span>
              <span>15M</span>
              <span>10M</span>
              <span>5M</span>
              <span>0</span>
            </div>

            <svg
              viewBox="0 0 1400 360"
              preserveAspectRatio="none"
              className="chart-svg"
              aria-label="Volume chart preview"
            >
              <defs>
                <linearGradient
                  id="shibaFill"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#ff28ec" stopOpacity="0.42" />
                  <stop offset="100%" stopColor="#ff28ec" stopOpacity="0" />
                </linearGradient>

                <linearGradient
                  id="dogeFill"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#00f6ff" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#00f6ff" stopOpacity="0" />
                </linearGradient>
              </defs>

              <g className="chart-grid">
                <line x1="0" y1="20" x2="1400" y2="20" />
                <line x1="0" y1="84" x2="1400" y2="84" />
                <line x1="0" y1="148" x2="1400" y2="148" />
                <line x1="0" y1="212" x2="1400" y2="212" />
                <line x1="0" y1="276" x2="1400" y2="276" />
                <line x1="0" y1="340" x2="1400" y2="340" />

                <line x1="0" y1="20" x2="0" y2="340" />
                <line x1="280" y1="20" x2="280" y2="340" />
                <line x1="560" y1="20" x2="560" y2="340" />
                <line x1="840" y1="20" x2="840" y2="340" />
                <line x1="1120" y1="20" x2="1120" y2="340" />
                <line x1="1400" y1="20" x2="1400" y2="340" />
              </g>

              <path
                className="chart-area shiba-area"
                d="M0 270
                   L70 255
                   L140 238
                   L210 245
                   L280 210
                   L350 225
                   L420 250
                   L490 238
                   L560 260
                   L630 246
                   L700 235
                   L770 248
                   L840 232
                   L910 252
                   L980 225
                   L1050 210
                   L1120 225
                   L1190 208
                   L1260 195
                   L1330 175
                   L1400 160
                   L1400 340
                   L0 340 Z"
              />

              <path
                className="chart-area doge-area"
                d="M0 300
                   L70 292
                   L140 285
                   L210 300
                   L280 287
                   L350 280
                   L420 268
                   L490 270
                   L560 245
                   L630 225
                   L700 190
                   L770 175
                   L840 205
                   L910 168
                   L980 175
                   L1050 140
                   L1120 155
                   L1190 145
                   L1260 110
                   L1330 125
                   L1400 92
                   L1400 340
                   L0 340 Z"
              />

              <polyline
                className="chart-line shiba-chart-line"
                points="
                  0,270
                  70,255
                  140,238
                  210,245
                  280,210
                  350,225
                  420,250
                  490,238
                  560,260
                  630,246
                  700,235
                  770,248
                  840,232
                  910,252
                  980,225
                  1050,210
                  1120,225
                  1190,208
                  1260,195
                  1330,175
                  1400,160
                "
              />

              <polyline
                className="chart-line doge-chart-line"
                points="
                  0,300
                  70,292
                  140,285
                  210,300
                  280,287
                  350,280
                  420,268
                  490,270
                  560,245
                  630,225
                  700,190
                  770,175
                  840,205
                  910,168
                  980,175
                  1050,140
                  1120,155
                  1190,145
                  1260,110
                  1330,125
                  1400,92
                "
              />

              <circle
                className="chart-point doge-point"
                cx="1400"
                cy="92"
                r="7"
              />

              <circle
                className="chart-point shiba-point"
                cx="1400"
                cy="160"
                r="7"
              />
            </svg>

            <div className="chart-value doge-value">10.8M</div>
            <div className="chart-value shiba-value">12.4M</div>

            <div className="x-axis">
              <span>14:05</span>
              <span>14:10</span>
              <span>14:15</span>
              <span>14:20</span>
              <span>14:25</span>
              <span>14:30</span>
            </div>
          </div>

          <div className="chart-footer">
            <div className="chart-legends">
              <span className="legend-shiba">
                <i />
                Shiba (12.4M)
              </span>

              <span className="legend-doge">
                <i />
                Doge (10.8M)
              </span>
            </div>

            <span className="data-note">MARKET DATA PREVIEW</span>
          </div>
        </section>

        <section className="arena-actions">
          <button
            type="button"
            className="side-action shiba-action"
            onClick={() => openEntry("SHIBA")}
          >
            <img src={SHIBA_LOGO} alt="" />
            <span>
              <small>CHOOSE YOUR SIDE</small>
              <strong>ENTER SHIBA</strong>
            </span>
          </button>

          <div className="arena-message">
            <span>THE MARKET DECIDES</span>
            <strong>MOMENTUM WINS</strong>
          </div>

          <button
            type="button"
            className="side-action doge-action"
            onClick={() => openEntry("DOGE")}
          >
            <span>
              <small>CHOOSE YOUR SIDE</small>
              <strong>ENTER DOGE</strong>
            </span>
            <img src={DOGE_LOGO} alt="" />
          </button>
        </section>
            </main>
          ) : (
            <section className="bull-section-placeholder">
              <div>
                <small>BULL PROTOCOL</small>
                <h2>{SIDEBAR_ITEMS.find((item) => item.id === activeSection)?.label}</h2>
                <p>
                  This section is preserved in the terminal navigation and will be
                  connected to its full data and actions as the platform modules are completed.
                </p>
              </div>
            </section>
          )}
        </div>
      </div>

      {showEntry && (
        <div
          className="entry-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowEntry(false);
            }
          }}
        >
          <div className="entry-modal">
            <button
              className="modal-close"
              type="button"
              onClick={() => setShowEntry(false)}
              aria-label="Close"
            >
              ×
            </button>

            <span className="modal-label">ENTER THE ROOM</span>
            <h2>Choose Your Side</h2>

            <div className="modal-sides">
              <button
                type="button"
                className={selectedSide === "SHIBA" ? "selected shiba" : ""}
                onClick={() => setSelectedSide("SHIBA")}
              >
                <img src={SHIBA_LOGO} alt="SHIBA" />
                <strong>SHIBA</strong>
              </button>

              <button
                type="button"
                className={selectedSide === "DOGE" ? "selected doge" : ""}
                onClick={() => setSelectedSide("DOGE")}
              >
                <img src={DOGE_LOGO} alt="DOGE" />
                <strong>DOGE</strong>
              </button>
            </div>

            <label className="amount-field">
              <span>ENTRY AMOUNT</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="0.00"
              />
            </label>

            {!connected ? (
              <div className="modal-wallet">
                <WalletMultiButton />
              </div>
            ) : (
              <button
                className="confirm-entry"
                type="button"
                onClick={handleEntry}
              >
                ENTER {selectedSide || "ROOM"} →
              </button>
            )}

            {message && <p className="entry-message">{message}</p>}

            <p className="transaction-notice">
              No transaction will be submitted until the room transaction
              layer is connected.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
function OpeningScreen() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background:
          "radial-gradient(circle at 30% 50%, rgba(145, 0, 255, 0.22), transparent 35%), radial-gradient(circle at 70% 50%, rgba(0, 255, 140, 0.18), transparent 35%), #020306",
      }}
    >
      <style>{`
        @keyframes openingBullFloat {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-10px) scale(1.03);
          }
        }

        @keyframes openingPulse {
          0%, 100% {
            transform: scale(0.95);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.08);
            opacity: 1;
          }
        }

        @keyframes openingRotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes openingLoad {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
      `}</style>

      <div
        style={{
          position: "absolute",
          width: "520px",
          height: "520px",
          borderRadius: "50%",
          background:
            "conic-gradient(from 0deg, rgba(0,255,140,.7), rgba(145,0,255,.7), rgba(0,255,140,.7))",
          filter: "blur(80px)",
          opacity: 0.3,
          animation: "openingRotate 5s linear infinite",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "390px",
          height: "390px",
          borderRadius: "50%",
          border: "1px solid rgba(0,255,140,.7)",
          boxShadow:
            "0 0 30px rgba(0,255,140,.5), inset 0 0 35px rgba(145,0,255,.35)",
          animation: "openingPulse 1.8s ease-in-out infinite",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <img
          src="/bull-logo.png"
          alt="Bull Protocol"
          style={{
            width: "min(300px, 65vw)",
            height: "300px",
            objectFit: "contain",
            filter:
              "drop-shadow(0 0 15px #00ff8c) drop-shadow(0 0 35px #9100ff)",
            animation: "openingBullFloat 2s ease-in-out infinite",
          }}
        />

        <div
          style={{
            marginTop: "20px",
            color: "#ffffff",
            fontSize: "clamp(28px, 4vw, 52px)",
            fontWeight: 900,
            letterSpacing: "0.16em",
            textShadow:
              "0 0 12px #00ff8c, 0 0 30px rgba(145,0,255,.9)",
          }}
        >
          BULL PROTOCOL
        </div>

        <div
          style={{
            marginTop: "8px",
            color: "#9dffd1",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.45em",
          }}
        >
          MOMENTUM WINS
        </div>


        <div
          style={{
            width: "230px",
            height: "3px",
            marginTop: "30px",
            overflow: "hidden",
            background: "rgba(255,255,255,.08)",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              transformOrigin: "left",
              background:
                "linear-gradient(90deg, #9100ff, #00ff8c, #9100ff)",
              boxShadow: "0 0 15px #00ff8c",
              animation: "openingLoad 5s linear forwards",
            }}
          />
        </div>

        <div
          style={{
            marginTop: "12px",
            color: "rgba(255,255,255,.5)",
            fontSize: "9px",
            letterSpacing: "0.3em",
          }}
        >
          INITIALIZING TRADING TERMINAL
        </div>
      </div>
    </div>
  );
}
export default function App() {
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );
  const [showOpening, setShowOpening] = useState(true);

  useEffect(() => {
    const openingTimer = setTimeout(() => {
      setShowOpening(false);
    }, 5000);

    return () => {
      clearTimeout(openingTimer);
    };
  }, []);
  return (
    <ConnectionProvider endpoint={ENDPOINT}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {showOpening ? <OpeningScreen /> : <Arena />}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
