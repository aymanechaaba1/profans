CREATE TABLE IF NOT EXISTS "ordersToTickets" (
	"orderId" uuid NOT NULL,
	"ticketId" uuid NOT NULL,
	CONSTRAINT "ordersToTickets_orderId_ticketId_pk" PRIMARY KEY("orderId","ticketId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tickets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	"price" numeric DEFAULT '0',
	"stock" numeric DEFAULT '0',
	"eventId" uuid
);
--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "total" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "createdAt" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "updatedAt" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "thumbnail" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "createdAt" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "updatedAt" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "userId" uuid;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "createdAt" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updatedAt" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN IF EXISTS "created_at";--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN IF EXISTS "updated_at";--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN IF EXISTS "price";--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN IF EXISTS "thumbnail_url";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "order_number";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "created_at";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "updated_at";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "user_id";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "created_at";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "updated_at";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ordersToTickets" ADD CONSTRAINT "ordersToTickets_orderId_orders_id_fk" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ordersToTickets" ADD CONSTRAINT "ordersToTickets_ticketId_tickets_id_fk" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
