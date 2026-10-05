"use client";

import React, { useState, useEffect, useMemo } from "react";
import Head from "next/head";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
  useConnection,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";

import "@solana/wallet-adapter-react-ui/styles.css";

const BULL_LOGO_URL = "/bull-logo.png";
const FALLBACK_BULL_LOGO = "https://i.postimg.cc/kXMHjQJ2/bull-logo-png.png";

function TerminalContent() {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(28 * 60 + 17);
  const [selectedSide, setSelectedSide] = useState<"shiba" | "doge">("shiba");
  const [roomNotification, setRoomNotification] = useState<string | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  // Auto-dismiss splash screen after 2.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch real SOL balance on connection
  useEffect(() => {
    async function fetchBalance() {
      if (connected && publicKey) {
        try {
          const bal = await connection.getBalance(publicKey);
          setBalance(bal / LAMPORTS_PER_SOL);
        } catch {
          setBalance(null);
        }
      } else {
        setBalance(null);
      }
    }
    fetchBalance();
  }, [connected, publicKey, connection]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleEnterRoom = (faction?: "shiba" | "doge") => {
    const side = faction || selectedSide;
    if (faction) setSelectedSide(faction);

    if (!connected) {
      setRoomNotification("Please connect your Solana wallet in the top bar to enter!");
    } else {
      setRoomNotification(`Position registered for ${side.toUpperCase()} team! Waiting for network confirmation.`);
    }
    setTimeout(() => setRoomNotification(null), 5000);
  };

  return (
    <>
      <Head>
        <title>Bull Protocol | High-Yield Momentum Terminal</title>
        <link rel="icon" type="image/png" href={BULL_LOGO_URL} />
        <link rel="shortcut icon" type="image/png" href={BULL_LOGO_URL} />
      </Head>

      {/* Splash Screen */}
      {showSplash && (
        <div
          onClick={() => setShowSplash(false)}
          className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[99999] cursor-pointer transition-opacity duration-500"
        >
          <div className="absolute w-96 h-96 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />
          <img
            src={BULL_LOGO_URL}
            onError={(e) => {
              (e.target as HTMLImageElement).src = FALLBACK_BULL_LOGO;
            }}
            alt="Bull Protocol"
            className="w-64 max-w-[80vw] h-auto object-contain relative drop-shadow-[0_0_35px_rgba(0,240,255,0.8)] animate-pulse"
          />
          <h2 className="mt-6 text-cyan-400 font-mono text-xl tracking-[0.3em] font-black drop-shadow-[0_0_15px_#00f0ff]">
            BULL PROTOCOL
          </h2>
          <span className="mt-2 text-xs font-mono text-slate-500 tracking-widest uppercase">
            Click anywhere to enter
          </span>
        </div>
      )}

      <div className="min-h-screen bg-[#060b13] text-slate-100 flex flex-col font-sans select-none overflow-x-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-cyan-900/40 bg-[#080f1a]/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <img
              src={BULL_LOGO_URL}
              onError={(e) => {
                (e.target as HTMLImageElement).src = FALLBACK_BULL_LOGO;
              }}
              alt="Bull Logo"
              className="w-9 h-9 object-contain drop-shadow-[0_0_10px_#00f0ff]"
            />
            <div>
              <h1 className="text-xl font-black tracking-wider text-cyan-400 font-mono drop-shadow-[0_0_8px_#00f0ff]">
                BULL <span className="text-white text-xs tracking-widest block font-light">PROTOCOL</span>
              </h1>
            </div>
            <div className="hidden md:flex items-center gap-4 text-xs text-slate-400 ml-8 font-mono border-l border-slate-800 pl-6">
              <span className="text-cyan-400 font-semibold uppercase tracking-wider">MOMENTUM TRADING TERMINAL</span>
              <span className="text-slate-600">•</span>
              <span>TRADES</span>
              <span className="text-slate-600">•</span>
              <span>POOLS</span>
              <span className="text-slate-600">•</span>
              <span>REAL MARKET</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#0c1827] border border-cyan-800/40 px-3 py-1.5 rounded-full text-xs text-emerald-400 font-mono shadow-[0_0_10px_rgba(16,185,129,0.15)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              Online
            </div>

            {connected && balance !== null && (
              <div className="hidden sm:block text-xs font-mono text-cyan-300 bg-[#0c1827] border border-cyan-800/50 px-3 py-1.5 rounded-lg shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                {balance.toFixed(3)} SOL
              </div>
            )}

            {/* Official Solana Wallet Adapter Button */}
            <div className="solana-button-wrapper">
              <WalletMultiButton className="!bg-[#0c1827] hover:!bg-[#122238] !border !border-cyan-500/50 hover:!border-cyan-400 !h-9 !px-4 !rounded-lg !text-xs !font-mono !text-cyan-300 !shadow-[0_0_15px_rgba(6,182,212,0.25)] !transition-all !cursor-pointer" />
            </div>
          </div>
        </header>

        {/* Status Notification Toast */}
        {roomNotification && (
          <div className="bg-cyan-950/90 border-b border-cyan-500 text-cyan-200 text-xs text-center py-2 font-mono px-4 shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all">
            {roomNotification}
          </div>
        )}

        <div className="flex flex-1">
          {/* Sidebar */}
          <aside className="w-64 border-r border-cyan-900/30 bg-[#080f1a]/50 p-4 flex flex-col justify-between hidden lg:flex">
            <div className="space-y-2">
              {[
                { label: "ROOMS", sub: "Join battles", active: true },
                {
                  label: "MY PROFILE",
                  sub: connected && publicKey ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}` : "Wallet & history",
                },
                { label: "LAUNCHPAD", sub: "Launch new projects" },
                { label: "LEADERBOARD", sub: "Top traders" },
                { label: "REWARDS", sub: "XP & achievements" },
                { label: "SETTINGS", sub: "Preferences" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl cursor-pointer transition-all border ${
                    item.active
                      ? "bg-cyan-950/30 border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                      : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                  }`}
                >
                  <div className="font-semibold text-xs tracking-wider">{item.label}</div>
                  <div className="text-[11px] text-slate-500">{item.sub}</div>
                </div>
              ))}
            </div>

            {/* Neon Rules Box */}
            <div className="p-4 rounded-xl border border-fuchsia-500/30 bg-gradient-to-b from-[#1a0f28]/80 to-[#0e0717]/80 text-center relative overflow-hidden group">
              <img
                src={BULL_LOGO_URL}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK_BULL_LOGO;
                }}
                alt="Bull"
                className="w-10 h-10 mx-auto mb-2 object-contain drop-shadow-[0_0_10px_#00f0ff]"
              />
              <div className="text-xs font-black text-fuchsia-400 tracking-wider">MORE MOMENTUM, LESS EMOTION</div>
              <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                Here, every move matters. The game never stops in the market for 30 minutes, pay and play.
              </p>
              <button
                onClick={() => setRoomNotification("Battle rules: Choose the side with the lower volume to win the round pool.")}
                className="mt-3 w-full py-1 text-[10px] uppercase font-mono tracking-wider border border-cyan-400/50 hover:border-cyan-400 text-cyan-300 rounded bg-[#091522]/80 transition-all cursor-pointer"
              >
                HOW IT WORKS?
              </button>
            </div>
          </aside>

          {/* Central Arena */}
          <main className="flex-1 p-6 space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              <div className="xl:col-span-3 bg-[#0a1322]/70 border border-cyan-900/40 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md">
                <div className="flex justify-center mb-2">
                  <span className="text-[11px] font-mono tracking-wider px-3 py-0.5 rounded-full border border-cyan-500/40 bg-cyan-950/40 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                    ACTIVE ROOM
                  </span>
                </div>

                <div className="text-center mb-6">
                  <h2 className="text-3xl font-black tracking-widest text-slate-100">
                    <span className="text-fuchsia-400 drop-shadow-[0_0_15px_rgba(217,70,239,0.8)]">SHIBA</span>
                    <span className="text-slate-500 mx-3 text-lg font-light">VS</span>
                    <span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]">DOGE</span>
                  </h2>
                  <div className="text-xs font-mono text-slate-400 mt-1">30 MINUTES • 100 PARTICIPANTS</div>
                </div>

                {/* Matchup Avatars & Neon Ring Displays */}
                <div className="flex items-center justify-around my-6">
                  {/* Shiba Side */}
                  <div
                    onClick={() => setSelectedSide("shiba")}
                    className={`flex flex-col items-center cursor-pointer p-3 rounded-2xl transition-all ${
                      selectedSide === "shiba"
                        ? "ring-2 ring-fuchsia-500/80 bg-fuchsia-950/20 shadow-[0_0_20px_rgba(217,70,239,0.3)]"
                        : "opacity-80 hover:opacity-100"
                    }`}
                  >
                    <div className="relative flex items-center justify-center p-3 rounded-full border border-fuchsia-500/40 bg-fuchsia-950/30">
                      <div className="w-24 h-24 rounded-full border-2 border-fuchsia-500 shadow-[0_0_30px_rgba(217,70,239,0.9)] flex items-center justify-center bg-black/60 overflow-hidden">
                        <img
                          src="https://assets.coingecko.com/coins/images/11939/large/shiba.png"
                          alt="Shiba"
                          className="w-20 h-20 object-contain"
                        />
                      </div>
                    </div>
                    <div className="text-sm font-bold text-fuchsia-400 mt-3">SHIBA SIDE</div>
                    <div className="text-xs text-slate-400 font-mono">50 PARTICIPANTS</div>
                    <div className="text-xs text-slate-400 font-mono mt-1">
                      VOLUME DEX: <span className="text-fuchsia-400 font-bold">12.4M USDT</span>
                    </div>
                  </div>

                  {/* Countdown Timer */}
                  <div className="flex flex-col items-center">
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest mb-1">
                      TIME REMAINING
                    </span>
                    <div className="text-4xl lg:text-5xl font-black font-mono tracking-widest text-cyan-300 drop-shadow-[0_0_20px_rgba(6,182,212,0.8)] px-6 py-2 rounded-xl border border-cyan-500/40 bg-black/40">
                      {formatTime(timeLeft)}
                    </div>
                  </div>

                  {/* Doge Side */}
                  <div
                    onClick={() => setSelectedSide("doge")}
                    className={`flex flex-col items-center cursor-pointer p-3 rounded-2xl transition-all ${
                      selectedSide === "doge"
                        ? "ring-2 ring-cyan-400/80 bg-cyan-950/20 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                        : "opacity-80 hover:opacity-100"
                    }`}
                  >
                    <div className="relative flex items-center justify-center p-3 rounded-full border border-cyan-500/40 bg-cyan-950/30">
                      <div className="w-24 h-24 rounded-full border-2 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.9)] flex items-center justify-center bg-black/60 overflow-hidden">
                        <img
                          src="https://assets.coingecko.com/coins/images/5/large/dogecoin.png"
                          alt="Doge"
                          className="w-20 h-20 object-contain"
                        />
                      </div>
                    </div>
                    <div className="text-sm font-bold text-cyan-400 mt-3">DOGE SIDE</div>
                    <div className="text-xs text-slate-400 font-mono">50 PARTICIPANTS</div>
                    <div className="text-xs text-slate-400 font-mono mt-1">
                      VOLUME DEX: <span className="text-cyan-400 font-bold">10.8M USDT</span>
                    </div>
                  </div>
                </div>

                {/* Graph Visualization */}
                <div className="mt-8 border border-slate-800/80 bg-black/40 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-xs font-mono text-slate-300">VOLUME ON DEX (LAST 30 MIN)</div>
                    <div className="flex gap-2">
                      {["TOTAL", "SHIBA", "DOGE"].map((b) => (
                        <button
                          key={b}
                          className="px-3 py-1 text-[10px] font-mono rounded bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-300 transition-colors"
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="h-44 w-full relative">
                    <svg className="w-full h-full" viewBox="0 0 500 150" preserveAspectRatio="none">
                      <path
                        d="M0,110 C80,105 150,115 250,90 C350,65 420,70 500,40"
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="2.5"
                        className="drop-shadow-[0_0_8px_#06b6d4]"
                      />
                      <path
                        d="M0,130 C80,120 180,140 260,110 C340,80 430,90 500,55"
                        fill="none"
                        stroke="#d946ef"
                        strokeWidth="2.5"
                        className="drop-shadow-[0_0_8px_#d946ef]"
                      />
                    </svg>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2">
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-fuchsia-500" /> Shiba (12.4M)
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Doge (10.8M)
                      </span>
                    </div>
                    <span className="text-slate-500 font-mono text-[10px]">SOLANA LIVE FEED</span>
                  </div>
                </div>
              </div>

              {/* Room Action Details */}
              <div className="space-y-6">
                <div className="bg-[#0a1322]/70 border border-cyan-900/40 rounded-2xl p-5 backdrop-blur-md">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
                    <span className="text-cyan-400">ROOM #4827</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> IN PROGRESS
                    </span>
                  </div>
                  <h3 className="text-lg font-black tracking-wide text-slate-100">SHIBA vs DOGE</h3>
                  <p className="text-xs text-slate-400 mb-4">Battle for the lower trading volume</p>

                  <div className="space-y-2 text-xs font-mono text-slate-300 border-t border-b border-slate-800/80 py-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Duration</span>
                      <span>30 minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Participants</span>
                      <span>100/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Blockchain</span>
                      <span className="text-cyan-400 font-bold">Solana</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Selected Faction</span>
                      <span className={selectedSide === "shiba" ? "text-fuchsia-400 font-bold" : "text-cyan-400 font-bold"}>
                        {selectedSide.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleEnterRoom()}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-cyan-500 hover:from-fuchsia-500 hover:to-cyan-400 font-bold text-xs uppercase tracking-widest text-white shadow-[0_0_20px_rgba(217,70,239,0.4)] transition-all cursor-pointer"
                  >
                    {connected ? "COMMIT & ENTER ROOM →" : "CONNECT WALLET FIRST"}
                  </button>
                </div>

                {/* Direct Commit Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => handleEnterRoom("shiba")}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-700 hover:from-fuchsia-500 hover:to-purple-600 font-bold text-xs uppercase tracking-widest text-white shadow
