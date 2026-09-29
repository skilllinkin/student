import type { Request, Response } from 'express'
import { ApplicationStage, UserRole } from '@prisma/client'
import { db } from '../config/db'
import { applyToJob, getApplication, listCandidateApplications, listJobApplications, withdrawApplication } from '../services/application.service'
import { getCvUrl } from '../services/cv.service'
import { changeStage } from '../services/stage.service'
import { applySchema, noteSchema, stageSchema } from '../validators/application.validator'
import { forbidden, notFound } from '../utils/errors'
import { routeParam } from '../utils/request'

export async function apply(req: Request, res: Response) {
  const { jobId } = applySchema.parse(req.body)
  const application = await applyToJob(req.user!.id, jobId)
  res.status(201).json(application)
}

export async function candidateApplications(req: Request, res: Response) { res.json(await listCandidateApplications(req.user!.id)) }
export async function recruiterJobApplications(req: Request, res: Response) { res.json(await listJobApplications(routeParam(req, 'jobId'), req.user!.role === UserRole.RECRUITER ? req.user!.id : undefined)) }
export async function applicationDetails(req: Request, res: Response) {
  const app = await getApplication(routeParam(req, 'id'), req.user!)
  const { filePath: _privatePath, ...cv } = app.cv ?? {}
  res.json({ ...app, cv: app.cv ? cv : null })
}
export async function withdraw(req: Request, res: Response) { res.json(await withdrawApplication(routeParam(req, 'id'), req.user!.id)) }
export async function changeApplicationStage(req: Request, res: Response) {
  const { stage } = stageSchema.parse(req.body)
  res.json(await changeStage(routeParam(req, 'id'), stage, req.user!))
}
export async function addNote(req: Request, res: Response) {
  const { content } = noteSchema.parse(req.body)
  const app = await getApplication(routeParam(req, 'id'), req.user!)
  if (req.user!.role === UserRole.CANDIDATE) throw forbidden()
  const note = await db.recruiterNote.create({ data: { applicationId: app.id, recruiterId: req.user!.id, content } })
  res.status(201).json(note)
}
export async function applicationCv(req: Request, res: Response) {
  const app = await getApplication(routeParam(req, 'id'), req.user!)
  if (!app.cv) throw notFound('CV not found')
  res.json({ url: await getCvUrl(req.user!.id, app.cv.id), expiresInSeconds: 60 })
}
export async function rejectApplication(req: Request, res: Response) {
  res.json(await changeStage(routeParam(req, 'id'), ApplicationStage.REJECTED, req.user!))
}