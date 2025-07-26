import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetProjectsQuery } from '../../services/project.service';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart2,
  Inbox,
  Plus,
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useSelector(state => state.auth);
  const { data: projects, isLoading, error } = useGetProjectsQuery({});
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    pendingFeedback: 0,
    completedProjects: 0,
    totalClients: 0,
  });

  // Redirect if user is not an admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (projects) {
      // Calculate dashboard stats
      const totalProjects = projects.length;
      const activeProjects = projects.filter(p => p.status !== 'completed').length;
      const pendingFeedback = projects.filter(p => p.status === 'awaiting_feedback').length;
      const completedProjects = projects.filter(p => p.status === 'completed').length;
      
      // Get unique client count
      const clientIds = new Set(projects.map(p => p.clientId));
      const totalClients = clientIds.size;

      setStats({
        totalProjects,
        activeProjects,
        pendingFeedback,
        completedProjects,
        totalClients,
      });
    }
  }, [projects]);

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        <p>Error loading dashboard data. Please try again later.</p>
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

  const recentProjects = projects?.slice(0, 5) || [];

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user?.name}</p>
          </div>
          <Link
            to="/projects/new"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Project
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-lg shadow border border-gray-200"
          >
            <div className="flex items-center">
              <div className="inline-flex p-3 rounded-full bg-blue-100 text-blue-500">
                <FileText className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Projects</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalProjects}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-lg shadow border border-gray-200"
          >
            <div className="flex items-center">
              <div className="inline-flex p-3 rounded-full bg-yellow-100 text-yellow-500">
                <Inbox className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Feedback</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pendingFeedback}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-lg shadow border border-gray-200"
          >
            <div className="flex items-center">
              <div className="inline-flex p-3 rounded-full bg-green-100 text-green-500">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.completedProjects}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-lg shadow border border-gray-200"
          >
            <div className="flex items-center">
              <div className="inline-flex p-3 rounded-full bg-purple-100 text-purple-500">
                <Users className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Clients</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalClients}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentProjects.length > 0 ? (
              recentProjects.map((project) => (
                <Link
                  key={project._id}
                  to={`/projects/${project._id}`}
                  className="flex items-center p-5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{project.name}</h3>
                    <p className="text-sm text-gray-500">
                      Client: {project.clientName || 'Unknown Client'}
                    </p>
                  </div>
                  <div className="flex items-center">
                    {getStatusIcon(project.status)}
                    <span className="ml-2 text-sm text-gray-600">{project.status}</span>
                  </div>
                  <div className="ml-6 text-sm text-gray-500">
                    Last updated: {new Date(project.updatedAt).toLocaleDateString()}
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                <p>No projects available yet.</p>
              </div>
            )}
          </div>
          <div className="bg-gray-50 px-6 py-3">
            <Link
              to="/projects"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              View all projects
            </Link>
          </div>
        </div>

        {/* Activity Chart Placeholder */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Activity Overview</h2>
          </div>
          <div className="p-6 flex justify-center items-center h-64 bg-gray-50">
            <div className="text-center text-gray-500">
              <BarChart2 className="h-12 w-12 mx-auto text-gray-400" />
              <p className="mt-2">Activity chart will be displayed here</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
