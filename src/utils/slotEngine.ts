import { SymbolDef, SpinOutcome, WinResult } from '../types';
import { PAYLINES } from '../data/games';

export function evaluateSpin(
  grid: SymbolDef[][], // 5 reels x 3 rows
  betPerLine: number,
  activeLinesCount: number = 20
): SpinOutcome {
  const wins: WinResult[] = [];
  let totalWin = 0;
  let scatterCount = 0;
  let bonusCount = 0;

  // 1. Evaluate Paylines
  const activePaylines = PAYLINES.slice(0, activeLinesCount);

  for (const payline of activePaylines) {
    const lineSymbols = payline.positions.map((rowIndex, reelIndex) => grid[reelIndex][rowIndex]);
    
    // Find base symbol (first non-wild)
    const firstNonWild = lineSymbols.find((s) => !s.isWild);
    if (!firstNonWild) continue; // All wilds

    const targetSymbol = firstNonWild;
    let matchCount = 0;
    const matchPositions: { reelIndex: number; rowIndex: number }[] = [];

    for (let i = 0; i < 5; i++) {
      const sym = lineSymbols[i];
      if (sym.id === targetSymbol.id || sym.isWild) {
        matchCount++;
        matchPositions.push({ reelIndex: i, rowIndex: payline.positions[i] });
      } else {
        break; // Consecutive line win required from left to right
      }
    }

    if (matchCount >= 3) {
      let payoutFactor = 0;
      if (matchCount === 3) payoutFactor = targetSymbol.payout3;
      else if (matchCount === 4) payoutFactor = targetSymbol.payout4;
      else if (matchCount === 5) payoutFactor = targetSymbol.payout5;

      const payout = payoutFactor * betPerLine;
      if (payout > 0) {
        totalWin += payout;
        wins.push({
          paylineId: payline.id,
          symbol: targetSymbol,
          count: matchCount,
          payout,
          positions: matchPositions,
        });
      }
    }
  }

  // 2. Count Scatters and Bonuses across entire 5x3 grid
  for (let reel = 0; reel < 5; reel++) {
    for (let row = 0; row < 3; row++) {
      const sym = grid[reel][row];
      if (sym.isScatter) scatterCount++;
      if (sym.isBonus) bonusCount++;
    }
  }

  // Free Spins Trigger (3+ Scatters)
  let freeSpinsTriggered = 0;
  if (scatterCount >= 3) {
    freeSpinsTriggered = scatterCount === 3 ? 10 : scatterCount === 4 ? 15 : 25;
    totalWin += betPerLine * activeLinesCount * scatterCount;
  }

  // Bonus Game Trigger (3+ Bonus symbols)
  const bonusGameTriggered = bonusCount >= 3;
  if (bonusGameTriggered) {
    totalWin += betPerLine * activeLinesCount * 5;
  }

  // Jackpot Trigger: 5 Wilds on Line 1 or 5 High Tier symbols on central payline
  const centerLine = [grid[0][1], grid[1][1], grid[2][1], grid[3][1], grid[4][1]];
  const isJackpot = centerLine.every((s) => s.isWild) || (centerLine.every((s) => s.id === centerLine[0].id) && centerLine[0].payout5 >= 800);

  return {
    reels: grid,
    wins,
    totalWin,
    isJackpot,
    freeSpinsTriggered,
    bonusGameTriggered,
  };
}
