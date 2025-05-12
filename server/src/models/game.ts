import mongoose, { Document, Model, Schema } from 'mongoose';

interface IGame extends Document {
   name: string;
   ownerId: string;
   description: string;
}

const GameSchema: Schema<IGame> = new mongoose.Schema({
   name: { type: String, required: true },
   ownerId: { type: String, required: true },
   description: { type: String, required: true }
});

export const Game: Model<IGame> = mongoose.model<IGame>('game', GameSchema);
