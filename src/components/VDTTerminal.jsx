import React, { useState } from 'react';
import { 
  Zap, 
  User, 
  Trophy, 
  Gift, 
  Settings, 
  Clock, 
  Users, 
  ChevronRight, 
  ChevronDown,
  LineChart,
  Target
} from 'lucide-react';

export default function VDTTerminal() {
  const [chartTab, setChartTab] = useState('total');

  const participantsList = [
    { name: 'ShibaTeam_1F...', action: 'Joined Team Shiba', time: '2m ago', img: '🦊', side: 'shiba' },
    { name: 'DogeWolf_7a...', action: 'Joined Team Doge', time: '2m ago', img: '🐶', side: 'doge' },
    { name: 'CryptoLuna', action: 'Joined Team Shiba', time: '3m ago', img: '👩‍🎤', side: 'shiba' },
    { name: 'TraderAlpha', action: 'Joined Team Doge', time: '4m ago', img: '🧑‍💻', side: 'doge' },
    { name: 'SolMaster', action: 'Joined Team Shiba', time: '5m ago', img: '👨‍🚀', side: 'shiba' }
  ];

  return (
    <div className="min-h-screen bg-[#02050e] text-white font-sans text-xs select-none p-2 sm:p-4">
      
      {/* 1. TOP HEADER BAR */}
      <header className="flex flex-wrap items-center justify-between border-b border-[#0f1d38] pb-3 mb-4 gap-4 px-2">
        <div className="flex items-center gap-3">
          {/* Logo Bull Protocol */}
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500">
              🐂 BULL
            </span>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-bold leading-none font-mono">
              PROTOCOL
            </span>
          </div>

          <div className="hidden md:block h-6 w-[1px] bg-gray-800 mx-2"></div>

          <div className="hidden md:flex flex-col">
            <span className="text-[9px] font-bold text-gray-400 tracking-wider font-mono">MOMENTUM TRADING TERMINAL</span>
            <span className="text-[8px] text-gray-500 tracking-widest font-mono">TRADES • ROOMS • REAL PROFIT</span>
          </div>
        </div>

        {/* Network & Wallet Controls */}
        <div className="flex items-center gap-3 font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#070e1e] border border-[#132347] text-[10px] font-bold text-gray-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            SOLANA
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#070e1e] border border-[#132347] text-[10px] font-bold text-gray-300">
            <span className="w-3.5 h-3.5 rounded-full bg-indigo-900/60 text-indigo-400 text-[8px] flex items-center justify-center font-bold">R</span>
            RAYDIUM
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#071a17] border border-[#0d3d34] text-[10px] font-bold text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Online
          </div>

          <button className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#091224] border border-[#1d325e] text-[11px] font-bold text-gray-200 hover:bg-[#122247] transition-all">
            <User className="w-3.5 h-3.5 text-gray-400" />
            <span>4F3z...9K7a</span>
            <ChevronDown className="w-3 h-3 text-gray-500" />
          </button>
        </div>
      </header>

      {/* 2. MAIN 3-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        
        {/* LEFT SIDEBAR (Col 1-2) */}
        <div className="lg:col-span-2 space-y-3">
          {/* Main Navigation */}
          <div className="bg-[#050b18]/80 border border-[#0e1b36] rounded-xl p-2 space-y-1">
            <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600/30 to-purple-600/20 border-l-2 border-cyan-400 text-white font-bold text-[11px]">
              <Zap className="w-4 h-4 text-cyan-400" />
              <div className="text-left">
                <div>ROOMS</div>
                <div className="text-[8px] text-gray-400 font-normal">Join live battles</div>
              </div>
            </button>

            <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-400 hover:bg-[#091326] transition-all text-[11px]">
              <User className="w-4 h-4 text-gray-500" />
              <div className="text-left">
                <div className="font-semibold text-gray-300">MY PROFILE</div>
                <div className="text-[8px] text-gray-500 font-normal">Wallet & history</div>
              </div>
            </button>

            <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-400 hover:bg-[#091326] transition-all text-[11px]">
              <Trophy className="w-4 h-4 text-gray-500" />
              <div className="text-left">
                <div className="font-semibold text-gray-300">LEADERBOARD</div>
                <div className="text-[8px] text-gray-500 font-normal">Top traders</div>
              </div>
            </button>

            <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-400 hover:bg-[#091326] transition-all text-[11px]">
              <Gift className="w-4 h-4 text-gray-500" />
              <div className="text-left">
                <div className="font-semibold text-gray-300">REWARDS</div>
                <div className="text-[8px] text-gray-500 font-normal">XP & badges</div>
              </div>
            </button>

            <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-400 hover:bg-[#091326] transition-all text-[11px]">
              <Settings className="w-4 h-4 text-gray-500" />
              <div className="text-left">
                <div className="font-semibold text-gray-300">SETTINGS</div>
                <div className="text-[8px] text-gray-500 font-normal">Preferences</div>
              </div>
            </button>
          </div>

          {/* Left Side Promo Banner */}
          <div className="bg-[#050b18]/80 border border-[#0e1b36] rounded-xl p-3.5 text-center relative overflow-hidden">
            <div className="w-10 h-10 mx-auto mb-2 text-cyan-400 flex items-center justify-center">
              🐂
            </div>
            <div className="text-[10px] font-black text-cyan-400 tracking-wider uppercase leading-tight font-mono">
              MORE MOMENTUM
            </div>
            <div className="text-[10px] font-black text-purple-400 tracking-wider uppercase mb-2 leading-tight font-mono">
              LESS EMOTION
            </div>
            <p className="text-[8px] text-gray-400 leading-normal mb-3 font-sans">
              The rules are simple: whichever market loses volume within 30 minutes settles the pool to the counterparty.
            </p>
            <button className="w-full py-1.5 rounded bg-[#09152b] border border-[#162c59] text-[9px] font-bold text-cyan-400 hover:bg-[#0e2144] transition-all font-mono uppercase">
              HOW IT WORKS?
            </button>
          </div>

          {/* Left Powered By */}
          <div className="px-2 pt-2">
            <div className="text-[8px] font-bold text-gray-600 uppercase tracking-widest mb-1.5 font-mono">POWERED BY</div>
            <div className="flex items-center gap-3 text-gray-500 text-[9px] font-bold font-mono">
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> SOLANA</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span> RAYDIUM</span>
            </div>
          </div>
        </div>

        {/* CENTER STAGE (Col 3-9) */}
        <div className="lg:col-span-7 space-y-3">
          
          {/* Main Versus Arena Card */}
          <div className="bg-[#050b18]/90 border border-[#0f1f3d] rounded-2xl p-4 relative overflow-hidden shadow-2xl">
            {/* Arena Top Tag */}
            <div className="flex justify-center mb-1">
              <span className="px-2.5 py-0.5 rounded text-[8px] font-black tracking-widest uppercase bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-mono">
                ● ACTIVE ROOM
              </span>
            </div>

            <div className="text-center mb-3">
              <h2 className="text-xl sm:text-2xl font-black tracking-wider text-white font-mono">
                SHIBA <span className="text-cyan-400 text-xs px-1">VS</span> DOGE
              </h2>
              <div className="text-[9px] font-bold text-gray-400 tracking-wider uppercase mt-0.5 font-mono">
                30 MINUTES • 100 PARTICIPANTS
              </div>
            </div>

            {/* Duel Face-Off Display */}
            <div className="flex items-center justify-between px-2 sm:px-6 relative">
              
              {/* SHIBA SIDE */}
              <div className="text-center w-36">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gradient-to-tr from-purple-900 to-indigo-700 p-0.5 shadow-lg shadow-purple-500/20 mb-2">
                  <div className="w-full h-full bg-[#070c1a] rounded-full flex items-center justify-center text-3xl sm:text-4xl">
                    🦊
                  </div>
                </div>
                <div className="text-[10px] font-black text-purple-400 uppercase tracking-wider font-mono">SHIBA SIDE</div>
                <div className="text-[9px] font-bold text-gray-300 font-mono">50 PARTICIPANTS</div>
                <div className="text-[9px] font-bold text-purple-400 mt-0.5 font-mono">DEX VOLUME: 12.4M USDT</div>
              </div>

              {/* CENTER COUNTDOWN HUD */}
              <div className="text-center px-2 z-10">
                <div className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1 font-mono">TIME REMAINING</div>
                <div className="relative inline-block">
                  <div className="bg-[#030712] border-2 border-cyan-400/80 px-4 py-1.5 rounded-xl shadow-lg shadow-cyan-500/20 font-mono text-xl sm:text-2xl font-black text-cyan-400 tracking-widest">
                    28:17
                  </div>
                </div>
              </div>

              {/* DOGE SIDE */}
              <div className="text-center w-36">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gradient-to-tr from-cyan-900 to-emerald-700 p-0.5 shadow-lg shadow-cyan-500/20 mb-2">
                  <div className="w-full h-full bg-[#070c1a] rounded-full flex items-center justify-center text-3xl sm:text-4xl">
                    🐶
                  </div>
                </div>
                <div className="text-[10px] font-black text-emerald-400 uppercase tracking-wider font-mono">DOGE SIDE</div>
                <div className="text-[9px] font-bold text-gray-300 font-mono">50 PARTICIPANTS</div>
                <div className="text-[9px] font-bold text-emerald-400 mt-0.5 font-mono">DEX VOLUME: 10.8M USDT</div>
              </div>

            </div>
          </div>

          {/* DexScreener Chart Block */}
          <div className="bg-[#050b18]/90 border border-[#0f1f3d] rounded-2xl p-4 shadow-xl">
            <div className="flex flex-wrap items-center justify-between pb-2.5 border-b border-gray-800/80 gap-2 mb-3">
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-300 uppercase tracking-wider font-mono">
                <LineChart className="w-3.5 h-3.5 text-cyan-400" />
                DEXSCREENER VOLUME (LAST 30 MIN)
              </div>
              <div className="flex items-center gap-1 bg-[#030610] p-0.5 rounded-lg border border-gray-800 text-[8px] font-bold font-mono">
                <button 
                  onClick={() => setChartTab('total')}
                  className={`px-2 py-0.5 rounded ${chartTab === 'total' ? 'bg-[#0f1f3d] text-cyan-300' : 'text-gray-400'}`}
                >
                  TOTAL
                </button>
                <button 
                  onClick={() => setChartTab('shiba')}
                  className={`px-2 py-0.5 rounded ${chartTab === 'shiba' ? 'bg-[#0f1f3d] text-purple-300' : 'text-gray-400'}`}
                >
                  SHIBA
                </button>
                <button 
                  onClick={() => setChartTab('doge')}
                  className={`px-2 py-0.5 rounded ${chartTab === 'doge' ? 'bg-[#0f1f3d] text-emerald-300' : 'text-gray-400'}`}
                >
                  DOGE
                </button>
              </div>
            </div>

            {/* Simulated Chart Container */}
            <div className="h-44 w-full relative flex flex-col justify-between pt-1">
              
              <div className="flex h-36 w-full">
                {/* Y-Axis Labels */}
                <div className="flex flex-col justify-between text-[8px] font-mono text-gray-500 pr-2 pb-2 text-right w-8">
                  <span>25M</span>
                  <span>20M</span>
                  <span>15M</span>
                  <span>10M</span>
                  <span>5M</span>
                  <span>0</span>
                </div>

                {/* SVG Curve Graphic Area */}
                <div className="flex-1 relative">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 500 100" preserveAspectRatio="none">
                    {/* Grid Lines */}
                    <line x1="0" y1="0" x2="500" y2="0" stroke="#0e172a" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="0" y1="20" x2="500" y2="20" stroke="#0e172a" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="0" y1="40" x2="500" y2="40" stroke="#0e172a" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="0" y1="60" x2="500" y2="60" stroke="#0e172a" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="0" y1="80" x2="500" y2="80" stroke="#0e172a" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="0" y1="100" x2="500" y2="100" stroke="#0e172a" strokeWidth="1" />

                    {/* Shiba Purple Curve */}
                    <path d="M0,75 Q70,72 140,65 T280,55 T420,50 L500,48" fill="none" stroke="#a855f7" strokeWidth="2.5" />
                    
                    {/* Doge Green Curve */}
                    <path d="M0,82 Q80,80 160,70 T320,58 T440,42 L500,38" fill="none" stroke="#10b981" strokeWidth="2.5" />
                  </svg>

                  {/* Badges on right edge */}
                  <div className="absolute right-0 top-6 flex flex-col gap-1 items-end pointer-events-none font-mono">
                    <span className="bg-emerald-500 text-black font-black text-[9px] px-1.5 py-0.5 rounded shadow">
                      10.8M
                    </span>
                    <span className="bg-purple-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded shadow">
                      12.4M
                    </span>
                  </div>
                </div>
              </div>

              {/* Chart Time Labels */}
              <div className="flex justify-between items-center text-[8px] font-mono text-gray-500 border-t border-gray-900 pt-1.5 pl-8">
                <span>14:05</span>
                <span>14:10</span>
                <span>14:15</span>
                <span>14:20</span>
                <span>14:25</span>
                <span>14:30</span>
              </div>
            </div>

            {/* Legend Footer */}
            <div className="flex items-center justify-between pt-2 text-[9px] font-mono">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 font-bold text-purple-400">
                  <span className="w-2.5 h-1 bg-purple-500 rounded"></span> Shiba (12.4M)
                </span>
                <span className="flex items-center gap-1 font-bold text-emerald-400">
                  <span className="w-2.5 h-1 bg-emerald-500 rounded"></span> Doge (10.8M)
                </span>
              </div>
              <div className="text-[8px] text-gray-500 uppercase tracking-widest font-bold flex items-center gap-1">
                🦅 DEXSCREENER
              </div>
            </div>
          </div>

          {/* Two-Column Mini Info: How it works & Room Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            
            {/* How It Works */}
            <div className="bg-[#050b18]/90 border border-[#0f1f3d] rounded-2xl p-3.5 space-y-2">
              <div className="text-[10px] font-black uppercase text-white tracking-wider font-mono">
                HOW IT WORKS?
              </div>
              <div className="space-y-1.5 text-[9px] text-gray-400">
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-cyan-950 border border-cyan-600 text-cyan-400 text-[8px] font-bold flex items-center justify-center shrink-0 font-mono">1</span>
                  <div>
                    <span className="font-bold text-gray-200">Pick a side</span>
                    <p className="text-[8px] text-gray-500">Shiba or Doge</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-cyan-950 border border-cyan-600 text-cyan-400 text-[8px] font-bold flex items-center justify-center shrink-0 font-mono">2</span>
                  <div>
                    <span className="font-bold text-gray-200">Enter the room</span>
                    <p className="text-[8px] text-gray-500">Join the 50 participants on either side</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-cyan-950 border border-cyan-600 text-cyan-400 text-[8px] font-bold flex items-center justify-center shrink-0 font-mono">3</span>
                  <div>
                    <span className="font-bold text-gray-200">Track volume performance</span>
                    <p className="text-[8px] text-gray-500">Whichever side generates LESS market volume on DEXScreener over 30 minutes settles the pool to the counterparty.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-800 text-[8px] text-cyan-400/90 font-medium">
                💡 It's not about who buys more. It's about who loses momentum.
              </div>
            </div>

            {/* Room Statistics */}
            <div className="bg-[#050b18]/90 border border-[#0f1f3d] rounded-2xl p-3.5 space-y-2.5">
              <div className="text-[10px] font-black uppercase text-white tracking-wider font-mono">
                ROOM STATISTICS
              </div>

              <div className="grid grid-cols-2 gap-2 text-center font-mono">
                <div className="bg-[#070d1e] p-2 rounded-xl border border-gray-800">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <span className="text-base">🦊</span>
                    <div className="text-left">
                      <div className="text-[8px] font-bold text-purple-400">SHIBA</div>
                      <div className="text-[7px] text-gray-400">50 participants</div>
                    </div>
                  </div>
                  <div className="text-[8px] text-gray-400">Current Volume (30m)</div>
                  <div className="text-[11px] font-black text-purple-400">12.4M USDT</div>
                </div>

                <div className="bg-[#070d1e] p-2 rounded-xl border border-gray-800">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <span className="text-base">🐶</span>
                    <div className="text-left">
                      <div className="text-[8px] font-bold text-emerald-400">DOGE</div>
                      <div className="text-[7px] text-gray-400">50 participants</div>
                    </div>
                  </div>
                  <div className="text-[8px] text-gray-400">Current Volume (30m)</div>
                  <div className="text-[11px] font-black text-emerald-400">10.8M USDT</div>
                </div>
              </div>

              {/* Progress bar Difference */}
              <div className="space-y-1 font-mono">
                <div className="flex justify-between text-[8px] text-gray-400 font-bold">
                  <span>Volume Delta</span>
                  <span className="text-emerald-400 font-black">1.6M USDT</span>
                  <span className="text-gray-500">Live spread</span>
                </div>
                <div className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden flex">
                  <div className="bg-purple-500 h-full w-[54%]"></div>
                  <div className="bg-emerald-400 h-full w-[46%]"></div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT SIDEBAR (Col 10-12) */}
        <div className="lg:col-span-3 space-y-3">
          
          {/* Card Enter Room */}
          <div className="bg-[#050b18]/90 border border-[#0f1f3d] rounded-2xl p-4 shadow-xl space-y-3 font-mono">
            <div className="flex items-center justify-between pb-2 border-b border-gray-800">
              <span className="text-[9px] font-bold text-gray-400 bg-gray-900 px-2 py-0.5 rounded">
                ROOM #4827
              </span>
              <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> IN PROGRESS
              </span>
            </div>

            <div>
              <h3 className="text-sm font-black text-white font-sans">SHIBA vs DOGE</h3>
              <p className="text-[8px] text-gray-400 font-sans">Stake on lowest market volume delta</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[9px] bg-[#070d1e] p-2.5 rounded-xl border border-gray-800">
              <div className="flex items-center gap-1.5 text-gray-400">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <div>
                  <div className="text-[7px] text-gray-500">Duration</div>
                  <div className="font-bold text-gray-200">30 minutes</div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-gray-400">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <div>
                  <div className="text-[7px] text-gray-500">Participants</div>
                  <div className="font-bold text-gray-200">100 / 100</div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center text-[9px] text-gray-400 px-1">
              <span>Blockchain</span>
              <span className="font-bold text-gray-200">Solana (Raydium)</span>
            </div>

            {/* Big Purple CTA Button */}
            <button className="w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-wider bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white shadow-lg shadow-purple-600/30 hover:opacity-95 transition-all flex items-center justify-center gap-2">
              <span>ENTER ROOM</span>
              <span className="text-sm">→</span>
            </button>
          </div>

          {/* Card Participants (100) */}
          <div className="bg-[#050b18]/90 border border-[#0f1f3d] rounded-2xl p-4 shadow-xl space-y-3 font-mono">
            <div className="text-[10px] font-black uppercase text-white tracking-wider">
              PARTICIPANTS (100)
            </div>

            {/* Quick Filter Badges */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#140a2b] border border-purple-800/60 p-1.5 rounded-xl flex items-center gap-2">
                <span className="text-base">🦊</span>
                <div>
                  <div className="text-[8px] text-purple-400 font-bold">SHIBA</div>
                  <div className="text-xs font-black text-white">50</div>
                </div>
              </div>

              <div className="bg-[#071f1a] border border-emerald-800/60 p-1.5 rounded-xl flex items-center gap-2">
                <span className="text-base">🐶</span>
                <div>
                  <div className="text-[8px] text-emerald-400 font-bold">DOGE</div>
                  <div className="text-xs font-black text-white">50</div>
                </div>
              </div>
            </div>

            {/* Participant Real-time List */}
            <div className="space-y-2 pt-1 font-sans">
              {participantsList.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-[9px] bg-[#070d1e] p-2 rounded-xl border border-gray-800/60">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{item.img}</span>
                    <div>
                      <div className="font-bold text-gray-200 font-mono">{item.name}</div>
                      <div className="text-[7px] text-gray-500">{item.action}</div>
                    </div>
                  </div>
                  <span className="text-[8px] text-gray-500 font-mono">{item.time}</span>
                </div>
              ))}
            </div>

            <button className="w-full text-center text-[9px] font-bold text-gray-400 hover:text-white pt-1 flex items-center justify-center gap-1 font-mono">
              <span>View all (100)</span>
              <span>→</span>
            </button>
          </div>

        </div>

      </div>

      {/* 3. BOTTOM FOOTER STEPS & BANNER */}
      <footer className="mt-4 pt-3 border-t border-[#0e1b36] flex flex-col md:flex-row items-center justify-between gap-4 px-2">
        <div className="flex flex-wrap items-center gap-4 sm:gap-8 text-[9px]">
          <div className="flex items-center gap-2 text-gray-300">
            <Zap className="w-4 h-4 text-purple-400 shrink-0" />
            <div>
              <div className="font-black uppercase text-white font-mono">ENTER ON MOMENTUM</div>
              <div className="text-[8px] text-gray-500">Act fast, room caps are limited</div>
            </div>
          </div>

          <span className="text-gray-700 hidden sm:inline">&gt;</span>

          <div className="flex items-center gap-2 text-gray-300">
            <Target className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <div className="font-black uppercase text-white font-mono">STRATEGIC ALLOCATION</div>
              <div className="text-[8px] text-gray-500">Market volume delta determines victor</div>
            </div>
          </div>

          <span className="text-gray-700 hidden sm:inline">&gt;</span>

          <div className="flex items-center gap-2 text-gray-300">
            <Trophy className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="font-black uppercase text-white font-mono">COLLECT YIELD</div>
              <div className="text-[8px] text-gray-500">The counterparty settles the pool</div>
            </div>
          </div>
        </div>

        {/* Right Corner Watermark */}
        <div className="flex items-center gap-2 text-right">
          <div>
            <div className="text-[10px] font-black tracking-wider text-white font-mono">BULL PROTOCOL</div>
            <div className="text-[7px] text-gray-500 uppercase tracking-widest font-bold font-mono">MOMENTUM WINS</div>
          </div>
          <span className="text-xl">🐂</span>
        </div>
      </footer>

    </div>
  );
}
