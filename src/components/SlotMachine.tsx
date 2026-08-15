import React, { useState } from 'react';
import { SymbolDef, WinResult, GameTheme, Payline } from '../types';
import { Flame, Sparkles, Award } from 'lucide-react';
import { PAYLINES } from '../data/games';

interface SlotMachineProps {
  game: GameTheme;
  grid: SymbolDef[][]; // 5 reels x 3 rows
  spinning: boolean;
  wins: WinResult[];
  jackpotAmount: number;
  activeLinesCount: number;
  turbo: boolean;
  freeSpinsLeft: number;
  currentWin: number;
}

export const SlotMachine: React.FC<SlotMachineProps> = ({
  game,
  grid,
  spinning,
  wins,
  jackpotAmount,
  activeLinesCount,
  turbo,
  freeSpinsLeft,
  currentWin,
}) => {
  const [hoveredLineId, setHoveredLineId] = useState<number | null>(null);

  // Collect winning reel positions for highlight glow
  const winningPositionsSet = new Set<string>();
  wins.forEach((w) => {
    w.positions.forEach((p) => {
      winningPositionsSet.add(`${p.reelIndex}-${p.rowIndex}`);
    });
  });

  // Left payline numbers: 1 to 10, Right payline numbers: 11 to 20
  const leftPaylineIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const rightPaylineIds = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

  const activeHoveredLine = hoveredLineId ? PAYLINES.find((p) => p.id === hoveredLineId) : null;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center gap-4 animate-fade-in select-none">
      {/* Top Professional Machine HUD Bar */}
      <div className="w-full bg-slate-950/95 border-2 border-amber-500/40 rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-2xl flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Game Title & Specs */}
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 p-0.5 shadow-xl shadow-amber-500/20">
            <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center text-3xl">
              {game.symbols[0]?.icon || '🎰'}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {game.name}
              </h2>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                {game.themeCategory}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              {game.subtitle} • <strong className="text-amber-400 font-bold">{activeLinesCount} Líneas Activas</strong>
            </p>
          </div>
        </div>

        {/* Technical Specs Mini-Pills */}
        <div className="flex items-center gap-2 flex-wrap justify-center font-mono text-[11px]">
          {/* RTP Badge */}
          <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl flex flex-col items-center">
            <span className="text-[9px] uppercase text-slate-400 font-bold">RTP Oficial</span>
            <span className="text-emerald-400 font-black">{game.rtp}%</span>
          </div>

          {/* Volatility */}
          <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl flex flex-col items-center">
            <span className="text-[9px] uppercase text-slate-400 font-bold">Volatilidad</span>
            <span className="text-amber-400 font-black">{game.volatility}</span>
          </div>

          {/* Max Multiplier */}
          <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl flex flex-col items-center">
            <span className="text-[9px] uppercase text-slate-400 font-bold">Ganancia Máx.</span>
            <span className="text-purple-300 font-black">x{game.maxMultiplier.toLocaleString()}</span>
          </div>
        </div>

        {/* Progressive Jackpot Counter */}
        <div className="bg-gradient-to-r from-amber-950/80 via-slate-950 to-amber-950/80 border-2 border-amber-500/60 rounded-2xl px-5 py-2.5 flex items-center gap-3 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
          <Flame className="w-7 h-7 text-amber-400 animate-bounce" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-black text-amber-300 tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-yellow-300" /> BOTE PROGRESIVO ACUMULADO
            </span>
            <span className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400 font-mono tracking-wider drop-shadow">
              ${jackpotAmount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Main Luxury Slot Machine Physical Cabinet */}
      <div className="relative w-full bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-[3px] border-amber-500/60 rounded-[32px] p-3 sm:p-5 shadow-[0_0_90px_rgba(245,158,11,0.2)] overflow-hidden">
        {/* Metallic Bezel Ambient Rim */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-amber-500/10 pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_#f59e0b]" />

        <div className="flex items-center gap-2 relative z-10">
          {/* Left Payline Markers Column (Lines 1 to 10) */}
          <div className="hidden md:flex flex-col justify-between gap-1 py-1 z-20">
            {leftPaylineIds.map((lineId) => {
              const payline = PAYLINES.find((p) => p.id === lineId);
              const isActive = lineId <= activeLinesCount;
              const isWinning = wins.some((w) => w.paylineId === lineId);
              const isHovered = hoveredLineId === lineId;

              return (
                <button
                  key={`left-line-${lineId}`}
                  onMouseEnter={() => setHoveredLineId(lineId)}
                  onMouseLeave={() => setHoveredLineId(null)}
                  className={`w-6 h-6 rounded-lg text-[10px] font-black transition-all flex items-center justify-center font-mono border ${
                    isWinning
                      ? 'bg-amber-400 text-slate-950 border-white shadow-[0_0_12px_#f59e0b] scale-110 animate-bounce'
                      : isHovered
                      ? 'bg-white text-slate-950 border-amber-400 scale-105'
                      : isActive
                      ? 'bg-slate-900 text-amber-300 border-amber-500/40 hover:bg-slate-800'
                      : 'bg-slate-950/60 text-slate-600 border-slate-800'
                  }`}
                  style={{ borderColor: isActive ? payline?.color : undefined }}
                  title={`Línea #${lineId}: ${payline?.name}`}
                >
                  {lineId}
                </button>
              );
            })}
          </div>

          {/* 5 Reel Columns Grid Inside Metallic Housing */}
          <div className="flex-1 relative bg-slate-950/90 border-2 border-slate-800 rounded-2xl p-2 sm:p-3 overflow-hidden shadow-inner">
            <div className="grid grid-cols-5 gap-1.5 sm:gap-3 relative z-10">
              {grid.map((reelSymbols, reelIdx) => (
                <div
                  key={`reel-${reelIdx}`}
                  className="bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-900/90 border border-slate-800/90 rounded-2xl p-1 sm:p-2 flex flex-col gap-2 relative overflow-hidden shadow-inner"
                >
                  {/* Brushed Column Divider Glow */}
                  <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-amber-500/20 to-transparent" />

                  {reelSymbols.map((sym, rowIdx) => {
                    const isWinning = winningPositionsSet.has(`${reelIdx}-${rowIdx}`);
                    const isHoveredPaylinePos =
                      activeHoveredLine && activeHoveredLine.positions[reelIdx] === rowIdx;

                    return (
                      <div
                        key={`sym-${reelIdx}-${rowIdx}`}
                        className={`relative aspect-square rounded-xl flex flex-col items-center justify-center p-1 sm:p-2 transition-all duration-300 border ${
                          isWinning
                            ? 'bg-gradient-to-tr from-amber-500/30 via-yellow-400/20 to-amber-500/30 border-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.8)] scale-[1.04] z-20 animate-pulse'
                            : isHoveredPaylinePos
                            ? 'bg-white/10 border-amber-400 shadow-md z-10'
                            : 'bg-slate-950/80 border-slate-800/80 text-white'
                        } ${spinning ? 'blur-[0.5px] opacity-75 animate-spin-slow' : ''}`}
                      >
                        {/* Symbol Graphic */}
                        <span className="text-3xl sm:text-5xl md:text-6xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] select-none transition-transform group-hover:scale-110">
                          {sym.icon}
                        </span>

                        {/* Symbol Name Badge */}
                        <span className="text-[9px] sm:text-[11px] font-bold text-slate-300 truncate max-w-full mt-1">
                          {sym.name}
                        </span>

                        {/* Multiplier / Role Badges */}
                        {sym.isWild && (
                          <span className="absolute top-1 right-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase shadow">
                            WILD
                          </span>
                        )}
                        {sym.isScatter && (
                          <span className="absolute top-1 right-1 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase shadow">
                            SCATTER
                          </span>
                        )}
                        {sym.isBonus && (
                          <span className="absolute top-1 right-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase shadow">
                            BONO
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* SVG Payline Visualizer Lines */}
            {((wins.length > 0 && !spinning) || hoveredLineId !== null) && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-30">
                {/* Show Winning Lines */}
                {!spinning &&
                  wins.map((w) => {
                    const payline = PAYLINES.find((p) => p.id === w.paylineId);
                    if (!payline) return null;

                    return (
                      <polyline
                        key={`line-${w.paylineId}`}
                        points={w.positions
                          .map((p) => {
                            const x = (p.reelIndex + 0.5) * (100 / 5);
                            const y = (p.rowIndex + 0.5) * (100 / 3);
                            return `${x}%,${y}%`;
                          })
                          .join(' ')}
                        fill="none"
                        stroke={payline.color}
                        strokeWidth="5"
                        strokeDasharray="8 4"
                        className="animate-pulse drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                      />
                    );
                  })}

                {/* Show Hovered Line Preview */}
                {activeHoveredLine && (
                  <polyline
                    points={activeHoveredLine.positions
                      .map((rowIdx, reelIdx) => {
                        const x = (reelIdx + 0.5) * (100 / 5);
                        const y = (rowIdx + 0.5) * (100 / 3);
                        return `${x}%,${y}%`;
                      })
                      .join(' ')}
                    fill="none"
                    stroke={activeHoveredLine.color}
                    strokeWidth="4"
                    strokeDasharray="4 4"
                  />
                )}
              </svg>
            )}
          </div>

          {/* Right Payline Markers Column (Lines 11 to 20) */}
          <div className="hidden md:flex flex-col justify-between gap-1 py-1 z-20">
            {rightPaylineIds.map((lineId) => {
              const payline = PAYLINES.find((p) => p.id === lineId);
              const isActive = lineId <= activeLinesCount;
              const isWinning = wins.some((w) => w.paylineId === lineId);
              const isHovered = hoveredLineId === lineId;

              return (
                <button
                  key={`right-line-${lineId}`}
                  onMouseEnter={() => setHoveredLineId(lineId)}
                  onMouseLeave={() => setHoveredLineId(null)}
                  className={`w-6 h-6 rounded-lg text-[10px] font-black transition-all flex items-center justify-center font-mono border ${
                    isWinning
                      ? 'bg-amber-400 text-slate-950 border-white shadow-[0_0_12px_#f59e0b] scale-110 animate-bounce'
                      : isHovered
                      ? 'bg-white text-slate-950 border-amber-400 scale-105'
                      : isActive
                      ? 'bg-slate-900 text-amber-300 border-amber-500/40 hover:bg-slate-800'
                      : 'bg-slate-950/60 text-slate-600 border-slate-800'
                  }`}
                  style={{ borderColor: isActive ? payline?.color : undefined }}
                  title={`Línea #${lineId}: ${payline?.name}`}
                >
                  {lineId}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Win Celebration Banner & Detailed Payline Hit Breakdown */}
      {currentWin > 0 && !spinning && (
        <div className="w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black rounded-2xl p-4 shadow-2xl shadow-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 animate-bounce">
          <div className="flex items-center gap-3">
            <Sparkles className="w-7 h-7 animate-spin" />
            <div>
              <span className="text-xs uppercase tracking-widest text-slate-900 font-bold block">
                ¡Combinación Ganadora Detectada!
              </span>
              <span className="text-xl sm:text-2xl font-black font-mono">
                PAGO TOTAL: ${currentWin.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-bold bg-slate-950/20 px-3 py-1.5 rounded-xl border border-slate-950/30">
            <span>{wins.length} {wins.length === 1 ? 'Línea Premiada' : 'Líneas Premiadas'}</span>
          </div>
        </div>
      )}

      {/* Payline Hits Summary Table (Professional Audit Trail) */}
      {wins.length > 0 && !spinning && (
        <div className="w-full bg-slate-950/90 border border-amber-500/30 rounded-2xl p-3.5 text-xs">
          <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800 font-mono text-[11px]">
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> Desglose Oficial de Pagos
            </span>
            <span>RNG Verificado</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {wins.map((w, idx) => {
              const payline = PAYLINES.find((p) => p.id === w.paylineId);
              return (
                <div
                  key={`win-detail-${idx}`}
                  className="bg-slate-900/90 border border-slate-800 rounded-xl p-2 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: payline?.color || '#f59e0b' }}
                    />
                    <span className="text-slate-300 font-mono">
                      Línea #{w.paylineId} ({w.count}x {w.symbol.name})
                    </span>
                  </div>
                  <span className="font-mono font-black text-amber-300">
                    +${w.payout.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
