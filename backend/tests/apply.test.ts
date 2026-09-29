import { describe, expect, it } from 'vitest'
import { isJobOpen } from '../src/utils/date'

describe('job application eligibility', () => {
  it('allows applications only while a job is open, in date, and has openings', () => {
    const today = new Date('2026-09-29T12:00:00')
    expect(isJobOpen('OPEN', new Date('2026-10-01'), 1, today)).toBe(true)
    expect(isJobOpen('CLOSED', new Date('2026-10-01'), 1, today)).toBe(false)
    expect(isJobOpen('OPEN', new Date('2026-09-28'), 1, today)).toBe(false)
    expect(isJobOpen('OPEN', new Date('2026-10-01'), 0, today)).toBe(false)
  })
})