import React, { useState, useEffect } from 'react';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 7 segundos exatos na tela de entrada
    const timer = setTimeout(() => {
      setLoading(false);
    }, 7000);

    return () => clearTimeout(timer);
  }, []);

  // 1. TELA DE ENTRADA: 100% PRETA COM O TOURO NEON DESENHADO DIRETO NO CÓDIGO
  if (loading) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: '#000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Brilho neon azul difuso */}
          <div
            style={{
              position: 'absolute',
              width: '320px',
              height: '320px',
              backgroundColor: 'rgba(34, 211, 238, 0.25)',
              borderRadius: '50%',
              filter: 'blur(90px)',
              pointerEvents: 'none'
            }}
          />

          {/* Cabeça do Touro Neon estilizada em vetor de alta resolução */}
          <div style={{ position: 'relative', width: '280px', height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg
              viewBox="0 0 500 500"
              style={{
                width: '100%',
                height: '100%',
                filter: 'drop-shadow(0 0 25px #00f0ff) drop-shadow(0 0 45px rgba(0, 240, 255, 0.4))'
              }}
            >
              <defs>
                <linearGradient id="neonCyan" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00f0ff" />
                  <stop offset="50%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
              </defs>

              {/* Chifre Esquerdo e Contorno Superior */}
              <path
                d="M 250 180 C 220 170 170 145 130 95 C 120 80 100 50 75 100 C 60 135 70 175 110 205 C 145 230 185 240 215 245"
                fill="none"
                stroke="url(#neonCyan)"
                strokeWidth="7"
                strokeLinecap="round"
              />

              {/* Chifre Direito e Contorno Superior */}
              <path
                d="M 250 180 C 280 170 330 145 370 95 C 380 80 400 50 425 100 C 440 135 430 175 390 205 C 355 230 315 240 285 245"
                fill="none"
                stroke="url(#neonCyan)"
                strokeWidth="7"
                strokeLinecap="round"
              />

              {/* Orelha Esquerda */}
              <path
                d="M 170 230 C 135 230 100 245 95 270 C 90 295 125 305 160 280"
                fill="none"
                stroke="url(#neonCyan)"
                strokeWidth="6"
                strokeLinecap="round"
              />

              {/* Orelha Direita */}
              <path
                d="M 330 230 C 365 230 400 245 405 270 C 410 295 375 305 340 280"
                fill="none"
                stroke="url(#neonCyan)"
                strokeWidth="6"
                strokeLinecap="round"
              />

              {/* Testa e Linhas Centrais */}
              <path
                d="M 250 160 L 250 310"
                fill="none"
                stroke="url(#neonCyan)"
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.7"
              />

              {/* Contorno do Focinho e Queixo */}
              <path
                d="M 205 280 C 190 330 195 380 205 410 C 215 435 285 435 295 410 C 305 380 310 330 295 280"
                fill="none"
                stroke="url(#neonCyan)"
                strokeWidth="7"
                strokeLinecap="round"
              />

              {/* Narinas Neon */}
              <path
                d="M 225 395 C 220 385 235 385 235 395"
                fill="none"
                stroke="url(#neonCyan)"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path
                d="M 275 395 C 280 385 265 385 265 395"
                fill="none"
                stroke="url(#neonCyan)"
                strokeWidth="5"
                strokeLinecap="round"
              />

              {/* Olhos Agressivos Neon */}
              <polygon points="190,265 225,278 198,285" fill="#00f0ff" opacity="0.95" />
              <polygon points="310,265 275,278 302,285" fill="#00f0ff" opacity="0.95" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  // 2. APÓS OS 7 SEGUNDOS
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#000000',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'monospace'
      }}
    >
      <span style={{ color: '#22d3ee', letterSpacing: '0.2em' }}>
        TERMINAL INICIALIZADO
      </span>
    </div>
  );
}
