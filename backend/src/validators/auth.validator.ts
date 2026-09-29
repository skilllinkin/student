import { z } from 'zod'

export const signUpSchema = z.object({ name: z.string().trim().min(2).max(100), email: z.email(), password: z.string().min(10).max(128), phone: z.string().max(30).optional() })
export const signInSchema = z.object({ email: z.email(), password: z.string().min(1) })
export const setPasswordSchema = z.object({ token: z.string().min(1), password: z.string().min(10).max(128) })