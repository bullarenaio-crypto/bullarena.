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
import * as SolanaWalletAdapters from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

const ENDPOINT = clusterApiUrl("mainnet-beta");


// Build the broadest Solana wallet list available from the installed
// @solana/wallet-adapter-wallets package. Wallets that implement the
// Solana Wallet Standard are also discovered automatically by WalletProvider.
// MetaMask is intentionally excluded from Bull Protocol.
function createSupportedWalletAdapters() {
  const excludedExports = new Set(["UnsafeBurnerWalletAdapter"]);
  const seenWalletNames = new Set();

  return Object.entries(SolanaWalletAdapters)
    .filter(
      ([exportName, AdapterClass]) =>
        exportName.endsWith("WalletAdapter") &&
        !excludedExports.has(exportName) &&
        !exportName.toLowerCase().includes("metamask") &&
        typeof AdapterClass === "function"
    )
    .map(([, AdapterClass]) => {
      try {
        const adapter = new AdapterClass();
        const walletName = String(adapter?.name || "");

        if (!walletName || /meta\s*mask/i.test(walletName)) return null;
        if (seenWalletNames.has(walletName)) return null;

        seenWalletNames.add(walletName);
        return adapter;
      } catch {
        // Some legacy adapters require project-specific configuration.
        // Wallet Standard compatible wallets remain available automatically.
        return null;
      }
    })
    .filter(Boolean);
}

