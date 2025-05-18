import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { GameUtils, HttpRequestUtils } from '@prfq-shared/utils';
import { catchError, map, Observable, startWith, Subject, switchMap, tap, throwError } from 'rxjs';
import { Game, Quiz } from '../models';
import { mapVoid, multicast } from '../operators';
import { AuthService } from './auth.service';
import { RouterService } from './router.service';

type Callback = () => void;

@Injectable({
   providedIn: 'root'
})
export class GameService {
   private readonly authService = inject(AuthService);
   private readonly http = inject(HttpClient);
   private readonly routerService = inject(RouterService);

   public readonly games$: Observable<Game[]>;
   private readonly updateGames$ = new Subject<undefined | Callback>();
   private readonly gamesSignal: Signal<Game[]>;

   constructor() {
      this.games$ = this.updateGames$.pipe(
         startWith(undefined),
         switchMap(postCallback => {
            return this.getAllGames().pipe(
               tap(() => {
                  if (postCallback) {
                     postCallback();
                  }
               })
            );
         }),
         multicast({ resetOnRefCountZero: false })
      );

      this.gamesSignal = toSignal(this.games$, { initialValue: [] });
   }

   public createGame(name: string, description: string): Observable<string> {
      return this.http
         .post(HttpRequestUtils.getUrl('game/create'), HttpRequestUtils.createBody({ name, description }), {
            headers: HttpRequestUtils.getHeaders(),
            withCredentials: true
         })
         .pipe(
            map((response: any) => response._id),
            tap(gameId => this.fetchGames(() => this.routerService.openGameOverview(gameId)))
         );
   }

   public createQuiz(gameId: string, quiz: Omit<Quiz, 'id' | 'leaderboard'>): Observable<void> {
      return this.http
         .post(HttpRequestUtils.getUrl('quiz/create'), HttpRequestUtils.createBody({ ...quiz, gameId }), {
            headers: HttpRequestUtils.getHeaders(),
            withCredentials: true
         })
         .pipe(
            mapVoid(),
            tap(() => this.fetchGames())
         );
   }

   public deleteQuiz(quizId: string): Observable<number> {
      return this.http
         .delete<number>(HttpRequestUtils.getUrl(`quiz/delete/${quizId}`), {
            headers: HttpRequestUtils.getHeaders(),
            withCredentials: true
         })
         .pipe(tap(() => this.fetchGames()));
   }

   public getGame(id: string): Observable<Game | null> {
      return this.games$.pipe(map(games => games.find(game => game.id === id) ?? null));
   }

   public getQuiz(gameId: string, quizIdx: number): Observable<Quiz | null> {
      return this.getGame(gameId).pipe(
         map(game => {
            if (!game) {
               return null;
            }

            return game.quizzes[quizIdx] ?? null;
         })
      );
   }

   public saveQuizScore(quizId: string, score: number): Observable<void> {
      return this.http
         .post<{
            score: number;
         }>(HttpRequestUtils.getUrl('quiz/leaderboard'), HttpRequestUtils.createBody({ quizId, score }), {
            headers: HttpRequestUtils.getHeaders(),
            withCredentials: true
         })
         .pipe(
            tap(() => this.fetchGames()),
            catchError(error => {
               if (error.status === 500 && error.error === 'User not logged in') {
                  return [undefined];
               }
               return throwError(() => new Error(error));
            }),
            mapVoid()
         );
   }

   public getParticipatedGames(): Signal<Game[]> {
      return computed(() => {
         const user = this.authService.user();
         const games = this.gamesSignal();

         if (!user || games.length === 0) {
            return [];
         }

         return games.filter(game =>
            GameUtils.getComputedLeaderboardEntries(game).find(entry => entry.username === user.username)
         );
      });
   }

   private fetchGames(postCallback?: Callback): void {
      this.updateGames$.next(postCallback);
   }

   private getAllGames(): Observable<Game[]> {
      return this.http
         .get<Game[]>(HttpRequestUtils.getUrl('game/list'), {
            headers: HttpRequestUtils.getHeaders()
         })
         .pipe(catchError(() => [[]]));
   }
}
