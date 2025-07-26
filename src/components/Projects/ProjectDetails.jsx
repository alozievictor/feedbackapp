import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  useGetProjectByIdQuery, 
  useGetFilesByProjectQuery, 
  useUpdateProjectMutation 
} from '../../services/api';
import { setCurrentProject, setCurrentFile } from '../../features/projects/projectSlice';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  MessageSquare, 
  Clock,
  CheckCircle,
  Edit,
  AlertCircle,
  Loader
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Messages from '../Messages/Messages';

const ProjectDetails = () => {
  const { id } = useParams();
  const { data: project, isLoading: projectLoading } = useGetProjectByIdQuery(id);
  const { data: files, isLoading: filesLoading } = useGetFilesByProjectQuery(id);
  const [updateProject, { isLoading: updateLoading }] = useUpdateProjectMutation();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const isAdmin = user?.role === 'admin';
  const navigate = useNavigate();
  
  const [statusUpdate, setStatusUpdate] = useState('');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  useEffect(() => {
    if (project) {
      dispatch(setCurrentProject(project));
      setStatusUpdate(project.status);
    }
  }, [project, dispatch]);

  const handleStatusChange = async () => {
    if (statusUpdate !== project.status) {
      try {
        await updateProject({ id, status: statusUpdate }).unwrap();
      } catch (error) {
        console.error('Failed to update project status:', error);
      }
    }
    setShowStatusDropdown(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'awaiting_feedback':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'feedback_received':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case 'in_progress':
        return <Edit className="h-5 w-5 text-purple-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'awaiting_feedback':
        return 'Waiting for feedback';
      case 'feedback_received':
        return 'Feedback received';
      case 'in_progress':
        return 'In progress';
      case 'completed':
        return 'Completed';
      default:
        return 'Unknown status';
    }
  };

  const handleFileClick = (file) => {
    dispatch(setCurrentFile(file));
    navigate(`/projects/${id}/files/${file._id}`);
  };

  if (projectLoading || filesLoading) {
    return (
      <div className="p-4 sm:p-8 text-center">
        <Loader className="animate-spin h-6 w-6 sm:h-8 sm:w-8 mx-auto text-indigo-600" />
        <p className="mt-3 sm:mt-4 text-xs sm:text-sm">Loading project details...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-4 sm:p-8 text-center">
        <p className="text-red-500 text-xs sm:text-sm">Project not found.</p>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-3 sm:mb-6">
          <Link
            to="/projects"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 text-xs sm:text-sm"
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            Back to Projects
          </Link>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Project Info */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 mb-6">
              <div className="p-3 sm:p-4 md:p-6 border-b border-gray-200">
                <div className="flex flex-wrap justify-between items-start gap-2 sm:gap-0">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">{project.name}</h1>
                    {isAdmin && (
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        Client: {project.clientName} ({project.clientEmail})
                      </p>
                    )}
                  </div>
                  
                  <div className="mt-1 sm:mt-2 lg:mt-0 w-full sm:w-auto">
                    <div className="relative">
                      <button
                        className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none w-full sm:w-auto justify-center sm:justify-start"
                        onClick={() => isAdmin && setShowStatusDropdown(!showStatusDropdown)}
                        disabled={!isAdmin}
                      >
                        <span className="flex items-center">
                          {getStatusIcon(project.status)}
                          <span className="ml-2">{getStatusText(project.status)}</span>
                        </span>
                      </button>
                      
                      {showStatusDropdown && (
                        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-10">
                          <div className="py-1">
                            <button
                              className={`text-left w-full px-4 py-2 text-sm ${statusUpdate === 'in_progress' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}
                              onClick={() => setStatusUpdate('in_progress')}
                            >
                              <div className="flex items-center">
                                <Edit className="h-4 w-4 mr-2 text-purple-500" />
                                In Progress
                              </div>
                            </button>
                            <button
                              className={`text-left w-full px-4 py-2 text-sm ${statusUpdate === 'awaiting_feedback' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}
                              onClick={() => setStatusUpdate('awaiting_feedback')}
                            >
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-yellow-500" />
                                Awaiting Feedback
                              </div>
                            </button>
                            <button
                              className={`text-left w-full px-4 py-2 text-sm ${statusUpdate === 'feedback_received' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}
                              onClick={() => setStatusUpdate('feedback_received')}
                            >
                              <div className="flex items-center">
                                <AlertCircle className="h-4 w-4 mr-2 text-blue-500" />
                                Feedback Received
                              </div>
                            </button>
                            <button
                              className={`text-left w-full px-4 py-2 text-sm ${statusUpdate === 'completed' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}
                              onClick={() => setStatusUpdate('completed')}
                            >
                              <div className="flex items-center">
                                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                Completed
                              </div>
                            </button>
                          </div>
                          <div className="py-1">
                            <button
                              className="text-left w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                              onClick={handleStatusChange}
                              disabled={updateLoading || statusUpdate === project.status}
                            >
                              {updateLoading ? (
                                <>
                                  <Loader className="animate-spin h-4 w-4 mr-2" />
                                  Updating...
                                </>
                              ) : (
                                'Update Status'
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-3 sm:p-4 md:p-6">
                <div className="mb-4 sm:mb-6">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Description</h2>
                  <p className="text-xs sm:text-sm text-gray-700">
                    {project.description || 'No description provided.'}
                  </p>
                </div>
                
                <div className="mb-3 sm:mb-4">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Project Files</h2>
                  
                  {isAdmin && (
                    <button
                      className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none mb-3 sm:mb-4 text-xs sm:text-sm"
                      onClick={() => navigate(`/projects/${id}/upload`)}
                    >
                      <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      Upload File
                    </button>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {files && files.length > 0 ? (
                      files.map((file) => (
                        <motion.div 
                          key={file._id}
                          whileHover={{ scale: 1.02 }}
                          className="bg-gray-50 border border-gray-200 rounded-md p-3 cursor-pointer"
                          onClick={() => handleFileClick(file)}
                        >
                          <div className="flex items-start space-x-2 sm:space-x-3">
                            <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-500 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <h3 className="font-medium text-xs sm:text-sm text-gray-900 truncate">{file.name}</h3>
                              <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">
                                Uploaded: {new Date(file.createdAt).toLocaleDateString()}
                              </p>
                              <div className="flex items-center mt-1 sm:mt-2">
                                <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 mr-1" />
                                <span className="text-xs text-gray-500">
                                  {file.feedback?.length || 0} feedback items
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="col-span-full py-6 sm:py-8 text-center text-gray-500">
                        <p className="text-xs sm:text-sm">No files have been uploaded yet.</p>
                        {isAdmin && (
                          <p className="mt-2">
                            <button
                              className="text-indigo-600 hover:text-indigo-500 text-xs sm:text-sm"
                              onClick={() => navigate(`/projects/${id}/upload`)}
                            >
                              Upload your first file
                            </button>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Activity Panel */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 mb-6">
              <div className="p-3 sm:p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="font-semibold text-gray-900 text-sm sm:text-base">
                  <MessageSquare className="h-4 w-4 inline-block mr-1 mb-0.5" />
                  Project Messages
                </h2>
              </div>
              
              <div className="h-[500px]">
                <Messages projectId={id} projectName={project.name} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 lg:sticky lg:top-6">
              <div className="p-3 sm:p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="font-semibold text-gray-900 text-sm sm:text-base">Activity</h2>
              </div>
              
              <div className="p-3 sm:p-4 max-h-[400px] sm:max-h-[600px] overflow-y-auto">
                {project.activity && project.activity.length > 0 ? (
                  <div className="space-y-3 sm:space-y-4">
                    {project.activity.map((item, index) => (
                      <div key={index} className="border-l-2 border-indigo-200 pl-2 sm:pl-3">
                        <p className="text-xs sm:text-sm text-gray-600">{item.action}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(item.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-xs sm:text-sm text-center py-4 sm:py-6">
                    No activity recorded yet.
                  </p>
                )}
              </div>
              
              <div className="p-3 sm:p-4 border-t border-gray-200 bg-gray-50 text-xs sm:text-sm text-gray-500">
                <p>
                  Project created: {new Date(project.createdAt).toLocaleDateString()}
                </p>
                <p>
                  Last updated: {new Date(project.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectDetails;
