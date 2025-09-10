import React, { useState, useRef } from 'react'
import { Upload } from 'lucide-react'
import { File } from 'lucide-react'
import { X } from 'lucide-react'
import { CheckCircle } from 'lucide-react'
import { AlertCircle } from 'lucide-react'
import { Loader } from 'lucide-react'
import toast from 'react-hot-toast'
import { apiService, handleApiResponse } from '../services/api'

const FileUpload = ({ 
  onFileSelect, 
  acceptedTypes = '.pdf,.doc,.docx,.txt',
  maxSize = 10 * 1024 * 1024, // 10MB
  label = 'Upload File',
  description = 'PDF, DOC, DOCX, TXT up to 10MB',
  multiple = false,
  uploadType = 'resume' // 'resume', 'jobDescription', 'customQuestions'
}) => {
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({})
  const inputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = async (fileList) => {
    const newFiles = Array.from(fileList)
    
    // Validate files
    const validFiles = newFiles.filter(file => {
      // Check file size
      if (file.size > maxSize) {
        toast.error(`File ${file.name} is too large. Maximum size is ${maxSize / 1024 / 1024}MB`)
        return false
      }
      
      // Check file type
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
      const allowedTypes = acceptedTypes.split(',').map(type => type.trim())
      if (!allowedTypes.includes(fileExtension)) {
        toast.error(`File ${file.name} is not supported. Allowed types: ${acceptedTypes}`)
        return false
      }
      
      return true
    })

    if (validFiles.length > 0) {
      // Upload files to server
      await uploadFiles(validFiles)
    }
  }

  const uploadFiles = async (filesToUpload) => {
    setUploading(true)
    
    try {
      const uploadedFiles = []
      
      for (const file of filesToUpload) {
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }))
        
        const formData = new FormData()
        formData.append(uploadType, file)
        
        let uploadEndpoint
        switch (uploadType) {
          case 'resume':
            uploadEndpoint = apiService.upload.resume
            break
          case 'jobDescription':
            uploadEndpoint = apiService.upload.jobDescription
            break
          case 'customQuestions':
            uploadEndpoint = apiService.upload.customQuestions
            break
          default:
            uploadEndpoint = apiService.upload.resume
        }
        
        const result = await handleApiResponse(() => uploadEndpoint(formData))
        
        if (result.success) {
          const uploadedFile = {
            ...file,
            serverInfo: result.data.file,
            uploaded: true
          }
          uploadedFiles.push(uploadedFile)
          setUploadProgress(prev => ({ ...prev, [file.name]: 100 }))
          toast.success(`${file.name} uploaded successfully!`)
        } else {
          toast.error(`Failed to upload ${file.name}: ${result.error}`)
          setUploadProgress(prev => ({ ...prev, [file.name]: -1 })) // Error state
        }
      }
      
      const updatedFiles = multiple ? [...files, ...uploadedFiles] : uploadedFiles
      setFiles(updatedFiles)
      onFileSelect?.(multiple ? updatedFiles : uploadedFiles[0])
      
    } catch (error) {
      toast.error('Upload failed: ' + error.message)
    } finally {
      setUploading(false)
      setTimeout(() => setUploadProgress({}), 2000) // Clear progress after 2 seconds
    }
  }

  const removeFile = async (index) => {
    const fileToRemove = files[index]
    
    // Delete from server if it was uploaded
    if (fileToRemove.serverInfo?.filename) {
      try {
        const result = await handleApiResponse(() => apiService.upload.delete(fileToRemove.serverInfo.filename))
        if (result.success) {
          toast.success('File deleted successfully')
        } else {
          toast.error('Failed to delete file from server')
        }
      } catch (error) {
        console.error('Error deleting file:', error)
      }
    }
    
    const updatedFiles = files.filter((_, i) => i !== index)
    setFiles(updatedFiles)
    onFileSelect?.(multiple ? updatedFiles : null)
  }

  const onButtonClick = () => {
    inputRef.current?.click()
  }

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={acceptedTypes}
          onChange={handleChange}
          className="hidden"
        />
        
        <div className="text-center">
          <Upload className={`mx-auto h-12 w-12 ${dragActive ? 'text-blue-400' : 'text-gray-400'}`} />
          <div className="mt-4">
            <button
              type="button"
              onClick={onButtonClick}
              disabled={uploading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                label
              )}
            </button>
            <p className="mt-2 text-sm text-gray-500">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500 mt-2">{description}</p>
        </div>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
            >
              <div className="flex items-center space-x-3">
                <File className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {uploadProgress[file.name] !== undefined ? (
                  uploadProgress[file.name] === -1 ? (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  ) : uploadProgress[file.name] === 100 ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Loader className="h-4 w-4 animate-spin text-blue-500" />
                      <span className="text-xs text-blue-500">{uploadProgress[file.name]}%</span>
                    </div>
                  )
                ) : file.uploaded ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                )}
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  disabled={uploading}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FileUpload