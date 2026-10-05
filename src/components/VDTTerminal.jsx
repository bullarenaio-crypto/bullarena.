import React, { useState } from 'react';
import { Users } from 'lucide-react';

export default function VDTTerminal() {
  const [selectedSide, setSelectedSide] = useState('shiba');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-[#070c18] border border-[#141f36] rounded-2xl p-6 relative overflow-hidden shadow-2xl">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-[#141f36]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase">
                  SALA ATIVA
                </span>
                <span className="text-gray-400 text-xs font-bold">30 MINUTOS • 100 PARTICIPANTES</span>
              </div>
              <h2 className="text-2xl font-black tracking-wider text-white">SHIBA <span className="text-cyan-400">vs</span> DOGE</h2>
            </div>
            
            <div className="bg-[#030610] border border-cyan-500/30 px-4 py-2 rounded-xl text-center">
              <div className="text-[10px] text-gray-400 font-bold uppercase">Tempo Restante</div>
              <div className="text-cyan-400 font-mono font-black text-lg">28:17</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-[#030610] border border-cyan-500/30 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-cyan-500/10 border-2 border-cyan-400 flex items-center justify-center font-bold text-lg">🐕</div>
                <div>
                  <div className="text-xs font-extrabold text-gray-400">LADO SHIBA</div>
                  <div className="text-sm font-black text-white">50 PARTICIPANTES</div>
                </div>
              </div>
              <div className="text-xs text-cyan-400 font-bold mt-2">Volume DEX: 12.4M USDT</div>
            </div>

            <div className="bg-[#030610] border border-purple-500/30 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 border-2 border-purple-400 flex items-center justify-center font-bold text-lg">🐶</div>
                <div>
                  <div className="text-xs font-extrabold text-gray-400">LADO DOGE</div>
                  <div className="text-sm font-black text-white">50 PARTICIPANTES</div>
                </div>
              </div>
              <div className="text-xs text-purple-400 font-bold mt-2">Volume DEX: 10.8M USDT</div>
            </div>
          </div>

          <div className="bg-[#030610] border border-[#141f36] rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-gray-400 uppercase">Volume no DexScreener (Últimos 30 min)</span>
              <div className="flex gap-2">
                <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded font-bold">Shiba (12.4M)</span>
                <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded font-bold">Doge (10.8M)</span>
              </div>
            </div>
            <div className="h-36 flex items-end justify-between gap-1 pt-4 border-b border-gray-800/60 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full bg-gradient-to-t from-cyan-500/5 to-transparent rounded-lg"></div>
              </div>
              <div className="text-[10px] text-gray-500 absolute bottom-1 left-0">14:05</div>
              <div className="text-[10px] text-gray-500 absolute bottom-1 right-0">14:30</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setSelectedSide('shiba')}
              className={`p-4 rounded-xl font-black text-xs tracking-wider transition-all flex justify-between items-center ${
                selectedSide === 'shiba' 
                  ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30 border border-cyan-300' 
                  : 'bg-[#030610] border border-cyan-500/40 text-cyan-400 hover:bg-cyan-950/20'
              }`}
            >
              <span>ALLOCATE LONG • SHIBA</span>
              <span>1.85x</span>
            </button>

            <button 
              onClick={() => setSelectedSide('doge')}
              className={`p-4 rounded-xl font-black text-xs tracking-wider transition-all flex justify-between items-center ${
                selectedSide === 'doge' 
                  ? 'bg-purple-500 text-black shadow-lg shadow-purple-500/30 border border-purple-300' 
                  : 'bg-[#030610] border border-purple-500/40 text-purple-400 hover:bg-purple-950/20'
              }`}
            >
              <span>ALLOCATE LONG • DOGE</span>
              <span>2.15x</span>
            </button>
          </div>

        </div>

        <div className="bg-[#070c18] border border-[#141f36] rounded-2xl p-6">
          <h3 className="text-sm font-black uppercase text-white mb-4">COMO FUNCIONA?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-400">
            <div className="bg-[#030610] p-3.5 rounded-xl border border-gray-800">
              <span className="text-cyan-400 font-black text-sm block mb-1">01. ESCOLHA</span>
              Selecione um lado: Shiba ou Doge com base na força de volume.
            </div>
            <div className="bg-[#030610] p-3.5 rounded-xl border border-gray-800">
              <span className="text-cyan-400 font-black text-sm block mb-1">02. ENTRE NA SALA</span>
              Junte-se à batalha com alocação em SOL via cofre PDA autônomo.
            </div>
            <div className="bg-[#030610] p-3.5 rounded-xl border border-gray-800">
              <span className="text-cyan-400 font-black text-sm block mb-1">03. LUCRE</span>
              O lado com menor volume em 30 minutos paga o outro lado.
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-[#070c18] border border-[#141f36] rounded-2xl p-5">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#141f36]">
            <span className="text-xs font-black uppercase text-white tracking-wider">PARTICIPANTES (100)</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>

          <div className="flex gap-2 mb-4">
            <div className="flex-1 bg-cyan-950/30 border border-cyan-800/40 p-2 rounded-xl text-center">
              <div className="text-[10px] text-gray-400 font-bold">SHIBA</div>
              <div className="text-cyan-400 font-black">50</div>
            </div>
            <div className="flex-1 bg-purple-950/30 border border-purple-800/40 p-2 rounded-xl text-center">
              <div className="text-[10px] text-gray-400 font-bold">DOGE</div>
              <div className="text-purple-400 font-black">50</div>
            </div>
          </div>

          <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
            {[
              { name: 'ShibaTeam_1F...', side: 'shiba', time: '2 min' },
              { name: 'DogeWolf_7a...', side: 'doge', time: '2 min' },
              { name: 'CryptoLuna', side: 'shiba', time: '3 min' },
              { name: 'TraderAlpha', side: 'doge', time: '5 min' },
              { name: 'SolMaster', side: 'shiba', time: '5 min' },
            ].map((user, idx) => (
              <div key={idx} className="bg-[#030610] border border-gray-800/60 p-2.5 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${user.side === 'shiba' ? 'bg-cyan-400' : 'bg-purple-400'}`}></div>
                  <span className="font-bold text-gray-200">{user.name}</span>
                </div>
                <span className="text-[10px] text-gray-500 font-medium">{user.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
