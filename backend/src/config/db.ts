import mongoose from 'mongoose';
import { env } from './env';

export async function connectDb(): Promise<void> {
  await mongoose.connect(env.MONGODB_URI, {
    serverSelectionTimeoutMS: 8000,
  });
  console.log('MongoDB connected');
}
