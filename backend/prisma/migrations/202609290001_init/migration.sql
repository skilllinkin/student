CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

CREATE TYPE "UserRole" AS ENUM ('CANDIDATE', 'RECRUITER', 'ADMIN');
CREATE TYPE "JobStatus" AS ENUM ('DRAFT', 'OPEN', 'CLOSED');
CREATE TYPE "ApplicationStage" AS ENUM ('APPLIED', 'SHORTLISTED', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED', 'WITHDRAWN');
CREATE TYPE "SummaryStatus" AS ENUM ('PENDING', 'READY', 'FAILED');

CREATE TABLE "users" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "phone" TEXT,
  "role" "UserRole" NOT NULL,
  "password_hash" TEXT NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT TRUE,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE "candidate_profiles" (
  "id" TEXT PRIMARY KEY,
  "user_id" TEXT NOT NULL UNIQUE REFERENCES "users"("id") ON DELETE CASCADE,
  "cv_path" TEXT,
  "cv_name" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE "jobs" (
  "id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "department" TEXT NOT NULL,
  "location" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "requirements" TEXT[] NOT NULL,
  "last_date" DATE NOT NULL,
  "openings" INTEGER NOT NULL CHECK ("openings" >= 0),
  "status" "JobStatus" NOT NULL DEFAULT 'DRAFT',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "jobs_status_last_date_idx" ON "jobs"("status", "last_date");
CREATE TABLE "job_assignments" (
  "job_id" TEXT NOT NULL REFERENCES "jobs"("id") ON DELETE CASCADE,
  "recruiter_id" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("job_id", "recruiter_id")
);
CREATE TABLE "applications" (
  "id" TEXT PRIMARY KEY,
  "candidate_id" TEXT NOT NULL REFERENCES "users"("id"),
  "job_id" TEXT NOT NULL REFERENCES "jobs"("id"),
  "stage" "ApplicationStage" NOT NULL DEFAULT 'APPLIED',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL
);
CREATE INDEX "applications_candidate_job_stage_idx" ON "applications"("candidate_id", "job_id", "stage");
CREATE INDEX "applications_job_stage_created_idx" ON "applications"("job_id", "stage", "created_at");
CREATE UNIQUE INDEX "one_active_application_per_candidate_job"
  ON "applications"("candidate_id", "job_id")
  WHERE "stage" NOT IN ('REJECTED', 'WITHDRAWN');
CREATE TABLE "application_cvs" (
  "id" TEXT PRIMARY KEY,
  "application_id" TEXT NOT NULL UNIQUE REFERENCES "applications"("id") ON DELETE CASCADE,
  "file_path" TEXT NOT NULL,
  "file_name" TEXT NOT NULL,
  "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE "interviews" (
  "id" TEXT PRIMARY KEY,
  "application_id" TEXT NOT NULL REFERENCES "applications"("id") ON DELETE CASCADE,
  "recruiter_id" TEXT NOT NULL REFERENCES "users"("id"),
  "starts_at" TIMESTAMP(3) NOT NULL,
  "ends_at" TIMESTAMP(3) NOT NULL,
  "location_or_link" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK ("ends_at" = "starts_at" + INTERVAL '1 hour'),
  EXCLUDE USING gist ("recruiter_id" WITH =, tsrange("starts_at", "ends_at", '[)') WITH &&)
);
CREATE INDEX "interviews_recruiter_time_idx" ON "interviews"("recruiter_id", "starts_at", "ends_at");
CREATE TABLE "recruiter_notes" (
  "id" TEXT PRIMARY KEY,
  "application_id" TEXT NOT NULL REFERENCES "applications"("id") ON DELETE CASCADE,
  "recruiter_id" TEXT NOT NULL REFERENCES "users"("id"),
  "content" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE "ai_summaries" (
  "id" TEXT PRIMARY KEY,
  "application_id" TEXT NOT NULL UNIQUE REFERENCES "applications"("id") ON DELETE CASCADE,
  "content" JSONB,
  "status" "SummaryStatus" NOT NULL DEFAULT 'PENDING',
  "is_ai_generated" BOOLEAN NOT NULL DEFAULT TRUE,
  "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completed_at" TIMESTAMP(3)
);
CREATE TABLE "stage_history" (
  "id" TEXT PRIMARY KEY,
  "application_id" TEXT NOT NULL REFERENCES "applications"("id") ON DELETE CASCADE,
  "from_stage" "ApplicationStage",
  "to_stage" "ApplicationStage" NOT NULL,
  "changed_by" TEXT NOT NULL REFERENCES "users"("id"),
  "changed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE "email_logs" (
  "id" TEXT PRIMARY KEY,
  "recipient" TEXT NOT NULL,
  "template" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "provider_ref" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "email_logs_recipient_created_idx" ON "email_logs"("recipient", "created_at");