import { extractVideoId } from "@/lib/extractVideoId";
import { upsertCommentsToPinecone } from "@/lib/vector/upsert-comments";
import { getYoutubeComments } from "@/lib/youtube/get-comment";

export async function processComments(youtubeUrl: string) {
    
    let videoId = extractVideoId(youtubeUrl);

    if(!videoId) return null;

    console.log("Fetching Video comments");
    // Fetch comments
    const comments = await getYoutubeComments(videoId);
    console.log("Done fetching Video comments");
    console.log("Comment Length: ", comments.length);
    
    console.log("started vectorizing Video transcribe");
    // Store Transcribe on vector db
    upsertCommentsToPinecone(videoId, comments);
    console.log("Completed vectorizing Video transcribe");

    return comments;
}