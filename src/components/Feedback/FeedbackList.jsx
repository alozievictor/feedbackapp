import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGetProjectsQuery } from '../../services/project.service';
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Search,
  Filter,
  SortDesc,
  ChevronDown,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';

const FeedbackList = () => {
  const { data: projects, isLoading, refetch } = useGetProjectsQuery();
  const [filter, setFilter] = useState('all'); // all, pending, resolved
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date'); // date, project, status
  const [sortOrder, setSortOrder] = useState('desc'); // asc, desc
  const [feedbackItems, setFeedbackItems] = useState([]);

  // Process feedback data from projects
  useEffect(() => {
    if (!projects) return;

    // Extract all feedback items from all projects
    let allFeedback = [];
    projects.forEach(project => {
      if (project.files) {
        project.files.forEach(file => {
          if (file.feedback) {
            const fileFeedback = file.feedback.map(fb => ({
              ...fb,
              projectId: project._id,
              projectName: project.name,
              fileName: file.name,
              fileId: file._id
            }));
            allFeedback = [...allFeedback, ...fileFeedback];
          }
        });
      }
    });

    // Apply filters
    let filtered = [...allFeedback];
    
    // Filter by status
    if (filter === 'pending') {
      filtered = filtered.filter(fb => !fb.resolved);
    } else if (filter === 'resolved') {
      filtered = filtered.filter(fb => fb.resolved);
    }
    
    // Search by content, project name or file name
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        fb => fb.content?.toLowerCase().includes(term) || 
              fb.projectName?.toLowerCase().includes(term) ||
              fb.fileName?.toLowerCase().includes(term)
      );
    }
    
    // Sort the feedback items
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === 'project') {
        return sortOrder === 'asc'
          ? a.projectName.localeCompare(b.projectName)
          : b.projectName.localeCompare(a.projectName);
      }
      if (sortBy === 'status') {
        if (sortOrder === 'asc') {
          return a.resolved === b.resolved ? 0 : a.resolved ? 1 : -1;
        } else {
          return a.resolved === b.resolved ? 0 : a.resolved ? -1 : 1;
        }
      }
      return 0;
    });
    
    setFeedbackItems(filtered);
  }, [projects, filter, searchTerm, sortBy, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const getStatusIcon = (status) => {
    if (status) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    return <Clock className="h-5 w-5 text-yellow-500" />;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading feedback data...</p>
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Feedback Management</h1>
          <button 
            onClick={() => refetch()}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>

        {/* Search and filter controls */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search feedback..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Feedback</option>
              <option value="pending">Pending Feedback</option>
              <option value="resolved">Resolved Feedback</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SortDesc className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Sort by Date</option>
              <option value="project">Sort by Project</option>
              <option value="status">Sort by Status</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button 
                onClick={toggleSortOrder}
                className="focus:outline-none"
                aria-label="Toggle sort order"
              >
                <ChevronDown className={`h-4 w-4 text-gray-400 transform ${sortOrder === 'asc' ? 'rotate-180' : ''} transition-transform`} />
              </button>
            </div>
          </div>
        </div>

        {/* Feedback list */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {feedbackItems.length > 0 ? (
              feedbackItems.map((feedback) => (
                <li key={feedback._id}>
                  <Link 
                    to={`/feedback/${feedback._id}`}
                    className="block hover:bg-gray-50"
                  >
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {getStatusIcon(feedback.resolved)}
                          <p className="ml-2 text-sm font-medium text-gray-900 truncate">
                            {feedback.content?.substring(0, 100)}
                            {feedback.content?.length > 100 ? '...' : ''}
                          </p>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            feedback.resolved
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {feedback.resolved ? 'Resolved' : 'Pending'}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            <span>Project: {feedback.projectName}</span>
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                            <span>File: {feedback.fileName}</span>
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p>
                            {new Date(feedback.createdAt).toLocaleDateString()} at {new Date(feedback.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))
            ) : (
              <li className="px-4 py-5 sm:px-6 text-center text-gray-500">
                No feedback found matching your criteria.
              </li>
            )}
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default FeedbackList;
