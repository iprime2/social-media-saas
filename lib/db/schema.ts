import { pgTable, text, timestamp, uuid, numeric } from "drizzle-orm/pg-core";

export const videos = pgTable("videos", {
  id: uuid("id").defaultRandom().primaryKey(),
  videoId: text("video_id").notNull(),
  title: text("title").notNull(),
  youtubeUrl: text("youtube_url").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

// Define the metrics table
export const metrics = pgTable("metrics", {
  id: uuid("id").defaultRandom().primaryKey(),
  videoId: uuid("video_id")
    .notNull()
    .references(() => videos.id, { onDelete: "cascade" }), // Foreign key to the videos table
  totalComments: numeric("total_comments").notNull(), // Total comments for the video
  positiveComments: numeric("positive_comments").notNull(), // Positive comments
  neutralComments: numeric("neutral_comments").notNull(), // Neutral comments
  negativeComments: numeric("negative_comments").notNull(), // Negative comments
  likenessPercentage: numeric("likeness_percentage", { precision: 5, scale: 2 }).notNull(), // Likeness percentage, with precision 5 and scale 2
  createdAt: timestamp("created_at").defaultNow(), // Timestamp when metrics are created
  updatedAt: timestamp("updated_at").defaultNow(), // Timestamp for when metrics are last updated
});