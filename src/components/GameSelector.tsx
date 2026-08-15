import React, { useState } from 'react';
import { GameTheme, GameId } from '../types';
import { Play, Flame, Users, Sparkles, Search } from 'lucide-react';
import { sounds } from '../utils/sound';

interface GameSelectorProps {
  games: GameTheme[];
  activeGameId: GameId;
  onSelectGame: (gameId: GameId) => void;
}

export const GameSelector: React.FC<GameSelectorProps> = ({
  games,
  activeGameId,
  onSelectGame,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: '🔥 Todas las Salas (7)' },
    { id: 'peru', label: '☀️ Éxitos Peruanos' },
    { id: 'ancient', label: '🏺 Egipto & El Dorado' },
    { id: 'myth', label: '⚡ Dioses & Mitos' },
    { id: 'classic', label: '🎰 Clásicos & Selva' },
  ];

  const filteredGames = games.filter((g) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      (selectedCategory === 'peru' && (g.id === 'peruano_feliz' || g.id === 'cajamarquino')) ||
      (selectedCategory === 'ancient' && (g.id === 'cleopatra' || g.id === 'el_dorado_gold')) ||
      (selectedCategory === 'myth' && g.id === 'olimpo_zeus') ||
      (selectedCategory === 'classic' && (g.id === 'frutas_ludas' || g.id === 'jungle_jackpot'));

    const matchesSearch =
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.features && g.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 animate-fade-in select-none">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>LOBBY VIP PROFESIONAL • SALAS DE ALTA FRECUENCIA</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
          SELECCIONA TU <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">SALA DE JUEGO</span>
        </h2>
        <p className="text-sm text-slate-300">
          7 Tragamonedas exclusivas con algoritmos RNG certificados, botes progresivos en red, jackpots acumulados y multiplicadores de hasta x25,000.
        </p>
      </div>

      {/* Category Filter Pills & Search Cockpit */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                sounds.playClick();
                setSelectedCategory(cat.id);
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-black tracking-wide whitespace-nowrap transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 border-yellow-200 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900/90 text-slate-400 hover:text-white border-slate-800 hover:border-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por juego, temática o RTP..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 focus:border-amber-400 text-white placeholder-slate-500 text-xs outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Grid of 7 Professional Games */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredGames.map((game) => {
          const isCurrent = game.id === activeGameId;

          return (
            <div
              key={game.id}
              onClick={() => {
                sounds.playClick();
                onSelectGame(game.id);
              }}
              className={`group relative rounded-3xl overflow-hidden bg-slate-900/95 border transition-all duration-300 hover:-translate-y-2 cursor-pointer shadow-2xl flex flex-col justify-between ${game.cardBorder} ${
                isCurrent ? 'ring-2 ring-amber-400 ring-offset-4 ring-offset-slate-950 scale-[1.02]' : ''
              }`}
            >
              {/* Card Ambient Background */}
              <div className={`absolute inset-0 bg-gradient-to-b ${game.bgGradient} opacity-60 group-hover:opacity-85 transition-opacity`} />

              {/* Top Card Section */}
              <div className="relative p-5 sm:p-6 z-10">
                {/* Badge Tag & Live Players */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-gradient-to-r ${game.badgeColor} shadow-md`}>
                    {game.badge}
                  </span>
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    <span>{game.activePlayersCount} en vivo</span>
                  </span>
                </div>

                {/* Symbols Showcase */}
                <div className="flex items-center justify-center gap-2 py-5 bg-slate-950/50 rounded-2xl border border-white/10 mb-4 group-hover:scale-105 transition-transform">
                  {game.symbols.slice(0, 4).map((sym) => (
                    <span key={sym.id} className="text-3xl sm:text-4xl drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]">
                      {sym.icon}
                    </span>
                  ))}
                </div>

                {/* Game Title */}
                <div className="mb-2">
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight group-hover:text-amber-300 transition-colors">
                    {game.name}
                  </h3>
                  <p className="text-xs font-bold text-amber-400">{game.subtitle}</p>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
                  {game.description}
                </p>

                {/* Feature Tags */}
                {game.features && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {game.features.map((feat, fIdx) => (
                      <span
                        key={`feat-${fIdx}`}
                        className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-950/60 border border-white/10 text-amber-300/90"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                )}

                {/* Progressive Jackpot Counter */}
                <div className="bg-slate-950/90 border border-amber-500/40 rounded-xl p-2.5 flex items-center justify-between font-mono text-xs shadow-inner">
                  <span className="text-[10px] uppercase font-bold text-amber-300/80 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-400" /> Bote Progresivo:
                  </span>
                  <span className="font-black text-amber-300 text-sm">
                    ${game.jackpotSeed.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Bottom Action Footer with RTP & Max Multiplier */}
              <div className="relative p-4 border-t border-white/10 bg-slate-950/70 backdrop-blur-md z-10 flex items-center justify-between">
                <div className="flex flex-col text-[10px] font-mono">
                  <span className="text-emerald-400 font-bold">RTP: {game.rtp}%</span>
                  <span className="text-slate-400">Máx: <strong className="text-white">x{game.maxMultiplier.toLocaleString()}</strong></span>
                </div>

                <button
                  className={`px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
                    isCurrent
                      ? 'bg-amber-400 text-slate-950 hover:bg-yellow-300 shadow-amber-400/30 font-black'
                      : 'bg-white/10 text-white group-hover:bg-amber-500 group-hover:text-slate-950 font-bold'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isCurrent ? 'JUGANDO' : 'ENTRAR'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredGames.length === 0 && (
        <div className="text-center py-16 bg-slate-900/60 rounded-3xl border border-slate-800">
          <p className="text-slate-400 text-sm">No se encontraron salas con los filtros aplicados.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="mt-3 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs uppercase"
          >
            Ver Todas las Salas
          </button>
        </div>
      )}
    </div>
  );
};
