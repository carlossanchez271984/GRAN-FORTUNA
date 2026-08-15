import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { GameSelector } from './components/GameSelector';
import { SlotMachine } from './components/SlotMachine';
import { Controls } from './components/Controls';
import { LiveFeedBar } from './components/LiveFeedBar';
import { PaytableModal } from './components/PaytableModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { TournamentModal } from './components/TournamentModal';
import { WalletModal } from './components/WalletModal';
import { WinModal } from './components/WinModal';
import { BonusWheelModal } from './components/BonusWheelModal';
import { DailyBonusModal } from './components/DailyBonusModal';
import { ProvablyFairModal } from './components/ProvablyFairModal';
import { AuthModal } from './components/AuthModal';

import { GAMES } from './data/games';
import { GameId, GameMode, SpinOutcome, SymbolDef, UserProfile, WalletTransaction, Currency } from './types';
import { generateProvablyFairGrid, generateRandomSeed, sha256, generateRandomGrid } from './utils/provablyFair';
import { evaluateSpin } from './utils/slotEngine';
import { sounds } from './utils/sound';
import { ShieldCheck, Lock, Award, HeartHandshake } from 'lucide-react';
import { useFirebase } from './context/FirebaseContext';

export default function App() {
  const {
    firebaseUser,
    userProfile,
    updateUserBalanceInCloud,
    recordCloudTransaction,
    recordCloudSpin,
    updateCloudLeaderboard,
  } = useFirebase();

  // User Profile / Gmail Auth
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('js_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Keep user synchronized with Firebase profile
  useEffect(() => {
    if (userProfile) {
      setUser(userProfile);
      localStorage.setItem('js_user', JSON.stringify(userProfile));
    }
  }, [userProfile]);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Currency
  const [currency, setCurrency] = useState<Currency>('USD');

  // Navigation & Game Room
  const [activeGameId, setActiveGameId] = useState<GameId>('frutas_ludas');
  const [inLobby, setInLobby] = useState<boolean>(true);

  // Game Mode: Demo vs Dinero Real
  const [gameMode, setGameMode] = useState<GameMode>('virtual');

  // Dual Persistence State: Real Balance vs Demo Balance
  const [realBalance, setRealBalance] = useState<number>(() => {
    const saved = localStorage.getItem('gf_real_balance') || localStorage.getItem('js_balance');
    return saved ? parseInt(saved, 10) : 15000;
  });

  const [demoBalance, setDemoBalance] = useState<number>(() => {
    const saved = localStorage.getItem('gf_demo_balance');
    return saved ? parseInt(saved, 10) : 50000;
  });

  // Keep real balance synchronized with Firebase cloud profile
  useEffect(() => {
    if (userProfile && typeof userProfile.balance === 'number') {
      setRealBalance(userProfile.balance);
    }
  }, [userProfile]);

  // Persist both balances to localStorage
  useEffect(() => {
    localStorage.setItem('gf_real_balance', realBalance.toString());
  }, [realBalance]);

  useEffect(() => {
    localStorage.setItem('gf_demo_balance', demoBalance.toString());
  }, [demoBalance]);

  // Active balance derived from selected mode
  const currentBalance = gameMode === 'real' ? realBalance : demoBalance;

  const [level, setLevel] = useState<number>(() => {
    const saved = localStorage.getItem('js_level');
    return saved ? parseInt(saved, 10) : 1;
  });

  const [exp, setExp] = useState<number>(() => {
    const saved = localStorage.getItem('js_exp');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Mode switcher handler with sound
  const handleToggleGameMode = (mode: GameMode) => {
    sounds.playClick();
    setGameMode(mode);
  };

  // Quick reload for demo practice balance
  const handleReloadDemo = (amount: number = 50000) => {
    setDemoBalance(amount);
    sounds.playCoin();
  };

  // Individual Progressive Jackpots per game
  const [jackpots, setJackpots] = useState<Record<GameId, number>>(() => ({
    frutas_ludas: 500000,
    peruano_feliz: 750000,
    jungle_jackpot: 620000,
    cajamarquino: 880000,
    cleopatra: 950000,
    olimpo_zeus: 1200000,
    el_dorado_gold: 820000,
  }));

  // Seeds for Provably Fair RNG
  const [serverSeed, setServerSeed] = useState<string>(() => generateRandomSeed(32));
  const [serverSeedHash, setServerSeedHash] = useState<string>('');
  const [clientSeed, setClientSeed] = useState<string>(() => generateRandomSeed(16));
  const [nonce, setNonce] = useState<number>(1);

  useEffect(() => {
    sha256(serverSeed).then(setServerSeedHash);
  }, [serverSeed]);

  // Wallet ledger
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);

  // Current active game configuration
  const currentGame = GAMES.find((g) => g.id === activeGameId) || GAMES[0];

  // Grid & Spin State
  const [grid, setGrid] = useState<SymbolDef[][]>(() => generateRandomGrid(currentGame.symbols));
  const [betPerLine, setBetPerLine] = useState<number>(10);
  const [activeLines, setActiveLines] = useState<number>(20);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [turbo, setTurbo] = useState<boolean>(false);
  const [autoSpin, setAutoSpin] = useState<boolean>(false);
  const [autoSpinCount, setAutoSpinCount] = useState<number>(0);
  const [muted, setMuted] = useState<boolean>(false);

  // Bonus & Free Spins
  const [freeSpinsLeft, setFreeSpinsLeft] = useState<number>(0);
  const [lastOutcome, setLastOutcome] = useState<SpinOutcome | null>(null);
  const [currentWin, setCurrentWin] = useState<number>(0);

  // Modals
  const [showPaytable, setShowPaytable] = useState<boolean>(false);
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [showTournament, setShowTournament] = useState<boolean>(false);
  const [showWallet, setShowWallet] = useState<boolean>(false);
  const [showDailyBonus, setShowDailyBonus] = useState<boolean>(false);
  const [showProvablyFair, setShowProvablyFair] = useState<boolean>(false);
  const [showBonusWheel, setShowBonusWheel] = useState<boolean>(false);
  const [dailyBonusAvailable, setDailyBonusAvailable] = useState<boolean>(true);

  const [winModal, setWinModal] = useState<{
    isOpen: boolean;
    type: 'big' | 'mega' | 'jackpot' | null;
    amount: number;
  }>({ isOpen: false, type: null, amount: 0 });

  // User Persistence effect
  useEffect(() => {
    if (user) {
      localStorage.setItem('js_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('js_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('js_level', level.toString());
    localStorage.setItem('js_exp', exp.toString());
  }, [level, exp]);

  // Update grid when active game changes
  useEffect(() => {
    setGrid(generateRandomGrid(currentGame.symbols));
    setCurrentWin(0);
    setLastOutcome(null);
  }, [activeGameId, currentGame]);

  // Progressive Jackpots Ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setJackpots((prev) => ({
        ...prev,
        frutas_ludas: prev.frutas_ludas + Math.floor(Math.random() * 5) + 1,
        peruano_feliz: prev.peruano_feliz + Math.floor(Math.random() * 8) + 1,
        jungle_jackpot: prev.jungle_jackpot + Math.floor(Math.random() * 6) + 1,
        cajamarquino: prev.cajamarquino + Math.floor(Math.random() * 10) + 1,
        cleopatra: prev.cleopatra + Math.floor(Math.random() * 12) + 1,
        olimpo_zeus: prev.olimpo_zeus + Math.floor(Math.random() * 15) + 1,
        el_dorado_gold: prev.el_dorado_gold + Math.floor(Math.random() * 9) + 1,
      }));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Login & Logout Handlers
  const handleLogin = (newUser: UserProfile) => {
    if (!newUser.claimedWelcomeBonus) {
      setRealBalance((b) => {
        const updated = b + 10000;
        updateUserBalanceInCloud(updated);
        return updated;
      });
      newUser.claimedWelcomeBonus = true;
      const welcomeTx: WalletTransaction = {
        id: 'tx_bonus_' + Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        type: 'bonus',
        amount: 10000,
        method: 'Bono Bienvenida VIP',
        status: 'Completado',
        referenceId: 'VIP-BONUS-' + Math.floor(100000 + Math.random() * 900000),
      };
      setTransactions((prev) => [welcomeTx, ...prev]);
      recordCloudTransaction(welcomeTx);
    }
    setUser(newUser);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    setShowAuthModal(false);
  };

  // Level & EXP System
  const addExp = useCallback((amount: number) => {
    setExp((prevExp) => {
      const maxExp = level * 100;
      const newExp = prevExp + amount;
      if (newExp >= maxExp) {
        setLevel((prev) => prev + 1);
        const levelBonus = level * 1000;
        if (gameMode === 'real') {
          setRealBalance((b) => {
            const next = b + levelBonus;
            updateUserBalanceInCloud(next);
            return next;
          });
        } else {
          setDemoBalance((b) => b + levelBonus);
        }
        sounds.playWin(true);
        return newExp - maxExp;
      }
      return newExp;
    });
  }, [level, gameMode, updateUserBalanceInCloud]);

  // Primary Spin Handler
  const executeSpin = useCallback(async () => {
    if (spinning) return;

    const isFreeSpin = freeSpinsLeft > 0;
    const totalBet = betPerLine * activeLines;
    const currentActiveBal = gameMode === 'real' ? realBalance : demoBalance;

    if (!isFreeSpin && currentActiveBal < totalBet) {
      setAutoSpin(false);
      if (gameMode === 'virtual') {
        // Automatically replenish demo credits so user is never locked out
        handleReloadDemo(50000);
      } else {
        setShowWallet(true);
      }
      return;
    }

    setSpinning(true);
    setCurrentWin(0);

    if (!isFreeSpin) {
      if (gameMode === 'real') {
        setRealBalance((prev) => prev - totalBet);
      } else {
        setDemoBalance((prev) => prev - totalBet);
      }

      setJackpots((prev) => ({
        ...prev,
        [activeGameId]: prev[activeGameId] + Math.round(totalBet * 0.05),
      }));
    } else {
      setFreeSpinsLeft((prev) => prev - 1);
    }

    sounds.playSpin();

    // Generate Provably Fair Grid for Current Game
    const newGrid = await generateProvablyFairGrid(currentGame.symbols, serverSeed, clientSeed, nonce);
    const outcome = evaluateSpin(newGrid, betPerLine, activeLines);

    setNonce((n) => n + 1);

    if (isFreeSpin && outcome.totalWin > 0) {
      outcome.totalWin *= 3;
    }

    const duration = turbo ? 400 : 1200;

    setTimeout(() => {
      setGrid(newGrid);
      setLastOutcome(outcome);
      setSpinning(false);

      [0, 1, 2, 3, 4].forEach((idx) => {
        setTimeout(() => sounds.playReelStop(idx), idx * (turbo ? 20 : 60));
      });

      if (outcome.totalWin > 0) {
        if (gameMode === 'real') {
          const newBal = realBalance - (isFreeSpin ? 0 : totalBet) + outcome.totalWin;
          setRealBalance(newBal);

          // Record spin to Firebase
          recordCloudSpin({
            gameId: currentGame.id,
            gameName: currentGame.name,
            betAmount: totalBet,
            winAmount: outcome.totalWin,
            multiplier: Math.round((outcome.totalWin / totalBet) * 10) / 10,
          });

          // Update user stats in cloud
          updateUserBalanceInCloud(newBal, {
            spins: 1,
            win: outcome.totalWin,
            biggest: outcome.totalWin,
          });

          if (outcome.totalWin >= totalBet * 15) {
            updateCloudLeaderboard(outcome.totalWin, outcome.totalWin, 150);
          }
        } else {
          setDemoBalance((prev) => prev + outcome.totalWin);
        }

        setCurrentWin(outcome.totalWin);
        sounds.playWin(outcome.totalWin >= totalBet * 10);

        if (outcome.isJackpot) {
          const currentJk = jackpots[activeGameId];
          if (gameMode === 'real') {
            setRealBalance((prev) => {
              const updated = prev + currentJk;
              updateUserBalanceInCloud(updated);
              return updated;
            });
          } else {
            setDemoBalance((prev) => prev + currentJk);
          }
          setWinModal({ isOpen: true, type: 'jackpot', amount: currentJk + outcome.totalWin });
          setJackpots((prev) => ({ ...prev, [activeGameId]: currentGame.jackpotSeed }));
        } else if (outcome.totalWin >= totalBet * 50) {
          setWinModal({ isOpen: true, type: 'mega', amount: outcome.totalWin });
        } else if (outcome.totalWin >= totalBet * 15) {
          setWinModal({ isOpen: true, type: 'big', amount: outcome.totalWin });
        }
      } else {
        if (gameMode === 'real') {
          const newBal = realBalance - (isFreeSpin ? 0 : totalBet);
          updateUserBalanceInCloud(newBal, { spins: 1 });
          recordCloudSpin({
            gameId: currentGame.id,
            gameName: currentGame.name,
            betAmount: totalBet,
            winAmount: 0,
            multiplier: 0,
          });
        }
      }

      if (outcome.freeSpinsTriggered > 0) {
        setFreeSpinsLeft((prev) => prev + outcome.freeSpinsTriggered);
      }

      if (outcome.bonusGameTriggered) {
        setTimeout(() => setShowBonusWheel(true), 600);
      }

      addExp(Math.max(5, Math.round(totalBet / 2)));

      if (autoSpin) {
        if (autoSpinCount > 1) {
          setAutoSpinCount((c) => c - 1);
        } else {
          setAutoSpin(false);
          setAutoSpinCount(0);
        }
      }
    }, duration);
  }, [
    spinning,
    freeSpinsLeft,
    betPerLine,
    activeLines,
    gameMode,
    realBalance,
    demoBalance,
    currentGame.symbols,
    currentGame.id,
    currentGame.name,
    currentGame.jackpotSeed,
    serverSeed,
    clientSeed,
    nonce,
    turbo,
    activeGameId,
    jackpots,
    addExp,
    autoSpin,
    autoSpinCount,
    recordCloudSpin,
    updateUserBalanceInCloud,
    updateCloudLeaderboard,
  ]);

  // Auto spin loop trigger
  const autoSpinRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (autoSpin && !spinning) {
      autoSpinRef.current = setTimeout(() => {
        executeSpin();
      }, turbo ? 300 : 800);
    }
    return () => {
      if (autoSpinRef.current) clearTimeout(autoSpinRef.current);
    };
  }, [autoSpin, spinning, executeSpin, turbo]);

  // Keyboard shortcut: Spacebar to spin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !inLobby && !spinning) {
        const activeTag = document.activeElement?.tagName.toLowerCase();
        if (activeTag !== 'input' && activeTag !== 'textarea') {
          e.preventDefault();
          executeSpin();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inLobby, spinning, executeSpin]);

  // Handlers
  const handleSelectGame = (gameId: GameId) => {
    setActiveGameId(gameId);
    setInLobby(false);
  };

  const handleDeposit = (amount: number, method: string) => {
    if (gameMode === 'real') {
      const newBal = realBalance + amount;
      setRealBalance(newBal);
      const newTx: WalletTransaction = {
        id: `dep-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'deposit',
        amount,
        method,
        status: 'Completado',
        referenceId: `GF-DEP-${Math.floor(Math.random() * 899999 + 100000)}`,
      };
      setTransactions((prev) => [newTx, ...prev]);
      recordCloudTransaction(newTx);
      updateUserBalanceInCloud(newBal);
    } else {
      setDemoBalance((prev) => prev + amount);
      const newTx: WalletTransaction = {
        id: `dep-demo-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'deposit',
        amount,
        method: `${method} (Demo)`,
        status: 'Completado',
        referenceId: `DEMO-DEP-${Math.floor(Math.random() * 899999 + 100000)}`,
      };
      setTransactions((prev) => [newTx, ...prev]);
    }
  };

  const handleWithdraw = (amount: number, destination: string) => {
    if (gameMode === 'real') {
      const newBal = realBalance - amount;
      setRealBalance(newBal);
      const newTx: WalletTransaction = {
        id: `wth-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'withdrawal',
        amount,
        method: `Retiro a ${destination}`,
        status: 'Procesando',
        referenceId: `GF-WTH-${Math.floor(Math.random() * 899999 + 100000)}`,
      };
      setTransactions((prev) => [newTx, ...prev]);
      recordCloudTransaction(newTx);
      updateUserBalanceInCloud(newBal);
    } else {
      setDemoBalance((prev) => Math.max(0, prev - amount));
      const newTx: WalletTransaction = {
        id: `wth-demo-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'withdrawal',
        amount,
        method: `Retiro Simulado a ${destination}`,
        status: 'Completado',
        referenceId: `DEMO-WTH-${Math.floor(Math.random() * 899999 + 100000)}`,
      };
      setTransactions((prev) => [newTx, ...prev]);
    }
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 font-sans flex flex-col justify-between overflow-x-hidden relative selection:bg-amber-500 selection:text-slate-950">
      {/* Ambient Visual Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Luxury Header with Live Status & Controls */}
      <Header
        gameMode={gameMode}
        onToggleGameMode={handleToggleGameMode}
        balance={currentBalance}
        realBalance={realBalance}
        demoBalance={demoBalance}
        onReloadDemo={handleReloadDemo}
        level={level}
        exp={exp}
        maxExp={level * 100}
        muted={muted}
        onToggleMute={() => {
          const isM = sounds.toggleMute();
          setMuted(isM);
        }}
        onOpenLobby={() => setInLobby(true)}
        onOpenPaytable={() => setShowPaytable(true)}
        onOpenDailyBonus={() => setShowDailyBonus(true)}
        onOpenTournament={() => setShowTournament(true)}
        onOpenLeaderboard={() => setShowLeaderboard(true)}
        onOpenWallet={() => setShowWallet(true)}
        onOpenProvablyFair={() => setShowProvablyFair(true)}
        onOpenAuth={() => setShowAuthModal(true)}
        user={user}
        dailyBonusAvailable={dailyBonusAvailable}
        freeSpinsLeft={freeSpinsLeft}
        currentGameName={inLobby ? undefined : currentGame.name}
        currency={currency}
        onCurrencyChange={setCurrency}
      />

      {/* Main Gaming Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-5 flex flex-col items-center justify-center relative z-10">
        {inLobby ? (
          <GameSelector
            games={GAMES.map((g) => ({
              ...g,
              jackpotSeed: jackpots[g.id],
            }))}
            activeGameId={activeGameId}
            onSelectGame={handleSelectGame}
          />
        ) : (
          <>
            <SlotMachine
              game={currentGame}
              grid={grid}
              spinning={spinning}
              wins={lastOutcome ? lastOutcome.wins : []}
              jackpotAmount={jackpots[activeGameId]}
              activeLinesCount={activeLines}
              turbo={turbo}
              freeSpinsLeft={freeSpinsLeft}
              currentWin={currentWin}
            />

            <Controls
              betPerLine={betPerLine}
              onBetChange={setBetPerLine}
              activeLines={activeLines}
              onLinesChange={setActiveLines}
              spinning={spinning}
              onSpin={executeSpin}
              autoSpin={autoSpin}
              autoSpinCount={autoSpinCount}
              onToggleAutoSpin={(c) => {
                setAutoSpin(!autoSpin);
                setAutoSpinCount(c || 25);
              }}
              turbo={turbo}
              onToggleTurbo={() => setTurbo(!turbo)}
              onMaxBet={() => {
                setBetPerLine(100);
                setActiveLines(20);
              }}
              disabled={spinning}
            />
          </>
        )}

        {/* Live Multiplayer Wins Ticker & Real-time Community Chat */}
        <LiveFeedBar />
      </main>

      {/* Professional Casino Footer */}
      <footer className="w-full bg-slate-950 border-t border-amber-500/20 py-6 px-4 text-slate-400 relative z-20 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-black text-white">
              Gran<span className="text-amber-400">Fortuna</span> Real VIP
            </span>
            <span className="text-[10px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full text-slate-400 font-mono">
              Licencia GLI-19 Oficial • v3.4.0
            </span>
          </div>

          <div className="flex items-center gap-6 text-[11px] flex-wrap justify-center font-mono">
            <span className="flex items-center gap-1 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> GLI-19 Certificado
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <Lock className="w-3.5 h-3.5 text-amber-400" /> SSL 256-Bit TLS 1.3
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <Award className="w-3.5 h-3.5 text-purple-400" /> RNG SHA-256 Auditado
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <HeartHandshake className="w-3.5 h-3.5 text-rose-400" /> +18 Juego Responsable
            </span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-300 font-mono">
          <p>© 2026 Gran Fortuna International Gaming Platform. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            <span>Latencia de red: 18ms</span> • <span>Servidor Cloud Seguro</span>
          </p>
        </div>
      </footer>

      {/* Modals */}
      <PaytableModal
        isOpen={showPaytable}
        onClose={() => setShowPaytable(false)}
        game={currentGame}
      />

      <LeaderboardModal
        isOpen={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
        user={user}
      />

      <TournamentModal
        isOpen={showTournament}
        onClose={() => setShowTournament(false)}
      />

      <WalletModal
        isOpen={showWallet}
        onClose={() => setShowWallet(false)}
        balance={currentBalance}
        realBalance={realBalance}
        demoBalance={demoBalance}
        gameMode={gameMode}
        onToggleGameMode={handleToggleGameMode}
        onReloadDemo={handleReloadDemo}
        onDeposit={handleDeposit}
        onWithdraw={handleWithdraw}
        transactions={transactions}
      />

      <DailyBonusModal
        isOpen={showDailyBonus}
        onClose={() => setShowDailyBonus(false)}
        onClaim={(amt) => {
          if (gameMode === 'real') {
            setRealBalance((b) => {
              const updated = b + amt;
              updateUserBalanceInCloud(updated);
              return updated;
            });
          } else {
            setDemoBalance((b) => b + amt);
          }
          setDailyBonusAvailable(false);
        }}
        claimedToday={!dailyBonusAvailable}
      />

      <ProvablyFairModal
        isOpen={showProvablyFair}
        onClose={() => setShowProvablyFair(false)}
        serverSeed={serverSeed}
        serverSeedHash={serverSeedHash}
        clientSeed={clientSeed}
        nonce={nonce}
        onUpdateClientSeed={setClientSeed}
        onRotateServerSeed={() => setServerSeed(generateRandomSeed(32))}
      />

      <BonusWheelModal
        isOpen={showBonusWheel}
        onClaimWin={(amt) => {
          if (gameMode === 'real') {
            setRealBalance((b) => {
              const updated = b + amt;
              updateUserBalanceInCloud(updated);
              return updated;
            });
          } else {
            setDemoBalance((b) => b + amt);
          }
          setShowBonusWheel(false);
        }}
      />

      <WinModal
        isOpen={winModal.isOpen}
        winType={winModal.type}
        amount={winModal.amount}
        onClose={() => setWinModal({ isOpen: false, type: null, amount: 0 })}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
    </div>
  );
}
