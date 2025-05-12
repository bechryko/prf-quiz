import { Request, Response } from 'express';
import { Game } from '../models';
import { QuizService } from './quiz-service';

export class GameService {
   constructor(private readonly quizService: QuizService) {}

   public getAllGames(_: Request, res: Response): void {
      const gamesQuery = Game.find();
      gamesQuery
         .then(data => {
            Promise.all(data.map(serverGame => this.mapServerGameToClientGame(serverGame)))
               .then(games => {
                  res.status(200).send(games);
               })
               .catch(error => {
                  console.log(error);
                  res.status(500).send('Internal server error.');
               });
         })
         .catch(error => {
            console.log(error);
            res.status(500).send('Internal server error.');
         });
   }

   public createGame(req: Request, res: Response): void {
      const { name, ownerId, description } = req.body;
      const game = new Game({ name, ownerId, description });
      console.log(game);
      game
         .save()
         .then(data => {
            res.status(200).send(data);
         })
         .catch(error => {
            res.status(500).send(error);
         });
   }

   private async mapServerGameToClientGame(serverGame: any) {
      const id: string = serverGame._id.toString();
      const quizzes = await this.quizService.getQuizzesForGame(id);

      return {
         name: serverGame.name,
         id,
         ownerId: serverGame.ownerId,
         description: serverGame.description,
         quizzes
      };
   }
}
