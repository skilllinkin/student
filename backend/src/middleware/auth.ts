import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import type { AuthUser } from '../types'
import { AppError } from '../utils/errors'

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const token = req.header('authorization')?.replace(/^Bearer\s+/i, '')
  if (!token) return next(new AppError(401, 'Authentication required'))
  try {
    req.user = jwt.verify(token, env.JWT_SECRET) as AuthUser
    next()
  } catch {
    next(new AppError(401, 'Invalid or expired access token'))
  }
}