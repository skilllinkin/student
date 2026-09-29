import { ApplicationStage, UserRole } from '@prisma/client'

export function blocksDuplicateApplication(stage: ApplicationStage) {
  return stage !== ApplicationStage.REJECTED && stage !== ApplicationStage.WITHDRAWN
}

export function canReadApplication(role: UserRole, actorId: string, candidateId: string, recruiterAssigned: boolean) {
  if (role === UserRole.ADMIN) return true
  if (role === UserRole.CANDIDATE) return actorId === candidateId
  return role === UserRole.RECRUITER && recruiterAssigned
}

export function overlapsOneHourInterview(startA: Date, startB: Date) {
  const hour = 60 * 60 * 1000
  return startA.getTime() < startB.getTime() + hour && startA.getTime() + hour > startB.getTime()
}

export function countDashboardActiveStages(stages: ApplicationStage[]) {
  return stages.filter((stage) => ![ApplicationStage.REJECTED, ApplicationStage.WITHDRAWN, ApplicationStage.HIRED].includes(stage as ApplicationStage)).length
}