import { LeaderboardEntry } from './leaderboard-entry';
import { QuizQuestion } from './quiz-question';

export interface Quiz {
   name: string;
   id: string;
   description?: string;
   questions: QuizQuestion[];
   leaderboard: LeaderboardEntry[];
}
