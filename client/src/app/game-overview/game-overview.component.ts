import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import { Path, Quiz } from '@prfq-shared/models';
import { SortLeaderboardEntriesPipe } from '@prfq-shared/pipes';
import { AuthService, GameService, RouterService } from '@prfq-shared/services';
import { GameUtils } from '@prfq-shared/utils';

@Component({
   selector: 'prfq-game-overview',
   imports: [MatButtonModule, SortLeaderboardEntriesPipe, MatIconModule, MatTooltipModule],
   templateUrl: './game-overview.component.html',
   styleUrl: './game-overview.component.scss'
})
export class GameOverviewComponent {
   private readonly routerService = inject(RouterService);
   private readonly authService = inject(AuthService);
   private readonly gameService = inject(GameService);
   private readonly snackbar = inject(MatSnackBar);
   private readonly route = inject(ActivatedRoute);

   public readonly game = toSignal(this.gameService.getGame(this.gameId), {
      initialValue: null
   });
   public readonly leaderboard = computed(() => GameUtils.getComputedLeaderboardEntries(this.game()!));
   public readonly user = this.authService.user;
   public readonly username = computed(() => this.user()?.username ?? '');
   public readonly isGameOwner = computed(() => {
      const user = this.user();
      const game = this.game();

      return user && game && game.ownerId === user.id;
   });

   public createNewQuiz(): void {
      this.routerService.createQuizForGame(this.gameId);
   }

   public deleteQuiz(quiz: Quiz): void {
      this.gameService.deleteQuiz(quiz.id).subscribe(deletedLeaderboardEntries => {
         this.snackbar.open(
            `Successfully deleted quiz ${quiz.name} with its ${deletedLeaderboardEntries} leaderboard entries!`,
            'Understood',
            { duration: 4000 }
         );
      });
   }

   public startQuiz(index: number): void {
      this.routerService.startQuiz(this.gameId, index);
   }

   public backToMenu(): void {
      this.routerService.navigate(Path.MAIN);
   }

   private get gameId(): string {
      return this.route.snapshot.paramMap.get('gameId')!;
   }
}
