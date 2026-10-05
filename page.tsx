"use client";

import React, { useState, useEffect } from "react";

export default function TradingTerminal() {
  const [timeLeft, setTimeLeft] = useState(28 * 60 + 17);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-[#060b13] text-slate-100 flex flex-col font-sans select-none overflow-x-hidden">
      {/* Top Header */}
      <header className="h-16 border-b border-cyan-900/40 bg-[#080f1a]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 text-cyan-400 drop-shadow-[0_0_10px_#00f0ff]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h2v2h4v-3.5c2-1.5 2-2.7 2-4.5 0-5.3-7.5-6.5-11-5-.2-.6-1.5-2-3-2" />
              <path d="M7 14h.01" />
              <path d="M17 14h.01" />
            </svg>
          </div>
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
          <button className="flex items-center gap-2 bg-[#0c1827] hover:bg-[#122238] border border-cyan-500/50 hover:border-cyan-400 px-4 py-1.5 rounded-lg text-xs font-mono text-cyan-300 transition-all shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <span>4F3...9K7a</span>
            <span className="text-[10px]">▼</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 border-r border-cyan-900/30 bg-[#080f1a]/50 p-4 flex flex-col justify-between hidden lg:flex">
          <div className="space-y-2">
            {[
              { label: "ROOMS", sub: "Join battles", active: true },
              { label: "MY PROFILE", sub: "Wallet & history" },
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

          {/* Sidebar Banner */}
          <div className="p-4 rounded-xl border border-fuchsia-500/30 bg-gradient-to-b from-[#1a0f28]/80 to-[#0e0717]/80 text-center relative overflow-hidden group">
            <div className="w-12 h-12 mx-auto mb-2 text-cyan-400 drop-shadow-[0_0_10px_#00f0ff]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h2v2h4v-3.5c2-1.5 2-2.7 2-4.5 0-5.3-7.5-6.5-11-5-.2-.6-1.5-2-3-2" />
              </svg>
            </div>
            <div className="text-xs font-black text-fuchsia-400 tracking-wider">MORE MOMENTUM, LESS EMOTION</div>
            <p className="text-[10px] text-slate-400 mt-1 leading-snug">
              Here, every move matters. The game never stops in the market for 30 minutes, pay and play.
            </p>
            <button className="mt-3 w-full py-1 text-[10px] uppercase font-mono tracking-wider border border-cyan-400/50 hover:border-cyan-400 text-cyan-300 rounded bg-[#091522]/80">
              HOW IT WORKS?
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 space-y-6">
          {/* Top Battle Arena Cards */}
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

              {/* Meme Avatars & Glow Rings */}
              <div className="flex items-center justify-around my-6">
                {/* Shiba Side */}
                <div className="flex flex-col items-center">
                  <div className="relative flex items-center justify-center p-3 rounded-full border border-fuchsia-500/30 bg-fuchsia-950/20">
                    <div className="w-24 h-24 rounded-full border-2 border-fuchsia-500 shadow-[0_0_30px_rgba(217,70,239,0.8)] flex items-center justify-center bg-black/60 overflow-hidden">
                      <img src="https://assets.coingecko.com/coins/images/11939/large/shiba.png" alt="Shiba" className="w-20 h-20 object-contain" />
                    </div>
                  </div>
                  <div className="text-sm font-bold text-fuchsia-400 mt-3">SHIBA SIDE</div>
                  <div className="text-xs text-slate-400 font-mono">50 PARTICIPANTS</div>
                  <div className="text-xs text-slate-400 font-mono mt-1">
                    VOLUME DEX: <span className="text-fuchsia-400 font-bold">12.4M USDT</span>
                  </div>
                </div>

                {/* Central Countdown Timer */}
                <div className="flex flex-col items-center">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest mb-1">TIME REMAINING</span>
                  <div className="text-4xl lg:text-5xl font-black font-mono tracking-widest text-cyan-300 drop-shadow-[0_0_20px_rgba(6,182,212,0.8)] px-6 py-2 rounded-xl border border-cyan-500/40 bg-black/40">
                    {formatTime(timeLeft)}
                  </div>
                </div>

                {/* Doge Side */}
                <div className="flex flex-col items-center">
                  <div className="relative flex items-center justify-center p-3 rounded-full border border-cyan-500/30 bg-cyan-950/20">
                    <div className="w-24 h-24 rounded-full border-2 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.8)] flex items-center justify-center bg-black/60 overflow-hidden">
                      <img src="https://assets.coingecko.com/coins/images/5/large/dogecoin.png" alt="Doge" className="w-20 h-20 object-contain" />
                    </div>
                  </div>
                  <div className="text-sm font-bold text-cyan-400 mt-3">DOGE SIDE</div>
                  <div className="text-xs text-slate-400 font-mono">50 PARTICIPANTS</div>
                  <div className="text-xs text-slate-400 font-mono mt-1">
                    VOLUME DEX: <span className="text-cyan-400 font-bold">10.8M USDT</span>
                  </div>
                </div>
              </div>

              {/* Chart Representation */}
              <div className="mt-8 border border-slate-800/80 bg-black/40 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs font-mono text-slate-300">VOLUME ON DEX (LAST 30 MIN)</div>
                  <div className="flex gap-2">
                    {["TOTAL", "SHIBA", "DOGE"].map((b) => (
                      <button key={b} className="px-3 py-1 text-[10px] font-mono rounded bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-300">
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chart SVG Canvas */}
                <div className="h-44 w-full relative">
                  <svg className="w-full h-full" viewBox="0 0 500 150" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="shibaGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#d946ef" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#d946ef" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="dogeGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Doge Line */}
                    <path d="M0,110 C80,105 150,115 250,90 C350,65 420,70 500,40" fill="none" stroke="#06b6d4" strokeWidth="2.5" className="drop-shadow-[0_0_8px_#06b6d4]" />
                    {/* Shiba Line */}
                    <path d="M0,130 C80,120 180,140 260,110 C340,80 430,90 500,55" fill="none" stroke="#d946ef" strokeWidth="2.5" className="drop-shadow-[0_0_8px_#d946ef]" />
                  </svg>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2">
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-fuchsia-500" /> Shiba (12.4M)</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Doge (10.8M)</span>
                  </div>
                  <span className="text-slate-500">DEXSCREENER</span>
                </div>
              </div>
            </div>

            {/* Right Panel / Enter Room */}
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
                    <span className="text-cyan-400">Solana / Base</span>
                  </div>
                </div>

                <button className="w-full py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-cyan-500 hover:from-fuchsia-500 hover:to-cyan-400 font-bold text-xs uppercase tracking-widest text-white shadow-[0_0_20px_rgba(217,70,239,0.4)] transition-all">
                  ENTER ROOM →
                </button>
              </div>

              {/* Participants Live Feed */}
              <div className="bg-[#0a1322]/70 border border-cyan-900/40 rounded-2xl p-5 backdrop-blur-md">
                <div className="text-xs font-mono text-slate-400 mb-3">PARTICIPANTS (100)</div>
                <div className="space-y-2">
                  {[
                    { name: "ShibaTeam_97...", side: "shiba", time: "2 min" },
                    { name: "DogeWolf_72...", side: "doge", time: "2 min" },
                    { name: "CryptoLuna", side: "shiba", time: "3 min" },
                    { name: "TraderAlpha", side: "doge", time: "4 min" },
                  ].map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs font-mono p-2 rounded bg-black/30 border border-slate-800/50">
                      <span className={p.side === "shiba" ? "text-fuchsia-400" : "text-cyan-400"}>{p.name}</span>
                      <span className="text-[10px] text-slate-500">{p.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
