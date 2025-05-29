// File: /app/api/pinecone/delete/route.ts

import { pinecone } from "@/lib/vector/pinecone";
import { NextResponse } from "next/server";

export async function DELETE() {
  try {
    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

    // Delete all vectors from the index
    await index.deleteAll();

    console.log("All data deleted from the Pinecone index.");

    // Return a success response
    return NextResponse.json({ success: true, message: "All data deleted from Pinecone index." });
  } catch (error) {
    // Handle errors
    console.error("Error during Pinecone data deletion:", error);
    return NextResponse.json({ error: "Failed to delete data from Pinecone index." }, { status: 500 });
  }
}
