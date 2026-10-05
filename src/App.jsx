import React, { useEffect, useState } from "react";
import {
  Swords,
  UserRound,
  Trophy,
  Award,
  Settings,
  WalletCards,
  Link2,
  Clock3,
  UsersRound,
  Zap,
  Target,
  CircleDollarSign,
  ChevronRight,
  Check,
  Activity,
  Copy,
  Menu,
  X,
} from "lucide-react";
import logo from "../../logo.png";

const navItems = [
  { label: "SALAS", sub: "Participe de batalhas", icon: Swords },
  { label: "MEU PERFIL", sub: "Carteira e histórico", icon: UserRound },
  { label: "RANKING", sub: "Top traders", icon: Trophy },
  { label: "RECOMPENSAS", sub: "XP e conquistas", icon: Award },
  { label: "CONFIGURAÇÕES", sub: "Preferências", icon: Settings },
];

const participants = [
  ["ShibaTeam_97...", "Entrou no time Shiba", "2 min", "🦊"],
  ["DogeWolf_72...", "Entrou no time Doge", "2 min", "🐕"],
  ["CryptoLuna", "Entrou no time Shiba", "3 min", "👩🏻"],
  ["TraderAlpha", "Entrou no time Doge", "4 min", "🧑🏽"],
  ["SolMaster", "Entrou no time Shiba", "5 min", "👨🏻"],
];

function NeonButton({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`group relative flex items-center justify-center gap-2 overflow-hidden rounded-md border border-cyan-400/60 bg-gradient-to-r from-fuchsia-600/90 to-cyan-500/80 px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.12em] text-white shadow-[0_0_24px_rgba(34,211,238,.12)] transition hover:brightness-125 ${className}`}
    >
      {children}
      <span className="absolute inset-0 -translate-x-full bg-white/15 transition-transform duration-500 group-hover:translate-x-full" />
    </button>
  );
}

