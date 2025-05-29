import { notFound } from "next/navigation";
import { Video } from "@/app/dashboard/page"; // Adjust if your types differ
import { ChatBox } from "@/components/ChatBox";

const getEmbedUrl = (url: string) => {
  const videoId = new URL(url).searchParams.get("v");
  return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
};

const VideoDetail = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/videos/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    notFound();
  }

  const video: Video & {
    metrics?: {
      totalComments: number;
      positiveComments: number;
      neutralComments: number;
      negativeComments: number;
      likenessPercentage: number;
    };
  } = await res.json();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
        <iframe
          src={getEmbedUrl(video.youtubeUrl)}
          className="w-full max-w-xl h-64 rounded-md shadow-md"
          allowFullScreen
        />
      </div>

      {video.metrics ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-100 rounded-md shadow-sm">
            <p className="text-sm font-bold text-gray-600">Total Comments</p>
            <p className="text-lg font-semibold dark:text-black">{video.metrics.totalComments}</p>
          </div>
          <div className="p-4 bg-green-100 rounded-md shadow-sm">
            <p className="text-sm font-bold text-gray-600">Positive</p>
            <p className="text-lg font-semibold dark:text-black">{video.metrics.positiveComments}</p>
          </div>
          <div className="p-4 bg-yellow-100 rounded-md shadow-sm">
            <p className="text-sm font-bold text-gray-600">Neutral</p>
            <p className="text-lg font-semibold dark:text-black">{video.metrics.neutralComments}</p>
          </div>
          <div className="p-4 bg-red-100 rounded-md shadow-sm">
            <p className="text-sm font-bold text-gray-600">Negative</p>
            <p className="text-lg font-semibold dark:text-black">{video.metrics.negativeComments}</p>
          </div>
          <div className="p-4 bg-blue-100 rounded-md shadow-sm col-span-2">
            <p className="text-sm font-bold text-gray-600">Likeness %</p>
            <p className="text-2xl font-bold dark:text-black">{video.metrics.likenessPercentage}%</p>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No metrics available for this video yet.</p>
      )}

      <ChatBox videoId={video.videoId} />
    </div>
  );
};

export default VideoDetail;
