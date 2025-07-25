import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Chip, Button, IconButton, Menu, MenuItem, Tooltip, TextField, Select, FormControl, InputLabel, Grid, Stack, TableSortLabel
} from '@mui/material';
import { MoreVert, Edit, Delete, Visibility, Pause, PlayArrow, FileCopy, BarChart, CheckCircle, Drafts, Public, Lock, Link as LinkIcon, Group, Star, MonetizationOn, CalendarToday, Done, Close } from '@mui/icons-material';
import { courseService } from '../../services/api';
import { useNavigate } from 'react-router-dom';

// Define the Course type for this table
interface Course {
  id: string;
  name: string;
  createdAt: string;
  type: 'Free' | 'Paid' | 'Invite Only';
  access: { mode: 'Lifetime' | 'Date-Range'; startDate?: string; endDate?: string };
  enrollments: number;
  completionRate: number;
  status: 'Draft' | 'Published' | 'Live & Selling' | 'Paused' | 'Archived';
  lastUpdated: string;
  visibility: 'Public' | 'Unlisted' | 'Private';
  certificateEnabled: boolean;
  dripEnabled: boolean;
  installmentsOn: boolean;
  affiliateActive: boolean;
  listedPrice: { INR: number; USD: number; EUR: number };
  sellingPrice: { INR: number; USD: number; EUR: number };
}

const statusColors: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'> = {
  'Draft': 'default',
  'Published': 'primary',
  'Live & Selling': 'success',
  'Paused': 'warning',
  'Archived': 'error',
};

const visibilityIcons: Record<string, React.ReactNode> = {
  'Public': <Public fontSize="small" color="primary" />,
  'Unlisted': <LinkIcon fontSize="small" color="info" />,
  'Private': <Lock fontSize="small" color="action" />,
};

const typeColors: Record<string, 'default' | 'primary' | 'success' | 'warning'> = {
  'Free': 'success',
  'Paid': 'primary',
  'Invite Only': 'warning',
};

const accessLabel = (access: Course['access']) => {
  if (access.mode === 'Lifetime') return 'Lifetime';
  if (access.mode === 'Date-Range' && access.startDate && access.endDate) {
    return `${new Date(access.startDate).toLocaleDateString()} - ${new Date(access.endDate).toLocaleDateString()}`;
  }
  return '-';
};

const sortableColumns = [
  'name', 'createdAt', 'type', 'enrollments', 'completionRate', 'status', 'lastUpdated', 'visibility', 'features', 'listedPrice', 'sellingPrice'
];

const columnLabels: Record<string, string> = {
  name: 'Course Name',
  createdAt: 'Created Date',
  type: 'Course Type',
  access: 'Course Access',
  enrollments: 'Enrollments',
  completionRate: 'Completion Rate',
  status: 'Status',
  lastUpdated: 'Last Updated',
  visibility: 'Visibility',
  features: 'Features',
  listedPrice: 'Listed Price',
  sellingPrice: 'Selling Price',
  actions: 'Actions',
};

function getPriceValue(price: { INR: number; USD: number; EUR: number }) {
  // Sort by INR by default
  return price?.INR ?? 0;
}

