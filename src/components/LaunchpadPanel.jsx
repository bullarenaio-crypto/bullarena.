import React from 'react';
import { ShieldCheck, Lock, CheckCircle2, Cpu, ExternalLink } from 'lucide-react';

export default function LaunchpadPanel() {
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto text-gray-200">
      
      {/* Top Launchpad Alert */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0a0f1d]/90 border border-cyan-500/20 px-5 py-3 rounded-xl shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
          </div>
          <span className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
            FAIR LAUNCH • ZERO ALLOCATION BACKDOORS
          </span>
          <span className="text-[11px] text-gray-500 hidden sm:inline">|</span>
          <span className="text-xs text-gray-400 hidden sm:inline">
            Automated Raydium Liquidity Lock via PDA
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1 rounded-lg">
          <span>● Audited On-Chain</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Token Specs and Curve Progress */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#070c18] border border-[#141f36] rounded-2xl p-6 relative overflow-hidden shadow-2xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-[#141f36]">
              <div>
                <div className="text-[10px] font-mono font-extrabold tracking-widest text-cyan-400 uppercase mb-1">
                  Secure • Transparent • Autonomous
                </div>
                <h2 className="text-xl font-mono font-black tracking-wider text-white">
                  TOKEN LAUNCHPAD
                </h2>
              </div>
              <div className="flex items-center gap-2 bg-[#030610] border border-cyan-500/30 px-3.5 py-1.5 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-400 flex items-center justify-center font-bold">🐂</div>
                <div>
                  <div className="text-xs font-mono font-black text-white">BULL</div>
                  <div className="text-[9px] text-gray-400 font-mono">The Future of Momentum</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-[#030610] border border-[#141f36] rounded-xl p-4 flex flex-col justify-between">
                <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">Max Programmed Supply</span>
                <div className="my-2">
                  <span className="text-2xl font-mono font-black text-cyan-400">500,000,000</span>
                  <span className="text-xs font-mono font-bold text-gray-400 ml-1.5">BULL</span>
                </div>
                <span className="text-[10px] font-mono text-gray-500">Hardcoded Invariant Supply</span>
              </div>

              <div className="bg-[#030610] border border-emerald-500/30 rounded-xl p-4 relative overflow-hidden">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-black mb-2 uppercase">
                  <ShieldCheck className="w-4 h-4" />
                  Anti-Rug Engine Verified
                </div>
                <div className="space-y-1 text-[11px] text-gray-300 font-mono">
                  <div className="flex items-center gap-1.5">✓ Liquidity Burned / Locked</div>
                  <div className="flex items-center gap-1.5">✓ Creator Token Vested (PDA)</div>
                  <div className="flex items-center gap-1.5">✓ Revoked Mint Authority</div>
                  <div className="flex items-center gap-1.5">✓ Revoked Freeze Authority</div>
                </div>
              </div>
            </div>

            <div className="bg-[#030610] border border-[#141f36] rounded-xl p-5 mb-6">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <span className="text-xs font-mono font-black uppercase text-white tracking-wide">BONDING CURVE STATUS</span>
                  <p className="text-[10px] text-gray-400 font-mono">Automated Pricing Formula • Zero Premine</p>
                </div>
                <span className="text-xs font-mono font-black text-cyan-400 bg-cyan-950/40 border border-cyan-800/50 px-2.5 py-1 rounded-lg">
                  100% Completed
                </span>
              </div>

              <div className="w-full h-3.5 bg-[#091021] rounded-full overflow-hidden border border-gray-800 mb-3 relative">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full w-full shadow-lg shadow-cyan-500/30"></div>
              </div>

              <div className="flex justify-between items-center text-[11px] font-mono font-bold text-gray-400">
                <span>500,000,000 / 500,000,000 TOKENS GRADUATED</span>
                <span className="text-emerald-400 font-mono">● Migrated to Raydium Pool</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#141f36] text-[10px] font-mono font-extrabold text-gray-400">
              <div className="flex items-center gap-1.5 text-cyan-400"><CheckCircle2 className="w-3.5 h-3.5" /> Token Initialized</div>
              <div className="flex items-center gap-1.5 text-cyan-400"><CheckCircle2 className="w-3.5 h-3.5" /> Curve Finished</div>
              <div className="flex items-center gap-1.5 text-cyan-400"><Lock className="w-3.5 h-3.5" /> Liquidity Locked</div>
              <div className="flex items-center gap-1.5 text-cyan-400"><Cpu className="w-3.5 h-3.5" /> Fully Autonomous</div>
            </div>
          </div>
        </div>

        {/* Raydium & Pool Telemetry */}
        <div className="space-y-6">
          <div className="bg-[#070c18] border border-[#141f36] rounded-2xl p-5">
            <h3 className="text-xs font-mono font-black uppercase text-white mb-4 tracking-wider pb-3 border-b border-[#141f36]">
              Token Ledger Details
            </h3>
            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between"><span className="text-gray-400">Name</span> <span className="font-bold text-white">Bull Protocol</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Ticker</span> <span className="font-bold text-cyan-400">BULL</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Decimals</span> <span className="font-bold text-white">9</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Blockchain</span> <span className="font-bold text-cyan-400">Solana (SPL)</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Launch State</span> <span className="font-bold text-emerald-400">Live & Trading</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Smart Contract</span> <span className="font-bold text-gray-300">Verified ✓</span></div>
            </div>
          </div>

          <div className="bg-[#070c18] border border-[#141f36] rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#141f36]">
              <div className="flex items-center gap-2 font-mono">
                <div className="w-6 h-6 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center font-black text-xs">R</div>
                <span className="text-xs font-black uppercase text-white tracking-wider">RAYDIUM CPMM POOL</span>
              </div>
              <Lock className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-[11px] text-gray-400 font-mono mb-4">
              Permanent Liquidity Lock via Program-Derived Escrow (PDA)
            </div>
            <div className="grid grid-cols-2 gap-3 bg-[#030610] p-3 rounded-xl border border-gray-800 text-center font-mono">
              <div>
                <div className="text-[9px] text-gray-500 font-bold uppercase">LP Tokens Locked</div>
                <div className="text-sm font-black text-cyan-400 mt-0.5">100.0%</div>
              </div>
              <div>
                <div className="text-[9px] text-gray-500 font-bold uppercase">Lock Period</div>
                <div className="text-sm font-black text-emerald-400 mt-0.5">Permanent</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
