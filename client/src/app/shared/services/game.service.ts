import { inject, Injectable } from '@angular/core';
import { GameUtils } from '@prfq-shared/utils';
import { map, Observable, of, switchMap, take } from 'rxjs';
import { Game, Quiz } from '../models';
import { multicast } from '../operators';
import { AuthService } from './auth.service';

@Injectable({
   providedIn: 'root'
})
export class GameService {
   private readonly authService = inject(AuthService);

   public readonly games$: Observable<Game[]>;

   constructor() {
      this.games$ = of<Game[]>([
         {
            name: 'World of Animals',
            id: '0123456789',
            ownerId: '123',
            description: 'Do you know the world of animals enough?',
            quizzes: [
               {
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
         },
         {
            name: 'test game2',
            id: Date.now() + 1 + '',
            ownerId: '123',
            quizzes: []
         },
         {
            name: 'test game2',
            id: Date.now() + 2 + '',
            ownerId: '123',
            quizzes: []
         }
      ] as Game[]).pipe(multicast());
   }

   public createGame(name: string, description: string): Observable<string> {
      console.log('createGame', name, description);
      return of(Date.now() + '');
   }

   public createQuiz(gameId: string, quiz: Quiz): void {
      console.log('createQuiz', gameId, quiz);
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

   public saveQuizScore(gameId: string, quizIndex: number, score: number): void {
      this.authService.loggedInUser$.pipe(take(1)).subscribe(user => {
         if (!user) {
            throw new Error('User not logged in!');
         }

         console.log(`${score} score saved for user "${user.name}" in game ${gameId}'s quiz no. ${quizIndex}`);
      });
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
}
