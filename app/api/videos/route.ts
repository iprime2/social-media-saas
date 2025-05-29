import { NextResponse } from "next/server";
import db from "@/lib/db/client";
import { metrics, videos } from "@/lib/db/schema";
import { extractVideoId } from "@/lib/extractVideoId";
import { processComments } from "@/services/processComment";
import { processTranscribe } from "@/services/processTranascribe";
import { sentimentAnalysis } from "@/services/sentimentAnalysis";

export async function GET() {
  const res = await db.select().from(videos);
  return NextResponse.json(res);
}

export async function POST(req: Request) {
  try {
    
    const body = await req.json();
    const { title, youtubeUrl, userId } = body;

    let videoId = extractVideoId(youtubeUrl);

    if(!videoId) return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });

    const comments = await processComments(youtubeUrl);
    const transcribe = await processTranscribe(youtubeUrl);

    let chatGptResponse = await sentimentAnalysis(transcribe, comments);
    let cleanedResponse;
    if(chatGptResponse.text){
      // Remove the markdown code block formatting
      cleanedResponse = chatGptResponse.text.replace(/```json\n|\n```/g, '').trim();
      console.log(cleanedResponse);
    }

    // Parse the JSON response from ChatGPT
    const parsedResponse =  JSON.parse(cleanedResponse);

    // Extract metrics data
    const { total_comments, positive_comments, neutral_comments, negative_comments, likeness_percentage } = parsedResponse;

    const videoRes = await db
      .insert(videos)
      .values({ title, youtubeUrl, videoId })
      .returning();

    // Insert the metrics into the database
    await db.insert(metrics).values({
      videoId: videoRes[0].id,
      totalComments: total_comments,
      positiveComments: positive_comments,
      neutralComments: neutral_comments,
      negativeComments: negative_comments,
      likenessPercentage: likeness_percentage,
    });

    return NextResponse.json({ success: true, result: chatGptResponse.text });
  } catch (error) {
    console.error("Error during POST request:", error);

    // Return a structured error response
    return NextResponse.json(
      //@ts-ignore
      { error: "An error occurred while processing the request.", details: error.message },
      { status: 500 }
    );
  }
}
