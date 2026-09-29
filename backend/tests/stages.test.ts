import { ApplicationStage as Stage } from '@prisma/client'
import { describe, expect, it } from 'vitest'
import { canTransition } from '../src/services/stage.service'

describe('application stages', () => {
  it('allows only adjacent forward progress', () => {
    expect(canTransition(Stage.APPLIED, Stage.SHORTLISTED)).toBe(true)
    expect(canTransition(Stage.SHORTLISTED, Stage.INTERVIEW)).toBe(true)
    expect(canTransition(Stage.INTERVIEW, Stage.OFFER)).toBe(true)
    expect(canTransition(Stage.OFFER, Stage.HIRED)).toBe(true)
    expect(canTransition(Stage.APPLIED, Stage.INTERVIEW)).toBe(false)
    expect(canTransition(Stage.OFFER, Stage.SHORTLISTED)).toBe(false)
  })

  it('allows rejection from an active stage and makes final stages terminal', () => {
    expect(canTransition(Stage.APPLIED, Stage.REJECTED)).toBe(true)
    expect(canTransition(Stage.HIRED, Stage.REJECTED)).toBe(false)
    expect(canTransition(Stage.REJECTED, Stage.APPLIED)).toBe(false)
    expect(canTransition(Stage.WITHDRAWN, Stage.SHORTLISTED)).toBe(false)
  })
})