import React, { useState, useEffect } from 'react';

const BULL_IMAGE_URL = 'https://i.postimg.cc/kXMHjQJ2/bull-logo-png.png';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Exatos 7 segundos no ecrã de entrada
    const timer = setTimeout(() => {
      setLoading(false);
    }, 7000);

    return () => clearTimeout(timer);
  }, []);

  // 1. SPLASH SCREEN: FUNDO 100% PRETO COM A CABEÇA DO TOURO NEON CENTRALIZADA
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
          {/* Brilho néon ciano difuso atrás do touro */}
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

          <img
            src={BULL_IMAGE_URL}
            alt="Bull Logo"
            style={{
              position: 'relative',
              width: '280px',
              maxWidth: '85vw',
              height: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 35px rgba(34, 211, 238, 0.75))'
            }}
          />
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
