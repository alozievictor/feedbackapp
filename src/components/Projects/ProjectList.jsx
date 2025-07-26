import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useGetAllProjectsQuery } from '../../services/api';
import { motion } from 'framer-motion';
import { FolderPlus, Search } from 'lucide-react';
import { useState } from 'react';

const ProjectList = () => {
  const { user } = useSelector(state => state.auth);
  const isAdmin = user?.role === 'admin';
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Query params for fetching projects
  const queryParams = isAdmin ? {} : { clientId: user?._id };
  
  const { data: projects, isLoading, error } = useGetAllProjectsQuery(queryParams);

  // Filter projects based on search term and status
  const filteredProjects = projects?.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="p-4 sm:p-8 text-center">
        <p className="text-xs sm:text-sm">Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-8 text-center text-red-500">
        <p className="text-xs sm:text-sm">Error loading projects. Please try again later.</p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'awaiting_feedback':
        return <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 whitespace-nowrap">Awaiting Feedback</span>;
      case 'feedback_received':
        return <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs rounded-full bg-blue-100 text-blue-800 whitespace-nowrap">Feedback Received</span>;
      case 'in_progress':
        return <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs rounded-full bg-purple-100 text-purple-800 whitespace-nowrap">In Progress</span>;
      case 'completed':
        return <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs rounded-full bg-green-100 text-green-800 whitespace-nowrap">Completed</span>;
      default:
        return <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs rounded-full bg-gray-100 text-gray-800 whitespace-nowrap">Unknown</span>;
    }
  };

  return (
    <div className="p-3 sm:p-4 md:p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            {isAdmin ? 'All Projects' : 'Your Projects'}
          </h1>
          
          {isAdmin && (
            <Link
              to="/projects/new"
              className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-600 text-white text-xs sm:text-sm rounded-md hover:bg-indigo-700 focus:outline-none w-full sm:w-auto justify-center sm:justify-start"
            >
              <FolderPlus className="h-3 w-3 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
              New Project
            </Link>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 mb-4 sm:mb-6">
          <div className="p-3 sm:p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-8 sm:pl-10 pr-2 sm:pr-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="w-full sm:w-48">
              <select
                className="block w-full py-1.5 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="awaiting_feedback">Awaiting Feedback</option>
                <option value="feedback_received">Feedback Received</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            {filteredProjects && filteredProjects.length > 0 ? (
              <>
                {/* Mobile view: Cards */}
                <div className="block sm:hidden">
                  <div className="divide-y divide-gray-200">
                    {filteredProjects.map((project) => (
                      <div 
                        key={project._id}
                        className="p-3 hover:bg-gray-50 cursor-pointer"
                        onClick={() => window.location.href = `/projects/${project._id}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium text-gray-900 text-sm break-words pr-2">{project.name}</div>
                          {getStatusBadge(project.status)}
                        </div>
                        
                        {isAdmin && (
                          <div className="text-xs text-gray-600 mb-1">
                            Client: {project.clientName}
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>Updated: {new Date(project.updatedAt).toLocaleDateString()}</span>
                          <span>{project.files?.length || 0} file(s)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Desktop view: Table */}
                <div className="hidden sm:block overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Project Name
                        </th>
                        {isAdmin && (
                          <th scope="col" className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Client
                          </th>
                        )}
                        <th scope="col" className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Updated
                        </th>
                        <th scope="col" className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Files
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredProjects.map((project) => (
                        <tr 
                          key={project._id}
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => window.location.href = `/projects/${project._id}`}
                        >
                          <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <div className="text-xs sm:text-sm font-medium text-gray-900">{project.name}</div>
                          </td>
                          {isAdmin && (
                            <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                              <div className="text-xs sm:text-sm text-gray-900">{project.clientName}</div>
                              <div className="text-xs text-gray-500">{project.clientEmail}</div>
                            </td>
                          )}
                          <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            {getStatusBadge(project.status)}
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                            {new Date(project.updatedAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                            {project.files?.length || 0} file(s)
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="text-center py-6 sm:py-8">
                <p className="text-xs sm:text-sm text-gray-500">No projects found.</p>
                {!searchTerm && !statusFilter && isAdmin && (
                  <p className="mt-2">
                    <Link to="/projects/new" className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-500">
                      Create your first project
                    </Link>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectList;
