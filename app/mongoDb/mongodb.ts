import mongoose, { Connection } from "mongoose";
import { MONGODB_URI, DB_NAME } from "@/constants";

// Define global type for caching
declare global {
    var mongooseCache:
        | {
              conn: Connection | null;
              promise: Promise<Connection> | null;
          }
        | undefined;
}

const cached = global.mongooseCache || {
    conn: null,
    promise: null,
};

global.mongooseCache = cached;

export async function connectDB(): Promise<Connection> {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(MONGODB_URI, {
                dbName: DB_NAME,
                bufferCommands: false,
            })
            .then((m) => m.connection);
    }

    cached.conn = await cached.promise;
    return cached.conn;
}
