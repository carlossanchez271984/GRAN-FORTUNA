import React from 'react';
import { motion } from 'motion/react';
import { SymbolDef } from '../types';

interface ReelProps {
  symbols: SymbolDef[]; // 3 visible symbols
  spinning: boolean;
  reelIndex: number;
  winningIndices: number[]; // Row indices 0, 1, 2 that are part of a payline
  turbo: boolean;
}

export const Reel: React.FC<ReelProps> = ({
  symbols,
  spinning,
  reelIndex,
  winningIndices,
  turbo,
}) => {
  return (
    <div className="relative flex-1 bg-slate-950/80 rounded-xl overflow-hidden border border-amber-500/20 shadow-inner flex flex-col justify-around py-1 px-1 sm:px-1.5 h-64 sm:h-80 md:h-96">
      {/* Reel Column Blur/Motion during spin */}
      {spinning ? (
        <div className="absolute inset-0 flex flex-col justify-around items-center opacity-80 filter blur-[2px] animate-pulse">
          <motion.div
            animate={{ y: [0, -200] }}
            transition={{
              repeat: Infinity,
              duration: turbo ? 0.12 : 0.2,
              ease: 'linear',
            }}
            className="flex flex-col gap-6 text-3xl sm:text-5xl"
          >
            <span>🎰</span>
            <span>💎</span>
            <span>7️⃣</span>
            <span>👑</span>
            <span>🔔</span>
            <span>🍉</span>
            <span>🍇</span>
            <span>🍋</span>
            <span>🍒</span>
          </motion.div>
        </div>
      ) : (
        symbols.map((sym, rowIndex) => {
          const isWinning = winningIndices.includes(rowIndex);

          return (
            <motion.div
              key={`${reelIndex}-${rowIndex}-${sym.id}`}
              initial={{ scale: 0.8, opacity: 0.5, y: -20 }}
              animate={{ scale: isWinning ? 1.08 : 1, opacity: 1, y: 0 }}
              transition={{
                duration: turbo ? 0.15 : 0.3,
                delay: reelIndex * (turbo ? 0.05 : 0.1),
                type: 'spring',
                stiffness: 300,
              }}
              className={`relative flex flex-col items-center justify-center p-1 sm:p-2.5 rounded-lg sm:rounded-xl transition-all duration-300 ${
                isWinning
                  ? 'bg-gradient-to-b from-amber-500/30 via-yellow-400/20 to-amber-600/30 border-2 border-amber-300 shadow-lg shadow-amber-400/40 z-10 animate-bounce'
                  : 'bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/30'
              }`}
            >
              {/* Symbol Icon */}
              <div className="text-3xl sm:text-5xl md:text-6xl drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] filter transition-transform hover:scale-110">
                {sym.icon}
              </div>

              {/* Symbol Badge / Special tag */}
              <div
                className={`mt-1 px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black tracking-wider uppercase border shadow-md ${
                  sym.isWild
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white border-pink-300 animate-pulse'
                    : sym.isScatter
                    ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-slate-950 border-yellow-200 animate-pulse'
                    : sym.isBonus
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-700 text-white border-indigo-300 animate-pulse'
                    : 'bg-slate-950/80 text-amber-200/90 border-amber-500/20'
                }`}
              >
                {sym.name}
              </div>

              {/* Glow effect on win */}
              {isWinning && (
                <div className="absolute inset-0 rounded-xl bg-amber-400/20 animate-ping pointer-events-none" />
              )}
            </motion.div>
          );
        })
      )}
    </div>
  );
};
