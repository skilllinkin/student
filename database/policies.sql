-- Supabase RLS examples. The Express service uses a service-role connection, so
-- it must enforce equivalent checks itself; service-role credentials bypass RLS.
alter table public.users enable row level security;
alter table public.candidate_profiles enable row level security;
alter table public.jobs enable row level security;
alter table public.job_assignments enable row level security;
alter table public.applications enable row level security;
alter table public.application_cvs enable row level security;
alter table public.interviews enable row level security;
alter table public.recruiter_notes enable row level security;
alter table public.ai_summaries enable row level security;
alter table public.stage_history enable row level security;
alter table public.email_logs enable row level security;

-- These policies assume Supabase Auth IDs map to public.users.id and roles are
-- carried in server-managed app_metadata claims. Review identity mapping first.
create policy "Candidates read own profile" on public.candidate_profiles
  for select using (user_id = auth.uid()::text);
create policy "Candidates read own applications" on public.applications
  for select using (candidate_id = auth.uid()::text);
create policy "Anyone reads currently open jobs" on public.jobs
  for select using (status = 'OPEN' and last_date >= current_date and openings > 0);

-- Add recruiter-assignment and admin policies using your verified JWT role claim.