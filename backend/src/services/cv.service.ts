import { db } from '../config/db'
import { createCvSignedUrl, uploadPrivateCv } from '../config/storage'
import { assertPdf } from '../utils/pdf'
import { forbidden, notFound } from '../utils/errors'

export async function saveCandidateCv(candidateId: string, file: Express.Multer.File) {
  assertPdf(file)
  const path = await uploadPrivateCv(candidateId, file.originalname, file.buffer)
  return db.candidateProfile.upsert({ where: { userId: candidateId }, create: { userId: candidateId, cvPath: path, cvName: file.originalname }, update: { cvPath: path, cvName: file.originalname } })
}

export async function getCvUrl(candidateId: string, cvId: string) {
  const cv = await db.applicationCv.findUnique({ where: { id: cvId }, include: { application: { include: { job: { include: { assignments: true } } } } } })
  if (!cv) throw notFound('CV not found')
  const canRead = cv.application.candidateId === candidateId || cv.application.job.assignments.some((assignment) => assignment.recruiterId === candidateId)
  if (!canRead) throw forbidden()
  return createCvSignedUrl(cv.filePath)
}