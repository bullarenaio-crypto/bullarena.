import React from 'react';
import { 
  Layers, 
  Cpu, 
  Coins, 
  Briefcase, 
  ShieldCheck, 
  Settings, 
  Zap,
  Trophy
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'launchpad', label: 'Launchpad', icon: Layers, desc: 'Create • Launch • Grow' },
    { id: 'tokens', label: 'My Tokens', icon: Cpu, desc: 'View your assets' },
    { id: 'staking', label: 'Staking', icon: Coins, desc: 'Earn rewards' },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase, desc: 'Track performance' },
    { id: 'security', label: 'Security', icon: ShieldCheck, desc: 'Audits & Locks' },
    { id: 'settings', label: 'Settings', icon: Settings, desc: 'Preferences' },
  ];

  return (
    <aside className="w-64 bg-[#050813] border-r border-[#142038] flex flex-col justify-between p-5 select-none min-h-screen">
      <div>
        {/* Logo / Brand Header */}
        <div className="flex items-center gap-3 px-1 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-300/30">
            <span className="text-xl">🐂</span>
          </div>
          <div>
            <h1 className="text-white font-black tracking-wider text-sm flex items-center gap-1">
              BULL PROTOCOL
            </h1>
            <p className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold">Autonomous Solana</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-start gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 text-left group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/10 to-transparent border-l-4 border-cyan-400 text-cyan-400 shadow-inner'
                    : 'text-gray-400 hover:bg-gray-900/50 hover:text-gray-200'
                }`}
              >
                <Icon className={`w-5 h-5 mt-0.5 transition-colors ${isActive ? 'text-cyan-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
                <div>
                  <div className={`text-xs font-bold ${isActive ? 'text-white' : 'text-gray-300'}`}>{item.label}</div>
                  <div className="text-[10px] text-gray-500">{item.desc}</div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Network Badge */}
      <div className="pt-4 border-t border-gray-800/60">
        <div className="bg-[#091021] border border-cyan-500/20 rounded-xl p-3 flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 text-xs">
            ⚡
          </div>
          <div className="overflow-hidden">
            <div className="text-[10px] font-bold text-gray-200">BUILT ON SOLANA</div>
            <div className="text-[9px] text-gray-400 truncate">Faster • Cheaper • Together</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
