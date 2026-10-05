{/* DexScreener Chart Block */}
          <div className="bg-[#050b18]/90 border border-[#0f1f3d] rounded-2xl p-4 shadow-xl">
            <div className="flex flex-wrap items-center justify-between pb-2.5 border-b border-gray-800/80 gap-2 mb-3">
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-300 uppercase tracking-wider font-mono">
                <LineChart className="w-3.5 h-3.5 text-cyan-400" />
                DEXSCREENER VOLUME (LAST 30 MIN)
              </div>
              <div className="flex items-center gap-1 bg-[#030610] p-0.5 rounded-lg border border-gray-800 text-[8px] font-bold font-mono">
                <button 
                  onClick={() => setChartTab('total')}
                  className={`px-2 py-0.5 rounded ${chartTab === 'total' ? 'bg-[#0f1f3d] text-cyan-300' : 'text-gray-400'}`}
                >
                  TOTAL
                </button>
                <button 
                  onClick={() => setChartTab('shiba')}
                  className={`px-2 py-0.5 rounded ${chartTab === 'shiba' ? 'bg-[#0f1f3d] text-purple-300' : 'text-gray-400'}`}
                >
                  SHIBA
                </button>
                <button 
                  onClick={() => setChartTab('doge')}
                  className={`px-2 py-0.5 rounded ${chartTab === 'doge' ? 'bg-[#0f1f3d] text-emerald-300' : 'text-gray-400'}`}
                >
                  DOGE
                </button>
              </div>
            </div>

            {/* Realistic Undulating Wave Chart */}
            <div className="h-44 w-full relative flex flex-col justify-between pt-1">
              
              <div className="flex h-36 w-full">
                {/* Y-Axis Labels */}
                <div className="flex flex-col justify-between text-[8px] font-mono text-gray-500 pr-2 pb-2 text-right w-8">
                  <span>25M</span>
                  <span>20M</span>
                  <span>15M</span>
                  <span>10M</span>
                  <span>5M</span>
                  <span>0</span>
                </div>

                {/* SVG Curve Graphic Area */}
                <div className="flex-1 relative overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 500 100" preserveAspectRatio="none">
                    <defs>
                      {/* Gradiente Roxo Shiba */}
                      <linearGradient id="shibaGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#9333ea" stopOpacity="0.45" />
                        <stop offset="70%" stopColor="#9333ea" stopOpacity="0.08" />
                        <stop offset="100%" stopColor="#9333ea" stopOpacity="0.0" />
                      </linearGradient>

                      {/* Gradiente Verde/Ciano Doge */}
                      <linearGradient id="dogeGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                        <stop offset="70%" stopColor="#10b981" stopOpacity="0.08" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Linhas de Grelha Horizontais */}
                    <line x1="0" y1="1" x2="500" y2="1" stroke="#0e172a" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="0" y1="20" x2="500" y2="20" stroke="#0e172a" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="0" y1="40" x2="500" y2="40" stroke="#0e172a" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="0" y1="60" x2="500" y2="60" stroke="#0e172a" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="0" y1="80" x2="500" y2="80" stroke="#0e172a" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="0" y1="99" x2="500" y2="99" stroke="#0e172a" strokeWidth="1" />

                    {/* Preenchimento Ondulado Shiba */}
                    <path
                      d="M 0,82 C 30,85 50,75 80,78 C 110,82 130,68 160,70 C 190,72 210,80 240,76 C 270,72 290,62 320,60 C 350,58 380,66 410,62 C 440,58 470,52 500,52 L 500,100 L 0,100 Z"
                      fill="url(#shibaGlow)"
                    />

                    {/* Linha Ondulada Shiba (Roxa) */}
                    <path
                      d="M 0,82 C 30,85 50,75 80,78 C 110,82 130,68 160,70 C 190,72 210,80 240,76 C 270,72 290,62 320,60 C 350,58 380,66 410,62 C 440,58 470,52 500,52"
                      fill="none"
                      stroke="#c084fc"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Preenchimento Ondulado Doge */}
                    <path
                      d="M 0,88 C 25,84 45,90 70,82 C 95,74 125,79 150,71 C 180,63 205,73 235,66 C 265,58 295,49 325,48 C 355,47 385,55 415,44 C 445,35 475,40 500,38 L 500,100 L 0,100 Z"
                      fill="url(#dogeGlow)"
                    />

                    {/* Linha Ondulada Doge (Verde) */}
                    <path
                      d="M 0,88 C 25,84 45,90 70,82 C 95,74 125,79 150,71 C 180,63 205,73 235,66 C 265,58 295,49 325,48 C 355,47 385,55 415,44 C 445,35 475,40 500,38"
                      fill="none"
                      stroke="#34d399"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* Etiquetas de Volume na extremidade direita */}
                  <div className="absolute right-0 top-7 flex flex-col gap-1.5 items-end pointer-events-none font-mono">
                    <span className="bg-[#10b981] text-black font-black text-[9px] px-1.5 py-0.5 rounded shadow-lg shadow-emerald-500/20">
                      10.8M
                    </span>
                    <span className="bg-[#9333ea] text-white font-black text-[9px] px-1.5 py-0.5 rounded shadow-lg shadow-purple-500/20">
                      12.4M
                    </span>
                  </div>
                </div>
              </div>

              {/* Rótulos Temporais */}
              <div className="flex justify-between items-center text-[8px] font-mono text-gray-500 border-t border-gray-900 pt-1.5 pl-8">
                <span>14:05</span>
                <span>14:10</span>
                <span>14:15</span>
                <span>14:20</span>
                <span>14:25</span>
                <span>14:30</span>
              </div>
            </div>

            {/* Legenda Inferior */}
            <div className="flex items-center justify-between pt-2 text-[9px] font-mono">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 font-bold text-purple-400">
                  <span className="w-2.5 h-1 bg-purple-500 rounded"></span> Shiba (12.4M)
                </span>
                <span className="flex items-center gap-1 font-bold text-emerald-400">
                  <span className="w-2.5 h-1 bg-emerald-500 rounded"></span> Doge (10.8M)
                </span>
              </div>
              <div className="text-[8px] text-gray-500 uppercase tracking-widest font-bold flex items-center gap-1">
                🦅 DEXSCREENER
              </div>
            </div>
          </div>
