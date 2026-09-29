import { badRequest } from './errors'

export const MAX_CV_BYTES = 2 * 1024 * 1024

export function assertPdf(file: Express.Multer.File) {
  if (file.mimetype !== 'application/pdf' || file.size > MAX_CV_BYTES || file.size === 0) {
    throw badRequest('Upload a valid PDF CV no larger than 2 MB')
  }
  if (file.buffer.subarray(0, 5).toString() !== '%PDF-') throw badRequest('The uploaded file is not a valid PDF')
}