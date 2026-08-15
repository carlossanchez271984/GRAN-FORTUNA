import React from 'react';
import { X, HelpCircle, Flame } from 'lucide-react';
import { GameTheme } from '../types';

interface PaytableModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: GameTheme;
}

export const PaytableModal: React.FC<PaytableModalProps> = ({ isOpen, onClose, game }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="bg-slate-950/90 border border-amber-500/40 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-[0_0_80px_rgba(245,158,11,0.3)] text-amber-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-400">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                TABLA DE PAGOS: {game.name.toUpperCase()}
              </h2>
              <p className="text-xs text-amber-300">Pagos y combinaciones por apuesta de línea</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-amber-300 transition-colors border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Symbols Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {game.symbols.map((sym) => (
            <div
              key={sym.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-3 backdrop-blur-md"
            >
              <div className="text-4xl p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                {sym.icon}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white text-xs">{sym.name}</span>
                  {sym.isWild && (
                    <span className="bg-amber-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                      WILD
                    </span>
                  )}
                  {sym.isScatter && (
                    <span className="bg-emerald-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                      SCATTER
                    </span>
                  )}
                  {sym.isBonus && (
                    <span className="bg-purple-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                      BONO
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-1 font-mono text-[11px] text-amber-300">
                  <span>5x: <strong>x{sym.payout5}</strong></span>
                  <span>4x: <strong>x{sym.payout4}</strong></span>
                  <span>3x: <strong>x{sym.payout3}</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Game Rules Info */}
        <div className="bg-amber-950/40 border border-amber-500/30 rounded-2xl p-4 text-xs leading-relaxed text-amber-200">
          <h3 className="font-bold text-amber-300 mb-1 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-400" /> REGLAS Y SÍMBOLOS ESPECIALES:
          </h3>
          <p className="mb-1">• Los símbolos <strong>WILD</strong> sustituyen a cualquier símbolo común para completar combinaciones ganadoras.</p>
          <p className="mb-1">• 3 o más símbolos <strong>SCATTER</strong> activan hasta 25 Giros Gratis con multiplicador 3x.</p>
          <p>• 3 o más símbolos de <strong>BONO</strong> activan la Ruleta de la Fortuna con premios multiplicadores inmediatos.</p>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all"
          >
            CERRAR
          </button>
        </div>
      </div>
    </div>
  );
};
