import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { requireRole } from '../middleware/roles'
import { cvUpload } from '../middleware/upload'
import { asyncHandler } from '../utils/asyncHandler'
import { myApplications, uploadCv } from '../controllers/candidate.controller'

const router = Router()
router.use(authenticate, requireRole('CANDIDATE'))
router.post('/cv', cvUpload.single('cv'), asyncHandler(uploadCv))
router.get('/applications', asyncHandler(myApplications))
export default router