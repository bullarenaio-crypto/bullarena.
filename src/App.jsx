import React, { useState, useEffect } from 'react';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState('/bull-logo.png');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // 7 segundos no splash screen
    const timer = setTimeout(() => {
      setLoading(false);
    }, 7000);

    return () => clearTimeout(timer);
  }, []);

  // Tentativa inteligente: se /bull-logo.png falhar (404), tenta com .png.png
  const handleImageError = () => {
    if (imgSrc === '/bull-logo.png') {
      setImgSrc('/bull-logo.png.png');
    } else if (imgSrc === '/bull-logo.png.png') {
      setImgSrc('/logo.png');
    } else {
      setHasError(true);
    }
  };

  // 1. SPLASH SCREEN (FUNDO PRETO TOTAL)
  if (loading) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: '#000000',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Efeito néon azul difuso atrás do touro */}
          <div
            style={{
              position: 'absolute',
              width: '320px',
              height: '320px',
              backgroundColor: 'rgba(34, 211, 238, 0.18)',
              borderRadius: '50%',
              filter: 'blur(80px)',
              pointerEvents: 'none'
            }}
          />

          <img
            src={imgSrc}
            alt="Bull Logo"
            onError={handleImageError}
            style={{
              position: 'relative',
              width: '280px',
              maxWidth: '85vw',
              height: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 30px rgba(34, 211, 238, 0.7))',
              display: hasError ? 'none' : 'block'
            }}
          />
        </div>

        {/* Mensagem técnica de diagnóstico caso o ficheiro não esteja acessível */}
        {hasError && (
          <div style={{ marginTop: '20px', textAlign: 'center', color: '#ef4444', fontFamily: 'monospace', fontSize: '11px' }}>
            <p style={{ fontWeight: 'bold' }}>Ficheiro de imagem não localizado na pasta public/</p>
            <p style={{ color: '#9ca3af', marginTop: '4px' }}>
              Verifique no GitHub se o nome exato é <code>bull-logo.png</code> ou <code>bull-logo.png.png</code>
            </p>
          </div>
        )}
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
