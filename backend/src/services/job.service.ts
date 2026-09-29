import { JobStatus, UserRole } from '@prisma/client'
import { db } from '../config/db'
import { forbidden, notFound } from '../utils/errors'
import { isJobOpen } from '../utils/date'

export async function listOpenJobs() {
  const now = new Date()
  const jobs = await db.job.findMany({ where: { status: JobStatus.OPEN, lastDate: { gte: new Date(now.toDateString()) }, openings: { gt: 0 } }, orderBy: { createdAt: 'desc' } })
  return jobs
}

export async function getJob(id: string, user: { id: string; role: UserRole }) {
  const job = await db.job.findUnique({ where: { id }, include: { assignments: { select: { recruiterId: true } } } })
  if (!job) throw notFound('Job not found')
  if (user.role === UserRole.RECRUITER && !job.assignments.some((assignment) => assignment.recruiterId === user.id)) throw forbidden()
  const { assignments: _assignments, ...result } = job
  return result
}

export async function listRecruiterJobs(recruiterId: string) {
  return db.job.findMany({ where: { assignments: { some: { recruiterId } } }, orderBy: { createdAt: 'desc' } })
}

export async function createJob(input: { title: string; department: string; location: string; type: string; description: string; requirements: string[]; lastDate: Date; openings: number }) {
  const status = isJobOpen(JobStatus.OPEN, input.lastDate, input.openings) ? JobStatus.OPEN : JobStatus.DRAFT
  return db.job.create({ data: { ...input, status } })
}

export async function setJobStatus(id: string, status: JobStatus) {
  const job = await db.job.findUnique({ where: { id } })
  if (!job) throw notFound('Job not found')
  if (status === JobStatus.OPEN && !isJobOpen(status, job.lastDate, job.openings)) throw forbidden('Cannot open a job with no openings or an expired last date')
  return db.job.update({ where: { id }, data: { status } })
}

export async function fillOpening(jobId: string) {
  return db.$transaction(async (tx) => {
    const job = await tx.job.findUniqueOrThrow({ where: { id: jobId } })
    const openings = Math.max(0, job.openings - 1)
    return tx.job.update({ where: { id: jobId }, data: { openings, ...(openings === 0 ? { status: JobStatus.CLOSED } : {}) } })
  })
}