CREATE TYPE "public"."exercise_category" AS ENUM('technical', 'tactical', 'physical', 'warmup', 'cooldown', 'fun', 'set_pieces', 'goalkeeper');--> statement-breakpoint
CREATE TYPE "public"."exercise_source" AS ENUM('platform', 'tenant');--> statement-breakpoint
CREATE TABLE "exercises" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid,
	"source" "exercise_source" DEFAULT 'tenant' NOT NULL,
	"name" text NOT NULL,
	"slug" text,
	"category" "exercise_category" NOT NULL,
	"objective" text,
	"age_min" integer DEFAULT 5 NOT NULL,
	"age_max" integer DEFAULT 17 NOT NULL,
	"duration_min" integer,
	"players_min" integer,
	"players_max" integer,
	"difficulty" integer,
	"materials" text[],
	"instructions" text,
	"variations" text,
	"coaching_points" text,
	"video_url" text,
	"image_url" text,
	"pitch_layout" jsonb,
	"tags" text[],
	"source_credit" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session_exercises" (
	"session_id" uuid NOT NULL,
	"exercise_id" uuid NOT NULL,
	"order_idx" integer DEFAULT 0 NOT NULL,
	"duration_override_min" integer,
	"notes" text,
	CONSTRAINT "session_exercises_session_id_exercise_id_pk" PRIMARY KEY("session_id","exercise_id")
);
--> statement-breakpoint
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_exercises" ADD CONSTRAINT "session_exercises_session_id_training_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."training_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_exercises" ADD CONSTRAINT "session_exercises_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "exercises_tenant_idx" ON "exercises" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "exercises_category_idx" ON "exercises" USING btree ("category");--> statement-breakpoint
CREATE INDEX "exercises_age_idx" ON "exercises" USING btree ("age_min","age_max");--> statement-breakpoint
CREATE INDEX "se_session_idx" ON "session_exercises" USING btree ("session_id");