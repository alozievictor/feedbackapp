import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGetProjectsQuery } from '../../services/project.service';
import { 
  useUpdateFeedbackMutation,
  useToggleResolveFeedbackMutation,
  useDeleteFeedbackMutation
} from '../../services/feedback.service';
import { 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft, 
  CheckSquare,
  Trash2,
  FileText,
  MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';

const FeedbackDetails = () => {
  const { id: feedbackId } = useParams();
  const navigate = useNavigate();
  const { data: projects, isLoading: isLoadingProjects } = useGetProjectsQuery();
  const [updateFeedback, { isLoading: isUpdating }] = useUpdateFeedbackMutation();
  const [toggleResolveFeedback, { isLoading: isToggling }] = useToggleResolveFeedbackMutation();
  const [deleteFeedback, { isLoading: isDeleting }] = useDeleteFeedbackMutation();
  
  const [feedback, setFeedback] = useState(null);
  const [comment, setComment] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Find the feedback with the given ID from all projects
  useEffect(() => {
    if (!projects) return;

    // Search for the feedback in all projects
    let foundFeedback = null;
    let projectInfo = null;
    let fileInfo = null;

    for (const project of projects) {
      if (project.files) {
        for (const file of project.files) {
          if (file.feedback) {
            const found = file.feedback.find(fb => fb._id === feedbackId);
            if (found) {
              foundFeedback = found;
              projectInfo = {
                id: project._id,
                name: project.name,
                client: project.clientName || 'Unknown Client'
              };
              fileInfo = {
                id: file._id,
                name: file.name,
                type: file.type,
                url: file.url
              };
              break;
            }
          }
        }
        if (foundFeedback) break;
      }
    }

    if (foundFeedback) {
      setFeedback({
        ...foundFeedback,
        project: projectInfo,
        file: fileInfo
      });
    }
  }, [projects, feedbackId]);

  const handleResolveToggle = async () => {
    try {
      await toggleResolveFeedback(feedbackId).unwrap();
      // Update local state to reflect the change
      setFeedback(prev => ({
        ...prev,
        resolved: !prev.resolved
      }));
    } catch (error) {
      console.error('Failed to toggle feedback status:', error);
      alert('Failed to update feedback status. Please try again.');
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    
    try {
      // Get current comments or initialize empty array
      const currentComments = feedback.comments || [];
      
      // Add new comment with timestamp
      const updatedComments = [
        ...currentComments,
        {
          text: comment,
          createdAt: new Date().toISOString()
        }
      ];
      
      // Update feedback with new comments
      await updateFeedback({ 
        feedbackId, 
        comments: updatedComments 
      }).unwrap();
      
      // Update local state
      setFeedback(prev => ({
        ...prev,
        comments: updatedComments
      }));
      
      // Clear comment input
      setComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
      alert('Failed to add comment. Please try again.');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteFeedback(feedbackId).unwrap();
      navigate('/feedback');
    } catch (error) {
      console.error('Failed to delete feedback:', error);
      alert('Failed to delete feedback. Please try again.');
    }
  };

  if (isLoadingProjects || !feedback) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading feedback details...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header with navigation */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/feedback')}
              className="mr-4 text-gray-400 hover:text-gray-600"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Feedback Details</h1>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleResolveToggle}
              disabled={isToggling}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                feedback.resolved
                  ? 'bg-yellow-600 hover:bg-yellow-700'
                  : 'bg-green-600 hover:bg-green-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {feedback.resolved ? (
                <>
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Mark as Pending
                </>
              ) : (
                <>
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Mark as Resolved
                </>
              )}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
        </div>

        {/* Status banner */}
        <div className={`mb-6 p-4 rounded-md ${
          feedback.resolved
            ? 'bg-green-50 border border-green-200'
            : 'bg-yellow-50 border border-yellow-200'
        }`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {feedback.resolved ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              )}
            </div>
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${
                feedback.resolved ? 'text-green-800' : 'text-yellow-800'
              }`}>
                {feedback.resolved ? 'Resolved Feedback' : 'Pending Feedback'}
              </h3>
              <div className={`mt-2 text-sm ${
                feedback.resolved ? 'text-green-700' : 'text-yellow-700'
              }`}>
                <p>
                  {feedback.resolved
                    ? 'This feedback has been resolved and action has been taken.'
                    : 'This feedback is still pending resolution.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback content */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Feedback Information
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Created on {new Date(feedback.createdAt).toLocaleDateString()} at {new Date(feedback.createdAt).toLocaleTimeString()}
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Project</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <Link to={`/projects/${feedback.project.id}`} className="text-indigo-600 hover:text-indigo-900">
                    {feedback.project.name}
                  </Link>
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Client</dt>
                <dd className="mt-1 text-sm text-gray-900">{feedback.project.client}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">File</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <Link 
                    to={`/projects/${feedback.project.id}/files/${feedback.file.id}`} 
                    className="flex items-center text-indigo-600 hover:text-indigo-900"
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    {feedback.file.name}
                  </Link>
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    feedback.resolved
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {feedback.resolved ? 'Resolved' : 'Pending'}
                  </span>
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Feedback Content</dt>
                <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                  {feedback.content}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Comments section */}
        <div className="bg-white shadow sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Comments
            </h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800">
              {feedback.comments?.length || 0} comments
            </span>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-4">
              {feedback.comments && feedback.comments.length > 0 ? (
                feedback.comments.map((comment, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-md">
                    <div className="text-sm text-gray-900 whitespace-pre-wrap">{comment.text}</div>
                    <div className="mt-2 text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">No comments yet.</p>
              )}
            </div>

            <div className="mt-6">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                Add a comment
              </label>
              <div className="mt-1">
                <textarea
                  id="comment"
                  name="comment"
                  rows={3}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleAddComment}
                  disabled={isUpdating || !comment.trim()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Add Comment
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Delete confirmation modal */}
        {showDeleteConfirm && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <Trash2 className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Delete feedback</h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to delete this feedback? This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default FeedbackDetails;
