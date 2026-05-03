import { sql } from "drizzle-orm";
import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  date,
  integer,
  jsonb,
  pgEnum,
  primaryKey,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/* ============================================================================
 * Enums
 * ========================================================================== */

export const userRoleEnum = pgEnum("user_role", [
  "super_admin",
  "school_owner",
  "coordinator",
  "coach",
  "parent",
  "athlete",
  "scout_external",
]);

export const tenantPlanEnum = pgEnum("tenant_plan", [
  "trial",
  "starter",
  "pro",
  "premium",
  "franchise",
]);

export const tenantStatusEnum = pgEnum("tenant_status", [
  "active",
  "suspended",
  "cancelled",
]);

export const userStatusEnum = pgEnum("user_status", [
  "active",
  "invited",
  "suspended",
]);

export const athleteStatusEnum = pgEnum("athlete_status", [
  "active",
  "inactive",
  "transferred",
  "graduated",
]);

export const dominantFootEnum = pgEnum("dominant_foot", [
  "right",
  "left",
  "both",
]);

export const evaluationStatusEnum = pgEnum("evaluation_status", [
  "draft",
  "published",
]);

export const attendanceStatusEnum = pgEnum("attendance_status", [
  "present",
  "absent",
  "late",
  "excused",
  "injured",
]);

export const matchKindEnum = pgEnum("match_kind", [
  "friendly",
  "official",
  "training",
  "tournament",
]);

export const matchResultEnum = pgEnum("match_result", [
  "win",
  "draw",
  "loss",
  "pending",
]);

export const injurySeverityEnum = pgEnum("injury_severity", [
  "minor",
  "moderate",
  "severe",
]);

export const guardianRelationshipEnum = pgEnum("guardian_relationship", [
  "father",
  "mother",
  "stepfather",
  "stepmother",
  "tutor",
  "grandfather",
  "grandmother",
  "uncle",
  "aunt",
  "sibling",
  "other",
]);

/* ============================================================================
 * Multi-tenancy
 * ========================================================================== */

export const tenants = pgTable(
  "tenants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    legalName: text("legal_name"),
    cnpj: text("cnpj"),
    plan: tenantPlanEnum("plan").notNull().default("trial"),
    status: tenantStatusEnum("status").notNull().default("active"),
    customDomain: text("custom_domain"),
    billingEmail: text("billing_email"),
    theme: jsonb("theme").$type<{
      brand?: string;
      brandSoft?: string;
      brandText?: string;
      logoUrl?: string;
      logoDarkUrl?: string;
      faviconUrl?: string;
      emailHeaderUrl?: string;
    }>(),
    whatsappProvider: text("whatsapp_provider"),
    whatsappConfig: jsonb("whatsapp_config"),
    settings: jsonb("settings"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    customDomainIdx: uniqueIndex("tenants_custom_domain_idx").on(t.customDomain),
  })
);

/* ============================================================================
 * Users (auth handled by Supabase Auth, this table mirrors the user with
 * tenant + role context)
 * ========================================================================== */

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    authUserId: uuid("auth_user_id"),
    email: text("email").notNull(),
    fullName: text("full_name").notNull(),
    phone: text("phone"),
    avatarUrl: text("avatar_url"),
    role: userRoleEnum("role").notNull(),
    status: userStatusEnum("status").notNull().default("active"),
    twoFaEnabled: boolean("two_fa_enabled").notNull().default(false),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    tenantEmailIdx: uniqueIndex("users_tenant_email_idx").on(
      t.tenantId,
      t.email
    ),
    tenantIdx: index("users_tenant_idx").on(t.tenantId),
    authIdx: index("users_auth_idx").on(t.authUserId),
  })
);

/* ============================================================================
 * Categorias (turmas)
 * ========================================================================== */

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    ageMin: integer("age_min").notNull(),
    ageMax: integer("age_max").notNull(),
    color: text("color"),
    headCoachId: uuid("head_coach_id").references(() => users.id, {
      onDelete: "set null",
    }),
    schedule: jsonb("schedule").$type<{
      weekdays?: number[];
      time?: string;
      duration?: number;
      field?: string;
    }>(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    tenantIdx: index("categories_tenant_idx").on(t.tenantId),
  })
);

/* ============================================================================
 * Atletas
 * ========================================================================== */

