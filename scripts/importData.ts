import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";

dotenv.config();

// 👇 use .ts extensions here
import { books } from "../src/app/data/books.ts";
import { reviews } from "../src/app/data/reviews.ts";

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB || "AmanaBookstore";

async function run() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log(`✅ Connected to database: ${dbName}`);

    const db = client.db(dbName);
    const booksCollection = db.collection("books");
    const reviewsCollection = db.collection("reviews");

    await booksCollection.deleteMany({});
    await reviewsCollection.deleteMany({});

    await booksCollection.insertMany(books);
    await reviewsCollection.insertMany(reviews);

    console.log("📚 Books and 📝 Reviews imported successfully!");
  } catch (err) {
    console.error("❌ Error importing data:", err);
  } finally {
    await client.close();
    console.log("🔌 Disconnected from MongoDB");
  }
}

run();

