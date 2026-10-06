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
          grid-template-columns: 220px minmax(0, 1fr) 250px;
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

        <section className="information-grid">
          <div className="panel how-it-works">
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
                <strong>Follow the volume</strong>
                <small>The market data determines the room result.</small>
              </p>
            </div>

            <div className="risk-notice">
              <span>!</span>
              <p>
                <strong>ROOM RULES APPLY</strong>
                <small>Review the active room before participating.</small>
              </p>
            </div>
          </div>

          <div className="panel room-statistics">
            <h2>ROOM STATISTICS</h2>

            <div className="statistics-sides">
              <div className="statistics-side shiba-stat">
                <div className="stat-token">
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

              <div className="statistics-divider" />

              <div className="statistics-side doge-stat">
                <div className="stat-token">
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

            <div className="volume-difference">
              <span>Volume Difference</span>
              <div className="difference-track"><i /></div>
              <strong>1.6M USDT</strong>
              <small>(in favor of Shiba)</small>
            </div>
          </div>
        </section>

        <section className="panel bottom-steps">
          <div className="bottom-step">
            <span className="step-symbol">ϟ</span>
            <div>
              <strong>ENTER THE ROOM</strong>
              <small>Join the side you want to support.</small>
            </div>
            <b>›</b>
          </div>

          <div className="bottom-step">
            <span className="step-symbol">◎</span>
            <div>
              <strong>PLACE YOUR STRATEGY</strong>
              <small>The volume of the market decides.</small>
            </div>
            <b>›</b>
          </div>

          <div className="bottom-step">
            <span className="step-symbol">♜</span>
            <div>
              <strong>ROOM RESULT</strong>
              <small>The result follows the configured room rules.</small>
            </div>
            <b>›</b>
          </div>
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

        <aside className="bull-right-sidebar" aria-label="Active room details">
          <section className="bull-right-card bull-room-card">
            <div className="bull-room-card-top">
              <span className="bull-room-number">ROOM #4827</span>
              <span className="bull-room-live"><i /> IN PROGRESS</span>
            </div>

            <h3>SHIBA VS DOGE</h3>
            <p>Battle for market momentum during the active 30-minute room.</p>

            <div className="bull-room-facts">
              <div className="bull-room-fact">
                <small>Duration</small>
                <strong>30 minutes</strong>
              </div>
              <div className="bull-room-fact">
                <small>Participants</small>
                <strong>100 / 100</strong>
              </div>
            </div>

            <div className="bull-network-row">
              <small>Market Status</small>
              <strong>LIVE MARKET</strong>
            </div>

            <button
              type="button"
              className="bull-enter-room"
              onClick={() => {
                setSelectedSide(null);
                setShowEntry(true);
                setMessage("");
              }}
            >
              ENTER ROOM →
            </button>
          </section>

          <section className="bull-right-card bull-participants-card">
            <div className="bull-participants-heading">
              <strong>PARTICIPANTS (100)</strong>
              <span>LIVE</span>
            </div>

            <div className="bull-team-totals">
              <div className="bull-team-total shiba">
                <img src={SHIBA_LOGO} alt="SHIBA" />
                <span>SHIBA<b>50</b></span>
              </div>
              <div className="bull-team-total doge">
                <img src={DOGE_LOGO} alt="DOGE" />
                <span>DOGE<b>50</b></span>
              </div>
            </div>

            <div className="bull-participant-list">
              {ROOM_PARTICIPANTS.map((participant) => (
                <div className="bull-participant-row" key={participant.name}>
                  <div className="bull-participant-avatar">
                    <img
                      src={participant.side === "SHIBA" ? SHIBA_LOGO : DOGE_LOGO}
                      alt=""
                    />
                  </div>
                  <div className="bull-participant-copy">
                    <strong>{participant.name}</strong>
                    <small className={participant.side.toLowerCase()}>
                      Joined the {participant.side === "SHIBA" ? "Shiba" : "Doge"} side
                    </small>
                  </div>
                  <time>{participant.time}</time>
                </div>
              ))}
            </div>

            <button type="button" className="bull-view-participants">
              View all participants (100) <span>→</span>
            </button>
          </section>

          <div className="bull-right-brand">
            <img src="/bull-logo.png" alt="Bull Protocol" />
            <div className="bull-right-brand-copy">
              <strong>BULL PROTOCOL</strong>
              <small>MOMENTUM WINS</small>
            </div>
          </div>
        </aside>
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
