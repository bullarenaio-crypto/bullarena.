import React, { useState, useEffect, useRef } from 'react';

const BULL_LOGO_URL = 'https://i.postimg.cc/kXMHjQJ2/bull-logo-png.png';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('rooms');
  const canvasRef = useRef(null);

  // Splash Screen de 7 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 7000);

    return () => clearTimeout(timer);
  }, []);

  // Recorte dinâmico da imagem do touro para a tela de abertura
  useEffect(() => {
    if (!loading) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = BULL_LOGO_URL;

    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      for (let i = 0; i < data.length; i += 4) {
        const brightness = Math.max(data[i], data[i + 1], data[i + 2]);
        if (brightness < 35) {
          data[i + 3] = 0;
        } else if (brightness < 70) {
          data[i + 3] = Math.round(((brightness - 35) / 35) * 255);
        }
      }

      ctx.putImageData(imgData, 0, 0);
    };
  }, [loading]);

  // 1. SPLASH SCREEN (7 SEGUNDOS)
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

  // 2. APLICAÇÃO COMPLETA: BULL PROTOCOL (TUDO EM INGLÊS E DARK CYBERPUNK)
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#07090e', color: '#f3f4f6', fontFamily: 'sans-serif' }}>
      
      {/* SIDEBAR LATERAL */}
      <aside
        style={{
          width: '280px',
          backgroundColor: '#0a0d14',
          borderRight: '1px solid rgba(255, 255, 255, 0.07)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '24px 16px'
        }}
      >
        <div>
          {/* LOGO BULL PROTOCOL */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 8px 24px 8px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <img
              src={BULL_LOGO_URL}
              alt="Bull Protocol"
              style={{ width: '42px', height: '42px', objectFit: 'contain', mixBlendMode: 'screen', filter: 'drop-shadow(0 0 10px #00f0ff)' }}
            />
            <div>
              <div style={{ fontSize: '18px', fontWeight: '900', letterSpacing: '0.15em', color: '#ffffff' }}>BULL</div>
              <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.3em', color: '#22d3ee' }}>PROTOCOL</div>
            </div>
          </div>

          {/* MENU DE NAVEGAÇÃO */}
          <nav style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            
            {/* ITEM: BATTLE ROOMS */}
            <button
              onClick={() => setActiveTab('rooms')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: activeTab === 'rooms' ? '1px solid rgba(34, 211, 238, 0.4)' : '1px solid transparent',
                background: activeTab === 'rooms' ? 'linear-gradient(90deg, rgba(168, 85, 247, 0.25) 0%, rgba(34, 211, 238, 0.25) 100%)' : 'transparent',
                color: '#ffffff',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <span style={{ fontSize: '20px' }}>⚔️</span>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 'bold' }}>BATTLE ROOMS</div>
                <div style={{ fontSize: '11px', color: '#9ca3af' }}>Join active battles</div>
              </div>
            </button>

            {/* ITEM: MY PROFILE */}
            <button
              onClick={() => setActiveTab('profile')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid transparent',
                background: activeTab === 'profile' ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                color: '#9ca3af',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <span style={{ fontSize: '18px' }}>👤</span>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: activeTab === 'profile' ? '#fff' : '#d1d5db' }}>MY PROFILE</div>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>Wallet and history</div>
              </div>
            </button>

            {/* ITEM: LEADERBOARD */}
            <button
              onClick={() => setActiveTab('leaderboard')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid transparent',
                background: activeTab === 'leaderboard' ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                color: '#9ca3af',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <span style={{ fontSize: '18px' }}>🏆</span>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: activeTab === 'leaderboard' ? '#fff' : '#d1d5db' }}>LEADERBOARD</div>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>Top traders</div>
              </div>
            </button>

            {/* ITEM: REWARDS */}
            <button
              onClick={() => setActiveTab('rewards')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid transparent',
                background: activeTab === 'rewards' ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                color: '#9ca3af',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <span style={{ fontSize: '18px' }}>🛡️</span>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: activeTab === 'rewards' ? '#fff' : '#d1d5db' }}>REWARDS</div>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>XP and badges</div>
              </div>
            </button>

            {/* ITEM: SETTINGS */}
            <button
              onClick={() => setActiveTab('settings')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid transparent',
                background: activeTab === 'settings' ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                color: '#9ca3af',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <span style={{ fontSize: '18px' }}>⚙️</span>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: activeTab === 'settings' ? '#fff' : '#d1d5db' }}>SETTINGS</div>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>Preferences</div>
              </div>
            </button>
          </nav>
        </div>

        {/* CARD INFORMATIVO INFERIOR */}
        <div
          style={{
            position: 'relative',
            padding: '18px',
            borderRadius: '16px',
            backgroundColor: '#0d111c',
            border: '1px solid rgba(34, 211, 238, 0.2)',
            overflow: 'hidden'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <img
              src={BULL_LOGO_URL}
              alt="Mini Bull"
              style={{ width: '38px', height: '38px', objectFit: 'contain', mixBlendMode: 'screen' }}
            />
          </div>
          <div style={{ fontSize: '11px', fontWeight: '800', textAlign: 'center', color: '#a855f7', letterSpacing: '0.05em' }}>
            MORE MOMENTUM
          </div>
          <div style={{ fontSize: '11px', fontWeight: '800', textAlign: 'center', color: '#22d3ee', marginBottom: '8px', letterSpacing: '0.05em' }}>
            LESS EMOTION
          </div>
          <p style={{ fontSize: '11px', color: '#9ca3af', textAlign: 'center', lineHeight: '1.4', margin: '0 0 14px 0' }}>
            The rule is simple: whichever side loses market volume in 30 minutes pays the other side.
          </p>
          <button
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: 'transparent',
              border: '1px solid #22d3ee',
              color: '#22d3ee',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              letterSpacing: '0.05em'
            }}
          >
            HOW IT WORKS?
          </button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL DO PAINEL */}
      <main style={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        
        {/* TOPO: STATUS E CONEXÃO */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px 0', color: '#ffffff' }}>
              BATTLE ROOMS
            </h1>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
              Live real-time decentralized volume confrontations
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#0f1422', padding: '8px 16px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
              <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#9ca3af' }}>NETWORK ACTIVE</span>
            </div>

            <button
              style={{
                backgroundColor: '#22d3ee',
                color: '#000000',
                fontWeight: '700',
                padding: '10px 20px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                letterSpacing: '0.05em'
              }}
            >
              CONNECT WALLET
            </button>
          </div>
        </header>

        {/* CARDS DE SALAS DE BATALHA */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          
          {/* CARD 1: BTC/USDT */}
          <div
            style={{
              backgroundColor: '#0c101b',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '16px', fontWeight: 'bold' }}>BTC / USDT</span>
                <span style={{ fontSize: '12px', backgroundColor: 'rgba(34, 211, 238, 0.1)', color: '#22d3ee', padding: '4px 8px', borderRadius: '6px' }}>30m Round</span>
              </div>
              <div style={{ fontSize: '28px', fontWeight: '900', color: '#10b981', marginBottom: '6px' }}>
                $96,450.00
              </div>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Current pool prize: 2.50 ETH</p>
            </div>

            <div style={{ marginTop: '24px' }}>
              <button
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: 'rgba(34, 211, 238, 0.15)',
                  border: '1px solid #22d3ee',
                  color: '#22d3ee',
                  fontWeight: 'bold',
                  borderRadius: '10px',
                  cursor: 'pointer'
                }}
              >
                ENTER BATTLE
              </button>
            </div>
          </div>

          {/* CARD 2: SOL/USDT */}
          <div
            style={{
              backgroundColor: '#0c101b',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '16px', fontWeight: 'bold' }}>SOL / USDT</span>
                <span style={{ fontSize: '12px', backgroundColor: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', padding: '4px 8px', borderRadius: '6px' }}>30m Round</span>
              </div>
              <div style={{ fontSize: '28px', fontWeight: '900', color: '#22d3ee', marginBottom: '6px' }}>
                $218.40
              </div>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Current pool prize: 45.00 SOL</p>
            </div>

            <div style={{ marginTop: '24px' }}>
              <button
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: 'rgba(168, 85, 247, 0.15)',
                  border: '1px solid #a855f7',
                  color: '#a855f7',
                  fontWeight: 'bold',
                  borderRadius: '10px',
                  cursor: 'pointer'
                }}
              >
                ENTER BATTLE
              </button>
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}
