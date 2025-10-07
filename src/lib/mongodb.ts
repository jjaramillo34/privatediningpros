import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = (global as typeof globalThis & { mongoose: { conn: mongoose.Connection | null; promise: Promise<typeof mongoose> | null } | null }).mongoose;

if (!cached) {
  cached = (global as typeof globalThis & { mongoose: { conn: mongoose.Connection | null; promise: Promise<typeof mongoose> | null } }).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached && cached.conn) {
    return cached.conn;
  }

  if (!cached || !cached.promise) {
    if (!cached) {
      cached = (global as typeof globalThis & { mongoose: { conn: mongoose.Connection | null; promise: Promise<typeof mongoose> | null } }).mongoose = { conn: null, promise: null };
    }
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }
  if (cached) {
    await cached.promise;
    cached.conn = mongoose.connection;
    return cached.conn;
  }
  throw new Error('Database connection failed');
}

export default dbConnect; 