import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = {
        conn: null,
        promise: null
    }
}

export async function connectToDB() {
    if (cached.conn){
        return cached.conn;
    }
    if (!cached.promise) {
        const opts = {
            bufferCommands: true,
            maxPoolSize: 10
        };
        cached.promise = mongoose.connect(MONGODB_URI, opts).then(mongoose => {
            cached.conn = mongoose.connection;
            return cached.conn;
        });
    }
    try{
        cached.conn = await cached.promise;
    }
    catch (error) {
        cached.promise = null;
        throw new Error(`Failed to connect to MongoDB:`);
    }

    return cached.conn;

}
