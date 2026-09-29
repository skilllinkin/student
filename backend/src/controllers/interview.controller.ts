import type { Request, Response } from 'express'
import { scheduleInterview } from '../services/interview.service'
import { interviewSchema } from '../validators/interview.validator'
import { routeParam } from '../utils/request'

export async function createInterview(req: Request, res: Response) {
  const body = interviewSchema.parse(req.body)
  res.status(201).json(await scheduleInterview(routeParam(req, 'id'), req.user!.id, body.startsAt, body.locationOrLink, req.user!.role))
}