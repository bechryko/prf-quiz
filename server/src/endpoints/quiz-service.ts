import { Request, Response } from 'express';
import { Quiz } from '../models';
import { LeaderboardService } from './leaderboard-service';

export class QuizService {
   constructor(private readonly leaderboardService: LeaderboardService) {}

   public createQuiz(req: Request, res: Response): void {
      const { name, description, questions, gameId } = req.body;
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
   }

   public deleteQuiz(req: Request, res: Response): void {
      const { quizId } = req.params;
      Quiz.findOneAndDelete({ _id: quizId })
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
}
