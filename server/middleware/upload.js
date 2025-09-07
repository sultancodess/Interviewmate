import multer from 'multer'
import path from 'path'
import fs from 'fs'

// Ensure upload directory exists
const uploadDir = 'uploads'
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'uploads/'
    
    // Create subfolders based on file type
    if (file.fieldname === 'resume') {
      folder += 'resumes/'
    } else if (file.fieldname === 'jobDescription') {
      folder += 'job-descriptions/'
    } else if (file.fieldname === 'customQuestions') {
      folder += 'custom-questions/'
    }
    
    // Ensure subfolder exists
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true })
    }
    
    cb(null, folder)
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname)
    const name = path.basename(file.originalname, ext)
    cb(null, `${name}-${uniqueSuffix}${ext}`)
  }
})

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx|txt/
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedTypes.test(file.mimetype) || 
                   file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                   file.mimetype === 'application/msword'
  
  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb(new Error('Only PDF, DOC, DOCX, and TXT files are allowed'))
  }
}

// Configure multer
const upload = multer({
  storage,
  limits: { 
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
    files: 5 // Maximum 5 files per request
  },
  fileFilter
})

// Middleware for different upload types
export const uploadResume = upload.single('resume')
export const uploadJobDescription = upload.single('jobDescription')
export const uploadCustomQuestions = upload.single('customQuestions')
export const uploadMultiple = upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'jobDescription', maxCount: 1 },
  { name: 'customQuestions', maxCount: 1 }
])

// Error handling middleware
export const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 10MB.'
      })
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum 5 files allowed.'
      })
    }
  }
  
  if (error.message.includes('Only PDF, DOC, DOCX')) {
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }
  
  next(error)
}

export default upload