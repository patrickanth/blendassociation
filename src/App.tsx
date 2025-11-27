import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoadingSpinner from './components/common/LoadingSpinner';
import './App.css';

// Lazy loading per ottimizzare performance
const HomePage = lazy(() => import('./components/HomePage'));
const Eventi = lazy(() => import('./components/pages/Eventi'));
const Galleria = lazy(() => import('./components/pages/Galleria'));
const ChiSiamo = lazy(() => import('./components/pages/ChiSiamo'));
const AdminLogin = lazy(() => import('./components/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));

// Componente per le rotte protette
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullscreen text="Verifica autorizzazioni..." />;
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

// Componente per la route di login (redirect se già autenticato)
const LoginRoute: React.FC = () => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullscreen text="Caricamento..." />;
  }

  if (isAuthenticated && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <AdminLogin />;
};

// Loading fallback component
const PageLoader: React.FC = () => (
  <LoadingSpinner fullscreen text="Caricamento pagina..." />
);

// App Content con routing ottimizzato
const AppContent: React.FC = () => {
  return (
    <Router>
      <Helmet>
        <meta charSet="utf-8" />
        <title>BLEND | Minimal Deep Tech Events</title>
        <meta name="description" content="BLEND - Eventi esclusivi minimal deep tech e tech house" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        
        {/* Preconnect per ottimizzare caricamento font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Helmet>
      
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Rotte pubbliche - sempre accessibili */}
          <Route path="/" element={<HomePage />} />
          <Route path="/eventi" element={<Eventi />} />
          <Route path="/galleria" element={<Galleria />} />
          <Route path="/chi-siamo" element={<ChiSiamo />} />
          
          {/* Route login admin */}
          <Route path="/admin/login" element={<LoginRoute />} />
          
          {/* Rotte protette admin */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all - redirect a home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

// App principale
const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;