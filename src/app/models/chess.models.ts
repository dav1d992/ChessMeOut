import { Square, Move } from 'chess.js';

export interface GameMove {
  from: Square;
  to: Square;
  san: string;
  fen: string;
  evaluation?: Evaluation;
  classification?: MoveClassification;
}

export interface Evaluation {
  type: 'cp' | 'mate';
  value: number;
  depth: number;
  bestMove?: string;
  pv?: string[];
}

export type MoveClassification =
  | 'brilliant'
  | 'great'
  | 'best'
  | 'excellent'
  | 'good'
  | 'inaccuracy'
  | 'mistake'
  | 'blunder';

export interface AnalysisResult {
  fen: string;
  evaluation: Evaluation;
  bestMove: string;
  pv: string[];
}

export type BoardOrientation = 'white' | 'black';

export const PIECE_UNICODE: Record<string, string> = {
  K: '♚︎', Q: '♛︎', R: '♜︎', B: '♝︎', N: '♞︎', P: '♟︎',
  k: '♚︎', q: '♛︎', r: '♜︎', b: '♝︎', n: '♞︎', p: '♟︎',
};

export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
export const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'] as const;
