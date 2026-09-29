# Nowshera Digital Hiring

A full-stack recruitment workspace with candidate, recruiter, and admin portals. The frontend includes a seeded, interactive demo; the Express API and Prisma schema provide the production-oriented backend foundation.

## Run the demo

Requirements: Node.js 20.19+ and npm.

```powershell
npm install
npm run dev
```

Open the Vite URL shown in the terminal. Use **View as** in the top bar to switch between Admin, Recruiter, and Candidate. Demo data is stored in browser local storage; no real sign-in, email, CV upload, or AI request is sent from the demo UI.

## Run the API

1. Start PostgreSQL with `docker compose up -d postgres`.
2. Copy `backend/.env.example` to `backend/.env` and set a unique `JWT_SECRET` plus Supabase private-storage values.
3. Run `npm install`.
4. Run `npm run db:migrate --workspace backend` and `npm run db:seed --workspace backend`.
5. Start the API with `npm run dev --workspace backend`.

The API listens on port 4000. `GET /health` is a non-authenticated health check. See [API docs](docs/api.md) and [architecture](docs/architecture.md).

## Checks

```powershell
npm run build
npm test
```

The backend tests cover isolated domain rules. Database-backed authorization and upload flows should also be exercised against configured PostgreSQL/Supabase services before production.

## Security boundary

The frontend portal selector is a demo convenience, not authentication. The API enforces JWT roles and resource ownership. CVs must be stored in a private Supabase Storage bucket and exposed only with short-lived signed URLs. AI credentials belong in n8n credentials or backend environment configuration, never frontend code or committed files. Never use seeded demo data as real candidate data.