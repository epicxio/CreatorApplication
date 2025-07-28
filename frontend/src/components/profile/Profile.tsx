import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  Divider,
  Button,
  useTheme,
} from '@mui/material';
import {
  Person,
  Email,
  School,
  Business,
  Edit,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const theme = useTheme();

  const profileSections = [
    {
      title: 'Personal Information',
      icon: <Person />,
      items: [
        { label: 'Full Name', value: user?.name },
        { label: 'Email', value: user?.email },
        { label: 'Role', value: user?.role },
      ],
    },
    {
      title: 'School Information',
      icon: <School />,
      items: [
        { label: 'School Name', value: user?.schoolName },
        { label: 'Grade Level', value: user?.gradeLevel },
        { label: 'Student ID', value: user?.studentId },
      ],
    },
    {
      title: 'Corporate Information',
      icon: <Business />,
      items: [
        { label: 'Department', value: user?.department },
        { label: 'Position', value: user?.position },
        { label: 'Employee ID', value: user?.employeeId },
      ],
    },
  ];

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar
              src={user?.photoURL}
              alt={user?.name}
              sx={{
                width: 100,
                height: 100,
                mr: 3,
                bgcolor: theme.palette.primary.main,
              }}
            >
              {user?.name?.charAt(0) || <Person />}
            </Avatar>
            <Box>
              <Typography variant="h4" gutterBottom>
                {user?.name}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {user?.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.role}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<Edit />}
              sx={{ ml: 'auto' }}
              onClick={() => {/* Handle edit profile */}}
            >
              Edit Profile
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {profileSections.map((section, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ 
                    mr: 1, 
                    color: theme.palette.primary.main,
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {section.icon}
                  </Box>
                  <Typography variant="h6">
                    {section.title}
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                {section.items.map((item, itemIndex) => (
                  <Box key={itemIndex} sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {item.label}
                    </Typography>
                    <Typography variant="body1">
                      {item.value || 'Not provided'}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Profile; 