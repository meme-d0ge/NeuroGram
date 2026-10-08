CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"user_id" uuid NOT NULL,
	"session_token" varchar NOT NULL UNIQUE,
	"ip" varchar,
	"device" varchar,
	"platform" varchar,
	"application" varchar,
	"location" varchar,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_active_date" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;