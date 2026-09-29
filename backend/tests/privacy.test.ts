import { UserRole } from '@prisma/client'
import { describe, expect, it } from 'vitest'
import { canReadApplication } from '../src/utils/applicationRules'

describe('application privacy', () => {
  it('limits candidates to their own applications', () => {
    expect(canReadApplication(UserRole.CANDIDATE, 'candidate-1', 'candidate-1', false)).toBe(true)
    expect(canReadApplication(UserRole.CANDIDATE, 'candidate-2', 'candidate-1', false)).toBe(false)
  })

  it('limits recruiters to assigned jobs while allowing admins', () => {
    expect(canReadApplication(UserRole.RECRUITER, 'recruiter-1', 'candidate-1', false)).toBe(false)
    expect(canReadApplication(UserRole.RECRUITER, 'recruiter-1', 'candidate-1', true)).toBe(true)
    expect(canReadApplication(UserRole.ADMIN, 'admin-1', 'candidate-1', false)).toBe(true)
  })
})