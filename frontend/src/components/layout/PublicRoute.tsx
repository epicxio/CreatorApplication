import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const PublicRoute: React.FC = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Debug: log the user object to check the role name
  console.log('User object:', user);

  // Only redirect to /get-to-know if coming from / or /login
  if (isAuthenticated) {
    if (
      user?.role?.name === 'Creator' &&
      (location.pathname === '/' || location.pathname === '/login')
    ) {
      return <Navigate to="/get-to-know" replace />;
    }
    if (location.pathname === '/' || location.pathname === '/login') {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
};

export default PublicRoute; 