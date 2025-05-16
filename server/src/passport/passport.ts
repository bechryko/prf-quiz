import { PassportStatic } from 'passport';
import { Strategy } from 'passport-local';
import { User } from '../models';

export function configurePassport(passport: PassportStatic): PassportStatic {
   passport.serializeUser((user: Express.User, done) => {
      console.log('user is serialized.');
      done(null, user);
   });

   passport.deserializeUser((user: Express.User, done) => {
      console.log('user is deserialized.');
      done(null, user);
   });

   passport.use(
      'local',
      new Strategy((username, password, done) => {
         console.log('passport.use');
         User.findOne({ username })
            .then(user => {
               console.log('user', user);
               if (user) {
                  user.comparePassword(password, (error, _) => {
                     if (error) {
                        done('Incorrect username or password.');
                     } else {
                        done(null, user);
                     }
                  });
               } else {
                  done(null, undefined);
               }
            })
            .catch(error => {
               console.log(error);
               done(error);
            });
      })
   );

   return passport;
}
