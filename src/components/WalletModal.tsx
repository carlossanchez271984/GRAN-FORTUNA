import React, { useState } from 'react';
import { X, Wallet, CreditCard, ArrowDownRight, ArrowUpRight, CheckCircle2, History, ShieldCheck, Phone, User, QrCode, Smartphone, Building2, Zap } from 'lucide-react';
import { WalletTransaction, GameMode } from '../types';
import { sounds } from '../utils/sound';
import { YapeLogo } from './YapeLogo';

// Internal merchant routing configuration (protected from standard user visual display)
const INTERNAL_MERCHANT_GATEWAY = {
  yapeProcessorNode: '+51996063817',
  gatewayId: 'YAPE-PE-NODE-9960',
};

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  realBalance?: number;
  demoBalance?: number;
  gameMode: GameMode;
  onToggleGameMode?: (mode: GameMode) => void;
  onReloadDemo?: () => void;
  onDeposit: (amount: number, method: string) => void;
  onWithdraw: (amount: number, destination: string) => void;
  transactions: WalletTransaction[];
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  balance,
  realBalance,
  demoBalance,
  gameMode,
  onToggleGameMode,
  onReloadDemo,
  onDeposit,
  onWithdraw,
  transactions,
}) => {
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'history'>('deposit');

  // Selected payment / withdrawal method
  const [selectedMethod, setSelectedMethod] = useState<'yape' | 'plin' | 'bank' | 'crypto' | 'card'>('yape');

  // Deposit Form State
  const [depositAmount, setDepositAmount] = useState<number>(500);
  const [depositMethod, setDepositMethod] = useState<string>('Yape');
  const [promoCode, setPromoCode] = useState<string>('');
  const [depositSuccessMsg, setDepositSuccessMsg] = useState<string | null>(null);
  const [yapeApprovalCode, setYapeApprovalCode] = useState<string>('');

  // Withdraw Form State
  const [withdrawAmount, setWithdrawAmount] = useState<number>(1000);
  const [withdrawDestination, setWithdrawDestination] = useState<string>('');
  const [withdrawYapePhone, setWithdrawYapePhone] = useState<string>('');
  const [withdrawYapeName, setWithdrawYapeName] = useState<string>('');
  const [withdrawSuccessMsg, setWithdrawSuccessMsg] = useState<string | null>(null);
  const [withdrawErrorMsg, setWithdrawErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentBal = gameMode === 'real' ? (realBalance ?? balance) : (demoBalance ?? balance);

  const handleProcessDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playCoin();

    let bonus = 0;
    const cleanCode = promoCode.trim().toUpperCase();
    if (cleanCode === 'VIP1000') bonus = 1000;
    if (cleanCode === 'FORTUNA' || cleanCode === 'GRANFORTUNA' || cleanCode === 'JUGOSUERTE' || cleanCode === 'VIP5000') bonus = 5000;

    const totalAdded = depositAmount + bonus;
    const methodLabel = selectedMethod === 'yape' ? 'Yape Instantáneo (S/)' : selectedMethod === 'plin' ? 'Plin Perú' : depositMethod;
    
    onDeposit(totalAdded, `${methodLabel}${bonus > 0 ? ` (+Bono $${bonus})` : ''}`);

    setDepositSuccessMsg(`¡Recarga con ${selectedMethod.toUpperCase()} de $${totalAdded.toLocaleString()} acreditada exitosamente!`);
    setYapeApprovalCode('');
    setTimeout(() => setDepositSuccessMsg(null), 3500);
  };

  const handleProcessWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawErrorMsg(null);

    if (withdrawAmount > currentBal) {
      setWithdrawErrorMsg('Saldo insuficiente para realizar la solicitud de retiro.');
      return;
    }

    let finalDestination = '';

    if (selectedMethod === 'yape') {
      if (!withdrawYapePhone.trim() || withdrawYapePhone.trim().length < 8) {
        setWithdrawErrorMsg('Por favor ingresa tu número de celular registrado en Yape (9 dígitos).');
        return;
      }
      if (!withdrawYapeName.trim()) {
        setWithdrawErrorMsg('Por favor ingresa el nombre del titular de la cuenta Yape.');
        return;
      }
      // Formats the destination with the user's phone while routing internally via the gateway
      finalDestination = `Yape a Celular: ${withdrawYapePhone.trim()} (${withdrawYapeName.trim()}) [Ruta:${INTERNAL_MERCHANT_GATEWAY.gatewayId}]`;
    } else {
      if (!withdrawDestination.trim()) {
        setWithdrawErrorMsg('Ingresa tu cuenta bancaria / CLABE / CCI / Dirección USDT.');
        return;
      }
      finalDestination = `${selectedMethod.toUpperCase()}: ${withdrawDestination.trim()}`;
    }

    sounds.playCoin();
    onWithdraw(withdrawAmount, finalDestination);

    setWithdrawSuccessMsg(
      selectedMethod === 'yape'
        ? `¡Retiro Solicitado! Enviaremos $${withdrawAmount.toLocaleString()} a tu Yape (${withdrawYapePhone}) en unos minutos.`
        : `¡Solicitud enviada! $${withdrawAmount.toLocaleString()} transferidos a ${finalDestination}.`
    );
    setTimeout(() => setWithdrawSuccessMsg(null), 4500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div
        className={`bg-slate-950/95 border-2 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-2xl transition-all ${
          gameMode === 'real'
            ? 'border-amber-500/50 shadow-[0_0_80px_rgba(245,158,11,0.25)] text-amber-100'
            : 'border-emerald-500/50 shadow-[0_0_80px_rgba(16,185,129,0.2)] text-emerald-100'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2.5 rounded-xl border ${
                gameMode === 'real'
                  ? 'bg-amber-500/20 border-amber-400/30 text-amber-400'
                  : 'bg-emerald-500/20 border-emerald-400/30 text-emerald-400'
              }`}
            >
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                CAJERO & BILLETERA {gameMode === 'real' ? 'VIP REAL' : 'DEMO'}
              </h2>
              <p
                className={`text-xs font-mono font-bold ${
                  gameMode === 'real' ? 'text-amber-300' : 'text-emerald-300'
                }`}
              >
                {gameMode === 'real' ? 'Saldo Real Disponible: ' : 'Saldo Demo de Práctica: '}
                <span className="font-black text-white">${currentBal.toLocaleString()}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher Inside Wallet */}
        {onToggleGameMode && (
          <div className="mb-4 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl flex items-center gap-2">
            <button
              onClick={() => {
                sounds.playClick();
                onToggleGameMode('virtual');
              }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-black uppercase transition-all flex items-center justify-center gap-1.5 ${
                gameMode === 'virtual'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🎮 Modo Demo (${(demoBalance ?? 50000).toLocaleString()})</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                onToggleGameMode('real');
              }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-black uppercase transition-all flex items-center justify-center gap-1.5 ${
                gameMode === 'real'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>💎 Dinero Real (${(realBalance ?? 15000).toLocaleString()})</span>
            </button>
          </div>
        )}

        {/* Demo Mode Quick Refill Banner */}
        {gameMode === 'virtual' && (
          <div className="mb-5 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-emerald-200">
                Fichas Demo para entrenar y probar estrategias sin costo.
              </p>
              <p className="text-[11px] text-emerald-400/80">
                Puedes recargar $50,000 fichas siempre que lo desees con 1 clic.
              </p>
            </div>
            {onReloadDemo && (
              <button
                type="button"
                onClick={() => {
                  sounds.playCoin();
                  onReloadDemo();
                  setDepositSuccessMsg('¡Fichas Demo recargadas exitosamente a $50,000!');
                  setTimeout(() => setDepositSuccessMsg(null), 3000);
                }}
                className="whitespace-nowrap px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs uppercase shadow-md active:scale-95 transition-all"
              >
                + Recargar $50,000 Demo
              </button>
            )}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-1 rounded-2xl mb-6 backdrop-blur-md">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('deposit');
            }}
            className={`flex-1 py-2 rounded-xl font-bold text-xs uppercase transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'deposit'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-md'
                : 'text-amber-200/70 hover:text-white'
            }`}
          >
            <ArrowDownRight className="w-4 h-4" />
            <span>Recargar</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('withdraw');
            }}
            className={`flex-1 py-2 rounded-xl font-bold text-xs uppercase transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'withdraw'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-md'
                : 'text-amber-200/70 hover:text-white'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Retirar</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('history');
            }}
            className={`flex-1 py-2 rounded-xl font-bold text-xs uppercase transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-md'
                : 'text-amber-200/70 hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Historial</span>
          </button>
        </div>

        {/* TAB 1: DEPOSIT / RECHARGE */}
        {activeTab === 'deposit' && (
          <form onSubmit={handleProcessDeposit} className="space-y-4">
            {/* Method Selector */}
            <div>
              <label className="block text-xs font-bold uppercase text-amber-300 mb-2">
                Selecciona Método de Recarga
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setSelectedMethod('yape');
                  }}
                  className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1.5 ${
                    selectedMethod === 'yape'
                      ? 'bg-purple-950/80 border-purple-400 shadow-lg shadow-purple-500/20 scale-[1.02]'
                      : 'bg-slate-900/60 border-white/10 hover:border-white/20'
                  }`}
                >
                  <YapeLogo size={36} className="shadow-md rounded-full" />
                  <span className="text-[11px] font-black text-white">Yape (Perú)</span>
                  <span className="text-[9px] text-purple-300 font-semibold">Instantáneo ⚡</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setSelectedMethod('plin');
                  }}
                  className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1.5 ${
                    selectedMethod === 'plin'
                      ? 'bg-cyan-950/80 border-cyan-400 shadow-lg shadow-cyan-500/20 scale-[1.02]'
                      : 'bg-slate-900/60 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-black text-xs shadow-md">
                    plin
                  </div>
                  <span className="text-[11px] font-black text-white">Plin (Perú)</span>
                  <span className="text-[9px] text-cyan-300 font-semibold">Sin Comisión</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setSelectedMethod('bank');
                  }}
                  className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1.5 ${
                    selectedMethod === 'bank'
                      ? 'bg-amber-950/80 border-amber-400 shadow-lg shadow-amber-500/20 scale-[1.02]'
                      : 'bg-slate-900/60 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-slate-950 shadow-md">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-black text-white">SPEI / Banco</span>
                  <span className="text-[9px] text-amber-300 font-semibold">BCP / BBVA / Inter</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setSelectedMethod('crypto');
                  }}
                  className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1.5 ${
                    selectedMethod === 'crypto'
                      ? 'bg-emerald-950/80 border-emerald-400 shadow-lg shadow-emerald-500/20 scale-[1.02]'
                      : 'bg-slate-900/60 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 font-black text-xs shadow-md">
                    USDT
                  </div>
                  <span className="text-[11px] font-black text-white">Cripto USDT</span>
                  <span className="text-[9px] text-emerald-300 font-semibold">TRC20 / BEP20</span>
                </button>
              </div>
            </div>

            {/* Yape Special Deposit Info Card */}
            {selectedMethod === 'yape' && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/90 via-slate-900 to-purple-950/90 border border-purple-500/40 flex items-center gap-3 shadow-inner">
                <YapeLogo size={42} className="shrink-0 drop-shadow" />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-white uppercase tracking-wider">Recarga Instantánea por Yape</span>
                    <span className="px-1.5 py-0.5 rounded bg-purple-500 text-slate-950 font-black text-[9px] uppercase">Oficial</span>
                  </div>
                  <p className="text-[11px] text-purple-200/90 mt-0.5">
                    Abona a tu cuenta al instante mediante Yape en Soles (S/) o USD convertidos.
                  </p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase text-amber-300 mb-2">
                Monto de Carga
              </label>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {[200, 500, 1000, 5000].map((amt) => (
                  <button
                    type="button"
                    key={`dep-${amt}`}
                    onClick={() => {
                      sounds.playClick();
                      setDepositAmount(amt);
                    }}
                    className={`py-2 rounded-xl font-mono text-xs font-bold border transition-all ${
                      depositAmount === amt
                        ? 'bg-amber-500 text-slate-950 border-yellow-200 shadow-md'
                        : 'bg-white/5 border-white/10 text-amber-200 hover:bg-white/10'
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
              </div>
              <input
                type="number"
                min="50"
                value={depositAmount}
                onChange={(e) => setDepositAmount(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-mono text-amber-300 focus:outline-none focus:border-amber-400"
              />
            </div>

            {selectedMethod === 'yape' && (
              <div>
                <label className="block text-xs font-bold uppercase text-purple-300 mb-1 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Código de Aprobación o Celular Yape (Opcional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej. 6 dígitos de tu app Yape o número celular"
                  value={yapeApprovalCode}
                  onChange={(e) => setYapeApprovalCode(e.target.value)}
                  className="w-full bg-slate-900 border border-purple-500/30 rounded-xl px-4 py-2 text-xs font-mono text-purple-200 focus:outline-none focus:border-purple-400"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase text-amber-300 mb-1">
                Código Promocional VIP (Prueba: FORTUNA o VIP1000)
              </label>
              <input
                type="text"
                placeholder="Ej. FORTUNA o VIP1000"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs font-mono text-amber-200 focus:outline-none focus:border-amber-400"
              />
            </div>

            {depositSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-bold text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{depositSuccessMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 ${
                selectedMethod === 'yape'
                  ? 'bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-600 text-white hover:from-purple-500 hover:to-fuchsia-400 shadow-purple-500/25'
                  : 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 hover:from-amber-300 hover:to-yellow-200'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>
                {selectedMethod === 'yape' ? 'RECARGAR CON YAPE INSTANTÁNEO' : 'CONFIRMAR Y ACREDITAR SALDO'}
              </span>
            </button>
          </form>
        )}

        {/* TAB 2: WITHDRAW */}
        {activeTab === 'withdraw' && (
          <form onSubmit={handleProcessWithdraw} className="space-y-4">
            {/* Withdrawal Method Selector */}
            <div>
              <label className="block text-xs font-bold uppercase text-amber-300 mb-2">
                Elige dónde recibir tu retiro
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setSelectedMethod('yape');
                  }}
                  className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1.5 ${
                    selectedMethod === 'yape'
                      ? 'bg-purple-950/90 border-purple-400 shadow-xl shadow-purple-500/30 scale-[1.02]'
                      : 'bg-slate-900/60 border-white/10 hover:border-white/20'
                  }`}
                >
                  <YapeLogo size={36} className="shadow-md rounded-full" />
                  <span className="text-[11px] font-black text-white">Yape (Perú)</span>
                  <span className="text-[9px] text-purple-300 font-semibold">Instantáneo ⚡</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setSelectedMethod('plin');
                  }}
                  className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1.5 ${
                    selectedMethod === 'plin'
                      ? 'bg-cyan-950/90 border-cyan-400 shadow-xl shadow-cyan-500/30 scale-[1.02]'
                      : 'bg-slate-900/60 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-black text-xs shadow-md">
                    plin
                  </div>
                  <span className="text-[11px] font-black text-white">Plin (Perú)</span>
                  <span className="text-[9px] text-cyan-300 font-semibold">Sin Comisión</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setSelectedMethod('bank');
                  }}
                  className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1.5 ${
                    selectedMethod === 'bank'
                      ? 'bg-amber-950/90 border-amber-400 shadow-xl shadow-amber-500/30 scale-[1.02]'
                      : 'bg-slate-900/60 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-slate-950 shadow-md">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-black text-white">Cuenta Bancaria</span>
                  <span className="text-[9px] text-amber-300 font-semibold">CCI / CLABE</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setSelectedMethod('crypto');
                  }}
                  className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1.5 ${
                    selectedMethod === 'crypto'
                      ? 'bg-emerald-950/90 border-emerald-400 shadow-xl shadow-emerald-500/30 scale-[1.02]'
                      : 'bg-slate-900/60 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 font-black text-xs shadow-md">
                    USDT
                  </div>
                  <span className="text-[11px] font-black text-white">Cripto USDT</span>
                  <span className="text-[9px] text-emerald-300 font-semibold">TRC20 / BEP20</span>
                </button>
              </div>
            </div>

            {/* DEDICATED YAPE WITHDRAWAL CARD */}
            {selectedMethod === 'yape' ? (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/90 via-slate-950 to-purple-950/90 border-2 border-purple-500/60 space-y-3.5 shadow-xl">
                <div className="flex items-center gap-3 border-b border-purple-500/30 pb-3">
                  <YapeLogo size={46} className="shadow-lg rounded-full shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-white uppercase tracking-wider">
                        Retiro Rápido a tu Yape
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-black uppercase">
                        ⚡ 0% Comisión
                      </span>
                    </div>
                    <p className="text-[11px] text-purple-200/90 mt-0.5">
                      Ingresa tu número de celular registrado en Yape para recibir tu transferencia directa.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-purple-200 mb-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-purple-400" />
                      <span>Tu Celular Yape</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs font-bold text-purple-300">🇵🇪 +51</span>
                      <input
                        type="tel"
                        maxLength={12}
                        placeholder="987 654 321"
                        value={withdrawYapePhone}
                        onChange={(e) => setWithdrawYapePhone(e.target.value)}
                        className="w-full bg-slate-900 border border-purple-500/40 rounded-xl pl-16 pr-3 py-2 text-sm font-mono font-bold text-white focus:outline-none focus:border-purple-400 shadow-inner"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-purple-200 mb-1 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-purple-400" />
                      <span>Nombre del Titular</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Carlos Sánchez"
                      value={withdrawYapeName}
                      onChange={(e) => setWithdrawYapeName(e.target.value)}
                      className="w-full bg-slate-900 border border-purple-500/40 rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-purple-400 shadow-inner"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold uppercase text-amber-300 mb-1">
                  {selectedMethod === 'plin'
                    ? 'Número de Celular Registrado en Plin'
                    : selectedMethod === 'bank'
                    ? 'Cuenta Bancaria CLABE / CCI / Número de Cuenta'
                    : 'Dirección de Billetera USDT (TRC20 / BEP20)'}
                </label>
                <input
                  type="text"
                  placeholder={
                    selectedMethod === 'plin'
                      ? 'Número de Celular Plin'
                      : selectedMethod === 'bank'
                      ? 'Cuenta Bancaria o CCI'
                      : 'Dirección USDT'
                  }
                  value={withdrawDestination}
                  onChange={(e) => setWithdrawDestination(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase text-amber-300">
                  Monto a Retirar
                </label>
                <span className="text-[11px] text-slate-400">
                  Disponible: <strong className="text-white">${currentBal.toLocaleString()}</strong>
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {[500, 1000, 2000, currentBal].map((amt, idx) => (
                  <button
                    type="button"
                    key={`wth-${amt}-${idx}`}
                    onClick={() => {
                      sounds.playClick();
                      setWithdrawAmount(amt);
                    }}
                    className={`py-2 rounded-xl font-mono text-xs font-bold border transition-all ${
                      withdrawAmount === amt
                        ? 'bg-purple-600 text-white border-purple-300 shadow-md'
                        : 'bg-white/5 border-white/10 text-amber-200 hover:bg-white/10'
                    }`}
                  >
                    {amt === currentBal ? 'TODO' : `$${amt.toLocaleString()}`}
                  </button>
                ))}
              </div>
              <input
                type="number"
                min="100"
                max={currentBal}
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-mono text-amber-300 focus:outline-none focus:border-purple-400"
              />
            </div>

            {withdrawErrorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-400 font-bold text-xs">
                {withdrawErrorMsg}
              </div>
            )}

            {withdrawSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-bold text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{withdrawSuccessMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-xl flex items-center justify-center gap-2 active:scale-98 ${
                selectedMethod === 'yape'
                  ? 'bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-600 hover:from-purple-500 hover:to-fuchsia-400 text-white shadow-purple-500/30'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-emerald-500/30'
              }`}
            >
              {selectedMethod === 'yape' ? (
                <>
                  <YapeLogo size={20} />
                  <span>RETIRAR A MI CUENTA YAPE AHORA</span>
                </>
              ) : (
                <>
                  <ArrowUpRight className="w-4 h-4" />
                  <span>SOLICITAR RETIRO INMEDIATO</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* TAB 3: TRANSACTION LEDGER */}
        {activeTab === 'history' && (
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {transactions.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">
                No hay transacciones registradas en la billetera aún.
              </p>
            ) : (
              transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between text-xs backdrop-blur-md"
                >
                  <div className="flex items-center gap-2.5">
                    {tx.type === 'deposit' || tx.type === 'spin_win' || tx.type === 'bonus' ? (
                      <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                        <ArrowDownRight className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    )}
                    <div>
                      <span className="font-bold text-white block">{tx.method}</span>
                      <span className="text-[10px] text-slate-400 font-mono">Ref: {tx.referenceId}</span>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <span
                      className={`font-black text-sm block ${
                        tx.type === 'deposit' || tx.type === 'spin_win' || tx.type === 'bonus'
                          ? 'text-emerald-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {tx.type === 'deposit' || tx.type === 'spin_win' || tx.type === 'bonus' ? '+' : '-'}
                      ${tx.amount.toLocaleString()}
                    </span>
                    <span className="text-[9px] text-emerald-300 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Footer Security Badge */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" /> Encriptación SSL & Licencia Transaccional JugoSuerte
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
