ALTER TYPE "status" ADD VALUE 'complete';--> statement-breakpoint
ALTER TYPE "status" ADD VALUE 'expired';--> statement-breakpoint
ALTER TYPE "status" ADD VALUE 'open';--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'open';