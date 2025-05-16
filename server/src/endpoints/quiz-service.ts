import { Request, Response } from 'express';
import { Game, Quiz } from '../models';
import { Logger } from '../utility';
import { LeaderboardService } from './leaderboard-service';

export class QuizService {
   constructor(private readonly leaderboardService: LeaderboardService) {
      Logger.info('QuizService constructed');
   }

   public createQuiz(req: Request, res: Response): void {
      Logger.info('Quiz creation');
      if (!req.user) {
         const message = 'User not logged in';
         Logger.error(message);
         res.status(500).send(message);
         return;
      }

      const { name, description, questions, gameId } = req.body;
      const userId = (req.user as any)._id.toString();
      this.isOwnerOfGame(userId, gameId)
         .then(isOwner => {
            if (!isOwner) {
               const message = 'Game is not owned by this user';
               Logger.error(message);
               res.status(500).send(message);
               return;
            }

            const quiz = new Quiz({ name, description, questions: JSON.parse(questions), gameId });
            Logger.details(quiz);
            quiz
               .save()
               .then(data => {
                  Logger.success('Quiz created successfully');
                  res.status(200).send(data);
               })
               .catch(error => {
                  Logger.error(error);
                  res.status(500).send(error);
               });
         })
         .catch(error => {
            Logger.error(error);
            res.status(500).send(error);
         });
   }

   public deleteQuiz(req: Request, res: Response): void {
      if (!req.user) {
         const message = 'User not logged in';
         Logger.error(message);
         res.status(500).send(message);
         return;
      }

      const { quizId } = req.params;
      Quiz.findById(quizId)
         .then(quiz => {
            if (!quiz) {
               const message = "This quiz doesn't exist";
               Logger.error(message);
               res.status(500).send(message);
               return;
            }

            const userId = (req.user as any)._id.toString();
            this.isOwnerOfGame(userId, quiz.gameId)
               .then(isOwner => {
                  if (isOwner) {
                     quiz
                        .deleteOne()
                        .then(quizDeletionResult => {
                           Logger.success(`Successfully deleted ${quizDeletionResult.deletedCount} quiz`);
                           this.leaderboardService
                              .deleteLeaderboardEntriesForQuiz(quizId)
                              .then(leaderboardDeletionResult => {
                                 Logger.success(
                                    `Successfully deleted ${leaderboardDeletionResult.deletedCount} leaderboard entries`
                                 );
                                 res.status(200).send(leaderboardDeletionResult.deletedCount);
                              })
                              .catch(error => {
                                 Logger.error(error);
                                 res.status(500).send(error);
                              });
                        })
                        .catch(error => {
                           Logger.error(error);
                           res.status(500).send(error);
                        });
                  } else {
                     const message = 'The game is not owned by this user';
                     Logger.error(message);
                     res.status(500).send(message);
                  }
               })
               .catch(error => {
                  Logger.error(error);
                  res.status(500).send(error);
               });
         })
         .catch(error => {
            Logger.error(error);
            res.status(500).send(error);
         });
   }

   public async getQuizzesForGame(gameId: string) {
      const quizzes = await Quiz.find();
      Logger.details(`Fetched ${quizzes.length} quizzes`);
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
      Logger.details(`Fetched game ${game?.name}`);
      return game?.ownerId === userId;
   }
}
