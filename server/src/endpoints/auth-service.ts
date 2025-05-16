import { NextFunction, Request, Response } from 'express';
import { PassportStatic } from 'passport';
import { User } from '../models';

export class AuthService {
   constructor(private readonly passport: PassportStatic) {}

   public login(req: Request, res: Response, next: NextFunction): void {
      console.log('login');
      this.passport.authenticate('local', (error: string | null, user: typeof User, info: any) => {
         console.log('auth', error, user, info);
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
                     res.status(200).send(this.mapServerUserToClientUser(user));
                  }
               });
            }
         }
      })(req, res, next);
   }

   public register(req: Request, res: Response): void {
      if (req.isAuthenticated()) {
         res.status(500).send('User already logged in.');
         return;
      }

      const { username, password } = req.body;
      User.findOne({ username }).then(user => {
         if (user) {
            res.status(500).send('A user with this name already exists.');
         } else {
            const newUser = new User({ username, password, isAdmin: false });
            newUser
               .save()
               .then(user => {
                  res.status(200).send(this.mapServerUserToClientUser(user));
               })
               .catch(error => {
                  res.status(500).send(error);
               });
         }
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
            res.status(200).send(null);
         });
      } else {
         res.status(500).send('User is not logged in.');
      }
   }

   public auth(req: Request, res: Response): void {
      console.log('get user');
      if (!req.isAuthenticated()) {
         res.status(200).send(null);
         return;
      }

      res.status(200).send(this.mapServerUserToClientUser(req.user));
   }

   private mapServerUserToClientUser(serverUser: any): any {
      const { username, _id: id, isAdmin } = serverUser;
      const user = { username, id, isAdmin };
      return user;
   }
}
