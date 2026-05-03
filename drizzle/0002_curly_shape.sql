CREATE TABLE "anthropometry_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"athlete_id" uuid NOT NULL,
	"recorded_by_id" uuid,
	"recorded_at" date NOT NULL,
	"height_cm" integer,
	"weight_dg" integer,
	"wingspan_cm" integer,
	"body_fat_pct_x10" integer,
	"lean_mass_pct_x10" integer,
	"bmi_x10" integer,
	"biological_age_x10" integer,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "anthropometry_records" ADD CONSTRAINT "anthropometry_records_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "anthropometry_records" ADD CONSTRAINT "anthropometry_records_athlete_id_athletes_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."athletes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "anthropometry_records" ADD CONSTRAINT "anthropometry_records_recorded_by_id_users_id_fk" FOREIGN KEY ("recorded_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "anthro_tenant_idx" ON "anthropometry_records" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "anthro_athlete_idx" ON "anthropometry_records" USING btree ("athlete_id");--> statement-breakpoint
CREATE INDEX "anthro_recorded_idx" ON "anthropometry_records" USING btree ("recorded_at");