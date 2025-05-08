import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Quiz } from '@prfq-shared/models';
import { GameService } from '@prfq-shared/services';
import { Observable } from 'rxjs';

export const selectedQuizResolver: ResolveFn<Quiz> = (route, _) => {
   const gameService = inject(GameService);

   const gameId = route.paramMap.get('gameId');
   const quizIdx = route.paramMap.get('quizIdx');

   return gameService.getQuiz(gameId!, Number(quizIdx!)) as Observable<Quiz>;
};
