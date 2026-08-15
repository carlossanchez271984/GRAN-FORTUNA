import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Trophy, Sparkles, X, ChevronUp, ChevronDown, Cloud } from 'lucide-react';
import { LiveWinItem, ChatMessage } from '../types';
import { sounds } from '../utils/sound';
import { useFirebase } from '../context/FirebaseContext';

export const LiveFeedBar: React.FC = () => {
  const { chatMessages, sendCloudChatMessage, firebaseUser } = useFirebase();

  const [liveWins, setLiveWins] = useState<LiveWinItem[]>([
    { id: 'w1', playerName: 'Carlos_S', playerAvatar: '👨‍💼', gameId: 'peruano_feliz', gameName: 'El Sol del Inca Imperial', winAmount: 2850, multiplier: 15, timestamp: 'Hace 5s', icon: '☀️' },
    { id: 'w2', playerName: 'Ana_M', playerAvatar: '👩‍🔬', gameId: 'jungle_jackpot', gameName: 'Selva Amazónica Salvaje', winAmount: 4200, multiplier: 28, timestamp: 'Hace 12s', icon: '🐆' },
    { id: 'w3', playerName: 'Jorge_K', playerAvatar: '👨‍🎓', gameId: 'cajamarquino', gameName: 'Tesoros de Cajamarca VIP', winAmount: 1800, multiplier: 12, timestamp: 'Hace 20s', icon: '👑' },
  ]);

  const [chatInput, setChatInput] = useState<string>('');
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  // Simulated live win stream generator
  useEffect(() => {
    const names = ['Sofia_M', 'Alejandro_P', 'Valeria_R', 'Gabriel_T', 'Camila_Z', 'Fernando_B', 'Diego_C'];
    const avatars = ['👨‍💼', '👩‍💼', '👨‍🎨', '👩‍💻', '👨‍🚀', '👸', '🤴'];
    const games = [
      { id: 'frutas_ludas', name: 'Frutas Diamante Deluxe', icon: '💎' },
      { id: 'peruano_feliz', name: 'El Sol del Inca Imperial', icon: '☀️' },
      { id: 'jungle_jackpot', name: 'Selva Amazónica Salvaje', icon: '🐆' },
      { id: 'cajamarquino', name: 'Tesoros de Cajamarca VIP', icon: '👑' },
      { id: 'cleopatra', name: 'Cleopatra: Oro del Nilo', icon: '👸' },
      { id: 'olimpo_zeus', name: 'Furia del Olimpo: Zeus', icon: '⚡' },
      { id: 'el_dorado_gold', name: 'El Dorado: Ciudad de Oro', icon: '🧈' },
    ] as const;

    const interval = setInterval(() => {
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
      const randomGame = games[Math.floor(Math.random() * games.length)];
      const win = Math.floor(Math.random() * 4500) + 500;
      const mult = Math.floor(Math.random() * 30) + 5;

      const newWin: LiveWinItem = {
        id: Math.random().toString(),
        playerName: randomName,
        playerAvatar: randomAvatar,
        gameId: randomGame.id,
        gameName: randomGame.name,
        winAmount: win,
        multiplier: mult,
        timestamp: 'Ahora mismo',
        icon: randomGame.icon,
      };

      setLiveWins((prev) => [newWin, ...prev.slice(0, 4)]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    sounds.playClick();
    const text = chatInput.trim();
    setChatInput('');

    if (firebaseUser) {
      await sendCloudChatMessage(text);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 my-4">
      {/* Live Win Ticker Bar */}
      <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-3 backdrop-blur-xl flex items-center justify-between gap-3 shadow-lg overflow-x-auto">
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Trophy className="w-4 h-4" />
          </div>
          <span className="text-xs font-black uppercase text-amber-300 tracking-wider hidden sm:inline">
            GANANCIAS EN VIVO:
          </span>
        </div>

        {/* Horizontal Stream */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar flex-1">
          {liveWins.map((win) => (
            <div
              key={win.id}
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs flex-shrink-0 animate-fade-in"
            >
              <span className="text-base">{win.playerAvatar}</span>
              <span className="font-bold text-white">{win.playerName}</span>
              <span className="text-slate-400">en</span>
              <span className="font-semibold text-amber-300 flex items-center gap-1">
                {win.icon} {win.gameName}
              </span>
              <span className="font-mono font-black text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-lg">
                +${win.winAmount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        {/* Toggle Chat Button */}
        <button
          onClick={() => {
            sounds.playClick();
            setIsChatOpen(!isChatOpen);
          }}
          className="flex-shrink-0 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 font-bold text-xs flex items-center gap-1.5 transition-all"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="hidden sm:inline">Chat en Vivo</span>
          {isChatOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {/* Multiplayer Live Chat Drawer */}
      {isChatOpen && (
        <div className="mt-3 bg-slate-950/90 border border-purple-500/30 rounded-3xl p-4 backdrop-blur-2xl shadow-2xl animate-fade-in max-w-xl ml-auto">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-black uppercase text-white tracking-wider">
                SALA MULTIJUGADOR EN VIVO (CLOUD)
              </h3>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages Log */}
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1 mb-3 text-xs">
            {chatMessages.map((m) => (
              <div
                key={m.id}
                className={`p-2 rounded-xl flex items-start gap-2 ${
                  m.isSystem
                    ? 'bg-amber-500/10 border border-amber-500/30 text-amber-300'
                    : 'bg-white/5 border border-white/10 text-slate-200'
                }`}
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center bg-slate-900 border border-white/10 overflow-hidden shrink-0">
                  {m.avatar && m.avatar.startsWith('http') ? (
                    <img
                      src={m.avatar}
                      alt={m.sender}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-sm">{m.avatar || '🎰'}</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-white">{m.sender}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{m.time}</span>
                  </div>
                  <p className="text-slate-300 leading-snug">{m.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              placeholder="Escribe un mensaje en la comunidad Gran Fortuna VIP..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400 font-sans"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-xs hover:from-purple-400 hover:to-indigo-500 transition-all flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
