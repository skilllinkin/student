import { ApplicationStage, JobStatus, UserRole } from '@prisma/client'
import { db } from '../config/db'
import { forbidden, notFound } from '../utils/errors'
import { canReadApplication } from '../utils/applicationRules'

export async function applyToJob(candidateId: string, jobId: string) {
  const profile = await db.candidateProfile.findUnique({ where: { userId: candidateId } })
  if (!profile?.cvPath || !profile.cvName) throw forbidden('Upload a CV before applying')
  const { cvPath, cvName } = profile
  const dayStart = new Date(new Date().toDateString())
  try {
    return await db.$transaction(async (tx) => {
      const job = await tx.job.findUnique({ where: { id: jobId } })
      if (!job || job.status !== JobStatus.OPEN || job.lastDate < dayStart || job.openings < 1) throw forbidden('This job is no longer accepting applications')
      const duplicate = await tx.application.findFirst({ where: { candidateId, jobId, stage: { notIn: [ApplicationStage.REJECTED, ApplicationStage.WITHDRAWN] } } })
      if (duplicate) throw forbidden('You already have an active application for this job')
      const application = await tx.application.create({ data: { candidateId, jobId, cv: { create: { filePath: cvPath, fileName: cvName } }, history: { create: { fromStage: null, toStage: ApplicationStage.APPLIED, changedBy: candidateId } } }, include: { job: true } })
      return application
    })
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') throw forbidden('You already have an active application for this job')
    throw error
  }
}

export async function listCandidateApplications(candidateId: string) {
  return db.application.findMany({ where: { candidateId }, include: { job: true, interviews: { orderBy: { startsAt: 'asc' } } }, orderBy: { updatedAt: 'desc' } })
}

export async function listJobApplications(jobId: string, recruiterId?: string) {
  if (recruiterId) {
    const assignment = await db.jobAssignment.findUnique({ where: { jobId_recruiterId: { jobId, recruiterId } } })
    if (!assignment) throw forbidden()
  }
  return db.application.findMany({ where: { jobId }, include: { candidate: { select: { id: true, name: true, email: true } }, cv: true, summary: true }, orderBy: { createdAt: 'desc' } })
}

export async function getApplication(applicationId: string, actor: { id: string; role: UserRole }) {
  const application = await db.application.findUnique({ where: { id: applicationId }, include: { candidate: { select: { id: true, name: true, email: true } }, job: { include: { assignments: true } }, cv: true, interviews: true, notes: true, summary: true, history: { orderBy: { changedAt: 'asc' } } } })
  if (!application) throw notFound('Application not found')
  if (!canReadApplication(actor.role, actor.id, application.candidateId, application.job.assignments.some((item) => item.recruiterId === actor.id))) throw forbidden()
  return application
}

export async function withdrawApplication(applicationId: string, candidateId: string) {
  const application = await db.application.findUnique({ where: { id: applicationId } })
  if (!application || application.candidateId !== candidateId) throw notFound('Application not found')
  if ([ApplicationStage.HIRED, ApplicationStage.REJECTED, ApplicationStage.WITHDRAWN].some((stage) => stage === application.stage)) throw forbidden('This application can no longer be withdrawn')
  return db.$transaction(async (tx) => {
    const updated = await tx.application.update({ where: { id: applicationId }, data: { stage: ApplicationStage.WITHDRAWN } })
    await tx.stageHistory.create({ data: { applicationId, fromStage: application.stage, toStage: ApplicationStage.WITHDRAWN, changedBy: candidateId } })
    return updated
  })
}