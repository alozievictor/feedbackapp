import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Download, 
  MessageSquare, 
  Loader,
  Send,
} from 'lucide-react';
import { 
  useGetProjectQuery, 
  useGetFeedbackQuery,
  useAddFeedbackMutation
} from '../../services/project.service';

const FileViewer = () => {
  const { projectId, fileId } = useParams();
  const navigate = useNavigate();
  const { currentProject, currentFile } = useSelector(state => state.projects);
  const { user } = useSelector(state => state.auth);
  const isAdmin = user?.role === 'admin';
  
  const { data: project } = useGetProjectQuery(projectId);
  const { data: feedback, isLoading: feedbackLoading } = useGetFeedbackQuery(
    { projectId, fileId },
    { skip: !fileId }
  );
  
  const [addFeedback, { isLoading: addingFeedback }] = useAddFeedbackMutation();
  
  const [newFeedback, setNewFeedback] = useState('');
  const [file, setFile] = useState(null);
  
  useEffect(() => {
    // If we have the file in Redux state, use it
    if (currentFile) {
      setFile(currentFile);
    } else if (project) {
      // Otherwise try to find it from the project data
      const foundFile = project.files?.find(f => f._id === fileId);
      if (foundFile) {
        setFile(foundFile);
      }
    }
  }, [currentFile, project, fileId]);

  const handleSubmitFeedback = async () => {
    if (!newFeedback.trim()) return;
    
    try {
      await addFeedback({
        projectId,
        fileId,
        feedback: {
          comment: newFeedback,
          userId: user._id,
          userName: user.name,
        },
      }).unwrap();
      
      // Clear the input after successful submission
      setNewFeedback('');
    } catch (error) {
      console.error('Error adding feedback:', error);
    }
  };

  if (!file) {
    return (
      <div className="p-4 sm:p-8 text-center">
        <Loader className="animate-spin h-6 w-6 sm:h-8 sm:w-8 mx-auto text-indigo-600" />
        <p className="mt-3 sm:mt-4 text-xs sm:text-sm">Loading file...</p>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-3 md:p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-3 sm:mb-6">
          <button
            onClick={() => navigate(`/projects/${projectId}`)}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 text-sm"
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            Back to Project
          </button>
          
          <a
            href={file.url}
            download={file.name}
            className="w-full sm:w-auto inline-flex items-center justify-center px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 text-gray-700 text-xs sm:text-sm rounded-md hover:bg-gray-200 focus:outline-none"
          >
            <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Download File
          </a>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* File Preview */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 mb-4 sm:mb-6">
              <div className="p-3 sm:p-6 border-b border-gray-200">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 break-words">{file.name}</h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Uploaded on {new Date(file.createdAt).toLocaleDateString()}
                </p>
              </div>
              
              <div className="p-2 sm:p-3 md:p-6">
                <div className="bg-gray-100 rounded-lg p-2 sm:p-4 flex items-center justify-center" style={{ minHeight: '200px', height: 'calc(30vh + 50px)' }}>
                  {/* File preview based on type */}
                  {file.type?.startsWith('image/') ? (
                    <img 
                      src={file.url} 
                      alt={file.name}
                      className="max-w-full max-h-full object-contain rounded" 
                    />
                  ) : file.type === 'application/pdf' ? (
                    <iframe
                      src={file.url}
                      title={file.name}
                      className="w-full h-[300px] sm:h-[500px]"
                    />
                  ) : (
                    <div className="text-center">
                      <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">Preview not available for this file type</p>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-600 text-white text-xs sm:text-sm rounded-md hover:bg-indigo-700 focus:outline-none"
                      >
                        Open File
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Feedback Panel */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 lg:sticky lg:top-6">
              <div className="p-3 sm:p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h2 className="font-semibold text-gray-900 text-sm sm:text-base">Feedback</h2>
                <div className="flex items-center text-xs sm:text-sm text-gray-500">
                  <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  {feedback?.length || 0}
                </div>
              </div>
              
              <div className="p-3 sm:p-4 max-h-[300px] sm:max-h-[400px] overflow-y-auto">
                {feedbackLoading ? (
                  <div className="text-center py-4 sm:py-6">
                    <Loader className="animate-spin h-5 w-5 sm:h-6 sm:w-6 mx-auto text-indigo-600" />
                    <p className="mt-2 text-xs sm:text-sm text-gray-500">Loading feedback...</p>
                  </div>
                ) : feedback && feedback.length > 0 ? (
                  <div className="space-y-3 sm:space-y-4">
                    {feedback.map((item) => (
                      <div 
                        key={item._id} 
                        className={`p-2 sm:p-3 rounded-lg ${
                          item.userId === user._id 
                            ? 'bg-indigo-50 ml-2 sm:ml-4' 
                            : 'bg-gray-50 mr-2 sm:mr-4'
                        }`}
                      >
                        <div className="flex flex-col xs:flex-row justify-between items-start gap-1 xs:gap-0">
                          <p className="font-medium text-xs sm:text-sm">{item.userName}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(item.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-700 mt-1">{item.comment}</p>
                        
                        {isAdmin && item.status && (
                          <div className="mt-1 sm:mt-2 text-xs">
                            <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-xs ${
                              item.status === 'implemented' 
                                ? 'bg-green-100 text-green-800' 
                                : item.status === 'rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 sm:py-6 text-gray-500">
                    <p className="text-xs sm:text-sm">No feedback yet.</p>
                    <p className="mt-1 sm:mt-2 text-xs sm:text-sm">Be the first to add your comments!</p>
                  </div>
                )}
              </div>
              
              <div className="p-3 sm:p-4 border-t border-gray-200">
                <div className="relative">
                  <textarea
                    value={newFeedback}
                    onChange={(e) => setNewFeedback(e.target.value)}
                    placeholder="Add your feedback here..."
                    className="w-full p-2 sm:p-3 pr-10 sm:pr-12 text-xs sm:text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    rows={3}
                  />
                  <button
                    onClick={handleSubmitFeedback}
                    disabled={!newFeedback.trim() || addingFeedback}
                    className="absolute right-2 sm:right-3 bottom-2 sm:bottom-3 text-indigo-600 hover:text-indigo-700 p-1 rounded-full hover:bg-gray-100 disabled:text-gray-400 disabled:hover:bg-transparent"
                  >
                    {addingFeedback ? (
                      <Loader className="animate-spin h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FileViewer;
