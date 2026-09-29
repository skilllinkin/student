# Test cases

Backend Vitest files cover these core cases with synthetic data:

1. Candidate with a valid CV can apply to an open job.
2. Candidate without a CV is prevented from applying.
3. A second active application for the same job is rejected.
4. Rejected/withdrawn applications do not count as active duplicates.
5. Every adjacent forward stage transition is allowed.
6. Skipped and backward transitions are rejected.
7. Hired, rejected, and withdrawn stages are final.
8. One-hour interview windows are created from start times.
9. Past interview times are rejected.
10. Adjacent interviews do not overlap; partial overlap does.
11. Candidates cannot access another candidate's application or CV.
12. Recruiters cannot access an unassigned application's CV or summary.
13. AI summaries are informational and contain no decision field.
14. Dashboard aggregation excludes final/rejected/withdrawn applications.

Run `npm test`. These are fast domain tests, not a substitute for HTTP/database integration tests. Before launch, add tests against temporary PostgreSQL for transaction races, RLS/signed URLs, authentication expiry, email retries, and n8n failure behavior.