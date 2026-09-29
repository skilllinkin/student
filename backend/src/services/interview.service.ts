import { ApplicationStage, UserRole } from '@prisma/client'
import { db } from '../config/db'
import { forbidden, notFound } from '../utils/errors'
import { interviewWindow } from '../utils/date'

export async function scheduleInterview(applicationId: string, recruiterId: string, startsAt: Date, locationOrLink: string, role: UserRole) {
  const { endsAt } = interviewWindow(startsAt)
  return db.$transaction(async (tx) => {
    const application = await tx.application.findUnique({ where: { id: applicationId }, include: { job: { include: { assignments: true } } } })
    if (!application) throw notFound('Application not found')
    if (role === UserRole.CANDIDATE || (role === UserRole.RECRUITER && !application.job.assignments.some((item) => item.recruiterId === recruiterId))) throw forbidden()
    if (![ApplicationStage.SHORTLISTED, ApplicationStage.INTERVIEW].some((stage) => stage === application.stage)) throw forbidden('Shortlist the candidate before scheduling an interview')
    const conflict = await tx.interview.findFirst({ where: { recruiterId, startsAt: { lt: endsAt }, endsAt: { gt: startsAt } } })
    if (conflict) throw forbidden('This time overlaps another recruiter interview')
    const interview = await tx.interview.create({ data: { applicationId, recruiterId, startsAt, endsAt, locationOrLink } })
    if (application.stage === ApplicationStage.SHORTLISTED) {
      await tx.application.update({ where: { id: applicationId }, data: { stage: ApplicationStage.INTERVIEW } })
      await tx.stageHistory.create({ data: { applicationId, fromStage: application.stage, toStage: ApplicationStage.INTERVIEW, changedBy: recruiterId } })
    }
    return interview
  })
}