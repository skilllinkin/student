import { createClient } from '@supabase/supabase-js'
import { env } from './env'
import { AppError } from '../utils/errors'

const storage = env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } }).storage
  : null

export async function uploadPrivateCv(userId: string, fileName: string, bytes: Buffer) {
  if (!storage) throw new AppError(503, 'Private CV storage is not configured')
  const path = `${userId}/${crypto.randomUUID()}.pdf`
  const { error } = await storage.from(env.SUPABASE_CV_BUCKET).upload(path, bytes, { contentType: 'application/pdf', upsert: false, metadata: { originalName: fileName } })
  if (error) throw new AppError(502, 'Could not store CV securely')
  return path
}

export async function createCvSignedUrl(path: string) {
  if (!storage) throw new AppError(503, 'Private CV storage is not configured')
  const { data, error } = await storage.from(env.SUPABASE_CV_BUCKET).createSignedUrl(path, 60)
  if (error || !data) throw new AppError(502, 'Could not create a private CV link')
  return data.signedUrl
}