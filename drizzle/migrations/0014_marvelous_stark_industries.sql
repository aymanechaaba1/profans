CREATE TABLE IF NOT EXISTS "cart_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	"quantity" integer NOT NULL,
	"cartId" uuid NOT NULL,
	"ticketId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "event_options" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	"name" text NOT NULL,
	"price" numeric DEFAULT '0',
	"eventId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders_to_tickets" (
	"orderId" uuid NOT NULL,
	"ticketId" uuid NOT NULL,
	CONSTRAINT "orders_to_tickets_orderId_ticketId_pk" PRIMARY KEY("orderId","ticketId")
);
--> statement-breakpoint
DROP TABLE "cartItems";--> statement-breakpoint
DROP TABLE "eventOptions";--> statement-breakpoint
DROP TABLE "ordersToTickets";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders_to_tickets" ADD CONSTRAINT "orders_to_tickets_orderId_orders_id_fk" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders_to_tickets" ADD CONSTRAINT "orders_to_tickets_ticketId_tickets_id_fk" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
