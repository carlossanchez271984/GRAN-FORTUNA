import React from 'react';
import { Play, Zap, RefreshCw, Layers, Plus, Minus, Flame, Sparkles, SlidersHorizontal } from 'lucide-react';
import { sounds } from '../utils/sound';

interface ControlsProps {
  betPerLine: number;
  onBetChange: (newBet: number) => void;
  activeLines: number;
  onLinesChange: (newLines: number) => void;
  spinning: boolean;
  onSpin: () => void;
  autoSpin: boolean;
  autoSpinCount: number;
  onToggleAutoSpin: (count?: number) => void;
  turbo: boolean;
  onToggleTurbo: () => void;
  onMaxBet: () => void;
  disabled?: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  betPerLine,
  onBetChange,
  activeLines,
  onLinesChange,
  spinning,
  onSpin,
  autoSpin,
  autoSpinCount,
  onToggleAutoSpin,
  turbo,
  onToggleTurbo,
  onMaxBet,
  disabled,
}) => {
  const totalBet = betPerLine * activeLines;

  const handleAdjustBet = (delta: number) => {
    sounds.playClick();
    const newBet = Math.max(1, betPerLine + delta);
    onBetChange(newBet);
  };

  const handleSetBetMultiplier = (factor: number) => {
    sounds.playClick();
    const newBet = Math.max(1, Math.min(500, Math.round(betPerLine * factor)));
    onBetChange(newBet);
  };

  const handleAdjustLines = (delta: number) => {
    sounds.playClick();
    const newLines = Math.min(20, Math.max(1, activeLines + delta));
    onLinesChange(newLines);
  };

  const handleSetLines = (lines: number) => {
    sounds.playClick();
    onLinesChange(lines);
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-slate-950/95 border-2 border-amber-500/40 rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-2xl mt-4 select-none">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Left: Bet & Lines Tactile Cockpit */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto">
          {/* Bet Per Line */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Apuesta / Línea
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => handleSetBetMultiplier(0.5)}
                  disabled={disabled || betPerLine <= 1}
                  className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[9px] font-mono text-slate-300 font-bold"
                  title="Dividir apuesta entre 2"
                >
                  ½
                </button>
                <button
                  onClick={() => handleSetBetMultiplier(2)}
                  disabled={disabled || betPerLine >= 500}
                  className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[9px] font-mono text-amber-400 font-bold"
                  title="Duplicar apuesta x2"
                >
                  2x
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <button
                onClick={() => handleAdjustBet(-5)}
                disabled={disabled || betPerLine <= 1}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white flex items-center justify-center disabled:opacity-30 transition-all shadow"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-mono font-black text-amber-300 text-lg sm:text-xl">
                ${betPerLine}
              </span>
              <button
                onClick={() => handleAdjustBet(5)}
                disabled={disabled || betPerLine >= 500}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white flex items-center justify-center disabled:opacity-30 transition-all shadow"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Paylines */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Layers className="w-3 h-3 text-amber-400" /> Líneas
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => handleSetLines(10)}
                  disabled={disabled}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                    activeLines === 10 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  10
                </button>
                <button
                  onClick={() => handleSetLines(20)}
                  disabled={disabled}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                    activeLines === 20 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  20
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <button
                onClick={() => handleAdjustLines(-1)}
                disabled={disabled || activeLines <= 1}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white flex items-center justify-center disabled:opacity-30 transition-all shadow"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-mono font-black text-amber-300 text-lg sm:text-xl">
                {activeLines}
              </span>
              <button
                onClick={() => handleAdjustLines(1)}
                disabled={disabled || activeLines >= 20}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white flex items-center justify-center disabled:opacity-30 transition-all shadow"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Total Bet Summary */}
          <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-amber-500/20 border-2 border-amber-500/50 rounded-2xl p-3 flex flex-col justify-between shadow-lg shadow-amber-500/10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-yellow-400" /> Total
              </span>
              <span className="text-[9px] font-mono text-amber-400/80 font-bold">
                {betPerLine}x{activeLines}
              </span>
            </div>
            <span className="font-mono font-black text-amber-300 text-xl sm:text-2xl mt-1 drop-shadow">
              ${totalBet.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Center/Right: Action Buttons & Primary Spin */}
        <div className="flex items-center gap-2 sm:gap-3 w-full lg:w-auto justify-end flex-wrap">
          {/* Turbo Toggle */}
          <button
            onClick={() => {
              sounds.playClick();
              onToggleTurbo();
            }}
            className={`p-3 sm:px-4 sm:py-3 rounded-2xl font-bold text-xs flex flex-col items-center justify-center transition-all border ${
              turbo
                ? 'bg-amber-500 text-slate-950 border-yellow-300 shadow-lg shadow-amber-500/30 font-black'
                : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Modo Turbo (Giros Instantáneos)"
          >
            <Zap className={`w-5 h-5 ${turbo ? 'animate-bounce' : ''}`} />
            <span className="text-[9px] uppercase font-bold mt-1">Turbo</span>
          </button>

          {/* Auto Spin */}
          <button
            onClick={() => {
              sounds.playClick();
              onToggleAutoSpin(25);
            }}
            className={`p-3 sm:px-4 sm:py-3 rounded-2xl font-bold text-xs flex flex-col items-center justify-center transition-all border ${
              autoSpin
                ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-500/30 animate-pulse font-black'
                : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Giro Automático (25 Tiradas)"
          >
            <RefreshCw className={`w-5 h-5 ${autoSpin ? 'animate-spin' : ''}`} />
            <span className="text-[9px] uppercase font-bold mt-1">
              {autoSpin ? `${autoSpinCount} Auto` : 'Auto'}
            </span>
          </button>

          {/* Max Bet */}
          <button
            onClick={() => {
              sounds.playClick();
              onMaxBet();
            }}
            className="p-3 sm:px-4 sm:py-3 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 text-white font-bold text-xs flex flex-col items-center justify-center hover:from-red-500 hover:to-rose-500 border border-red-400/80 shadow-lg shadow-red-500/20 active:scale-95 transition-all"
            title="Apuesta Máxima ($100 x 20 Líneas)"
          >
            <Flame className="w-5 h-5 animate-pulse" />
            <span className="text-[9px] uppercase font-black mt-1">Máx Bet</span>
          </button>

          {/* PRIMARY LUXURY SPIN BUTTON */}
          <button
            onClick={() => {
              sounds.playClick();
              onSpin();
            }}
            disabled={disabled || spinning}
            className={`flex-1 sm:flex-initial px-8 sm:px-10 py-4 rounded-2xl font-black text-lg sm:text-xl uppercase tracking-widest flex items-center justify-center gap-2.5 shadow-2xl transition-all duration-200 border-2 ${
              spinning
                ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed opacity-80'
                : 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 border-yellow-200 hover:from-amber-300 hover:to-yellow-200 shadow-amber-500/40 active:scale-95 animate-pulse hover:shadow-[0_0_40px_rgba(245,158,11,0.6)]'
            }`}
          >
            <Play className={`w-6 h-6 fill-current ${spinning ? 'animate-spin' : ''}`} />
            <span>{spinning ? 'GIRANDO...' : 'GIRAR'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
