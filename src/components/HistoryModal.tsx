import React from 'react';
import { X, History, BarChart3, Trophy, RefreshCw, Flame } from 'lucide-react';
import { GameStats, HistoryItem } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
  history: HistoryItem[];
  onResetStats: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  stats,
  history,
  onResetStats,
}) => {
  if (!isOpen) return null;

  const rtp =
    stats.totalBets > 0
      ? Math.round((stats.totalWins / stats.totalBets) * 100)
      : 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-gradient-to-b from-slate-900 via-purple-950 to-slate-950 border-2 border-amber-500/50 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-2xl text-amber-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-500/30 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
              ESTADÍSTICAS E HISTORIAL
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 transition-colors border border-amber-500/30"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold text-amber-300/70">Giros Totales</span>
            <span className="text-xl font-black text-amber-300 font-mono mt-1">
              {stats.totalSpins}
            </span>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold text-amber-300/70">Mayor Ganancia</span>
            <span className="text-xl font-black text-emerald-400 font-mono mt-1">
              ${stats.biggestWin.toLocaleString()}
            </span>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold text-amber-300/70">Retorno RTP Est.</span>
            <span className="text-xl font-black text-purple-300 font-mono mt-1">
              {rtp}%
            </span>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold text-amber-300/70">Jackpots Ganados</span>
            <span className="text-xl font-black text-yellow-400 font-mono mt-1">
              {stats.jackpotsWon}
            </span>
          </div>
        </div>

        {/* Recent Spins History */}
        <h3 className="text-xs font-black uppercase text-amber-400 tracking-wider mb-3 flex items-center gap-1.5">
          <History className="w-4 h-4" /> ÚLTIMOS GIROS
        </h3>

        <div className="space-y-2 max-h-56 overflow-y-auto pr-1 mb-6">
          {history.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">
              Aún no hay giros registrados en esta sesión.
            </p>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-mono text-[10px]">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="font-bold text-amber-200">
                    Apuesta: ${item.bet}
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono">
                  {item.win > 0 ? (
                    <span className="font-black text-emerald-400">+${item.win.toLocaleString()}</span>
                  ) : (
                    <span className="text-slate-500">$0</span>
                  )}

                  {item.type === 'jackpot' && (
                    <span className="px-2 py-0.5 rounded-full bg-yellow-500 text-slate-950 font-black text-[9px]">
                      JACKPOT
                    </span>
                  )}
                  {item.type === 'big_win' && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-600 text-white font-bold text-[9px]">
                      GRAN GANANCIA
                    </span>
                  )}
                  {item.type === 'bonus' && (
                    <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white font-bold text-[9px]">
                      BONUS
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4">
          <button
            onClick={onResetStats}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-rose-300 font-bold text-xs flex items-center gap-1.5 border border-rose-500/30 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reiniciar Estadísticas</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs hover:from-amber-400 transition-all shadow-md"
          >
            CERRAR
          </button>
        </div>
      </div>
    </div>
  );
};
