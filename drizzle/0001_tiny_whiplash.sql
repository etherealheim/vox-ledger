CREATE TABLE IF NOT EXISTS "politicians" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"twitter" varchar(255),
	"wikipedia" varchar(255),
	"party" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "votes" (
	"id" serial PRIMARY KEY NOT NULL,
	"politician_id" integer NOT NULL,
	"voting_session_id" integer NOT NULL,
	"vote" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "voting_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" date NOT NULL,
	"time" time NOT NULL,
	"title" text NOT NULL,
	"meeting_details" text NOT NULL
);
--> statement-breakpoint
DROP TABLE "users";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "votes" ADD CONSTRAINT "votes_politician_id_politicians_id_fk" FOREIGN KEY ("politician_id") REFERENCES "public"."politicians"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "votes" ADD CONSTRAINT "votes_voting_session_id_voting_sessions_id_fk" FOREIGN KEY ("voting_session_id") REFERENCES "public"."voting_sessions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
