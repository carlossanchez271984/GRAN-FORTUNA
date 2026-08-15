import React from 'react';
import { X, Trophy, Award, Crown, Flame, Cloud } from 'lucide-react';
import { LeaderboardUser, UserProfile } from '../types';
import { useFirebase } from '../context/FirebaseContext';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserProfile | null;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose, user }) => {
  const { leaderboardUsers } = useFirebase();

  if (!isOpen) return null;

  const DEFAULT_LEADERBOARD: LeaderboardUser[] = [
    { rank: 1, name: 'Diego_Cusco', avatar: '👑', weeklyWins: 145200, biggestWin: 48500, vipTier: 'Diamante', country: '🇵🇪' },
    { rank: 2, name: 'Valeria_Lima', avatar: '👩‍💼', weeklyWins: 112000, biggestWin: 36000, vipTier: 'Platino', country: '🇵🇪' },
    { rank: 3, name: 'Mateo_Arequipa', avatar: '👨‍🌾', weeklyWins: 98500, biggestWin: 29000, vipTier: 'Platino', country: '🇵🇪' },
    { rank: 4, name: 'Carlos_Cajamarca', avatar: '🤠', weeklyWins: 78000, biggestWin: 22500, vipTier: 'Oro', country: '🇵🇪' },
    { rank: 5, name: 'Lucia_Trujillo', avatar: '👩‍🔬', weeklyWins: 64200, biggestWin: 18200, vipTier: 'Oro', country: '🇵🇪' },
    { rank: 6, name: 'Gabriel_Piura', avatar: '👨‍🎓', weeklyWins: 52000, biggestWin: 14000, vipTier: 'Plata', country: '🇵🇪' },
    {
      rank: 7,
      name: user ? `${user.name} (Tú)` : 'Tú (Jugador VIP)',
      avatar: user?.avatar || '🌟',
      weeklyWins: 41500,
      biggestWin: 12500,
      vipTier: user?.vipTier || 'Plata',
      country: user?.country || '🇵🇪',
    },
  ];

  const displayData = leaderboardUsers.length > 0 ? leaderboardUsers : DEFAULT_LEADERBOARD;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="bg-slate-950/90 border border-cyan-500/40 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-[0_0_80px_rgba(6,182,212,0.3)] text-cyan-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-400">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                TABLA DE LÍDERES
              </h2>
              <p className="text-xs text-cyan-300">Ranking Semanal de Jugadores VIP Gran Fortuna</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-300 transition-colors border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Podium Highlight */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {displayData.slice(0, 3).map((item) => (
            <div
              key={item.rank}
              className={`rounded-2xl p-3 text-center border relative flex flex-col items-center justify-between ${
                item.rank === 1
                  ? 'bg-gradient-to-b from-amber-500/20 to-slate-950 border-amber-400 shadow-lg shadow-amber-500/20 order-2 -mt-2'
                  : item.rank === 2
                  ? 'bg-gradient-to-b from-slate-400/20 to-slate-950 border-slate-300 order-1'
                  : 'bg-gradient-to-b from-amber-700/20 to-slate-950 border-amber-600 order-3'
              }`}
            >
              <div className="text-2xl mb-1 flex items-center justify-center">
                {item.avatar && item.avatar.startsWith('http') ? (
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-8 h-8 rounded-full object-cover border border-amber-400/60 shadow"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span>{item.avatar || '👑'}</span>
                )}
              </div>
              <span className="font-bold text-xs text-white truncate max-w-full">{item.name}</span>
              <span className="text-[10px] text-cyan-300 font-mono font-bold mt-1">
                ${item.weeklyWins.toLocaleString()}
              </span>
              <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded-full bg-slate-900 border border-white/10 mt-1">
                #{item.rank}
              </span>
            </div>
          ))}
        </div>

        {/* List of Rankings */}
        <div className="space-y-2">
          {displayData.map((item) => (
            <div
              key={item.rank}
              className={`p-3 rounded-2xl border flex items-center justify-between text-xs transition-all ${
                item.name.includes('Tú')
                  ? 'bg-amber-500/20 border-amber-400 font-bold shadow-md'
                  : 'bg-white/5 border-white/10 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono font-black text-sm w-6 text-cyan-400">#{item.rank}</span>
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-900 border border-white/10 overflow-hidden shrink-0">
                  {item.avatar && item.avatar.startsWith('http') ? (
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-lg">{item.avatar || '👑'}</span>
                  )}
                </div>
                <div>
                  <span className="font-bold text-white block">{item.name}</span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    {item.country} Nivel {item.vipTier}
                  </span>
                </div>
              </div>

              <div className="text-right font-mono">
                <span className="font-black text-sm text-cyan-300 block">
                  ${item.weeklyWins.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400">
                  Mayor victoria: ${item.biggestWin.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
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
