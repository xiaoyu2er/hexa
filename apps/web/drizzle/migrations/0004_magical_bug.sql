ALTER TABLE "user" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "oauth_account" DROP COLUMN IF EXISTS "created_at";--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN IF EXISTS "created_at";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "updated_at";