import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@prfq-shared/models';
import { multicast } from '@prfq-shared/operators';
import { HttpRequestUtils } from '@prfq-shared/utils';
import { map, Observable, of } from 'rxjs';

@Injectable({
   providedIn: 'root'
})
export class AuthService {
   private readonly http = inject(HttpClient);

   public readonly loggedInUser$: Observable<User | null>;

   constructor() {
      this.loggedInUser$ = of({
         id: '123',
         name: 'test_admin',
         isAdmin: true
      } as User).pipe(
         map(() => null),
         multicast()
      );
   }

   public login(name: string, password: string): void {
      this.http
         .post(HttpRequestUtils.getUrl('login'), HttpRequestUtils.createBody({ name, password }), {
            headers: HttpRequestUtils.getHeaders(),
            withCredentials: true
         })
         .subscribe(console.log);
   }

   public register(name: string, password: string): void {
      this.http
         .post(HttpRequestUtils.getUrl('register'), HttpRequestUtils.createBody({ name, password }), {
            headers: HttpRequestUtils.getHeaders()
         })
         .subscribe(console.log);
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
         .subscribe(console.log);
   }
}

