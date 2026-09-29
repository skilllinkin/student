import { describe, expect, it } from 'vitest'
import { z } from 'zod'

const summarySchema = z.object({
  profile: z.array(z.string()).min(3).max(5),
  requirements: z.object({ mentioned: z.array(z.string()), notFound: z.array(z.string()) }).strict(),
  interviewQuestions: z.array(z.string()).length(3),
}).strict()

describe('AI summary contract', () => {
  it('accepts the three evidence-only summary sections', () => {
    expect(summarySchema.safeParse({ profile: ['a', 'b', 'c'], requirements: { mentioned: ['React'], notFound: ['SQL'] }, interviewQuestions: ['q1', 'q2', 'q3'] }).success).toBe(true)
  })

  it('rejects decision or scoring fields', () => {
    expect(summarySchema.safeParse({ profile: ['a', 'b', 'c'], requirements: { mentioned: [], notFound: [] }, interviewQuestions: ['q1', 'q2', 'q3'], score: 99 }).success).toBe(false)
  })
})