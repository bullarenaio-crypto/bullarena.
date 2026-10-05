import React from 'react';
import { ShieldCheck, Lock, CheckCircle2, Cpu } from 'lucide-react';

export default function LaunchpadPanel() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Coluna Esquerda e Central: Detalhes do Token e Bonding Curve */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#070c18] border border-[#141f36] rounded-2xl p-6 relative overflow-hidden shadow-2xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-[#141f36]">
              <div>
                <div className="text-[10px] font-extrabold tracking-widest text-cyan-400 uppercase mb-1">
                  Secure • Transparent • Autonomous
                </div>
                <h2 className="text-xl font-black tracking-wider text-white">
                  TOKEN LAUNCHPAD
                </h2>
              </div>
              <div className="flex items-center gap-2 bg-[#030610] border border-cyan-500/30 px-3.5 py-1.5 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-400 flex items-center justify-center font-bold">🐂</div>
                <div>
                  <div className="text-xs font-black text-white">BULL</div>
                  <div className="text-[9px] text-gray-400">The Future of Momentum</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-[#030610] border border-[#141f36] rounded-xl p-4 flex flex-col justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Max Supply</span>
                <div className="my-2">
                  <span className="text-xl font-black text-cyan-400">500,000,000</span>
                  <span className="text-xs font-bold text-gray-400 ml-1.5">TOKENS</span>
                </div>
                <span className="text-[10px] text-gray-500">Fixed Programmed Issuance</span>
              </div>

              <div className="bg-[#030610] border border-emerald-500/30 rounded-xl p-4 relative overflow-hidden">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-black mb-2 uppercase">
                  <ShieldCheck className="w-4 h-4" />
                  Anti-Rug Secured
                </div>
                <div className="space-y-1 text-[11px] text-gray-300 font-medium">
                  <div className="flex items-center gap-1.5">✓ Liquidity Locked</div>
                  <div className="flex items-center gap-1.5">✓ Creator Tokens Locked</div>
                  <div className="flex items-center gap-1.5">✓ No Mint Function</div>
                  <div className="flex items-center gap-1.5">✓ No Blacklist</div>
                </div>
              </div>
            </div>

            <div className="bg-[#030610] border border-[#141f36] rounded-xl p-5 mb-6">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <span className="text-xs font-black uppercase text-white tracking-wide">BONDING CURVE</span>
                  <p className="text-[10px] text-gray-400">Automated • Fair Launch • No Manual Control</p>
                </div>
                <span className="text-xs font-black text-cyan-400 bg-cyan-950/40 border border-cyan-800/50 px-2.5 py-1 rounded-lg">
                  100% Curve Completed
                </span>
              </div>

              <div className="w-full h-3.5 bg-[#091021] rounded-full overflow-hidden border border-gray-800 mb-3 relative">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full w-full shadow-lg shadow-cyan-500/30"></div>
              </div>

              <div className="flex justify-between items-center text-[11px] font-bold text-gray-400">
                <span>500,000,000 / 500,000,000 TOKENS</span>
                <span className="text-emerald-400">● Bonding Curve Filled</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#141f36] text-[10px] font-extrabold text-gray-400">
              <div className="flex items-center gap-1.5 text-cyan-400"><CheckCircle2 className="w-3.5 h-3.5" /> Token Created</div>
              <div className="flex items-center gap-1.5 text-cyan-400"><CheckCircle2 className="w-3.5 h-3.5" /> Bonding Curve</div>
              <div className="flex items-center gap-1.5 text-cyan-400"><Lock className="w-3.5 h-3.5" /> Liquidity Locked</div>
              <div className="flex items-center gap-1.5 text-cyan-400"><Cpu className="w-3.5 h-3.5" /> Fully Autonomous</div>
            </div>
          </div>
        </div>

        {/* Coluna Direita: Detalhes do Token e Pool Raydium */}
        <div className="space-y-6">
          <div className="bg-[#070c18] border border-[#141f36] rounded-2xl p-5">
            <h3 className="text-xs font-black uppercase text-white mb-4 tracking-wider pb-3 border-b border-[#141f36]">
              Token Details
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between"><span className="text-gray-400 font-semibold">Name</span> <span className="font-bold text-white">BULL</span></div>
              <div className="flex justify-between"><span className="text-gray-400 font-semibold">Symbol</span> <span className="font-bold text-white">BULL</span></div>
              <div className="flex justify-between"><span className="text-gray-400 font-semibold">Decimals</span> <span className="font-bold text-white">9</span></div>
              <div className="flex justify-between"><span className="text-gray-400 font-semibold">Chain</span> <span className="font-bold text-cyan-400">Solana</span></div>
              <div className="flex justify-between"><span className="text-gray-400 font-semibold">Launch Date</span> <span className="font-bold text-emerald-400">Live</span></div>
              <div className="flex justify-between"><span className="text-gray-400 font-semibold">Contract</span> <span className="font-bold text-gray-300">Verified ✓</span></div>
            </div>
          </div>

          <div className="bg-[#070c18] border border-[#141f36] rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#141f36]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center font-black text-xs">R</div>
                <span className="text-xs font-black uppercase text-white tracking-wider">RAYDIUM POOL</span>
              </div>
              <Lock className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-[11px] text-gray-400 font-semibold mb-4">
              Locked & Immutable via Program-Derived Address (PDA)
            </div>
            <div className="grid grid-cols-2 gap-3 bg-[#030610] p-3 rounded-xl border border-gray-800 text-center">
              <div>
                <div className="text-[9px] text-gray-500 font-bold uppercase">LP Tokens Locked</div>
                <div className="text-sm font-black text-cyan-400 mt-0.5">100%</div>
              </div>
              <div>
                <div className="text-[9px] text-gray-500 font-bold uppercase">Lock Duration</div>
                <div className="text-sm font-black text-emerald-400 mt-0.5">Forever</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
