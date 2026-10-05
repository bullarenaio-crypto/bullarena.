import React from 'react';
import { 
  Wifi, 
  Wallet, 
  ChevronDown, 
  SlidersHorizontal 
} from 'lucide-react';

export default function Header({ walletConnected, setWalletConnected }) {
  return (
    <header className="h-16 bg-[#0B0F19]/80 backdrop-blur-md border-b border-[#1E293B] px-6 flex items-center justify-between sticky top-0 z-50">
      
      {/* Left: Section Title / Breadcrumb */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-3 py-1.5 rounded-lg">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          MOMENTUM TRADING TERMINAL
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-gray-400 font-medium">
          <span>TRADES</span>
          <span>•</span>
          <span>SALAS</span>
          <span>•</span>
          <span>LUCRO REAL</span>
        </div>
      </div>

      {/* Right: Network Indicators & Wallet Connection */}
      <div className="flex items-center gap-4">
        
        {/* Network Badge: Solana */}
        <div className="hidden sm:flex items-center gap-2 bg-[#131B2E] border border-gray-800 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-300">
          <span className="w-2 h-2 rounded-full bg-purple-500"></span>
          SOLANA
        </div>

        {/* Network Badge: Raydium */}
        <div className="hidden sm:flex items-center gap-2 bg-[#131B2E] border border-gray-800 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-300">
          <span className="w-2 h-2 rounded-full bg-pink-500"></span>
          RAYDIUM
        </div>

        {/* System Online Status */}
        <div className="flex items-center gap-2 bg-emerald-950/30 border border-emerald-800/40 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          Online
        </div>

        {/* Wallet Connect Button */}
        <button 
          onClick={() => setWalletConnected(!walletConnected)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg ${
            walletConnected 
              ? 'bg-[#131B2E] border border-cyan-500/40 text-cyan-400 hover:bg-[#1A233A]'
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black hover:opacity-90 shadow-cyan-500/20'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>{walletConnected ? '4F3z...9K7a' : 'Conectar Carteira'}</span>
          {walletConnected && <ChevronDown className="w-3.5 h-3.5 ml-1 text-gray-400" />}
        </button>

      </div>
    </header>
  );
}
