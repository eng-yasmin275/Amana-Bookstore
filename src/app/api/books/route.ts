import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    console.log("📡 Fetching data from MongoDB..."); // 👈 add this line

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "AmanaBookstore");

    const books = await db.collection("books").find({}).toArray();

    return NextResponse.json(books);
  } catch (err) {
    console.error("❌ Error fetching books from MongoDB:", err);
    return NextResponse.json(
      { error: "Failed to fetch books from database" },
      { status: 500 }
    );
  }
}