export const athletes = pgTable(
  "athletes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    fullName: text("full_name").notNull(),
    nickname: text("nickname"),
    dob: date("dob").notNull(),
    cpf: text("cpf"),
    rg: text("rg"),
    nationality: text("nationality").default("BR"),
    naturalCity: text("natural_city"),
    address: jsonb("address"),
    photoUrl: text("photo_url"),
    photoSideUrl: text("photo_side_url"),
    photoFullUrl: text("photo_full_url"),
    positionMain: text("position_main"),
    positionSecondary: text("position_secondary").array(),
    dominantFoot: dominantFootEnum("dominant_foot"),
    jerseyNumber: integer("jersey_number"),
    status: athleteStatusEnum("status").notNull().default("active"),
    heightCm: integer("height_cm"),
    weightKg: integer("weight_kg"),
    bloodType: text("blood_type"),
    allergies: text("allergies"),
    medications: text("medications"),
    healthPlan: text("health_plan"),
    emergencyContact: jsonb("emergency_contact"),
    schoolName: text("school_name"),
    schoolGrade: text("school_grade"),
    schoolShift: text("school_shift"),
    entryDate: date("entry_date"),
    entryOrigin: text("entry_origin"),
    entryCoachId: uuid("entry_coach_id").references(() => users.id, {
      onDelete: "set null",
    }),
    entryNotes: text("entry_notes"),
    previousClub: text("previous_club"),
    yearsPlaying: integer("years_playing"),
    dream: text("dream"),
    imageConsentDocUrl: text("image_consent_doc_url"),
    imageConsentSignedAt: timestamp("image_consent_signed_at", {
      withTimezone: true,
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    tenantIdx: index("athletes_tenant_idx").on(t.tenantId),
    tenantStatusIdx: index("athletes_tenant_status_idx").on(
      t.tenantId,
      t.status
    ),
    nameIdx: index("athletes_name_idx").on(t.fullName),
  })
);

/* ============================================================================
 * Responsáveis
 * ========================================================================== */

export const guardians = pgTable(
  "guardians",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    fullName: text("full_name").notNull(),
    relationship: guardianRelationshipEnum("relationship").notNull(),
    phone: text("phone"),
    whatsapp: text("whatsapp"),
    email: text("email"),
    cpf: text("cpf"),
    address: jsonb("address"),
    occupation: text("occupation"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    tenantIdx: index("guardians_tenant_idx").on(t.tenantId),
  })
);

export const athleteGuardians = pgTable(
  "athlete_guardians",
  {
    athleteId: uuid("athlete_id")
      .notNull()
      .references(() => athletes.id, { onDelete: "cascade" }),
    guardianId: uuid("guardian_id")
      .notNull()
      .references(() => guardians.id, { onDelete: "cascade" }),
    isPrimary: boolean("is_primary").notNull().default(false),
    canPickup: boolean("can_pickup").notNull().default(true),
    financialResponsible: boolean("financial_responsible")
      .notNull()
      .default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.athleteId, t.guardianId] }),
  })
);

export const athleteCategories = pgTable(
  "athlete_categories",
  {
    athleteId: uuid("athlete_id")
      .notNull()
      .references(() => athletes.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    joinedAt: timestamp("joined_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    leftAt: timestamp("left_at", { withTimezone: true }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.athleteId, t.categoryId] }),
  })
);

/* ============================================================================
 * Audit log (LGPD + segurança)
 * ========================================================================== */

export const auditLog = pgTable(
  "audit_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id").references(() => tenants.id, {
      onDelete: "set null",
    }),
    actorUserId: uuid("actor_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    action: text("action").notNull(),
    targetTable: text("target_table"),
    targetId: text("target_id"),
    diff: jsonb("diff"),
    ip: text("ip"),
    userAgent: text("user_agent"),
    occurredAt: timestamp("occurred_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    tenantIdx: index("audit_tenant_idx").on(t.tenantId),
    occurredIdx: index("audit_occurred_idx").on(t.occurredAt),
  })
);

/* ============================================================================
 * Avaliações
 * ========================================================================== */

export const evaluations = pgTable(
  "evaluations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    athleteId: uuid("athlete_id")
      .notNull()
      .references(() => athletes.id, { onDelete: "cascade" }),
    evaluatorId: uuid("evaluator_id").references(() => users.id, {
      onDelete: "set null",
    }),
    periodLabel: text("period_label"),
    periodStart: date("period_start"),
    periodEnd: date("period_end"),
    status: evaluationStatusEnum("status").notNull().default("draft"),
    summaryText: text("summary_text"),
    techScore: integer("tech_score"),
    tacticalScore: integer("tactical_score"),
    psychScore: integer("psych_score"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    tenantIdx: index("eval_tenant_idx").on(t.tenantId),
    athleteIdx: index("eval_athlete_idx").on(t.athleteId),
    statusIdx: index("eval_status_idx").on(t.tenantId, t.status),
  })
);

