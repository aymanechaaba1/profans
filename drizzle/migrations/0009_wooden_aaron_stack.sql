CREATE TABLE IF NOT EXISTS "eventOptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	"name" text NOT NULL,
	"price" numeric DEFAULT '0',
	"eventId" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "optionId" uuid NOT NULL;