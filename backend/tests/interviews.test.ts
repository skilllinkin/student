import { describe, expect, it } from 'vitest'
import { interviewWindow } from '../src/utils/date'
import { overlapsOneHourInterview } from '../src/utils/applicationRules'

describe('interview scheduling', () => {
  it('creates a one-hour window and rejects past starts', () => {
    const future = new Date(Date.now() + 60 * 60 * 1000)
    expect(interviewWindow(future).endsAt.getTime() - future.getTime()).toBe(60 * 60 * 1000)
    expect(() => interviewWindow(new Date(Date.now() - 1))).toThrow('future')
  })

  it('rejects intersecting one-hour slots but permits adjacent slots', () => {
    const first = new Date('2026-10-02T10:00:00Z')
    expect(overlapsOneHourInterview(first, new Date('2026-10-02T10:30:00Z'))).toBe(true)
    expect(overlapsOneHourInterview(first, new Date('2026-10-02T11:00:00Z'))).toBe(false)
  })
})