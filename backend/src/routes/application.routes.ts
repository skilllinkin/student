import { Router } from 'express'
import { apply, applicationCv, applicationDetails, addNote, changeApplicationStage, candidateApplications, withdraw } from '../controllers/application.controller'
import { authenticate } from '../middleware/auth'
import { requireRole } from '../middleware/roles'
import { asyncHandler } from '../utils/asyncHandler'

const router = Router()
router.use(authenticate)
router.post('/', requireRole('CANDIDATE'), asyncHandler(apply))
router.get('/candidate', requireRole('CANDIDATE'), asyncHandler(candidateApplications))
router.get('/:id/cv', asyncHandler(applicationCv))
router.get('/:id', asyncHandler(applicationDetails))
router.patch('/:id/withdraw', requireRole('CANDIDATE'), asyncHandler(withdraw))
router.patch('/:id/stage', requireRole('RECRUITER', 'ADMIN'), asyncHandler(changeApplicationStage))
router.post('/:id/notes', requireRole('RECRUITER', 'ADMIN'), asyncHandler(addNote))
export default router