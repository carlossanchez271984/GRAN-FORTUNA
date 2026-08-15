import React, { useState, useEffect } from 'react';
import { X, Trophy, Flame, Timer, Sparkles, Award } from 'lucide-react';

interface TournamentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TournamentModal: React.FC<TournamentModalProps> = ({ isOpen, onClose }) => {
  const [timeLeft, setTimeLeft] = useState<number>(14400); // 4 hours in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 14400));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isOpen) return null;

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="bg-slate-950/90 border border-purple-500/40 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-[0_0_80px_rgba(168,85,247,0.3)] text-purple-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-purple-500/20 border border-purple-400/30 text-purple-400">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                TORNEO SOL DE ORO
              </h2>
              <p className="text-xs text-purple-300">Competición Diaria Multijugador Gran Fortuna VIP</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-purple-300 transition-colors border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prize Pool & Timer Banner */}
        <div className="bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border border-purple-500/40 rounded-2xl p-4 mb-6 text-center relative overflow-hidden">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs uppercase font-bold text-amber-300 tracking-wider">
              BOLSA DE PREMIOS EN JUEGO
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 font-mono mb-3">
            $50,000 EN PREMIOS
          </div>

          <div className="inline-flex items-center gap-2 bg-slate-950/80 border border-purple-400/30 px-4 py-1.5 rounded-full text-xs font-mono text-purple-200">
            <Timer className="w-4 h-4 text-purple-400" />
            <span>
              Tiempo restante: <strong>{String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</strong>
            </span>
          </div>
        </div>

        {/* Tournament Rules */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 text-xs leading-relaxed space-y-2">
          <h3 className="font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-400" /> Reglas de la Competición:
          </h3>
          <p>• Acumulas 1 punto de torneo por cada $10 apostados en cualquiera de los 4 tragamonedas.</p>
          <p>• Multiplicadores de gran victoria otorgan puntos adicionales x5.</p>
          <p>• Los primeros 10 lugares del ranking al finalizar el temporizador recibirán acreditación directa de premios.</p>
        </div>

        {/* User Current Position */}
        <div className="bg-purple-950/60 border border-purple-500/40 rounded-2xl p-4 mb-6 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-purple-300 block">Tu Clasificación Actual</span>
            <span className="text-lg font-black text-white">Lugar #12 (4,150 Puntos)</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-purple-300 block">Siguiente Premio</span>
            <span className="text-sm font-black text-amber-300">$1,500 Bonus</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-xs uppercase tracking-wider hover:from-purple-400 hover:to-indigo-500 transition-all shadow-lg"
          >
            ENTENDIDO & CONTINUAR JUGANDO
          </button>
        </div>
      </div>
    </div>
  );
};