export const evalTechnical = pgTable(
  "eval_technical",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    evaluationId: uuid("evaluation_id")
      .notNull()
      .references(() => evaluations.id, { onDelete: "cascade" }),
    fundamental: text("fundamental").notNull(),
    score: integer("score").notNull(),
    comment: text("comment"),
  },
  (t) => ({
    evalIdx: index("eval_tech_eval_idx").on(t.evaluationId),
  })
);

export const evalTactical = pgTable(
  "eval_tactical",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    evaluationId: uuid("evaluation_id")
      .notNull()
      .references(() => evaluations.id, { onDelete: "cascade" }),
    dimension: text("dimension").notNull(),
    score: integer("score").notNull(),
    comment: text("comment"),
  },
  (t) => ({
    evalIdx: index("eval_tactical_eval_idx").on(t.evaluationId),
  })
);

export const evalPsych = pgTable(
  "eval_psych",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    evaluationId: uuid("evaluation_id")
      .notNull()
      .references(() => evaluations.id, { onDelete: "cascade" }),
    dimension: text("dimension").notNull(),
    score: integer("score").notNull(),
    comment: text("comment"),
  },
  (t) => ({
    evalIdx: index("eval_psych_eval_idx").on(t.evaluationId),
  })
);

/* ============================================================================
 * Antropometria (medições corporais)
 * ========================================================================== */

export const anthropometryRecords = pgTable(
  "anthropometry_records",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    athleteId: uuid("athlete_id")
      .notNull()
      .references(() => athletes.id, { onDelete: "cascade" }),
    recordedById: uuid("recorded_by_id").references(() => users.id, {
      onDelete: "set null",
    }),
    recordedAt: date("recorded_at").notNull(),
    // Numeros guardados como inteiros pra evitar float drift:
    // - heightCm: cm direto (172 = 1.72m)
    // - weightDg: peso em decigramas (725 = 72.5 kg)
    // - bmiX10, bodyFatPctX10, biologicalAgeX10: valor * 10
    heightCm: integer("height_cm"),
    weightDg: integer("weight_dg"),
    wingspanCm: integer("wingspan_cm"),
    bodyFatPctX10: integer("body_fat_pct_x10"),
    leanMassPctX10: integer("lean_mass_pct_x10"),
    bmiX10: integer("bmi_x10"),
    biologicalAgeX10: integer("biological_age_x10"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    tenantIdx: index("anthro_tenant_idx").on(t.tenantId),
    athleteIdx: index("anthro_athlete_idx").on(t.athleteId),
    recordedIdx: index("anthro_recorded_idx").on(t.recordedAt),
  })
);

/* ============================================================================
 * Bateria física (sprints, saltos, agilidade, resistência)
 * ========================================================================== */

export const physicalTests = pgTable(
  "physical_tests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    athleteId: uuid("athlete_id")
      .notNull()
      .references(() => athletes.id, { onDelete: "cascade" }),
    recordedById: uuid("recorded_by_id").references(() => users.id, {
      onDelete: "set null",
    }),
    recordedAt: date("recorded_at").notNull(),
    testCode: text("test_code").notNull(),
    // Valor guardado * 1000 (millimétrico) — evita float, suporta segundos
    // (3.62s → 3620), centímetros (32.5 → 32500) ou metros distância
    valueX1000: integer("value_x1000").notNull(),
    unit: text("unit").notNull(),
    condition: jsonb("condition").$type<{
      field?: string;
      shift?: "morning" | "afternoon" | "evening";
      weather?: "dry" | "wet" | "indoor";
    }>(),
    observation: text("observation"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    tenantIdx: index("phys_tenant_idx").on(t.tenantId),
    athleteIdx: index("phys_athlete_idx").on(t.athleteId),
    testIdx: index("phys_test_idx").on(t.testCode, t.recordedAt),
  })
);

/* ============================================================================
 * Treinos & presença
 * ========================================================================== */

export const trainingSessions = pgTable(
  "training_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id").references(() => categories.id, {
      onDelete: "set null",
    }),
    coachId: uuid("coach_id").references(() => users.id, {
      onDelete: "set null",
    }),
    date: date("date").notNull(),
    startTime: text("start_time"),
    durationMin: integer("duration_min"),
    focus: text("focus"),
    field: text("field"),
    weather: text("weather"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    tenantIdx: index("training_tenant_idx").on(t.tenantId),
    dateIdx: index("training_date_idx").on(t.tenantId, t.date),
    categoryIdx: index("training_category_idx").on(t.categoryId),
  })
);

