import { z } from 'zod'
import { ApplicationStage } from '@prisma/client'

export const applySchema = z.object({ jobId: z.string().min(1) })
export const stageSchema = z.object({ stage: z.nativeEnum(ApplicationStage) })
export const noteSchema = z.object({ content: z.string().trim().min(1).max(3000) })