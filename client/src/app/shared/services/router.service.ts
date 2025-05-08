import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Path } from '../models';

@Injectable({
   providedIn: 'root'
})
export class RouterService {
   private readonly router = inject(Router);

   public navigate(path: Path): void {
      this.router.navigateByUrl(path);
   }

   public openGameOverview(gameId: string): void {
      this.router.navigateByUrl(`${Path.GAME_OVERVIEW}/${gameId}`);
   }

   public startQuiz(gameId: string, quizIndex: number): void {
      this.router.navigateByUrl(`${Path.QUIZ}/${gameId}/${quizIndex}`);
   }

   public createQuizForGame(gameId: string): void {
      this.router.navigateByUrl(`${Path.QUIZ_CREATION}/${gameId}`);
   }
}
