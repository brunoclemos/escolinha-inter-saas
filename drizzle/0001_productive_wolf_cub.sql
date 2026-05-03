CREATE TYPE "public"."evaluation_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TABLE "eval_psych" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"evaluation_id" uuid NOT NULL,
	"dimension" text NOT NULL,
	"score" integer NOT NULL,
	"comment" text
);
--> statement-breakpoint
CREATE TABLE "eval_tactical" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"evaluation_id" uuid NOT NULL,
	"dimension" text NOT NULL,
	"score" integer NOT NULL,
	"comment" text
);
--> statement-breakpoint
CREATE TABLE "eval_technical" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"evaluation_id" uuid NOT NULL,
	"fundamental" text NOT NULL,
	"score" integer NOT NULL,
	"comment" text
);
--> statement-breakpoint
CREATE TABLE "evaluations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"athlete_id" uuid NOT NULL,
	"evaluator_id" uuid,
	"period_label" text,
	"period_start" date,
	"period_end" date,
	"status" "evaluation_status" DEFAULT 'draft' NOT NULL,
	"summary_text" text,
	"tech_score" integer,
	"tactical_score" integer,
	"psych_score" integer,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "eval_psych" ADD CONSTRAINT "eval_psych_evaluation_id_evaluations_id_fk" FOREIGN KEY ("evaluation_id") REFERENCES "public"."evaluations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eval_tactical" ADD CONSTRAINT "eval_tactical_evaluation_id_evaluations_id_fk" FOREIGN KEY ("evaluation_id") REFERENCES "public"."evaluations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eval_technical" ADD CONSTRAINT "eval_technical_evaluation_id_evaluations_id_fk" FOREIGN KEY ("evaluation_id") REFERENCES "public"."evaluations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_athlete_id_athletes_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."athletes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_evaluator_id_users_id_fk" FOREIGN KEY ("evaluator_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "eval_psych_eval_idx" ON "eval_psych" USING btree ("evaluation_id");--> statement-breakpoint
CREATE INDEX "eval_tactical_eval_idx" ON "eval_tactical" USING btree ("evaluation_id");--> statement-breakpoint
CREATE INDEX "eval_tech_eval_idx" ON "eval_technical" USING btree ("evaluation_id");--> statement-breakpoint
CREATE INDEX "eval_tenant_idx" ON "evaluations" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "eval_athlete_idx" ON "evaluations" USING btree ("athlete_id");--> statement-breakpoint
CREATE INDEX "eval_status_idx" ON "evaluations" USING btree ("tenant_id","status");