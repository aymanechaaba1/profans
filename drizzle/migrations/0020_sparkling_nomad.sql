ALTER TABLE "order_items" ADD COLUMN "id" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "updated_at" timestamp DEFAULT now();