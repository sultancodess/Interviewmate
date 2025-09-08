import express from 'express'
import { body, validationResult } from 'express-validator'
import Interview from '../models/Interview.js'
import Report from '../models/Report.js'
import User from '../models/User.js'
import { protect } from '../middleware/auth.js'
import { generatePDFReport } from '../utils/pdfGenerator.js'

const router = express.Router()

// @desc    Generate interview report
// @route   POST /api/reports/generate/:interviewId
// @access  Private
router.post('/generate/:interviewId', protect, async (req, res, next) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.interviewId,
      userId: req.user.id
    })

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      })
    }

    if (!interview.evaluation) {
      return res.status(400).json({
        success: false,
        message: 'Interview has not been evaluated yet'
      })
    }

    // Check if report already exists
    let report = await Report.findOne({ interviewId: interview._id })

    if (!report) {
      // Create new report
      report = await Report.create({
        userId: req.user.id,
        interviewId: interview._id,
        data: {
          candidateInfo: interview.candidateInfo,
          interviewDetails: {
            type: interview.type,
            duration: interview.configuration.duration,
            difficulty: interview.configuration.difficulty,
            date: interview.createdAt
          },
          evaluation: interview.evaluation,
          analytics: interview.analytics || {}
        }
      })
    }

    // Generate PDF if not exists
    if (!report.files.pdf.url) {
      try {
        const pdfResult = await generatePDFReport(interview, report)
        
        if (pdfResult.success) {
          report.files.pdf = {
            url: pdfResult.url,
            path: pdfResult.path,
            size: pdfResult.size,
            generatedAt: new Date()
          }
          report.status = 'completed'
          await report.save()
        }
      } catch (pdfError) {
        console.error('PDF generation failed:', pdfError)
        // Continue without PDF - report can still be viewed online
      }
    }

    res.status(200).json({
      success: true,
      report
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Get report by ID
// @route   GET /api/reports/:reportId
// @access  Private
router.get('/:reportId', protect, async (req, res, next) => {
  try {
    const report = await Report.findOne({
      _id: req.params.reportId,
      userId: req.user.id
    }).populate('interviewId')

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      })
    }

    res.status(200).json({
      success: true,
      report
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Get public report by slug
// @route   GET /api/reports/public/:slug
// @access  Public
router.get('/public/:slug', async (req, res, next) => {
  try {
    const report = await Report.findOne({
      'sharing.publicSlug': req.params.slug,
      'sharing.isPublic': true
    }).populate('interviewId')

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Public report not found'
      })
    }

    // Increment view count
    await report.incrementViews()

    res.status(200).json({
      success: true,
      report
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Share report publicly
// @route   POST /api/reports/:reportId/share
// @access  Private
router.post('/:reportId/share', protect, [
  body('platforms')
    .optional()
    .isArray()
    .withMessage('Platforms must be an array')
], async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const report = await Report.findOne({
      _id: req.params.reportId,
      userId: req.user.id
    })

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      })
    }

    // Generate public slug if not exists
    const publicSlug = report.generatePublicSlug()
    await report.save()

    // Track sharing platforms
    const { platforms = [] } = req.body
    platforms.forEach(platform => {
      report.sharing.sharedOn.push({
        platform,
        sharedAt: new Date(),
        url: `${process.env.CLIENT_URL}/reports/public/${publicSlug}`
      })
    })

    await report.save()

    res.status(200).json({
      success: true,
      publicUrl: `${process.env.CLIENT_URL}/reports/public/${publicSlug}`,
      report
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Download report PDF
// @route   GET /api/reports/:reportId/download
// @access  Private
router.get('/:reportId/download', protect, async (req, res, next) => {
  try {
    const report = await Report.findOne({
      _id: req.params.reportId,
      userId: req.user.id
    })

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      })
    }

    if (!report.files.pdf.path) {
      return res.status(404).json({
        success: false,
        message: 'PDF not available'
      })
    }

    // Set headers for file download
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="interview-report-${report.reportId}.pdf"`)
    
    // Stream the file
    res.sendFile(report.files.pdf.path, { root: '.' })
  } catch (error) {
    next(error)
  }
})

// @desc    Get user's reports
// @route   GET /api/reports
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const filter = { userId: req.user.id }
    
    if (req.query.status) {
      filter.status = req.query.status
    }

    const reports = await Report.find(filter)
      .populate('interviewId', 'type candidateInfo createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Report.countDocuments(filter)

    res.status(200).json({
      success: true,
      reports,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Delete report
// @route   DELETE /api/reports/:reportId
// @access  Private
router.delete('/:reportId', protect, async (req, res, next) => {
  try {
    const report = await Report.findOne({
      _id: req.params.reportId,
      userId: req.user.id
    })

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      })
    }

    // Delete PDF file if exists
    if (report.files.pdf.path) {
      try {
        const fs = await import('fs')
        await fs.promises.unlink(report.files.pdf.path)
      } catch (fileError) {
        console.error('Failed to delete PDF file:', fileError)
      }
    }

    await report.deleteOne()

    res.status(200).json({
      success: true,
      message: 'Report deleted successfully'
    })
  } catch (error) {
    next(error)
  }
})

export default router