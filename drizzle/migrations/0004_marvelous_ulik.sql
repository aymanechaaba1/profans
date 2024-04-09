CREATE TABLE IF NOT EXISTS "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"name" text DEFAULT '',
	"description" text DEFAULT '',
	"time" timestamp NOT NULL,
	"location" text NOT NULL,
	"price" numeric NOT NULL,
	"team_id_1" text NOT NULL,
	"team_id_2" text NOT NULL
);
