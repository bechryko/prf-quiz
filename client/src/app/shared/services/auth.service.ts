import { HttpClient } from '@angular/common/http';
import { effect, inject, Injectable, Signal, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '@prfq-shared/models';
import { HttpRequestUtils } from '@prfq-shared/utils';
import { catchError, OperatorFunction, tap } from 'rxjs';

@Injectable({
   providedIn: 'root'
})
export class AuthService {
   private readonly http = inject(HttpClient);
   private readonly snackbar = inject(MatSnackBar);

   private readonly loggedInUser = signal<User | null>(null);

   constructor() {
      effect(() => console.log('loggedInUser', this.loggedInUser()));

      this.getCurrentUser();
   }

   public login(username: string, password: string): void {
      this.http
         .post<User>(HttpRequestUtils.getUrl('login'), HttpRequestUtils.createBody({ username, password }), {
            headers: HttpRequestUtils.getHeaders(),
            withCredentials: true
         })
         .pipe(
            tap(user => {
               this.snackbar.open(`Welcome, ${user.username}!`, undefined, { duration: 2000 });
            }),
            this.catchAuthError()
         )
         .subscribe(user => {
            this.loggedInUser.set(user);
         });
   }

   public register(username: string, password: string): void {
      this.http
         .post<User>(HttpRequestUtils.getUrl('register'), HttpRequestUtils.createBody({ username, password }), {
            headers: HttpRequestUtils.getHeaders()
         })
         .pipe(
            tap(user => {
               this.snackbar.open(`Welcome ${user.username} to the PRF Quiz App!`, undefined, { duration: 2500 });
            }),
            this.catchAuthError()
         )
         .subscribe(user => {
            this.loggedInUser.set(user);
         });
   }

   public logout(): void {
      this.http
         .post(
            HttpRequestUtils.getUrl('logout'),
            {},
            {
               withCredentials: true
            }
         )
         .pipe(
            tap(() => {
               this.snackbar.open('Successfully logged out!', undefined, { duration: 2000 });
            }),
            this.catchAuthError()
         )
         .subscribe(() => {
            this.loggedInUser.set(null);
         });
   }

   public get user(): Signal<User | null> {
      return this.loggedInUser.asReadonly();
   }

   private getCurrentUser(): void {
      this.http
         .get<User>(HttpRequestUtils.getUrl('auth'), {
            headers: HttpRequestUtils.getHeaders(),
            withCredentials: true
         })
         .pipe(this.catchAuthError())
         .subscribe(user => {
            this.loggedInUser.set(user);
         });
   }

   private catchAuthError<T>(): OperatorFunction<T, T | null> {
      return catchError(({ error }) => {
         console.log(error);
         this.snackbar.open(error, 'Dismiss', { duration: 3500 });
         return [null];
      });
   }
}
