import type { Request, Response } from 'express'
import { saveCandidateCv } from '../services/cv.service'
import { listCandidateApplications } from '../services/application.service'
import { AppError } from '../utils/errors'

export async function uploadCv(req: Request, res: Response) {
  if (!req.file || !req.user) throw new AppError(400, 'A PDF CV is required')
  res.status(201).json(await saveCandidateCv(req.user.id, req.file))
}

export async function myApplications(req: Request, res: Response) {
  res.json(await listCandidateApplications(req.user!.id))
}