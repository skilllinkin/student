import multer from 'multer'
import { MAX_CV_BYTES } from '../utils/pdf'

export const cvUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_CV_BYTES, files: 1 },
  fileFilter: (_req, file, callback) => {
    if (file.mimetype !== 'application/pdf') return callback(new Error('PDF files only'))
    callback(null, true)
  },
})