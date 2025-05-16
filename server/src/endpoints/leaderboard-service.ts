import { Request, Response } from 'express';
import { LeaderboardEntry } from '../models';

export class LeaderboardService {
   public addLeaderboardEntry(req: Request, res: Response): void {
      const { quizId, score } = req.body;
      const username: string | undefined = (req.user as any)?.username;
      console.log(req.user, username);
      if (!username) {
         res.status(500).send('User not logged in.');
         return;
      }

      this.getExistingLeaderboardEntry(quizId, username).then(entry => {
         if (entry === null) {
            const newEntry = new LeaderboardEntry({ quizId, username, score });
            console.log(newEntry);
            newEntry
               .save()
               .then(data => {
                  res.status(200).send(data);
               })
               .catch(error => {
                  res.status(500).send(error);
               });
         } else {
            if (entry.score >= score) {
               res.status(200).send(entry);
            } else {
               LeaderboardEntry.findOneAndUpdate({ quizId, username }, { score })
                  .then(() => {
                     res.status(200).send(entry);
                  })
                  .catch(error => {
                     res.status(500).send(error);
                  });
            }
         }
      });
   }

   public deleteLeaderboardEntriesForQuiz(quizId: string) {
      return LeaderboardEntry.deleteMany({ quizId });
   }

   public async getLeaderboardEntriesForQuiz(quizId: string) {
      const leaderboardEntries = await LeaderboardEntry.find();
      return leaderboardEntries.filter(entry => entry.quizId === quizId);
   }

   private async getExistingLeaderboardEntry(quizId: string, username: string) {
      const leaderboardEntriesForQuiz = await this.getLeaderboardEntriesForQuiz(quizId);
      return leaderboardEntriesForQuiz.find(entry => entry.username === username) ?? null;
   }
}
