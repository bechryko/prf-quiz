import { Game, LeaderboardEntry } from '@prfq-shared/models';

export class GameUtils {
   public static getComputedLeaderboardEntries(game: Game): LeaderboardEntry[] {
      const entries: LeaderboardEntry[] = [];

      game.quizzes.forEach(quiz =>
         quiz.leaderboard.forEach(entry => {
            const existingEntry = entries.find(e => e.username === entry.username);

            if (!existingEntry) {
               entries.push({ ...entry });
               return;
            }

            existingEntry.score += entry.score;
         })
      );

      return entries;
   }

   public static compareGamesForSortingByPopularity(game1: Game, game2: Game): number {
      return this.getComputedLeaderboardEntries(game2).length - this.getComputedLeaderboardEntries(game1).length;
   }

   public static filterGamesByNoPlaying(game: Game): boolean {
      return this.getComputedLeaderboardEntries(game).length === 0;
   }
}

