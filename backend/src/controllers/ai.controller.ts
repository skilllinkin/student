import type { Request, Response } from 'express'
import { readAiSummary, requestSummary } from '../services/aiSummary.service'
import { routeParam } from '../utils/request'

export async function summary(req: Request, res: Response) { res.json(await readAiSummary(routeParam(req, 'id'), req.user!)) }
export async function retrySummary(req: Request, res: Response) { res.status(202).json(await requestSummary(routeParam(req, 'id'), req.user!)) }