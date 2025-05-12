import { NextFunction, Request, Response } from 'express';
import { PassportStatic } from 'passport';
import { User } from '../models';

export class AuthService {
   constructor(private readonly passport: PassportStatic) {}

   public login(req: Request, res: Response, next: NextFunction): void {
      console.log('login');
      this.passport.authenticate('local', (error: string | null, user: typeof User) => {
         console.log('auth', user);
         if (error) {
            console.log(error);
            res.status(500).send(error);
         } else {
            if (!user) {
               res.status(400).send('User not found.');
            } else {
               req.login(user, (err: string | null) => {
                  if (err) {
                     console.log(err);
                     res.status(500).send('Internal server error.');
                  } else {
                     res.status(200).send(user);
                  }
               });
            }
         }
      })(req, res, next);
   }

   public register(req: Request, res: Response): void {
      const { name, password } = req.body;
      const user = new User({ username: name, password, isAdmin: false });
      user
         .save()
         .then(data => {
            res.status(200).send(data);
         })
         .catch(error => {
            res.status(500).send(error);
         });
   }

   public logout(req: Request, res: Response): void {
      console.log('logout');
      if (req.isAuthenticated()) {
         req.logout(error => {
            if (error) {
               console.log(error);
               res.status(500).send('Internal server error.');
            }
            res.status(200).send('Successfully logged out.');
         });
      } else {
         res.status(500).send('User is not logged in.');
      }
   }
}

