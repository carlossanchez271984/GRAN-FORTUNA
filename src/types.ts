export type GameId =
  | 'frutas_ludas'
  | 'peruano_feliz'
  | 'jungle_jackpot'
  | 'cajamarquino'
  | 'cleopatra'
  | 'olimpo_zeus'
  | 'el_dorado_gold';

export type GameMode = 'virtual' | 'real';

export type Currency = 'USD' | 'PEN' | 'EUR';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  provider: 'gmail' | 'guest';
  isVip: boolean;
  vipTier: 'Bronce' | 'Plata' | 'Oro' | 'Platino' | 'Diamante';
  country: string;
  connectedAt: string;
  claimedWelcomeBonus: boolean;
  totalSpins?: number;
  totalWon?: number;
}

export interface SymbolDef {
  id: string;
  name: string;
  icon: string; // Emoji or Lucide icon indicator
  color: string;
  payout3: number;
  payout4: number;
  payout5: number;
  isWild?: boolean;
  isScatter?: boolean;
  isBonus?: boolean;
  weight: number;
}

export interface Payline {
  id: number;
  name: string;
  positions: number[]; // 5 positions (rows 0, 1, 2 for each reel)
  color: string;
}

export interface GameTheme {
  id: GameId;
  name: string;
  subtitle: string;
  description: string;
  badge: string;
  badgeColor: string;
  bgGradient: string;
  cardBorder: string;
  accentColor: string;
  symbols: SymbolDef[];
  jackpotSeed: number;
  minBet: number;
  volatility: 'Baja' | 'Media' | 'Alta' | 'Extrema';
  popularTag?: string;
  activePlayersCount: number;
  rtp: number; // e.g. 96.85
  maxMultiplier: number; // e.g. 15000
  features: string[]; // e.g. ['Wilds Expansivos', 'Multiplicador 3x', 'Giros Gratis']
  themeCategory: 'mitos' | 'peru' | 'clasicos';
}

export interface WinResult {
  paylineId: number;
  symbol: SymbolDef;
  count: number;
  payout: number;
  positions: { reelIndex: number; rowIndex: number }[];
}

export interface SpinOutcome {
  reels: SymbolDef[][]; // 5 reels x 3 rows
  wins: WinResult[];
  totalWin: number;
  isJackpot: boolean;
  freeSpinsTriggered: number;
  bonusGameTriggered: boolean;
  serverSeed?: string;
  clientSeed?: string;
  nonce?: number;
  hash?: string;
}

export interface LiveWinItem {
  id: string;
  playerName: string;
  playerAvatar: string;
  gameId: GameId;
  gameName: string;
  winAmount: number;
  multiplier: number;
  timestamp: string;
  icon: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  avatar: string;
  text: string;
  time: string;
  isSystem?: boolean;
  winAmount?: number;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  weeklyWins: number;
  biggestWin: number;
  vipTier: 'Bronce' | 'Plata' | 'Oro' | 'Platino' | 'Diamante';
  country: string;
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  prizePool: number;
  endsInSeconds: number;
  userPoints: number;
  userRank: number;
}

export interface WalletTransaction {
  id: string;
  timestamp: string;
  type: 'deposit' | 'withdrawal' | 'spin_win' | 'spin_bet' | 'bonus' | 'tournament_reward';
  amount: number;
  method: string;
  status: 'Completado' | 'Procesando' | 'Pendiente';
  referenceId: string;
}

export interface GameStats {
  totalSpins: number;
  totalBets: number;
  totalWins: number;
  biggestWin: number;
  jackpotsWon: number;
  freeSpinsPlayed: number;
}

export interface HistoryItem {
  id: string;
  gameId: GameId;
  gameName: string;
  timestamp: Date;
  bet: number;
  win: number;
  type: 'normal' | 'big_win' | 'mega_win' | 'jackpot' | 'free_spins' | 'bonus';
  hash?: string;
}
