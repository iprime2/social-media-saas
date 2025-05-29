import { pinecone } from "./pinecone";

export async function getVectorTranscribe(videoId: string) {
  const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

  // Dummy vector (size must match your embedding size, usually 1536 for OpenAI)
  const dummyVector = Array(1536).fill(0);  

  const results = await index.query({
    vector: dummyVector,
    topK: 5000, // 5000
    includeMetadata: true,
    filter: {
      videoId: { $eq: videoId },
      type: "transcribe"
    },
  });

  const texts = results.matches?.map(match => (match.metadata as any).text) ?? [];
  return texts.join("\n");
}
