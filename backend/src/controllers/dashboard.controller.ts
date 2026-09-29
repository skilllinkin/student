import type { Request, Response } from 'express'
import { adminDashboard } from '../services/dashboard.service'
import { db } from '../config/db'
import { UserRole } from '@prisma/client'

export async function dashboard(req: Request, res: Response) {
  if (req.user!.role === UserRole.ADMIN) return res.json(await adminDashboard())
  const recruiterId = req.user!.id
  const [jobs, applications, interviews] = await Promise.all([
    db.job.count({ where: { assignments: { some: { recruiterId } } } }),
    db.application.count({ where: { job: { assignments: { some: { recruiterId } } }, stage: { notIn: ['REJECTED', 'WITHDRAWN', 'HIRED'] } } }),
    db.interview.count({ where: { recruiterId, startsAt: { gte: new Date(), lt: new Date(Date.now() + 7 * 86400000) } } }),
  ])
  res.json({ assignedJobs: jobs, activeApplications: applications, upcomingInterviews: interviews })
}