import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IQuizQuestion {
   title: string;
   question: string;
   options: IQuizQuestionOption[];
   scoreValue: number;
}

export interface IQuizQuestionOption {
   text: string;
   isCorrect?: boolean;
}

interface IQuiz extends Document {
   name: string;
   gameId: string;
   description: string;
   questions: IQuizQuestion[];
}

const QuizSchema: Schema<IQuiz> = new mongoose.Schema({
   name: { type: String, required: true },
   gameId: { type: String, required: true },
   description: { type: String, required: false },
   questions: { type: [], required: true }
});

export const Quiz: Model<IQuiz> = mongoose.model<IQuiz>('quiz', QuizSchema);
