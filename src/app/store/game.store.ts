import { computed, effect, inject, signal } from '@angular/core';
import { Chess, Square, Move } from 'chess.js';
import {
  BoardOrientation,
  Evaluation,
  GameMove,
  MoveClassification,
} from '../models/chess.models';
import { ChessOpening } from '../models/openings';
import { StockfishService } from '../services/stockfish.service';

export class GameStore {
  private stockfish = inject(StockfishService);
  private chess = new Chess();

  // Core state
  readonly moves = signal<GameMove[]>([]);
  readonly currentMoveIndex = signal(-1);
  readonly orientation = signal<BoardOrientation>('white');
  readonly isAnalyzing = signal(false);
  readonly analysisProgress = signal(0);
  readonly startFen = signal('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');

  // Computed state
  readonly currentFen = computed(() => {
    const idx = this.currentMoveIndex();
    const m = this.moves();
    if (idx < 0 || m.length === 0) return this.startFen();
    return m[idx].fen;
  });

  readonly currentTurn = computed(() => {
    const fen = this.currentFen();
    return fen.split(' ')[1] as 'w' | 'b';
  });

  readonly isAtStart = computed(() => this.currentMoveIndex() < 0);
  readonly isAtEnd = computed(() => this.currentMoveIndex() === this.moves().length - 1);

  readonly currentEvaluation = computed(() => {
    const idx = this.currentMoveIndex();
    const m = this.moves();
    if (idx < 0 || m.length === 0) return null;
    return m[idx].evaluation ?? null;
  });

  // Best move arrow for the current position
  readonly bestMoveArrow = signal<{ from: Square; to: Square } | null>(null);
  private bestMoveAnalysisId = 0;

  constructor() {
    // Re-analyze for best move whenever the viewed position changes
    effect(() => {
      const fen = this.currentFen();
      this.analyzeBestMove(fen);
    });
  }

  private async analyzeBestMove(fen: string): Promise<void> {
    const id = ++this.bestMoveAnalysisId;
    this.bestMoveArrow.set(null);

    if (!this.stockfish.isReady()) return;

    const result = await this.stockfish.analyze(fen, 14);

    // Only apply if this is still the latest request
    if (id !== this.bestMoveAnalysisId) return;

    if (result.bestMove && result.bestMove.length >= 4) {
      const from = result.bestMove.substring(0, 2) as Square;
      const to = result.bestMove.substring(2, 4) as Square;
      this.bestMoveArrow.set({ from, to });
    }
  }

  makeMove(from: Square, to: Square, promotion?: string): boolean {
    // Load the current position
    const fenBefore = this.currentFen();
    this.chess.load(fenBefore);

    try {
      const move = this.chess.move({ from, to, promotion: promotion || 'q' });
      if (!move) return false;

      const gameMove: GameMove = {
        from,
        to,
        san: move.san,
        fen: this.chess.fen(),
      };

      // If we're not at the end, truncate future moves
      const currentIndex = this.currentMoveIndex();
      const currentMoves = this.moves();
      const newMoves = [...currentMoves.slice(0, currentIndex + 1), gameMove];

      this.moves.set(newMoves);
      this.currentMoveIndex.set(newMoves.length - 1);

      // Auto-analyze the new position
      this.autoAnalyzeLastMove(newMoves.length - 1, fenBefore);

      return true;
    } catch {
      return false;
    }
  }

  private async autoAnalyzeLastMove(moveIndex: number, fenBefore: string): Promise<void> {
    if (!this.stockfish.isReady()) return;

    const allMoves = this.moves();
    const move = allMoves[moveIndex];
    if (!move) return;

    // Get eval of position before the move
    const prevResult = await this.stockfish.analyze(fenBefore, 16);
    // Get eval of position after the move
    const result = await this.stockfish.analyze(move.fen, 16);

    const side = moveIndex % 2 === 0 ? 'w' : 'b';
    const classification = this.classifyMove(prevResult.evaluation, result.evaluation, side);

    const updatedMoves = [...this.moves()];
    if (updatedMoves[moveIndex]) {
      updatedMoves[moveIndex] = {
        ...updatedMoves[moveIndex],
        evaluation: result.evaluation,
        classification,
      };
      this.moves.set(updatedMoves);
    }
  }

  goToMove(index: number): void {
    if (index >= -1 && index < this.moves().length) {
      this.currentMoveIndex.set(index);
    }
  }

  goToStart(): void {
    this.currentMoveIndex.set(-1);
  }

  goToEnd(): void {
    this.currentMoveIndex.set(this.moves().length - 1);
  }

