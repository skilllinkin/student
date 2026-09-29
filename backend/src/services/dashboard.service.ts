import { ApplicationStage, JobStatus } from '@prisma/client'
import { db } from '../config/db'

export async function adminDashboard() {
  const [openJobs, applications, activeCandidates, interviews] = await Promise.all([
    db.job.count({ where: { status: JobStatus.OPEN, lastDate: { gte: new Date(new Date().toDateString()) }, openings: { gt: 0 } } }),
    db.application.count({ where: { stage: { notIn: [ApplicationStage.REJECTED, ApplicationStage.WITHDRAWN, ApplicationStage.HIRED] } } }),
    db.user.count({ where: { role: 'CANDIDATE', active: true } }),
    db.interview.count({ where: { startsAt: { gte: new Date(), lt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } } }),
  ])
  const stageCounts = await db.application.groupBy({ by: ['stage'], _count: { _all: true } })
  return { openJobs, applications, activeCandidates, interviewsThisWeek: interviews, stages: stageCounts.map(({ stage, _count }) => ({ stage, count: _count._all })) }
}