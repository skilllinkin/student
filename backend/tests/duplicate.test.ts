import { ApplicationStage } from '@prisma/client'
import { describe, expect, it } from 'vitest'
import { blocksDuplicateApplication } from '../src/utils/applicationRules'

describe('duplicate application rule', () => {
  it('blocks a second application while the previous application is active or hired', () => {
    for (const stage of [ApplicationStage.APPLIED, ApplicationStage.SHORTLISTED, ApplicationStage.INTERVIEW, ApplicationStage.OFFER, ApplicationStage.HIRED]) {
      expect(blocksDuplicateApplication(stage)).toBe(true)
    }
  })

  it('allows reapplication after rejection or withdrawal', () => {
    expect(blocksDuplicateApplication(ApplicationStage.REJECTED)).toBe(false)
    expect(blocksDuplicateApplication(ApplicationStage.WITHDRAWN)).toBe(false)
  })
})