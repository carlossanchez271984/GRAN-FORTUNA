import React from 'react';
import { Sparkles, Flame, Trophy } from 'lucide-react';
import { sounds } from '../utils/sound';

interface WinModalProps {
  isOpen: boolean;
  winType: 'big' | 'mega' | 'jackpot' | null;
  amount: number;
  onClose: () => void;
}

export const WinModal: React.FC<WinModalProps> = ({ isOpen, winType, amount, onClose }) => {
  if (!isOpen || !winType) return null;

  const isJackpot = winType === 'jackpot';
  const isMega = winType === 'mega';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-fade-in">
      <div className="relative max-w-lg w-full rounded-3xl bg-slate-950 border-2 border-amber-400 p-8 text-center shadow-[0_0_120px_rgba(245,158,11,0.6)] animate-bounce-slow">
        <div className="inline-flex p-4 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 mb-4 shadow-xl">
          {isJackpot ? <Trophy className="w-12 h-12" /> : <Flame className="w-12 h-12" />}
        </div>

        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500 mb-2 uppercase">
          {isJackpot ? '¡GRAN BOTE JACKPOT!' : isMega ? '¡MEGA VICTORIA!' : '¡GRAN VICTORIA!'}
        </h2>

        <p className="text-xs uppercase tracking-widest text-amber-300 font-bold mb-6">
          PREMIO ESPECIAL ACREDITADO EN TU SALDO
        </p>

        <div className="bg-slate-900 border border-amber-500/50 rounded-2xl p-6 font-mono font-black text-4xl sm:text-6xl text-amber-300 tracking-wider mb-8 shadow-inner">
          ${amount.toLocaleString()}
        </div>

        <button
          onClick={() => {
            sounds.playCoin();
            onClose();
          }}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-black text-sm uppercase tracking-widest hover:from-amber-300 hover:to-yellow-200 transition-all shadow-xl flex items-center justify-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          <span>RECLAMAR PREMIO AHORA</span>
        </button>
      </div>
    </div>
  );
};
