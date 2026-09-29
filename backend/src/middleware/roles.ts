import type { RequestHandler } from 'express'
import type { UserRole } from '@prisma/client'
import { forbidden } from '../utils/errors'

export const requireRole = (...roles: UserRole[]): RequestHandler => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) return next(forbidden())
  next()
}