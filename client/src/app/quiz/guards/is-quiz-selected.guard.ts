import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Path } from '@prfq-shared/models';
import { GameService, RouterService } from '@prfq-shared/services';
import { iif, map, of, tap } from 'rxjs';

export const isQuizSelectedGuard: CanActivateFn = (route, _) => {
   const routerService = inject(RouterService);
   const gameService = inject(GameService);

   const gameId = route.paramMap.get('gameId');
   const quizIdx = route.paramMap.get('quizIdx');

   return iif(
      () => gameId !== null && !isNaN(quizIdx as any),
      gameService.getQuiz(gameId!, Number(quizIdx)).pipe(map(quiz => Boolean(quiz))),
      of(false)
   ).pipe(
      tap(canActivate => {
         if (!canActivate) {
            routerService.navigate(Path.MAIN);
         }
      })
   );
};
