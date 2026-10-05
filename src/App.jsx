import React, { useState, useEffect } from 'react';

const BULL_IMAGE_URL = 'https://i.postimg.cc/kXMHjQJ2/bull-logo-png.png';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 7000);

    return () => clearTimeout(timer);
  }, []);

  // 1. SPLASH SCREEN: PURE BLACK BACKGROUND WITH ONLY THE NEON BULL HEAD
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
          {/* Subtle cyan glow behind the logo */}
          <div
            style={{
              position: 'absolute',
              width: '320px',
              height: '320px',
              backgroundColor: 'rgba(0, 240, 255, 0.2)',
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
              width: '320px',
              maxWidth: '85vw',
              height: 'auto',
              objectFit: 'contain',
              mixBlendMode: 'screen',
              filter: 'drop-shadow(0 0 25px rgba(0, 240, 255, 0.6))'
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