function Panel({ children, className = "" }) {
  return (
    <section
      className={`relative overflow-hidden rounded-lg border border-cyan-400/35 bg-[#020817]/90 shadow-[inset_0_0_30px_rgba(20,80,150,.07),0_0_18px_rgba(0,0,0,.3)] ${className}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent" />
      {children}
    </section>
  );
}

function TeamOrb({ type }) {
  const shiba = type === "shiba";
  return (
    <div
      className={`relative flex h-[78px] w-[78px] items-center justify-center rounded-full border-[3px] ${
        shiba
          ? "border-fuchsia-400 bg-fuchsia-500/10 shadow-[0_0_25px_rgba(217,70,239,.75),inset_0_0_18px_rgba(168,85,247,.5)]"
          : "border-cyan-300 bg-cyan-400/10 shadow-[0_0_25px_rgba(34,211,238,.75),inset_0_0_18px_rgba(20,184,166,.5)]"
      }`}
    >
      <div
        className={`absolute inset-[7px] rounded-full border ${
          shiba ? "border-purple-300/70" : "border-emerald-300/70"
        }`}
      />
      <span className="relative text-[38px] drop-shadow-[0_0_10px_rgba(255,255,255,.5)]">
        {shiba ? "🦊" : "🐕"}
      </span>
    </div>
  );
}

function Chart() {
  return (
    <svg
      viewBox="0 0 760 220"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full"
    >
      <defs>
        <linearGradient id="shibaArea" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#d946ef" stopOpacity=".20" />
          <stop offset="1" stopColor="#d946ef" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="dogeArea" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#14e6c7" stopOpacity=".18" />
          <stop offset="1" stopColor="#14e6c7" stopOpacity="0" />
        </linearGradient>
      </defs>

      <path
        d="M0 175 C30 165 55 150 78 160 C105 171 124 145 150 154 C178 164 200 140 224 143 C252 146 268 121 292 135 C322 151 345 127 372 137 C402 148 424 126 449 136 C478 148 500 113 528 120 C555 127 578 95 602 112 C630 132 650 100 674 108 C700 116 720 78 760 85 L760 220 L0 220Z"
        fill="url(#shibaArea)"
      />
      <path
        d="M0 190 C30 181 50 178 80 185 C108 192 132 178 156 185 C184 194 207 179 232 184 C260 190 286 169 312 178 C341 187 360 158 390 169 C418 180 441 155 466 163 C494 172 518 137 542 145 C570 154 596 130 620 138 C646 147 671 113 700 122 C725 130 742 108 760 116 L760 220 L0 220Z"
        fill="url(#dogeArea)"
      />

      <polyline
        points="0,175 30,165 55,150 78,160 105,171 124,145 150,154 178,164 200,140 224,143 252,146 268,121 292,135 322,151 345,127 372,137 402,148 424,126 449,136 478,148 500,113 528,120 555,127 578,95 602,112 630,132 650,100 674,108 700,116 720,78 760,85"
        fill="none"
        stroke="#d946ef"
        strokeWidth="2.5"
      />
      <polyline
        points="0,190 30,181 50,178 80,185 108,192 132,178 156,185 184,194 207,179 232,184 260,190 286,169 312,178 341,187 360,158 390,169 418,180 441,155 466,163 494,172 518,137 542,145 570,154 596,130 620,138 646,147 671,113 700,122 725,130 742,108 760,116"
        fill="none"
        stroke="#12e6c7"
        strokeWidth="2.5"
      />
    </svg>
  );
}

export default function VDTTerminal() {
  const [secondsLeft, setSecondsLeft] = useState(28 * 60 + 17);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [tab, setTab] = useState("TOTAL");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft((v) => (v > 0 ? v - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  const copyRoom = async () => {
    try {
      await navigator.clipboard.writeText("#4827");
    } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="min-h-screen bg-[#01040d] text-white">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_48%_25%,rgba(74,25,155,.13),transparent_34%),radial-gradient(circle_at_78%_60%,rgba(0,193,255,.06),transparent_30%)]" />

      <header className="relative z-30 h-[64px] border-b border-cyan-400/20 bg-[#02050c]/95 px-4 backdrop-blur-md lg:px-7">
        <div className="mx-auto flex h-full max-w-[1500px] items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-cyan-300"
              onClick={() => setMobileMenu((v) => !v)}
            >
              {mobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>

            <img src={logo} alt="Bull Protocol" className="h-[44px] w-auto object-contain" />

            <div className="hidden border-l border-white/15 pl-4 sm:block">
              <div className="text-[10px] font-black tracking-[0.25em] text-cyan-300">
                MOMENTUM TRADING TERMINAL
              </div>
              <div className="mt-1 text-[7px] font-bold tracking-[0.22em] text-slate-400">
                TRADES • SALAS • LUCRO REAL
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-[8px] font-bold">
            <div className="hidden items-center gap-1.5 sm:flex text-slate-300">
              <span className="text-cyan-400">◆</span> SOLANA
            </div>
            <div className="hidden items-center gap-1.5 sm:flex text-slate-300">
              <span className="rounded border border-purple-400/50 px-1 text-purple-300">R</span> RAYDIUM
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/35 px-3 py-2 text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              Online
            </div>
            <button className="hidden items-center gap-2 rounded-lg border border-cyan-400/30 bg-white/[.02] px-3 py-2 sm:flex">
              <UserRound size={12} />
              4F3...9K7a
              <span>⌄</span>
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto flex max-w-[1500px] gap-3 p-3 lg:p-4">
        <aside
          className={`${
            mobileMenu ? "flex" : "hidden"
          } fixed left-3 top-[73px] z-40 w-[235px] flex-col rounded-lg border border-cyan-400/25 bg-[#020716]/98 p-3 shadow-2xl lg:static lg:flex lg:w-[225px] lg:shrink-0 lg:bg-transparent lg:shadow-none`}
        >
          <div className="space-y-1">
            {navItems.map(({ label, sub, icon: Icon }, index) => (
              <button
                key={label}
                className={`flex w-full items-center gap-3 rounded-md border px-3 py-3 text-left ${
                  index === 0
                    ? "border-cyan-300/50 bg-gradient-to-r from-fuchsia-600/25 to-cyan-500/15 shadow-[0_0_18px_rgba(168,85,247,.12)]"
                    : "border-transparent hover:border-white/10 hover:bg-white/[.03]"
                }`}
              >
                <Icon
                  size={18}
                  className={index === 0 ? "text-fuchsia-300" : "text-cyan-200"}
                />
                <span className="min-w-0">
                  <span className="block text-[10px] font-black tracking-[.08em] text-white">
                    {label}
                  </span>
                  <span className="mt-0.5 block text-[8px] text-slate-500">{sub}</span>
                </span>
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-lg border border-cyan-400/30 bg-[#030a19]/90 p-4 text-center">
            <div className="mb-2 text-3xl">🐂</div>
            <div className="text-[12px] font-black uppercase tracking-[.06em] text-fuchsia-400">
              MAIS MOMENTUM
              <br />
              MENOS EMOÇÃO
            </div>
            <p className="mt-3 text-[9px] leading-4 text-slate-300">
              Aqui o jogo é simples: quem perde volume no mercado em 30 minutos, paga o outro lado.
            </p>
            <button className="mt-3 w-full rounded-md border border-cyan-400/50 py-2 text-[8px] font-black uppercase tracking-[.1em] text-cyan-300">
              COMO FUNCIONA?
            </button>
          </div>

          <div className="mt-auto hidden pt-10 lg:block">
            <div className="text-[7px] font-bold uppercase tracking-[.15em] text-slate-600">Powered by</div>
            <div className="mt-2 flex gap-4 text-[8px] font-bold text-slate-400">
              <span>◆ SOLANA</span>
              <span>Ⓡ RAYDIUM</span>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="grid gap-3">
            <Panel className="min-h-[168px]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_45%,rgba(168,85,247,.18),transparent_35%),radial-gradient(circle_at_80%_45%,rgba(20,230,199,.15),transparent_35%)]" />
              <div className="relative grid h-full grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 py-3 md:px-5">
                <div className="text-left">
                  <div className="flex items-center gap-3">
                    <TeamOrb type="shiba" />
                    <div>
                      <div className="text-[13px] font-black uppercase tracking-[.08em] text-fuchsia-400">
                        LADO SHIBA
                      </div>
                      <div className="mt-1 text-[10px] font-bold">50 PARTICIPANTES</div>
                      <div className="mt-1 text-[8px] text-slate-400">
                        VOLUME DEX: <b className="text-fuchsia-300">12.4M USDT</b>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="mx-auto mb-2 inline-flex items-center gap-1 rounded-full border border-cyan-300/50 px-3 py-1 text-[7px] font-black uppercase tracking-[.15em] text-cyan-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    SALA ATIVA
                  </div>
                  <h1 className="text-[22px] font-black tracking-[.08em] text-cyan-100">
                    SHIBA <span className="text-white/70">VS</span> DOGE
                  </h1>
                  <div className="text-[10px] font-black tracking-[.08em] text-cyan-300">
                    30 MINUTOS • 100 PARTICIPANTES
                  </div>
                  <div className="mx-auto mt-3 w-[185px] border border-cyan-400/60 bg-[#031426]/80 px-5 py-2 shadow-[0_0_20px_rgba(34,211,238,.08)]">
                    <div className="text-[7px] font-bold tracking-[.15em] text-slate-500">TEMPO RESTANTE</div>
                    <div className="font-mono text-[25px] font-black tracking-widest text-cyan-300">
                      {mm}:{ss}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center justify-end gap-3">
                    <div>
                      <div className="text-[13px] font-black uppercase tracking-[.08em] text-cyan-300">
                        LADO DOGE
                      </div>
                      <div className="mt-1 text-[10px] font-bold">50 PARTICIPANTES</div>
                      <div className="mt-1 text-[8px] text-slate-400">
                        VOLUME DEX: <b className="text-cyan-300">10.8M USDT</b>
                      </div>
                    </div>
                    <TeamOrb type="doge" />
                  </div>
                </div>
              </div>
            </Panel>

            <Panel className="p-3">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <div className="text-[9px] font-black uppercase tracking-[.12em] text-slate-300">
                  <Activity size={12} className="mr-2 inline text-cyan-300" />
                  VOLUME NO DEX <span className="text-slate-500">(ÚLTIMOS 30 MIN)</span>
                </div>
                <div className="flex rounded-md border border-cyan-400/20 p-0.5">
                  {["TOTAL", "SHIBA", "DOGE"].map((v) => (
                    <button
                      key={v}
                      onClick={() => setTab(v)}
                      className={`rounded px-3 py-1 text-[7px] font-black ${
                        tab === v ? "bg-cyan-400/15 text-cyan-300" : "text-slate-500"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative h-[220px] overflow-hidden rounded border border-cyan-400/10 bg-[#020817]">
                <div
                  className="absolute inset-0 opacity-60"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(50,150,220,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(50,150,220,.10) 1px,transparent 1px)",
                    backgroundSize: "12.5% 20%",
                  }}
                />
                <Chart />
                <div className="absolute bottom-2 left-4 right-4 flex justify-between text-[7px] text-slate-500">
                  <span>14:05</span><span>14:10</span><span>14:15</span><span>14:20</span><span>14:25</span><span>14:30</span>
                </div>
                <div className="absolute right-1 top-[39%] rounded bg-cyan-400 px-1.5 py-1 text-[8px] font-black text-[#00121a]">10.8M</div>
                <div className="absolute right-1 top-[55%] rounded bg-fuchsia-500 px-1.5 py-1 text-[8px] font-black text-white">12.4M</div>
                <div className="absolute bottom-1 left-4 flex gap-4 text-[7px]">
                  <span className="text-fuchsia-300">■ Shiba (12.4M)</span>
                  <span className="text-cyan-300">■ Doge (10.8M)</span>
                </div>
              </div>
            </Panel>

            <div className="grid gap-3 lg:grid-cols-[1fr_1.2fr]">
              <Panel className="p-4">
                <div className="mb-3 text-[9px] font-black uppercase tracking-[.12em]">COMO FUNCIONA?</div>
                <div className="space-y-2">
                  {[
                    ["1", "Escolha um lado", "Shiba ou Doge."],
                    ["2", "Entre na sala", "Junte-se aos participantes."],
                    ["3", "Acompanhe o volume", "O lado que tiver MENOS volume no mercado (Dexscreener) em 30 minutos, paga o outro lado."],
                  ].map(([n, title, text]) => (
                    <div key={n} className="flex gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-cyan-300 text-[9px] font-black text-cyan-300">{n}</div>
                      <div>
                        <div className="text-[8px] font-bold">{title}</div>
                        <div className="text-[7px] leading-3 text-slate-500">{text}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 rounded border border-yellow-400/30 bg-yellow-400/5 p-2 text-[7px] font-bold text-yellow-300">
                  ⚠ Não é sobre quem compra mais. É sobre quem movimenta menos.
                </div>
              </Panel>

              <Panel className="p-4">
                <div className="mb-3 text-[9px] font-black uppercase tracking-[.12em] text-cyan-300">ESTATÍSTICAS DA SALA</div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="border-r border-white/10 pr-3">
                    <div className="flex items-center gap-2">
                      <TeamOrb type="shiba" />
                      <div><b className="text-[11px] text-fuchsia-400">SHIBA</b><div className="text-[8px]">50 participantes</div></div>
                    </div>
                    <div className="mt-3 text-[8px] text-cyan-300">Volume Atual (30m)</div>
                    <div className="text-[15px] font-black text-fuchsia-300">12.4M USDT</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <TeamOrb type="doge" />
                      <div><b className="text-[11px] text-cyan-300">DOGE</b><div className="text-[8px]">50 participantes</div></div>
                    </div>
                    <div className="mt-3 text-[8px] text-cyan-300">Volume Atual (30m)</div>
                    <div className="text-[15px] font-black text-cyan-300">10.8M USDT</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-3 border-t border-white/10 pt-3 text-[7px] text-slate-400">
                  Diferença de Volume:
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400" />
                  </div>
                  <b className="text-cyan-300">1.6M USDT</b>
                </div>
              </Panel>
            </div>

            <Panel className="grid grid-cols-3 divide-x divide-white/10">
              {[
                [Zap, "ENTRE NO MOMENTO", "Seja rápido, as salas são limitadas."],
                [Target, "APOSTE COM ESTRATÉGIA", "O volume do mercado decide."],
                [Trophy, "CONQUISTE O LUCRO", "O lado que perder paga."],
              ].map(([Icon, title, text]) => (
                <div key={title} className="flex items-center gap-3 p-3">
                  <Icon size={23} className="text-fuchsia-400" />
                  <div className="min-w-0">
                    <div className="text-[7px] font-black text-cyan-300">{title}</div>
                    <div className="mt-1 text-[7px] text-slate-500">{text}</div>
                  </div>
                  <ChevronRight size={14} className="ml-auto text-slate-500" />
                </div>
              ))}
            </Panel>
          </div>
        </main>

        <aside className="hidden w-[280px] shrink-0 xl:block">
          <div className="grid gap-3">
            <Panel className="p-3">
              <div className="mb-3 flex items-center justify-between">
                <span className="rounded border border-cyan-300/40 px-2 py-1 text-[7px] font-black">SALA #4827</span>
                <span className="text-[7px] font-bold text-emerald-300">● EM ANDAMENTO</span>
              </div>
              <div className="text-[16px] font-black">SHIBA VS DOGE</div>
              <div className="text-[8px] text-slate-400">Aposta no menor volume de mercado</div>

              <div className="mt-3 grid grid-cols-2 gap-2 rounded border border-cyan-400/25 p-3">
                <div><Clock3 size={14} className="mb-1 text-cyan-300" /><div className="text-[7px] text-slate-500">Duração</div><b className="text-[8px]">30 minutos</b></div>
                <div><UsersRound size={14} className="mb-1 text-cyan-300" /><div className="text-[7px] text-slate-500">Participantes</div><b className="text-[8px] text-cyan-300">100 / 100</b></div>
                <div className="col-span-2 border-t border-white/10 pt-2"><Link2 size={14} className="mr-2 inline text-cyan-300" /><span className="text-[7px] text-slate-500">Blockchain</span><b className="float-right text-[8px]">Solana (Raydium)</b></div>
              </div>

              <NeonButton className="mt-3 w-full">ENTRAR NA SALA <ChevronRight size={13} /></NeonButton>
            </Panel>

            <Panel className="p-3">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-[10px] font-black uppercase tracking-[.1em]">PARTICIPANTES (100)</div>
                <UsersRound size={15} className="text-cyan-300" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-md border border-fuchsia-400/40 bg-fuchsia-500/5 p-2 text-center">
                  <TeamOrb type="shiba" />
                  <div className="mt-1 text-[8px] font-black text-fuchsia-300">SHIBA</div>
                  <div className="text-[16px] font-black">50</div>
                </div>
                <div className="rounded-md border border-cyan-400/40 bg-cyan-500/5 p-2 text-center">
                  <TeamOrb type="doge" />
                  <div className="mt-1 text-[8px] font-black text-cyan-300">DOGE</div>
                  <div className="text-[16px] font-black">50</div>
                </div>
              </div>

              <div className="mt-2 divide-y divide-white/10">
                {participants.map(([name, status, time, avatar]) => (
                  <div key={name} className="flex items-center gap-2 py-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border border-fuchsia-300/30 bg-slate-900 text-sm">{avatar}</div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[8px] font-bold">{name}</div>
                      <div className="truncate text-[6px] text-cyan-300">{status}</div>
                    </div>
                    <span className="text-[7px] text-slate-500">{time}</span>
                  </div>
                ))}
              </div>

              <button className="mt-2 flex items-center gap-1 text-[8px] font-bold text-cyan-300">Ver todos (100) <ChevronRight size={11} /></button>
            </Panel>
          </div>
        </aside>
      </div>
    </div>
  );
}
