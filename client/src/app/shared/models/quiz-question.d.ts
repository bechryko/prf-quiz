import { QuizQuestionOption } from './quiz-question-option';

export interface QuizQuestion {
   title: string;
   question: string;
   options: QuizQuestionOption[];
   scoreValue: number;
}
