import React, { useEffect, useState } from "react";
import {
  Activity,
  BarChart3,
  ChevronDown,
  CircleHelp,
  Clock3,
  Copy,
  Crown,
  Gift,
  Home,
  Menu,
  Settings,
  Trophy,
  User,
  Users,
  Wallet,
  Zap,
} from "lucide-react";

const participants = [
  { name: "CryptoWolf", amount: "12.8 SOL", rank: 1 },
  { name: "BullMaster", amount: "9.42 SOL", rank: 2 },
  { name: "MoonHunter", amount: "7.85 SOL", rank: 3 },
  { name: "SolanaKing", amount: "6.21 SOL", rank: 4 },
  { name: "DiamondHands", amount: "5.74 SOL", rank: 5 },
  { name: "AlphaTrader", amount: "4.96 SOL", rank: 6 },
];

const navItems = [
  { label: "ROOMS", icon: Home },
  { label: "MY PROFILE", icon: User },
  { label: "LEADERBOARD", icon: Trophy },
  { label: "REWARDS", icon: Gift },
  { label: "SETTINGS", icon: Settings },
];

function GlowButton({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`relative overflow-hidden rounded-lg border border-cyan-400/40 bg-cyan-400/10 px-5 py-3 text-xs font-bold tracking-[0.16em] text-cyan-300 transition hover:border-cyan-300 hover:bg-cyan-400/20 ${className}`}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
}

function StatCard({ title, value, subtitle, positive }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.025] p-4">
      <div className="mb-2 text-[9px] font-semibold tracking-[0.18em] text-slate-500">
        {title}
      </div>

      <div className="flex items-end justify-between gap-3">
        <div className="text-lg font-bold text-white">{value}</div>

        <div
          className={`text-[10px] font-semibold ${
            positive ? "text-emerald-400" : "text-slate-500"
          }`}
        >
          {subtitle}
        </div>
      </div>
    </div>
  );
}