function RemoveMetaMaskWalletOption() {
  useEffect(() => {
    const removeStoredMetaMaskSelection = () => {
      try {
        const selectedWallet = window.localStorage.getItem("walletName");
        if (selectedWallet && /meta\s*mask/i.test(selectedWallet)) {
          window.localStorage.removeItem("walletName");
        }
      } catch {
        // Ignore storage restrictions from private browsers.
      }
    };

    const hideMetaMaskEntries = () => {
      document
        .querySelectorAll(
          ".wallet-adapter-modal-list li, .wallet-adapter-modal-list .wallet-adapter-button"
        )
        .forEach((element) => {
          if (/meta\s*mask/i.test(element.textContent || "")) {
            const listItem = element.closest("li");
            if (listItem) {
              listItem.style.display = "none";
              listItem.setAttribute("aria-hidden", "true");
            } else {
              element.style.display = "none";
              element.setAttribute("aria-hidden", "true");
            }
          }
        });
    };

    removeStoredMetaMaskSelection();
    hideMetaMaskEntries();

    const observer = new MutationObserver(hideMetaMaskEntries);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null;
}

const SHIBA_LOGO =
  "https://s2.coinmarketcap.com/static/img/coins/128x128/5994.png";

const DOGE_LOGO =
  "https://s2.coinmarketcap.com/static/img/coins/128x128/74.png";

const SIDEBAR_ITEMS = [
  { id: "rooms", label: "Rooms", subtitle: "Join battles", icon: "⚔" },
  { id: "profile", label: "My Profile", subtitle: "Wallet & history", icon: "◉" },
  { id: "launchpad", label: "Launchpad", subtitle: "Launch new projects", icon: "◆" },
  { id: "leaderboard", label: "Leaderboard", subtitle: "Top traders", icon: "♛" },
  { id: "rewards", label: "Rewards", subtitle: "XP & achievements", icon: "✦" },
  { id: "settings", label: "Settings", subtitle: "Preferences", icon: "⚙" },
];

const ROOM_PARTICIPANTS = [
  { name: "ShibaTeam_97...", side: "SHIBA", time: "2 min" },
  { name: "DogeWolf_72...", side: "DOGE", time: "2 min" },
  { name: "CryptoLuna", side: "SHIBA", time: "3 min" },
  { name: "TraderAlpha", side: "DOGE", time: "4 min" },
  { name: "BullMaster", side: "SHIBA", time: "5 min" },
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
  const [dashboardOpen, setDashboardOpen] = useState(true);

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
          display: block;
          width: 100%;
          min-width: 0;
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

        .bull-right-sidebar {
          min-width: 0;
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          border-left: 1px solid rgba(0, 246, 255, 0.2);
          border-top: 1px solid rgba(143, 64, 255, 0.13);
          background:
            radial-gradient(circle at 50% 0%, rgba(0, 246, 255, 0.06), transparent 28%),
            linear-gradient(180deg, rgba(6, 9, 20, 0.98), rgba(3, 5, 13, 0.98));
          box-shadow: inset 10px 0 30px rgba(0, 246, 255, 0.018);
        }

        .bull-right-card {
          border: 1px solid rgba(0, 164, 255, 0.22);
          border-radius: 8px;
          background:
            linear-gradient(180deg, rgba(8, 12, 27, 0.96), rgba(4, 7, 17, 0.96));
          box-shadow:
            0 0 22px rgba(0, 246, 255, 0.025),
            inset 0 0 22px rgba(117, 50, 255, 0.025);
        }

        .bull-room-card {
          padding: 12px;
        }

        .bull-room-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding-bottom: 9px;
          border-bottom: 1px solid rgba(100, 151, 206, 0.12);
        }

        .bull-room-number {
          padding: 4px 7px;
          border-radius: 4px;
          background: rgba(255,255,255,.035);
          color: #75829a;
          font-size: 7px;
          font-weight: 800;
          letter-spacing: .08em;
        }

        .bull-room-live {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #42f2a0;
          font-size: 6.5px;
          font-weight: 800;
          letter-spacing: .07em;
        }

        .bull-room-live i {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #29f39a;
          box-shadow: 0 0 9px rgba(41, 243, 154, .85);
        }

        .bull-room-card h3 {
          margin: 12px 0 3px;
          color: #f4f8ff;
          font-size: 14px;
          letter-spacing: .02em;
        }

        .bull-room-card > p {
          margin: 0;
          color: #67758e;
          font-size: 7px;
          line-height: 1.4;
        }

        .bull-room-facts {
          margin-top: 11px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 7px;
        }

        .bull-room-fact {
          min-width: 0;
          padding: 9px 8px;
          border: 1px solid rgba(70, 130, 192, .14);
          border-radius: 6px;
          background: rgba(3, 7, 17, .65);
        }

        .bull-room-fact small,
        .bull-network-row small {
          display: block;
          color: #52617a;
          font-size: 6px;
          letter-spacing: .03em;
        }

        .bull-room-fact strong {
          display: block;
          margin-top: 3px;
          color: #cfe8f7;
          font-size: 8px;
        }

        .bull-network-row {
          margin-top: 8px;
          padding: 8px 2px 2px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .bull-network-row strong {
          color: #a8ddea;
          font-size: 7px;
          letter-spacing: .06em;
        }

        .bull-enter-room {
          width: 100%;
          margin-top: 12px;
          padding: 11px 10px;
          border: 1px solid rgba(0, 246, 255, .3);
          border-radius: 6px;
          color: #fff;
          background: linear-gradient(90deg, #7927ef, #6639ff 52%, #00b9d9);
          box-shadow: 0 0 18px rgba(119, 47, 255, .28);
          font-size: 8px;
          font-weight: 900;
          letter-spacing: .12em;
          cursor: pointer;
        }

        .bull-participants-card {
          padding: 11px;
        }

        .bull-participants-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .bull-participants-heading strong {
          color: #e9f5ff;
          font-size: 8px;
          letter-spacing: .1em;
        }

        .bull-participants-heading span {
          padding: 2px 5px;
          border: 1px solid rgba(0, 245, 216, .24);
          border-radius: 3px;
          color: #00f5d8;
          font-size: 5px;
          letter-spacing: .08em;
        }

        .bull-team-totals {
          margin-top: 10px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
        }

        .bull-team-total {
          min-width: 0;
          display: grid;
          grid-template-columns: 32px 1fr;
          align-items: center;
          gap: 6px;
          padding: 7px;
          border-radius: 6px;
          background: rgba(3, 8, 19, .78);
        }

        .bull-team-total.shiba {
          border: 1px solid rgba(240, 51, 233, .28);
        }

        .bull-team-total.doge {
          border: 1px solid rgba(21, 232, 232, .28);
        }

        .bull-team-total img {
          width: 30px;
          height: 30px;
          padding: 2px;
          border-radius: 50%;
          object-fit: cover;
          background: #06101f;
        }

        .bull-team-total.shiba img {
          border: 1px solid #ef36e6;
          box-shadow: 0 0 8px rgba(239, 54, 230, .4);
        }

        .bull-team-total.doge img {
          border: 1px solid #16e8e8;
          box-shadow: 0 0 8px rgba(22, 232, 232, .4);
        }

        .bull-team-total span {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 1px;
          font-size: 6px;
          font-weight: 800;
        }

        .bull-team-total.shiba span { color: #f44bec; }
        .bull-team-total.doge span { color: #27e8e9; }

        .bull-team-total b {
          color: #eaf8ff;
          font-size: 13px;
        }

        .bull-participant-list {
          margin-top: 7px;
        }

        .bull-participant-row {
          min-height: 39px;
          display: grid;
          grid-template-columns: 27px minmax(0,1fr) auto;
          align-items: center;
          gap: 7px;
          border-bottom: 1px solid rgba(0, 120, 190, .13);
        }

        .bull-participant-avatar {
          width: 25px;
          height: 25px;
          display: grid;
          place-items: center;
          overflow: hidden;
          border-radius: 50%;
          border: 1px solid rgba(0, 180, 255, .35);
          background: #07152a;
        }

        .bull-participant-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .bull-participant-copy {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .bull-participant-copy strong {
          overflow: hidden;
          color: #cfe4f1;
          font-size: 7px;
          font-weight: 650;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .bull-participant-copy small {
          overflow: hidden;
          color: #5a718a;
          font-size: 5.5px;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .bull-participant-copy small.shiba { color: #bd58bb; }
        .bull-participant-copy small.doge { color: #52b7bb; }

        .bull-participant-row time {
          color: #5f9db8;
          font-size: 5.5px;
        }

        .bull-view-participants {
          width: 100%;
          margin-top: 8px;
          padding: 5px 0 0;
          border: 0;
          background: transparent;
          color: #68b4d1;
          text-align: left;
          font-size: 6.5px;
          cursor: pointer;
        }

        .bull-view-participants span {
          color: #00e9f0;
        }

        .bull-right-brand {
          min-height: 78px;
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 1px solid rgba(0, 173, 255, .12);
          border-radius: 8px;
          background: rgba(4, 7, 16, .72);
        }

        .bull-right-brand img {
          width: 40px;
          height: 40px;
          object-fit: contain;
          filter: drop-shadow(0 0 9px rgba(0, 246, 255, .5));
        }

        .bull-right-brand-copy {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .bull-right-brand-copy strong {
          color: #f4f8ff;
          font-size: 8px;
          letter-spacing: .08em;
        }

        .bull-right-brand-copy small {
          color: #60748a;
          font-size: 5.5px;
          letter-spacing: .12em;
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

        /* =========================================================
           CENTER CONTENT PROPORTIONS - MATCH REFERENCE
        ========================================================= */
        .bull-main-stage .chart-panel {
          width: 100%;
          max-width: 100%;
          min-width: 0;
          padding: 9px 10px 7px;
          overflow: visible;
        }

        .bull-main-stage .volume-chart {
          position: relative;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          height: 188px;
          overflow: visible;
        }

        .bull-main-stage .chart-svg {
          display: block;
          width: 100%;
          height: 160px;
        }

        .bull-main-stage .chart-footer {
          margin-top: 3px;
          min-height: 18px;
        }

        .bull-main-stage .information-grid {
          width: 100%;
          display: grid;
          grid-template-columns: 0.78fr 1.22fr;
          gap: 9px;
        }

        .bull-main-stage .bottom-steps {
          width: 100%;
          margin-top: 0;
        }

        @media (max-width: 1180px) {
          .bull-terminal-shell {
            grid-template-columns: 170px minmax(0, 1fr) 210px;
          }

          .bull-sidebar {
            padding-left: 7px;
            padding-right: 7px;
          }

          .bull-right-sidebar {
            padding-left: 7px;
            padding-right: 7px;
          }
        }

        @media (max-width: 980px) {
          .bull-terminal-shell {
            grid-template-columns: 1fr;
          }

          .bull-sidebar {
            border-right: 0;
            border-bottom: 1px solid rgba(0, 246, 255, 0.2);
          }

          .bull-right-sidebar {
            border-left: 0;
            border-top: 1px solid rgba(0, 246, 255, 0.2);
            display: grid;
            grid-template-columns: 1fr 1fr;
            align-items: start;
          }

          .bull-right-brand {
            grid-column: 1 / -1;
            margin-top: 0;
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
          .bull-right-sidebar {
            grid-template-columns: 1fr;
          }

          .bull-right-brand {
            grid-column: auto;
          }

          .bull-sidebar-nav {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .bull-sidebar-button {
            min-height: 46px;
          }
        }

        /* =========================================================
           RESPONSIVE SIZE FIX - DESKTOP / TABLET / MOBILE
        ========================================================= */
        @media (max-width: 980px) {
          html,
          body,
          #root {
            width: 100%;
            max-width: 100%;
            overflow-x: hidden;
            -webkit-text-size-adjust: 100%;
            text-size-adjust: 100%;
          }

          .terminal {
            width: 100%;
            max-width: 100vw;
            overflow-x: hidden;
          }

          .terminal-header {
            width: 100%;
            height: auto;
            min-height: 58px;
            padding: 8px 10px;
            gap: 8px;
            flex-wrap: wrap;
          }

          .brand {
            min-width: 0;
            flex: 1 1 220px;
            gap: 6px;
          }

          .brand-logo {
            width: 36px;
            height: 36px;
            flex: 0 0 36px;
          }

          .brand-logo img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }

          .brand-copy strong {
            font-size: 10px;
          }

          .brand-copy span {
            font-size: 6px;
          }

          .terminal-title strong {
            font-size: 9px;
          }

          .terminal-title span {
            font-size: 5.5px;
          }

          .header-actions {
            gap: 5px;
            flex-wrap: wrap;
          }

          .online-status,
          .wallet-address {
            min-height: 28px;
            padding: 0 8px;
            font-size: 7px;
          }

          .wallet-adapter-button {
            height: 32px !important;
            min-height: 32px !important;
            padding: 0 10px !important;
            font-size: 8px !important;
          }

          .bull-terminal-shell {
            grid-template-columns: minmax(0, 1fr) !important;
            width: 100% !important;
            max-width: 100vw !important;
            min-width: 0 !important;
            gap: 8px !important;
          }

          .bull-sidebar,
          .bull-main-stage,
          .bull-right-sidebar {
            width: 100% !important;
            max-width: 100% !important;
            min-width: 0 !important;
          }

          .bull-sidebar {
            padding: 8px !important;
          }

          .bull-sidebar-title {
            padding: 4px 4px 8px !important;
            font-size: 7px !important;
          }

          .bull-sidebar-nav {
            display: grid !important;
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
            gap: 5px !important;
          }

          .bull-sidebar-button {
            min-height: 44px !important;
            grid-template-columns: 22px minmax(0, 1fr) !important;
            gap: 5px !important;
            padding: 6px !important;
          }

          .bull-sidebar-icon {
            font-size: 13px !important;
          }

          .bull-sidebar-copy strong {
            font-size: 7px !important;
          }

          .bull-sidebar-copy small {
            font-size: 5.7px !important;
          }

          .bull-sidebar-promo {
            min-height: auto !important;
            margin-top: 8px !important;
            padding: 10px !important;
          }

          .bull-sidebar-promo img {
            width: 38px !important;
            height: 38px !important;
          }

          .bull-sidebar-promo h3 {
            font-size: 9px !important;
          }

          .bull-sidebar-promo p {
            margin: 7px 0 9px !important;
            font-size: 7px !important;
          }

          .bull-main-stage {
            overflow: hidden !important;
          }

          .arena-page {
            width: 100% !important;
            max-width: 100% !important;
            min-width: 0 !important;
            margin: 0 !important;
            padding: 0 6px 6px !important;
            overflow: hidden !important;
          }

          .battle-hero {
            width: 100% !important;
            max-width: 100% !important;
            min-width: 0 !important;
            height: 330px !important;
            min-height: 330px !important;
          }

          .battle-center h1 {
            font-size: clamp(22px, 7vw, 34px) !important;
          }

          .battle-center p {
            font-size: 7px !important;
          }

          .fighter {
            gap: 4px !important;
          }

          .token-orbit {
            width: 84px !important;
            height: 84px !important;
            min-width: 84px !important;
            min-height: 84px !important;
          }

          .token-image img {
            width: 58px !important;
            height: 58px !important;
          }

          .fighter-stats strong {
            font-size: 9px !important;
          }

          .fighter-stats span {
            font-size: 7px !important;
          }

          .countdown {
            min-width: 140px !important;
            padding: 9px 12px !important;
          }

          .countdown span {
            font-size: 6px !important;
          }

          .countdown strong {
            font-size: 24px !important;
          }

          .chart-panel {
            width: 100% !important;
            max-width: 100% !important;
            min-width: 0 !important;
            padding: 10px 8px !important;
            overflow: hidden !important;
          }

          .chart-header {
            width: 100% !important;
            min-width: 0 !important;
            flex-wrap: wrap !important;
            gap: 8px !important;
          }

          .chart-tabs {
            flex-wrap: wrap !important;
          }

          .volume-chart {
            width: 100% !important;
            max-width: 100% !important;
            min-width: 0 !important;
            height: 190px !important;
            overflow: visible !important;
          }

          .chart-svg {
            width: 100% !important;
            max-width: 100% !important;
            min-width: 0 !important;
            height: 158px !important;
          }

          .x-axis,
          .chart-footer {
            width: 100% !important;
            min-width: 0 !important;
          }

          .information-grid {
            width: 100% !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 7px !important;
          }

          .how-it-works,
          .room-statistics {
            min-height: auto !important;
          }

          .bottom-steps {
            width: 100% !important;
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          }

          .bottom-step {
            min-width: 0 !important;
          }

          .bull-right-sidebar {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            padding: 8px !important;
          }

          .bull-right-card {
            min-width: 0 !important;
          }

          .entry-modal {
            width: min(94vw, 460px) !important;
            max-width: 94vw !important;
            max-height: 88vh !important;
            overflow-y: auto !important;
          }
        }

        @media (max-width: 720px) {
          .bull-main-stage .information-grid {
            grid-template-columns: 1fr !important;
          }

          .bull-main-stage .bottom-steps {
            grid-template-columns: 1fr !important;
          }

          .bull-main-stage .bottom-step {
            min-height: 52px !important;
            border-right: 0 !important;
            border-bottom: 1px solid rgba(0, 133, 224, 0.35) !important;
          }

          .bull-main-stage .bottom-step:last-child {
            border-bottom: 0 !important;
          }

          .bull-main-stage .bottom-step small {
            white-space: normal !important;
          }

          .bull-main-stage .volume-chart {
            height: 172px !important;
          }

          .bull-main-stage .chart-svg {
            height: 142px !important;
          }

          .bull-main-stage .chart-footer {
            margin-top: 5px !important;
          }
        }

        @media (max-width: 620px) {
          .terminal-header {
            align-items: flex-start !important;
          }

          .brand {
            width: 100% !important;
            flex: 1 1 100% !important;
          }

          .header-actions {
            width: 100% !important;
            justify-content: flex-start !important;
          }

          .bull-sidebar-nav {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }

          .bull-right-sidebar {
            grid-template-columns: 1fr !important;
          }

          .battle-hero {
            height: 300px !important;
            min-height: 300px !important;
          }

          .token-orbit {
            width: 70px !important;
            height: 70px !important;
            min-width: 70px !important;
            min-height: 70px !important;
          }

          .token-image img {
            width: 48px !important;
            height: 48px !important;
          }

          .battle-center h1 {
            font-size: clamp(20px, 6vw, 28px) !important;
          }

          .countdown {
            min-width: 120px !important;
          }

          .countdown strong {
            font-size: 21px !important;
          }

          .volume-chart {
            height: 220px !important;
          }

          .chart-tabs button {
            padding: 5px 7px !important;
            font-size: 6.5px !important;
          }

          .chart-footer {
            flex-wrap: wrap !important;
            gap: 6px !important;
          }
        }

        /* =========================================================
           PIXEL-MATCH CENTER / DESKTOP STABILITY
           Isolated class names prevent old style.css rules from
           stretching the chart and lower dashboard panels.
        ========================================================= */

        .bull-reference-center {
          box-sizing: border-box !important;
          width: 100% !important;
          min-width: 0 !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 8px !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow: visible !important;
        }

        /* ---------- REFERENCE CHART ---------- */
        .bull-ref-chart {
          box-sizing: border-box !important;
          width: 100% !important;
          height: 198px !important;
          min-height: 198px !important;
          max-height: 198px !important;
          padding: 8px 9px 6px !important;
          overflow: hidden !important;
          border: 1px solid rgba(0, 177, 255, .58) !important;
          border-radius: 8px !important;
          background:
            linear-gradient(180deg, rgba(3, 13, 31, .98), rgba(2, 8, 22, .98)) !important;
          box-shadow:
            inset 0 0 22px rgba(0, 143, 255, .035),
            0 0 0 1px rgba(0, 235, 255, .015) !important;
          position: relative !important;
        }

        .bull-ref-chart-header {
          height: 25px !important;
          min-height: 25px !important;
          display: flex !important;
          align-items: flex-start !important;
          justify-content: space-between !important;
          gap: 8px !important;
        }

        .bull-ref-chart-header > div:first-child {
          min-width: 0 !important;
          display: flex !important;
          align-items: center !important;
          gap: 5px !important;
          color: #dff6ff !important;
          white-space: nowrap !important;
        }

        .bull-ref-chart-icon {
          color: #00edf2 !important;
          font-size: 9px !important;
          line-height: 1 !important;
        }

        .bull-ref-chart-header strong {
          font-size: 8px !important;
          line-height: 1 !important;
          letter-spacing: .02em !important;
          color: #dff6ff !important;
        }

        .bull-ref-chart-header small {
          margin-left: 2px !important;
          font-size: 5.5px !important;
          color: #769bb4 !important;
        }

        .bull-ref-chart-tabs {
          display: flex !important;
          align-items: center !important;
          gap: 4px !important;
          flex-wrap: nowrap !important;
        }

        .bull-ref-chart-tabs button {
          min-width: 42px !important;
          height: 21px !important;
          padding: 0 7px !important;
          border: 1px solid rgba(0, 137, 221, .46) !important;
          border-radius: 5px !important;
          background: rgba(1, 9, 23, .9) !important;
          color: #6f94ae !important;
          font-size: 5.5px !important;
          font-weight: 800 !important;
          cursor: pointer !important;
        }

        .bull-ref-chart-tabs button.active {
          border-color: #00dfe9 !important;
          color: #18f4f5 !important;
          background: rgba(0, 214, 229, .13) !important;
          box-shadow: inset 0 0 10px rgba(0, 236, 255, .07) !important;
        }

        .bull-ref-volume {
          position: relative !important;
          box-sizing: border-box !important;
          width: 100% !important;
          height: 143px !important;
          min-height: 143px !important;
          margin-top: 1px !important;
          padding: 0 0 17px 28px !important;
          overflow: hidden !important;
        }

        .bull-ref-y-axis {
          position: absolute !important;
          top: 1px !important;
          bottom: 17px !important;
          left: 0 !important;
          width: 24px !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: space-between !important;
          align-items: flex-end !important;
          z-index: 3 !important;
        }

        .bull-ref-y-axis span,
        .bull-ref-x-axis span {
          font-size: 5px !important;
          line-height: 1 !important;
          color: #638aa4 !important;
          white-space: nowrap !important;
        }

        .bull-ref-chart-svg {
          position: absolute !important;
          left: 28px !important;
          right: 0 !important;
          top: 0 !important;
          width: calc(100% - 28px) !important;
          height: 123px !important;
          display: block !important;
          overflow: visible !important;
        }

        .bull-ref-chart-grid line {
          stroke: rgba(0, 101, 177, .20) !important;
          stroke-width: 1 !important;
          vector-effect: non-scaling-stroke !important;
        }

        .bull-ref-area {
          stroke: none !important;
        }

        .bull-ref-area.shiba-area {
          fill: url(#shibaFill) !important;
        }

        .bull-ref-area.doge-area {
          fill: url(#dogeFill) !important;
        }

        .bull-ref-line {
          fill: none !important;
          stroke-width: 1.65 !important;
          vector-effect: non-scaling-stroke !important;
        }

        .bull-ref-line.shiba-chart-line {
          stroke: #ff21e8 !important;
          filter: drop-shadow(0 0 3px rgba(255, 33, 232, .7)) !important;
        }

        .bull-ref-line.doge-chart-line {
          stroke: #00eee8 !important;
          filter: drop-shadow(0 0 3px rgba(0, 238, 232, .7)) !important;
        }

        .bull-ref-point.doge-point {
          fill: #00f0e9 !important;
          filter: drop-shadow(0 0 4px #00f0e9) !important;
        }

        .bull-ref-point.shiba-point {
          fill: #f627e8 !important;
          filter: drop-shadow(0 0 4px #f627e8) !important;
        }

        .bull-ref-value {
          position: absolute !important;
          right: 0 !important;
          z-index: 5 !important;
          min-width: 29px !important;
          padding: 2px 4px !important;
          border-radius: 2px 0 0 2px !important;
          font-size: 5.5px !important;
          font-weight: 900 !important;
          line-height: 1.2 !important;
          text-align: center !important;
        }

        .bull-ref-value.doge-value {
          top: 38px !important;
          color: #002f31 !important;
          background: #18efe7 !important;
        }

        .bull-ref-value.shiba-value {
          top: 61px !important;
          color: #fff !important;
          background: #ca26db !important;
        }

        .bull-ref-x-axis {
          position: absolute !important;
          left: 28px !important;
          right: 0 !important;
          bottom: 1px !important;
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          z-index: 4 !important;
        }

        .bull-ref-chart-footer {
          height: 17px !important;
          min-height: 17px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          gap: 8px !important;
          padding-left: 28px !important;
          overflow: hidden !important;
        }

        .bull-ref-legends {
          min-width: 0 !important;
          display: flex !important;
          align-items: center !important;
          gap: 10px !important;
        }

        .bull-ref-legends span {
          display: inline-flex !important;
          align-items: center !important;
          gap: 4px !important;
          color: #89a9bc !important;
          font-size: 5.5px !important;
          white-space: nowrap !important;
        }

        .bull-ref-legends i {
          width: 6px !important;
          height: 6px !important;
          border-radius: 50% !important;
          display: inline-block !important;
        }

        .bull-ref-legends .legend-shiba i {
          background: #f426e7 !important;
          box-shadow: 0 0 5px #f426e7 !important;
        }

        .bull-ref-legends .legend-doge i {
          background: #00ece6 !important;
          box-shadow: 0 0 5px #00ece6 !important;
        }

        .bull-ref-data-note {
          color: #5f7f96 !important;
          font-size: 5px !important;
          letter-spacing: .08em !important;
          white-space: nowrap !important;
        }

        .bull-ref-volume.filter-shiba .doge-area,
        .bull-ref-volume.filter-shiba .doge-chart-line,
        .bull-ref-volume.filter-shiba .doge-point {
          opacity: .14 !important;
        }

        .bull-ref-volume.filter-doge .shiba-area,
        .bull-ref-volume.filter-doge .shiba-chart-line,
        .bull-ref-volume.filter-doge .shiba-point {
          opacity: .14 !important;
        }

        /* ---------- REFERENCE LOWER PANELS ---------- */
        .bull-ref-info-grid {
          box-sizing: border-box !important;
          width: 100% !important;
          height: 144px !important;
          min-height: 144px !important;
          max-height: 144px !important;
          display: grid !important;
          grid-template-columns: .78fr 1.22fr !important;
          gap: 8px !important;
          align-items: stretch !important;
        }

        .bull-ref-panel {
          box-sizing: border-box !important;
          position: relative !important;
          min-width: 0 !important;
          overflow: hidden !important;
          border: 1px solid rgba(0, 150, 255, .60) !important;
          border-radius: 8px !important;
          background:
            linear-gradient(180deg, rgba(4, 15, 35, .985), rgba(2, 9, 23, .985)) !important;
          box-shadow:
            inset 0 0 22px rgba(0, 105, 255, .025),
            0 0 0 1px rgba(0, 230, 255, .018) !important;
        }

        .bull-ref-how,
        .bull-ref-stats {
          height: 144px !important;
          min-height: 144px !important;
          max-height: 144px !important;
          padding: 9px 10px !important;
        }

        .bull-ref-how h2,
        .bull-ref-stats h2 {
          margin: 0 0 6px !important;
          color: #ddf4ff !important;
          font-size: 9px !important;
          line-height: 1 !important;
          letter-spacing: .025em !important;
        }

        .bull-ref-instruction {
          min-height: 23px !important;
          display: flex !important;
          align-items: center !important;
          gap: 6px !important;
          margin: 2px 0 !important;
        }

        .bull-ref-num {
          width: 18px !important;
          height: 18px !important;
          flex: 0 0 18px !important;
          display: grid !important;
          place-items: center !important;
          border: 1px solid #829eb7 !important;
          border-radius: 50% !important;
          color: #e3efff !important;
          font-size: 7px !important;
          line-height: 1 !important;
        }

        .bull-ref-instruction p {
          min-width: 0 !important;
          margin: 0 !important;
          display: flex !important;
          flex-direction: column !important;
          line-height: 1.05 !important;
        }

        .bull-ref-instruction strong {
          color: #dfefff !important;
          font-size: 7px !important;
          font-weight: 700 !important;
        }

        .bull-ref-instruction small {
          margin-top: 1px !important;
          color: #6fa2bf !important;
          font-size: 6px !important;
        }

        .bull-ref-notice {
          min-height: 28px !important;
          margin-top: 5px !important;
          padding: 4px 6px !important;
          display: flex !important;
          align-items: center !important;
          gap: 6px !important;
          border: 1px solid rgba(255, 182, 0, .43) !important;
          border-radius: 4px !important;
          background: rgba(255, 166, 0, .035) !important;
        }

        .bull-ref-notice > span {
          width: 17px !important;
          height: 17px !important;
          flex: 0 0 17px !important;
          display: grid !important;
          place-items: center !important;
          border: 1px solid #ffc000 !important;
          border-radius: 50% !important;
          color: #ffc000 !important;
          font-size: 7px !important;
          font-weight: 900 !important;
        }

        .bull-ref-notice p {
          margin: 0 !important;
          display: flex !important;
          flex-direction: column !important;
          line-height: 1.05 !important;
        }

        .bull-ref-notice strong {
          color: #ffd43b !important;
          font-size: 6.5px !important;
        }

        .bull-ref-notice small {
          margin-top: 1px !important;
          color: #8fa1a7 !important;
          font-size: 5.5px !important;
        }

        .bull-ref-stat-sides {
          display: grid !important;
          grid-template-columns: 1fr 1px 1fr !important;
          align-items: stretch !important;
        }

        .bull-ref-stat-divider {
          width: 1px !important;
          background: linear-gradient(180deg, transparent, rgba(0,149,255,.6), transparent) !important;
        }

        .bull-ref-stat-side {
          min-width: 0 !important;
          display: grid !important;
          grid-template-columns: 34px minmax(0, 1fr) !important;
          align-items: center !important;
          gap: 6px !important;
          padding: 1px 8px !important;
        }

        .bull-ref-stat-token {
          width: 34px !important;
          height: 34px !important;
          display: grid !important;
          place-items: center !important;
          border-radius: 50% !important;
          background: rgba(0, 7, 18, .8) !important;
        }

        .bull-ref-stat-side.shiba .bull-ref-stat-token {
          border: 1px solid #ee23ff !important;
          box-shadow: 0 0 8px rgba(238,35,255,.55), inset 0 0 7px rgba(238,35,255,.2) !important;
        }

        .bull-ref-stat-side.doge .bull-ref-stat-token {
          border: 1px solid #00ecf3 !important;
          box-shadow: 0 0 8px rgba(0,236,243,.55), inset 0 0 7px rgba(0,236,243,.2) !important;
        }

        .bull-ref-stat-token img {
          width: 25px !important;
          height: 25px !important;
          border-radius: 50% !important;
          object-fit: cover !important;
        }

        .bull-ref-stat-side > div:nth-child(2) {
          min-width: 0 !important;
          display: flex !important;
          flex-direction: column !important;
        }

        .bull-ref-stat-side > div:nth-child(2) strong {
          font-size: 7px !important;
          line-height: 1 !important;
        }

        .bull-ref-stat-side.shiba > div:nth-child(2) strong {
          color: #f329ef !important;
        }

        .bull-ref-stat-side.doge > div:nth-child(2) strong {
          color: #13eef1 !important;
        }

        .bull-ref-stat-side > div:nth-child(2) span {
          margin-top: 2px !important;
          color: #8daec1 !important;
          font-size: 6px !important;
        }

        .bull-ref-stat-side p {
          grid-column: 1 / -1 !important;
          margin: 4px 0 0 !important;
          display: flex !important;
          flex-direction: column !important;
          color: #24dff0 !important;
          font-size: 6px !important;
          line-height: 1.1 !important;
        }

        .bull-ref-stat-side p strong {
          margin-top: 2px !important;
          color: #dff8ff !important;
          font-size: 11px !important;
          line-height: 1 !important;
        }

        .bull-ref-diff {
          margin-top: 7px !important;
          padding: 5px 6px !important;
          display: grid !important;
          grid-template-columns: auto minmax(55px,1fr) auto auto !important;
          align-items: center !important;
          gap: 6px !important;
          border: 1px solid rgba(0,168,255,.46) !important;
          border-radius: 4px !important;
          background: rgba(0,102,166,.045) !important;
        }

        .bull-ref-diff > span {
          color: #25ddeb !important;
          font-size: 5.5px !important;
          white-space: nowrap !important;
        }

        .bull-ref-diff-track {
          height: 6px !important;
          overflow: hidden !important;
          border-radius: 999px !important;
          background: #092640 !important;
        }

        .bull-ref-diff-track i {
          display: block !important;
          width: 65% !important;
          height: 100% !important;
          border-radius: inherit !important;
          background: linear-gradient(90deg,#db00ff,#00f1ed) !important;
          box-shadow: 0 0 7px rgba(0,237,255,.3) !important;
        }

        .bull-ref-diff strong {
          color: #14e8f0 !important;
          font-size: 6px !important;
          white-space: nowrap !important;
        }

        .bull-ref-diff small {
          color: #7396aa !important;
          font-size: 4.5px !important;
          white-space: nowrap !important;
        }

        /* ---------- REFERENCE BOTTOM STRIP ---------- */
        .bull-ref-bottom {
          box-sizing: border-box !important;
          width: 100% !important;
          height: 44px !important;
          min-height: 44px !important;
          max-height: 44px !important;
          display: grid !important;
          grid-template-columns: repeat(3, minmax(0,1fr)) !important;
          overflow: hidden !important;
          padding: 0 !important;
        }

        .bull-ref-bottom-step {
          min-width: 0 !important;
          display: grid !important;
          grid-template-columns: 23px minmax(0,1fr) 8px !important;
          align-items: center !important;
          gap: 5px !important;
          padding: 6px 8px !important;
          border-right: 1px solid rgba(0,133,224,.33) !important;
        }

        .bull-ref-bottom-step:last-child {
          border-right: 0 !important;
        }

        .bull-ref-step-symbol {
          color: #c52cff !important;
          font-size: 20px !important;
          line-height: 1 !important;
          text-shadow: 0 0 8px rgba(194,44,255,.5) !important;
        }

        .bull-ref-bottom-step:nth-child(2) .bull-ref-step-symbol {
          color: #3b7cff !important;
        }

        .bull-ref-bottom-step:nth-child(3) .bull-ref-step-symbol {
          color: #9f6cff !important;
        }

        .bull-ref-bottom-step > div {
          min-width: 0 !important;
          display: flex !important;
          flex-direction: column !important;
        }

        .bull-ref-bottom-step strong {
          color: #20edf3 !important;
          font-size: 5.7px !important;
          line-height: 1.05 !important;
          white-space: nowrap !important;
        }

        .bull-ref-bottom-step small {
          margin-top: 2px !important;
          color: #718da4 !important;
          font-size: 5px !important;
          line-height: 1.05 !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
        }

        .bull-ref-bottom-step b {
          color: #b8d2e3 !important;
          font-size: 15px !important;
          font-weight: 400 !important;
        }

        /* Keep the complete desktop dashboard at laptop widths.
           The old 980px breakpoint was forcing the sidebars above/below
           the arena on scaled laptop displays. */
        @media (min-width: 721px) {
          .bull-terminal-shell {
            grid-template-columns: 155px minmax(0, 1fr) 210px !important;
            gap: 8px !important;
            align-items: stretch !important;
          }

          .bull-sidebar {
            width: auto !important;
            max-width: none !important;
            padding: 8px !important;
            border-right: 1px solid rgba(0,246,255,.2) !important;
            border-bottom: 0 !important;
          }

          .bull-sidebar-nav {
            display: flex !important;
            flex-direction: column !important;
            gap: 5px !important;
          }

          .bull-sidebar-button {
            min-height: 43px !important;
            grid-template-columns: 25px minmax(0,1fr) !important;
            gap: 5px !important;
            padding: 6px !important;
          }

          .bull-sidebar-icon {
            font-size: 13px !important;
          }

          .bull-sidebar-copy strong {
            font-size: 7px !important;
          }

          .bull-sidebar-copy small {
            font-size: 5.5px !important;
          }

          .bull-sidebar-promo {
            min-height: 150px !important;
            margin-top: 8px !important;
            padding: 9px 7px !important;
          }

          .bull-sidebar-promo img {
            width: 39px !important;
            height: 39px !important;
          }

          .bull-sidebar-promo h3 {
            margin-top: 4px !important;
            font-size: 8px !important;
          }

          .bull-sidebar-promo p {
            margin: 6px 0 8px !important;
            font-size: 5.7px !important;
            line-height: 1.35 !important;
          }

          .bull-sidebar-promo button {
            padding: 6px !important;
            font-size: 5.5px !important;
          }

          .bull-main-stage {
            width: auto !important;
            max-width: none !important;
            min-width: 0 !important;
            overflow: visible !important;
          }

          .bull-right-sidebar {
            width: auto !important;
            max-width: none !important;
            min-width: 0 !important;
            padding: 8px !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 8px !important;
            border-left: 1px solid rgba(0,246,255,.2) !important;
            border-top: 1px solid rgba(143,64,255,.13) !important;
          }

          .bull-right-brand {
            grid-column: auto !important;
            min-height: 62px !important;
            margin-top: auto !important;
          }
        }

        @media (max-width: 720px) {
          .bull-ref-chart {
            height: 210px !important;
            min-height: 210px !important;
            max-height: none !important;
          }

          .bull-ref-chart-header {
            height: auto !important;
            min-height: 43px !important;
            flex-wrap: wrap !important;
          }

          .bull-ref-volume {
            height: 145px !important;
          }

          .bull-ref-info-grid {
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
            grid-template-columns: 1fr !important;
          }

          .bull-ref-how,
          .bull-ref-stats {
            height: auto !important;
            min-height: 138px !important;
            max-height: none !important;
          }

          .bull-ref-bottom {
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
            grid-template-columns: 1fr !important;
          }

          .bull-ref-bottom-step {
            min-height: 44px !important;
            border-right: 0 !important;
            border-bottom: 1px solid rgba(0,133,224,.33) !important;
          }

          .bull-ref-bottom-step:last-child {
            border-bottom: 0 !important;
          }
        }



        /* =========================================================
           CLEAN DASHBOARD MENU
           Left navigation and room sidebars live inside one drawer.
        ========================================================= */
        .bull-dashboard-trigger {
          height: 34px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 0 12px;
          border: 1px solid rgba(0, 236, 255, .72);
          border-radius: 8px;
          background: linear-gradient(90deg, rgba(111, 37, 255, .23), rgba(0, 229, 244, .10));
          color: #dffcff;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: .08em;
          cursor: pointer;
          box-shadow: 0 0 14px rgba(0, 236, 255, .08), inset 0 0 12px rgba(121, 49, 255, .06);
        }

        .bull-dashboard-trigger span {
          color: #00f0f3;
          font-size: 15px;
          line-height: 1;
        }

        .bull-dashboard-trigger:hover {
          border-color: #00f7ff;
          box-shadow: 0 0 18px rgba(0, 246, 255, .14), inset 0 0 16px rgba(121, 49, 255, .09);
        }

        .bull-dashboard-overlay {
          position: fixed;
          inset: 0;
          z-index: 5000;
          display: flex;
          align-items: stretch;
          background: rgba(1, 4, 12, .72);
          backdrop-filter: blur(7px);
          -webkit-backdrop-filter: blur(7px);
        }

        .bull-dashboard-drawer {
          width: min(330px, 88vw);
          height: 100%;
          overflow-y: auto;
          padding: 12px;
          border-right: 1px solid rgba(0, 238, 255, .38);
          background:
            radial-gradient(circle at 30% 0%, rgba(132, 48, 255, .16), transparent 30%),
            radial-gradient(circle at 100% 35%, rgba(0, 231, 255, .08), transparent 30%),
            linear-gradient(180deg, rgba(5, 8, 20, .995), rgba(2, 5, 13, .995));
          box-shadow: 22px 0 60px rgba(0, 0, 0, .48), inset -12px 0 34px rgba(0, 238, 255, .025);
          animation: bullDrawerIn .22s ease-out both;
        }

        @keyframes bullDrawerIn {
          from { transform: translateX(-24px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        .bull-dashboard-drawer-head {
          min-height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 4px 4px 11px;
          border-bottom: 1px solid rgba(0, 148, 230, .20);
        }

        .bull-dashboard-brand {
          display: flex;
          align-items: center;
          gap: 9px;
          min-width: 0;
        }

        .bull-dashboard-brand img {
          width: 42px;
          height: 42px;
          object-fit: contain;
          filter: drop-shadow(0 0 10px rgba(0, 246, 255, .58));
        }

        .bull-dashboard-brand div {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .bull-dashboard-brand strong {
          color: #f2f7ff;
          font-size: 10px;
          letter-spacing: .10em;
        }

        .bull-dashboard-brand small {
          margin-top: 2px;
          color: #00eaf2;
          font-size: 6px;
          letter-spacing: .14em;
        }

        .bull-dashboard-close {
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          flex: 0 0 32px;
          border: 1px solid rgba(111, 151, 192, .28);
          border-radius: 7px;
          background: rgba(4, 9, 21, .86);
          color: #a8cfe2;
          font-size: 19px;
          cursor: pointer;
        }

        .bull-dashboard-section-label {
          margin: 12px 4px 7px;
          color: #566f8a;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: .20em;
        }

        .bull-dashboard-drawer .bull-sidebar-nav {
          display: flex !important;
          flex-direction: column !important;
          gap: 5px !important;
        }

        .bull-dashboard-drawer .bull-sidebar-button {
          min-height: 48px !important;
          grid-template-columns: 28px minmax(0, 1fr) !important;
          gap: 7px !important;
          padding: 7px 9px !important;
        }

        .bull-dashboard-drawer .bull-sidebar-copy strong {
          font-size: 8px !important;
        }

        .bull-dashboard-drawer .bull-sidebar-copy small {
          font-size: 6.5px !important;
        }

        /* Animated wireframe only under Settings */
        .bull-dashboard-waves {
          position: relative;
          height: 86px;
          margin: 8px 2px 12px;
          overflow: hidden;
          border: 1px solid rgba(0, 124, 235, .18);
          border-radius: 8px;
          background:
            linear-gradient(180deg, rgba(4, 8, 21, .20), rgba(2, 6, 17, .92)),
            repeating-linear-gradient(90deg, transparent 0 20px, rgba(0, 153, 255, .07) 21px 22px),
            repeating-linear-gradient(0deg, transparent 0 13px, rgba(126, 58, 255, .07) 14px 15px);
          box-shadow: inset 0 0 30px rgba(18, 64, 255, .06);
        }

        .bull-dashboard-waves::before,
        .bull-dashboard-waves::after {
          content: "";
          position: absolute;
          left: -20%;
          width: 140%;
          height: 52px;
          border-top: 2px solid rgba(0, 229, 255, .78);
          border-radius: 50%;
          filter: drop-shadow(0 0 6px rgba(0, 229, 255, .7));
          transform: skewX(-18deg);
          animation: bullWaveMove 4.8s linear infinite;
        }

        .bull-dashboard-waves::before {
          bottom: 7px;
          box-shadow:
            0 -9px 0 -7px rgba(119, 52, 255, .82),
            0 -18px 0 -15px rgba(0, 229, 255, .45),
            0 -27px 0 -23px rgba(145, 60, 255, .42);
        }

        .bull-dashboard-waves::after {
          bottom: -8px;
          border-top-color: rgba(128, 52, 255, .82);
          filter: drop-shadow(0 0 6px rgba(128, 52, 255, .65));
          animation-duration: 6.2s;
          animation-direction: reverse;
        }

        @keyframes bullWaveMove {
          from { transform: translateX(-4%) skewX(-18deg); }
          50% { transform: translateX(4%) skewX(-12deg); }
          to { transform: translateX(-4%) skewX(-18deg); }
        }

        .bull-dashboard-room-stack {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 5px;
        }

        .bull-dashboard-room-stack .bull-right-card {
          width: 100%;
        }

        .bull-dashboard-room-stack .bull-right-brand {
          display: none;
        }

        /* Main page no longer reserves permanent side columns */
        .bull-terminal-shell {
          display: block !important;
          grid-template-columns: none !important;
          width: 100% !important;
          max-width: 100% !important;
        }

        @media (max-width: 1180px) {
          .bull-terminal-shell {
            display: block !important;
            grid-template-columns: none !important;
            width: 100% !important;
            max-width: 100% !important;
          }
        }

        .bull-main-stage {
          width: min(1240px, calc(100% - 16px)) !important;
          max-width: 1240px !important;
          margin: 8px auto 14px !important;
          overflow: visible !important;
        }

        @media (min-width: 721px) {
          .bull-terminal-shell {
            display: block !important;
            grid-template-columns: none !important;
          }

          .bull-main-stage {
            width: min(1240px, calc(100% - 20px)) !important;
            max-width: 1240px !important;
            margin: 8px auto 14px !important;
          }
        }

        @media (max-width: 720px) {
          .bull-dashboard-trigger {
            height: 31px;
            padding: 0 9px;
            font-size: 7px;
          }

          .bull-dashboard-trigger span {
            font-size: 13px;
          }

          .bull-dashboard-drawer {
            width: min(310px, 92vw);
            padding: 10px;
          }

          .bull-main-stage {
            width: calc(100% - 8px) !important;
            margin: 4px auto 8px !important;
          }
        }


        /* =========================================================
           FINAL LAYOUT: VISIBLE DASHBOARD SIDEBAR
        ========================================================= */

        .bull-terminal-shell {
          display: grid !important;
          grid-template-columns: 190px minmax(0, 1fr) !important;
          gap: 8px !important;
          width: min(1440px, calc(100% - 12px)) !important;
          max-width: 1440px !important;
          margin: 7px auto 14px !important;
          align-items: start !important;
        }

        .bull-dashboard-fixed {
          position: sticky !important;
          top: 74px !important;
          z-index: 80 !important;
          min-width: 0 !important;
          padding: 8px !important;
          overflow: hidden !important;
          border: 1px solid rgba(0, 205, 255, .32) !important;
          border-radius: 8px !important;
          background:
            radial-gradient(circle at 30% 0%, rgba(123, 43, 255, .16), transparent 32%),
            linear-gradient(180deg, rgba(5, 9, 22, .99), rgba(2, 6, 15, .99)) !important;
          box-shadow:
            inset 0 0 28px rgba(0, 206, 255, .025),
            0 0 18px rgba(0, 0, 0, .18) !important;
        }

        .bull-dashboard-side-title {
          width: 100% !important;
          height: 42px !important;
          display: grid !important;
          grid-template-columns: 24px minmax(0, 1fr) 18px !important;
          align-items: center !important;
          gap: 5px !important;
          padding: 0 8px !important;
          border: 1px solid rgba(0, 236, 255, .70) !important;
          border-radius: 7px !important;
          background:
            linear-gradient(90deg, rgba(116, 35, 255, .34), rgba(0, 224, 244, .18)) !important;
          box-shadow:
            0 0 15px rgba(0, 236, 255, .10),
            inset 0 0 14px rgba(111, 42, 255, .09) !important;
          color: #f0fbff !important;
          text-align: left !important;
          cursor: pointer !important;
        }

        .bull-dashboard-side-icon {
          color: #18f1f4 !important;
          font-size: 17px !important;
          line-height: 1 !important;
        }

        .bull-dashboard-side-title > span:nth-child(2) {
          font-size: 10px !important;
          font-weight: 900 !important;
          letter-spacing: .06em !important;
        }

        .bull-dashboard-side-title b {
          color: #00edf1 !important;
          font-size: 14px !important;
          font-weight: 800 !important;
          text-align: right !important;
        }

        .bull-dashboard-fixed .bull-sidebar-nav {
          display: flex !important;
          flex-direction: column !important;
          gap: 5px !important;
          margin-top: 7px !important;
        }

        .bull-dashboard-fixed .bull-sidebar-button {
          min-height: 49px !important;
          grid-template-columns: 29px minmax(0, 1fr) !important;
          gap: 7px !important;
          padding: 7px 8px !important;
          border-radius: 6px !important;
        }

        /* Larger dashboard wording */
        .bull-dashboard-fixed .bull-sidebar-icon {
          font-size: 16px !important;
        }

        .bull-dashboard-fixed .bull-sidebar-copy strong {
          font-size: 10px !important;
          line-height: 1.05 !important;
          letter-spacing: .035em !important;
        }

        .bull-dashboard-fixed .bull-sidebar-copy small {
          margin-top: 2px !important;
          font-size: 7.5px !important;
          line-height: 1.12 !important;
        }

        /* Waves remain only below Settings */
        .bull-dashboard-fixed .bull-dashboard-waves {
          height: 76px !important;
          margin: 8px 0 0 !important;
        }

        /* Main content uses the remaining width */
        .bull-main-stage {
          width: 100% !important;
          max-width: none !important;
          min-width: 0 !important;
          margin: 0 !important;
          overflow: visible !important;
        }

        /* Reduce the mascot/battle area by approximately 10% */
        .bull-reference-center .battle-hero {
          width: 90% !important;
          max-width: 90% !important;
          height: 234px !important;
          min-height: 234px !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }

        .bull-reference-center .token-orbit {
          transform: scale(.90) !important;
          transform-origin: center !important;
        }

        /* Reduce the chart panel by approximately 10% */
        .bull-reference-center .bull-ref-chart {
          width: 90% !important;
          height: 178px !important;
          min-height: 178px !important;
          max-height: 178px !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }

        .bull-reference-center .bull-ref-volume {
          height: 126px !important;
          min-height: 126px !important;
        }

        .bull-reference-center .bull-ref-chart-svg {
          height: 107px !important;
        }

        .bull-reference-center .bull-ref-chart-footer {
          height: 15px !important;
          min-height: 15px !important;
        }

        /* Larger top/header wording */
        .terminal-header .brand-copy strong {
          font-size: 15px !important;
          letter-spacing: .08em !important;
        }

        .terminal-header .brand-copy span {
          font-size: 8px !important;
        }

        .terminal-header .terminal-title strong {
          font-size: 11px !important;
        }

        .terminal-header .terminal-title span {
          font-size: 7px !important;
        }

        .terminal-header .online-status,
        .terminal-header .wallet-address {
          font-size: 8.5px !important;
        }

        .terminal-header .wallet-adapter-button {
          font-size: 9px !important;
        }

        /* Larger footer wording */
        .bull-ref-bottom-step strong {
          font-size: 7.2px !important;
          line-height: 1.08 !important;
        }

        .bull-ref-bottom-step small {
          font-size: 6.2px !important;
          line-height: 1.08 !important;
        }

        /* Keep the dashboard sidebar visible at laptop/tablet widths too */
        @media (max-width: 980px) {
          .bull-terminal-shell {
            display: grid !important;
            grid-template-columns: 175px minmax(0, 1fr) !important;
            width: calc(100% - 8px) !important;
            max-width: none !important;
            gap: 6px !important;
          }

          .bull-dashboard-fixed {
            position: relative !important;
            top: auto !important;
          }

          .bull-dashboard-fixed .bull-sidebar-copy strong {
            font-size: 9.5px !important;
          }

          .bull-dashboard-fixed .bull-sidebar-copy small {
            font-size: 7px !important;
          }

          .bull-main-stage {
            overflow: hidden !important;
          }
        }

        @media (max-width: 620px) {
          .bull-terminal-shell {
            grid-template-columns: 160px minmax(0, 1fr) !important;
          }

          .bull-dashboard-side-title > span:nth-child(2) {
            font-size: 9px !important;
          }

          .bull-dashboard-fixed .bull-sidebar-button {
            min-height: 46px !important;
            grid-template-columns: 25px minmax(0, 1fr) !important;
            padding-left: 6px !important;
            padding-right: 6px !important;
          }

          .bull-dashboard-fixed .bull-sidebar-icon {
            font-size: 14px !important;
          }

          .bull-dashboard-fixed .bull-sidebar-copy strong {
            font-size: 8.5px !important;
          }

          .bull-dashboard-fixed .bull-sidebar-copy small {
            font-size: 6.5px !important;
          }
        }


        /* =========================================================
           FINAL SPACING FIX
           - Dashboard scrolls together with arena/chart
           - No empty side margins around arena or chart
           - Dashboard and lower sections use the available width
        ========================================================= */

        .bull-terminal-shell {
          display: grid !important;
          grid-template-columns: 220px minmax(0, 1fr) !important;
          gap: 6px !important;
          width: 100% !important;
          max-width: none !important;
          margin: 0 !important;
          padding: 0 6px 10px !important;
          align-items: start !important;
          box-sizing: border-box !important;
        }

        /* Dashboard now moves together with the rest of the page */
        .bull-dashboard-fixed {
          position: relative !important;
          top: auto !important;
          align-self: start !important;
          width: 100% !important;
          min-width: 0 !important;
          margin: 0 !important;
        }

        /* Main area fills all remaining space */
        .bull-main-stage,
        .bull-reference-center,
        .bull-main-stage > .arena-page {
          width: 100% !important;
          max-width: none !important;
          min-width: 0 !important;
          margin: 0 !important;
          padding-left: 0 !important;
          padding-right: 0 !important;
          box-sizing: border-box !important;
        }

        /* Arena: keep the 10% height reduction, but remove side gaps */
        .bull-reference-center .battle-hero {
          width: 100% !important;
          max-width: 100% !important;
          height: 234px !important;
          min-height: 234px !important;
          margin: 0 !important;
        }

        .bull-reference-center .token-orbit {
          transform: scale(.90) !important;
          transform-origin: center !important;
        }

        /* Chart: keep it shorter, but make it full width */
        .bull-reference-center .bull-ref-chart {
          width: 100% !important;
          max-width: 100% !important;
          height: 178px !important;
          min-height: 178px !important;
          max-height: 178px !important;
          margin: 0 !important;
        }

        .bull-reference-center .bull-ref-volume {
          width: 100% !important;
          max-width: 100% !important;
          height: 126px !important;
          min-height: 126px !important;
        }

        .bull-reference-center .bull-ref-chart-svg {
          width: calc(100% - 28px) !important;
          max-width: none !important;
          height: 107px !important;
        }

        /* Lower sections fill the center width with no side gaps */
        .bull-ref-info-grid,
        .bull-ref-bottom {
          width: 100% !important;
          max-width: 100% !important;
          margin-left: 0 !important;
          margin-right: 0 !important;
        }

        .bull-ref-info-grid {
          min-height: 154px !important;
          height: 154px !important;
          max-height: 154px !important;
        }

        .bull-ref-how,
        .bull-ref-stats {
          min-height: 154px !important;
          height: 154px !important;
          max-height: 154px !important;
        }

        .bull-ref-bottom {
          min-height: 50px !important;
          height: 50px !important;
          max-height: 50px !important;
        }

        /* Slightly larger dashboard to use the left side better */
        .bull-dashboard-side-title {
          height: 44px !important;
        }

        .bull-dashboard-fixed .bull-sidebar-button {
          min-height: 51px !important;
        }

        .bull-dashboard-fixed .bull-sidebar-copy strong {
          font-size: 10.5px !important;
        }

        .bull-dashboard-fixed .bull-sidebar-copy small {
          font-size: 8px !important;
        }

        /* Keep the bottom wording readable */
        .bull-ref-bottom-step strong {
          font-size: 7.6px !important;
        }

        .bull-ref-bottom-step small {
          font-size: 6.5px !important;
        }

        /* Tablet: same order, everything scrolls together */
        @media (max-width: 980px) {
          .bull-terminal-shell {
            grid-template-columns: 190px minmax(0, 1fr) !important;
            width: 100% !important;
            gap: 5px !important;
            margin: 0 !important;
            padding: 0 4px 8px !important;
          }

          .bull-dashboard-fixed {
            position: relative !important;
            top: auto !important;
          }

          .bull-reference-center .battle-hero,
          .bull-reference-center .bull-ref-chart,
          .bull-ref-info-grid,
          .bull-ref-bottom {
            width: 100% !important;
            max-width: 100% !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
          }
        }

        /* Small screens: preserve the same left-to-right order */
        @media (max-width: 620px) {
          .bull-terminal-shell {
            grid-template-columns: 170px minmax(0, 1fr) !important;
            gap: 4px !important;
            padding-left: 3px !important;
            padding-right: 3px !important;
          }

          .bull-dashboard-fixed .bull-sidebar-copy strong {
            font-size: 9px !important;
          }

          .bull-dashboard-fixed .bull-sidebar-copy small {
            font-size: 6.8px !important;
          }
        }

        /* =========================================================
           REFERENCE IMAGE MATCH — DESKTOP TERMINAL
           Target composition: 1408 × 1056 reference image.
           This block intentionally comes last so it wins against
           previous experimental layout overrides.
        ========================================================= */

        .terminal {
          width: 100% !important;
          min-height: 100vh !important;
          overflow-x: hidden !important;
          background:
            radial-gradient(circle at 78% 12%, rgba(0, 212, 255, .035), transparent 31%),
            radial-gradient(circle at 12% 56%, rgba(85, 37, 255, .045), transparent 28%),
            #020714 !important;
        }

        .terminal-header {
          box-sizing: border-box !important;
          width: 100% !important;
          height: 84px !important;
          min-height: 84px !important;
          margin: 0 !important;
          padding: 0 24px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          gap: 20px !important;
          border-bottom: 2px solid #00d9f4 !important;
          background:
            linear-gradient(180deg, rgba(4, 10, 28, .995), rgba(3, 8, 23, .995)) !important;
          box-shadow: 0 1px 0 rgba(98, 35, 255, .42), 0 8px 26px rgba(0, 0, 0, .24) !important;
          position: relative !important;
          z-index: 100 !important;
        }

        .terminal-header .brand {
          min-width: 0 !important;
          display: flex !important;
          align-items: center !important;
          gap: 0 !important;
        }

        .terminal-header .brand-logo {
          width: 78px !important;
          height: 78px !important;
          flex: 0 0 78px !important;
          display: grid !important;
          place-items: center !important;
          margin-right: 8px !important;
        }

        .terminal-header .brand-logo img {
          width: 74px !important;
          height: 74px !important;
          object-fit: contain !important;
          filter: drop-shadow(0 0 7px rgba(0, 238, 255, .9)) !important;
        }

        .terminal-header .brand-copy {
          width: 158px !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
          line-height: 1 !important;
        }

        .terminal-header .brand-copy strong {
          color: #ecf3ff !important;
          font-size: 17.85px !important;
          font-weight: 900 !important;
          letter-spacing: .105em !important;
          line-height: .98 !important;
          white-space: nowrap !important;
          text-shadow: 0 0 9px rgba(114, 74, 255, .5) !important;
        }

        .terminal-header .brand-copy span {
          margin-top: 7px !important;
          color: #c1caff !important;
          font-size: 12px !important;
          font-weight: 700 !important;
          letter-spacing: .34em !important;
          white-space: nowrap !important;
        }

        .terminal-header .brand-divider {
          width: 2px !important;
          height: 48px !important;
          margin: 0 26px 0 18px !important;
          background: linear-gradient(180deg, #00e9ef, rgba(0, 233, 239, .34)) !important;
          box-shadow: 0 0 8px rgba(0, 233, 239, .22) !important;
        }

        .terminal-header .terminal-title {
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
          gap: 7px !important;
          line-height: 1 !important;
          white-space: nowrap !important;
        }

        .terminal-header .terminal-title strong {
          color: #bfc8ff !important;
          font-size: 16px !important;
          font-weight: 800 !important;
          letter-spacing: .105em !important;
          font-style: italic !important;
        }

        .terminal-header .terminal-title strong::first-letter {
          color: #00f1ef !important;
        }

        .terminal-header .terminal-title span {
          color: #00e7f1 !important;
          font-size: 14px !important;
          font-weight: 800 !important;
          letter-spacing: .06em !important;
        }

        .terminal-header .header-actions {
          display: flex !important;
          align-items: center !important;
          justify-content: flex-end !important;
          gap: 18px !important;
          flex: 0 0 auto !important;
        }

        .terminal-header .online-status {
          height: 45px !important;
          min-width: 118px !important;
          padding: 0 18px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 11px !important;
          border: 1.5px solid #00e3db !important;
          border-radius: 17px !important;
          background: rgba(0, 21, 34, .76) !important;
          color: #00efe8 !important;
          font-size: 15px !important;
          font-weight: 800 !important;
          letter-spacing: .01em !important;
          box-shadow: inset 0 0 18px rgba(0, 229, 220, .035) !important;
        }

        .terminal-header .online-dot {
          width: 15px !important;
          height: 15px !important;
          border: 3px solid #00e9df !important;
          border-radius: 50% !important;
          background: transparent !important;
          box-shadow: 0 0 10px rgba(0, 239, 230, .34) !important;
        }

        .terminal-header .wallet-address {
          display: none !important;
        }

        .terminal-header .wallet-adapter-button,
        .terminal-header .wallet-adapter-button-trigger {
          height: 46px !important;
          min-width: 220px !important;
          padding: 0 20px !important;
          border: 1.5px solid #009cf5 !important;
          border-radius: 14px !important;
          background: linear-gradient(180deg, rgba(5, 18, 44, .98), rgba(3, 13, 33, .98)) !important;
          color: #d7ddff !important;
          font-size: 15px !important;
          font-weight: 700 !important;
          justify-content: center !important;
          box-shadow: inset 0 0 16px rgba(0, 132, 255, .05) !important;
        }

        .bull-terminal-shell {
          box-sizing: border-box !important;
          display: grid !important;
          grid-template-columns: 230px minmax(0, 1fr) !important;
          gap: 26px !important;
          width: calc(100% - 48px) !important;
          max-width: 1360px !important;
          margin: 24px auto 16px !important;
          padding: 0 !important;
          align-items: start !important;
        }

        .bull-dashboard-fixed {
          box-sizing: border-box !important;
          position: relative !important;
          top: auto !important;
          z-index: 3 !important;
          width: 230px !important;
          min-width: 230px !important;
          height: 930px !important;
          padding: 0 !important;
          margin: 0 !important;
          overflow: visible !important;
          border: 0 !important;
          border-radius: 0 !important;
          background: transparent !important;
          box-shadow: none !important;
        }

        .bull-dashboard-side-title {
          box-sizing: border-box !important;
          width: 230px !important;
          height: 57px !important;
          display: grid !important;
          grid-template-columns: 42px minmax(0, 1fr) 22px !important;
          align-items: center !important;
          gap: 4px !important;
          padding: 0 15px !important;
          border: 2px solid transparent !important;
          border-radius: 12px !important;
          background:
            linear-gradient(#071126, #071126) padding-box,
            linear-gradient(90deg, #e128ff, #00e9ef) border-box !important;
          box-shadow:
            0 0 16px rgba(219, 27, 255, .22),
            inset 0 0 22px rgba(25, 166, 255, .08) !important;
          color: #edf5ff !important;
        }

        .bull-dashboard-side-icon {
          color: #13eff0 !important;
          font-size: 29px !important;
          font-weight: 400 !important;
          line-height: 1 !important;
        }

        .bull-dashboard-side-title > span:nth-child(2) {
          color: #f0f5ff !important;
          font-size: 18px !important;
          font-weight: 800 !important;
          letter-spacing: 0 !important;
        }

        .bull-dashboard-side-title b {
          color: #00edf1 !important;
          font-size: 24px !important;
          font-weight: 700 !important;
          text-align: right !important;
        }

        .bull-dashboard-fixed .bull-sidebar-nav {
          box-sizing: border-box !important;
          width: 230px !important;
          margin-top: 8px !important;
          padding: 10px 15px 11px !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 0 !important;
          border: 1.5px solid #168bff !important;
          border-radius: 11px !important;
          background:
            radial-gradient(circle at 15% 5%, rgba(122, 44, 255, .12), transparent 30%),
            linear-gradient(180deg, rgba(4, 14, 36, .98), rgba(3, 11, 30, .98)) !important;
          box-shadow: inset 0 0 32px rgba(0, 164, 255, .025) !important;
        }

        .bull-dashboard-fixed .bull-sidebar-button {
          box-sizing: border-box !important;
          width: 100% !important;
          min-height: 58px !important;
          height: 58px !important;
          display: grid !important;
          grid-template-columns: 40px minmax(0, 1fr) !important;
          align-items: center !important;
          gap: 9px !important;
          padding: 0 !important;
          border: 0 !important;
          border-bottom: 1px solid rgba(36, 115, 175, .23) !important;
          border-radius: 0 !important;
          background: transparent !important;
          box-shadow: none !important;
          text-align: left !important;
        }

        .bull-dashboard-fixed .bull-sidebar-button:last-child {
          border-bottom: 0 !important;
        }

        .bull-dashboard-fixed .bull-sidebar-button.active {
          background: transparent !important;
          box-shadow: none !important;
        }

        .bull-dashboard-fixed .bull-sidebar-icon {
          color: #d9e0ff !important;
          font-size: 27px !important;
          line-height: 1 !important;
          text-align: center !important;
          filter: drop-shadow(0 0 5px rgba(113, 87, 255, .4)) !important;
        }

        .bull-dashboard-fixed .bull-sidebar-button.active .bull-sidebar-icon {
          color: #d9e0ff !important;
        }

        .bull-dashboard-fixed .bull-sidebar-copy {
          gap: 4px !important;
        }

        .bull-dashboard-fixed .bull-sidebar-copy strong {
          color: #eef3ff !important;
          font-size: 15px !important;
          font-weight: 700 !important;
          line-height: 1 !important;
          letter-spacing: 0 !important;
          text-transform: none !important;
        }

        .bull-dashboard-fixed .bull-sidebar-copy small {
          margin-top: 1px !important;
          color: #8bb4ff !important;
          font-size: 12px !important;
          line-height: 1 !important;
          letter-spacing: 0 !important;
        }

        .bull-dashboard-fixed .bull-dashboard-waves {
          box-sizing: border-box !important;
          width: calc(100% + 48px) !important;
          height: 360px !important;
          margin: 68px 0 0 -24px !important;
          border: 0 !important;
          border-radius: 0 !important;
          opacity: .92 !important;
          background:
            radial-gradient(ellipse at 24% 70%, rgba(0, 98, 255, .14), transparent 45%),
            repeating-linear-gradient(88deg, transparent 0 24px, rgba(0, 126, 255, .08) 25px 26px),
            repeating-linear-gradient(0deg, transparent 0 18px, rgba(72, 39, 255, .08) 19px 20px) !important;
          -webkit-mask-image: linear-gradient(180deg, transparent 0, #000 12%, #000 100%) !important;
          mask-image: linear-gradient(180deg, transparent 0, #000 12%, #000 100%) !important;
          box-shadow: none !important;
        }

        .bull-dashboard-fixed .bull-dashboard-waves::before,
        .bull-dashboard-fixed .bull-dashboard-waves::after {
          height: 140px !important;
          width: 150% !important;
          left: -25% !important;
          border-top-width: 2px !important;
        }

        .bull-dashboard-fixed .bull-sidebar-footer-brand {
          position: absolute !important;
          left: 3px !important;
          bottom: 5px !important;
          display: grid !important;
          grid-template-columns: 60px minmax(0, 1fr) !important;
          align-items: center !important;
          gap: 9px !important;
          width: 220px !important;
        }

        .bull-sidebar-footer-brand img {
          width: 60px !important;
          height: 60px !important;
          object-fit: contain !important;
          filter: drop-shadow(0 0 7px rgba(0, 238, 255, .7)) !important;
        }

        .bull-sidebar-footer-brand div {
          display: flex !important;
          flex-direction: column !important;
          gap: 5px !important;
        }

        .bull-sidebar-footer-brand strong {
          color: #d8e1ff !important;
          font-size: 12px !important;
          font-weight: 800 !important;
          letter-spacing: .18em !important;
          white-space: nowrap !important;
        }

        .bull-sidebar-footer-brand span {
          color: #66b8ff !important;
          font-size: 8px !important;
          font-weight: 700 !important;
          letter-spacing: .3em !important;
          white-space: nowrap !important;
        }

        .bull-main-stage,
        .bull-main-stage > .arena-page,
        .bull-reference-center {
          box-sizing: border-box !important;
          width: 100% !important;
          max-width: none !important;
          min-width: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow: visible !important;
        }

        .bull-reference-center {
          display: flex !important;
          flex-direction: column !important;
          gap: 13px !important;
        }

        .bull-reference-center .battle-hero {
          box-sizing: border-box !important;
          width: 100% !important;
          max-width: 100% !important;
          height: 275px !important;
          min-height: 275px !important;
          max-height: 275px !important;
          margin: 0 !important;
          overflow: hidden !important;
          border: 1.5px solid #00aef6 !important;
          border-left-color: #d600ef !important;
          border-radius: 13px !important;
          background-color: #040b19 !important;
          background-size: cover !important;
          background-position: center !important;
          box-shadow: inset 0 0 35px rgba(0, 132, 255, .08) !important;
          position: relative !important;
        }

        .bull-reference-center .battle-hero > img {
          opacity: .97 !important;
        }

        .active-room-badge {
          position: absolute !important;
          top: 18px !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          min-width: 148px !important;
          height: 38px !important;
          padding: 0 16px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 10px !important;
          border: 1.5px solid #00ddf3 !important;
          border-radius: 11px !important;
          background: rgba(4, 19, 42, .87) !important;
          color: #00eef1 !important;
          font-size: 13px !important;
          font-weight: 800 !important;
          letter-spacing: .04em !important;
          box-shadow: 0 0 13px rgba(0, 223, 243, .3), inset 0 0 12px rgba(0, 223, 243, .06) !important;
          z-index: 7 !important;
        }

        .active-room-badge span {
          width: 12px !important;
          height: 12px !important;
          border-radius: 50% !important;
          background: #13eddc !important;
          box-shadow: 0 0 10px rgba(19, 237, 220, .76) !important;
        }

        .battle-center {
          position: absolute !important;
          top: 65px !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          z-index: 6 !important;
          text-align: center !important;
          width: 480px !important;
        }

        .battle-center h1 {
          margin: 0 !important;
          display: flex !important;
          align-items: baseline !important;
          justify-content: center !important;
          gap: 24px !important;
          font-size: 38px !important;
          line-height: 1 !important;
          font-weight: 900 !important;
          letter-spacing: -.02em !important;
          text-shadow: 0 0 8px rgba(62, 83, 255, .32) !important;
        }

        .battle-center h1 small {
          color: #00edf1 !important;
          font-size: 19px !important;
          font-weight: 900 !important;
        }

        .battle-center .shiba-title {
          color: #eef1ff !important;
        }

        .battle-center .doge-title {
          color: #00eff0 !important;
        }

        .battle-center p {
          margin: 8px 0 0 !important;
          color: #00e8f1 !important;
          font-size: 19px !important;
          line-height: 1 !important;
          font-weight: 800 !important;
          letter-spacing: .01em !important;
        }

        .fighter {
          position: absolute !important;
          top: 34px !important;
          z-index: 5 !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          gap: 2px !important;
        }

        .fighter-shiba {
          left: 24px !important;
          width: 330px !important;
        }

        .fighter-doge {
          right: 24px !important;
          width: 330px !important;
        }

        .bull-reference-center .token-orbit {
          width: 144px !important;
          height: 144px !important;
          min-width: 144px !important;
          min-height: 144px !important;
          transform: none !important;
          margin: 0 !important;
          border: 0 !important;
          background: transparent !important;
        }

        .bull-reference-center .token-image,
        .bull-reference-center .token-image img {
          border-radius: 50% !important;
        }

        .bull-reference-center .token-image img {
          width: 91px !important;
          height: 91px !important;
          object-fit: cover !important;
        }

        .fighter-stats {
          width: 100% !important;
          margin-top: -4px !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 5px !important;
          line-height: 1 !important;
        }

        .fighter-shiba .fighter-stats {
          align-items: flex-start !important;
          text-align: left !important;
        }

        .fighter-doge .fighter-stats {
          align-items: flex-end !important;
          text-align: right !important;
        }

        .fighter-stats strong {
          font-size: 18px !important;
          font-weight: 900 !important;
        }

        .fighter-shiba .fighter-stats strong,
        .fighter-shiba .fighter-stats b {
          color: #f000e8 !important;
        }

        .fighter-doge .fighter-stats strong,
        .fighter-doge .fighter-stats b {
          color: #00eff0 !important;
        }

        .fighter-stats span {
          color: #dbe4ff !important;
          font-size: 16px !important;
          font-weight: 600 !important;
        }

        .fighter-stats span:last-child {
          color: #7cc4ff !important;
          font-size: 16px !important;
        }

        .countdown {
          box-sizing: border-box !important;
          position: absolute !important;
          left: 50% !important;
          bottom: 23px !important;
          transform: translateX(-50%) !important;
          min-width: 305px !important;
          height: 96px !important;
          padding: 15px 32px 11px !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 3px !important;
          border: 1.5px solid #00c8ee !important;
          border-left-width: 0 !important;
          border-right-width: 0 !important;
          clip-path: polygon(11% 0, 89% 0, 100% 50%, 89% 100%, 11% 100%, 0 50%) !important;
          background: linear-gradient(180deg, rgba(1, 14, 33, .95), rgba(1, 9, 24, .98)) !important;
          box-shadow: inset 0 0 20px rgba(0, 182, 246, .07), 0 0 15px rgba(0, 132, 255, .1) !important;
          z-index: 6 !important;
        }

        .countdown span {
          color: #00e6ef !important;
          font-size: 14px !important;
          font-weight: 800 !important;
        }

        .countdown strong {
          color: #eff5ff !important;
          font-size: 47px !important;
          line-height: .95 !important;
          font-weight: 800 !important;
          letter-spacing: .02em !important;
          text-shadow: 0 0 9px rgba(0, 138, 255, .58) !important;
        }

        .bull-reference-center .bull-ref-chart {
          box-sizing: border-box !important;
          width: 100% !important;
          max-width: 100% !important;
          height: 303px !important;
          min-height: 303px !important;
          max-height: 303px !important;
          margin: 0 !important;
          padding: 11px 24px 9px !important;
          overflow: hidden !important;
          border: 1.5px solid #008ff5 !important;
          border-left-color: #d400e9 !important;
          border-radius: 12px !important;
          background: linear-gradient(180deg, rgba(3, 14, 34, .985), rgba(3, 11, 28, .985)) !important;
          box-shadow: inset 0 0 26px rgba(0, 130, 255, .035) !important;
        }

        .bull-ref-chart-header {
          height: 38px !important;
          min-height: 38px !important;
          align-items: center !important;
        }

        .bull-ref-chart-header > div:first-child {
          gap: 9px !important;
        }

        .bull-ref-chart-icon {
          font-size: 24px !important;
          color: #c0a8ff !important;
        }

        .bull-ref-chart-header strong {
          color: #cdd5ff !important;
          font-size: 18px !important;
          font-weight: 800 !important;
          letter-spacing: .03em !important;
        }

        .bull-ref-chart-header small {
          margin-left: 0 !important;
          color: #8d9fff !important;
          font-size: 16px !important;
          letter-spacing: .02em !important;
        }

        .bull-ref-chart-tabs {
          gap: 13px !important;
        }

        .bull-ref-chart-tabs button {
          min-width: 88px !important;
          height: 36px !important;
          padding: 0 18px !important;
          border: 1px solid #0068c9 !important;
          border-radius: 10px !important;
          background: rgba(4, 17, 40, .86) !important;
          color: #79bcff !important;
          font-size: 13px !important;
          font-weight: 700 !important;
        }

        .bull-ref-chart-tabs button.active {
          border-color: #00e6ef !important;
          color: #00f2f2 !important;
          background: linear-gradient(180deg, rgba(0, 105, 144, .45), rgba(0, 35, 71, .45)) !important;
          box-shadow: 0 0 12px rgba(0, 222, 239, .25), inset 0 0 9px rgba(0, 222, 239, .08) !important;
        }

        .bull-reference-center .bull-ref-volume {
          box-sizing: border-box !important;
          width: 100% !important;
          height: 216px !important;
          min-height: 216px !important;
          margin-top: 0 !important;
          padding-left: 43px !important;
          padding-right: 44px !important;
          position: relative !important;
        }

        .bull-reference-center .bull-ref-chart-svg {
          width: 100% !important;
          height: 184px !important;
          max-width: none !important;
          margin: 0 !important;
          display: block !important;
        }

        .bull-ref-y-axis {
          left: 0 !important;
          top: 8px !important;
          height: 184px !important;
          width: 39px !important;
          color: #d8e6ff !important;
          font-size: 12px !important;
        }

        .bull-ref-x-axis {
          left: 43px !important;
          right: 44px !important;
          bottom: 1px !important;
          color: #d9e5ff !important;
          font-size: 12px !important;
        }

        .bull-ref-chart-grid line {
          stroke: rgba(0, 84, 156, .52) !important;
          stroke-width: 1 !important;
        }

        .bull-ref-line {
          stroke-width: 4 !important;
          filter: drop-shadow(0 0 4px currentColor) !important;
        }

        .bull-ref-value {
          right: 0 !important;
          min-width: 52px !important;
          height: 28px !important;
          padding: 0 7px !important;
          display: grid !important;
          place-items: center !important;
          border-radius: 6px !important;
          color: #fff !important;
          font-size: 13px !important;
          font-weight: 800 !important;
        }

        .bull-ref-chart-footer {
          height: 29px !important;
          min-height: 29px !important;
          margin-top: 0 !important;
          padding: 0 0 0 2px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
        }

        .bull-ref-legends {
          gap: 34px !important;
          color: #c5d5ff !important;
          font-size: 13px !important;
        }

        .bull-ref-legends i {
          width: 23px !important;
          height: 10px !important;
          margin-right: 7px !important;
          border-radius: 999px !important;
        }

        .bull-ref-data-note {
          color: #8ac7ff !important;
          font-size: 12px !important;
          font-weight: 800 !important;
          letter-spacing: .02em !important;
        }

        .bull-ref-info-grid {
          box-sizing: border-box !important;
          width: 100% !important;
          height: 252px !important;
          min-height: 252px !important;
          max-height: 252px !important;
          display: grid !important;
          grid-template-columns: 416px minmax(0, 1fr) !important;
          gap: 12px !important;
          margin: 0 !important;
        }

        .bull-ref-how,
        .bull-ref-stats {
          box-sizing: border-box !important;
          width: 100% !important;
          height: 252px !important;
          min-height: 252px !important;
          max-height: 252px !important;
          margin: 0 !important;
          padding: 14px 24px !important;
          border: 1.5px solid #008ff5 !important;
          border-left-color: #d400e9 !important;
          border-radius: 11px !important;
          background: linear-gradient(180deg, rgba(3, 14, 34, .985), rgba(3, 11, 28, .985)) !important;
          overflow: hidden !important;
        }

        .bull-ref-how h2,
        .bull-ref-stats h2 {
          margin: 0 0 12px !important;
          color: #ccd7ff !important;
          font-size: 19px !important;
          font-weight: 800 !important;
          line-height: 1 !important;
        }

        .bull-ref-stats h2 {
          color: #00edf1 !important;
        }

        .bull-ref-instruction {
          min-height: 41px !important;
          margin: 0 !important;
          gap: 17px !important;
        }

        .bull-ref-num {
          width: 38px !important;
          height: 38px !important;
          flex: 0 0 38px !important;
          border: 2px solid #dce9ff !important;
          color: #eef4ff !important;
          font-size: 16px !important;
          font-weight: 700 !important;
        }

        .bull-ref-instruction p {
          line-height: 1.02 !important;
        }

        .bull-ref-instruction strong {
          color: #eff4ff !important;
          font-size: 14px !important;
          font-weight: 700 !important;
        }

        .bull-ref-instruction small {
          margin-top: 4px !important;
          color: #86b9ff !important;
          font-size: 12px !important;
        }

        .bull-ref-notice {
          min-height: 45px !important;
          margin-top: 3px !important;
          padding: 6px 12px !important;
          gap: 14px !important;
          border: 1px solid #1a80df !important;
          border-radius: 7px !important;
          background: rgba(2, 22, 48, .74) !important;
        }

        .bull-ref-notice > span {
          width: 32px !important;
          height: 32px !important;
          flex: 0 0 32px !important;
          border: 2px solid #ffd300 !important;
          color: #ffd300 !important;
          font-size: 17px !important;
        }

        .bull-ref-notice strong {
          color: #ffd300 !important;
          font-size: 12px !important;
        }

        .bull-ref-notice small {
          margin-top: 2px !important;
          color: #ffd300 !important;
          font-size: 10px !important;
        }

        .bull-ref-stat-sides {
          height: 145px !important;
          grid-template-columns: 1fr 1px 1fr !important;
        }

        .bull-ref-stat-divider {
          margin: 3px 8px !important;
          background: rgba(0, 188, 234, .72) !important;
        }

        .bull-ref-stat-side {
          grid-template-columns: 74px minmax(0, 1fr) !important;
          gap: 14px !important;
          padding: 0 17px !important;
        }

        .bull-ref-stat-token {
          width: 72px !important;
          height: 72px !important;
        }

        .bull-ref-stat-token img {
          width: 55px !important;
          height: 55px !important;
        }

        .bull-ref-stat-side > div:nth-child(2) strong {
          font-size: 18px !important;
          font-weight: 900 !important;
        }

        .bull-ref-stat-side > div:nth-child(2) span {
          margin-top: 4px !important;
          color: #d8e7ff !important;
          font-size: 14px !important;
        }

        .bull-ref-stat-side p {
          margin: 3px 0 0 !important;
          color: #00e2ea !important;
          font-size: 14px !important;
          font-weight: 700 !important;
        }

        .bull-ref-stat-side p strong {
          margin-top: 6px !important;
          color: #f0f5ff !important;
          font-size: 28px !important;
        }

        .bull-ref-stat-side.doge p strong {
          color: #00f0ef !important;
        }

        .bull-ref-diff {
          box-sizing: border-box !important;
          height: 47px !important;
          margin-top: 8px !important;
          padding: 0 14px !important;
          grid-template-columns: auto minmax(150px, 1fr) auto auto !important;
          gap: 14px !important;
          border: 1.5px solid #00a8df !important;
          border-radius: 8px !important;
          background: rgba(0, 56, 82, .15) !important;
        }

        .bull-ref-diff > span {
          color: #00edf1 !important;
          font-size: 14px !important;
          font-weight: 700 !important;
        }

        .bull-ref-diff-track {
          height: 20px !important;
          border-radius: 999px !important;
          background: #0a3964 !important;
        }

        .bull-ref-diff-track i {
          width: 73% !important;
          background: linear-gradient(90deg, #e600f7 0%, #a93eff 28%, #00ecf1 100%) !important;
        }

        .bull-ref-diff strong {
          color: #00eff0 !important;
          font-size: 16px !important;
          font-weight: 800 !important;
        }

        .bull-ref-diff small {
          color: #00dbea !important;
          font-size: 11px !important;
          font-weight: 700 !important;
        }

        .bull-ref-bottom {
          box-sizing: border-box !important;
          width: 100% !important;
          height: 64px !important;
          min-height: 64px !important;
          max-height: 64px !important;
          margin: 0 !important;
          padding: 0 !important;
          display: grid !important;
          grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          border: 1.5px solid #008ff5 !important;
          border-left-color: #d400e9 !important;
          border-radius: 11px !important;
          background: linear-gradient(180deg, rgba(3, 14, 34, .985), rgba(3, 11, 28, .985)) !important;
          overflow: hidden !important;
        }

        .bull-ref-bottom-step {
          min-width: 0 !important;
          grid-template-columns: 50px minmax(0, 1fr) 18px !important;
          gap: 14px !important;
          padding: 8px 22px !important;
          border-right: 0 !important;
        }

        .bull-ref-step-symbol {
          color: #d200ff !important;
          font-size: 43px !important;
          text-shadow: 0 0 9px rgba(199, 0, 255, .72) !important;
        }

        .bull-ref-bottom-step:nth-child(2) .bull-ref-step-symbol {
          color: #596bff !important;
        }

        .bull-ref-bottom-step:nth-child(3) .bull-ref-step-symbol {
          color: #9e6aff !important;
        }

        .bull-ref-bottom-step strong {
          color: #00edf1 !important;
          font-size: 13px !important;
          font-weight: 800 !important;
          line-height: 1 !important;
        }

        .bull-ref-bottom-step small {
          margin-top: 6px !important;
          color: #7ea7cf !important;
          font-size: 10px !important;
          line-height: 1 !important;
          overflow: visible !important;
          text-overflow: clip !important;
        }

        .bull-ref-bottom-step b {
          color: #e4edf8 !important;
          font-size: 32px !important;
          line-height: 1 !important;
        }

        /* Keep the desktop composition intact as long as possible. */
        @media (max-width: 1180px) {
          .terminal-header {
            height: auto !important;
            min-height: 84px !important;
            padding: 10px 16px !important;
            flex-wrap: wrap !important;
          }

          .terminal-header .terminal-title {
            display: none !important;
          }

          .bull-terminal-shell {
            width: calc(100% - 24px) !important;
            grid-template-columns: 205px minmax(0, 1fr) !important;
            gap: 14px !important;
            margin-top: 16px !important;
          }

          .bull-dashboard-fixed,
          .bull-dashboard-side-title,
          .bull-dashboard-fixed .bull-sidebar-nav {
            width: 205px !important;
            min-width: 205px !important;
          }

          .bull-ref-info-grid {
            grid-template-columns: minmax(315px, .72fr) minmax(0, 1.28fr) !important;
          }

          .fighter-shiba { left: 10px !important; width: 265px !important; }
          .fighter-doge { right: 10px !important; width: 265px !important; }
          .bull-reference-center .token-orbit { width: 122px !important; height: 122px !important; min-width: 122px !important; min-height: 122px !important; }
          .bull-reference-center .token-image img { width: 78px !important; height: 78px !important; }
          .fighter-stats strong { font-size: 15px !important; }
          .fighter-stats span, .fighter-stats span:last-child { font-size: 13px !important; }
        }

        @media (max-width: 860px) {
          .terminal-header .brand-copy,
          .terminal-header .brand-divider {
            display: none !important;
          }

          .terminal-header .header-actions {
            gap: 8px !important;
          }

          .terminal-header .online-status {
            min-width: 96px !important;
            height: 40px !important;
            padding: 0 11px !important;
            font-size: 13px !important;
          }

          .terminal-header .wallet-adapter-button,
          .terminal-header .wallet-adapter-button-trigger {
            min-width: 165px !important;
            height: 42px !important;
            padding: 0 12px !important;
            font-size: 12px !important;
          }

          .bull-terminal-shell {
            display: block !important;
            width: calc(100% - 16px) !important;
            margin-top: 10px !important;
          }

          .bull-dashboard-fixed {
            width: 100% !important;
            min-width: 0 !important;
            height: auto !important;
            margin-bottom: 10px !important;
          }

          .bull-dashboard-side-title,
          .bull-dashboard-fixed .bull-sidebar-nav {
            width: 100% !important;
            min-width: 0 !important;
          }

          .bull-dashboard-fixed .bull-sidebar-nav {
            display: grid !important;
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
            padding: 8px !important;
          }

          .bull-dashboard-fixed .bull-sidebar-button {
            border-bottom: 0 !important;
            min-height: 52px !important;
            height: 52px !important;
            padding: 0 5px !important;
          }

          .bull-dashboard-fixed .bull-dashboard-waves,
          .bull-dashboard-fixed .bull-sidebar-footer-brand {
            display: none !important;
          }

          .bull-reference-center .battle-hero {
            height: 330px !important;
            min-height: 330px !important;
            max-height: 330px !important;
          }

          .fighter-shiba { left: 5px !important; width: 230px !important; }
          .fighter-doge { right: 5px !important; width: 230px !important; }
          .battle-center { top: 74px !important; width: 360px !important; }
          .battle-center h1 { font-size: 31px !important; gap: 14px !important; }
          .battle-center p { font-size: 14px !important; }
          .countdown { bottom: 24px !important; }

          .bull-reference-center .bull-ref-chart {
            height: 300px !important;
            min-height: 300px !important;
            max-height: 300px !important;
            padding-left: 12px !important;
            padding-right: 12px !important;
          }

          .bull-ref-chart-header {
            height: auto !important;
            min-height: 72px !important;
            flex-wrap: wrap !important;
            align-content: center !important;
            gap: 8px !important;
          }

          .bull-ref-info-grid {
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
            grid-template-columns: 1fr !important;
          }

          .bull-ref-how,
          .bull-ref-stats {
            height: auto !important;
            min-height: 252px !important;
            max-height: none !important;
          }

          .bull-ref-bottom {
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
            grid-template-columns: 1fr !important;
          }

          .bull-ref-bottom-step {
            min-height: 64px !important;
          }
        }



        /* =========================================================
           LOWER DASHBOARD AREA - 30% SMALLER ONLY
           Applies only from VOLUME ON DEX through the bottom action bar.
           Header, sidebar and battle/arena section remain unchanged.
        ========================================================= */
        .bull-lower-section-scale {
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
          zoom: 1 !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 8px !important;
          margin: 0 !important;
          padding: 0 !important;
          box-sizing: border-box !important;
          overflow: visible !important;
        }

        /* Keep the complete lower area exactly aligned with the arena width.
           No horizontal scaling, no oversized inner canvas, and no clipping. */
        .bull-lower-section-scale > .bull-ref-chart,
        .bull-lower-section-scale > .bull-ref-info-grid,
        .bull-lower-section-scale > .bull-ref-bottom {
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
          margin-left: 0 !important;
          margin-right: 0 !important;
          box-sizing: border-box !important;
        }

        .bull-lower-section-scale .bull-ref-how,
        .bull-lower-section-scale .bull-ref-stats {
          min-width: 0 !important;
          max-width: 100% !important;
          box-sizing: border-box !important;
        }


        /* =========================================================
           FINAL SIDEBAR LOWER ART — HYPERLIQUID GREEN DEPTH
           Aligned exactly to the 230px dashboard width.
        ========================================================= */
        .bull-dashboard-fixed .bull-dashboard-waves {
          box-sizing: border-box !important;
          position: relative !important;
          width: 230px !important;
          max-width: 230px !important;
          height: 320px !important;
          margin: 48px 0 0 0 !important;
          overflow: hidden !important;
          border: 1px solid rgba(38, 218, 166, .18) !important;
          border-radius: 11px !important;
          opacity: 1 !important;
          isolation: isolate !important;
          background:
            radial-gradient(ellipse at 50% 92%, rgba(40, 222, 169, .19), transparent 43%),
            radial-gradient(ellipse at 16% 42%, rgba(16, 126, 101, .12), transparent 38%),
            linear-gradient(180deg, rgba(2, 13, 18, .08), rgba(1, 18, 19, .68) 55%, rgba(1, 12, 15, .97)) !important;
          -webkit-mask-image: none !important;
          mask-image: none !important;
          box-shadow:
            inset 0 0 38px rgba(35, 224, 171, .045),
            inset 0 -42px 70px rgba(14, 116, 91, .08),
            0 0 20px rgba(0, 0, 0, .20) !important;
          animation: bullHyperGlow 5.5s ease-in-out infinite !important;
        }

        .bull-dashboard-fixed .bull-dashboard-waves::before {
          content: "" !important;
          position: absolute !important;
          z-index: 1 !important;
          left: -72px !important;
          right: -72px !important;
          top: 106px !important;
          bottom: -116px !important;
          width: auto !important;
          height: auto !important;
          border: 0 !important;
          border-radius: 0 !important;
          background:
            repeating-linear-gradient(
              90deg,
              transparent 0 24px,
              rgba(53, 237, 183, .29) 25px 26px
            ),
            repeating-linear-gradient(
              0deg,
              transparent 0 20px,
              rgba(30, 196, 148, .25) 21px 22px
            ) !important;
          background-position: 0 0, 0 0 !important;
          transform-origin: 50% 100% !important;
          transform: perspective(230px) rotateX(58deg) scale(1.14) !important;
          filter:
            drop-shadow(0 0 4px rgba(47, 238, 181, .32))
            drop-shadow(0 0 11px rgba(20, 170, 128, .14)) !important;
          box-shadow: none !important;
          opacity: .90 !important;
          animation: bullHyperGridFlow 4.6s linear infinite !important;
        }

        .bull-dashboard-fixed .bull-dashboard-waves::after {
          content: "" !important;
          position: absolute !important;
          z-index: 2 !important;
          left: -38% !important;
          bottom: 72px !important;
          width: 176% !important;
          height: 98px !important;
          border: 0 !important;
          border-top: 2px solid rgba(72, 239, 188, .95) !important;
          border-radius: 50% !important;
          background: transparent !important;
          box-shadow:
            0 -16px 0 -14px rgba(46, 214, 165, .76),
            0 -31px 0 -29px rgba(32, 174, 134, .52),
            0 -47px 0 -45px rgba(23, 127, 101, .34) !important;
          filter:
            drop-shadow(0 0 5px rgba(77, 244, 194, .76))
            drop-shadow(0 0 14px rgba(24, 184, 139, .32)) !important;
          transform: skewX(-12deg) translateX(-2%) !important;
          opacity: .95 !important;
          animation: bullHyperWave 5.8s ease-in-out infinite alternate !important;
        }

        @keyframes bullHyperGridFlow {
          0% {
            background-position: 0 0, 0 0;
            transform: perspective(230px) rotateX(58deg) scale(1.14) translateY(0);
          }
          50% {
            background-position: 13px 0, 0 11px;
            transform: perspective(230px) rotateX(60deg) scale(1.18) translateY(5px);
          }
          100% {
            background-position: 26px 0, 0 22px;
            transform: perspective(230px) rotateX(58deg) scale(1.14) translateY(0);
          }
        }

        @keyframes bullHyperWave {
          0% {
            transform: skewX(-12deg) translateX(-3%) translateY(2px) scaleY(.90);
          }
          50% {
            transform: skewX(-8deg) translateX(2%) translateY(-5px) scaleY(1.08);
          }
          100% {
            transform: skewX(-14deg) translateX(5%) translateY(3px) scaleY(.94);
          }
        }

        @keyframes bullHyperGlow {
          0%, 100% {
            box-shadow:
              inset 0 0 38px rgba(35, 224, 171, .045),
              inset 0 -42px 70px rgba(14, 116, 91, .08),
              0 0 20px rgba(0, 0, 0, .20);
          }
          50% {
            box-shadow:
              inset 0 0 46px rgba(46, 239, 181, .075),
              inset 0 -50px 82px rgba(16, 143, 109, .12),
              0 0 24px rgba(22, 159, 121, .08);
          }
        }


        /* =========================================================
           FINAL REFERENCE LOCK — USER APPROVED 1448 × 1086 LAYOUT
           These rules intentionally come last.
        ========================================================= */
        @media (min-width: 1181px) {
          html,
          body,
          #root {
            margin: 0 !important;
            width: 100% !important;
            min-width: 1181px !important;
            background: #020714 !important;
          }

          .terminal {
            width: 100% !important;
            min-height: 1086px !important;
            overflow-x: hidden !important;
          }

          .terminal-header {
            width: 100% !important;
            height: 86px !important;
            min-height: 86px !important;
            padding: 0 24px !important;
          }

          .terminal-header .brand-logo {
            width: 78px !important;
            height: 78px !important;
            flex-basis: 78px !important;
          }

          .terminal-header .brand-logo img {
            width: 74px !important;
            height: 74px !important;
          }

          .terminal-header .brand-copy {
            width: 158px !important;
          }

          .terminal-header .brand-copy strong {
            font-size: 17.85px !important;
          }

          .terminal-header .brand-divider {
            height: 48px !important;
            margin-left: 18px !important;
            margin-right: 26px !important;
          }

          .bull-terminal-shell {
            display: grid !important;
            grid-template-columns: 230px minmax(0, 1fr) !important;
            gap: 26px !important;
            box-sizing: border-box !important;
            width: calc(100% - 48px) !important;
            max-width: 1400px !important;
            margin: 23px auto 0 !important;
            padding: 0 !important;
            align-items: start !important;
          }

          .bull-dashboard-fixed {
            width: 230px !important;
            min-width: 230px !important;
            height: 977px !important;
            overflow: visible !important;
          }

          .bull-dashboard-side-title {
            width: 230px !important;
            height: 57px !important;
          }

          .bull-dashboard-fixed .bull-sidebar-nav {
            width: 230px !important;
            margin-top: 8px !important;
            padding: 10px 15px 11px !important;
          }

          .bull-dashboard-fixed .bull-sidebar-button {
            height: 58px !important;
            min-height: 58px !important;
          }

          /* Exact visual artwork from the approved reference, used only in
             the decorative lower-left area. Functional UI remains real HTML. */
          .bull-dashboard-fixed .bull-dashboard-waves {
            position: relative !important;
            width: 280px !important;
            min-width: 280px !important;
            max-width: 280px !important;
            height: 541px !important;
            min-height: 541px !important;
            max-height: 541px !important;
            margin: 0 0 0 -24px !important;
            border: 0 !important;
            border-radius: 0 !important;
            opacity: 1 !important;
            background:
              url("/sidebar-hyperliquid-reference.png") left top / 280px 541px no-repeat !important;
            -webkit-mask-image: none !important;
            mask-image: none !important;
            box-shadow: none !important;
            overflow: hidden !important;
            animation: none !important;
          }

          .bull-dashboard-fixed .bull-dashboard-waves::before {
            content: "" !important;
            position: absolute !important;
            inset: 0 !important;
            width: 100% !important;
            height: 100% !important;
            left: 0 !important;
            top: 0 !important;
            border: 0 !important;
            border-radius: 0 !important;
            background:
              linear-gradient(
                105deg,
                transparent 0%,
                transparent 40%,
                rgba(82, 255, 218, .08) 49%,
                rgba(82, 255, 218, .18) 50%,
                rgba(82, 255, 218, .08) 51%,
                transparent 60%,
                transparent 100%
              ) !important;
            transform: translateX(-120%) !important;
            filter: none !important;
            opacity: .8 !important;
            animation: bullReferenceWaveSweep 7s linear infinite !important;
          }

          .bull-dashboard-fixed .bull-dashboard-waves::after {
            display: none !important;
            content: none !important;
          }

          @keyframes bullReferenceWaveSweep {
            0% { transform: translateX(-120%); }
            100% { transform: translateX(120%); }
          }

          .bull-dashboard-fixed .bull-sidebar-footer-brand {
            display: none !important;
          }

          .bull-main-stage,
          .bull-main-stage > .arena-page,
          .bull-reference-center {
            width: 100% !important;
            min-width: 0 !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .bull-reference-center {
            gap: 13px !important;
          }

          .bull-reference-center .battle-hero {
            width: 100% !important;
            height: 275px !important;
            min-height: 275px !important;
            max-height: 275px !important;
          }

          .fighter {
            top: 43px !important;
          }

          .fighter-shiba {
            left: 60px !important;
            width: 330px !important;
          }

          .fighter-doge {
            right: 34px !important;
            width: 330px !important;
          }

          .battle-center {
            top: 65px !important;
            width: 480px !important;
          }

          .countdown {
            bottom: 23px !important;
            min-width: 305px !important;
            height: 96px !important;
          }

          .bull-lower-section-scale {
            width: 100% !important;
            min-width: 0 !important;
            max-width: 100% !important;
            zoom: 1 !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 13px !important;
            margin: 0 !important;
            padding: 0 !important;
            box-sizing: border-box !important;
            overflow: visible !important;
          }

          .bull-lower-section-scale > .bull-ref-chart,
          .bull-lower-section-scale > .bull-ref-info-grid,
          .bull-lower-section-scale > .bull-ref-bottom {
            width: 100% !important;
            max-width: 100% !important;
            min-width: 0 !important;
            margin: 0 !important;
          }

          .bull-reference-center .bull-ref-chart {
            height: 303px !important;
            min-height: 303px !important;
            max-height: 303px !important;
            padding: 11px 24px 9px !important;
          }

          .bull-ref-info-grid {
            height: 252px !important;
            min-height: 252px !important;
            max-height: 252px !important;
            grid-template-columns: 416px minmax(0, 1fr) !important;
            gap: 12px !important;
          }

          .bull-ref-how,
          .bull-ref-stats {
            height: 252px !important;
            min-height: 252px !important;
            max-height: 252px !important;
          }

          .bull-ref-how {
            padding: 14px 24px 11px !important;
          }

          .bull-ref-instruction {
            min-height: 41px !important;
          }

          .bull-ref-instruction:nth-of-type(3) {
            min-height: 63px !important;
            align-items: flex-start !important;
          }

          .bull-ref-instruction:nth-of-type(3) small {
            max-width: 292px !important;
            line-height: 1.08 !important;
          }

          .bull-ref-notice {
            min-height: 45px !important;
            margin-top: 1px !important;
          }

          .bull-ref-bottom {
            height: 64px !important;
            min-height: 64px !important;
            max-height: 64px !important;
          }

          .bull-ref-bottom-step:first-child small {
            white-space: nowrap !important;
          }

          .bull-ref-bottom-step:nth-child(3) .bull-ref-step-symbol {
            font-size: 39px !important;
          }
        }


        /* =========================================================
           FINAL SIZE ADJUSTMENT — CURRENT WORKING SITE
           Desktop only: entire interface is 15% smaller while keeping
           the same colors, proportions, layout and functionality.
        ========================================================= */
        @media (min-width: 1181px) {
          .terminal {
            zoom: 0.85 !important;
            width: 117.6470588% !important;
            max-width: 117.6470588% !important;
          }
        }

        /* Fallback for browsers without CSS zoom support. */
        @supports not (zoom: 1) {
          @media (min-width: 1181px) {
            .terminal {
              zoom: 1 !important;
              width: 117.6470588% !important;
              max-width: 117.6470588% !important;
              transform: scale(0.85) !important;
              transform-origin: top left !important;
            }
          }
        }

      `}</style>

      <div className="bull-terminal-shell">
        <aside className="bull-dashboard-fixed" aria-label="Bull Protocol dashboard">
          <button
            type="button"
            className="bull-dashboard-side-title"
            onClick={() => setDashboardOpen((current) => !current)}
            aria-expanded={dashboardOpen}
          >
            <span className="bull-dashboard-side-icon">☰</span>
            <span>Dashboard</span>
            <b>{dashboardOpen ? "⌃" : "⌄"}</b>
          </button>

          {dashboardOpen && (
            <>
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

              <div className="bull-dashboard-waves" aria-hidden="true" />

              <div className="bull-sidebar-footer-brand" aria-hidden="true">
                <img src="/bull-logo.png" alt="" />
                <div>
                  <strong>BULL PROTOCOL</strong>
                  <span>MOMENTUM WINS</span>
                </div>
              </div>
            </>
          )}
        </aside>

        <div className="bull-main-stage">
          {activeSection === "rooms" ? (
            <main className="arena-page bull-reference-center">
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

        <div className="bull-lower-section-scale">
        <section className="bull-ref-chart">
          <div className="bull-ref-chart-header">
            <div>
              <span className="bull-ref-chart-icon">↗</span>
              <strong>VOLUME ON DEX</strong>
              <small>(LAST 30 MIN)</small>
            </div>

            <div className="bull-ref-chart-tabs">
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

          <div className={`bull-ref-volume filter-${chartFilter.toLowerCase()}`}>
            <div className="bull-ref-y-axis">
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
              className="bull-ref-chart-svg"
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

              <g className="bull-ref-chart-grid">
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
                className="bull-ref-area shiba-area"
                d="M0 300 L23 297 L46 288 L69 277 L92 270 L115 276 L138 272 L161 273 L186 276 L209 266 L233 265 L256 263 L279 255 L302 248 L326 245 L349 251 L372 252 L396 252 L419 255 L442 254 L466 253 L489 257 L512 254 L536 257 L559 259 L582 260 L606 259 L629 263 L652 264 L676 263 L699 260 L722 257 L746 258 L769 257 L792 257 L816 257 L839 255 L862 253 L886 250 L909 246 L932 249 L956 253 L979 255 L1002 253 L1026 248 L1049 243 L1072 239 L1096 240 L1119 237 L1142 236 L1166 237 L1189 233 L1212 229 L1236 222 L1259 218 L1282 220 L1306 218 L1329 213 L1352 204 L1376 197 L1400 191 L1400 340 L0 340 Z"
              />

              <path
                className="bull-ref-area doge-area"
                d="M0 335 L23 331 L46 330 L69 324 L92 323 L115 313 L138 312 L161 319 L186 321 L209 321 L233 320 L256 319 L279 318 L302 315 L326 316 L349 319 L372 318 L396 314 L419 313 L442 309 L466 307 L489 306 L512 306 L536 303 L559 297 L582 293 L606 288 L629 281 L652 275 L676 268 L699 258 L722 248 L746 239 L769 232 L792 224 L816 218 L839 215 L862 219 L886 228 L909 223 L932 214 L956 210 L979 203 L1002 201 L1026 197 L1049 187 L1072 181 L1096 177 L1119 182 L1142 190 L1166 189 L1189 193 L1212 197 L1236 194 L1259 184 L1282 174 L1306 163 L1329 157 L1352 160 L1376 151 L1400 145 L1400 340 L0 340 Z"
              />

              <polyline
                className="bull-ref-line shiba-chart-line"
                points="
                  0,300 23,297 46,288 69,277 92,270 115,276 138,272 161,273 186,276 209,266
233,265 256,263 279,255 302,248 326,245 349,251 372,252 396,252 419,255 442,254
466,253 489,257 512,254 536,257 559,259 582,260 606,259 629,263 652,264 676,263
699,260 722,257 746,258 769,257 792,257 816,257 839,255 862,253 886,250 909,246
932,249 956,253 979,255 1002,253 1026,248 1049,243 1072,239 1096,240 1119,237 1142,236
1166,237 1189,233 1212,229 1236,222 1259,218 1282,220 1306,218 1329,213 1352,204 1376,197 1400,191
                "
              />

              <polyline
                className="bull-ref-line doge-chart-line"
                points="
                  0,335 23,331 46,330 69,324 92,323 115,313 138,312 161,319 186,321 209,321
233,320 256,319 279,318 302,315 326,316 349,319 372,318 396,314 419,313 442,309
466,307 489,306 512,306 536,303 559,297 582,293 606,288 629,281 652,275 676,268
699,258 722,248 746,239 769,232 792,224 816,218 839,215 862,219 886,228 909,223
932,214 956,210 979,203 1002,201 1026,197 1049,187 1072,181 1096,177 1119,182 1142,190
1166,189 1189,193 1212,197 1236,194 1259,184 1282,174 1306,163 1329,157 1352,160 1376,151 1400,145
                "
              />

              <circle
                className="bull-ref-point doge-point"
                cx="1400"
                cy="145"
                r="7"
              />

              <circle
                className="bull-ref-point shiba-point"
                cx="1400"
                cy="191"
                r="7"
              />
            </svg>

            <div className="bull-ref-value doge-value">10.8M</div>
            <div className="bull-ref-value shiba-value">12.4M</div>

            <div className="bull-ref-x-axis">
              <span>14:05</span>
              <span>14:10</span>
              <span>14:15</span>
              <span>14:20</span>
              <span>14:25</span>
              <span>14:30</span>
            </div>
          </div>

          <div className="bull-ref-chart-footer">
            <div className="bull-ref-legends">
              <span className="legend-shiba">
                <i />
                Shiba (12.4M)
              </span>

              <span className="legend-doge">
                <i />
                Doge (10.8M)
              </span>
            </div>

            <span className="bull-ref-data-note">☠ DEXSCREENER</span>
          </div>
        </section>

        <section className="bull-ref-info-grid">
          <div className="bull-ref-panel bull-ref-how">
            <h2>HOW IT WORKS?</h2>

            <div className="bull-ref-instruction">
              <span className="bull-ref-num">1</span>
              <p>
                <strong>Choose a side</strong>
                <small>Shiba or Doge.</small>
              </p>
            </div>

            <div className="bull-ref-instruction">
              <span className="bull-ref-num">2</span>
              <p>
                <strong>Enter the room</strong>
                <small>Join the participants.</small>
              </p>
            </div>

            <div className="bull-ref-instruction">
              <span className="bull-ref-num">3</span>
              <p>
                <strong>Start the volume</strong>
                <small>The side with the highest volume on the DEX wins in 30 minutes. Pay and take the other side.</small>
              </p>
            </div>

            <div className="bull-ref-notice">
              <span>!</span>
              <p>
                <strong>There is no risk of loss.</strong>
                <small>Only the winning side moves forward.</small>
              </p>
            </div>
          </div>

          <div className="bull-ref-panel bull-ref-stats">
            <h2>ROOM STATISTICS</h2>

            <div className="bull-ref-stat-sides">
              <div className="bull-ref-stat-side shiba">
                <div className="bull-ref-stat-token">
                  <img src={SHIBA_LOGO} alt="SHIBA" />
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

              <div className="bull-ref-stat-divider" />

              <div className="bull-ref-stat-side doge">
                <div className="bull-ref-stat-token">
                  <img src={DOGE_LOGO} alt="DOGE" />
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

            <div className="bull-ref-diff">
              <span>Volume Difference</span>
              <div className="bull-ref-diff-track"><i /></div>
              <strong>1.6M USDT</strong>
              <small>(in favor of Shiba)</small>
            </div>
          </div>
        </section>

        <section className="bull-ref-panel bull-ref-bottom">
          <div className="bull-ref-bottom-step">
            <span className="bull-ref-step-symbol">ϟ</span>
            <div>
              <strong>ENTER THE ROOM</strong>
              <small>Join the right side, the rooms are limited.</small>
            </div>
            <b>›</b>
          </div>

          <div className="bull-ref-bottom-step">
            <span className="bull-ref-step-symbol">◎</span>
            <div>
              <strong>PLACE YOUR STRATEGY</strong>
              <small>The volume of the market decides.</small>
            </div>
            <b>›</b>
          </div>

          <div className="bull-ref-bottom-step">
            <span className="bull-ref-step-symbol">♜</span>
            <div>
              <strong>TAKE THE VICTORY</strong>
              <small>The side that loses pays.</small>
            </div>
            <b>›</b>
          </div>
        </section>
        </div>
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
  const wallets = useMemo(() => createSupportedWalletAdapters(), []);
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
      <WalletProvider
        wallets={wallets}
        autoConnect={(adapter) => !/meta\s*mask/i.test(String(adapter?.name || ""))}
      >
        <WalletModalProvider>
          <RemoveMetaMaskWalletOption />
          {showOpening ? <OpeningScreen /> : <Arena />}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
