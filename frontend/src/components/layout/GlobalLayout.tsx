import React from 'react';
import { Box } from '@mui/material';
import { Navbar } from '../common/Navbar';

interface GlobalLayoutProps {
  children: React.ReactNode;
}

export const GlobalLayout: React.FC<GlobalLayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box
        component="main"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '90vh',
          pt: 2,
          backgroundColor: 'background.default',
          width: '100%',
          mt: '64px', // Space for navbar
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default GlobalLayout;