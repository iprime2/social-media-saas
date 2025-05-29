import { NextResponse } from "next/server";
import db from "@/lib/db/client";
import { metrics, videos } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// GET /api/videos/:id
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    const video = await db
      .select({
        videoId: videos.videoId,
        title: videos.title,
        youtubeUrl: videos.youtubeUrl,
        uploadedAt: videos.uploadedAt,
        metrics: {
          totalComments: metrics.totalComments,
          positiveComments: metrics.positiveComments,
          neutralComments: metrics.neutralComments,
          negativeComments: metrics.negativeComments,
          likenessPercentage: metrics.likenessPercentage,
          createdAt: metrics.createdAt,
          updatedAt: metrics.updatedAt,
        }
      })
      .from(videos)
      .leftJoin(metrics, eq(videos.id, metrics.videoId))
      .where(eq(videos.id, id));

    if (!video || video.length === 0) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json(video[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE /api/videos/:id
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "Video ID is required" }, { status: 400 });

    await db.delete(videos).where(eq(videos.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting video:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}