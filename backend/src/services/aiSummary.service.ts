import { SummaryStatus, UserRole } from '@prisma/client'
import { db } from '../config/db'
import { env } from '../config/env'
import { forbidden, notFound } from '../utils/errors'
import { canReadApplication } from '../utils/applicationRules'

export async function readAiSummary(applicationId: string, actor: { id: string; role: UserRole }) {
  const application = await db.application.findUnique({ where: { id: applicationId }, include: { job: { include: { assignments: true } }, summary: true } })
  if (!application) throw notFound('Application not found')
  if (!canReadApplication(actor.role, actor.id, application.candidateId, application.job.assignments.some((assignment) => assignment.recruiterId === actor.id)) || actor.role === UserRole.CANDIDATE) throw forbidden()
  return application.summary
}

export async function requestSummary(applicationId: string, actor: { id: string; role: UserRole }) {
  const application = await db.application.findUnique({ where: { id: applicationId }, include: { job: { include: { assignments: true } } } })
  if (!application) throw notFound('Application not found')
  if (!canReadApplication(actor.role, actor.id, application.candidateId, application.job.assignments.some((assignment) => assignment.recruiterId === actor.id)) || actor.role === UserRole.CANDIDATE) throw forbidden()
  const summary = await db.aiSummary.upsert({ where: { applicationId }, create: { applicationId, status: SummaryStatus.PENDING }, update: { status: SummaryStatus.PENDING } })
  if (env.N8N_WEBHOOK_BASE_URL) {
    try {
      await fetch(`${env.N8N_WEBHOOK_BASE_URL}/ai-summary`, { method: 'POST', headers: { 'content-type': 'application/json', ...(env.N8N_WEBHOOK_SECRET ? { 'x-webhook-secret': env.N8N_WEBHOOK_SECRET } : {}) }, body: JSON.stringify({ applicationId }) })
    } catch {
      await db.aiSummary.update({ where: { applicationId }, data: { status: SummaryStatus.FAILED } }).catch(() => undefined)
    }
  }
  return summary
}