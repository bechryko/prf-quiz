import { Pipe, PipeTransform } from '@angular/core';
import { LeaderboardEntry } from '@prfq-shared/models';

@Pipe({
   name: 'sortLeaderboardEntries'
})
export class SortLeaderboardEntriesPipe implements PipeTransform {
   public transform(leaderboardEntries: LeaderboardEntry[]): LeaderboardEntry[] {
      return [...leaderboardEntries].sort(this.sortFn);
   }

   private sortFn(entry1: LeaderboardEntry, entry2: LeaderboardEntry): number {
      return entry2.score - entry1.score;
   }
}
