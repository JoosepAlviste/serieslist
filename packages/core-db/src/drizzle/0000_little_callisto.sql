-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations

DO $$ BEGIN
 CREATE TYPE "user_series_status_status" AS ENUM('Completed', 'OnHold', 'PlanToWatch', 'InProgress');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "episode" (
	"id" serial PRIMARY KEY NOT NULL,
	"imdb_id" varchar(15),
	"season_id" integer NOT NULL,
	"number" smallint NOT NULL,
	"title" varchar(255) NOT NULL,
	"released_at" date,
	"imdb_rating" numeric,
	"tmdb_id" integer NOT NULL,
	CONSTRAINT "episode_imdb_id_key" UNIQUE("imdb_id"),
	CONSTRAINT "episode_tmdb_id_key" UNIQUE("tmdb_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kysely_migration" (
	"name" varchar(255) PRIMARY KEY NOT NULL,
	"timestamp" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kysely_migration_lock" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"is_locked" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "season" (
	"id" serial PRIMARY KEY NOT NULL,
	"series_id" integer NOT NULL,
	"number" smallint NOT NULL,
	"tmdb_id" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	CONSTRAINT "season_tmdb_id_key" UNIQUE("tmdb_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "series" (
	"id" serial PRIMARY KEY NOT NULL,
	"imdb_id" varchar(15),
	"title" varchar(255) NOT NULL,
	"poster" varchar(255),
	"start_year" smallint,
	"end_year" smallint,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"runtime_minutes" smallint,
	"plot" text,
	"imdb_rating" numeric,
	"synced_at" timestamp with time zone,
	"tmdb_id" integer NOT NULL,
	CONSTRAINT "series_imdb_id_key" UNIQUE("imdb_id"),
	CONSTRAINT "series_tmdb_id_key" UNIQUE("tmdb_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"token" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" integer,
	"ip" varchar(55),
	"user_agent" varchar(255),
	"is_valid" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"is_admin" boolean DEFAULT false,
	"password" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_key" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "seen_episode" (
	"user_id" integer NOT NULL,
	"episode_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "seen_episode_pk" PRIMARY KEY("user_id","episode_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_series_status" (
	"series_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"status" "user_series_status_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_series_status_pk" PRIMARY KEY("series_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "series_progress" (
	"user_id" integer NOT NULL,
	"series_id" integer NOT NULL,
	"latest_seen_episode_id" integer NOT NULL,
	"next_episode_id" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "series_progress_pk" PRIMARY KEY("user_id","series_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "episode" ADD CONSTRAINT "episode_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "public"."season"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "season" ADD CONSTRAINT "season_series_id_fkey" FOREIGN KEY ("series_id") REFERENCES "public"."series"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "seen_episode" ADD CONSTRAINT "seen_episode_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "seen_episode" ADD CONSTRAINT "seen_episode_episode_id_fkey" FOREIGN KEY ("episode_id") REFERENCES "public"."episode"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_series_status" ADD CONSTRAINT "user_series_status_series_id_fkey" FOREIGN KEY ("series_id") REFERENCES "public"."series"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_series_status" ADD CONSTRAINT "user_series_status_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "series_progress" ADD CONSTRAINT "series_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "series_progress" ADD CONSTRAINT "series_progress_series_id_fkey" FOREIGN KEY ("series_id") REFERENCES "public"."series"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "series_progress" ADD CONSTRAINT "series_progress_latest_seen_episode_id_fkey" FOREIGN KEY ("latest_seen_episode_id") REFERENCES "public"."episode"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "series_progress" ADD CONSTRAINT "series_progress_next_episode_id_fkey" FOREIGN KEY ("next_episode_id") REFERENCES "public"."episode"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
