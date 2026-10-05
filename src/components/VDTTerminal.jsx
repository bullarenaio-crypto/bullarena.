import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Clock, 
  TrendingUp, 
  Zap, 
  ChevronRight,
  ArrowUpRight,
  ShieldCheck,
  Activity,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function VDTTerminal() {
  const [selectedSide, setSelectedSide] = useState('shiba');
  const [betAmount, setBetAmount] = useState('0.5');
  const [secondsRemaining, setSecondsRemaining] = useState(1122); // 18m 42s
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txHash, setTxHash] = useState(null);

  // Live Participants Feed State
  const [participants, setParticipants] = useState([
    { id: 1, name: '0x71a...92b4', side: 'shiba', sol: '1.20 SOL', time: '12s ago', color: 'text-cyan-400' },
    { id: 2, name: '4F8k...33d1', side: 'doge', sol: '0.80 SOL', time: '28s ago', color: 'text-amber-400' },
    { id: 3, name: '9J2m...11aa', side: 'shiba', sol: '2.50 SOL', time: '45s ago', color: 'text-cyan-400' },
    { id: 4, name: '3Lk9...88cc', side: 'doge', sol: '0.40 SOL', time: '1m ago', color: 'text-amber-400' },
    { id: 5, name: '8Pn2...55e0', side: 'shiba', sol: '0.50 SOL', time: '2m ago', color: 'text-cyan-400' },
    { id: 6, name: '2Zt4...77fa', side: 'doge', sol: '1.00 SOL', time: '2m ago', color: 'text-amber-400' }
  ]);

  // Live countdown loop
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 1800));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAllocate = () => {
    setIsSubmitting(true);
    setTxHash(null);

    setTimeout(() => {
      setIsSubmitting(false);
      const generatedHash = `5K${Math.random().toString(36).substring(2, 8)}...${Math.random().toString(36).substring(2, 6)}`;
      setTxHash(generatedHash);

      const newEntry = {
        id: Date.now(),
        name: '4F3z...9K7a (You)',
        side: selectedSide,
        sol: `${parseFloat(betAmount).toFixed(2)} SOL`,
        time: 'Just now',
        color: selectedSide === 'shiba' ? 'text-cyan-400' : 'text-amber-400'
      };

      setParticipants((prev) => [newEntry, ...prev.slice(0, 7)]);
    }, 900);
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto text-gray-200">
      
      {/* Top Tactical Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#070b16]/90 border border-cyan-500/20 px-5 py-3 rounded-2xl shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
          </div>
          <span className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
            VDT ARENA • SOLANA HIGH-FREQUENCY DUEL
          </span>
          <span className="text-[11px] text-gray-600 hidden sm:inline">|</span>
          <span className="text-xs text-gray-400 hidden sm:inline font-mono">
            PDA Escrow: <span className="text-cyan-300">BuLLvdt...9aP1</span>
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 bg-[#0d1424] px-3 py-1.5 rounded-xl border border-gray-800">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-gray-400">TOTAL VOLUME:</span>
            <span className="text-emerald-400 font-bold">$26,129,530</span>
          </div>
          <div className="flex items-center gap-2 bg-[#0d1424] px-3 py-1.5 rounded-xl border border-gray-800">
            <span className="text-gray-400">POOL:</span>
            <span className="text-cyan-400 font-bold">142.8 SOL</span>
          </div>
        </div>
      </div>

      {/* Main Terminal Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Core Match Arena */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-[#070c18] border border-cyan-900/30 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
            
            {/* Ambient Background Glows */}
            <div className="absolute -top-32 -left-32 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>

            {/* Duel Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-5 border-b border-gray-800/80">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-black uppercase tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    ROUND #0482 • ACTIVE
                  </span>
                  <span className="text-xs text-gray-400 font-mono">DEX Pair Oracle • 30M Window</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3 font-mono">
                  SHIBA <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-400 font-sans font-bold">VS</span> DOGE
                </h1>
              </div>

              {/* Live Expiration Clock */}
              <div className="bg-[#030610] border border-cyan-500/30 px-5 py-2.5 rounded-2xl text-center shadow-lg">
                <div className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1.5 justify-center font-mono">
                  <Clock className="w-3 h-3 text-cyan-400 animate-spin" /> Round Closes In
                </div>
                <div className="text-cyan-400 font-mono text-2xl font-black tracking-wider mt-0.5">
                  {formatTimer(secondsRemaining)}
                </div>
              </div>
            </div>

            {/* Opponent Selection Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              
              {/* Shiba Long Card */}
              <div 
                onClick={() => setSelectedSide('shiba')}
                className={`cursor-pointer p-5 rounded-2xl border transition-all duration-200 relative group ${
                  selectedSide === 'shiba'
                    ? 'bg-gradient-to-b from-cyan-950/50 to-[#070f20] border-cyan-400 shadow-xl shadow-cyan-500/10 ring-1 ring-cyan-400/50'
                    : 'bg-[#030610]/70 border-gray-800/80 hover:border-cyan-700/50'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-2xl shadow-inner">
                      🐕
                    </div>
                    <div>
                      <div className="text-xs font-black text-cyan-400 font-mono tracking-wider">SHIBA INU</div>
                      <div className="text-[11px] text-gray-400 font-mono">54 Backers (54.6%)</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2.5 py-1 rounded-lg">
                      1.78x
                    </span>
                    <div className="text-[9px] text-gray-500 font-mono mt-1">PAYOUT MULTIPLIER</div>
                  </div>
                </div>

                <div className="space-y-1 pt-2 border-t border-gray-800/60">
                  <div className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">Accumulated DEX Volume</div>
                  <div className="text-2xl font-mono font-black text-white">$14,289,420</div>
                  <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> +18.4% Momentum Speed
                  </div>
                </div>
              </div>

              {/* Doge Long Card */}
              <div 
                onClick={() => setSelectedSide('doge')}
                className={`cursor-pointer p-5 rounded-2xl border transition-all duration-200 relative group ${
                  selectedSide === 'doge'
                    ? 'bg-gradient-to-b from-amber-950/50 to-[#1f1505] border-amber-400 shadow-xl shadow-amber-500/10 ring-1 ring-amber-400/50'
                    : 'bg-[#030610]/70 border-gray-800/80 hover:border-amber-700/50'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl shadow-inner">
                      🐶
                    </div>
                    <div>
                      <div className="text-xs font-black text-amber-400 font-mono tracking-wider">DOGECOIN</div>
                      <div className="text-[11px] text-gray-400 font-mono">46 Backers (45.4%)</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-lg">
                      2.24x
                    </span>
                    <div className="text-[9px] text-gray-500 font-mono mt-1">PAYOUT MULTIPLIER</div>
                  </div>
                </div>

                <div className="space-y-1 pt-2 border-t border-gray-800/60">
                  <div className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">Accumulated DEX Volume</div>
                  <div className="text-2xl font-mono font-black text-white">$11,840,110</div>
                  <div className="text-[11px] text-amber-400 font-mono flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> +7.2% Momentum Speed
                  </div>
                </div>
              </div>

            </div>

            {/* Tactical SVG Line Chart (Volume Velocity) */}
            <div className="bg-[#030610] border border-gray-800/80 rounded-2xl p-4 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-gray-900">
                <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  Raydium Velocity Convergence (Past 30 min)
                </span>
                <div className="flex gap-2 font-mono text-[10px]">
                  <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded">SHIBA: $14.2M</span>
                  <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded">DOGE: $11.8M</span>
                </div>
              </div>

              {/* Vector Chart Representation */}
              <div className="h-36 w-full relative">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="shibaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="dogeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal grid guide lines */}
                  <line x1="0" y1="20" x2="500" y2="20" stroke="#141f36" strokeDasharray="3 3" />
                  <line x1="0" y1="60" x2="500" y2="60" stroke="#141f36" strokeDasharray="3 3" />
                  <line x1="0" y1="100" x2="500" y2="100" stroke="#141f36" strokeDasharray="3 3" />

                  {/* Shiba path & area */}
                  <path d="M0,90 Q120,70 240,45 T500,20 L500,120 L0,120 Z" fill="url(#shibaGradient)" />
                  <path d="M0,90 Q120,70 240,45 T500,20" fill="none" stroke="#22d3ee" strokeWidth="2.5" />
                  <circle cx="500" cy="20" r="4" fill="#22d3ee" className="animate-pulse" />

                  {/* Doge path & area */}
                  <path d="M0,105 Q140,95 260,75 T500,50 L500,120 L0,120 Z" fill="url(#dogeGradient)" />
                  <path d="M0,105 Q140,95 260,75 T500,50" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="4 2" />
                  <circle cx="500" cy="50" r="4" fill="#f59e0b" />
                </svg>
              </div>

              <div className="flex justify-between items-center text-[10px] font-mono text-gray-600 mt-2">
                <span>T-30m (Opening Block)</span>
                <span>T-15m (Midpoint Check)</span>
                <span className="text-cyan-400">NOW (Live Oracle Tick)</span>
              </div>
            </div>

            {/* Strength Proportional Bar */}
            <div className="mb-6 space-y-2">
              <div className="flex justify-between text-xs font-mono font-bold">
                <span className="text-cyan-400">SHIBA SHARE 54.6%</span>
                <span className="text-amber-400">DOGE SHARE 45.4%</span>
              </div>
              <div className="h-3 w-full bg-gray-950 rounded-full overflow-hidden flex p-0.5 border border-gray-800">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-l-full transition-all duration-500 shadow-md shadow-cyan-500/50" style={{ width: '54.6%' }}></div>
                <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-r-full transition-all duration-500 shadow-md shadow-amber-500/50" style={{ width: '45.4%' }}></div>
              </div>
            </div>

            {/* Quick Action Stance Order Module */}
            <div className="bg-[#030610] border border-cyan-500/20 rounded-2xl p-5 shadow-2xl">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-5">
                
                <div className="w-full lg:w-auto space-y-1">
                  <div className="text-xs font-bold text-gray-200 uppercase flex items-center gap-1.5 font-mono">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    Deploy Stance Collateral
                  </div>
                  <div className="text-[11px] text-gray-400 font-mono">
                    Target: <span className={selectedSide === 'shiba' ? 'text-cyan-400 font-bold' : 'text-amber-400 font-bold'}>
                      {selectedSide.toUpperCase()} LONG
                    </span> • Vault Protection Active
                  </div>
                </div>

                {/* Preset Chips */}
                <div className="flex items-center gap-2 w-full lg:w-auto">
                  {['0.1', '0.5', '1.0', '5.0'].map((val) => (
                    <button
                      key={val}
                      onClick={() => setBetAmount(val)}
                      className={`flex-1 lg:flex-initial px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                        betAmount === val 
                          ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30' 
                          : 'bg-[#0d1424] text-gray-300 hover:bg-[#152038] border border-gray-800'
                      }`}
                    >
                      {val} SOL
                    </button>
                  ))}
                </div>

                {/* Submit Stance Button */}
                <button 
                  onClick={handleAllocate}
                  disabled={isSubmitting}
                  className={`w-full lg:w-auto px-7 py-3.5 rounded-xl font-black text-xs font-mono uppercase tracking-wider transition-all shadow-xl flex items-center justify-center gap-2 ${
                    isSubmitting 
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      : selectedSide === 'shiba'
                        ? 'bg-gradient-to-r from-cyan-400 to-blue-600 text-black hover:opacity-95 shadow-cyan-500/30'
                        : 'bg-gradient-to-r from-amber-400 to-orange-500 text-black hover:opacity-95 shadow-amber-500/30'
                  }`}
                >
                  <span>{isSubmitting ? 'SIGNING TRANSACTION...' : `ALLOCATE ${betAmount} SOL`}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              {/* Dynamic Confirmed Toast */}
              {txHash && (
                <div className="mt-4 pt-3 border-t border-gray-900 flex items-center justify-between text-xs font-mono text-emerald-400 bg-emerald-950/20 px-3 py-2 rounded-xl border border-emerald-800/40">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Allocated {betAmount} SOL to {selectedSide.toUpperCase()}. Signature: {txHash}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 underline cursor-pointer">Solana Explorer ↗</span>
                </div>
              )}
            </div>

          </div>

          {/* Protocol Mechanics Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
            <div className="bg-[#070c18] border border-gray-800/80 p-4 rounded-xl">
              <div className="text-cyan-400 text-xs font-black uppercase mb-1">01. DEX Webhook</div>
              <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                Real-time transaction indexing across Raydium liquidity pools with slippage-resistant volume calculation.
              </p>
            </div>
            <div className="bg-[#070c18] border border-gray-800/80 p-4 rounded-xl">
              <div className="text-cyan-400 text-xs font-black uppercase mb-1">02. Autonomous PDA</div>
              <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                Zero custody backdoors. Staking tokens reside inside deterministic Solana Program Derived Addresses.
              </p>
            </div>
            <div className="bg-[#070c18] border border-gray-800/80 p-4 rounded-xl">
              <div className="text-cyan-400 text-xs font-black uppercase mb-1">03. Automated Payout</div>
              <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                Losing stance funds automatically stream to victorious participants proportionally at block expiration.
              </p>
            </div>
          </div>

        </div>

        {/* Live Arena Participants Feed Sidebar */}
        <div className="space-y-6">
          <div className="bg-[#070c18] border border-gray-800/80 rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-gray-800 mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-black uppercase text-white tracking-wider font-mono">
                  Participants ({participants.length + 94})
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
                Live Feed
              </span>
            </div>

            {/* Real-time Stance Feed */}
            <div className="space-y-2.5 max-h-[540px] overflow-y-auto pr-1">
              {participants.map((item) => (
                <div 
                  key={item.id}
                  className="bg-[#030610] border border-gray-800/60 hover:border-gray-700 p-3 rounded-xl flex items-center justify-between text-xs transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2 h-2 rounded-full ${item.side === 'shiba' ? 'bg-cyan-400 shadow-sm shadow-cyan-400' : 'bg-amber-400 shadow-sm shadow-amber-400'}`}></span>
                    <div>
                      <div className="font-mono font-bold text-gray-200">{item.name}</div>
                      <div className="text-[10px] text-gray-500 uppercase font-mono">{item.side} Long</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-emerald-400">{item.sol}</div>
                    <div className="text-[10px] text-gray-500 font-mono">{item.time}</div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 py-2.5 bg-[#030610] border border-gray-800 hover:border-cyan-500/50 rounded-xl text-xs font-mono font-bold text-gray-400 hover:text-white transition-all flex items-center justify-center gap-1.5">
              <span>View On-Chain Explorer Ledger</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Protocol Integrity Shield */}
          <div className="bg-[#070c18] border border-emerald-500/20 rounded-2xl p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs font-mono">
              <div className="text-emerald-400 font-bold uppercase">Audited Invariant Logic</div>
              <div className="text-[11px] text-gray-400 font-sans mt-0.5">
                Funds are mathematically locked until slot signature verification completes.
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
