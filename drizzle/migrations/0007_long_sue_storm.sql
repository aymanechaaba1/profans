ALTER TABLE "events" ADD COLUMN "thumbnail_url" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN IF EXISTS "team_id_1";--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN IF EXISTS "team_id_2";