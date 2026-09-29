import { badRequest } from './errors'

export function interviewWindow(startsAt: Date) {
  if (!Number.isFinite(startsAt.getTime()) || startsAt <= new Date()) throw badRequest('Interview must be scheduled in the future')
  return { startsAt, endsAt: new Date(startsAt.getTime() + 60 * 60 * 1000) }
}

export function isJobOpen(status: string, lastDate: Date, openings: number, now = new Date()) {
  return status === 'OPEN' && lastDate >= new Date(now.toDateString()) && openings > 0
}