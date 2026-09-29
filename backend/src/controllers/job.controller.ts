import type { Request, Response } from 'express'
import { JobStatus } from '@prisma/client'
import { createJob, getJob, listOpenJobs, setJobStatus } from '../services/job.service'
import { jobSchema } from '../validators/job.validator'
import { routeParam } from '../utils/request'

export async function listJobs(_req: Request, res: Response) { res.json(await listOpenJobs()) }
export async function jobDetails(req: Request, res: Response) { res.json(await getJob(routeParam(req, 'id'), req.user!)) }
export async function createJobController(req: Request, res: Response) { res.status(201).json(await createJob(jobSchema.parse(req.body))) }
export async function openJob(req: Request, res: Response) { res.json(await setJobStatus(routeParam(req, 'id'), JobStatus.OPEN)) }
export async function closeJob(req: Request, res: Response) { res.json(await setJobStatus(routeParam(req, 'id'), JobStatus.CLOSED)) }