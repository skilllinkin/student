# Database schema

The canonical model is [the Prisma schema](../backend/prisma/schema.prisma). `database/policies.sql` and `database/storage-policies.sql` are Supabase policy examples. API access checks remain mandatory even when database policies are enabled.

| Table | Purpose |
| --- | --- |
| `users` | Candidate, recruiter, and admin identities |
| `candidate_profiles` | Candidate profile and CV pointer |
| `jobs` | Job posting metadata and opening/status lifecycle |
| `job_assignments` | Recruiter-to-job access mapping |
| `applications` | Candidate application and current stage |
| `application_cvs` | Private stored PDF object path per application |
| `interviews` | Interview time, recruiter, and location/link |
| `recruiter_notes` | Private hiring-team notes |
| `ai_summaries` | Async summary content and status |
| `stage_history` | Auditable stage transitions |
| `email_logs` | Delivery attempt metadata |

The migration adds a PostgreSQL partial unique index on `(candidate_id, job_id)` while stage is not `REJECTED` or `WITHDRAWN`, plus an overlap exclusion constraint for recruiter interviews using `btree_gist`. The service checks these conditions too, for readable errors.