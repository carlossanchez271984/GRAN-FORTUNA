import { SymbolDef } from '../types';

export function generateRandomSeed(length: number = 32): string {
  const chars = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function generateProvablyFairSymbol(
  symbols: SymbolDef[],
  serverSeed: string,
  clientSeed: string,
  nonce: number,
  reelIndex: number,
  rowIndex: number
): Promise<SymbolDef> {
  const combinedStr = `${serverSeed}:${clientSeed}:${nonce}:${reelIndex}:${rowIndex}`;
  const hash = await sha256(combinedStr);

  const subHash = hash.substring(0, 8);
  const intVal = parseInt(subHash, 16);
  const maxInt = 0xffffffff;
  const floatVal = intVal / maxInt;

  const totalWeight = symbols.reduce((sum, s) => sum + s.weight, 0);
  let target = floatVal * totalWeight;

  for (const sym of symbols) {
    if (target < sym.weight) {
      return sym;
    }
    target -= sym.weight;
  }

  return symbols[symbols.length - 1];
}

export async function generateProvablyFairGrid(
  symbols: SymbolDef[],
  serverSeed: string,
  clientSeed: string,
  nonce: number
): Promise<SymbolDef[][]> {
  const grid: SymbolDef[][] = [];

  for (let reel = 0; reel < 5; reel++) {
    const reelSymbols: SymbolDef[] = [];
    for (let row = 0; row < 3; row++) {
      const sym = await generateProvablyFairSymbol(symbols, serverSeed, clientSeed, nonce, reel, row);
      reelSymbols.push(sym);
    }
    grid.push(reelSymbols);
  }

  return grid;
}

export function generateRandomGrid(symbols: SymbolDef[]): SymbolDef[][] {
  const grid: SymbolDef[][] = [];
  const totalWeight = symbols.reduce((sum, s) => sum + s.weight, 0);

  for (let reel = 0; reel < 5; reel++) {
    const reelSymbols: SymbolDef[] = [];
    for (let row = 0; row < 3; row++) {
      let rand = Math.random() * totalWeight;
      let chosen = symbols[0];
      for (const sym of symbols) {
        if (rand < sym.weight) {
          chosen = sym;
          break;
        }
        rand -= sym.weight;
      }
      reelSymbols.push(chosen);
    }
    grid.push(reelSymbols);
  }
  return grid;
}
