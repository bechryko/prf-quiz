import { Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { Game } from '@prfq-shared/models';
import { SortLeaderboardEntriesPipe } from '@prfq-shared/pipes';
import { AuthService, RouterService } from '@prfq-shared/services';
import { GameUtils } from '@prfq-shared/utils';

@Component({
   selector: 'prfq-game-overview',
   imports: [MatButtonModule, SortLeaderboardEntriesPipe],
   templateUrl: './game-overview.component.html',
   styleUrl: './game-overview.component.scss'
})
export class GameOverviewComponent {
   private readonly routerService = inject(RouterService);
   private readonly authService = inject(AuthService);

   public readonly selectedGame = input.required<Game>();
   public readonly leaderboard = computed(() => GameUtils.getComputedLeaderboardEntries(this.selectedGame()));
   private readonly user = toSignal(this.authService.loggedInUser$, { initialValue: null });
   public readonly username = computed(() => this.user()?.name ?? '');
   public readonly isGameOwner = computed(() => {
      const user = this.user();
      const game = this.selectedGame();

      return user && game.ownerId === user.id;
   });

   public createNewQuiz(): void {
      this.routerService.createQuizForGame(this.selectedGame().id);
   }

   public startQuiz(index: number): void {
      this.routerService.startQuiz(this.selectedGame().id, index);
   }
}
