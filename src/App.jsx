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

function Arena() {
  const { connected, publicKey } = useWallet();

  const [secondsLeft, setSecondsLeft] = useState(28 * 60 + 17);
  const [chartFilter, setChartFilter] = useState("TOTAL");
  const [selectedSide, setSelectedSide] = useState(null);
  const [showEntry, setShowEntry] = useState(false);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

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

      <main className="arena-page">
        <section
          className="battle-hero"
          style={{ backgroundImage: 'url("/arena-battle-bg.png.png")' }}
        >
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

export default function App() {
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );

  return (
    <ConnectionProvider endpoint={ENDPOINT}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Arena />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
