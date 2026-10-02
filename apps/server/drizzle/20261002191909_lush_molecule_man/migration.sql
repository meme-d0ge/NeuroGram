CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"phone" varchar NOT NULL CONSTRAINT "users_phone_unique" UNIQUE,
	"first_name" varchar(64) NOT NULL,
	"last_name" varchar(64),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
