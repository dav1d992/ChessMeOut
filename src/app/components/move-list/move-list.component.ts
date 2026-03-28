import { Component, computed, inject } from '@angular/core';
import { GameStore } from '../../store/game.store';
import { GameMove, MoveClassification } from '../../models/chess.models';

@Component({
  selector: 'app-move-list',
  standalone: true,
  templateUrl: './move-list.component.html',
  styleUrl: './move-list.component.scss',
})
export class MoveListComponent {
  readonly store = inject(GameStore);

  readonly movePairs = computed(() => {
    const moves = this.store.moves();
    const pairs: { number: number; white: GameMove; black?: GameMove }[] = [];
    for (let i = 0; i < moves.length; i += 2) {
      pairs.push({
        number: Math.floor(i / 2) + 1,
        white: moves[i],
        black: moves[i + 1],
      });
    }
    return pairs;
  });

  readonly currentMoveIndex = this.store.currentMoveIndex;

  getClassColor(classification?: MoveClassification): string {
    switch (classification) {
      case 'brilliant': return '#1baca6';
      case 'great': return '#5c8bb0';
      case 'best': return '#96bc4b';
      case 'excellent': return '#96bc4b';
      case 'good': return '#96bc4b';
      case 'inaccuracy': return '#f7c631';
      case 'mistake': return '#e58f2a';
      case 'blunder': return '#ca3431';
      default: return 'transparent';
    }
  }

  getClassIcon(classification?: MoveClassification): string {
    switch (classification) {
      case 'brilliant': return '!!';
      case 'great': return '!';
      case 'best': return '★';
      case 'excellent': return '✓';
      case 'good': return '';
      case 'inaccuracy': return '?!';
      case 'mistake': return '?';
      case 'blunder': return '??';
      default: return '';
    }
  }

  goToMove(index: number): void {
    this.store.goToMove(index);
  }
}
