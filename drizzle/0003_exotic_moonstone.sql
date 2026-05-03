CREATE TYPE "public"."attendance_status" AS ENUM('present', 'absent', 'late', 'excused', 'injured');--> statement-breakpoint
CREATE TYPE "public"."injury_severity" AS ENUM('minor', 'moderate', 'severe');--> statement-breakpoint
CREATE TYPE "public"."match_kind" AS ENUM('friendly', 'official', 'training', 'tournament');--> statement-breakpoint
CREATE TYPE "public"."match_result" AS ENUM('win', 'draw', 'loss', 'pending');--> statement-breakpoint
CREATE TABLE "attendance" (
	"session_id" uuid NOT NULL,
	"athlete_id" uuid NOT NULL,
	"status" "attendance_status" DEFAULT 'present' NOT NULL,
	"notes" text,
	"recorded_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "attendance_session_id_athlete_id_pk" PRIMARY KEY("session_id","athlete_id")
);
--> statement-breakpoint
CREATE TABLE "injuries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"athlete_id" uuid NOT NULL,
	"type" text NOT NULL,
	"body_part" text,
	"severity" "injury_severity" DEFAULT 'minor' NOT NULL,
	"occurred_at" date NOT NULL,
	"days_out" integer,
	"returned_at" date,
	"description" text,
	"treatment" text,
	"attachment_url" text,
	"recorded_by_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "match_stats" (
	"match_id" uuid NOT NULL,
	"athlete_id" uuid NOT NULL,
	"minutes_played" integer,
	"goals" integer DEFAULT 0 NOT NULL,
	"assists" integer DEFAULT 0 NOT NULL,
	"yellow_cards" integer DEFAULT 0 NOT NULL,
	"red_cards" integer DEFAULT 0 NOT NULL,
	"position_played" text,
	"rating" integer,
	"notes" text,
	CONSTRAINT "match_stats_match_id_athlete_id_pk" PRIMARY KEY("match_id","athlete_id")
);
--> statement-breakpoint
CREATE TABLE "matches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"category_id" uuid,
	"kind" "match_kind" DEFAULT 'friendly' NOT NULL,
	"opponent" text NOT NULL,
	"date" date NOT NULL,
	"start_time" text,
	"location" text,
	"is_home" boolean DEFAULT true NOT NULL,
	"score_us" integer,
	"score_them" integer,
	"result" "match_result" DEFAULT 'pending' NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "physical_tests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"athlete_id" uuid NOT NULL,
	"recorded_by_id" uuid,
	"recorded_at" date NOT NULL,
	"test_code" text NOT NULL,
	"value_x1000" integer NOT NULL,
	"unit" text NOT NULL,
	"condition" jsonb,
	"observation" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "training_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"category_id" uuid,
	"coach_id" uuid,
	"date" date NOT NULL,
	"start_time" text,
	"duration_min" integer,
	"focus" text,
	"field" text,
	"weather" text,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_session_id_training_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."training_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_athlete_id_athletes_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."athletes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "injuries" ADD CONSTRAINT "injuries_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "injuries" ADD CONSTRAINT "injuries_athlete_id_athletes_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."athletes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "injuries" ADD CONSTRAINT "injuries_recorded_by_id_users_id_fk" FOREIGN KEY ("recorded_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_stats" ADD CONSTRAINT "match_stats_match_id_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_stats" ADD CONSTRAINT "match_stats_athlete_id_athletes_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."athletes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "physical_tests" ADD CONSTRAINT "physical_tests_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "physical_tests" ADD CONSTRAINT "physical_tests_athlete_id_athletes_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."athletes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "physical_tests" ADD CONSTRAINT "physical_tests_recorded_by_id_users_id_fk" FOREIGN KEY ("recorded_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "training_sessions" ADD CONSTRAINT "training_sessions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "training_sessions" ADD CONSTRAINT "training_sessions_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "training_sessions" ADD CONSTRAINT "training_sessions_coach_id_users_id_fk" FOREIGN KEY ("coach_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "att_athlete_idx" ON "attendance" USING btree ("athlete_id");--> statement-breakpoint
CREATE INDEX "injury_tenant_idx" ON "injuries" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "injury_athlete_idx" ON "injuries" USING btree ("athlete_id");--> statement-breakpoint
CREATE INDEX "ms_athlete_idx" ON "match_stats" USING btree ("athlete_id");--> statement-breakpoint
CREATE INDEX "match_tenant_idx" ON "matches" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "match_date_idx" ON "matches" USING btree ("tenant_id","date");--> statement-breakpoint
CREATE INDEX "match_category_idx" ON "matches" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "phys_tenant_idx" ON "physical_tests" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "phys_athlete_idx" ON "physical_tests" USING btree ("athlete_id");--> statement-breakpoint
CREATE INDEX "phys_test_idx" ON "physical_tests" USING btree ("test_code","recorded_at");--> statement-breakpoint
CREATE INDEX "training_tenant_idx" ON "training_sessions" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "training_date_idx" ON "training_sessions" USING btree ("tenant_id","date");--> statement-breakpoint
CREATE INDEX "training_category_idx" ON "training_sessions" USING btree ("category_id");