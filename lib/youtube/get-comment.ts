import axios from "axios";

export interface YoutubeComment {
  commentId: string;
  text: string;
  author: string;
  publishedAt: string;
}

export const getYoutubeComments = async (videoId: string) => {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error("YOUTUBE_API_KEY is not set");

  let allComments: any[] = [];
  let nextPageToken: string | undefined = "";
  // let i = 0;

  try {
    do {
      // @ts-ignore
      const response = await axios.get("https://www.googleapis.com/youtube/v3/commentThreads", {
        params: {
          part: "snippet",
          videoId,
          key: apiKey,
          maxResults: 100,
          pageToken: nextPageToken,
          textFormat: "plainText",
        },
      });
  
      const pageComments = response.data.items.map((item: any) => ({
        commentId: item.id,
        text: item.snippet.topLevelComment.snippet.textDisplay,
        author: item.snippet.topLevelComment.snippet.authorDisplayName,
        publishedAt: item.snippet.topLevelComment.snippet.publishedAt,
      }));
  
      allComments = allComments.concat(pageComments);
      nextPageToken = response.data.nextPageToken;
  
    } while (nextPageToken);

    return allComments;
  } catch (err) {
    console.error("Error fetching comments:", err);
    return [];
  }
};
