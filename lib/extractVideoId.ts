export function extractVideoId(youtubeUrl: string) {

    // Extract video ID from URL
    const videoIdMatch = youtubeUrl.match(/(?:v=|youtu\.be\/)([^&]+)/);

    if (!videoIdMatch)  return null;
       
    return videoIdMatch[1];    
}