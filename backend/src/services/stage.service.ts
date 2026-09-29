import { ApplicationStage, UserRole } from '@prisma/client'
import { db } from '../config/db'
import { forbidden, notFound } from '../utils/errors'

const progression = [ApplicationStage.APPLIED, ApplicationStage.SHORTLISTED, ApplicationStage.INTERVIEW, ApplicationStage.OFFER, ApplicationStage.HIRED]

export function canTransition(from: ApplicationStage, to: ApplicationStage) {
  if (from === ApplicationStage.HIRED || from === ApplicationStage.REJECTED || from === ApplicationStage.WITHDRAWN) return false
  if (to === ApplicationStage.REJECTED) return true
  const fromIndex = progression.indexOf(from as (typeof progression)[number])
  const toIndex = progression.indexOf(to as (typeof progression)[number])
  return toIndex >= 0 && toIndex === fromIndex + 1
}

export async function changeStage(applicationId: string, to: ApplicationStage, actor: { id: string; role: UserRole }) {
  const application = await db.application.findUnique({ where: { id: applicationId }, include: { job: { include: { assignments: true } } } })
  if (!application) throw notFound('Application not found')
  if (actor.role === UserRole.RECRUITER && !application.job.assignments.some((assignment) => assignment.recruiterId === actor.id)) throw forbidden()
  if (actor.role === UserRole.CANDIDATE) throw forbidden('Candidates cannot change application stages')
  if (!canTransition(application.stage, to)) throw forbidden('Stage must move forward one step; final stages cannot change')
  return db.$transaction(async (tx) => {
    const updated = await tx.application.update({ where: { id: application.id }, data: { stage: to } })
    await tx.stageHistory.create({ data: { applicationId, fromStage: application.stage, toStage: to, changedBy: actor.id } })
    return updated
  })
}