  goForward(): void {
    const idx = this.currentMoveIndex();
    if (idx < this.moves().length - 1) {
      this.currentMoveIndex.set(idx + 1);
    }
  }

  goBack(): void {
    const idx = this.currentMoveIndex();
    if (idx >= 0) {
      this.currentMoveIndex.set(idx - 1);
    }
  }

  flipBoard(): void {
    this.orientation.update((o) => (o === 'white' ? 'black' : 'white'));
  }

  loadPgn(pgn: string): boolean {
    const tempChess = new Chess();
    try {
      tempChess.loadPgn(pgn);
    } catch {
      return false;
    }

    const history = tempChess.history({ verbose: true });
    const parsedChess = new Chess();
    const gameMoves: GameMove[] = [];

    for (const move of history) {
      parsedChess.move(move.san);
      gameMoves.push({
        from: move.from,
        to: move.to,
        san: move.san,
        fen: parsedChess.fen(),
      });
    }

    this.moves.set(gameMoves);
    this.currentMoveIndex.set(gameMoves.length - 1);
    return true;
  }

  loadFen(fen: string): boolean {
    try {
      this.chess.load(fen);
      this.startFen.set(fen);
      this.moves.set([]);
      this.currentMoveIndex.set(-1);
      return true;
    } catch {
      return false;
    }
  }

  reset(): void {
    this.chess.reset();
    this.startFen.set('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    this.moves.set([]);
    this.currentMoveIndex.set(-1);
  }

  loadOpening(opening: ChessOpening): boolean {
    this.reset();
    const tempChess = new Chess();

    for (const san of opening.moves) {
      try {
        const move = tempChess.move(san);
        if (!move) return false;
      } catch {
        return false;
      }
    }

    // Replay to build the GameMove array
    const replayChess = new Chess();
    const gameMoves: GameMove[] = [];

    for (const san of opening.moves) {
      const move = replayChess.move(san);
      if (!move) return false;
      gameMoves.push({
        from: move.from,
        to: move.to,
        san: move.san,
        fen: replayChess.fen(),
      });
    }

    this.moves.set(gameMoves);
    this.currentMoveIndex.set(gameMoves.length - 1);
    return true;
  }

  async analyzeAllMoves(): Promise<void> {
    if (!this.stockfish.isReady()) return;
    const allMoves = this.moves();
    if (allMoves.length === 0) return;

    this.isAnalyzing.set(true);
    this.analysisProgress.set(0);

    // Analyze starting position
    const startEval = await this.stockfish.analyze(this.startFen());

    for (let i = 0; i < allMoves.length; i++) {
      const prevEval = i === 0 ? startEval.evaluation : allMoves[i - 1].evaluation;
      const result = await this.stockfish.analyze(allMoves[i].fen);

      const classification = prevEval
        ? this.classifyMove(prevEval, result.evaluation, i % 2 === 0 ? 'w' : 'b')
        : undefined;

      const updatedMoves = [...this.moves()];
      updatedMoves[i] = {
        ...updatedMoves[i],
        evaluation: result.evaluation,
        classification,
      };
      this.moves.set(updatedMoves);
      this.analysisProgress.set(((i + 1) / allMoves.length) * 100);
    }

    this.isAnalyzing.set(false);
  }

  async analyzeCurrentPosition(): Promise<void> {
    if (!this.stockfish.isReady()) return;
    const fen = this.currentFen();
    await this.stockfish.analyze(fen);
  }

  private classifyMove(
    prevEval: Evaluation,
    currEval: Evaluation,
    side: 'w' | 'b'
  ): MoveClassification {
    // Both evals are already normalized to white's perspective by the stockfish service.
    // Convert to the moving side's perspective to calculate loss.
    const sideFlip = side === 'w' ? 1 : -1;
    const prevCp = this.evalToCp(prevEval) * sideFlip;
    const currCp = this.evalToCp(currEval) * sideFlip;
    const loss = prevCp - currCp;

    if (loss <= 0) return 'best';
    if (loss <= 10) return 'excellent';
    if (loss <= 25) return 'good';
    if (loss <= 50) return 'inaccuracy';
    if (loss <= 150) return 'mistake';
    return 'blunder';
  }

  /** Convert eval to centipawns (already in white's perspective). */
  private evalToCp(ev: Evaluation): number {
    if (ev.type === 'mate') {
      const sign = ev.value > 0 ? 1 : -1;
      return sign * (10000 - Math.abs(ev.value));
    }
    return ev.value;
  }
}
