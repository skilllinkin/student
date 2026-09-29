import { Router } from 'express'
import { deactivate, invite, recruiters } from '../controllers/admin.controller'
import { authenticate } from '../middleware/auth'
import { requireRole } from '../middleware/roles'
import { asyncHandler } from '../utils/asyncHandler'

const router = Router()
router.use(authenticate, requireRole('ADMIN'))
router.get('/recruiters', asyncHandler(recruiters))
router.post('/recruiters', asyncHandler(invite))
router.patch('/recruiters/:id/deactivate', asyncHandler(deactivate))
export default router