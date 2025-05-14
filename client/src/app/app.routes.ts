import { Routes } from '@angular/router';
import { isGameSelectedGuard } from '@prfq-guards/game-overview';
import { isQuizSelectedGuard } from '@prfq-guards/quiz';
import { canCreateQuizGuard } from '@prfq-guards/quiz-creation';
import { selectedGameResolver, selectedQuizResolver } from '@prfq-resolvers/quiz';
import { Path } from './shared/models';

export const routes: Routes = [
   {
      path: Path.MAIN,
      loadComponent: () => import('./main-page/main-page.component').then(c => c.MainPageComponent)
   },
   {
      path: `${Path.GAME_OVERVIEW}/:gameId`,
      loadComponent: () => import('./game-overview/game-overview.component').then(c => c.GameOverviewComponent),
      canActivate: [isGameSelectedGuard]
   },
   {
      path: `${Path.QUIZ}/:gameId/:quizIdx`,
      loadComponent: () => import('./quiz/quiz.component').then(c => c.QuizComponent),
      canActivate: [isQuizSelectedGuard],
      resolve: {
         selectedQuiz: selectedQuizResolver,
         selectedGame: selectedGameResolver
      }
   },
   {
      path: `${Path.QUIZ_CREATION}/:gameId`,
      loadComponent: () => import('./quiz-creation/quiz-creation.component').then(c => c.QuizCreationComponent),
      canActivate: [canCreateQuizGuard]
   },
   {
      path: Path.PROFILE,
      loadComponent: () => import('./profile/profile.component').then(c => c.ProfileComponent)
   },
   {
      path: '**',
      redirectTo: Path.MAIN
   }
];

