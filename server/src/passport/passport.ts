import { PassportStatic } from 'passport';
import { Strategy } from 'passport-local';
import { User } from '../models';
import { Logger } from '../utility';

export function configurePassport(passport: PassportStatic): PassportStatic {
   Logger.info('Configuring passport');

   passport.serializeUser((user: Express.User, done) => {
      Logger.info('User serialized');
      done(null, user);
   });

   passport.deserializeUser((user: Express.User, done) => {
      Logger.info('User deserialized');
      done(null, user);
   });

   passport.use(
      'local',
      new Strategy((username, password, done) => {
         Logger.info('Authenticating');
         User.findOne({ username })
            .then(user => {
               Logger.details('user', user);
               if (user) {
                  Logger.success('User found');
                  user.comparePassword(password, (error, _) => {
                     if (error) {
                        const message = 'Incorrect username or password';
                        Logger.error(message);
                        done(message);
                     } else {
                        Logger.success('Authentication successful');
                        done(null, user);
                     }
                  });
               } else {
                  Logger.error('User not found');
                  done(null, undefined);
               }
            })
            .catch(error => {
               Logger.error(error);
               done(error);
            });
      })
   );

   Logger.success('Passport configured');

   return passport;
}
