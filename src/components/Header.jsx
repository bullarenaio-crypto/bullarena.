import React from 'react';
import { Wallet, ChevronDown, Radio } from 'lucide-react';

export default function Header({ walletConnected, setWalletConnected }) {
  return (
    <header className="h-16 bg-[#050813]/90 backdrop-blur-md border-b border-[#142038] px-6 flex items-center justify-between sticky top-0 z-50">
      
      {/* Protocol Live Status Indicator */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-[10px] font-mono font-extrabold tracking-widest text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-3 py-1.5 rounded-lg shadow-inner">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          SECURE • TRANSPARENT • AUTONOMOUS
        </div>
      </div>

      {/* Network Status & Wallet Trigger */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 bg-[#091021] border border-gray-800 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold text-gray-300">
          <span className="w-2 h-2 rounded-full bg-purple-500"></span>
          SOLANA MAINNET
        </div>

        <div className="flex items-center gap-2 bg-emerald-950/30 border border-emerald-800/40 px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          RPC Live
        </div>

        <button 
          onClick={() => setWalletConnected(!walletConnected)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all shadow-lg ${
            walletConnected 
              ? 'bg-[#091021] border border-cyan-500/40 text-cyan-400 hover:bg-[#0f182e]'
              : 'bg-gradient-to-r from-cyan-400 to-blue-600 text-black hover:opacity-90 shadow-cyan-500/20'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>{walletConnected ? '4F3z...9K7a' : 'Connect Wallet'}</span>
          {walletConnected && <ChevronDown className="w-3.5 h-3.5 ml-1 text-gray-400" />}
        </button>
      </div>
    </header>
  );
}
