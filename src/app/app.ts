import { Component, inject, signal } from '@angular/core';
import { ChessBoardComponent } from './components/chess-board/chess-board.component';
import { MoveListComponent } from './components/move-list/move-list.component';
import { EvalBarComponent } from './components/eval-bar/eval-bar.component';
import { GameStore } from './store/game.store';
import { StockfishService } from './services/stockfish.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ChessBoardComponent, MoveListComponent, EvalBarComponent, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  providers: [GameStore],
})
export class App {
  readonly store = inject(GameStore);
  readonly stockfish = inject(StockfishService);

  readonly pgnInput = signal('');
  readonly fenInput = signal('');
  readonly showPgnDialog = signal(false);
  readonly showFenDialog = signal(false);
  readonly darkMode = signal(true);

  toggleTheme(): void {
    this.darkMode.update((v) => !v);
  }

  async analyzeGame(): Promise<void> {
    await this.store.analyzeAllMoves();
  }

  loadPgn(): void {
    const pgn = this.pgnInput();
    if (pgn.trim()) {
      const success = this.store.loadPgn(pgn);
      if (success) {
        this.showPgnDialog.set(false);
        this.pgnInput.set('');
      }
    }
  }

  loadFen(): void {
    const fen = this.fenInput();
    if (fen.trim()) {
      const success = this.store.loadFen(fen);
      if (success) {
        this.showFenDialog.set(false);
        this.fenInput.set('');
      }
    }
  }

  newGame(): void {
    this.store.reset();
  }

  flipBoard(): void {
    this.store.flipBoard();
  }
}
