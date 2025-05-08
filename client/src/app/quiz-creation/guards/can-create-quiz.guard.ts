import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Path } from '@prfq-shared/models';
import { AuthService, GameService, RouterService } from '@prfq-shared/services';
import { map, switchMap, tap } from 'rxjs';

export const canCreateQuizGuard: CanActivateFn = (route, _) => {
   const routerService = inject(RouterService);
   const gameService = inject(GameService);
   const authService = inject(AuthService);

   const gameId = route.paramMap.get('gameId');

   return gameService.getGame(gameId!).pipe(
      switchMap(game => authService.loggedInUser$.pipe(map(user => Boolean(game && user && user.id === game.ownerId)))),
      tap(canActivate => {
         if (!canActivate) {
            if (gameId) {
               routerService.openGameOverview(gameId);
            } else {
               routerService.navigate(Path.MAIN);
            }
         }
      })
   );
};
