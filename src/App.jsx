import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import VDTTerminal from './components/VDTTerminal';
import LaunchpadPanel from './components/LaunchpadPanel';

export default function App() {
  const [activeTab, setActiveTab] = useState('vdt');
  const [walletConnected, setWalletConnected] = useState(true);

  return (
    <div className="flex bg-[#040711] text-white min-h-screen font-sans">
      {/* Sidebar Controller */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Terminal Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header walletConnected={walletConnected} setWalletConnected={setWalletConnected} />
        
        <main className="p-6 overflow-y-auto">
          {activeTab === 'vdt' && <VDTTerminal />}
          {activeTab === 'launchpad' && <LaunchpadPanel />}
          
          {/* Fallback View for Pending Modules */}
          {activeTab !== 'vdt' && activeTab !== 'launchpad' && (
            <div className="bg-[#070c18] border border-[#141f36] rounded-2xl p-12 text-center max-w-xl mx-auto my-12">
              <div className="w-12 h-12 bg-cyan-950/40 border border-cyan-800/40 rounded-xl flex items-center justify-center mx-auto mb-4 text-cyan-400 font-mono text-xl">
                ⚡
              </div>
              <h2 className="text-lg font-mono font-black mb-2 text-white uppercase tracking-wider">
                {activeTab} Module Initializing
              </h2>
              <p className="text-gray-400 text-xs font-mono leading-relaxed">
                Smart contract listeners and UI components are primed for this sector. Deploy module on demand.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
