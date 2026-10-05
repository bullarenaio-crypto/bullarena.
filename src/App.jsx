import React, { useState, useEffect } from 'react';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 7 segundos exatos de tela de entrada
    const timer = setTimeout(() => {
      setLoading(false);
    }, 7000);

    return () => clearTimeout(timer);
  }, []);

  // 1. SPLASH SCREEN: 100% PRETO, APENAS A CABEÇA DO TOURO SEM QUADRADO
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
          {/* Brilho néon ciano difuso */}
          <div
            style={{
              position: 'absolute',
              width: '320px',
              height: '320px',
              backgroundColor: 'rgba(34, 211, 238, 0.22)',
              borderRadius: '50%',
              filter: 'blur(90px)',
              pointerEvents: 'none'
            }}
          />

          {/* Cabeça do Touro Néon pura em código SVG (sem borda nem quadrado) */}
          <div
            style={{
              position: 'relative',
              width: '320px',
              maxWidth: '85vw',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg
              viewBox="0 0 500 500"
              style={{
                width: '100%',
                height: 'auto',
                filter: 'drop-shadow(0 0 25px #00f0ff) drop-shadow(0 0 45px rgba(0, 240, 255, 0.5))'
              }}
            >
              <defs>
                <linearGradient id="neonCyanGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00f0ff" />
                  <stop offset="50%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
              </defs>

              {/* Chifre e Curvatura Esquerda */}
              <path
                d="M 250 175 C 215 165 160 140 120 90 C 110 75 90 45 65 95 C 50 130 60 170 100 200 C 135 225 175 235 205 240"
                fill="none"
                stroke="url(#neonCyanGlow)"
                strokeWidth="7"
                strokeLinecap="round"
              />

              {/* Chifre e Curvatura Direita */}
              <path
                d="M 250 175 C 285 165 340 140 380 90 C 390 75 410 45 435 95 C 450 130 440 170 400 200 C 365 225 325 235 295 240"
                fill="none"
                stroke="url(#neonCyanGlow)"
                strokeWidth="7"
                strokeLinecap="round"
              />

              {/* Orelha Esquerda */}
              <path
                d="M 160 225 C 125 225 90 240 85 265 C 80 290 115 300 150 275"
                fill="none"
                stroke="url(#neonCyanGlow)"
                strokeWidth="6"
                strokeLinecap="round"
              />

              {/* Orelha Direita */}
              <path
                d="M 340 225 C 375 225 410 240 415 265 C 420 290 385 300 350 275"
                fill="none"
                stroke="url(#neonCyanGlow)"
                strokeWidth="6"
                strokeLinecap="round"
              />

              {/* Linha Central da Testa */}
              <path
                d="M 250 160 L 250 300"
                fill="none"
                stroke="url(#neonCyanGlow)"
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.8"
              />

              {/* Focinho e Mandíbula */}
              <path
                d="M 195 275 C 180 325 185 375 195 405 C 205 430 295 430 305 405 C 315 375 320 325 305 275"
                fill="none"
                stroke="url(#neonCyanGlow)"
                strokeWidth="7"
                strokeLinecap="round"
              />

              {/* Narinas Néon */}
              <path
                d="M 225 390 C 220 380 235 380 235 390"
                fill="none"
                stroke="url(#neonCyanGlow)"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path
                d="M 275 390 C 280 380 265 380 265 390"
                fill="none"
                stroke="url(#neonCyanGlow)"
                strokeWidth="5"
                strokeLinecap="round"
              />

              {/* Olhos Néon Iluminados */}
              <polygon points="180,260 215,273 188,280" fill="#00f0ff" opacity="0.95" />
              <polygon points="320,260 285,273 312,280" fill="#00f0ff" opacity="0.95" />
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
