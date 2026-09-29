import { Router } from 'express'
import { retrySummary, summary } from '../controllers/ai.controller'
import { authenticate } from '../middleware/auth'
import { requireRole } from '../middleware/roles'
import { asyncHandler } from '../utils/asyncHandler'

const router = Router()
router.use(authenticate, requireRole('RECRUITER', 'ADMIN'))
router.get('/applications/:id/ai-summary', asyncHandler(summary))
router.post('/applications/:id/ai-summary/retry', asyncHandler(retrySummary))
export default router