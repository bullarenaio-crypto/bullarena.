import React, { useState, useEffect } from 'react';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalDuration = 7000; // 7 segundos cravados
    const intervalTime = 50;
    const increment = (intervalTime / totalDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev + increment >= 100) {
          clearInterval(timer);
          setTimeout(() => setLoading(false), 300);
          return 100;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  // 1. SPLASH SCREEN (7 SEGUNDOS)
  if (loading) {
    return (
      <div className="min-h-screen bg-[#02050e] flex flex-col items-center justify-center p-4 select-none">
        <div className="flex flex-col items-center space-y-6">
          {/* Logo da cabeça do touro com pulso neon */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-cyan-500/20 rounded-full blur-2xl animate-pulse"></div>
            <img
              src="/bull-logo.png"
              alt="Bull Protocol Logo"
              className="relative w-36 h-36 md:w-44 md:h-44 object-contain drop-shadow-[0_0_25px_rgba(34,211,238,0.6)]"
            />
          </div>

          {/* Tipografia da Marca */}
          <div className="text-center font-mono">
            <h1 className="text-3xl md:text-4xl font-black tracking-[0.25em] text-white">
              BULL <span className="text-cyan-400">PROTOCOL</span>
            </h1>
            <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-[0.35em] mt-1 font-bold">
              MOMENTUM TRADING TERMINAL
            </p>
          </div>

          {/* Barra de Progresso Tática */}
          <div className="w-64 md:w-80 space-y-2 pt-4">
            <div className="h-1.5 w-full bg-[#081329] rounded-full overflow-hidden border border-[#102450]">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_12px_#22d3ee] transition-all duration-75 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center text-[9px] font-mono text-gray-500 font-bold">
              <span className="text-cyan-400/80 animate-pulse">INITIALIZING FEED...</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. TELA BASE DEPOIS DOS 7 SEGUNDOS (Pronta para encaixarmos o topo no próximo passo)
  return (
    <div className="min-h-screen bg-[#02050e] text-white font-sans p-4 flex flex-col items-center justify-center">
      <div className="p-6 bg-[#030714] border border-[#0d1c3a] rounded-xl text-center space-y-2">
        <h2 className="text-cyan-400 font-mono font-bold text-lg">MÓDULO 1 CONCLUÍDO</h2>
        <p className="text-xs text-gray-400">Splash screen de 7 segundos carregado com sucesso.</p>
        <span className="inline-block px-3 py-1 bg-emerald-950 border border-emerald-500 text-emerald-400 text-[10px] font-mono rounded-full">
          STATUS: PRONTO PARA O HEADER
        </span>
      </div>
    </div>
  );
}
