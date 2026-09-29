import { ApplicationStage as Stage } from '@prisma/client'
import { describe, expect, it } from 'vitest'
import { countDashboardActiveStages } from '../src/utils/applicationRules'

describe('dashboard counts', () => {
  it('excludes hired, rejected, and withdrawn applications from active pipeline totals', () => {
    expect(countDashboardActiveStages([Stage.APPLIED, Stage.INTERVIEW, Stage.HIRED, Stage.REJECTED, Stage.WITHDRAWN])).toBe(2)
  })
})