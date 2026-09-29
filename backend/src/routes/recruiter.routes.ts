import { Router } from 'express'
import { db } from '../config/db'
import { UserRole } from '@prisma/client'
import { authenticate } from '../middleware/auth'
import { requireRole } from '../middleware/roles'
import { asyncHandler } from '../utils/asyncHandler'
import { listJobApplications } from '../services/application.service'
import { listRecruiterJobs } from '../services/job.service'
import { routeParam } from '../utils/request'

const router = Router()
router.use(authenticate, requireRole('RECRUITER', 'ADMIN'))
router.get('/jobs', asyncHandler(async (req, res) => res.json(req.user!.role === UserRole.ADMIN ? await db.job.findMany() : await listRecruiterJobs(req.user!.id))))
router.get('/jobs/:jobId/applications', asyncHandler(async (req, res) => res.json(await listJobApplications(routeParam(req, 'jobId'), req.user!.role === UserRole.RECRUITER ? req.user!.id : undefined))))
export default router