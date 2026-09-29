import { Router } from 'express'
import { createInterview } from '../controllers/interview.controller'
import { authenticate } from '../middleware/auth'
import { requireRole } from '../middleware/roles'
import { asyncHandler } from '../utils/asyncHandler'

const router = Router()
router.post('/:id/interview', authenticate, requireRole('RECRUITER', 'ADMIN'), asyncHandler(createInterview))
export default router