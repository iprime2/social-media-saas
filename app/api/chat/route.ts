import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";
import { pinecone } from "@/lib/vector/pinecone";
import { PineconeStore } from "@langchain/community/vectorstores/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { LLMChain } from "langchain/chains";
import { getYoutubeComments } from "@/lib/youtube/get-comment";
import { getVectorComments } from "@/lib/vector/getVectorComments";
import { getVectorTranscribe } from "@/lib/vector/getVectorTranscribe";

export async function POST(req: Request) {
    const { videoId, userQuery } = await req.json();

    if (!videoId || !userQuery) {
        return new Response("Missing videoId or userQuery", { status: 400 });
    }

    // Set up vector store
    const vectorStore = await PineconeStore.fromExistingIndex(
        new OpenAIEmbeddings(),
        {
        pineconeIndex: pinecone.Index(process.env.PINECONE_INDEX_NAME!),
        namespace: videoId, // Keeps each video's data separate
        }
    );

    // Create retriever
    const retriever = vectorStore.asRetriever({
        k: 10,
    });

    // Prompt template
    // const template = `
    //     You are a helpful assistant for analyzing YouTube content.
    //     Use the following context (transcripts + comments) to answer the user's question.
    //     you need also stick to conext if user ask something about videos transcribe and it's comment.

    //     Context:
    //     {context}

    //     Question:
    //     {question}
    // `;

    const template = `
        You are a helpful assistant for analyzing YouTube content.
        Use the following transcripts comments to answer the user's question.
        you need also stick to conext if user ask something about videos transcribe and it's comment.

        Transcript 
        {transcribeData}
        Comments:
        {commentData}

        Question:
        {question}
    `;

    const prompt = new PromptTemplate({
        inputVariables: ["transcribeData", "commentData", "question"],
        template,
    });

    const model = new ChatOpenAI({
        temperature: 0.7,
        modelName: "gpt-4o-mini",
        openAIApiKey: process.env.OPENAI_API_KEY, 
      });

    const chain = new LLMChain({
        llm: model,
        prompt,
      });

    const transcribe = getVectorComments(videoId);
    const comments = getVectorTranscribe(videoId);
  
    const chatGptResponse = await chain.invoke({ 
        transcribeData: transcribe,
        commentData: JSON.stringify(comments, null, 2),
        question: userQuery,
    });

    console.log(chatGptResponse)

    return Response.json({ answer: chatGptResponse.text });


    // const prompt = new PromptTemplate({
    //     inputVariables: ["question", "context",],
    //     template,
    // });

    // // Chain
    // const chain = RunnableSequence.from([
    //     async (input: { question: string }) => {
    //         if (!input?.question || typeof input.question !== 'string') {
    //             throw new Error("Invalid or missing 'question' input");
    //         }
        
    //         const docs = await retriever.getRelevantDocuments(input.question);
            
    //         // Log each document's metadata and a snippet of content
    //         console.log("🔍 Retrieved Documents:");
    //         console.log(docs);
    //         docs.forEach((doc, i) => {
    //           console.log(`--- Document ${i + 1} ---`);
    //           console.log("Metadata:", doc.metadata);
    //           console.log("Snippet:", doc.pageContent.slice(0, 200));
    //           console.log("------------------------");
    //         });
        
    //         return {
    //           ...input,
    //           context: docs.map((d) => d.pageContent).join("\n"),
    //         };
    //     },
    //     prompt,
    //     new ChatOpenAI({ modelName: "gpt-4o-mini", temperature: 0.6 }),
    // ]);

    // // Invoke chain
    // const response = await chain.invoke({
    //     question: userQuery,
    // });

    // return Response.json({ answer: response.content });
}
