import mongoose from 'mongoose';

// Define types for global mongoose connection
declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

// Initialize the global mongoose object if it doesn't exist
if (!global.mongoose) {
  global.mongoose = {
    conn: null,
    promise: null
  };
}

export async function dbConnect(): Promise<typeof mongoose> {
  if (!process.env.MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  // If we have an existing connection, return it
  if (global.mongoose?.conn) {
    console.log('Using existing database connection');
    return global.mongoose.conn;
  }

  try {
    // If a connection is being established, wait for it
    if (!global.mongoose?.promise) {
      console.log('Creating new database connection');
      const promise = mongoose.connect(process.env.MONGODB_URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 5000,
      });
      
      if (global.mongoose) {
        global.mongoose.promise = promise;
      }
    }

    // Wait for connection to be established
    const connection = await global.mongoose?.promise;
    if (connection && global.mongoose) {
      global.mongoose.conn = connection;
    }

    // Log connection state
    console.log(`Database connection state: ${mongoose.connection.readyState}`);

    return mongoose;
  } catch (error) {
    // Clear the promise in case of error to allow retry
    if (global.mongoose) {
      global.mongoose.promise = null;
    }
    console.error('Database connection error:', error);
    throw error;
  }
}

export default dbConnect;