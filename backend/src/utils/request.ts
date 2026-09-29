import type { Request } from 'express'
import { AppError } from './errors'

export function routeParam(req: Request, key: string) {
  const value = req.params[key]
  if (typeof value !== 'string' || value.length === 0) throw new AppError(400, `Missing route parameter: ${key}`)
  return value
}