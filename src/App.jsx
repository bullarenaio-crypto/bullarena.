import React, { useState, useEffect } from 'react';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState('/bull-logo.png.jpg');

  useEffect(() => {
    // 7 segundos de splash screen
    const timer = setTimeout(() => {
      setLoading(false);
    }, 7000);

    return () => clearTimeout(timer);
  }, []);

  const handleImageError = () => {
    // Se por acaso tiver mudado no GitHub, testa as outras alternativas
    if (imgSrc === '/bull-logo.png.jpg') {
      setImgSrc('/bull-logo.png.png');
    } else if (imgSrc === '/bull-logo.png.png') {
      setImgSrc('/bull-logo.png');
    }
  };

  // 1. SPLASH SCREEN: 100% PRETO COM A CABEÇA DO TOURO NEON CENTRALIZADA
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
          {/* Brilho neon azul ciano difuso */}
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

          <img
            src={imgSrc}
            alt="Bull Logo"
            onError={handleImageError}
            style={{
              position: 'relative',
              width: '300px',
              maxWidth: '85vw',
              height: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 35px rgba(34, 211, 238, 0.8))'
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
