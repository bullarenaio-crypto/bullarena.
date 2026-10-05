import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import VDTTerminal from './components/VDTTerminal';
import LaunchpadPanel from './components/LaunchpadPanel';

export default function App() {
  const [activeTab, setActiveTab] = useState('launchpad');
  const [walletConnected, setWalletConnected] = useState(true);

  return (
    <div className="flex bg-[#040711] text-white min-h-screen font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header walletConnected={walletConnected} setWalletConnected={setWalletConnected} />
        
        <main className="p-6 overflow-y-auto">
          {activeTab === 'launchpad' && <LaunchpadPanel />}
          {activeTab === 'vdt' && <VDTTerminal />}
          
          {activeTab !== 'launchpad' && activeTab !== 'vdt' && (
            <div className="bg-[#070c18] border border-[#141f36] rounded-2xl p-8 text-center">
              <h2 className="text-xl font-black mb-2 text-white uppercase">{activeTab} MODULE</h2>
              <p className="text-gray-400 text-xs">Este módulo do ecossistema Bull Protocol está pronto a ser configurado.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
