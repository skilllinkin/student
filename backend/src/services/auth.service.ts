import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UserRole } from '@prisma/client'
import { db } from '../config/db'
import { env } from '../config/env'
import { AppError } from '../utils/errors'

export async function signUp(input: { name: string; email: string; password: string; phone?: string }) {
  const passwordHash = await bcrypt.hash(input.password, 12)
  const user = await db.user.create({ data: { ...input, email: input.email.toLowerCase(), passwordHash, role: UserRole.CANDIDATE, candidate: { create: {} } }, select: { id: true, name: true, email: true, role: true } })
  return issueToken(user)
}

export async function signIn(email: string, password: string) {
  const user = await db.user.findUnique({ where: { email: email.toLowerCase() } })
  if (!user || !user.active || !(await bcrypt.compare(password, user.passwordHash))) throw new AppError(401, 'Email or password is incorrect')
  return issueToken({ id: user.id, name: user.name, email: user.email, role: user.role })
}

export async function setPassword(inviteToken: string, password: string) {
  let claims: jwt.JwtPayload
  try { claims = jwt.verify(inviteToken, env.JWT_SECRET) as jwt.JwtPayload } catch { throw new AppError(401, 'Invite link is invalid or expired') }
  if (claims.purpose !== 'set-password' || typeof claims.sub !== 'string') throw new AppError(401, 'Invite link is invalid or expired')
  const user = await db.user.update({ where: { id: claims.sub }, data: { passwordHash: await bcrypt.hash(password, 12), active: true }, select: { id: true, name: true, email: true, role: true } })
  return issueToken(user)
}

export async function createInviteToken(userId: string) {
  return jwt.sign({ purpose: 'set-password' }, env.JWT_SECRET, { subject: userId, expiresIn: '72h' })
}

function issueToken(user: { id: string; name: string; email: string; role: UserRole }) {
  const token = jwt.sign({ role: user.role, email: user.email }, env.JWT_SECRET, { subject: user.id, expiresIn: '8h' })
  return { token, user }
}