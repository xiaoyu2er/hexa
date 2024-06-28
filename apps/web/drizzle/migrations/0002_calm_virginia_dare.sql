ALTER TYPE "tokenType" ADD VALUE 'RESET_PASSWORD';--> statement-breakpoint
ALTER TYPE "tokenType" ADD VALUE 'VERIFY_EMAIL';--> statement-breakpoint
ALTER TABLE "token" RENAME COLUMN "token_hash" TO "token";--> statement-breakpoint
ALTER TABLE "token" ADD COLUMN "code" text NOT NULL;