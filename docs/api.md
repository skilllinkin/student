# API

Base URL: `http://localhost:4000`. JSON errors use `{ "error": "..." }`. Protected endpoints require `Authorization: Bearer <token>`. Signup creates a Candidate; admin-created recruiters receive a one-time set-password invite token.

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| POST | `/auth/signup` | Public | Candidate registration |
| POST | `/auth/signin` | Public | Sign in |
| POST | `/auth/set-password` | Invite token | Set password and activate account |
| GET | `/jobs` | Public | Open, unexpired jobs with openings |
| GET | `/jobs/:id` | Signed in | Job detail; recruiter must be assigned |
| POST | `/jobs` | Admin | Create a job |
| PATCH | `/jobs/:id/open` | Admin | Open a job |
| PATCH | `/jobs/:id/close` | Admin | Close a job |
| POST | `/candidate/cv` | Candidate | Multipart field `cv`; PDF max 2 MiB |
| POST | `/applications` | Candidate | Apply with `{ "jobId": "..." }` |
| GET | `/candidate/applications` | Candidate | Own applications |
| PATCH | `/applications/:id/withdraw` | Owner | Withdraw active application |
| GET | `/recruiter/jobs` | Recruiter/Admin | Assigned jobs (admin sees all) |
| GET | `/recruiter/jobs/:jobId/applications` | Assigned recruiter/Admin | Applications for a job |
| GET | `/applications/:id` | Owner/assigned recruiter/Admin | Application detail |
| GET | `/applications/:id/cv` | Owner/assigned recruiter/Admin | Short-lived signed CV URL |
| PATCH | `/applications/:id/stage` | Assigned recruiter/Admin | Advance a stage or reject |
| POST | `/applications/:id/interview` | Assigned recruiter/Admin | Schedule a one-hour interview |
| POST | `/applications/:id/notes` | Assigned recruiter/Admin | Add a private note |
| GET | `/ai/applications/:id/ai-summary` | Assigned recruiter/Admin | Read summary |
| POST | `/ai/applications/:id/ai-summary/retry` | Assigned recruiter/Admin | Queue summary retry |
| GET | `/admin/recruiters` | Admin | List recruiters |
| POST | `/admin/recruiters` | Admin | Invite and assign recruiters |
| PATCH | `/admin/recruiters/:id/deactivate` | Admin | Deactivate recruiter |
| GET | `/admin/dashboard` | Admin | Dashboard totals |
| GET | `/dashboard` | Admin/Recruiter | Role-scoped dashboard |

Candidate CV upload is required before applying. Rejected and withdrawn applications do not block a later application to the same job. Application stages are `APPLIED -> SHORTLISTED -> INTERVIEW -> OFFER -> HIRED`; `REJECTED` and `HIRED` are final, and candidates may withdraw their own non-final application.

Interview payload: `{ "startsAt": "2026-10-02T10:00:00.000Z", "locationOrLink": "..." }`. The API rejects past times and checks overlap on the recruiter's calendar for the full 60-minute interval.