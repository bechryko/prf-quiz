import { NextFunction, Request, Response } from 'express';
import { PassportStatic } from 'passport';
import { User } from '../models';
import { Logger } from '../utility';

export class AuthService {
   constructor(private readonly passport: PassportStatic) {
      Logger.info('AuthService constructed');
   }

   public login(req: Request, res: Response, next: NextFunction): void {
      Logger.info('Login started');
      this.passport.authenticate('local', (error: string | null, user: typeof User, info: any) => {
         Logger.details('Authentication info:', info);
         if (error) {
            Logger.error(error);
            res.status(500).send(error);
         } else {
            if (!user) {
               const message = 'User not found';
               Logger.error(message);
               res.status(400).send(message);
            } else {
               req.login(user, (err: string | null) => {
                  if (err) {
                     Logger.error('Login error', err);
                     res.status(500).send('Internal server error');
                  } else {
                     Logger.success('Login successful');
                     res.status(200).send(this.mapServerUserToClientUser(user));
                  }
               });
            }
         }
      })(req, res, next);
   }

   public register(req: Request, res: Response): void {
      Logger.info('Register started');
      if (req.isAuthenticated()) {
         const message = 'User already logged in';
         Logger.error(message);
         res.status(500).send(message);
         return;
      }

      const { username, password } = req.body;
      User.findOne({ username }).then(user => {
         if (user) {
            const message = 'A user with this name already exists';
            Logger.error(message);
            res.status(500).send(message);
         } else {
            const newUser = new User({ username, password, isAdmin: false });
            newUser
               .save()
               .then(user => {
                  Logger.success('Register successful');
                  res.status(200).send(this.mapServerUserToClientUser(user));
               })
               .catch(error => {
                  Logger.error(error);
                  res.status(500).send(error);
               });
         }
      });
   }

   public logout(req: Request, res: Response): void {
      Logger.info('Logout started');
      if (req.isAuthenticated()) {
         req.logout(error => {
            if (error) {
               Logger.error(error);
               res.status(500).send('Internal server error');
            } else {
               Logger.success('Logout successful');
               res.status(200).send(null);
            }
         });
      } else {
         const message = 'User is not logged in';
         Logger.error(message);
         res.status(500).send(message);
      }
   }

   public auth(req: Request, res: Response): void {
      Logger.info('Getting authenticated user');
      if (!req.isAuthenticated()) {
         Logger.success('Unauthenticated');
         res.status(200).send(null);
         return;
      }

      Logger.success('Authenticated');
      Logger.details(req.user);
      res.status(200).send(this.mapServerUserToClientUser(req.user));
   }

   private mapServerUserToClientUser(serverUser: any): any {
      const { username, _id: id, isAdmin } = serverUser;
      const user = { username, id, isAdmin };
      return user;
   }
}
