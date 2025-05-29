import { pinecone } from "./pinecone";
import { embedder } from "./embeddings";

export async function upsertCommentsToPinecone(videoId: string, comments: any[]) {
  const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

  const texts = comments.map(
    (c) => `Comment: ${c.text} | Author: ${c.author} | Published: ${c.publishedAt}`
  );

  const vectors = await embedder.embedDocuments(texts);

  const pineconeData = vectors.map((vec: any, i: number) => ({
    id: `${videoId}_${i}_comment`,
    values: vec,
    metadata: {
      videoId,
      author: comments[i].author,
      publishedAt: comments[i].publishedAt,
      text: comments[i].text,
      type: "comment",
    },
  }));

  await index.upsert(pineconeData);
}
