import { Injectable } from '@angular/core';
import { User } from '@prfq-shared/models';
import { multicast } from '@prfq-shared/operators';
import { Observable, of } from 'rxjs';

@Injectable({
   providedIn: 'root'
})
export class AuthService {
   public readonly loggedInUser$: Observable<User | null>;

   constructor() {
      this.loggedInUser$ = of({
         id: '123',
         name: 'test_admin',
         isAdmin: true
      } as User).pipe(multicast());
   }

   public login(name: string, password: string): void {
      console.log('login', name, password);
   }

   public register(name: string, password: string): void {
      console.log('register', name, password);
   }

   public logout(): void {
      console.log('logout');
   }
}
