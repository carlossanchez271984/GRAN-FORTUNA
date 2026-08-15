import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Gift, Trophy, Wallet, ShieldCheck, Gamepad2, Users, Coins, CheckCircle2, Globe, Clock, Sparkles, BookOpen, Crown } from 'lucide-react';
import { GameMode, UserProfile, Currency } from '../types';
import { sounds } from '../utils/sound';
import logoImg from '../assets/images/jugosuerte_pro_emblem_1786683489607.jpg';

interface HeaderProps {
  gameMode: GameMode;
  onToggleGameMode: (mode: GameMode) => void;
  balance: number;
  realBalance?: number;
  demoBalance?: number;
  onReloadDemo?: () => void;
  level: number;
  exp: number;
  maxExp: number;
  muted: boolean;
  onToggleMute: () => void;
  onOpenLobby: () => void;
  onOpenPaytable: () => void;
  onOpenDailyBonus: () => void;
  onOpenTournament: () => void;
  onOpenLeaderboard: () => void;
  onOpenWallet: () => void;
  onOpenProvablyFair: () => void;
  onOpenAuth: () => void;
  user: UserProfile | null;
  dailyBonusAvailable: boolean;
  freeSpinsLeft: number;
  currentGameName?: string;
  currency?: Currency;
  onCurrencyChange?: (curr: Currency) => void;
}

