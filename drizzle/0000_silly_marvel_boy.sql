CREATE TYPE "public"."athlete_status" AS ENUM('active', 'inactive', 'transferred', 'graduated');--> statement-breakpoint
CREATE TYPE "public"."dominant_foot" AS ENUM('right', 'left', 'both');--> statement-breakpoint
CREATE TYPE "public"."guardian_relationship" AS ENUM('father', 'mother', 'stepfather', 'stepmother', 'tutor', 'grandfather', 'grandmother', 'uncle', 'aunt', 'sibling', 'other');--> statement-breakpoint
CREATE TYPE "public"."tenant_plan" AS ENUM('trial', 'starter', 'pro', 'premium', 'franchise');--> statement-breakpoint
CREATE TYPE "public"."tenant_status" AS ENUM('active', 'suspended', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('super_admin', 'school_owner', 'coordinator', 'coach', 'parent', 'athlete', 'scout_external');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('active', 'invited', 'suspended');--> statement-breakpoint
CREATE TABLE "athlete_categories" (
	"athlete_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	"left_at" timestamp with time zone,
	CONSTRAINT "athlete_categories_athlete_id_category_id_pk" PRIMARY KEY("athlete_id","category_id")
);
--> statement-breakpoint
CREATE TABLE "athlete_guardians" (
	"athlete_id" uuid NOT NULL,
	"guardian_id" uuid NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"can_pickup" boolean DEFAULT true NOT NULL,
	"financial_responsible" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "athlete_guardians_athlete_id_guardian_id_pk" PRIMARY KEY("athlete_id","guardian_id")
);
--> statement-breakpoint
CREATE TABLE "athletes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"user_id" uuid,
	"full_name" text NOT NULL,
	"nickname" text,
	"dob" date NOT NULL,
	"cpf" text,
	"rg" text,
	"nationality" text DEFAULT 'BR',
	"natural_city" text,
	"address" jsonb,
	"photo_url" text,
	"photo_side_url" text,
	"photo_full_url" text,
	"position_main" text,
	"position_secondary" text[],
	"dominant_foot" "dominant_foot",
	"jersey_number" integer,
	"status" "athlete_status" DEFAULT 'active' NOT NULL,
	"height_cm" integer,
	"weight_kg" integer,
	"blood_type" text,
	"allergies" text,
	"medications" text,
	"health_plan" text,
	"emergency_contact" jsonb,
	"school_name" text,
	"school_grade" text,
	"school_shift" text,
	"entry_date" date,
	"entry_origin" text,
	"entry_coach_id" uuid,
	"entry_notes" text,
	"previous_club" text,
	"years_playing" integer,
	"dream" text,
	"image_consent_doc_url" text,
	"image_consent_signed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid,
	"actor_user_id" uuid,
	"action" text NOT NULL,
	"target_table" text,
	"target_id" text,
	"diff" jsonb,
	"ip" text,
	"user_agent" text,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"name" text NOT NULL,
	"age_min" integer NOT NULL,
	"age_max" integer NOT NULL,
	"color" text,
	"head_coach_id" uuid,
	"schedule" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "guardians" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"user_id" uuid,
	"full_name" text NOT NULL,
	"relationship" "guardian_relationship" NOT NULL,
	"phone" text,
	"whatsapp" text,
	"email" text,
	"cpf" text,
	"address" jsonb,
	"occupation" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tenants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"legal_name" text,
	"cnpj" text,
	"plan" "tenant_plan" DEFAULT 'trial' NOT NULL,
	"status" "tenant_status" DEFAULT 'active' NOT NULL,
	"custom_domain" text,
	"billing_email" text,
	"theme" jsonb,
	"whatsapp_provider" text,
	"whatsapp_config" jsonb,
	"settings" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tenants_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"auth_user_id" uuid,
	"email" text NOT NULL,
	"full_name" text NOT NULL,
	"phone" text,
	"avatar_url" text,
	"role" "user_role" NOT NULL,
	"status" "user_status" DEFAULT 'active' NOT NULL,
	"two_fa_enabled" boolean DEFAULT false NOT NULL,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "athlete_categories" ADD CONSTRAINT "athlete_categories_athlete_id_athletes_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."athletes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athlete_categories" ADD CONSTRAINT "athlete_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athlete_guardians" ADD CONSTRAINT "athlete_guardians_athlete_id_athletes_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."athletes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athlete_guardians" ADD CONSTRAINT "athlete_guardians_guardian_id_guardians_id_fk" FOREIGN KEY ("guardian_id") REFERENCES "public"."guardians"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athletes" ADD CONSTRAINT "athletes_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athletes" ADD CONSTRAINT "athletes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athletes" ADD CONSTRAINT "athletes_entry_coach_id_users_id_fk" FOREIGN KEY ("entry_coach_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_head_coach_id_users_id_fk" FOREIGN KEY ("head_coach_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guardians" ADD CONSTRAINT "guardians_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guardians" ADD CONSTRAINT "guardians_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "athletes_tenant_idx" ON "athletes" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "athletes_tenant_status_idx" ON "athletes" USING btree ("tenant_id","status");--> statement-breakpoint
CREATE INDEX "athletes_name_idx" ON "athletes" USING btree ("full_name");--> statement-breakpoint
CREATE INDEX "audit_tenant_idx" ON "audit_log" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "audit_occurred_idx" ON "audit_log" USING btree ("occurred_at");--> statement-breakpoint
CREATE INDEX "categories_tenant_idx" ON "categories" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "guardians_tenant_idx" ON "guardians" USING btree ("tenant_id");--> statement-breakpoint
CREATE UNIQUE INDEX "tenants_custom_domain_idx" ON "tenants" USING btree ("custom_domain");--> statement-breakpoint
CREATE UNIQUE INDEX "users_tenant_email_idx" ON "users" USING btree ("tenant_id","email");--> statement-breakpoint
CREATE INDEX "users_tenant_idx" ON "users" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "users_auth_idx" ON "users" USING btree ("auth_user_id");