import { UserRole } from '@prisma/client'
import { db } from '../config/db'
import { AppError } from '../utils/errors'
import { createInviteToken } from './auth.service'

export async function listRecruiters() {
  return db.user.findMany({ where: { role: UserRole.RECRUITER }, select: { id: true, name: true, email: true, active: true, assignments: { select: { job: { select: { id: true, title: true } } } } }, orderBy: { name: 'asc' } })
}

export async function inviteRecruiter(input: { name: string; email: string; jobIds: string[] }) {
  const user = await db.user.create({ data: { name: input.name, email: input.email.toLowerCase(), passwordHash: 'INVITE_PENDING', role: UserRole.RECRUITER, active: false, assignments: { create: input.jobIds.map((jobId) => ({ job: { connect: { id: jobId } } })) } }, select: { id: true, name: true, email: true } })
  return { user, inviteToken: await createInviteToken(user.id) }
}

export async function deactivateRecruiter(id: string) {
  const recruiter = await db.user.findUnique({ where: { id } })
  if (!recruiter || recruiter.role !== UserRole.RECRUITER) throw new AppError(404, 'Recruiter not found')
  return db.user.update({ where: { id }, data: { active: false }, select: { id: true, active: true } })
}