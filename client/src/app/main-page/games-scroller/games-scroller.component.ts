import { Component, inject, input } from '@angular/core';
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

   public navigateToGameOverview(gameId: string): void {
      this.routerService.openGameOverview(gameId);
   }
}
