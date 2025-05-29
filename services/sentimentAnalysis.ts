import { PromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { LLMChain } from "langchain/chains";

export async function sentimentAnalysis(transcribe: any | undefined, comments: any[] | null)  {

    const model = new ChatOpenAI({
        temperature: 0.7,
        modelName: "gpt-4o-mini",
        openAIApiKey: process.env.OPENAI_API_KEY, 
      });
      
      const template = `
        You are a sentiment analysis expert.
        
        Given the video transcript and comments, analyze them and return:
        
        - Total number of comments analyzed
        - Number of positive comments
        - Number of negative comments
        - Number of neutral comments
        - Overall Video Likeness Percentage (based on positive vs total)
        
        Transcript 
        {transcribeData}
        Comments:
        {commentData}
        
        Respond in this JSON format:
        
        {{
          "total_comments": <number>,
          "positive_comments": <number>,
          "neutral_comments": <number>,
          "negative_comments": <number>,
          "likeness_percentage": <number>
        }}
      `;
      
      const prompt = new PromptTemplate({
        inputVariables: ["transcribeData", "commentData"],
        template,
      });
      
      // const promptString = await prompt.format({
      //   transcriptData: transcribe,
      //   CommentData: JSON.stringify(comments, null, 2),
      // });
  
      const chain = new LLMChain({
        llm: model,
        prompt,
      });
  
      // let attempts = 0;
      // let retries = 5;
      // let delay = 5000;
      // let commentData;
      // while (attempts < retries) {
      //   try {
      //     console.log(`Attempt ${attempts + 1} to fetch data from vector DB`);
      //     // Fetch the relevant transcription and comments from Pinecone
      //     commentData = await getRelevantTranscribeComments(videoId);
    
      //     if (commentData && commentData.length > 0) {
      //       console.log("Data fetched from vector DB");
      //       break;
      //     } else {
      //       console.log("No data found in vector DB, retrying...");
      //     }
      //   } catch (error) {
      //     console.error(`Error fetching data from vector DB (Attempt ${attempts + 1}):`, error);
      //   }
    
      //   // Increment the attempt counter and wait for the specified delay before retrying
      //   attempts++;
      //   if (attempts < retries) {
      //     console.log(`Waiting ${delay / 1000} seconds before retrying...`);
      //     await new Promise(resolve => setTimeout(resolve, delay)); // Pause for the specified delay (5 seconds)
      //   }
      // }
      
      console.log("Start AI Analysis!");
      const chatGptResponse = await chain.invoke({ 
        transcribeData: transcribe,
        commentData: JSON.stringify(comments, null, 2),
      });
      console.log("Done AI Analysis!");
      console.log("Chat Res", chatGptResponse);

      return chatGptResponse;
}