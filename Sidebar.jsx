import React from 'react';
import { 
  Zap, 
  User, 
  Trophy, 
  Gift, 
  Settings, 
  ShieldCheck, 
  Layers 
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'launchpad', label: 'Launchpad', icon: Layers, desc: 'Create • Launch • Grow' },
    { id: 'vdt', label: 'Salas VDT', icon: Zap, desc: 'Participe de batalhas' },
    { id: 'profile', label: 'Meu Perfil', icon: User, desc: 'Carteira e histórico' },
    { id: 'ranking', label: 'Ranking', icon: Trophy, desc: 'Top traders' },
    { id: 'rewards', label: 'Recompensas', icon: Gift, desc: 'XP e conquistas' },
    { id: 'security', label: 'Segurança', icon: ShieldCheck, desc: 'Audits & Locks' },
    { id: 'settings', label: 'Configurações', icon: Settings, desc: 'Preferências' },
  ];

  return (
    <aside className="w-64 bg-[#0B0F19] border-r border-[#1E293B] flex flex-col justify-between p-4 select-none min-h-screen">
      <div>
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-2 mb-8 mt-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <span className="text-xl font-black text-black">🐂</span>
          </div>
          <div>
            <h1 className="text-white font-black tracking-wider text-lg flex items-center gap-1">
              BULL <span className="text-cyan-400 text-xs font-semibold px-1.5 py-0.5 rounded bg-cyan-950/50 border border-cyan-800/50">PROTOCOL</span>
            </h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Momentum Trading</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1.5">
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
                  <div className={`text-sm font-bold ${isActive ? 'text-white' : 'text-gray-300'}`}>{item.label}</div>
                  <div className="text-[11px] text-gray-500">{item.desc}</div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Network Status inside Sidebar */}
      <div className="pt-4 border-t border-gray-800/60">
        <div className="bg-[#131B2E] border border-cyan-500/20 rounded-xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
            ⚡
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-bold text-gray-200">BUILT ON SOLANA</div>
            <div className="text-[10px] text-gray-400 truncate">Faster • Cheaper • Together</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
