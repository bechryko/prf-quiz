import { Dialog } from '@angular/cdk/dialog';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { AuthService, GameService, RouterService } from '@prfq-shared/services';
import { GameCreationDialogComponent } from './game-creation-dialog/game-creation-dialog.component';
import { GamesScrollerComponent } from './games-scroller/games-scroller.component';

@Component({
   selector: 'prfq-main-page',
   imports: [GamesScrollerComponent, MatButtonModule],
   templateUrl: './main-page.component.html',
   styleUrl: './main-page.component.scss'
})
export class MainPageComponent {
   private readonly gameService = inject(GameService);
   private readonly authService = inject(AuthService);
   private readonly dialog = inject(Dialog);
   private readonly routerService = inject(RouterService);

   private readonly user = toSignal(this.authService.loggedInUser$, { initialValue: null });
   public readonly isAdminUser = computed(() => Boolean(this.user()?.isAdmin));
   public readonly allGames = toSignal(this.gameService.games$, { initialValue: [] });
   public readonly mostPopularGames = toSignal(this.gameService.mostPopularGames$, { initialValue: [] });
   public readonly gamesWithoutPlaying = toSignal(this.gameService.gamesWithoutPlaying$, { initialValue: [] });

   public createNewGame(): void {
      this.dialog.open<string>(GameCreationDialogComponent).closed.subscribe(newGameId => {
         if (!newGameId) {
            return;
         }

         this.routerService.openGameOverview(newGameId);
      });
   }
}

