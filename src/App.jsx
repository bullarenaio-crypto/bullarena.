import React, { useState, useEffect } from 'react';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 7 segundos cravados
    const timer = setTimeout(() => {
      setLoading(false);
    }, 7000);

    return () => clearTimeout(timer);
  }, []);

  // 1. SPLASH SCREEN: APENAS A CABEÇA DO TOURO NO FUNDO PRETO
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center select-none z-50 overflow-hidden">
        {/* Ponto focal com brilho difuso néon por trás da cabeça */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-72 h-72 md:w-96 md:h-96 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>

          <img
            src="/bull-logo.png"
            alt="Bull Logo"
            className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 object-contain drop-shadow-[0_0_35px_rgba(34,211,238,0.7)] transition-transform duration-1000 ease-in-out hover:scale-105"
          />
        </div>
      </div>
    );
  }

  // 2. TRANSIÇÃO APÓS OS 7 SEGUNDOS
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono text-xs">
      <span className="text-cyan-400 tracking-widest uppercase">
        Terminal Inicializado
      </span>
    </div>
  );
}
