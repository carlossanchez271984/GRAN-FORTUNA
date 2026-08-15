import React, { useState } from 'react';
import { X, ShieldCheck, Key, RefreshCw, CheckCircle, Copy, Search } from 'lucide-react';
import { sha256, generateRandomSeed } from '../utils/provablyFair';

interface ProvablyFairModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverSeed: string;
  serverSeedHash: string;
  clientSeed: string;
  nonce: number;
  onUpdateClientSeed: (newSeed: string) => void;
  onRotateServerSeed: () => void;
}

export const ProvablyFairModal: React.FC<ProvablyFairModalProps> = ({
  isOpen,
  onClose,
  serverSeed,
  serverSeedHash,
  clientSeed,
  nonce,
  onUpdateClientSeed,
  onRotateServerSeed,
}) => {
  const [clientInput, setClientInput] = useState<string>(clientSeed);
  const [copied, setCopied] = useState<boolean>(false);
  const [verifyServerSeed, setVerifyServerSeed] = useState<string>('');
  const [verifyClientSeed, setVerifyClientSeed] = useState<string>('');
  const [verifyNonce, setVerifyNonce] = useState<number>(1);
  const [verifyHashResult, setVerifyHashResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAudit = async () => {
    if (!verifyServerSeed || !verifyClientSeed) return;
    const computed = await sha256(`${verifyServerSeed}:${verifyClientSeed}:${verifyNonce}`);
    setVerifyHashResult(computed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="bg-slate-950/90 border border-emerald-500/40 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-[0_0_80px_rgba(16,185,129,0.3)] text-emerald-100">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">VERIFICACIÓN PROVABLY FAIR</h2>
              <p className="text-xs text-emerald-300">Garantía Criptográfica Inalterable SHA-256</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-300 transition-colors border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 mb-6 text-xs text-emerald-200 leading-relaxed">
          <p className="font-bold text-emerald-300 mb-1 flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-emerald-400" /> Transparencia Algorítmica Absoluta
          </p>
          Cada resultado de los giros está predeterminado por el hash criptográfico SHA-256 de la combinación entre tu Semilla del Cliente, la Semilla del Servidor y el número de giro (Nonce).
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                <Key className="w-3.5 h-3.5" /> Hash de Semilla de Servidor (Pre-cifrado)
              </span>
              <button
                onClick={onRotateServerSeed}
                className="text-[11px] font-bold text-amber-400 flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20"
              >
                <RefreshCw className="w-3 h-3" /> Rotar Semilla
              </button>
            </div>
            <div className="flex items-center justify-between bg-slate-900 rounded-xl p-2.5 font-mono text-xs text-amber-200">
              <span className="truncate pr-2">{serverSeedHash}</span>
              <button onClick={() => handleCopy(serverSeedHash)} className="p-1 text-emerald-400">
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
            <span className="text-xs font-bold text-cyan-300 block mb-1.5">
              Semilla del Cliente (Personalizable)
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                value={clientInput}
                onChange={(e) => setClientInput(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-cyan-200 focus:outline-none"
              />
              <button
                onClick={() => onUpdateClientSeed(clientInput)}
                className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl"
              >
                Guardar
              </button>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex items-center justify-between">
            <span className="text-xs font-bold text-purple-300">Contador de Giros (Nonce)</span>
            <span className="font-mono text-base font-black text-purple-300">#{nonce}</span>
          </div>
        </div>

        {/* Auditor */}
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-4">
          <h3 className="text-xs font-bold text-amber-300 mb-3 flex items-center gap-1">
            <Search className="w-4 h-4" /> HERRAMIENTA DE AUDITORÍA INDEPENDIENTE
          </h3>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <input
              type="text"
              placeholder="Server Seed Revelada"
              value={verifyServerSeed}
              onChange={(e) => setVerifyServerSeed(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs font-mono text-white"
            />
            <input
              type="text"
              placeholder="Client Seed"
              value={verifyClientSeed}
              onChange={(e) => setVerifyClientSeed(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs font-mono text-white"
            />
            <input
              type="number"
              placeholder="Nonce"
              value={verifyNonce}
              onChange={(e) => setVerifyNonce(parseInt(e.target.value, 10) || 1)}
              className="bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs font-mono text-white"
            />
          </div>
          <button
            onClick={handleAudit}
            className="w-full py-2 bg-emerald-500 text-slate-950 font-black text-xs rounded-xl uppercase"
          >
            VERIFICAR HASH RESULTANTE
          </button>
          {verifyHashResult && (
            <div className="mt-3 p-2.5 rounded-xl bg-slate-950 font-mono text-[11px] text-emerald-400 break-all border border-emerald-500/30">
              Hash: {verifyHashResult}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-white/10 text-white font-bold text-xs"
          >
            CERRAR
          </button>
        </div>
      </div>
    </div>
  );
};
