import { Request, Response } from 'express';
import { Game } from '../models';
import { Logger } from '../utility';
import { QuizService } from './quiz-service';

export class GameService {
   constructor(private readonly quizService: QuizService) {
      Logger.info('GameService constructed');
   }

   public getAllGames(_: Request, res: Response): void {
      Logger.info('Fetch all games');
      const gamesQuery = Game.find();
      gamesQuery
         .then(data => {
            Logger.details(`Fetched ${data.length} games`);
            Logger.info('Games fetched, fetching additional data');
            Promise.all(data.map(serverGame => this.mapServerGameToClientGame(serverGame)))
               .then(games => {
                  Logger.success('Games fetched successfully');
                  res.status(200).send(games);
               })
               .catch(error => {
                  Logger.error(error);
                  res.status(500).send('Internal server error');
               });
         })
         .catch(error => {
            Logger.error(error);
            res.status(500).send('Internal server error');
         });
   }

   public createGame(req: Request, res: Response): void {
      Logger.info('Game creation');
      const user = req.user as any;
      if (!user) {
         const message = 'User not logged in';
         Logger.error(message);
         res.status(500).send(message);
         return;
      }
      if (!user.isAdmin) {
         const message = 'Only admin users can create games';
         Logger.error(message);
         res.status(500).send(message);
         return;
      }

      const { name, description } = req.body;
      const ownerId = user._id.toString();
      const game = new Game({ name, ownerId, description });
      Logger.details(game);
      game
         .save()
         .then(data => {
            Logger.success('Game created');
            res.status(200).send(data);
         })
         .catch(error => {
            Logger.error(error);
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
