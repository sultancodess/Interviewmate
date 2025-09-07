import jsPDF from 'jspdf'
// import html2canvas from 'html2canvas'

// Company branding colors
const COLORS = {
  primary: '#3B82F6',
  secondary: '#8B5CF6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  gray: '#6B7280',
  dark: '#1F2937'
}

export const generateInterviewReport = async (interview) => {
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  let yPosition = 20

  // Helper function to add new page if needed
  const checkPageBreak = (requiredSpace = 20) => {
    if (yPosition + requiredSpace > pageHeight - 20) {
      pdf.addPage()
      yPosition = 20
      return true
    }
    return false
  }

  // Helper function to add text with word wrap
  const addWrappedText = (text, x, y, maxWidth, fontSize = 10) => {
    pdf.setFontSize(fontSize)
    const lines = pdf.splitTextToSize(text, maxWidth)
    pdf.text(lines, x, y)
    return lines.length * (fontSize * 0.35) // Return height used
  }

  try {
    // Header with logo and branding
    pdf.setFillColor(59, 130, 246) // Blue background
    pdf.rect(0, 0, pageWidth, 40, 'F')
    
    // Logo placeholder (you can add actual logo later)
    pdf.setFillColor(255, 255, 255)
    pdf.circle(25, 20, 8, 'F')
    pdf.setTextColor(59, 130, 246)
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    pdf.text('IM', 22, 23)
    
    // Company name and tagline
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(24)
    pdf.setFont('helvetica', 'bold')
    pdf.text('InterviewMate', 40, 22)
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.text('AI-Powered Interview Practice Platform', 40, 30)
    
    // Report title
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text('INTERVIEW PERFORMANCE REPORT', pageWidth - 80, 25)
    
    yPosition = 50

    // Candidate Information Section
    pdf.setTextColor(0, 0, 0)
    pdf.setFontSize(18)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Interview Summary', 20, yPosition)
    yPosition += 10

    // Candidate details box
    pdf.setFillColor(248, 250, 252) // Light gray background
    pdf.rect(20, yPosition, pageWidth - 40, 35, 'F')
    pdf.setDrawColor(229, 231, 235)
    pdf.rect(20, yPosition, pageWidth - 40, 35, 'S')
    
    yPosition += 8
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Candidate:', 25, yPosition)
    pdf.setFont('helvetica', 'normal')
    pdf.text(interview.candidateInfo.name, 60, yPosition)
    
    yPosition += 6
    pdf.setFont('helvetica', 'bold')
    pdf.text('Position:', 25, yPosition)
    pdf.setFont('helvetica', 'normal')
    pdf.text(interview.candidateInfo.role, 60, yPosition)
    
    yPosition += 6
    pdf.setFont('helvetica', 'bold')
    pdf.text('Company:', 25, yPosition)
    pdf.setFont('helvetica', 'normal')
    pdf.text(interview.candidateInfo.company, 60, yPosition)
    
    yPosition += 6
    pdf.setFont('helvetica', 'bold')
    pdf.text('Interview Type:', 25, yPosition)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`${interview.type.charAt(0).toUpperCase() + interview.type.slice(1)} Interview`, 60, yPosition)
    
    yPosition += 6
    pdf.setFont('helvetica', 'bold')
    pdf.text('Date:', 25, yPosition)
    pdf.setFont('helvetica', 'normal')
    pdf.text(new Date(interview.createdAt).toLocaleDateString(), 60, yPosition)
    
    // Right side info
    yPosition -= 24
    pdf.setFont('helvetica', 'bold')
    pdf.text('Duration:', pageWidth - 80, yPosition)
    pdf.setFont('helvetica', 'normal')
    pdf.text(interview.formattedDuration || `${interview.configuration.duration} min`, pageWidth - 40, yPosition)
    
    yPosition += 6
    pdf.setFont('helvetica', 'bold')
    pdf.text('Difficulty:', pageWidth - 80, yPosition)
    pdf.setFont('helvetica', 'normal')
    pdf.text(interview.configuration.difficulty.charAt(0).toUpperCase() + interview.configuration.difficulty.slice(1), pageWidth - 40, yPosition)
    
    yPosition += 6
    pdf.setFont('helvetica', 'bold')
    pdf.text('Experience:', pageWidth - 80, yPosition)
    pdf.setFont('helvetica', 'normal')
    pdf.text(interview.candidateInfo.experience.charAt(0).toUpperCase() + interview.candidateInfo.experience.slice(1), pageWidth - 40, yPosition)
    
    yPosition += 30

    checkPageBreak(40)

    // Performance Overview Section
    pdf.setFontSize(18)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Performance Overview', 20, yPosition)
    yPosition += 15

    // Overall Score - Large display
    const scoreColor = interview.evaluation.overallScore >= 80 ? COLORS.success : 
                      interview.evaluation.overallScore >= 60 ? COLORS.warning : COLORS.danger
    
    // Score circle
    pdf.setFillColor(scoreColor.substring(1, 3), scoreColor.substring(3, 5), scoreColor.substring(5, 7))
    pdf.circle(50, yPosition + 15, 20, 'F')
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(24)
    pdf.setFont('helvetica', 'bold')
    pdf.text(`${interview.evaluation.overallScore}%`, 35, yPosition + 18)
    
    // Grade
    pdf.setTextColor(0, 0, 0)
    pdf.setFontSize(16)
    pdf.text(`Grade: ${interview.performanceGrade}`, 80, yPosition + 10)
    
    // Performance description
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'normal')
    let performanceText = ''
    if (interview.evaluation.overallScore >= 90) {
      performanceText = 'Outstanding Performance! Excellent interview skills demonstrated.'
    } else if (interview.evaluation.overallScore >= 80) {
      performanceText = 'Great Performance! Strong interview skills with minor areas for improvement.'
    } else if (interview.evaluation.overallScore >= 70) {
      performanceText = 'Good Performance! Solid foundation with room for growth.'
    } else if (interview.evaluation.overallScore >= 60) {
      performanceText = 'Fair Performance! Several areas need improvement.'
    } else {
      performanceText = 'Needs Improvement! Focus on developing core interview skills.'
    }
    
    addWrappedText(performanceText, 80, yPosition + 20, pageWidth - 100, 12)
    yPosition += 45

    checkPageBreak(60)

    // Skills Breakdown Section
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Skills Assessment', 20, yPosition)
    yPosition += 10

    const skills = [
      { name: 'Communication', score: interview.evaluation.skillScores?.communication || 0 },
      { name: 'Technical Knowledge', score: interview.evaluation.skillScores?.technicalKnowledge || 0 },
      { name: 'Problem Solving', score: interview.evaluation.skillScores?.problemSolving || 0 },
      { name: 'Confidence', score: interview.evaluation.skillScores?.confidence || 0 },
      { name: 'Clarity', score: interview.evaluation.skillScores?.clarity || 0 },
      { name: 'Behavioral', score: interview.evaluation.skillScores?.behavioral || 0 }
    ]

    skills.forEach((skill, _index) => {
      checkPageBreak(15)
      
      // Skill name
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'normal')
      pdf.text(skill.name, 25, yPosition)
      
      // Progress bar background
      pdf.setFillColor(229, 231, 235)
      pdf.rect(80, yPosition - 4, 80, 6, 'F')
      
      // Progress bar fill
      const fillWidth = (skill.score / 100) * 80
      const barColor = skill.score >= 80 ? [16, 185, 129] : 
                      skill.score >= 60 ? [245, 158, 11] : [239, 68, 68]
      pdf.setFillColor(barColor[0], barColor[1], barColor[2])
      pdf.rect(80, yPosition - 4, fillWidth, 6, 'F')
      
      // Score text
      pdf.setFont('helvetica', 'bold')
      pdf.text(`${skill.score}%`, 170, yPosition)
      
      yPosition += 12
    })

    yPosition += 10
    checkPageBreak(40)

    // Strengths Section
    if (interview.evaluation.strengths && interview.evaluation.strengths.length > 0) {
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(16, 185, 129) // Green color
      pdf.text('💪 Key Strengths', 20, yPosition)
      yPosition += 10

      interview.evaluation.strengths.forEach((strength, _index) => {
        checkPageBreak(15)
        pdf.setTextColor(0, 0, 0)
        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'normal')
        pdf.text('•', 25, yPosition)
        const textHeight = addWrappedText(strength, 30, yPosition, pageWidth - 50, 10)
        yPosition += Math.max(textHeight, 8)
      })
      yPosition += 10
    }

    checkPageBreak(40)

    // Areas for Improvement Section
    if (interview.evaluation.weaknesses && interview.evaluation.weaknesses.length > 0) {
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(245, 158, 11) // Orange color
      pdf.text('🎯 Areas for Improvement', 20, yPosition)
      yPosition += 10

      interview.evaluation.weaknesses.forEach((weakness, _index) => {
        checkPageBreak(15)
        pdf.setTextColor(0, 0, 0)
        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'normal')
        pdf.text('•', 25, yPosition)
        const textHeight = addWrappedText(weakness, 30, yPosition, pageWidth - 50, 10)
        yPosition += Math.max(textHeight, 8)
      })
      yPosition += 10
    }

    checkPageBreak(40)

    // AI Recommendations Section
    if (interview.evaluation.recommendations && interview.evaluation.recommendations.length > 0) {
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(59, 130, 246) // Blue color
      pdf.text('🤖 AI-Powered Recommendations', 20, yPosition)
      yPosition += 10

      interview.evaluation.recommendations.forEach((recommendation, _index) => {
        checkPageBreak(15)
        pdf.setTextColor(0, 0, 0)
        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'normal')
        pdf.text('•', 25, yPosition)
        const textHeight = addWrappedText(recommendation, 30, yPosition, pageWidth - 50, 10)
        yPosition += Math.max(textHeight, 8)
      })
      yPosition += 10
    }

    checkPageBreak(60)

    // Detailed Feedback Section
    if (interview.evaluation.detailedFeedback) {
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(0, 0, 0)
      pdf.text('📝 Detailed AI Analysis', 20, yPosition)
      yPosition += 10

      // Background box for detailed feedback
      const feedbackHeight = 40
      pdf.setFillColor(248, 250, 252)
      pdf.rect(20, yPosition - 5, pageWidth - 40, feedbackHeight, 'F')
      pdf.setDrawColor(229, 231, 235)
      pdf.rect(20, yPosition - 5, pageWidth - 40, feedbackHeight, 'S')

      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      addWrappedText(interview.evaluation.detailedFeedback, 25, yPosition + 5, pageWidth - 50, 10)
      yPosition += feedbackHeight + 10
    }

    // Footer
    const footerY = pageHeight - 15
    pdf.setFontSize(8)
    pdf.setTextColor(107, 114, 128)
    pdf.setFont('helvetica', 'normal')
    pdf.text('Generated by InterviewMate AI - Your Interview Practice Partner', 20, footerY)
    pdf.text(`Report generated on ${new Date().toLocaleDateString()}`, pageWidth - 60, footerY)
    
    // Add page numbers
    const pageCount = pdf.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i)
      pdf.setFontSize(8)
      pdf.setTextColor(107, 114, 128)
      pdf.text(`Page ${i} of ${pageCount}`, pageWidth - 30, footerY)
    }

    // Save the PDF
    const fileName = `InterviewMate_Report_${interview.candidateInfo.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
    pdf.save(fileName)
    
    return {
      success: true,
      fileName,
      message: 'Report generated successfully!'
    }

  } catch (error) {
    console.error('PDF generation error:', error)
    return {
      success: false,
      error: error.message,
      message: 'Failed to generate PDF report'
    }
  }
}

// Function to generate a quick summary PDF (lighter version)
export const generateQuickReport = async (interview) => {
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  
  try {
    // Header
    pdf.setFillColor(59, 130, 246)
    pdf.rect(0, 0, pageWidth, 30, 'F')
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(20)
    pdf.setFont('helvetica', 'bold')
    pdf.text('InterviewMate Quick Report', 20, 20)
    
    // Basic info
    let y = 50
    pdf.setTextColor(0, 0, 0)
    pdf.setFontSize(14)
    pdf.text(`${interview.candidateInfo.name} - ${interview.candidateInfo.role}`, 20, y)
    y += 10
    pdf.setFontSize(12)
    pdf.text(`Score: ${interview.evaluation.overallScore}% | Grade: ${interview.performanceGrade}`, 20, y)
    y += 10
    pdf.text(`Date: ${new Date(interview.createdAt).toLocaleDateString()}`, 20, y)
    
    // Quick stats
    y += 20
    pdf.setFontSize(10)
    const skills = Object.entries(interview.evaluation.skillScores || {})
    skills.forEach(([skill, score]) => {
      pdf.text(`${skill}: ${score}%`, 20, y)
      y += 6
    })
    
    const fileName = `InterviewMate_Quick_${interview.candidateInfo.name.replace(/\s+/g, '_')}.pdf`
    pdf.save(fileName)
    
    return { success: true, fileName }
  } catch (error) {
    return { success: false, error: error.message }
  }
}