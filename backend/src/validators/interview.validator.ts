import { z } from 'zod'

export const interviewSchema = z.object({ startsAt: z.coerce.date(), locationOrLink: z.string().trim().min(2).max(500) })