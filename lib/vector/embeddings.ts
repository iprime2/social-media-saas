import { OpenAIEmbeddings } from "@langchain/openai";

export const embedder = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
});
