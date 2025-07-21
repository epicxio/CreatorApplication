import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  styled,
  Avatar,
  InputAdornment,
  Tooltip as MuiTooltip,
  Switch,
  FormControlLabel,
  Dialog as MUIDialog,
  DialogActions as MUIDialogActions,
  DialogContent as MUIDialogContent,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Instagram as InstagramIcon,
  Facebook as FacebookIcon,
  YouTube as YouTubeIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Block as BlockIcon,
  Image as ImageIcon,
  Visibility as VisibilityIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import CreatorKYCRequests from './CreatorKYCRequests';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2),
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
}));

interface Creator {
  _id?: string;
  id: string;
  creatorId?: string;
  name: string;
  email: string;
  profilePic: string;
  bio: string;
  instagram: string;
  facebook: string;
  youtube: string;
  status: 'active' | 'inactive' | 'pending' | 'rejected';
  username: string;
  phoneNumber: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
  };
}

const grades = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const sections = ['A', 'B', 'C', 'D'];

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const Creator: React.FC = () => {
  const { user } = useAuth();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pendingCreators, setPendingCreators] = useState<Creator[]>([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [pendingError, setPendingError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [creatorToDelete, setCreatorToDelete] = useState<Creator | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();

  const roleName = typeof user?.role === 'string'
    ? user.role
    : typeof user?.role?.name === 'string'
    ? user.role.name
    : '';

  useEffect(() => {
    if (!BACKEND_URL) {
      console.error('REACT_APP_BACKEND_URL is not set in the environment variables.');
      return;
    }
    axios.get(`${BACKEND_URL}/api/users/creators`)
      .then(res => setCreators(res.data))
      .catch(err => console.error('Failed to fetch creators:', err));
  }, []);

  useEffect(() => {
    console.log('Pending creators effect running. roleName:', roleName);
    if (roleName.replace(/\s/g, '').toLowerCase() === 'superadmin') {
      setPendingLoading(true);
      axios.get(`${BACKEND_URL}/api/users/creators/pending`)
        .then(res => {
          console.log('Pending creators API response:', res.data);
          setPendingCreators(res.data);
        })
        .catch(err => {
          console.error('Error fetching pending creators:', err);
          setPendingError('Failed to fetch pending creators');
        })
        .finally(() => setPendingLoading(false));
    }
  }, [user, roleName]);

  const handleAddCreator = () => {
    setSelectedCreator(null);
    setOpenDialog(true);
  };

  const handleEditCreator = (creator: Creator) => {
    setSelectedCreator(creator);
    setOpenDialog(true);
  };

  const handleDeleteCreator = (creatorId: string) => {
    const creator = creators.find(c => c.id === creatorId || c._id === creatorId);
    setCreatorToDelete(creator || null);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteCreator = async () => {
    if (creatorToDelete && creatorToDelete._id) {
      await axios.delete(`${BACKEND_URL}/api/users/${creatorToDelete._id}`);
      // Fetch the updated list from the backend
      const res = await axios.get(`${BACKEND_URL}/api/users/creators`);
      setCreators(res.data);
      setDeleteDialogOpen(false);
      setCreatorToDelete(null);
    }
  };

  const handleSaveCreator = async (creatorData: Partial<Creator & { username: string; phoneNumber: string; password: string }>) => {
    setFormError(null);
    try {
      if (selectedCreator && selectedCreator._id) {
        // Edit existing creator
        await axios.put(`${BACKEND_URL}/api/users/${selectedCreator._id}`, {
          ...creatorData,
          socialMedia: {
            instagram: creatorData.instagram,
            facebook: creatorData.facebook,
            youtube: creatorData.youtube,
          },
        });
        // Re-fetch creators from backend
        const res = await axios.get(`${BACKEND_URL}/api/users/creators`);
        setCreators(res.data);
      } else {
        // Add new creator as admin: use /api/users, status: 'active'
        // Fetch creator userType id
        const userTypeRes = await axios.get(`${BACKEND_URL}/api/user-types`);
        const creatorType = userTypeRes.data.find((t: any) => t.name === 'creator');
        if (!creatorType) throw new Error('Creator user type not found');
        await axios.post(`${BACKEND_URL}/api/users`, {
          ...creatorData,
          status: 'active',
          userType: creatorType._id,
          socialMedia: {
            instagram: creatorData.instagram,
            facebook: creatorData.facebook,
            youtube: creatorData.youtube,
          },
        });
        // Re-fetch creators from backend
        const res = await axios.get(`${BACKEND_URL}/api/users/creators`);
        setCreators(res.data);
      }
      setOpenDialog(false);
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setFormError(err.response.data.message);
      } else {
        setFormError('An error occurred. Please try again.');
      }
    }
  };

  const handleApprove = async (id: string) => {
    await axios.post(`${BACKEND_URL}/api/users/${id}/approve`);
    setPendingCreators(pendingCreators.filter(c => c._id !== id));
  };

  const handleReject = async (id: string) => {
    await axios.post(`${BACKEND_URL}/api/users/${id}/reject`);
    setPendingCreators(pendingCreators.filter(c => c._id !== id));
  };

  const filteredCreators = creators.filter(creator => {
    const matchesSearch = creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      creator.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <Box>
      <StyledPaper>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2">
            Creator Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddCreator}
          >
            Add Creator
          </Button>
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={12}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search creators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
        </Grid>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Creator ID</TableCell>
                <TableCell>Profile Pic</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Instagram</TableCell>
                <TableCell>Facebook</TableCell>
                <TableCell>YouTube</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCreators.map((creator) => (
                <TableRow key={creator._id || creator.id}>
                  <TableCell>{creator.creatorId || '-'}</TableCell>
                  <TableCell>
                    {creator.profilePic ? (
                      <img
                        src={creator.profilePic}
                        alt={creator.name}
                        style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '';
                        }}
                      />
                    ) : (
                      <Avatar sx={{ width: 50, height: 50 }}>
                        {creator.name.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                    )}
                  </TableCell>
                  <TableCell>{creator.name}</TableCell>
                  <TableCell>{creator.email}</TableCell>
                  <TableCell>{creator.socialMedia?.instagram || creator.instagram || ''}</TableCell>
                  <TableCell>{creator.socialMedia?.facebook || creator.facebook || ''}</TableCell>
                  <TableCell>{creator.socialMedia?.youtube || creator.youtube || ''}</TableCell>
                  <TableCell>
                    <Chip
                      label={creator.status}
                      color={creator.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => navigate(`/creators/${creator.id}`)} size="small" color="info">
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton onClick={() => handleEditCreator(creator)} size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteCreator(creator.id)} size="small">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </StyledPaper>

      {(user && roleName.replace(/\s/g, '').toLowerCase() === 'superadmin') && (
        <StyledPaper>
          <Typography variant="h6" sx={{ mb: 2 }}>Pending Creator Requests</Typography>
          {pendingLoading ? (
            <Typography>Loading...</Typography>
          ) : pendingError ? (
            <Typography color="error">{pendingError}</Typography>
          ) : pendingCreators.length === 0 ? (
            <Typography>No pending requests.</Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Instagram</TableCell>
                    <TableCell>Facebook</TableCell>
                    <TableCell>YouTube</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingCreators.map((creator) => (
                    <TableRow key={creator._id}>
                      <TableCell>{creator.name}</TableCell>
                      <TableCell>{creator.email}</TableCell>
                      <TableCell>{creator.socialMedia?.instagram || creator.instagram || ''}</TableCell>
                      <TableCell>{creator.socialMedia?.facebook || creator.facebook || ''}</TableCell>
                      <TableCell>{creator.socialMedia?.youtube || creator.youtube || ''}</TableCell>
                      <TableCell>
                        <Button color="success" variant="contained" size="small" sx={{ mr: 1 }} onClick={() => handleApprove(creator._id!)}>Approve</Button>
                        <Button color="error" variant="contained" size="small" onClick={() => handleReject(creator._id!)}>Reject</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </StyledPaper>
      )}

      <MUIDialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
        <MUIDialogContent>
          <Typography variant="h6" align="center" sx={{ mb: 2 }}>
            Are you sure you want to delete this creator?
          </Typography>
          <Typography align="center" sx={{ mb: 2 }}>
            This action will soft delete the creator and can be undone by an admin.
          </Typography>
          <MUIDialogActions sx={{ justifyContent: 'center' }}>
            <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">Cancel</Button>
            <Button onClick={confirmDeleteCreator} color="error" variant="contained">Delete</Button>
          </MUIDialogActions>
        </MUIDialogContent>
      </MUIDialog>

      <CreatorDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSaveCreator}
        creator={selectedCreator}
      />

      {/* Show form error above the form */}
      {formError && (
        <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
          {formError}
        </Typography>
      )}
    </Box>
  );
};

interface CreatorDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (creatorData: Partial<Creator & { username: string; phoneNumber: string; password: string }>) => void;
  creator: Creator | null;
}

const CreatorDialog: React.FC<CreatorDialogProps> = ({
  open,
  onClose,
  onSave,
  creator,
}) => {
  const [formData, setFormData] = useState<Partial<Creator & { username: string; phoneNumber: string; password: string }>>(
    creator || {
      name: '',
      email: '',
      profilePic: '',
      bio: '',
      instagram: '',
      facebook: '',
      youtube: '',
      status: 'active',
      username: '',
      phoneNumber: '',
      password: '',
    }
  );
  const [imgHover, setImgHover] = useState(false);
  const [instagramConnected, setInstagramConnected] = useState(false);
  const [facebookConnected, setFacebookConnected] = useState(false);
  const [youtubeConnected, setYouTubeConnected] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [dialogError, setDialogError] = useState('');

  React.useEffect(() => {
    setFormData({
      name: creator?.name || '',
      email: creator?.email || '',
      profilePic: creator?.profilePic || '',
      bio: creator?.bio || '',
      instagram: creator?.socialMedia?.instagram || creator?.instagram || '',
      facebook: creator?.socialMedia?.facebook || creator?.facebook || '',
      youtube: creator?.socialMedia?.youtube || creator?.youtube || '',
      status: creator?.status || 'active',
      username: creator?.username || (creator?.email ? creator.email.split('@')[0] : ''),
      phoneNumber: creator?.phoneNumber || '',
      password: '', // Always blank for edit
    });
    setUsernameError('');
    setPhoneError('');
  }, [creator]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Only block submission if there are actual errors
    if (usernameError || phoneError) {
      setDialogError('Please fix the errors before submitting.');
      return;
    }
    setDialogError('');
    onSave(formData);
  };

  // Uniqueness checks: only set error if taken, do not block form submission while pending
  const handleUsernameBlur = async () => {
    if (!formData.username) return;
    try {
      const res = await fetch(`/api/users/check-username?username=${encodeURIComponent(formData.username)}`);
      if (!res.ok) {
        setUsernameError('Could not validate username (server error)');
        return;
      }
      const data = await res.json();
      if (data.taken) {
        setUsernameError('Username is already taken');
      } else {
        setUsernameError('');
      }
    } catch (err) {
      setUsernameError('Could not validate username (network error)');
    }
  };

  const handlePhoneBlur = async () => {
    if (!formData.phoneNumber) return;
    try {
      const res = await fetch(`/api/users/check-phone?phoneNumber=${encodeURIComponent(formData.phoneNumber)}`);
      if (!res.ok) {
        setPhoneError('Could not validate phone number (server error)');
        return;
      }
      const data = await res.json();
      if (data.taken) {
        setPhoneError('Phone number is already registered');
      } else {
        setPhoneError('');
      }
    } catch (err) {
      setPhoneError('Could not validate phone number (network error)');
    }
  };

  // Image upload handler (mock, just sets URL for now)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setFormData({ ...formData, profilePic: url });
    }
  };

  const toggleStatus = () => {
    setFormData({
      ...formData,
      status: formData.status === 'active' ? 'inactive' : 'active',
    });
  };

  const handleConnectInstagram = () => {
    if (!creator || !creator._id) return;
    window.open(`${process.env.REACT_APP_BACKEND_URL}/auth/instagram?creatorId=${creator._id}`, '_blank');
  };

  const handleConnectFacebook = () => {
    // In real app, open OAuth flow
    window.open(`/auth/facebook?creatorId=${creator ? creator.id : 'new'}`, '_blank');
    // For demo, set as connected
    setFacebookConnected(true);
  };

  const handleConnectYouTube = () => {
    // In real app, open OAuth flow
    window.open(`/auth/youtube?creatorId=${creator ? creator.id : 'new'}`, '_blank');
    // For demo, set as connected
    setYouTubeConnected(true);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 4,
            background: 'rgba(255,255,255,0.08)',
            borderRadius: 4,
            boxShadow: 3,
            minWidth: 400,
          }}
        >
          {/* Profile Image Upload/Preview */}
          <Box sx={{ position: 'relative', mb: 3 }}>
            <MuiTooltip title="Change profile picture" arrow>
              <Box
                sx={{ cursor: 'pointer', position: 'relative' }}
                onMouseEnter={() => setImgHover(true)}
                onMouseLeave={() => setImgHover(false)}
              >
                <Avatar
                  src={formData.profilePic || ''}
                  sx={{ width: 96, height: 96, boxShadow: 3, border: '3px solid #6C63FF', transition: '0.2s' }}
                >
                  {!formData.profilePic && <ImageIcon fontSize="large" color="disabled" />}
                </Avatar>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="creator-profile-upload"
                  onChange={handleImageChange}
                />
                <label htmlFor="creator-profile-upload">
                  <IconButton
                    component="span"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      background: '#fff',
                      boxShadow: 2,
                      opacity: imgHover ? 1 : 0.7,
                      transition: 'opacity 0.2s',
                    }}
                  >
                    <EditIcon color="primary" />
                  </IconButton>
                </label>
              </Box>
            </MuiTooltip>
          </Box>

          {/* Inputs with Icons */}
          <Grid container spacing={2} sx={{ width: '100%' }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                placeholder="Name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                placeholder="Email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                placeholder="Username"
                value={formData.username || ''}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                onBlur={handleUsernameBlur}
                required
                error={!!usernameError}
                helperText={usernameError}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                placeholder="Phone Number"
                value={formData.phoneNumber || ''}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                onBlur={handlePhoneBlur}
                required
                error={!!phoneError}
                helperText={phoneError}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            {/* Password field: Only show for new creators */}
            {!creator && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  placeholder="Password"
                  type="password"
                  value={formData.password || ''}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                placeholder="Bio"
                value={formData.bio || ''}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                multiline
                minRows={2}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EditIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                placeholder="Instagram"
                value={formData.instagram || ''}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <InstagramIcon sx={{ color: '#E1306C' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                placeholder="Facebook"
                value={formData.facebook || ''}
                onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FacebookIcon sx={{ color: '#1877F3' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                placeholder="YouTube"
                value={formData.youtube || ''}
                onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <YouTubeIcon sx={{ color: '#FF0000' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
          {/* Connect buttons only in edit mode */}
          {creator && (
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 3, mb: 1 }}>
              <Button
                variant="outlined"
                startIcon={<InstagramIcon sx={{ color: '#E1306C' }} />}
                onClick={handleConnectInstagram}
              >
                Connect Instagram
              </Button>
              <Button
                variant="outlined"
                startIcon={<FacebookIcon sx={{ color: '#1877F3' }} />}
                onClick={handleConnectFacebook}
              >
                Connect Facebook
              </Button>
              <Button
                variant="outlined"
                startIcon={<YouTubeIcon sx={{ color: '#FF0000' }} />}
                onClick={handleConnectYouTube}
              >
                Connect YouTube
              </Button>
            </Box>
          )}

          {/* Add Button */}
          <Button
            type="submit"
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              mt: 3,
              borderRadius: 8,
              px: 4,
              py: 1.5,
              fontWeight: 600,
              fontSize: '1.1rem',
              boxShadow: 4,
              background: 'linear-gradient(90deg, #6C63FF 0%, #5A52D9 100%)',
              color: '#fff',
              transition: 'all 0.2s',
              '&:hover': {
                background: 'linear-gradient(90deg, #5A52D9 0%, #6C63FF 100%)',
                transform: 'translateY(-2px) scale(1.03)',
                boxShadow: 6,
              },
            }}
            disabled={
              !formData.name ||
              !formData.email ||
              !formData.username ||
              !formData.phoneNumber ||
              (!creator && !formData.password) || // Only require password if adding new
              !!usernameError ||
              !!phoneError
            }
          >
            {creator ? 'Save Changes' : 'Add Creator'}
          </Button>
          <Button onClick={onClose} sx={{ mt: 2, color: '#6C63FF' }}>
            Cancel
          </Button>

          {/* Show creatorId in read-only mode */}
          {creator && creator.creatorId && (
            <TextField
              fullWidth
              label="Creator ID"
              value={creator.creatorId}
              InputProps={{ readOnly: true }}
              sx={{ mb: 2 }}
            />
          )}

          {dialogError && (
            <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
              {dialogError}
            </Typography>
          )}
        </Box>
      </form>
    </Dialog>
  );
};

export default function CreatorManagementWithKYC() {
  return (
    <>
      <Creator />
      <CreatorKYCRequests />
    </>
  );
} 