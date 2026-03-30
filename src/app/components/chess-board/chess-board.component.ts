import {
  Component,
  computed,
  inject,
  signal,
  OnInit,
  OnDestroy,
  HostListener,
  effect,
} from '@angular/core';
import { Chess, Square, Piece } from 'chess.js';
import { GameStore } from '../../store/game.store';
import { FILES, RANKS, PIECE_UNICODE, BoardOrientation } from '../../models/chess.models';

interface SquareData {
  file: string;
  rank: string;
  square: Square;
  piece: Piece | null;
  isLight: boolean;
  isSelected: boolean;
  isLegalTarget: boolean;
  isLastMoveFrom: boolean;
  isLastMoveTo: boolean;
}

interface MoveAnimation {
  piece: string;
  color: 'w' | 'b';
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  active: boolean;
}

@Component({
  selector: 'app-chess-board',
  standalone: true,
  templateUrl: './chess-board.component.html',
  styleUrl: './chess-board.component.scss',
})
export class ChessBoardComponent {
  readonly store = inject(GameStore);

  readonly selectedSquare = signal<Square | null>(null);
  readonly legalMoves = signal<Square[]>([]);
  readonly dragPiece = signal<{ piece: Piece; x: number; y: number } | null>(null);
  readonly dragFrom = signal<Square | null>(null);
  readonly showPromotion = signal<{ from: Square; to: Square } | null>(null);
  readonly moveAnimation = signal<MoveAnimation | null>(null);
  readonly animatingTo = signal<Square | null>(null);

  readonly PIECE_UNICODE = PIECE_UNICODE;

  readonly boardSquares = computed(() => {
    const fen = this.store.currentFen();
    const orientation = this.store.orientation();
    const selected = this.selectedSquare();
    const targets = this.legalMoves();
    const moves = this.store.moves();
    const moveIdx = this.store.currentMoveIndex();

    const chess = new Chess(fen);
    const board = chess.board();

    const lastMove = moveIdx >= 0 ? moves[moveIdx] : null;

    const files = orientation === 'white' ? FILES : [...FILES].reverse();
    const ranks = orientation === 'white' ? RANKS : [...RANKS].reverse();

    const squares: SquareData[] = [];
    for (const rank of ranks) {
      for (const file of files) {
        const sq = (file + rank) as Square;
        const fileIdx = FILES.indexOf(file as (typeof FILES)[number]);
        const rankIdx = RANKS.indexOf(rank as (typeof RANKS)[number]);
        const piece = board[rankIdx][fileIdx];

        squares.push({
          file,
          rank,
          square: sq,
          piece,
          isLight: (fileIdx + rankIdx) % 2 === 0,
          isSelected: selected === sq,
          isLegalTarget: targets.includes(sq),
          isLastMoveFrom: lastMove?.from === sq,
          isLastMoveTo: lastMove?.to === sq,
        });
      }
    }
    return squares;
  });

  readonly fileLabels = computed(() => {
    return this.store.orientation() === 'white' ? [...FILES] : [...FILES].reverse();
  });

  readonly rankLabels = computed(() => {
    return this.store.orientation() === 'white' ? [...RANKS] : [...RANKS].reverse();
  });

  readonly arrowCoords = computed(() => {
    const arrow = this.store.bestMoveArrow();
    if (!arrow) return null;

    const orientation = this.store.orientation();
    const fromCoord = this.squareToCoord(arrow.from, orientation);
    const toCoord = this.squareToCoord(arrow.to, orientation);
    return { x1: fromCoord.x, y1: fromCoord.y, x2: toCoord.x, y2: toCoord.y };
  });

  private squareToCoord(sq: Square, orientation: string): { x: number; y: number } {
    const fileIdx = sq.charCodeAt(0) - 97; // 'a' = 0
    const rankIdx = parseInt(sq[1], 10) - 1; // '1' = 0

    const x = orientation === 'white' ? fileIdx : 7 - fileIdx;
    const y = orientation === 'white' ? 7 - rankIdx : rankIdx;

    return { x: x * 12.5 + 6.25, y: y * 12.5 + 6.25 }; // percentages, center of square
  }

  getPieceUnicode(piece: Piece): string {
    const key = piece.color === 'w' ? piece.type.toUpperCase() : piece.type.toLowerCase();
    return PIECE_UNICODE[key] || '';
  }