export default function VDTTerminal() {
  const [timeLeft, setTimeLeft] = useState(28 * 60 + 17);
  const [activeNav, setActiveNav] = useState("ROOMS");
  const [chartMode, setChartMode] = useState("TOTAL");
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  const copyRoom = async () => {
    try {
      await navigator.clipboard.writeText("#4827");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#05050a] text-white">
      {/* BACKGROUND GRID */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="pointer-events-none fixed left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-purple-600/10 blur-[130px]" />

      {/* HEADER */}
      <header className="relative z-20 flex h-[68px] items-center justify-between border-b border-white/10 bg-[#07070d]/95 px-5 backdrop-blur-xl">
        <div className="flex items-center gap-7">
          <button
            className="md:hidden text-slate-400"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-purple-400/40 bg-purple-500/10">
              <Zap size={18} className="text-purple-300" />
            </div>

            <div>
              <div className="text-sm font-black tracking-[0.18em] text-white">
                BULL
              </div>
              <div className="text-[9px] font-semibold tracking-[0.28em] text-purple-400">
                PROTOCOL
              </div>
            </div>
          </div>

          <div className="hidden h-7 w-px bg-white/10 md:block" />

          <div className="hidden items-center gap-2 md:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,.9)]" />
            <span className="text-[10px] font-semibold tracking-[0.15em] text-emerald-400">
              SOLANA
            </span>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <span className="text-[10px] text-slate-600">/</span>
            <span className="text-[10px] font-semibold tracking-[0.15em] text-slate-500">
              RAYDIUM
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-md border border-emerald-400/20 bg-emerald-400/5 px-3 py-2 sm:flex">
            <Activity size={12} className="text-emerald-400" />
            <span className="text-[9px] font-bold tracking-[0.16em] text-emerald-400">
              ONLINE
            </span>
          </div>

          <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 hover:bg-white/[0.06]">
            <Wallet size={14} className="text-cyan-300" />
            <span className="hidden text-[10px] font-bold tracking-[0.1em] text-slate-300 sm:block">
              7xK...9Qm
            </span>
            <ChevronDown size={12} className="text-slate-500" />
          </button>
        </div>
      </header>

      <div className="relative z-10 flex">
        {/* SIDEBAR */}
        <aside
          className={`${
            menuOpen ? "flex" : "hidden"
          } fixed inset-y-[68px] left-0 z-30 w-[220px] flex-col border-r border-white/10 bg-[#07070d] md:static md:flex md:h-[calc(100vh-68px)] md:w-[220px]`}
        >
          <div className="flex-1 p-4">
            <div className="mb-4 px-3 text-[9px] font-bold tracking-[0.25em] text-slate-600">
              NAVIGATION
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = activeNav === item.label;

                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      setActiveNav(item.label);
                      setMenuOpen(false);
                    }}
                    className={`group flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition ${
                      active
                        ? "border border-purple-400/20 bg-purple-500/10 text-purple-300"
                        : "border border-transparent text-slate-500 hover:bg-white/[0.03] hover:text-slate-300"
                    }`}
                  >
                    <Icon size={15} />

                    <span className="text-[10px] font-bold tracking-[0.12em]">
                      {item.label}
                    </span>

                    {active && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,.9)]" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="border-t border-white/10 p-4">
            <div className="rounded-lg border border-purple-400/10 bg-purple-500/[0.04] p-4">
              <div className="mb-2 flex items-center gap-2">
                <CircleHelp size={13} className="text-purple-400" />
                <span className="text-[9px] font-bold tracking-[0.15em] text-slate-400">
                  NEED HELP?
                </span>
              </div>

              <p className="text-[9px] leading-4 text-slate-600">
                Check the protocol documentation or contact support.
              </p>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-[1500px] p-4 md:p-6">
            {/* TOP TITLE */}
            <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  <span className="text-[9px] font-bold tracking-[0.25em] text-cyan-400">
                    LIVE ARENA
                  </span>
                </div>

                <h1 className="text-2xl font-black tracking-tight md:text-3xl">
                  SHIBA <span className="text-slate-600">VS</span> DOGE
                </h1>

                <p className="mt-1 text-[10px] font-semibold tracking-[0.14em] text-slate-500">
                  30 MINUTES <span className="mx-2 text-slate-700">•</span>{" "}
                  100 PARTICIPANTS
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-lg border border-white/10 bg-white/[0.025] px-4 py-3">
                  <div className="mb-1 text-[8px] font-bold tracking-[0.2em] text-slate-600">
                    TIME REMAINING
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock3 size={14} className="text-purple-400" />
                    <span className="font-mono text-lg font-black tracking-wider text-white">
                      {minutes}:{seconds}
                    </span>
                  </div>
                </div>

                <GlowButton>
                  <span className="flex items-center gap-2">
                    <Users size={13} />
                    ENTER ROOM
                  </span>
                </GlowButton>
              </div>
            </div>

            {/* ARENA */}
            <section className="relative overflow-hidden rounded-xl border border-white/10 bg-[#08080e]">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/70 to-transparent" />

              {/* TEAM CARDS */}
              <div className="grid border-b border-white/10 md:grid-cols-2">
                <div className="relative overflow-hidden border-b border-white/10 p-5 md:border-b-0 md:border-r">
                  <div className="absolute -right-16 -top-20 h-44 w-44 rounded-full bg-purple-500/10 blur-3xl" />

                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-orange-400/30 bg-orange-500/10 text-xl font-black text-orange-300">
                        SH
                      </div>

                      <div>
                        <div className="text-lg font-black">SHIBA</div>
                        <div className="mt-1 text-[9px] font-semibold tracking-[0.18em] text-slate-600">
                          TEAM ALLOCATION
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[9px] font-bold tracking-[0.16em] text-slate-600">
                        PARTICIPANTS
                      </div>
                      <div className="mt-1 text-xl font-black text-orange-300">
                        50
                      </div>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between text-[9px]">
                      <span className="font-bold tracking-[0.15em] text-slate-600">
                        DEX VOLUME
                      </span>
                      <span className="font-mono font-bold text-orange-300">
                        $12.4M
                      </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                      <div className="h-full w-[53%] rounded-full bg-orange-400 shadow-[0_0_12px_rgba(251,146,60,.45)]" />
                    </div>
                  </div>
                </div>

                <div className="relative overflow-hidden p-5">
                  <div className="absolute -left-16 -top-20 h-44 w-44 rounded-full bg-cyan-500/10 blur-3xl" />

                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-500/10 text-xl font-black text-cyan-300">
                        DO
                      </div>

                      <div>
                        <div className="text-lg font-black">DOGE</div>
                        <div className="mt-1 text-[9px] font-semibold tracking-[0.18em] text-slate-600">
                          TEAM ALLOCATION
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[9px] font-bold tracking-[0.16em] text-slate-600">
                        PARTICIPANTS
                      </div>
                      <div className="mt-1 text-xl font-black text-cyan-300">
                        50
                      </div>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between text-[9px]">
                      <span className="font-bold tracking-[0.15em] text-slate-600">
                        DEX VOLUME
                      </span>
                      <span className="font-mono font-bold text-cyan-300">
                        $10.8M
                      </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                      <div className="h-full w-[47%] rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,.45)]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* CHART */}
              <div className="border-b border-white/10 p-5 md:p-6">
                <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <div className="text-[9px] font-bold tracking-[0.2em] text-slate-600">
                      LIVE VOLUME FLOW
                    </div>
                    <div className="mt-1 text-sm font-bold text-slate-300">
                      Market Momentum
                    </div>
                  </div>

                  <div className="flex rounded-lg border border-white/10 bg-black/20 p-1">
                    {["TOTAL", "SHIBA", "DOGE"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setChartMode(tab)}
                        className={`rounded px-3 py-1.5 text-[8px] font-bold tracking-[0.14em] ${
                          chartMode === tab
                            ? "bg-white/10 text-white"
                            : "text-slate-600 hover:text-slate-300"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative h-[230px] overflow-hidden rounded-lg border border-white/5 bg-[#05050a]">
                  <div
                    className="absolute inset-0 opacity-60"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)",
                      backgroundSize: "50px 46px",
                    }}
                  />

                  <div className="absolute left-3 top-3 flex gap-5 text-[8px] font-bold tracking-[0.12em]">
                    <span className="flex items-center gap-2 text-orange-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                      SHIBA
                    </span>

                    <span className="flex items-center gap-2 text-cyan-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                      DOGE
                    </span>
                  </div>

                  <svg
                    viewBox="0 0 1000 260"
                    preserveAspectRatio="none"
                    className="absolute inset-0 h-full w-full"
                  >
                    <defs>
                      <linearGradient id="purpleFill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#a855f7" stopOpacity=".2" />
                        <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    <path
                      d="M0 210 C80 205, 90 175, 150 185 S220 150, 280 165 S340 115, 400 135 S470 100, 520 115 S600 75, 650 95 S720 55, 780 75 S850 45, 900 58 S960 25, 1000 35 L1000 260 L0 260 Z"
                      fill="url(#purpleFill)"
                    />

                    <path
                      d="M0 210 C80 205, 90 175, 150 185 S220 150, 280 165 S340 115, 400 135 S470 100, 520 115 S600 75, 650 95 S720 55, 780 75 S850 45, 900 58 S960 25, 1000 35"
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="3"
                    />

                    <path
                      d="M0 195 C70 190, 110 175, 155 190 S230 165, 290 180 S350 135, 420 155 S500 125, 555 140 S630 105, 690 125 S760 95, 815 115 S900 80, 950 98 S980 75, 1000 85"
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="2.5"
                    />

                    <path
                      d="M0 225 C75 220, 125 205, 180 210 S270 195, 330 200 S420 170, 490 185 S560 165, 630 175 S720 145, 800 160 S880 130, 950 145 S980 125, 1000 130"
                      fill="none"
                      stroke="#fb923c"
                      strokeWidth="1.5"
                      strokeDasharray="5 6"
                      opacity=".7"
                    />
                  </svg>

                  <div className="absolute bottom-2 left-3 right-3 flex justify-between text-[7px] font-mono text-slate-700">
                    <span>00:00</span>
                    <span>07:30</span>
                    <span>15:00</span>
                    <span>22:30</span>
                    <span>30:00</span>
                  </div>
                </div>
              </div>

              {/* INFO GRID */}
              <div className="grid border-b border-white/10 md:grid-cols-2">
                <div className="border-b border-white/10 p-5 md:border-b-0 md:border-r">
                  <div className="mb-4 flex items-center gap-2">
                    <Zap size={14} className="text-purple-400" />
                    <h2 className="text-[10px] font-black tracking-[0.18em]">
                      HOW IT WORKS
                    </h2>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      ["01", "CHOOSE", "Pick your team"],
                      ["02", "ALLOCATE", "Deposit SOL"],
                      ["03", "EARN", "Win the yield"],
                    ].map(([number, title, text]) => (
                      <div
                        key={number}
                        className="rounded-lg border border-white/5 bg-white/[0.02] p-3"
                      >
                        <div className="mb-3 font-mono text-[9px] text-purple-400">
                          {number}
                        </div>
                        <div className="text-[9px] font-black tracking-[0.12em] text-slate-300">
                          {title}
                        </div>
                        <div className="mt-1 text-[8px] text-slate-600">
                          {text}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <BarChart3 size={14} className="text-cyan-400" />
                    <h2 className="text-[10px] font-black tracking-[0.18em]">
                      ROOM STATISTICS
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <StatCard
                      title="TOTAL POOL"
                      value="22.8 SOL"
                      subtitle="+18.4%"
                      positive
                    />
                    <StatCard
                      title="AVG. ENTRY"
                      value="0.228 SOL"
                      subtitle="100 USERS"
                    />
                    <StatCard
                      title="PROTOCOL FEE"
                      value="5.0%"
                      subtitle="FIXED"
                    />
                    <StatCard
                      title="CURRENT YIELD"
                      value="12.6%"
                      subtitle="APY"
                      positive
                    />
                  </div>
                </div>
              </div>

              {/* FOOTER ACTIONS */}
              <div className="grid bg-black/20 sm:grid-cols-3">
                {[
                  ["ENTER ON MOMENTUM", "Follow the winning side"],
                  ["STRATEGIC ALLOCATION", "Split your position"],
                  ["COLLECT YIELD", "Claim after settlement"],
                ].map(([title, text], index) => (
                  <button
                    key={title}
                    className={`group p-5 text-left transition hover:bg-white/[0.025] ${
                      index !== 2 ? "border-b sm:border-b-0 sm:border-r" : ""
                    } border-white/10`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[9px] font-black tracking-[0.13em] text-slate-400 group-hover:text-white">
                        {title}
                      </span>
                      <span className="text-purple-400 transition group-hover:translate-x-1">
                        →
                      </span>
                    </div>

                    <div className="text-[8px] text-slate-600">{text}</div>
                  </button>
                ))}
              </div>
            </section>
          </div>
        </main>

        {/* RIGHT PANEL */}
        <aside className="hidden w-[290px] shrink-0 border-l border-white/10 bg-[#07070d] xl:block">
          <div className="sticky top-0 h-screen overflow-y-auto p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="text-[9px] font-bold tracking-[0.22em] text-slate-600">
                  CURRENT ROOM
                </div>
                <div className="mt-1 text-lg font-black">#4827</div>
              </div>

              <button
                onClick={copyRoom}
                className="rounded-lg border border-white/10 p-2 text-slate-500 hover:text-white"
                title="Copy room ID"
              >
                <Copy size={14} />
              </button>
            </div>

            {copied && (
              <div className="mb-3 rounded-md border border-emerald-400/20 bg-emerald-400/5 px-3 py-2 text-[8px] font-bold tracking-[0.12em] text-emerald-400">
                ROOM ID COPIED
              </div>
            )}

            <GlowButton className="mb-6 w-full">
              <span className="flex items-center justify-center gap-2">
                <Wallet size={13} />
                ENTER ROOM
              </span>
            </GlowButton>

            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={13} className="text-purple-400" />
                <span className="text-[9px] font-black tracking-[0.17em]">
                  PARTICIPANTS
                </span>
              </div>

              <span className="rounded bg-purple-500/10 px-2 py-1 text-[8px] font-bold text-purple-300">
                100
              </span>
            </div>

            <div className="space-y-1">
              {participants.map((person) => (
                <div
                  key={person.name}
                  className="flex items-center gap-3 rounded-lg border border-transparent px-3 py-3 hover:border-white/5 hover:bg-white/[0.025]"
                >
                  <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5">
                    <span className="text-[8px] font-black text-slate-400">
                      {person.name.slice(0, 2).toUpperCase()}
                    </span>

                    {person.rank <= 3 && (
                      <span className="absolute -right-1 -top-1">
                        <Crown
                          size={10}
                          className={
                            person.rank === 1
                              ? "text-yellow-300"
                              : "text-slate-500"
                          }
                        />
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[9px] font-bold text-slate-300">
                      {person.name}
                    </div>
                    <div className="mt-0.5 text-[7px] tracking-[0.1em] text-slate-600">
                      RANK #{person.rank}
                    </div>
                  </div>

                  <div className="font-mono text-[8px] font-bold text-slate-400">
                    {person.amount}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-lg border border-purple-400/10 bg-purple-500/[0.035] p-4">
              <div className="mb-2 text-[8px] font-bold tracking-[0.16em] text-purple-400">
                PROTOCOL STATUS
              </div>

              <div className="mb-3 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-[9px] font-bold text-emerald-400">
                  ALL SYSTEMS OPERATIONAL
                </span>
              </div>

              <div className="space-y-2 text-[8px]">
                <div className="flex justify-between">
                  <span className="text-slate-600">Network</span>
                  <span className="text-slate-400">Solana</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-600">Settlement</span>
                  <span className="text-slate-400">Automatic</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-600">Fee</span>
                  <span className="text-slate-400">5.00%</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