export const Header: React.FC<HeaderProps> = ({
  gameMode,
  onToggleGameMode,
  balance,
  realBalance,
  demoBalance,
  onReloadDemo,
  level,
  exp,
  maxExp,
  muted,
  onToggleMute,
  onOpenLobby,
  onOpenPaytable,
  onOpenDailyBonus,
  onOpenTournament,
  onOpenLeaderboard,
  onOpenWallet,
  onOpenProvablyFair,
  onOpenAuth,
  user,
  dailyBonusAvailable,
  freeSpinsLeft,
  currentGameName,
  currency = 'USD',
  onCurrencyChange,
}) => {
  const expPercent = Math.min(100, Math.round((exp / maxExp) * 100));
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getCurrencySymbol = (c?: string) => {
    if (c === 'PEN') return 'S/. ';
    if (c === 'EUR') return '€ ';
    return '$';
  };

  return (
    <header className="w-full bg-slate-950/95 backdrop-blur-2xl border-b border-amber-500/30 sticky top-0 z-40 shadow-2xl">
      {/* Top Professional Regulatory & Live Status Ribbon */}
      <div className="w-full bg-slate-950 border-b border-slate-800/90 px-3 sm:px-6 py-1 text-[11px] text-slate-400 flex items-center justify-between gap-2 overflow-x-auto select-none">
        <div className="flex items-center gap-4 shrink-0">
          <span className="flex items-center gap-1.5 text-emerald-400 font-mono font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span>Servidor Cloud • 18ms</span>
          </span>
          <span className="hidden sm:flex items-center gap-1 text-slate-300 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>GLI-19 Certificado • RNG SHA-256</span>
          </span>
        </div>

        <div className="flex items-center gap-4 shrink-0 font-mono text-[10px] sm:text-[11px]">
          {/* Live Clock */}
          <span className="flex items-center gap-1 text-slate-300">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>{timeStr || '12:00:00'} (UTC-5)</span>
          </span>

          {/* Currency Switcher */}
          {onCurrencyChange && (
            <div className="flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-800">
              <Globe className="w-3 h-3 text-amber-400" />
              <button
                onClick={() => onCurrencyChange('USD')}
                className={`px-1 rounded ${currency === 'USD' ? 'text-amber-400 font-bold bg-amber-500/20' : 'text-slate-400 hover:text-white'}`}
              >
                USD
              </button>
              <span className="text-slate-600">|</span>
              <button
                onClick={() => onCurrencyChange('PEN')}
                className={`px-1 rounded ${currency === 'PEN' ? 'text-amber-400 font-bold bg-amber-500/20' : 'text-slate-400 hover:text-white'}`}
              >
                PEN
              </button>
              <span className="text-slate-600">|</span>
              <button
                onClick={() => onCurrencyChange('EUR')}
                className={`px-1 rounded ${currency === 'EUR' ? 'text-amber-400 font-bold bg-amber-500/20' : 'text-slate-400 hover:text-white'}`}
              >
                EUR
              </button>
            </div>
          )}

          <span className="text-amber-400/90 font-bold hidden md:inline">
            +18 Juego Responsable
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand Logo & Current Game */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={onOpenLobby}>
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 p-0.5 shadow-xl shadow-amber-500/30 group-hover:scale-105 transition-transform duration-300">
              <img
                src={logoImg}
                alt="Gran Fortuna VIP Casino Emblem"
                className="w-full h-full object-cover rounded-[14px]"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1 font-sans">
                  Gran<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">Fortuna</span>
                </h1>
                <span className="text-[10px] uppercase font-black tracking-wider bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                  <Crown className="w-2.5 h-2.5 text-amber-400" />
                  CASINO VIP OFICIAL
                </span>
              </div>
              {currentGameName ? (
                <p className="text-[11px] text-amber-300 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                  En Sala: <strong className="text-white font-bold">{currentGameName}</strong>
                </p>
              ) : (
                <p className="text-[11px] text-slate-400 font-medium">
                  Plataforma Certificada de Tragamonedas Premium
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => {
                sounds.playClick();
                onOpenLobby();
              }}
              className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center gap-1"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Salas</span>
            </button>
          </div>
        </div>

        {/* Center: Mode Switcher & Real-time Balance */}
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center">
          {/* Mode Switcher */}
          <div className="bg-slate-900/95 border border-slate-800 p-1 rounded-2xl flex items-center gap-1 shadow-inner">
            <button
              onClick={() => {
                sounds.playClick();
                onToggleGameMode('virtual');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                gameMode === 'virtual'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/30 scale-105'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${gameMode === 'virtual' ? 'bg-slate-950 animate-ping' : 'bg-emerald-400'}`} />
              <span>Modo Demo</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                onToggleGameMode('real');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                gameMode === 'real'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-lg shadow-amber-500/40 scale-105'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Dinero Real</span>
            </button>
          </div>

          {/* Balance Display */}
          <div
            className={`rounded-2xl px-4 py-1.5 flex items-center gap-2.5 shadow-lg transition-all duration-300 ${
              gameMode === 'real'
                ? 'bg-slate-900/95 border-2 border-amber-400/60 shadow-amber-500/20'
                : 'bg-slate-900/95 border-2 border-emerald-400/50 shadow-emerald-500/15'
            }`}
          >
            <div
              className={`p-1.5 rounded-xl border ${
                gameMode === 'real'
                  ? 'bg-yellow-500/20 border-yellow-400/50 text-yellow-400'
                  : 'bg-emerald-500/20 border-emerald-400/50 text-emerald-400'
              }`}
            >
              <Coins className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span
                className={`text-[9px] uppercase font-black tracking-wider leading-none ${
                  gameMode === 'real' ? 'text-amber-300' : 'text-emerald-300'
                }`}
              >
                {gameMode === 'real' ? '💎 Saldo Real' : '🎮 Saldo Demo (Práctica)'}
              </span>
              <span
                className={`text-base sm:text-lg font-black tracking-wide font-mono ${
                  gameMode === 'real' ? 'text-amber-300 drop-shadow' : 'text-emerald-300 drop-shadow'
                }`}
              >
                {getCurrencySymbol(currency)}
                {(gameMode === 'real'
                  ? (realBalance !== undefined ? realBalance : balance)
                  : (demoBalance !== undefined ? demoBalance : balance)
                ).toLocaleString()}
              </span>
            </div>
            {gameMode === 'virtual' && onReloadDemo && (demoBalance ?? balance) < 5000 ? (
              <button
                onClick={() => {
                  sounds.playCoin();
                  onReloadDemo();
                }}
                className="ml-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-[10px] uppercase shadow-md transition-all active:scale-95 animate-pulse"
                title="Recargar fichas de práctica gratis"
              >
                + Recargar
              </button>
            ) : (
              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenWallet();
                }}
                className={`ml-1 px-3 py-1 rounded-xl text-slate-950 font-black text-[10px] uppercase shadow-md transition-all active:scale-95 ${
                  gameMode === 'real'
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300'
                }`}
              >
                {gameMode === 'real' ? 'Cajero' : 'Cajero Demo'}
              </button>
            )}
          </div>

          {/* Free Spins Left Badge */}
          {freeSpinsLeft > 0 && (
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 border border-purple-400 text-white px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1.5 animate-pulse shadow-lg shadow-purple-500/30">
              <span>🎉 {freeSpinsLeft} Giros Gratis</span>
            </div>
          )}

          {/* Level & XP Progress */}
          <div className="hidden sm:flex items-center gap-2.5 bg-slate-900/90 border border-slate-800 rounded-2xl px-3 py-1.5 shadow-inner">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center font-black text-xs text-slate-950 shadow">
              {level}
            </div>
            <div className="flex flex-col w-20">
              <div className="flex justify-between items-center text-[9px] uppercase font-bold text-slate-400">
                <span>Nivel VIP</span>
                <span className="text-amber-400 font-mono">{expPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300"
                  style={{ width: `${expPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Shortcuts */}
        <div className="flex items-center gap-2">
          {/* Lobby Button */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenLobby();
            }}
            className="hidden md:flex px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-xs items-center gap-1.5 transition-all"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Salas</span>
          </button>

          {/* Paytable / Info Button */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenPaytable();
            }}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1 transition-all"
            title="Tabla de Pagos & Reglas"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="hidden xl:inline text-[11px]">Pagos</span>
          </button>

          {/* Tournament */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenTournament();
            }}
            className="px-2.5 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 font-bold text-xs flex items-center gap-1 transition-all"
            title="Torneo Sol de Oro"
          >
            <Trophy className="w-4 h-4" />
            <span className="hidden lg:inline text-[11px]">Torneo</span>
          </button>

          {/* Leaderboard */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenLeaderboard();
            }}
            className="px-2.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold text-xs flex items-center gap-1 transition-all"
            title="Tabla de Líderes"
          >
            <Users className="w-4 h-4" />
            <span className="hidden lg:inline text-[11px]">Líderes</span>
          </button>

          {/* Provably Fair RNG */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenProvablyFair();
            }}
            className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 transition-all"
            title="RNG Provably Fair SHA-256"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>

          {/* Daily Bonus */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenDailyBonus();
            }}
            className={`p-2 rounded-xl border transition-all relative ${
              dailyBonusAvailable
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 border-yellow-300 animate-bounce shadow-lg shadow-amber-500/40'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Bono Diario & Rueda de la Fortuna"
          >
            {dailyBonusAvailable && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-950" />
            )}
            <Gift className="w-4 h-4" />
          </button>

          {/* User / Gmail Login Button */}
          {user && user.provider === 'gmail' ? (
            <button
              onClick={() => {
                sounds.playClick();
                onOpenAuth();
              }}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-amber-500/40 hover:border-amber-400 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md group"
              title="Perfil VIP de Google / Gmail"
            >
              <div className="relative w-6 h-6 rounded-lg overflow-hidden border border-amber-400/50">
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-slate-950" />
              </div>
              <div className="text-left hidden xl:block">
                <span className="text-[11px] font-black text-white block leading-none truncate max-w-[100px]">
                  {user.name}
                </span>
                <span className="text-[9px] text-amber-400 font-mono flex items-center gap-0.5">
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" /> VIP {user.vipTier}
                </span>
              </div>
            </button>
          ) : (
            <button
              onClick={() => {
                sounds.playClick();
                onOpenAuth();
              }}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-white/10 border border-slate-200 transition-all hover:scale-105 active:scale-95"
              title="Iniciar Sesión Oficial con Google"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Acceso Google</span>
            </button>
          )}

          {/* Mute button */}
          <button
            onClick={onToggleMute}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title={muted ? 'Activar Sonido' : 'Silenciar'}
          >
            {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
