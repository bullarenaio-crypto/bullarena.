import React, { useState, useEffect, useRef } from 'react';

const BULL_IMAGE_URL = 'https://i.postimg.cc/kXMHjQJ2/bull-logo-png.png';

export default function App() {
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 7000);

    return () => clearTimeout(timer);
  }, []);

  // Recorte dinâmico: remove o fundo e o quadrado escuro, mantendo apenas o touro néon
  useEffect(() => {
    if (!loading) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = BULL_IMAGE_URL;

    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Percorre os píxeis e torna transparente qualquer fundo escuro
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const brightness = Math.max(r, g, b);

        if (brightness < 35) {
          data[i + 3] = 0; // Transparência total para o fundo/quadrado
        } else if (brightness < 70) {
          data[i + 3] = Math.round(((brightness - 35) / 35) * 255); // Suavização das bordas
        }
      }

      ctx.putImageData(imgData, 0, 0);
    };
  }, [loading]);

  // 1. SPLASH SCREEN: 100% PURE BLACK WITH ONLY THE EXTRACTED BULL HEAD
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
          {/* Cyan neon glow */}
          <div
            style={{
              position: 'absolute',
              width: '320px',
              height: '320px',
              backgroundColor: 'rgba(0, 240, 255, 0.22)',
              borderRadius: '50%',
              filter: 'blur(90px)',
              pointerEvents: 'none'
            }}
          />

          <canvas
            ref={canvasRef}
            style={{
              position: 'relative',
              width: '320px',
              maxWidth: '85vw',
              height: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 25px rgba(0, 240, 255, 0.75))'
            }}
          />
        </div>
      </div>
    );
  }

  // 2. MAIN TERMINAL SCREEN (TRANSITION AFTER 7 SECONDS)
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
        TERMINAL INITIALIZED
      </span>
    </div>
  );
}
