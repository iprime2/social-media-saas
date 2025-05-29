import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
import fs from "fs";

export const loadYouTubeTranscript = async (videoUrl: string) => {
  try {
    const loader = YoutubeLoader.createFromUrl(videoUrl, {
      language: "en", // Specify the language of the transcript
      addVideoInfo: true, // Optionally add video metadata
    });

    // Load the transcript
    const docs = await loader.load();

    // Extract the transcript content
    // const transcriptContent = docs.map((doc) => doc.pageContent).join("\n");

    // Extract video ID from URL (fix for URL format)
    const videoIdMatch = videoUrl.match(/(?:v=|youtu\.be\/)([^&?]+)/);
    if (!videoIdMatch) {
      console.error("Error: Could not extract video ID from the URL.");
      return;
    }
    const videoId = videoIdMatch[1];

    // Create a valid file path using video ID (no URL characters in filename)
    const filePath = `transcribe_${videoId}.txt`;

    // Save the transcript to a file
    // fs.writeFileSync(filePath, transcriptContent, "utf-8");

    return docs;
  } catch (error) {
    console.error("Error loading YouTube transcript:", error);
  }
};
