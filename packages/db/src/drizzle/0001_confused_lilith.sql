DROP TABLE "kysely_migration";--> statement-breakpoint
DROP TABLE "kysely_migration_lock";--> statement-breakpoint
ALTER TABLE "episode" DROP CONSTRAINT "episode_season_id_fkey";
--> statement-breakpoint
ALTER TABLE "season" DROP CONSTRAINT "season_series_id_fkey";
--> statement-breakpoint
ALTER TABLE "session" DROP CONSTRAINT "session_user_id_fkey";
--> statement-breakpoint
ALTER TABLE "seen_episode" DROP CONSTRAINT "seen_episode_user_id_fkey";
--> statement-breakpoint
ALTER TABLE "seen_episode" DROP CONSTRAINT "seen_episode_episode_id_fkey";
--> statement-breakpoint
ALTER TABLE "user_series_status" DROP CONSTRAINT "user_series_status_series_id_fkey";
--> statement-breakpoint
ALTER TABLE "user_series_status" DROP CONSTRAINT "user_series_status_user_id_fkey";
--> statement-breakpoint
ALTER TABLE "series_progress" DROP CONSTRAINT "series_progress_user_id_fkey";
--> statement-breakpoint
ALTER TABLE "series_progress" DROP CONSTRAINT "series_progress_series_id_fkey";
--> statement-breakpoint
ALTER TABLE "series_progress" DROP CONSTRAINT "series_progress_latest_seen_episode_id_fkey";
--> statement-breakpoint
ALTER TABLE "series_progress" DROP CONSTRAINT "series_progress_next_episode_id_fkey";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "episode" ADD CONSTRAINT "episode_season_id_season_id_fk" FOREIGN KEY ("season_id") REFERENCES "season"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "season" ADD CONSTRAINT "season_series_id_series_id_fk" FOREIGN KEY ("series_id") REFERENCES "series"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "seen_episode" ADD CONSTRAINT "seen_episode_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "seen_episode" ADD CONSTRAINT "seen_episode_episode_id_episode_id_fk" FOREIGN KEY ("episode_id") REFERENCES "episode"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_series_status" ADD CONSTRAINT "user_series_status_series_id_series_id_fk" FOREIGN KEY ("series_id") REFERENCES "series"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_series_status" ADD CONSTRAINT "user_series_status_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "series_progress" ADD CONSTRAINT "series_progress_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "series_progress" ADD CONSTRAINT "series_progress_series_id_series_id_fk" FOREIGN KEY ("series_id") REFERENCES "series"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "series_progress" ADD CONSTRAINT "series_progress_latest_seen_episode_id_episode_id_fk" FOREIGN KEY ("latest_seen_episode_id") REFERENCES "episode"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "series_progress" ADD CONSTRAINT "series_progress_next_episode_id_episode_id_fk" FOREIGN KEY ("next_episode_id") REFERENCES "episode"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
