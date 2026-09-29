import cors from 'cors'
import express from 'express'
import rateLimit from 'express-rate-limit'
import { env } from './config/env'
import authRoutes from './routes/auth.routes'
import candidateRoutes from './routes/candidate.routes'
import jobRoutes from './routes/job.routes'
import applicationRoutes from './routes/application.routes'
import interviewRoutes from './routes/interview.routes'
import recruiterRoutes from './routes/recruiter.routes'
import adminRoutes from './routes/admin.routes'
import dashboardRoutes from './routes/dashboard.routes'
import aiRoutes from './routes/ai.routes'
import { errorHandler } from './middleware/errorHandler'

export const app = express()
app.disable('x-powered-by')
app.use(cors({ origin: env.FRONTEND_ORIGIN, credentials: true }))
app.use(express.json({ limit: '1mb' }))
app.use('/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 30 }), authRoutes)
app.get('/health', (_req, res) => res.json({ status: 'ok' }))
app.use('/candidate', candidateRoutes)
app.use('/jobs', jobRoutes)
app.use('/applications', applicationRoutes)
app.use('/applications', interviewRoutes)
app.use('/recruiter', recruiterRoutes)
app.use('/admin', adminRoutes)
app.use('/admin/dashboard', dashboardRoutes)
app.use('/ai', aiRoutes)
app.use(errorHandler)