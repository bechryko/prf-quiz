import mongoose, { Model, Schema } from 'mongoose';

interface ILeaderboardEntry {
   quizId: string;
   username: string;
   score: number;
}

const QuizSchema: Schema<ILeaderboardEntry> = new mongoose.Schema({
   quizId: { type: String, required: true },
   username: { type: String, required: true },
   score: { type: Number, required: true }
});

export const LeaderboardEntry: Model<ILeaderboardEntry> = mongoose.model<ILeaderboardEntry>(
   'leaderboardEntry',
   QuizSchema
);
