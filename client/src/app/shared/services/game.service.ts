import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GameUtils, HttpRequestUtils } from '@prfq-shared/utils';
import {
   catchError,
   exhaustMap,
   iif,
   map,
   Observable,
   of,
   startWith,
   Subject,
   switchMap,
   take,
   tap,
   throwError
} from 'rxjs';
import { Game, Quiz } from '../models';
import { mapVoid, multicast } from '../operators';
import { AuthService } from './auth.service';

@Injectable({
   providedIn: 'root'
})
export class GameService {
   private readonly authService = inject(AuthService);
   private readonly http = inject(HttpClient);

   public readonly games$: Observable<Game[]>;
   private readonly updateGames$ = new Subject<void>();
   public readonly mostPopularGames$: Observable<Game[]>;
   public readonly gamesWithoutPlaying$: Observable<Game[]>;

   constructor() {
      this.games$ = this.updateGames$.pipe(
         tap(() => console.log('updateGames')),
         startWith(null),
         switchMap(() => this.getAllGames()),
         tap(console.log),
         multicast({ resetOnRefCountZero: false })
      );

      this.mostPopularGames$ = this.games$.pipe(
         map(games => {
            const sortedGames = [...games].sort(GameUtils.compareGamesForSortingByPopularity.bind(GameUtils));
            return sortedGames.slice(0, 3);
         })
      );

      this.gamesWithoutPlaying$ = this.games$.pipe(
         map(games => games.filter(GameUtils.filterGamesByNoPlaying.bind(GameUtils)))
      );
   }

   public createGame(name: string, description: string): Observable<string> {
      return this.authService.loggedInUser$.pipe(
         take(1),
         exhaustMap(user =>
            iif(
               () => user !== null,
               this.http.post(
                  HttpRequestUtils.getUrl('game/create'),
                  HttpRequestUtils.createBody({ name, description, ownerId: user!.id }),
                  { headers: HttpRequestUtils.getHeaders() }
               ),
               throwError(() => new Error('User not logged in!'))
            )
         ),
         tap(() => this.fetchGames()),
         map((response: any) => response._id)
      );
   }

   public createQuiz(gameId: string, quiz: Omit<Quiz, 'id' | 'leaderboard'>): Observable<void> {
      return this.http
         .post(HttpRequestUtils.getUrl('quiz/create'), HttpRequestUtils.createBody({ ...quiz, gameId }), {
            headers: HttpRequestUtils.getHeaders()
         })
         .pipe(
            mapVoid(),
            tap(() => this.fetchGames())
         );
   }

   public deleteQuiz(quizId: string): Observable<number> {
      return this.http
         .delete<number>(HttpRequestUtils.getUrl(`quiz/delete/${quizId}`), {
            headers: HttpRequestUtils.getHeaders()
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
      return this.authService.loggedInUser$.pipe(
         take(1),
         switchMap(user => {
            if (!user) {
               return of(false);
            }

            return this.http
               .post<{
                  score: number;
               }>(
                  HttpRequestUtils.getUrl('quiz/leaderboard'),
                  HttpRequestUtils.createBody({ username: user.name, quizId, score }),
                  { headers: HttpRequestUtils.getHeaders() }
               )
               .pipe(map(() => true));
         }),
         tap(isSuccessful => {
            if (isSuccessful) {
               this.fetchGames();
            }
         }),
         mapVoid()
      );
   }

   public getParticipatedGames(): Observable<Game[]> {
      return this.games$.pipe(
         switchMap(games =>
            this.authService.loggedInUser$.pipe(
               map(user => {
                  if (!user) {
                     return [];
                  }

                  return games.filter(game =>
                     GameUtils.getComputedLeaderboardEntries(game).find(entry => entry.username === user.name)
                  );
               })
            )
         ),
         multicast()
      );
   }

   private fetchGames(): void {
      this.updateGames$.next();
   }

   private getAllGames(): Observable<Game[]> {
      return this.http
         .get<Game[]>(HttpRequestUtils.getUrl('game/list'), {
            headers: HttpRequestUtils.getHeaders()
         })
         .pipe(catchError(() => [[]]));
   }

   private getMockGame(): Game {
      return {
         name: 'World of Animals',
         id: '0123456789',
         ownerId: '123',
         description: 'Do you know the world of animals enough?',
         quizzes: [
            {
               id: '1',
               name: 'General animal quiz',
               description:
                  'Some questions about animals general. Find out if you know the surface of this vast world!',
               questions: [
                  {
                     title: 'River horse',
                     question: "Which animal's name means river horse?",
                     options: [
                        { text: 'Camel' },
                        { text: 'Hippopotamus', isCorrect: true },
                        { text: 'Giraffe' },
                        { text: 'Whale' }
                     ],
                     scoreValue: 1
                  },
                  {
                     title: 'Manx cat',
                     question: 'What is the distinguishing feature of a manx cat? ',
                     options: [
                        { text: 'It has no tail', isCorrect: true },
                        { text: 'It has no ears' },
                        { text: 'It has no fur' }
                     ],
                     scoreValue: 2
                  },
                  {
                     title: "India's animal",
                     question: 'Which animal is the national animal of India?',
                     options: [{ text: 'elephant' }, { text: 'snake' }, { text: 'tiger', isCorrect: true }],
                     scoreValue: 1
                  }
               ],
               leaderboard: [
                  {
                     username: 'test_user1',
                     score: 1
                  },
                  {
                     username: 'test_admin',
                     score: 3
                  },
                  {
                     username: 'test_user2',
                     score: 2
                  }
               ]
            }
         ]
      };
   }
}

