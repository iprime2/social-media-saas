"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { InferModel } from "drizzle-orm";
import { videos } from "@/lib/db/schema";
import { useRouter } from "next/navigation";

export type Video = InferModel<typeof videos>;

const Dashboard = () => {
  const [videosData, setVideosData] = useState<Video[]>([]);
  const [title, setTitle] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");

  const router = useRouter();

  const fetchVideos = async () => {
    try {
      const { data } = await axios.get("/api/videos");
      setVideosData(data);
    } catch (err) {
      console.error("Error fetching videos:", err);
    }
  };

  const handleAddVideo = async () => {
    if (!title || !youtubeUrl) return;
    try {
      const res = await axios.post("/api/videos", {
        title,
        youtubeUrl,
        userId: "anonymous", // TODO: Replace with actual user ID
      });
      setTitle("");
      setYoutubeUrl("");
      fetchVideos(); // Refresh list

      console.error(res);
    } catch (err) {
      console.error("Error adding video:", err);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    try {
      await axios.delete(`/api/videos/${id}`);
      fetchVideos();
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  const handleDeleteVectors = async () => {
    try {
      // Call the API to delete all vectors from the Pinecone index
      await axios.delete("/api/pinecone");
      alert("All vectors deleted from Pinecone index.");
    } catch (error) {
      console.error("Error deleting vectors:", error);
      alert("Failed to delete vectors from Pinecone index.");
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div className="container space-y-6 p-4">
      <div className="space-x-2">
        <input
          type="text"
          placeholder="Video Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="YouTube URL"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={handleAddVideo}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Video
        </button>

        {/* Delete Button to Delete Vectors from Pinecone */}
        <button
          onClick={handleDeleteVectors}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Delete All Vectors
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {videosData.map((video) => (
          <Card
            key={video.id}
            className="relative hover:cursor-pointer"
            onClick={() => router.push(`/dashboard/${video.id}`)}
          >
            <div className="p-4 space-y-2">
              <h2 className="font-bold text-lg">{video.title}</h2>
              <p className="text-sm text-gray-600 break-words">{video.youtubeUrl}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card navigation
                  handleDeleteVideo(video.id);
                }}
                className="mt-2 text-sm text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
