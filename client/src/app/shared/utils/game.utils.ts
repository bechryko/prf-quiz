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
}
