import { Router } from 'express'
import { createJobController, jobDetails, listJobs, openJob, closeJob } from '../controllers/job.controller'
import { authenticate } from '../middleware/auth'
import { requireRole } from '../middleware/roles'
import { asyncHandler } from '../utils/asyncHandler'

const router = Router()
router.get('/', asyncHandler(listJobs))
router.get('/:id', authenticate, asyncHandler(jobDetails))
router.post('/', authenticate, requireRole('ADMIN'), asyncHandler(createJobController))
router.patch('/:id/open', authenticate, requireRole('ADMIN'), asyncHandler(openJob))
router.patch('/:id/close', authenticate, requireRole('ADMIN'), asyncHandler(closeJob))
export default router