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
    { 
      name: 'ShibaTeam_1F...', 
      action: 'Joined Team Shiba', 
      time: '2 min', 
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80',
      side: 'shiba' 
    },
    { 
      name: 'DogeWolf_7a...', 
      action: 'Joined Team Doge', 
      time: '2 min', 
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80',
      side: 'doge' 
    },
    { 
      name: 'CryptoLuna', 
      action: 'Joined Team Shiba', 
      time: '3 min', 
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&auto=format&fit=crop&q=80',
      side: 'shiba' 
    },
    { 
      name: 'TraderAlpha', 
      action: 'Joined Team Doge', 
      time: '4 min', 
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&auto=format&fit=crop&q=80',
      side: 'doge' 
    },
    { 
      name: 'SolMaster', 
      action: 'Joined Team Shiba', 
      time: '5 min', 
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=60&auto=format&fit=crop&q=80',
      side: 'shiba' 
    }
  ];

  return (
    <div className="min-h-screen bg-[#02050d] text-white font-sans text-xs select-none p-2 sm:p-3 leading-relaxed">
      
      {/* 1. TOP HEADER BAR */}
      <header className="flex flex-wrap items-center justify-between border-b border-[#0e182f] pb-2.5 mb-3 px-2 gap-3">
        <div className="flex items-center gap-3">
          {/* Bull Logo */}
          <div className="flex items-center gap-2.5">
            <svg className="w-8 h-8 drop-shadow-[0_0_12px_#3b82f6]" viewBox="0 0 100 100" fill="none">
              <path d="M20 25 C15 10, 5 15, 8 30 C12 40, 22 45, 30 52 C35 55, 45 65, 42 78 C38 90, 48 95, 52 82 C55 70, 62 60, 72 54 C80 48, 92 40, 94 28 C96 15, 84 10, 80 25 C75 35, 68 42, 60 46 C55 35, 45 35, 40 46 C32 42, 25 35, 20 25 Z" fill="url(#bullGradient)" />
              <defs>
                <linearGradient id="bullGradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3b82f6" />
                  <stop offset="0.5" stopColor="#8b5cf6" />
                  <stop offset="1" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
            <div>
              <div className="text-xl font-black tracking-widest leading-none text-white flex items-center gap-1">
                BULL
              </div>
              <div className="text-[9px] font-bold tracking-[0.25em] text-gray-400 font-mono leading-tight">
                PROTOCOL
              </div>
            </div>
          </div>

          <div className="hidden md:block h-6 w-[1px] bg-[#142344] mx-1"></div>

          <div className="hidden md:flex flex-col">
            <span className="text-[9px] font-bold text-gray-300 tracking-wider font-mono">MOMENTUM TRADING TERMINAL</span>
            <span className="text-[8px] text-gray-500 tracking-widest font-mono">TRADES • ROOMS • REAL PROFIT</span>
          </div>
        </div>

        {/* Network & Wallet Controls */}
        <div className="flex items-center gap-2.5 font-mono text-[10px]">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#050b18] border border-[#112349] text-gray-300 font-bold">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></span>
            SOLANA
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#050b18] border border-[#112349] text-gray-300 font-bold">
            <span className="w-3.5 h-3.5 rounded-full bg-indigo-900/80 border border-indigo-500/40 text-indigo-300 text-[8px] flex items-center justify-center font-bold">R</span>
            RAYDIUM
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#031512] border border-[#093d32] text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]"></span>
            Online
          </div>

          <button className="flex items-center gap-2 px-3 py-1 rounded-md bg-[#070f22] border border-[#1a3469] text-gray-200 font-bold hover:border-cyan-500/60 transition-all">
            <User className="w-3.5 h-3.5 text-gray-400" />
            <span>4F3z...9K7a</span>
            <ChevronDown className="w-3 h-3 text-gray-500" />
          </button>
        </div>
      </header>

      {/* 2. MAIN 3-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        
        {/* LEFT COLUMN (Col 1-2) */}
        <div className="lg:col-span-2 space-y-2.5">
          
          {/* Main Navigation */}
          <div className="bg-[#040815]/90 border border-[#0d1c3a] rounded-xl p-1.5 space-y-1">
            <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-700/40 via-cyan-900/30 to-transparent border-l-2 border-cyan-400 text-white font-bold text-[11px] shadow-[inset_0_0_12px_rgba(34,211,238,0.15)]">
              <Zap className="w-4 h-4 text-cyan-400" />
              <div className="text-left">
                <div className="leading-tight">ROOMS</div>
                <div className="text-[8px] text-gray-400 font-normal">Join live battles</div>
              </div>
            </button>

            <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-400 hover:bg-[#071126] transition-all text-[11px]">
              <User className="w-4 h-4 text-gray-500" />
              <div className="text-left">
                <div className="font-semibold text-gray-300 leading-tight">MY PROFILE</div>
                <div className="text-[8px] text-gray-500 font-normal">Wallet & history</div>
              </div>
            </button>

            <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-400 hover:bg-[#071126] transition-all text-[11px]">
              <Trophy className="w-4 h-4 text-gray-500" />
              <div className="text-left">
                <div className="font-semibold text-gray-300 leading-tight">LEADERBOARD</div>
                <div className="text-[8px] text-gray-500 font-normal">Top traders</div>
              </div>
            </button>

            <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-400 hover:bg-[#071126] transition-all text-[11px]">
              <Gift className="w-4 h-4 text-gray-500" />
              <div className="text-left">
                <div className="font-semibold text-gray-300 leading-tight">REWARDS</div>
                <div className="text-[8px] text-gray-500 font-normal">XP & badges</div>
              </div>
            </button>

            <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-400 hover:bg-[#071126] transition-all text-[11px]">
              <Settings className="w-4 h-4 text-gray-500" />
              <div className="text-left">
                <div className="font-semibold text-gray-300 leading-tight">SETTINGS</div>
                <div className="text-[8px] text-gray-500 font-normal">Preferences</div>
              </div>
            </button>
          </div>

          {/* Left Promo Card */}
          <div className="bg-[#040815]/90 border border-[#0d1c3a] rounded-xl p-3 text-center relative overflow-hidden">
            <div className="w-8 h-8 mx-auto mb-2 text-cyan-400 flex items-center justify-center">
              <svg className="w-7 h-7 drop-shadow-[0_0_8px_#22d3ee]" viewBox="0 0 100 100" fill="none">
                <path d="M20 25 C15 10, 5 15, 8 30 C12 40, 22 45, 30 52 C35 55, 45 65, 42 78 C38 90, 48 95, 52 82 C55 70, 62 60, 72 54 C80 48, 92 40, 94 28 C96 15, 84 10, 80 25 C75 35, 68 42, 60 46 C55 35, 45 35, 40 46 C32 42, 25 35, 20 25 Z" fill="#22d3ee" />
              </svg>
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
            <button className="w-full py-1 rounded bg-[#071329] border border-[#142854] text-[9px] font-bold text-cyan-400 hover:bg-[#0c1f44] transition-all font-mono uppercase">
              HOW IT WORKS?
            </button>
          </div>

          {/* Left Powered By */}
          <div className="px-2 pt-1">
            <div className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mb-1 font-mono">POWERED BY</div>
            <div className="flex items-center gap-3 text-gray-400 text-[9px] font-bold font-mono">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> SOLANA</span>
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span> RAYDIUM</span>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN (Col 3-9) */}
        <div className="lg:col-span-7 space-y-2.5">
          
          {/* Main Versus Arena Card */}
          <div className="bg-[#030612] border border-[#0d1c3a] rounded-2xl p-4 relative overflow-hidden shadow-2xl">
            
            {/* UNICÓRNIO/CAVALO MÍSTICO NEON ROXO (Fundo Esquerdo) */}
            <div className="absolute -top-3 left-4 w-64 h-64 pointer-events-none opacity-40 mix-blend-screen">
              <svg viewBox="0 0 250 250" className="w-full h-full">
                <defs>
                  <filter id="purpleGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <linearGradient id="unicornGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="50%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
                <path 
                  d="M40 180 C45 150 55 130 75 115 C70 95 65 70 70 45 C78 50 85 60 90 70 C105 55 130 50 150 60 C155 35 168 15 185 8 C172 30 168 55 165 72 C178 95 182 125 168 155 C152 182 120 198 85 198 C55 198 42 188 40 180 Z" 
                  fill="url(#unicornGradient)" 
                  filter="url(#purpleGlowFilter)"
                />
                <path d="M150 60 L210 10" stroke="#f472b6" strokeWidth="3" strokeLinecap="round" filter="url(#purpleGlowFilter)" />
                <path d="M90 70 C110 90 130 100 150 105" stroke="#c084fc" strokeWidth="2" fill="none" opacity="0.6" />
                <path d="M75 115 C95 135 120 145 140 150" stroke="#a855f7" strokeWidth="2" fill="none" opacity="0.6" />
              </svg>
            </div>

            {/* TOURO/FERA CIBERNÉTICA NEON VERDE ESMERALDA (Fundo Direito) */}
            <div className="absolute -top-3 right-4 w-64 h-64 pointer-events-none opacity-40 mix-blend-screen">
              <svg viewBox="0 0 250 250" className="w-full h-full">
                <defs>
                  <filter id="greenGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <linearGradient id="beastGradient" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="50%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
                <path 
                  d="M210 180 C205 150 195 130 175 115 C180 95 185 70 180 45 C172 50 165 60 160 70 C145 55 120 50 100 60 C95 35 82 15 65 8 C78 30 82 55 85 72 C72 95 68 125 82 155 C98 182 130 198 165 198 C195 198 208 188 210 180 Z" 
                  fill="url(#beastGradient)" 
                  filter="url(#greenGlowFilter)"
                />
                <path d="M100 60 L40 10" stroke="#34d399" strokeWidth="3" strokeLinecap="round" filter="url(#greenGlowFilter)" />
                <path d="M160 70 C140 90 120 100 100 105" stroke="#22d3ee" strokeWidth="2" fill="none" opacity="0.6" />
                <path d="M175 115 C155 135 130 145 110 150" stroke="#10b981" strokeWidth="2" fill="none" opacity="0.6" />
              </svg>
            </div>

            {/* Glowing Orb Backgrounds */}
            <div className="absolute top-1/2 left-16 -translate-y-1/2 w-40 h-40 bg-purple-600/30 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="absolute top-1/2 right-16 -translate-y-1/2 w-40 h-40 bg-emerald-500/30 rounded-full blur-[80px] pointer-events-none"></div>

            {/* Arena Top Tag */}
            <div className="flex justify-center mb-1.5 relative z-10">
              <span className="px-2.5 py-0.5 rounded text-[8px] font-black tracking-widest uppercase bg-[#02131b] border border-cyan-400 text-cyan-300 font-mono shadow-[0_0_12px_rgba(34,211,238,0.4)]">
                ● ACTIVE ROOM
              </span>
            </div>

            {/* Title Match */}
            <div className="text-center mb-4 relative z-10">
              <h2 className="text-xl sm:text-2xl font-black tracking-wider text-white font-mono drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                SHIBA <span className="text-cyan-400 text-xs px-1">VS</span> DOGE
              </h2>
              <div className="text-[9px] font-bold text-gray-400 tracking-wider uppercase mt-0.5 font-mono">
                30 MINUTES • 100 PARTICIPANTS
              </div>
            </div>

            {/* Duel Face-Off Display */}
            <div className="flex items-center justify-between px-3 sm:px-8 relative z-10">
              
              {/* SHIBA SIDE */}
              <div className="text-center w-36">
                <div className="relative inline-block mb-2">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[3px] bg-gradient-to-tr from-purple-600 via-pink-500 to-indigo-500 shadow-[0_0_25px_#a855f7]">
                    <div className="w-full h-full rounded-full bg-[#080318] flex items-center justify-center overflow-hidden border-2 border-purple-400/80">
                      <img 
                        src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=200&auto=format&fit=crop&q=80" 
                        alt="Shiba" 
                        className="w-full h-full object-cover scale-110" 
                      />
                    </div>
                  </div>
                </div>
                <div className="text-[10px] font-black text-purple-400 uppercase tracking-wider font-mono">SHIBA SIDE</div>
                <div className="text-[9px] font-bold text-gray-300 font-mono">50 PARTICIPANTS</div>
                <div className="text-[9px] font-bold text-purple-400 mt-0.5 font-mono">DEX VOLUME: 12.4M USDT</div>
              </div>

              {/* CENTER COUNTDOWN HUD HEXAGONAL */}
              <div className="text-center px-2 z-10">
                <div className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">TIME REMAINING</div>
                <div className="relative inline-block">
                  {/* Hexagon/Chamfered styled box */}
                  <div 
                    className="bg-[#02050f] border-2 border-cyan-400 px-6 py-2 shadow-[0_0_25px_rgba(34,211,238,0.5)] font-mono text-2xl sm:text-3xl font-black text-cyan-400 tracking-widest"
                    style={{ clipPath: 'polygon(10px 0%, calc(100% - 10px) 0%, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0% calc(100% - 10px), 0% 10px)' }}
                  >
                    28:17
                  </div>
                </div>
              </div>

              {/* DOGE SIDE */}
              <div className="text-center w-36">
                <div className="relative inline-block mb-2">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[3px] bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 shadow-[0_0_25px_#10b981]">
                    <div className="w-full h-full rounded-full bg-[#02130e] flex items-center justify-center overflow-hidden border-2 border-emerald-400/80">
                      <img 
                        src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&auto=format&fit=crop&q=80" 
                        alt="Doge" 
                        className="w-full h-full object-cover scale-110" 
                      />
                    </div>
                  </div>
                </div>
                <div className="text-[10px] font-black text-emerald-400 uppercase tracking-wider font-mono">DOGE SIDE</div>
                <div className="text-[9px] font-bold text-gray-300 font-mono">50 PARTICIPANTS</div>
                <div className="text-[9px] font-bold text-emerald-400 mt-0.5 font-mono">DEX VOLUME: 10.8M USDT</div>
              </div>

            </div>
          </div>

          {/* DexScreener Chart Block */}
          <div className="bg-[#030612] border border-[#0d1c3a] rounded-2xl p-4 shadow-xl">
            <div className="flex flex-wrap items-center justify-between pb-2 border-b border-gray-800/80 gap-2 mb-2">
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-300 uppercase tracking-wider font-mono">
                <LineChart className="w-3.5 h-3.5 text-cyan-400" />
                DEXSCREENER VOLUME (LAST 30 MIN)
              </div>
              <div className="flex items-center gap-1 bg-[#02050f] p-0.5 rounded-lg border border-gray-800 text-[8px] font-bold font-mono">
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

            {/* Chart Container with Organic Oscillating Curves */}
            <div className="h-44 w-full relative flex flex-col justify-between pt-1">
              <div className="flex h-36 w-full">
                {/* Y-Axis Labels */}
                <div className="flex flex-col justify-between text-[8px] font-mono text-gray-500 pr-2 pb-1 text-right w-8">
                  <span>25M</span>
                  <span>20M</span>
                  <span>15M</span>
                  <span>10M</span>
                  <span>5M</span>
                  <span>0</span>
                </div>

                {/* SVG Curve Graphic Area */}
                <div className="flex-1 relative overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 500 100" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="shibaWaveGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="dogeWaveGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Grid lines */}
                    <line x1="0" y1="2" x2="500" y2="2" stroke="#0e172a" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="0" y1="20" x2="500" y2="20" stroke="#0e172a" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="0" y1="40" x2="500" y2="40" stroke="#0e172a" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="0" y1="60" x2="500" y2="60" stroke="#0e172a" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="0" y1="80" x2="500" y2="80" stroke="#0e172a" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="0" y1="99" x2="500" y2="99" stroke="#0e172a" strokeWidth="1" />

                    {/* Shiba Wave (Roxo) */}
                    <path
                      d="M 0,78 C 30,85 50,72 80,75 C 110,80 130,68 160,70 C 190,72 210,82 240,78 C 270,72 290,62 320,60 C 350,58 380,66 410,64 C 440,60 470,55 500,54 L 500,100 L 0,100 Z"
                      fill="url(#shibaWaveGlow)"
                    />
                    <path
                      d="M 0,78 C 30,85 50,72 80,75 C 110,80 130,68 160,70 C 190,72 210,82 240,78 C 270,72 290,62 320,60 C 350,58 380,66 410,64 C 440,60 470,55 500,54"
                      fill="none"
                      stroke="#c084fc"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Doge Wave (Verde Esmeralda) */}
                    <path
                      d="M 0,85 C 25,82 45,90 70,80 C 95,72 125,78 150,68 C 180,60 205,72 235,64 C 265,56 295,48 325,46 C 355,44 385,52 415,40 C 445,30 475,36 500,34 L 500,100 L 0,100 Z"
                      fill="url(#dogeWaveGlow)"
                    />
                    <path
                      d="M 0,85 C 25,82 45,90 70,80 C 95,72 125,78 150,68 C 180,60 205,72 235,64 C 265,56 295,48 325,46 C 355,44 385,52 415,40 C 445,30 475,36 500,34"
                      fill="none"
                      stroke="#34d399"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* Volume Pills on right edge */}
                  <div className="absolute right-0 top-6 flex flex-col gap-1.5 items-end pointer-events-none font-mono">
                    <span className="bg-[#10b981] text-black font-black text-[9px] px-1.5 py-0.5 rounded shadow-[0_0_12px_#10b981]">
                      10.8M
                    </span>
                    <span className="bg-[#9333ea] text-white font-black text-[9px] px-1.5 py-0.5 rounded shadow-[0_0_12px_#9333ea]">
                      12.4M
                    </span>
                  </div>
                </div>
              </div>

              {/* Time axis */}
              <div className="flex justify-between items-center text-[8px] font-mono text-gray-500 border-t border-gray-900 pt-1 pl-8">
                <span>14:05</span>
                <span>14:10</span>
                <span>14:15</span>
                <span>14:20</span>
                <span>14:25</span>
                <span>14:30</span>
              </div>
            </div>

            {/* Bottom Chart Footer */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            
            {/* How It Works */}
            <div className="bg-[#030612] border border-[#0d1c3a] rounded-2xl p-3.5 space-y-2">
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

              <div className="pt-2 border-t border-gray-800 text-[8px] text-cyan-400 font-medium">
                💡 It's not about who buys more. It's about who loses momentum.
              </div>
            </div>

            {/* Room Statistics */}
            <div className="bg-[#030612] border border-[#0d1c3a] rounded-2xl p-3.5 space-y-2.5">
              <div className="text-[10px] font-black uppercase text-white tracking-wider font-mono">
                ROOM STATISTICS
              </div>

              <div className="grid grid-cols-2 gap-2 text-center font-mono">
                <div className="bg-[#050b18] p-2 rounded-xl border border-gray-800">
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

                <div className="bg-[#050b18] p-2 rounded-xl border border-gray-800">
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
                <div className="h-1.5 w-full bg-gray-950 rounded-full overflow-hidden flex">
                  <div className="bg-purple-500 h-full w-[54%] shadow-[0_0_10px_#a855f7]"></div>
                  <div className="bg-emerald-400 h-full w-[46%] shadow-[0_0_10px_#34d399]"></div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN (Col 10-12) */}
        <div className="lg:col-span-3 space-y-2.5">
          
          {/* Card Enter Room */}
          <div className="bg-[#030612] border border-[#0d1c3a] rounded-2xl p-4 shadow-xl space-y-3 font-mono">
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

            <div className="grid grid-cols-2 gap-2 text-[9px] bg-[#050b18] p-2.5 rounded-xl border border-gray-800">
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

            {/* Glowing Purple CTA Button */}
            <button className="w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-wider bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white shadow-[0_0_20px_rgba(147,51,234,0.5)] hover:opacity-95 transition-all flex items-center justify-center gap-2">
              <span>ENTER ROOM</span>
              <span className="text-sm">→</span>
            </button>
          </div>

          {/* Card Participants (100) */}
          <div className="bg-[#030612] border border-[#0d1c3a] rounded-2xl p-4 shadow-xl space-y-3 font-mono">
            <div className="text-[10px] font-black uppercase text-white tracking-wider">
              PARTICIPANTS (100)
            </div>

            {/* Quick Filter Badges */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#100624] border border-purple-800/60 p-2 rounded-xl flex items-center gap-2.5">
                <span className="text-base">🦊</span>
                <div>
                  <div className="text-[8px] text-purple-400 font-bold">SHIBA</div>
                  <div className="text-xs font-black text-white">50</div>
                </div>
              </div>

              <div className="bg-[#031713] border border-emerald-800/60 p-2 rounded-xl flex items-center gap-2.5">
                <span className="text-base">🐶</span>
                <div>
                  <div className="text-[8px] text-emerald-400 font-bold">DOGE</div>
                  <div className="text-xs font-black text-white">50</div>
                </div>
              </div>
            </div>

            {/* Participant Real-time List with avatars */}
            <div className="space-y-2 pt-1 font-sans">
              {participantsList.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-[9px] bg-[#050b18] p-2 rounded-xl border border-gray-800/60">
                  <div className="flex items-center gap-2">
                    <img src={item.avatar} alt="User" className="w-5 h-5 rounded-full object-cover border border-gray-700" />
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
      <footer className="mt-3 pt-2.5 border-t border-[#0d1c3a] flex flex-col md:flex-row items-center justify-between gap-4 px-2">
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
          <svg className="w-6 h-6 drop-shadow-[0_0_8px_#3b82f6]" viewBox="0 0 100 100" fill="none">
            <path d="M20 25 C15 10, 5 15, 8 30 C12 40, 22 45, 30 52 C35 55, 45 65, 42 78 C38 90, 48 95, 52 82 C55 70, 62 60, 72 54 C80 48, 92 40, 94 28 C96 15, 84 10, 80 25 C75 35, 68 42, 60 46 C55 35, 45 35, 40 46 C32 42, 25 35, 20 25 Z" fill="#3b82f6" />
          </svg>
        </div>
      </footer>

    </div>
  );
}
