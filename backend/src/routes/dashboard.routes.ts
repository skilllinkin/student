import { Router } from 'express'
import { dashboard } from '../controllers/dashboard.controller'
import { authenticate } from '../middleware/auth'
import { requireRole } from '../middleware/roles'
import { asyncHandler } from '../utils/asyncHandler'

const router = Router()
router.get('/', authenticate, requireRole('ADMIN', 'RECRUITER'), asyncHandler(dashboard))
export default router