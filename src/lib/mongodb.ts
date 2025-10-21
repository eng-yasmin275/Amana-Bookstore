// src/lib/mongodb.ts
import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env");
}

declare global {
  var mongoClientPromise: Promise<MongoClient> | undefined;
}

// Create a MongoClient
const client = new MongoClient(process.env.MONGODB_URI);
const clientPromise = client.connect();

if (process.env.NODE_ENV === "development") {
  // In development, use a global variable so we don't create multiple connections
  if (!global.mongoClientPromise) {
    global.mongoClientPromise = clientPromise;
  }
}

export default process.env.NODE_ENV === "development"
  ? global.mongoClientPromise!
  : clientPromise;
