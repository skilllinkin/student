-- Create a private Supabase bucket named `private-cvs` (public = false).
-- Candidate/recruiter reads go through the backend after ownership/assignment checks.
-- Never grant broad authenticated SELECT access or publish this bucket.
create policy "Candidates upload within their own folder" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'private-cvs' and (storage.foldername(name))[1] = auth.uid()::text);

-- The backend service-role key is server-only and must never be bundled in frontend.