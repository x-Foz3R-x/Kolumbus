DO $$ BEGIN
 CREATE TYPE "event_type" AS ENUM('ACTIVITY', 'DINING', 'ACCOMMODATION', 'TRANSPORTATION', 'FLIGHT', 'NOTE', 'MARKER', 'GROUP');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "currency" AS ENUM('AUD', 'CAD', 'CHF', 'EUR', 'GBP', 'HUF', 'INR', 'JPY', 'KRW', 'PLN', 'RUB', 'USD');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "transportation_type" AS ENUM('BUS', 'CAR', 'TRAIN', 'TRAM', 'TAXI', 'SUBWAY', 'FERRY', 'BIKE', 'WALK');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "activities" (
	"id" text PRIMARY KEY NOT NULL,
	"event_id" text NOT NULL,
	"place_id" text,
	"name" text NOT NULL,
	"start_time" text,
	"end_time" text,
	"opening_hours" jsonb[],
	"address" text,
	"phone_number" text,
	"website" text,
	"cost" numeric(10, 2) DEFAULT '0' NOT NULL,
	"currency" "currency" DEFAULT 'USD' NOT NULL,
	"photos" text[],
	"photo_index" smallint DEFAULT 0 NOT NULL,
	"note" text,
	"url" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "events" (
	"id" text PRIMARY KEY NOT NULL,
	"trip_id" text NOT NULL,
	"date" text NOT NULL,
	"position" smallint NOT NULL,
	"type" "event_type" NOT NULL,
	"created_by" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "flights" (
	"id" text PRIMARY KEY NOT NULL,
	"event_id" text NOT NULL,
	"flight_number" text,
	"airline" text,
	"seat" text,
	"departure" jsonb,
	"arrival" jsonb,
	"cost" numeric(10, 2) DEFAULT '0' NOT NULL,
	"currency" "currency" DEFAULT 'USD' NOT NULL,
	"note" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "trips" (
	"id" text PRIMARY KEY NOT NULL,
	"owner_id" text NOT NULL,
	"name" text NOT NULL,
	"start_date" text NOT NULL,
	"end_date" text NOT NULL,
	"photo" text,
	"invite_code" text,
	"invite_created_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "trips_invite_code_unique" UNIQUE("invite_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "memberships" (
	"user_id" text NOT NULL,
	"trip_id" text NOT NULL,
	"owner" boolean NOT NULL,
	"permissions" integer NOT NULL,
	"trip_position" smallint NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "memberships_pkey" PRIMARY KEY("trip_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transportations" (
	"id" text PRIMARY KEY NOT NULL,
	"event_id" text NOT NULL,
	"transportation_type" "transportation_type" DEFAULT 'CAR' NOT NULL,
	"seat" text,
	"departure" jsonb,
	"arrival" jsonb,
	"cost" numeric(10, 2) DEFAULT '0' NOT NULL,
	"currency" "currency" DEFAULT 'USD' NOT NULL,
	"note" text
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "activities_event_id_idx" ON "activities" ("event_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "events_trip_id_idx" ON "events" ("trip_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "flights_event_id_idx" ON "flights" ("event_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "owner_id_idx" ON "trips" ("owner_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "memberships_user_id_idx" ON "memberships" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "memberships_trip_id_idx" ON "memberships" ("trip_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "transportations_event_id_idx" ON "transportations" ("event_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "activities" ADD CONSTRAINT "activities_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "events" ADD CONSTRAINT "events_trip_id_trips_id_fk" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "flights" ADD CONSTRAINT "flights_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "memberships" ADD CONSTRAINT "memberships_trip_id_trips_id_fk" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transportations" ADD CONSTRAINT "transportations_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
