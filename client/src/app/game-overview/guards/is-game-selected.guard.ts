import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Path } from '@prfq-shared/models';
import { GameService, RouterService } from '@prfq-shared/services';
import { iif, map, of, tap } from 'rxjs';

export const isGameSelectedGuard: CanActivateFn = (route, _) => {
   const routerService = inject(RouterService);
   const gameService = inject(GameService);

   const gameId = route.paramMap.get('gameId');

   return iif(() => gameId !== null, gameService.getGame(gameId!).pipe(map(game => Boolean(game))), of(false)).pipe(
      tap(canActivate => {
         if (!canActivate) {
            routerService.navigate(Path.MAIN);
         }
      })
   );
};
