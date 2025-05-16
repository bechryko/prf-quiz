import { Request, Response } from 'express';
import { Game, Quiz } from '../models';
import { LeaderboardService } from './leaderboard-service';

export class QuizService {
   constructor(private readonly leaderboardService: LeaderboardService) {}

   public createQuiz(req: Request, res: Response): void {
      if (!req.user) {
         res.status(500).send('User not logged in.');
         return;
      }

      const { name, description, questions, gameId } = req.body;
      const userId = (req.user as any)._id.toString();
      this.isOwnerOfGame(userId, gameId)
         .then(isOwner => {
            if (!isOwner) {
               res.status(500).send('Game is not owned by this user.');
               return;
            }

            const quiz = new Quiz({ name, description, questions: JSON.parse(questions), gameId });
            console.log(quiz);
            quiz
               .save()
               .then(data => {
                  res.status(200).send(data);
               })
               .catch(error => {
                  res.status(500).send(error);
               });
         })
         .catch(error => {
            res.status(500).send(error);
         });
   }

   public deleteQuiz(req: Request, res: Response): void {
      if (!req.user) {
         res.status(500).send('User not logged in.');
         return;
      }

      const { quizId } = req.params;
      Quiz.findById(quizId)
         .then(quiz => {
            if (!quiz) {
               res.status(500).send("This quiz doesn't exist.");
               return;
            }

            const userId = (req.user as any)._id.toString();
            this.isOwnerOfGame(userId, quiz.gameId)
               .then(isOwner => {
                  if (isOwner) {
                     quiz
                        .deleteOne()
                        .then(quizDeletionResult => {
                           console.log('deleted', quizDeletionResult);
                           this.leaderboardService
                              .deleteLeaderboardEntriesForQuiz(quizId)
                              .then(leaderboardDeletionResult => {
                                 res.status(200).send(leaderboardDeletionResult.deletedCount);
                              })
                              .catch(error => {
                                 res.status(500).send(error);
                              });
                        })
                        .catch(error => {
                           res.status(500).send(error);
                        });
                  } else {
                     res.status(500).send('The game is not owned by this user.');
                  }
               })
               .catch(error => {
                  res.status(500).send(error);
               });
         })
         .catch(error => {
            res.status(500).send(error);
         });
   }

   public async getQuizzesForGame(gameId: string) {
      const quizzes = await Quiz.find();
      return Promise.all(
         quizzes.filter(quiz => quiz.gameId === gameId).map(quiz => this.mapServerQuizToClientQuiz(quiz))
      );
   }

   private async mapServerQuizToClientQuiz(quiz: any) {
      const id = quiz._id.toString();
      const leaderboard = await this.leaderboardService.getLeaderboardEntriesForQuiz(id);

      return {
         name: quiz.name,
         id,
         description: quiz.description,
         questions: quiz.questions,
         leaderboard
      };
   }

   private async isOwnerOfGame(userId: string, gameId: string): Promise<boolean> {
      const game = await Game.findById(gameId);
      return game?.ownerId === userId;
   }
}
