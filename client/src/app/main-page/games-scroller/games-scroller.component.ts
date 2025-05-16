import { Component, computed, inject, input, signal } from '@angular/core';
import { Game } from '@prfq-shared/models';
import { RouterService } from '@prfq-shared/services';
import { GameTileComponent } from './game-tile/game-tile.component';

@Component({
   selector: 'prfq-games-scroller',
   imports: [GameTileComponent],
   templateUrl: './games-scroller.component.html',
   styleUrl: './games-scroller.component.scss'
})
export class GamesScrollerComponent {
   private readonly routerService = inject(RouterService);

   public readonly _title = input.required<string>();
   public readonly games = input.required<Game[]>();
   public readonly search = input<boolean>(false);

   private readonly searchQuery = signal('');
   public readonly matchingGames = computed(() => {
      const games = this.games();
      const query = this.searchQuery();

      return games.filter(game => query.length === 0 || game.name.toLowerCase().indexOf(query) !== -1);
   });
   public readonly isSearching = computed(() => this.searchQuery().length > 0);

   public navigateToGameOverview(gameId: string): void {
      this.routerService.openGameOverview(gameId);
   }

   public updateSearchQuery(value: string): void {
      this.searchQuery.set(value.toLowerCase());
   }
}
