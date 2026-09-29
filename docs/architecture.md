# Architecture

## Components

- `frontend/`: React, TypeScript, and Vite user experience for candidate, recruiter, and admin workflows. Its current portal selector and seeded records are a browser-only demo.
- `backend/`: Express API, JWT authentication, request validation, access checks, and business services.
- PostgreSQL: Prisma models for users, jobs, assignments, applications, private CV metadata, interviews, notes, AI summaries, audit history, and email delivery logs.
- Supabase Storage: private PDF bucket. The API stores object paths and issues 60-second signed URLs after checking ownership or recruiter assignment.
- n8n: asynchronous email and optional AI-summary automation. The backend treats webhook failures as non-blocking for the candidate workflow.

## Trust boundaries

The browser never decides access. Every protected API request checks a signed JWT and the underlying candidate ownership, admin role, or recruiter-to-job assignment. Candidate routes only return the candidate's own records. Recruiters receive only assigned job data. AI summaries are restricted to admins and recruiters assigned to the relevant job. CV objects are never public.

The AI is a summarization aid only. It cannot make or record hiring decisions, set a stage, rank candidates, or infer protected characteristics. Stage changes are performed only by the explicit recruiter/admin API.

## Local data flow

```text
Browser -> Express API -> PostgreSQL / Prisma
                      -> Supabase private storage (CV object)
                      -> n8n webhook -> SMTP provider
                                     -> Gemini (optional summary)
```

`docker-compose.yml` starts PostgreSQL only. Supabase, SMTP, n8n, and the AI provider are external integrations configured independently. Use synthetic CVs and test credentials outside production.

## Production considerations

- Put the API behind TLS and a trusted reverse proxy; set a strict CORS origin, rate limits, and secure logging.
- Configure production-grade JWT secrets, rotation, backups, object retention, and audit retention.
- Use a partial unique database index for one active application per candidate/job (included in SQL migration); Prisma's model schema alone cannot express that partial uniqueness.
- For concurrency-sensitive interview bookings and job openings, retain database transactions and add integration tests against production PostgreSQL.
- Configure n8n webhook authentication, retry policy, idempotency, and an SMTP/Gmail credential in n8n itself.