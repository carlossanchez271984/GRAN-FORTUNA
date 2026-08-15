import React from 'react';
import { X, Gift, Sparkles } from 'lucide-react';
import { sounds } from '../utils/sound';

interface DailyBonusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaim: (amount: number) => void;
  claimedToday: boolean;
}

export const DailyBonusModal: React.FC<DailyBonusModalProps> = ({
  isOpen,
  onClose,
  onClaim,
  claimedToday,
}) => {
  if (!isOpen) return null;

  const rewardAmount = 2500;

  const handleClaim = () => {
    sounds.playCoin();
    onClaim(rewardAmount);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="bg-slate-950/90 border border-amber-500/40 rounded-3xl max-w-md w-full p-6 text-center shadow-[0_0_80px_rgba(245,158,11,0.3)] text-amber-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-amber-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-400/30 text-amber-400 flex items-center justify-center mx-auto mb-4">
          <Gift className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-black text-white mb-1">REGALO DIARIO VIP</h2>
        <p className="text-xs text-amber-300/80 mb-6">
          Recompensa diaria para miembros activos de JugoSuerte.
        </p>

        <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-5 font-mono font-black text-3xl text-amber-300 mb-6">
          +${rewardAmount.toLocaleString()} Fichas
        </div>

        {claimedToday ? (
          <p className="text-xs text-slate-400 font-bold py-2 bg-white/5 rounded-xl">
            Ya has reclamado tu regalo de hoy. ¡Vuelve mañana para tu siguiente bono!
          </p>
        ) : (
          <button
            onClick={handleClaim}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black text-xs uppercase tracking-wider hover:from-amber-300 hover:to-yellow-200 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>RECLAMAR REGALO AHORA</span>
          </button>
        )}
      </div>
    </div>
  );
};
