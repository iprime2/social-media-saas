import { extractVideoId } from "@/lib/extractVideoId";
import { upsertTranscribeToPinecone } from "@/lib/vector/upsert-transcribe";
import { loadYouTubeTranscript } from "@/lib/youtube/get-transcribe";

export async function processTranscribe(youtubeUrl: string) {
    let videoId = extractVideoId(youtubeUrl);

    if(!videoId) return null;
    
    console.log("Start Video transcribe");
    // Fetch Transcribe
    const transcribe = await loadYouTubeTranscript(youtubeUrl);
    console.log("Done Fetching Video transcribe");
    // console.log(transcribe);

    console.log("Start vectorizing Video transcribe");
    if(transcribe && transcribe?.length > 0){
      // Store Transcribe on vector db
      await upsertTranscribeToPinecone(videoId, transcribe);
    }
    console.log("Completed vectorizing Video transcribe");
  

    return transcribe;
}