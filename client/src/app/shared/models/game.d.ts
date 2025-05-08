import { Quiz } from './quiz';

export interface Game {
   name: string;
   id: string;
   ownerId: string;
   description: string;
   quizzes: Quiz[];
}
