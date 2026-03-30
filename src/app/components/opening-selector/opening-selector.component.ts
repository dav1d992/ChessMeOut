import { Component, computed, ElementRef, HostListener, output, signal } from '@angular/core';
import {
  ChessOpening,
  OPENINGS,
} from '../../models/openings';

@Component({
  selector: 'app-opening-selector',
  standalone: true,
  templateUrl: './opening-selector.component.html',
  styleUrl: './opening-selector.component.scss',
})
export class OpeningSelectorComponent {
  readonly openingSelected = output<ChessOpening>();

  readonly showDropdown = signal(false);
  readonly searchQuery = signal('');
  readonly selectedOpening = signal<ChessOpening | null>(null);

  private readonly openings = OPENINGS;

  constructor(private elRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.showDropdown.set(false);
    }
  }

  readonly filteredCategories = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const grouped = new Map<string, ChessOpening[]>();

    for (const opening of this.openings) {
      if (
        query &&
        !opening.name.toLowerCase().includes(query) &&
        !opening.category.toLowerCase().includes(query) &&
        !opening.description.toLowerCase().includes(query)
      ) {
        continue;
      }
      const list = grouped.get(opening.category) ?? [];
      list.push(opening);
      grouped.set(opening.category, list);
    }

    return [...grouped.entries()].map(([name, openings]) => ({
      name,
      openings,
    }));
  });

  toggleDropdown(): void {
    this.showDropdown.update(v => !v);
  }

  selectOpening(opening: ChessOpening): void {
    this.selectedOpening.set(opening);
    this.showDropdown.set(false);
    this.searchQuery.set('');
    this.openingSelected.emit(opening);
  }
}
