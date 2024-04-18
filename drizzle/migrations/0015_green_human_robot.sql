ALTER TABLE "orders_to_tickets" DROP CONSTRAINT "orders_to_tickets_orderId_orders_id_fk";
--> statement-breakpoint
ALTER TABLE "orders_to_tickets" DROP CONSTRAINT "orders_to_tickets_ticketId_tickets_id_fk";
--> statement-breakpoint
ALTER TABLE "orders_to_tickets" DROP CONSTRAINT "orders_to_tickets_orderId_ticketId_pk";--> statement-breakpoint
ALTER TABLE "orders_to_tickets" ADD CONSTRAINT "orders_to_tickets_order_id_ticket_id_pk" PRIMARY KEY("order_id","ticket_id");--> statement-breakpoint
ALTER TABLE "cart" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "cart" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "cart" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "cart_items" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "cart_items" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "cart_items" ADD COLUMN "cart_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "cart_items" ADD COLUMN "ticket_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "event_options" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "event_options" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "event_options" ADD COLUMN "event_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "orders_to_tickets" ADD COLUMN "order_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "orders_to_tickets" ADD COLUMN "ticket_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "event_id" uuid;--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "option_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders_to_tickets" ADD CONSTRAINT "orders_to_tickets_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders_to_tickets" ADD CONSTRAINT "orders_to_tickets_ticket_id_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "cart" DROP COLUMN IF EXISTS "createdAt";--> statement-breakpoint
ALTER TABLE "cart" DROP COLUMN IF EXISTS "updatedAt";--> statement-breakpoint
ALTER TABLE "cart" DROP COLUMN IF EXISTS "userId";--> statement-breakpoint
ALTER TABLE "cart_items" DROP COLUMN IF EXISTS "createdAt";--> statement-breakpoint
ALTER TABLE "cart_items" DROP COLUMN IF EXISTS "updatedAt";--> statement-breakpoint
ALTER TABLE "cart_items" DROP COLUMN IF EXISTS "cartId";--> statement-breakpoint
ALTER TABLE "cart_items" DROP COLUMN IF EXISTS "ticketId";--> statement-breakpoint
ALTER TABLE "event_options" DROP COLUMN IF EXISTS "createdAt";--> statement-breakpoint
ALTER TABLE "event_options" DROP COLUMN IF EXISTS "updatedAt";--> statement-breakpoint
ALTER TABLE "event_options" DROP COLUMN IF EXISTS "eventId";--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN IF EXISTS "createdAt";--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN IF EXISTS "updatedAt";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "createdAt";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "updatedAt";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "userId";--> statement-breakpoint
ALTER TABLE "orders_to_tickets" DROP COLUMN IF EXISTS "orderId";--> statement-breakpoint
ALTER TABLE "orders_to_tickets" DROP COLUMN IF EXISTS "ticketId";--> statement-breakpoint
ALTER TABLE "tickets" DROP COLUMN IF EXISTS "createdAt";--> statement-breakpoint
ALTER TABLE "tickets" DROP COLUMN IF EXISTS "updatedAt";--> statement-breakpoint
ALTER TABLE "tickets" DROP COLUMN IF EXISTS "eventId";--> statement-breakpoint
ALTER TABLE "tickets" DROP COLUMN IF EXISTS "optionId";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "createdAt";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "updatedAt";