/**
 * InterviewSetup Page
 * 
 * This page provides the main interface for setting up interviews.
 * It uses the comprehensive InterviewSetupForm component that includes
 * all the features specified in the InterviewMate requirements.
 */

import React from 'react'
import DashboardLayout from '../components/Layout/DashboardLayout'
import InterviewSetupForm from '../components/InterviewSetup/InterviewSetupForm'

const InterviewSetup = () => {
  return (
    <DashboardLayout>
      <InterviewSetupForm />
    </DashboardLayout>
  )
}

export default InterviewSetup