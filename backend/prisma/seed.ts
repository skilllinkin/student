import { ApplicationStage, JobStatus, PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

const db = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('DemoPass!234', 12)
  const admin = await db.user.upsert({ where: { email: 'admin@nowsheradigital.test' }, update: {}, create: { name: 'Nowshera Admin', email: 'admin@nowsheradigital.test', passwordHash, role: UserRole.ADMIN } })
  const recruiter = await db.user.upsert({ where: { email: 'fatima@nowsheradigital.test' }, update: {}, create: { name: 'Fatima Ali', email: 'fatima@nowsheradigital.test', passwordHash, role: UserRole.RECRUITER } })
  const candidate = await db.user.upsert({ where: { email: 'candidate@nowsheradigital.test' }, update: {}, create: { name: 'Demo Candidate', email: 'candidate@nowsheradigital.test', passwordHash, role: UserRole.CANDIDATE, candidate: { create: { cvPath: 'demo/candidate.pdf', cvName: 'Demo_CV.pdf' } } } })
  const job = await db.job.upsert({ where: { id: 'demo-product-designer' }, update: {}, create: { id: 'demo-product-designer', title: 'Product Designer', department: 'Design', location: 'Islamabad · Hybrid', type: 'Full-time', description: 'Shape accessible product experiences with a cross-functional team.', requirements: ['Product design', 'Figma and prototyping', 'Portfolio'], lastDate: new Date('2026-12-31'), openings: 2, status: JobStatus.OPEN } })
  await db.jobAssignment.upsert({ where: { jobId_recruiterId: { jobId: job.id, recruiterId: recruiter.id } }, update: {}, create: { jobId: job.id, recruiterId: recruiter.id } })
  await db.application.upsert({ where: { id: 'demo-application' }, update: {}, create: { id: 'demo-application', candidateId: candidate.id, jobId: job.id, stage: ApplicationStage.APPLIED, cv: { create: { filePath: 'demo/candidate.pdf', fileName: 'Demo_CV.pdf' } }, history: { create: { toStage: ApplicationStage.APPLIED, changedBy: admin.id } } } })
  console.info('Seeded demo users: admin@nowsheradigital.test, fatima@nowsheradigital.test, candidate@nowsheradigital.test (password: DemoPass!234)')
}

main().finally(() => db.$disconnect())