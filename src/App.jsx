import React, { useState, useEffect } from 'react';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Exatos 7 segundos no splash screen
    const timer = setTimeout(() => {
      setLoading(false);
    }, 7000);

    return () => clearTimeout(timer);
  }, []);

  // 1. SPLASH SCREEN: 100% PRETO, APENAS A CABEÇA DO TOURO CENTRALIZADA COM BRILHO NEON
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
          {/* Efeito néon azul difuso atrás da cabeça */}
          <div
            style={{
              position: 'absolute',
              width: '320px',
              height: '320px',
              backgroundColor: 'rgba(34, 211, 238, 0.15)',
              borderRadius: '50%',
              filter: 'blur(80px)',
              pointerEvents: 'none'
            }}
          />

          <img
            src="/bull-logo.png"
            alt="Bull"
            style={{
              position: 'relative',
              width: '260px',
              maxWidth: '80vw',
              height: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 25px rgba(34, 211, 238, 0.65))'
            }}
          />
        </div>
      </div>
    );
  }

  // 2. APÓS OS 7 SEGUNDOS (PRONTO PARA ENCAIXARMOS O HEADER)
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
