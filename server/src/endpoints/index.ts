import { Router } from 'express';
import { PassportStatic } from 'passport';
import { Logger, registerEndpoints } from '../utility';
import { AuthService } from './auth-service';
import { GameService } from './game-service';
import { LeaderboardService } from './leaderboard-service';
import { QuizService } from './quiz-service';

export function configureEndpoints(passport: PassportStatic, router: Router): Router {
   Logger.details('Creating services');

   const authService = new AuthService(passport);
   const leaderboardService = new LeaderboardService();
   const quizService = new QuizService(leaderboardService);
   const gameService = new GameService(quizService);

   Logger.info('Registering endpoints');

   const providers = [authService, leaderboardService, quizService, gameService];
   registerEndpoints(router, providers);

   Logger.success('All endpoints registered');
   return router;
}
