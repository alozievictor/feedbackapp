import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetProjectsQuery } from '../../services/project.service';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const ClientDashboard = () => {
  const { user } = useSelector(state => state.auth);
  const { data: projects, isLoading, error } = useGetProjectsQuery({ clientId: user?._id });
  const navigate = useNavigate();

  // Redirect if user is not a client
  useEffect(() => {
    if (user && user.role !== 'client') {
      navigate('/admin-dashboard');
    }
  }, [user, navigate]);

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <p>Loading your projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        <p>Error loading your projects. Please try again later.</p>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'awaiting_feedback':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'feedback_received':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'awaiting_feedback':
        return 'Waiting for your feedback';
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

  return (
    <div className="p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h1>
          <p className="text-gray-600 mt-1">Here's an overview of your projects with Rivong.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects && projects.length > 0 ? (
            projects.map((project) => (
              <Link key={project._id} to={`/projects/${project._id}`}>
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-all hover:shadow-lg"
                >
                  <div className="p-5">
                    <h3 className="font-semibold text-lg text-gray-900">{project.name}</h3>
                    
                    <div className="mt-4 flex items-center">
                      {getStatusIcon(project.status)}
                      <span className="ml-2 text-sm text-gray-600">
                        {getStatusText(project.status)}
                      </span>
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        Files: {project.files?.length || 0}
                      </div>
                      <div className="text-sm text-gray-500">
                        Last updated: {new Date(project.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))
          ) : (
            <div className="col-span-full bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
              <p className="text-gray-500">No projects available yet.</p>
              <p className="mt-2 text-gray-500">The Rivong team will add projects for you soon.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ClientDashboard;
