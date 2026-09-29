import type { Request, Response } from 'express'
import { inviteRecruiter, deactivateRecruiter, listRecruiters } from '../services/user.service'
import { z } from 'zod'
import { routeParam } from '../utils/request'

const inviteSchema = z.object({ name: z.string().trim().min(2), email: z.email(), jobIds: z.array(z.string()).default([]) })
export async function recruiters(_req: Request, res: Response) { res.json(await listRecruiters()) }
export async function invite(req: Request, res: Response) { res.status(201).json(await inviteRecruiter(inviteSchema.parse(req.body))) }
export async function deactivate(req: Request, res: Response) { res.json(await deactivateRecruiter(routeParam(req, 'id'))) }