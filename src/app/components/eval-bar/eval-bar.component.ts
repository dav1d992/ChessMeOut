import { Component, computed, inject } from '@angular/core';
import { Chess } from 'chess.js';
import { GameStore } from '../../store/game.store';
import { StockfishService } from '../../services/stockfish.service';

@Component({
  selector: 'app-eval-bar',
  standalone: true,
  templateUrl: './eval-bar.component.html',
  styleUrl: './eval-bar.component.scss',
})
export class EvalBarComponent {
  readonly store = inject(GameStore);
  readonly stockfish = inject(StockfishService);

  readonly evalDisplay = computed(() => {
    // Check for checkmate on the board
    const fen = this.store.currentFen();
    try {
      const chess = new Chess(fen);
      if (chess.isCheckmate()) {
        // Side to move is the loser, so the winner is the other side
        const loser = fen.split(' ')[1];
        const whiteWon = loser === 'b';
        return {
          text: whiteWon ? '1-0' : '0-1',
          whitePercent: whiteWon ? 100 : 0,
        };
      }
    } catch {}

    const ev = this.store.currentEvaluation() ?? this.stockfish.liveEval();
    if (!ev) return { text: '0.0', whitePercent: 50 };

    if (ev.type === 'mate') {
      if (ev.value === 0) {
        // Mate on the board — shouldn't reach here if above check works, but fallback
        return { text: '0-1', whitePercent: 0 };
      }
      const sign = ev.value > 0 ? '+' : '';
      return {
        text: `M${sign}${ev.value}`,
        whitePercent: ev.value > 0 ? 100 : 0,
      };
    }

    const cp = ev.value / 100;
    const text = (cp >= 0 ? '+' : '') + cp.toFixed(1);
    // Sigmoid-like mapping for the bar
    const percent = 50 + 50 * (2 / (1 + Math.exp(-0.004 * ev.value)) - 1);
    return { text, whitePercent: Math.max(3, Math.min(97, percent)) };
  });
}
