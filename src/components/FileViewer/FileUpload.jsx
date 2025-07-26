import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUploadFileMutation } from '../../services/project.service';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, File, X, Loader } from 'lucide-react';

const FileUpload = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [uploadFile, { isLoading }] = useUploadFileMutation();
  
  // Debug the projectId
  console.log('Current projectId from params:', projectId);
  
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadError, setUploadError] = useState(null);
  
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };
  
  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };
  
  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList);
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
  };
  
  const removeFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };
  
  // Function to directly upload file using fetch API
  const uploadFileDirectly = async (file, projectId) => {
    // Get the auth token from localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Authentication token not found');
    }
    
    // Create FormData
    const formData = new FormData();
    formData.append('file', file);
    
    console.log('Direct upload FormData created with file:', file.name);
    
    // Make direct fetch request
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/files/project/${projectId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Do not set Content-Type, let the browser set it with the boundary
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'File upload failed');
    }
    
    return await response.json();
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) return;
    
    setUploadError(null);
    
    try {
      // Upload files one by one
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        setUploadProgress(prev => ({
          ...prev,
          [i]: 0
        }));
        
        // Create a mock progress update
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            const currentProgress = prev[i] || 0;
            return {
              ...prev,
              [i]: Math.min(currentProgress + 5, 95) // Max progress is 95% until complete
            };
          });
        }, 200);
        
        // Log the file to verify contents
        console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type);
        
        // Validate projectId before making the API call
        if (!projectId) {
          throw new Error('Project ID is missing or invalid');
        }
        
        console.log('Sending file to project:', projectId);
        
        // Try direct upload instead of using RTK Query
        await uploadFileDirectly(file, projectId);
        
        clearInterval(progressInterval);
        
        setUploadProgress(prev => ({
          ...prev,
          [i]: 100
        }));
      }
      
      // Navigate back to project details
      if (projectId) {
        navigate(`/projects/${projectId}`);
      } else {
        console.error('No projectId available for navigation');
        navigate('/projects');
      }
      
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadError(error.data?.message || error.message || 'Failed to upload file(s). Please try again.');
    }
  };
  
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <button
            onClick={() => navigate(`/projects/${projectId}`)}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Project
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Upload Files</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Upload design files for client review</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-4 sm:p-6">
            {uploadError && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-3 py-2 sm:px-4 sm:py-3 rounded text-sm sm:text-base">
                {uploadError}
              </div>
            )}
            
            <div 
              className={`border-2 border-dashed rounded-lg p-4 sm:p-8 text-center ${
                dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'
              }`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-gray-400" />
              
              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-700 font-medium">
                Drop your files here, or{' '}
                <label className="text-indigo-600 hover:text-indigo-500 cursor-pointer">
                  browse
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleChange}
                    multiple
                    disabled={isLoading}
                  />
                </label>
              </p>
              
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                Upload any file format, max 50MB per file
              </p>
            </div>
            
            {files.length > 0 && (
              <div className="mt-4 sm:mt-6">
                <h3 className="font-medium text-gray-900 text-sm sm:text-base mb-2 sm:mb-3">Files to upload</h3>
                <div className="space-y-2 sm:space-y-3">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex flex-wrap sm:flex-nowrap items-center justify-between p-2 sm:p-3 bg-gray-50 border border-gray-200 rounded-md"
                    >
                      <div className="flex items-center w-full sm:w-auto mb-2 sm:mb-0">
                        <File className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mr-2 sm:mr-3 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[180px] sm:max-w-xs">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center w-full sm:w-auto justify-end">
                        {uploadProgress[index] !== undefined && (
                          <div className="w-16 sm:w-24 bg-gray-200 rounded-full h-1.5 sm:h-2 mr-2 sm:mr-3">
                            <div
                              className="bg-indigo-600 h-1.5 sm:h-2 rounded-full"
                              style={{ width: `${uploadProgress[index]}%` }}
                            ></div>
                          </div>
                        )}
                        
                        {uploadProgress[index] === 100 ? (
                          <span className="text-green-500 text-xs">Complete</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-gray-400 hover:text-gray-600"
                            disabled={isLoading}
                          >
                            <X className="h-5 w-5" />
                            <span className="sr-only">Remove file</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0">
              <button
                type="button"
                onClick={() => navigate(`/projects/${projectId}`)}
                className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none sm:mr-3"
                disabled={isLoading}
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={files.length === 0 || isLoading}
                className="w-full sm:w-auto inline-flex items-center justify-center px-3 sm:px-4 py-1.5 sm:py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:bg-indigo-400"
              >
                {isLoading ? (
                  <>
                    <Loader className="animate-spin h-4 w-4 mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload {files.length} {files.length === 1 ? 'file' : 'files'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default FileUpload;
