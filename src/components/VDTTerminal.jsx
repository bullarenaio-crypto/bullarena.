import React, { useState } from 'react';
import { 
  Users, 
  Clock, 
  TrendingUp, 
  Zap, 
  ChevronRight,
  ArrowUpRight,
  ShieldCheck,
  Radio
} from 'lucide-react';

export default function VDTTerminal() {
  const [selectedSide, setSelectedSide] = useState('shiba');
  const [betAmount, setBetAmount] = useState('0.5');

  const participants = [
    { name: '0x71a...92b4', side: 'shiba', sol: '1.2 SOL', time: '12s ago', color: 'text-cyan-400' },
    { name: '4F8k...33d1', side: 'doge', sol: '0.8 SOL', time: '28s ago', color: 'text-amber-400' },
    { name: '9J2m...11aa', side: 'shiba', sol: '2.5 SOL', time: '45s ago', color: 'text-cyan-400' },
    { name: '3Lk9...88cc', side: 'doge', sol: '0.4 SOL', time: '1m ago', color: 'text-amber-400' },
    { name: '8Pn2...55e0', side: 'shiba', sol: '0.5 SOL', time: '2m ago', color: 'text-cyan-400' },
    { name: '2Zt4...77fa', side: 'doge', sol: '1.0 SOL', time: '2m ago', color: 'text-amber-400' },
    { name: '5Wq1...44bb', side: 'shiba', sol: '3.0 SOL', time: '3m ago', color: 'text-cyan-400' },
    { name: '1Vb8...99dd', side: 'doge', sol: '0.2 SOL', time: '4m ago', color: 'text-amber-400' }
  ];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto text-gray-200">
      
      {/* Top Protocol Status Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0a0f1d]/90 border border-cyan-500/20 px-5 py-3 rounded-xl shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
          </div>
          <span className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
            VDT ARENA • SOLANA MAINNET
          </span>
          <span className="text-[11px] text-gray-500 hidden sm:inline">|</span>
          <span className="text-xs text-gray-400 hidden sm:inline">
            100% On-Chain Settlement via Autonomous PDA Vaults
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 bg-[#0e172a] px-3 py-1 rounded-lg border border-gray-800">
            <span className="text-gray-400">TOTAL ARENA POOL:</span>
            <span className="text-emerald-400 font-bold">142.8 SOL</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Duel Hub & Participants Sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Duel Command Center */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-[#070b16] border border-cyan-900/30 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Duel Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-5 border-b border-gray-800/80">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    ARENA #0482 • ACTIVE
                  </span>
                  <span className="text-xs text-gray-400 font-medium">30 Min Window • DEX Volume Driven</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2 font-mono">
                  SHIBA <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-amber-400">VS</span> DOGE
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-[#0b1222] border border-cyan-500/30 px-4 py-2.5 rounded-xl text-center shadow-inner">
                  <div className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1 justify-center">
                    <Clock className="w-3 h-3 text-cyan-400" /> Time Remaining
                  </div>
                  <div className="text-cyan-400 font-mono text-xl font-black tracking-wider">
                    18:42
                  </div>
                </div>
              </div>
            </div>

            {/* Competitor Matchup Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              
              {/* SHIBA Stance */}
              <div 
                onClick={() => setSelectedSide('shiba')}
                className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 relative ${
                  selectedSide === 'shiba'
                    ? 'bg-gradient-to-b from-cyan-950/40 to-[#0a1120] border-cyan-400 shadow-lg shadow-cyan-500/10'
                    : 'bg-[#0a0f1e]/60 border-gray-800/80 hover:border-cyan-700/60'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-xl">
                      🐕
                    </div>
                    <div>
                      <div className="text-xs font-black text-cyan-400 uppercase tracking-wide">SHIBA INU</div>
                      <div className="text-[11px] text-gray-400">54 Backers</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded">
                    1.78x
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] text-gray-400 font-mono">DEX Volume Index</div>
                  <div className="text-xl font-mono font-black text-white">$14,289,420</div>
                  <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 font-mono">
                    <TrendingUp className="w-3 h-3" /> +18.4% last 15 min
                  </div>
                </div>
              </div>

              {/* DOGE Stance */}
              <div 
                onClick={() => setSelectedSide('doge')}
                className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 relative ${
                  selectedSide === 'doge'
                    ? 'bg-gradient-to-b from-amber-950/40 to-[#0a1120] border-amber-400 shadow-lg shadow-amber-500/10'
                    : 'bg-[#0a0f1e]/60 border-gray-800/80 hover:border-amber-700/60'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl">
                      🐶
                    </div>
                    <div>
                      <div className="text-xs font-black text-amber-400 uppercase tracking-wide">DOGECOIN</div>
                      <div className="text-[11px] text-gray-400">46 Backers</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-300 px-2 py-1 rounded">
                    2.24x
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] text-gray-400 font-mono">DEX Volume Index</div>
                  <div className="text-xl font-mono font-black text-white">$11,840,110</div>
                  <div className="text-[10px] text-amber-400 font-medium flex items-center gap-1 font-mono">
                    <TrendingUp className="w-3 h-3" /> +7.2% last 15 min
                  </div>
                </div>
              </div>

            </div>

            {/* Ratio Progress Distribution */}
            <div className="mb-6 space-y-2">
              <div className="flex justify-between text-xs font-mono font-bold">
                <span className="text-cyan-400">SHIBA 54.6%</span>
                <span className="text-amber-400">DOGE 45.4%</span>
              </div>
              <div className="h-3 w-full bg-gray-900 rounded-full overflow-hidden flex p-0.5 border border-gray-800">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-l-full" style={{ width: '54.6%' }}></div>
                <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-r-full" style={{ width: '45.4%' }}></div>
              </div>
            </div>

            {/* Order Execution Bar */}
            <div className="bg-[#0b1222] border border-gray-800 rounded-xl p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="w-full sm:w-auto space-y-1">
                  <div className="text-xs font-bold text-gray-300 uppercase flex items-center gap-1.5 font-mono">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    Enter Stance with SOL
                  </div>
                  <div className="text-[11px] text-gray-500">
                    Selected Stance: <span className={selectedSide === 'shiba' ? 'text-cyan-400 font-bold' : 'text-amber-400 font-bold'}>
                      {selectedSide.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {['0.1', '0.5', '1.0', '5.0'].map((val) => (
                    <button
                      key={val}
                      onClick={() => setBetAmount(val)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                        betAmount === val 
                          ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20' 
                          : 'bg-[#141e33] text-gray-300 hover:bg-gray-800 border border-gray-700'
                      }`}
                    >
                      {val} SOL
                    </button>
                  ))}
                </div>

                <button 
                  className={`w-full sm:w-auto px-6 py-3 rounded-xl font-black text-xs font-mono uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 ${
                    selectedSide === 'shiba'
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-600 text-black hover:opacity-95 shadow-cyan-500/20'
                      : 'bg-gradient-to-r from-amber-400 to-orange-500 text-black hover:opacity-95 shadow-amber-500/20'
                  }`}
                >
                  <span>ALLOCATE {betAmount} SOL</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Protocol Mechanics Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
            <div className="bg-[#070b16] border border-gray-800/80 p-4 rounded-xl">
              <div className="text-cyan-400 text-xs font-black uppercase mb-1">01. DEX Oracles</div>
              <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                Consolidated volume streams directly sourced from Raydium and DEXScreener webhooks.
              </p>
            </div>
            <div className="bg-[#070b16] border border-gray-800/80 p-4 rounded-xl">
              <div className="text-cyan-400 text-xs font-black uppercase mb-1">02. Autonomous Vaults</div>
              <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                Non-custodial collateral custody locked in Program-Derived Addresses (PDAs) with zero human intervention.
              </p>
            </div>
            <div className="bg-[#070b16] border border-gray-800/80 p-4 rounded-xl">
              <div className="text-cyan-400 text-xs font-black uppercase mb-1">03. Automated Settlement</div>
              <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                Winning stance claims the proportional pool balance instantly upon time expiration.
              </p>
            </div>
          </div>

        </div>

        {/* Live Arena Participants Feed */}
        <div className="space-y-6">
          <div className="bg-[#070b16] border border-gray-800/80 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-gray-800 mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-black uppercase text-white tracking-wider font-mono">
                  Participants (100)
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
                Live Feed
              </span>
            </div>

            {/* List */}
            <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
              {participants.map((item, idx) => (
                <div 
                  key={idx}
                  className="bg-[#0b1222] border border-gray-800/60 hover:border-gray-700 p-3 rounded-xl flex items-center justify-between text-xs transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2 h-2 rounded-full ${item.side === 'shiba' ? 'bg-cyan-400' : 'bg-amber-400'}`}></span>
                    <div>
                      <div className="font-mono font-bold text-gray-200">{item.name}</div>
                      <div className="text-[10px] text-gray-500 uppercase font-mono">{item.side}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-emerald-400">{item.sol}</div>
                    <div className="text-[10px] text-gray-500 font-mono">{item.time}</div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 py-2.5 bg-[#0b1222] border border-gray-800 hover:border-cyan-500/50 rounded-xl text-xs font-mono font-bold text-gray-400 hover:text-white transition-all flex items-center justify-center gap-1.5">
              <span>View On-Chain Ledger</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
