import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateProjectMutation, useGetAllUsersQuery } from '../../services/api';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Loader } from 'lucide-react';

const ProjectForm = () => {
  const [createProject, { isLoading }] = useCreateProjectMutation();
  const { data: usersData, isLoading: loadingUsers, error: usersError } = useGetAllUsersQuery({ clients: true });
  const navigate = useNavigate();
  
  // Extract the users array from the response
  const users = usersData?.users || [];
  
  useEffect(() => {
    if (usersData) {
      console.log('Users data:', usersData);
    }
    if (usersError) {
      console.error('Error loading users:', usersError);
    }
  }, [usersData, usersError]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    clientId: '',
    clientName: '',
    clientEmail: '',
  });
  
  const [errors, setErrors] = useState({});
  const [useExistingClient, setUseExistingClient] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }
    
    if (useExistingClient) {
      if (!formData.clientId) {
        newErrors.clientId = 'Please select a client';
      }
    } else {
      if (!formData.clientName.trim()) {
        newErrors.clientName = 'Client name is required';
      }
      
      if (!formData.clientEmail.trim()) {
        newErrors.clientEmail = 'Client email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clientEmail)) {
        newErrors.clientEmail = 'Please enter a valid email address';
      }
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      // Prepare project data based on form selection
      const projectData = {
        name: formData.name,
        description: formData.description,
        status: 'in_progress', // Default status
      };
      
      // Add client info based on selection method
      if (useExistingClient) {
        projectData.clientId = formData.clientId;
      } else {
        projectData.clientName = formData.clientName;
        projectData.clientEmail = formData.clientEmail;
      }
      
      const result = await createProject(projectData).unwrap();
      
      navigate(`/projects/${result._id}`);
    } catch (err) {
      console.error('Failed to create project:', err);
      setErrors({
        form: err.data?.message || 'Failed to create project. Please try again.'
      });
    }
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
            onClick={() => navigate('/projects')} 
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Projects
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-900">Create New Project</h1>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            {errors.form && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {errors.form}
              </div>
            )}
            
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                    errors.name ? 'ring-red-500' : 'ring-gray-300'
                  } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                  placeholder="Enter project name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Enter project description"
                />
              </div>
              
              <div className="mb-4">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    <input
                      id="new-client"
                      name="client-option"
                      type="radio"
                      checked={!useExistingClient}
                      onChange={() => setUseExistingClient(false)}
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="new-client" className="ml-2 block text-sm text-gray-700">
                      Add new client
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="existing-client"
                      name="client-option"
                      type="radio"
                      checked={useExistingClient}
                      onChange={() => setUseExistingClient(true)}
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="existing-client" className="ml-2 block text-sm text-gray-700">
                      Select existing client
                    </label>
                  </div>
                </div>
                
                {useExistingClient ? (
                  <>
                    <label htmlFor="clientId" className="block text-sm font-medium text-gray-700 mb-1">
                      Select Client*
                    </label>
                    <select
                      id="clientId"
                      name="clientId"
                      value={formData.clientId}
                      onChange={handleChange}
                      className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                        errors.clientId ? 'ring-red-500' : 'ring-gray-300'
                      } focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                      disabled={loadingUsers}
                    >
                      <option value="">-- Select a Client --</option>
                      {Array.isArray(users) && users.length > 0 ? (
                        users.filter(user => user.role === 'client').map(client => (
                          <option key={client._id} value={client._id}>
                            {client.name} ({client.email})
                          </option>
                        ))
                      ) : (
                        <option disabled>No clients available</option>
                      )}
                    </select>
                    {errors.clientId && (
                      <p className="mt-1 text-sm text-red-600">{errors.clientId}</p>
                    )}
                  </>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-1">
                        Client Name*
                      </label>
                      <input
                        type="text"
                        id="clientName"
                        name="clientName"
                        value={formData.clientName}
                        onChange={handleChange}
                        className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                          errors.clientName ? 'ring-red-500' : 'ring-gray-300'
                        } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                        placeholder="Enter client name"
                      />
                      {errors.clientName && (
                        <p className="mt-1 text-sm text-red-600">{errors.clientName}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700 mb-1">
                        Client Email*
                      </label>
                      <input
                        type="email"
                        id="clientEmail"
                        name="clientEmail"
                        value={formData.clientEmail}
                        onChange={handleChange}
                        className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                          errors.clientEmail ? 'ring-red-500' : 'ring-gray-300'
                        } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                        placeholder="Enter client email"
                      />
                      {errors.clientEmail && (
                        <p className="mt-1 text-sm text-red-600">{errors.clientEmail}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/projects')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mr-3"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
              >
                {isLoading ? (
                  <>
                    <Loader className="animate-spin h-4 w-4 mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Project
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

export default ProjectForm;
