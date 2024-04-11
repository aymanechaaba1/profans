CREATE TABLE IF NOT EXISTS "order_items" (
	"order_id" uuid NOT NULL,
	"ticket_id" uuid NOT NULL,
	CONSTRAINT "order_items_order_id_ticket_id_pk" PRIMARY KEY("order_id","ticket_id")
);
--> statement-breakpoint
DROP TABLE "orders_to_tickets";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_items" ADD CONSTRAINT "order_items_ticket_id_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
