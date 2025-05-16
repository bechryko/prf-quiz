import { Request, Response } from 'express';
import { LeaderboardEntry } from '../models';
import { Endpoint, Logger } from '../utility';

export class LeaderboardService {
   constructor() {
      Logger.info('LeaderboardService constructed');
   }

   @Endpoint({ method: 'post', path: '/quiz/leaderboard' })
   public addLeaderboardEntry(req: Request, res: Response): void {
      Logger.info('Adding leaderboard entry');
      const { quizId, score } = req.body;
      const username: string | undefined = (req.user as any)?.username;
      Logger.details('user:', req.user);

      if (!username) {
         const message = 'User not logged in';
         Logger.error(message);
         res.status(500).send(message);
         return;
      }

      this.getExistingLeaderboardEntry(quizId, username)
         .then(entry => {
            if (entry === null) {
               Logger.info('Existing entry not found');
               const newEntry = new LeaderboardEntry({ quizId, username, score });
               Logger.details(newEntry);
               newEntry
                  .save()
                  .then(data => {
                     Logger.success('Entry created');
                     res.status(200).send(data);
                  })
                  .catch(error => {
                     Logger.error(error);
                     res.status(500).send(error);
                  });
            } else {
               Logger.info('Existing entry found');
               if (entry.score >= score) {
                  Logger.success('No leaderboard entry override needed');
                  res.status(200).send(entry);
               } else {
                  Logger.info('Updating entry');
                  LeaderboardEntry.findOneAndUpdate({ quizId, username }, { score })
                     .then(() => {
                        Logger.success('Entry updated');
                        res.status(200).send(entry);
                     })
                     .catch(error => {
                        Logger.error(error);
                        res.status(500).send(error);
                     });
               }
            }
         })
         .catch(error => {
            Logger.error(error);
            res.status(500).send(error);
         });
   }

   public deleteLeaderboardEntriesForQuiz(quizId: string) {
      return LeaderboardEntry.deleteMany({ quizId });
   }

   public async getLeaderboardEntriesForQuiz(quizId: string) {
      const leaderboardEntries = await LeaderboardEntry.find();
      Logger.details(`Fetched ${leaderboardEntries.length} leaderboard entries`);
      return leaderboardEntries.filter(entry => entry.quizId === quizId);
   }

   private async getExistingLeaderboardEntry(quizId: string, username: string) {
      const leaderboardEntriesForQuiz = await this.getLeaderboardEntriesForQuiz(quizId);
      return leaderboardEntriesForQuiz.find(entry => entry.username === username) ?? null;
   }
}
