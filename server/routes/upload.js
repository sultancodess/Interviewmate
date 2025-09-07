import express from 'express'
import path from 'path'
import fs from 'fs'
import { protect } from '../middleware/auth.js'
import { uploadResume, uploadJobDescription, uploadCustomQuestions, uploadMultiple, handleUploadError } from '../middleware/upload.js'

const router = express.Router()

// @desc    Upload resume
// @route   POST /api/upload/resume
// @access  Private
router.post('/resume', protect, uploadResume, handleUploadError, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      })
    }

    const fileInfo = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
      uploadDate: new Date()
    }

    res.status(200).json({
      success: true,
      message: 'Resume uploaded successfully',
      file: fileInfo
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: error.message
    })
  }
})

// @desc    Upload job description
// @route   POST /api/upload/job-description
// @access  Private
router.post('/job-description', protect, uploadJobDescription, handleUploadError, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      })
    }

    const fileInfo = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
      uploadDate: new Date()
    }

    res.status(200).json({
      success: true,
      message: 'Job description uploaded successfully',
      file: fileInfo
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: error.message
    })
  }
})

// @desc    Upload custom questions
// @route   POST /api/upload/custom-questions
// @access  Private
router.post('/custom-questions', protect, uploadCustomQuestions, handleUploadError, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      })
    }

    const fileInfo = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
      uploadDate: new Date()
    }

    res.status(200).json({
      success: true,
      message: 'Custom questions uploaded successfully',
      file: fileInfo
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: error.message
    })
  }
})

// @desc    Upload multiple files
// @route   POST /api/upload/multiple
// @access  Private
router.post('/multiple', protect, uploadMultiple, handleUploadError, async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      })
    }

    const uploadedFiles = {}

    // Process each file type
    Object.keys(req.files).forEach(fieldName => {
      const files = req.files[fieldName]
      uploadedFiles[fieldName] = files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        size: file.size,
        mimetype: file.mimetype,
        uploadDate: new Date()
      }))
    })

    res.status(200).json({
      success: true,
      message: 'Files uploaded successfully',
      files: uploadedFiles
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: error.message
    })
  }
})

// @desc    Delete uploaded file
// @route   DELETE /api/upload/:filename
// @access  Private
router.delete('/:filename', protect, async (req, res) => {
  try {
    const { filename } = req.params
    
    // Security check - prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid filename'
      })
    }

    // Find file in upload directories
    const uploadDirs = ['uploads/resumes/', 'uploads/job-descriptions/', 'uploads/custom-questions/']
    let filePath = null

    for (const dir of uploadDirs) {
      const testPath = path.join(dir, filename)
      if (fs.existsSync(testPath)) {
        filePath = testPath
        break
      }
    }

    if (!filePath) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      })
    }

    // Delete file
    fs.unlinkSync(filePath)

    res.status(200).json({
      success: true,
      message: 'File deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete file',
      error: error.message
    })
  }
})

// @desc    Get file info
// @route   GET /api/upload/:filename
// @access  Private
router.get('/:filename', protect, async (req, res) => {
  try {
    const { filename } = req.params
    
    // Security check
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid filename'
      })
    }

    // Find file in upload directories
    const uploadDirs = ['uploads/resumes/', 'uploads/job-descriptions/', 'uploads/custom-questions/']
    let filePath = null
    let fileStats = null

    for (const dir of uploadDirs) {
      const testPath = path.join(dir, filename)
      if (fs.existsSync(testPath)) {
        filePath = testPath
        fileStats = fs.statSync(testPath)
        break
      }
    }

    if (!filePath) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      })
    }

    const fileInfo = {
      filename,
      path: filePath,
      size: fileStats.size,
      createdAt: fileStats.birthtime,
      modifiedAt: fileStats.mtime
    }

    res.status(200).json({
      success: true,
      file: fileInfo
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get file info',
      error: error.message
    })
  }
})

export default router