  onSquareClick(sq: SquareData): void {
    if (this.showPromotion()) return;

    const selected = this.selectedSquare();

    if (selected) {
      if (this.legalMoves().includes(sq.square)) {
        this.tryMove(selected, sq.square);
      } else if (sq.piece && this.isCurrentTurnPiece(sq.piece)) {
        this.selectSquare(sq.square);
      } else {
        this.clearSelection();
      }
    } else if (sq.piece && this.isCurrentTurnPiece(sq.piece)) {
      this.selectSquare(sq.square);
    }
  }

  onDragStart(event: DragEvent, sq: SquareData): void {
    if (!sq.piece || !this.isCurrentTurnPiece(sq.piece)) {
      event.preventDefault();
      return;
    }

    this.dragFrom.set(sq.square);
    this.selectSquare(sq.square);

    // Set drag image to a transparent pixel so we can render our own
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    event.dataTransfer?.setDragImage(img, 0, 0);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent, sq: SquareData): void {
    event.preventDefault();
    const from = this.dragFrom();
    if (from && this.legalMoves().includes(sq.square)) {
      this.tryMove(from, sq.square);
    }
    this.dragFrom.set(null);
  }

  onDragEnd(): void {
    this.dragFrom.set(null);
  }

  private tryMove(from: Square, to: Square): void {
    // Check for promotion
    const chess = new Chess(this.store.currentFen());
    const piece = chess.get(from);
    if (
      piece?.type === 'p' &&
      ((piece.color === 'w' && to[1] === '8') || (piece.color === 'b' && to[1] === '1'))
    ) {
      this.showPromotion.set({ from, to });
      return;
    }

    if (piece) {
      this.animateMove(from, to, piece);
    }
    this.store.makeMove(from, to);
    this.clearSelection();
  }

  promote(piece: string): void {
    const promo = this.showPromotion();
    if (promo) {
      this.store.makeMove(promo.from, promo.to, piece);
      this.showPromotion.set(null);
      this.clearSelection();
    }
  }

  cancelPromotion(): void {
    this.showPromotion.set(null);
    this.clearSelection();
  }

  private selectSquare(sq: Square): void {
    this.selectedSquare.set(sq);
    const chess = new Chess(this.store.currentFen());
    const moves = chess.moves({ square: sq, verbose: true });
    this.legalMoves.set(moves.map((m) => m.to as Square));
  }

  private clearSelection(): void {
    this.selectedSquare.set(null);
    this.legalMoves.set([]);
  }

  private animateMove(from: Square, to: Square, piece: Piece): void {
    const orientation = this.store.orientation();
    const fromPos = this.squareToGridPos(from, orientation);
    const toPos = this.squareToGridPos(to, orientation);
    const key = piece.color === 'w' ? piece.type.toUpperCase() : piece.type.toLowerCase();

    this.animatingTo.set(to);
    this.moveAnimation.set({
      piece: PIECE_UNICODE[key] || '',
      color: piece.color,
      fromX: fromPos.x,
      fromY: fromPos.y,
      toX: toPos.x,
      toY: toPos.y,
      active: false,
    });

    // Trigger the animation on the next frame
    requestAnimationFrame(() => {
      const anim = this.moveAnimation();
      if (anim) {
        this.moveAnimation.set({ ...anim, active: true });
      }
      // Clear after animation completes
      setTimeout(() => {
        this.moveAnimation.set(null);
        this.animatingTo.set(null);
      }, 200);
    });
  }

  private squareToGridPos(sq: Square, orientation: string): { x: number; y: number } {
    const fileIdx = sq.charCodeAt(0) - 97;
    const rankIdx = parseInt(sq[1], 10) - 1;
    const x = orientation === 'white' ? fileIdx : 7 - fileIdx;
    const y = orientation === 'white' ? 7 - rankIdx : rankIdx;
    return { x, y };
  }

  private isCurrentTurnPiece(piece: Piece): boolean {
    const turn = this.store.currentTurn();
    return piece.color === turn;
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.store.goBack();
      this.clearSelection();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.store.goForward();
      this.clearSelection();
    } else if (event.key === 'Home') {
      event.preventDefault();
      this.store.goToStart();
      this.clearSelection();
    } else if (event.key === 'End') {
      event.preventDefault();
      this.store.goToEnd();
      this.clearSelection();
    }
  }
}