export const attendance = pgTable(
  "attendance",
  {
    sessionId: uuid("session_id")
      .notNull()
      .references(() => trainingSessions.id, { onDelete: "cascade" }),
    athleteId: uuid("athlete_id")
      .notNull()
      .references(() => athletes.id, { onDelete: "cascade" }),
    status: attendanceStatusEnum("status").notNull().default("present"),
    notes: text("notes"),
    recordedAt: timestamp("recorded_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.sessionId, t.athleteId] }),
    athleteIdx: index("att_athlete_idx").on(t.athleteId),
  })
);

/* ============================================================================
 * Jogos & estatísticas
 * ========================================================================== */

export const matches = pgTable(
  "matches",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id").references(() => categories.id, {
      onDelete: "set null",
    }),
    kind: matchKindEnum("kind").notNull().default("friendly"),
    opponent: text("opponent").notNull(),
    date: date("date").notNull(),
    startTime: text("start_time"),
    location: text("location"),
    isHome: boolean("is_home").notNull().default(true),
    scoreUs: integer("score_us"),
    scoreThem: integer("score_them"),
    result: matchResultEnum("result").notNull().default("pending"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    tenantIdx: index("match_tenant_idx").on(t.tenantId),
    dateIdx: index("match_date_idx").on(t.tenantId, t.date),
    categoryIdx: index("match_category_idx").on(t.categoryId),
  })
);

export const matchStats = pgTable(
  "match_stats",
  {
    matchId: uuid("match_id")
      .notNull()
      .references(() => matches.id, { onDelete: "cascade" }),
    athleteId: uuid("athlete_id")
      .notNull()
      .references(() => athletes.id, { onDelete: "cascade" }),
    minutesPlayed: integer("minutes_played"),
    goals: integer("goals").notNull().default(0),
    assists: integer("assists").notNull().default(0),
    yellowCards: integer("yellow_cards").notNull().default(0),
    redCards: integer("red_cards").notNull().default(0),
    positionPlayed: text("position_played"),
    rating: integer("rating"),
    notes: text("notes"),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.matchId, t.athleteId] }),
    athleteIdx: index("ms_athlete_idx").on(t.athleteId),
  })
);

/* ============================================================================
 * Lesões / saúde
 * ========================================================================== */

export const injuries = pgTable(
  "injuries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    athleteId: uuid("athlete_id")
      .notNull()
      .references(() => athletes.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    bodyPart: text("body_part"),
    severity: injurySeverityEnum("severity").notNull().default("minor"),
    occurredAt: date("occurred_at").notNull(),
    daysOut: integer("days_out"),
    returnedAt: date("returned_at"),
    description: text("description"),
    treatment: text("treatment"),
    attachmentUrl: text("attachment_url"),
    recordedById: uuid("recorded_by_id").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    tenantIdx: index("injury_tenant_idx").on(t.tenantId),
    athleteIdx: index("injury_athlete_idx").on(t.athleteId),
  })
);

/* ============================================================================
 * Tipos exportados
 * ========================================================================== */

export type Tenant = typeof tenants.$inferSelect;
export type NewTenant = typeof tenants.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Athlete = typeof athletes.$inferSelect;
export type NewAthlete = typeof athletes.$inferInsert;
export type Guardian = typeof guardians.$inferSelect;
export type NewGuardian = typeof guardians.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Evaluation = typeof evaluations.$inferSelect;
export type NewEvaluation = typeof evaluations.$inferInsert;
export type AnthropometryRecord = typeof anthropometryRecords.$inferSelect;
export type NewAnthropometryRecord = typeof anthropometryRecords.$inferInsert;
export type PhysicalTest = typeof physicalTests.$inferSelect;
export type NewPhysicalTest = typeof physicalTests.$inferInsert;
export type TrainingSession = typeof trainingSessions.$inferSelect;
export type NewTrainingSession = typeof trainingSessions.$inferInsert;
export type Match = typeof matches.$inferSelect;
export type NewMatch = typeof matches.$inferInsert;
export type Injury = typeof injuries.$inferSelect;
export type NewInjury = typeof injuries.$inferInsert;

/* ============================================================================
 * SQL helpers (para uso futuro em RLS, search, etc)
 * ========================================================================== */

export const currentTenantId = sql`current_setting('app.tenant_id', true)::uuid`;