const LearnLoopCourseManager: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuCourseId, setMenuCourseId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    certificate: '',
    drip: '',
    type: '',
    search: '',
  });
  const [sortBy, setSortBy] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    courseService.getCourses().then((data) => {
      // Map backend data to Course[] as needed
      setCourses(data.courses || []);
    }).finally(() => setLoading(false));
  }, []);

  // Filtering logic
  const filteredCourses = courses.filter((course) => {
    if (filters.status && course.status !== filters.status) return false;
    if (filters.certificate && (filters.certificate === 'Enabled') !== course.certificateEnabled) return false;
    if (filters.drip && (filters.drip === 'Enabled') !== course.dripEnabled) return false;
    if (filters.type && course.type !== filters.type) return false;
    if (filters.search && !course.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  // Sorting logic
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (!sortBy) return 0;
    let aValue: any = a[sortBy as keyof Course];
    let bValue: any = b[sortBy as keyof Course];
    if (sortBy === 'listedPrice') {
      aValue = getPriceValue(a.listedPrice);
      bValue = getPriceValue(b.listedPrice);
    } else if (sortBy === 'sellingPrice') {
      aValue = getPriceValue(a.sellingPrice);
      bValue = getPriceValue(b.sellingPrice);
    } else if (sortBy === 'createdAt' || sortBy === 'lastUpdated') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    } else if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  // Actions menu logic
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, courseId: string) => {
    setAnchorEl(event.currentTarget);
    setMenuCourseId(courseId);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuCourseId(null);
  };

  // Table pagination
  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Render
  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700} color="#6C63FF">
          LearnLoop: Course Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ borderRadius: 2, fontWeight: 600, textTransform: 'none', boxShadow: 1 }}
          onClick={() => navigate('/love/learnloop/create')}
        >
          + Create Course
        </Button>
      </Box>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Draft">Draft</MenuItem>
                <MenuItem value="Published">Published</MenuItem>
                <MenuItem value="Live & Selling">Live & Selling</MenuItem>
                <MenuItem value="Paused">Paused</MenuItem>
                <MenuItem value="Archived">Archived</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Certificate</InputLabel>
              <Select
                value={filters.certificate}
                label="Certificate"
                onChange={e => setFilters(f => ({ ...f, certificate: e.target.value }))}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Enabled">Enabled</MenuItem>
                <MenuItem value="Disabled">Disabled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Drip</InputLabel>
              <Select
                value={filters.drip}
                label="Drip"
                onChange={e => setFilters(f => ({ ...f, drip: e.target.value }))}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Enabled">Enabled</MenuItem>
                <MenuItem value="Disabled">Disabled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Type</InputLabel>
              <Select
                value={filters.type}
                label="Type"
                onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Free">Free</MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="Invite Only">Invite Only</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="Search by Course Name"
              value={filters.search}
              onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            />
          </Grid>
        </Grid>
      </Paper>
      <TableContainer component={Paper} sx={{ borderRadius: 3,
        // Always show sort icon for all TableSortLabel
        '& .MuiTableSortLabel-root .MuiTableSortLabel-icon': {
          opacity: 1,
        },
      }}>
        <Table>
          <TableHead>
            <TableRow>
              {['name', 'createdAt', 'type', 'access', 'enrollments', 'completionRate', 'status', 'lastUpdated', 'visibility', 'features', 'actions'].map((col) => (
                <TableCell key={col}>
                  {sortableColumns.includes(col) ? (
                    <TableSortLabel
                      active={sortBy === col}
                      direction={sortBy === col ? sortDirection : 'asc'}
                      onClick={() => handleSort(col)}
                      hideSortIcon={false}
                    >
                      {columnLabels[col]}
                    </TableSortLabel>
                  ) : (
                    columnLabels[col]
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={11} align="center">Loading...</TableCell>
              </TableRow>
            ) : filteredCourses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} align="center">No courses found.</TableCell>
              </TableRow>
            ) : (
              sortedCourses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((course) => (
                <TableRow key={course.id} hover>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>{new Date(course.createdAt).toLocaleDateString('en-GB')}</TableCell>
                  <TableCell>
                    <Chip label={course.type} color={typeColors[course.type]} size="small" />
                  </TableCell>
                  <TableCell>{accessLabel(course.access)}</TableCell>
                  <TableCell>{course.enrollments}</TableCell>
                  <TableCell>{course.completionRate > 0 ? `${course.completionRate}%` : '-'}</TableCell>
                  <TableCell>
                    <Chip label={course.status} color={statusColors[course.status]} size="small" />
                  </TableCell>
                  <TableCell>{new Date(course.lastUpdated).toLocaleDateString('en-GB')}</TableCell>
                  <TableCell>
                    <Tooltip title={course.visibility}>
                      <>{visibilityIcons[course.visibility] || <Lock fontSize="small" color="disabled" />}</>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Tooltip title="Certificate Enabled">
                        <Box sx={{ color: course.certificateEnabled ? 'success.main' : 'text.disabled' }}>
                          <CheckCircle fontSize="small" />
                        </Box>
                      </Tooltip>
                      <Tooltip title="Drip Enabled">
                        <Box sx={{ color: course.dripEnabled ? 'success.main' : 'text.disabled' }}>
                          <CheckCircle fontSize="small" />
                        </Box>
                      </Tooltip>
                      <Tooltip title="Installments On">
                        <Box sx={{ color: course.installmentsOn ? 'success.main' : 'text.disabled' }}>
                          <CheckCircle fontSize="small" />
                        </Box>
                      </Tooltip>
                      <Tooltip title="Affiliate Active">
                        <Box sx={{ color: course.affiliateActive ? 'success.main' : 'text.disabled' }}>
                          <CheckCircle fontSize="small" />
                        </Box>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={e => handleMenuOpen(e, course.id)}>
                      <MoreVert />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl) && menuCourseId === course.id}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={handleMenuClose}><Edit fontSize="small" sx={{ mr: 1 }} />Edit</MenuItem>
                      <MenuItem onClick={handleMenuClose}><Visibility fontSize="small" sx={{ mr: 1 }} />Preview</MenuItem>
                      <MenuItem onClick={handleMenuClose}><FileCopy fontSize="small" sx={{ mr: 1 }} />Duplicate</MenuItem>
                      <MenuItem onClick={handleMenuClose}><BarChart fontSize="small" sx={{ mr: 1 }} />Analytics</MenuItem>
                      {course.status === 'Draft' || course.status === 'Paused' ? (
                        <MenuItem onClick={handleMenuClose}><Delete fontSize="small" sx={{ mr: 1 }} />Delete</MenuItem>
                      ) : null}
                      {course.status === 'Published' ? (
                        <MenuItem onClick={handleMenuClose}><Drafts fontSize="small" sx={{ mr: 1 }} />Save as Draft</MenuItem>
                      ) : null}
                      {course.status === 'Draft' ? (
                        <MenuItem onClick={handleMenuClose}><PlayArrow fontSize="small" sx={{ mr: 1 }} />Publish</MenuItem>
                      ) : null}
                      {(course.status === 'Published' || course.status === 'Live & Selling') ? (
                        <MenuItem onClick={handleMenuClose}><Pause fontSize="small" sx={{ mr: 1 }} />Pause</MenuItem>
                      ) : null}
                    </Menu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredCourses.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
};

export default LearnLoopCourseManager; 