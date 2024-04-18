ALTER TABLE "events" ALTER COLUMN "name" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "name" SET NOT NULL;