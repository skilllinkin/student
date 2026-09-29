import { Router } from 'express'
import { signin, signup, setPasswordController } from '../controllers/auth.controller'
import { asyncHandler } from '../utils/asyncHandler'

const router = Router()
router.post('/signup', asyncHandler(signup))
router.post('/signin', asyncHandler(signin))
router.post('/set-password', asyncHandler(setPasswordController))
export default router