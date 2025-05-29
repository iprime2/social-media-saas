import { pinecone } from "./pinecone";
import { embedder } from "./embeddings";

type metadataType = {
  source: string;
  description: string;
  title: string;
  view_count: Number;
  author: string;
};

type transcribeDataType = {
  pageContent: string;
  metadata: metadataType;
  id: any;
};

// Function to chunk text into smaller pieces
function chunkText(text: string, maxLength: number): string[] {
  const words = text.split(" ");
  const chunks: string[] = [];
  let currentChunk = "";

  for (let word of words) {
    if (currentChunk.length + word.length + 1 > maxLength) {
      chunks.push(currentChunk.trim());
      currentChunk = word;
    } else {
      currentChunk += " " + word;
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

export async function upsertTranscribeToPinecone(videoId: string, transcribeData: any[]) {
  const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

  // Combine all transcription content into one block
  const transcriptContent = transcribeData.map((doc) => doc.pageContent).join("\n");
  const metadata = transcribeData.map((doc) => doc.metadata);

  const maxTokenLength = 8192 - 200; // Keep some buffer space to avoid exceeding the limit

  // Split the transcriptContent into smaller chunks
  const chunks = chunkText(transcriptContent, maxTokenLength);

  let pineconeData = [];
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];

    const texts = [`Video Transcribe: ${chunk}`];
    const vectors = await embedder.embedDocuments(texts);

    pineconeData.push(
      ...vectors.map((vec: any, idx: number) => ({
        id: `${videoId}_${i}_${idx}_transcribe`,
        values: vec,
        metadata: {
          videoId,
          author: metadata[i]?.author, // Ensure metadata corresponds to the chunk
          text: chunk,
          type: "transcribe", 
        },
      }))
    );
  }

  // Store each chunk's vector in Pinecone
  await index.upsert(pineconeData);
}
