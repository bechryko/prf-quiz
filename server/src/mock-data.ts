import { ObjectId } from 'mongoose';
import { Game, Quiz, User } from './models';

export function provideMockData(): void {
   mockAdminUser();
   mockAnimalGame();
}

function mockAdminUser(): void {
   User.findOne({ isAdmin: true }).then(adminUser => {
      if (!adminUser) {
         const newAdminUser = new User({
            username: 'testAdmin',
            password: 'testPassword',
            isAdmin: true
         });
         newAdminUser.save();
      }
   });
}

function mockAnimalGame(): void {
   const name = 'World of Animals 2';

   Game.findOne({ name }).then(game => {
      if (!game) {
         const newGame = new Game({
            name,
            ownerId: 'mockOwnerId',
            description: 'Do you know the world of animals enough?'
         });
         newGame.save().then(game => {
            const gameId = (game._id as ObjectId).toString();
            const newQuiz1 = new Quiz({
               name: 'General animal quiz',
               description:
                  'Some questions about animals general. Find out if you know the surface of this vast world!',
               gameId,
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
               ]
            });
            newQuiz1.save();
         });
      }
   });
}
