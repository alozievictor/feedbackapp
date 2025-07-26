import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetMeQuery } from './services/auth.service';

// Layout components
import Header from './components/Common/Header';
import Footer from './components/Common/Footer';
import Sidebar from './components/Common/Sidebar';

// Auth components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

// Dashboard components
import ClientDashboard from './components/Dashboard/ClientDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';

// Project components
import ProjectList from './components/Projects/ProjectList';
import ProjectDetails from './components/Projects/ProjectDetails';
import ProjectForm from './components/Projects/ProjectForm';

// File components
import FileViewer from './components/FileViewer/FileViewer';
import FileUpload from './components/FileViewer/FileUpload';

// Pages
import LandingPage from './pages/LandingPage';
import NotFound from './pages/NotFound';
import { ClientsPage } from './pages/Clients';

const App = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { isLoading } = useGetMeQuery(undefined, {
    skip: !isAuthenticated,
  });

  // Protected route wrapper
  const ProtectedRoute = ({ children, adminOnly = false }) => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <p>Loading...</p>
        </div>
      );
    }

    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }

    if (adminOnly && user?.role !== 'admin') {
      return <Navigate to="/dashboard" />;
    }

    return children;
  };

  return (
    <Router>
      {isAuthenticated ? (
        <div className="flex min-h-screen bg-gray-100">
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Header />
            <main className="flex-1 overflow-x-hidden overflow-y-auto">
              <Routes>
                <Route 
                  path="/" 
                  element={<Navigate to="/dashboard" replace />} 
                />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      {user?.role === 'admin' ? <AdminDashboard /> : <ClientDashboard />}
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/projects" 
                  element={
                    <ProtectedRoute>
                      <ProjectList />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/projects/new" 
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <ProjectForm />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/projects/:id" 
                  element={
                    <ProtectedRoute>
                      <ProjectDetails />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/projects/:projectId/files/:fileId" 
                  element={
                    <ProtectedRoute>
                      <FileViewer />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/projects/:projectId/upload" 
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <FileUpload />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/clients" 
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <ClientsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/clients" element={<ClientsList />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </div>
      ) : (
        <div className="">
          <main className="">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      )}
    </Router>
  );
};

export default App;
