import { Router } from 'express';
import { PassportStatic } from 'passport';
import { Logger } from '../utility';
import { AuthService } from './auth-service';
import { GameService } from './game-service';
import { LeaderboardService } from './leaderboard-service';
import { QuizService } from './quiz-service';

export function configureEndpoints(passport: PassportStatic, router: Router): Router {
   Logger.info('Creating services');

   const authService = new AuthService(passport);
   const leaderboardService = new LeaderboardService();
   const quizService = new QuizService(leaderboardService);
   const gameService = new GameService(quizService);

   Logger.info('Registering endpoints');

   router.post('/login', authService.login.bind(authService));
   router.post('/register', authService.register.bind(authService));
   router.post('/logout', authService.logout.bind(authService));
   router.get('/auth', authService.auth.bind(authService));

   router.post('/quiz/create', quizService.createQuiz.bind(quizService));
   router.delete('/quiz/delete/:quizId', quizService.deleteQuiz.bind(quizService));

   router.get('/game/list', gameService.getAllGames.bind(gameService));
   router.post('/game/create', gameService.createGame.bind(gameService));

   router.post('/quiz/leaderboard', leaderboardService.addLeaderboardEntry.bind(leaderboardService));

   Logger.success('All endpoints registered');

   return router;
}
