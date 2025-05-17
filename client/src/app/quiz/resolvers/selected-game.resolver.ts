import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Game } from '@prfq-shared/models';
import { GameService } from '@prfq-shared/services';
import { Observable } from 'rxjs';

export const selectedGameResolver: ResolveFn<Game> = (route, _) => {
   const gameService = inject(GameService);

   const gameId = route.paramMap.get('gameId');

   return gameService.getGame(gameId!) as Observable<Game>;
};
