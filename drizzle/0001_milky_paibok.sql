ALTER TABLE "metrics" DROP CONSTRAINT "metrics_video_id_videos_id_fk";
--> statement-breakpoint
ALTER TABLE "metrics" ADD CONSTRAINT "metrics_video_id_videos_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."videos"("id") ON DELETE cascade ON UPDATE no action;