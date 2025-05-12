import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import expressSession from 'express-session';
import mongoose from 'mongoose';
import passport from 'passport';
import { configureEndpoints } from './endpoints';
import { configurePassport } from './passport/passport';

const app = express();
const port = 5000;
const dbUrl = 'mongodb://localhost:6000';

mongoose
   .connect(dbUrl)
   .then(result => {
      console.log('MongoDB state:', result.ConnectionStates[result.connection.readyState]);
   })
   .catch(console.error);

const whitelist = ['*', 'http://localhost:4200'];
const corsOptions = {
   origin: (origin: string | undefined, callback: (err: Error | null, allowed?: boolean) => void) => {
      if (whitelist.indexOf(origin!) !== -1 || whitelist.includes('*')) {
         callback(null, true);
      } else {
         callback(new Error('Not allowed by CORS.'));
      }
   },
   credentials: true
};
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const sessionOptions: expressSession.SessionOptions = {
   secret: 'testsecret',
   resave: false,
   saveUninitialized: false
};
app.use(expressSession(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());

configurePassport(passport);

app.use('/app', configureEndpoints(passport, express.Router()));

app.listen(port, () => {
   console.log('Server is listening on port ' + port.toString());
});

