import React, { useState } from 'react';
import { Sparkles, Trophy } from 'lucide-react';
import { sounds } from '../utils/sound';

interface BonusWheelModalProps {
  isOpen: boolean;
  onClaimWin: (amount: number) => void;
}

const WHEEL_SEGMENTS = [1000, 2500, 5000, 10000, 25000, 50000, 100000, 250000];

export const BonusWheelModal: React.FC<BonusWheelModalProps> = ({ isOpen, onClaimWin }) => {
  const [spinning, setSpinning] = useState<boolean>(false);
  const [rotation, setRotation] = useState<number>(0);
  const [wonAmount, setWonAmount] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleSpinWheel = () => {
    if (spinning) return;
    setSpinning(true);
    sounds.playSpin();

    const selectedIndex = Math.floor(Math.random() * WHEEL_SEGMENTS.length);
    const segmentAngle = 360 / WHEEL_SEGMENTS.length;
    const targetRotation = 360 * 5 + (360 - selectedIndex * segmentAngle - segmentAngle / 2);

    setRotation(targetRotation);

    setTimeout(() => {
      setSpinning(false);
      const prize = WHEEL_SEGMENTS[selectedIndex];
      setWonAmount(prize);
      sounds.playWin(true);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-fade-in">
      <div className="max-w-md w-full bg-slate-950 border-2 border-amber-400 rounded-3xl p-6 text-center shadow-[0_0_100px_rgba(245,158,11,0.5)]">
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-1 flex items-center justify-center gap-2">
          <Trophy className="w-7 h-7 text-amber-400" /> RULETA DEL SOL DE ORO
        </h2>
        <p className="text-xs text-amber-300/80 mb-6 font-semibold">
          ¡Gira la rueda y gana multiplicadores especiales de bonificación!
        </p>

        {/* Wheel Graphic */}
        <div className="relative w-64 h-64 mx-auto my-6 flex items-center justify-center">
          {/* Top Pointer */}
          <div className="absolute -top-3 z-20 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-amber-400 drop-shadow-[0_2px_10px_rgba(245,158,11,0.8)]" />

          {/* Rotating Wheel Disk */}
          <div
            className="w-full h-full rounded-full border-4 border-amber-400 relative overflow-hidden transition-transform duration-[4000ms] cubic-bezier(0.15, 0.9, 0.2, 1)"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {WHEEL_SEGMENTS.map((val, idx) => {
              const angle = (360 / WHEEL_SEGMENTS.length) * idx;
              return (
                <div
                  key={`seg-${idx}`}
                  className="absolute top-0 left-1/2 w-1/2 h-1/2 origin-bottom-left flex items-center justify-center font-mono font-black text-xs text-amber-300 border-r border-amber-500/30"
                  style={{
                    transform: `rotate(${angle}deg)`,
                    backgroundColor: idx % 2 === 0 ? '#1e1b4b' : '#0f172a',
                  }}
                >
                  <span className="transform -rotate-45 font-bold">${val}</span>
                </div>
              );
            })}
          </div>
        </div>

        {wonAmount !== null ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-amber-400 text-2xl font-mono font-black text-amber-300">
              ¡Ganaste ${wonAmount.toLocaleString()}!
            </div>
            <button
              onClick={() => onClaimWin(wonAmount)}
              className="w-full py-3.5 rounded-2xl bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider hover:bg-yellow-300 transition-all shadow-lg"
            >
              ACREDITAR EN BILLETERA
            </button>
          </div>
        ) : (
          <button
            onClick={handleSpinWheel}
            disabled={spinning}
            className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 ${
              spinning
                ? 'bg-slate-800 text-slate-500'
                : 'bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 hover:from-amber-300 hover:to-yellow-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{spinning ? 'GIRANDO RULETA...' : 'GIRAR RULETA AHORA'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
