CREATE TABLE IF NOT EXISTS "tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"token" numeric NOT NULL,
	CONSTRAINT "tokens_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "birthdate" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "email_verified";