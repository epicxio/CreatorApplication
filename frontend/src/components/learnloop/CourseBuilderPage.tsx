import React, { useState } from 'react';
import { Box, Container, Typography, Paper, IconButton, Tooltip, Button, Stack, TextField, MenuItem, Chip, InputLabel, Select, FormControl, OutlinedInput } from '@mui/material';
import { styled } from '@mui/system';
import { CheckCircle, RadioButtonUnchecked, ArrowForward, ArrowBack, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import VideocamIcon from '@mui/icons-material/Videocam';
import DescriptionIcon from '@mui/icons-material/Description';
import QuizIcon from '@mui/icons-material/Quiz';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LinkIcon from '@mui/icons-material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import SvgIcon from '@mui/material/SvgIcon';
import QuizQuestionEditor, { QuizQuestion } from './QuizQuestionEditor';

const steps = [
  'Course Details',
  'Curriculum',
  'Drip Content',
  'Certificate',
  'Payment Details',
  'Additional Details',
  'Preview & Publish',
];

const stepThemes = [
  'linear-gradient(135deg, #00FFC6 0%, #6C63FF 100%)', // Course Details
  'linear-gradient(135deg, #6C63FF 0%, #00BFFF 100%)', // Curriculum
  'linear-gradient(135deg, #00BFFF 0%, #FF6B6B 100%)', // Drip Content
  'linear-gradient(135deg, #FF6B6B 0%, #FFD600 100%)', // Certificate
  'linear-gradient(135deg, #FFD600 0%, #00FFC6 100%)', // Payment
  'linear-gradient(135deg, #00FFC6 0%, #6C63FF 100%)', // Additional
  'linear-gradient(135deg, #6C63FF 0%, #00FFC6 100%)', // Preview
];

const GlassPanel = styled(Paper)(({ theme }) => ({
  background: 'rgba(255,255,255,0.15)',
  backdropFilter: 'blur(16px)',
  borderRadius: 24,
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
  border: '1px solid rgba(255,255,255,0.2)',
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  minHeight: 220,
  position: 'relative',
}));

const StepperRail = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: '50%',
  right: 60,
  transform: 'translateY(-50%)',
  zIndex: 10,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(3),
  userSelect: 'none',
  // Remove any border or background that could look like a vertical line
  border: 'none',
  background: 'transparent',
}));

const StepOrb = styled(motion.div)<{ active: boolean; completed: boolean }>(
  ({ active, completed }) => ({
    width: active ? 64 : 36,
    height: active ? 64 : 36,
    borderRadius: '50%',
    background: active
      ? 'radial-gradient(circle, #00FFC6 0%, #6C63FF 100%)'
      : completed
      ? 'linear-gradient(135deg, #00FFC6 0%, #6C63FF 100%)'
      : 'rgba(255,255,255,0.12)',
    boxShadow: active
      ? '0 0 32px 12px #00FFC6, 0 2px 16px 0 #6C63FF44'
      : completed
      ? '0 0 12px 2px #00FFC6'
      : '0 2px 8px 0 #6C63FF22',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: active ? '#fff' : completed ? '#fff' : '#6C63FF',
    border: active ? '3px solid #00FFC6' : '2px solid #6C63FF',
    cursor: 'pointer',
    transition: 'all 0.25s cubic-bezier(.4,2,.6,1)',
    position: 'relative',
  })
);

const AnimatedRail = styled(motion.div)(({ theme }) => ({
  width: 6,
  background: 'linear-gradient(180deg, #00FFC6 0%, #6C63FF 100%)',
  borderRadius: 3,
  position: 'absolute',
  left: '50%',
  top: 32,
  zIndex: 1,
}));

const StepLabelBox = styled(Box)(({ theme }) => ({
  marginLeft: 64,
  marginBottom: theme.spacing(2),
  minHeight: 40,
  display: 'flex',
  alignItems: 'center',
}));

const FloatingLabel = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  right: 80,
  top: '50%',
  transform: 'translateY(-50%)',
  background: '#fff',
  color: '#6C63FF',
  fontWeight: 700,
  fontSize: 18,
  borderRadius: 12,
  boxShadow: '0 2px 12px #00FFC633',
  padding: '6px 18px',
  pointerEvents: 'none',
  zIndex: 20,
}));

const backgrounds = [
  'linear-gradient(120deg, #f8fafc 60%, #e0fff7 100%)',
  'linear-gradient(120deg, #f8fafc 60%, #e6eaff 100%)',
  'linear-gradient(120deg, #f8fafc 60%, #ffeaea 100%)',
  'linear-gradient(120deg, #f8fafc 60%, #fffbe0 100%)',
  'linear-gradient(120deg, #f8fafc 60%, #e0fff7 100%)',
  'linear-gradient(120deg, #f8fafc 60%, #e6eaff 100%)',
  'linear-gradient(120deg, #f8fafc 60%, #e0fff7 100%)',
];

const categories = ['Business', 'Technology', 'Design', 'Marketing', 'Personal Development', 'Health', 'Other'];
const levels = ['Beginner', 'Intermediate', 'Advanced'];
const languages = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Other'];
const visibilities = ['Public', 'Unlisted', 'Private'];
const allTags = ['AI', 'Web', 'Startup', 'Productivity', 'Coding', 'Art', 'Finance', 'Growth'];

const initialModules = [
  {
    id: 'module-1',
    title: 'Introduction',
    lessons: [
      { id: 'lesson-1', title: 'Welcome', type: 'Video' },
      { id: 'lesson-2', title: 'Course Overview', type: 'Text' },
    ],
  },
];
// Change lessonTypes to include Live
const lessonTypes = ['Video', 'Text', 'Quiz', 'Assignment', 'Live'];

// Helper for icon mapping
const lessonTypeIcons: { [key: string]: JSX.Element } = {
  Video: <VideocamIcon sx={{ color: '#6C63FF' }} />, 
  Text: <DescriptionIcon sx={{ color: '#00BFFF' }} />, 
  Quiz: <QuizIcon sx={{ color: '#FFD600' }} />, 
  Assignment: <AssignmentTurnedInIcon sx={{ color: '#00FFC6' }} />, 
  Live: <LiveTvIcon sx={{ color: '#FF6B6B' }} />
};

// Helper for meeting link icon and label
const meetingLinkMeta: {
  [key: string]: { icon: JSX.Element; label: string; placeholder: string }
} = {
  'Google Meet': {
    icon: <SvgIcon sx={{ color: '#34A853' }}><path d="M21 6.5v11c0 .83-.67 1.5-1.5 1.5h-15C3.67 19 3 18.33 3 17.5v-11C3 5.67 3.67 5 4.5 5h15c.83 0 1.5.67 1.5 1.5z"/><path d="M17 10.5V7H7v10h10v-3.5l2.5 2.5v-7l-2.5 2.5z"/></SvgIcon>,
    label: 'Google Meet Link',
    placeholder: 'https://meet.google.com/...'
  },
  'Zoom': {
    icon: <SvgIcon sx={{ color: '#2D8CFF' }}><circle cx="12" cy="12" r="10" /><ellipse cx="12" cy="12" rx="6" ry="4" fill="#fff" /></SvgIcon>,
    label: 'Zoom Link',
    placeholder: 'https://zoom.us/j/...'
  },
  'Webex': {
    icon: <SvgIcon sx={{ color: '#00B1E3' }}><circle cx="12" cy="12" r="10" /><ellipse cx="12" cy="12" rx="6" ry="4" fill="#fff" /></SvgIcon>,
    label: 'Webex Link',
    placeholder: 'https://webex.com/meet/...'
  },
  'Custom Link': {
    icon: <LinkIcon color="primary" />,
    label: 'Paste Meeting Link',
    placeholder: 'https://your-meeting-link.com'
  }
};

const allowedMeetingKeys = ['Google Meet', 'Zoom', 'Webex', 'Custom Link'] as const;
type MeetingKey = typeof allowedMeetingKeys[number];

const CourseBuilderPage: React.FC = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const mainRef = React.useRef<HTMLDivElement>(null);
  const builderRef = React.useRef<HTMLDivElement>(null);

  // Course Details state
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [cover, setCover] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');
  const [language, setLanguage] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [visibility, setVisibility] = useState('Public');
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [saving, setSaving] = useState(false);

  // Curriculum state
  const [modules, setModules] = useState(initialModules);
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  // Per-module new lesson input state
  const [newLessonInputs, setNewLessonInputs] = useState<{ [moduleId: string]: { title: string, type: string } }>({});
  // 1. Add new state for lesson description, resources, and video file per module (for add) and per lesson (for edit)
  const [newLessonDescriptions, setNewLessonDescriptions] = useState<{ [moduleId: string]: string }>({});
  const [newLessonResources, setNewLessonResources] = useState<{ [moduleId: string]: File[] }>({});
  const [newLessonVideoPairs, setNewLessonVideoPairs] = useState<{ [moduleId: string]: { video: File, thumbnail: File|null }[] }>({});
  // 1. Add a new state: const [lessonThumbnails, setLessonThumbnails] = useState<{ [lessonKey: string]: File | null }>({});
  const [lessonThumbnails, setLessonThumbnails] = useState<{ [lessonKey: string]: (File | null)[] }>({});
  // 1. Add state for videoPreviews
  const [videoPreviews, setVideoPreviews] = useState<{ [lessonKey: string]: string | null }>({});

  // Add new state for Live lesson fields and pre/post class message
  const [newLessonPreClassMessages, setNewLessonPreClassMessages] = useState<{ [moduleId: string]: string }>({});
  const [newLessonPostClassMessages, setNewLessonPostClassMessages] = useState<{ [moduleId: string]: string }>({});
  // Change the type for newLessonLiveFields state to include customLink
  const [newLessonLiveFields, setNewLessonLiveFields] = useState<{
    [moduleId: string]: {
      startDateTime: string;
      duration: string;
      meetingLink: string;
      documents: File[];
      customLink?: string;
    }
  }>({});

  // 1. Remove all inline add/edit forms from the left column. Only show structure, add buttons, and reorder controls.
  // 2. Move all add/edit forms and details to the right column, shown when a module or lesson is selected for add/edit.
  // 3. Add state for selectedModuleId and selectedLessonId to control what is shown in the right panel.
  // 4. When Add or Edit is clicked, set the selectedModuleId or selectedLessonId and show the form in the right panel.
  // 5. When nothing is selected, show a helpful empty state in the right panel.
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  // 1. Add a new state: const [addLessonModuleId, setAddLessonModuleId] = useState<string | null>(null);
  const [addLessonModuleId, setAddLessonModuleId] = useState<string | null>(null);

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (activeStep < steps.length - 1) setActiveStep((s) => s + 1);
      } else if (e.key === 'ArrowLeft') {
        if (activeStep > 0) setActiveStep((s) => s - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeStep]);

  // Cover image preview
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverFile(e.target.files[0]);
      setCover(URL.createObjectURL(e.target.files[0]));
    }
  };

  // Validation
  const validate = () => {
    const newErrors: { [k: string]: string } = {};
    if (!title.trim()) newErrors.title = 'Course title is required.';
    if (!category) newErrors.category = 'Category is required.';
    if (!level) newErrors.level = 'Level is required.';
    if (!language) newErrors.language = 'Language is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save as draft (stub)
  const handleSaveDraft = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      // Show toast/snackbar here if desired
    }, 1000);
  };

  // Next step
  const handleNext = () => {
    if (validate()) setActiveStep((s) => Math.min(steps.length - 1, s + 1));
  };

  // Add move up/down functions for modules and lessons
  const moveModule = (from: number, to: number) => {
    if (to < 0 || to >= modules.length) return;
    const updated = [...modules];
    const [removed] = updated.splice(from, 1);
    updated.splice(to, 0, removed);
    setModules(updated);
  };
  const moveLesson = (modIdx: number, from: number, to: number) => {
    const lessons = modules[modIdx].lessons;
    if (to < 0 || to >= lessons.length) return;
    const updatedLessons = [...lessons];
    const [removed] = updatedLessons.splice(from, 1);
    updatedLessons.splice(to, 0, removed);
    setModules(modules.map((m, i) => i === modIdx ? { ...m, lessons: updatedLessons } : m));
  };

  // Add module
  const handleAddModule = () => {
    if (!newModuleTitle.trim()) return;
    setModules([
      ...modules,
      { id: `module-${Date.now()}`, title: newModuleTitle, lessons: [] },
    ]);
    setNewModuleTitle('');
  };
  // Edit module
  const handleEditModule = (id: string, title: string) => {
    setModules(modules.map(m => (m.id === id ? { ...m, title } : m)));
    setEditingModuleId(null);
  };
  // Delete module
  const handleDeleteModule = (id: string) => {
    setModules(modules.filter(m => m.id !== id));
  };
  // Add lesson
  const handleAddLesson = (modId: string) => {
    const mod = modules.find(m => m.id === modId);
    if (!mod) return;
    const input = newLessonInputs[mod.id] || { title: '', type: lessonTypes[0] };
    if (!input.title.trim()) return;
    const newLesson = { id: `lesson-${Date.now()}`, title: input.title, type: input.type };
    setModules(modules.map((m, i) =>
      i === modules.findIndex(mod => mod.id === modId) ? { ...m, lessons: [...m.lessons, newLesson] } : m
    ));
    setNewLessonInputs(inputs => ({ ...inputs, [mod.id]: { title: '', type: lessonTypes[0] } }));
    setAddLessonModuleId(null); // Reset after adding
  };
  // Edit lesson
  const handleEditLesson = (modIdx: number, lessonId: string, title: string, type: string) => {
    setModules(modules.map((m, i) =>
      i === modIdx
        ? { ...m, lessons: m.lessons.map(l => l.id === lessonId ? { ...l, title, type } : l) }
        : m
    ));
    setEditingLessonId(null);
  };
  // Delete lesson
  const handleDeleteLesson = (modIdx: number, lessonId: string) => {
    setModules(modules.map((m, i) =>
      i === modIdx ? { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) } : m
    ));
  };

  let lessonInput: { title?: string; type?: string } | undefined = undefined;
  let lessonDescription: string = '';
  let lessonResources: File[] = [];
  let lessonVideos: { video: File, thumbnail: File|null }[] = [];
  let lessonThumbnailsArray: (File | null)[] = [];
  if (selectedLessonId) {
    lessonInput = newLessonInputs[selectedLessonId];
    lessonDescription = newLessonDescriptions[selectedLessonId] || '';
    lessonResources = newLessonResources[selectedLessonId] || [];
    lessonVideos = newLessonVideoPairs[selectedLessonId] || [];
    lessonThumbnailsArray = newLessonVideoPairs[selectedLessonId]?.map(p => p.thumbnail) || [];
  }

  // Add state for resource upload errors
  const [resourceUploadErrors, setResourceUploadErrors] = useState<{ [key: string]: string }>({});

  // Add state for quiz question in the add lesson form
  const [newQuizQuestion, setNewQuizQuestion] = useState<QuizQuestion>({
    id: 'q-1',
    text: '',
    type: 'single',
    options: [
      { id: 'opt-1', text: '', isCorrect: false },
      { id: 'opt-2', text: '', isCorrect: false }
    ],
    includeNoneOfTheAbove: false,
    includeAllOfTheAbove: false
  });

  React.useEffect(() => {
    if (!addLessonModuleId) return;
    if (newLessonInputs[addLessonModuleId]?.type === 'Quiz' && (!newQuizQuestion || !newQuizQuestion.options || newQuizQuestion.options.length === 0)) {
      setNewQuizQuestion({
        id: 'q-1',
        text: '',
        type: 'single',
        options: [
          { id: 'opt-1', text: '', isCorrect: false },
          { id: 'opt-2', text: '', isCorrect: false }
        ],
        includeNoneOfTheAbove: false,
        includeAllOfTheAbove: false
      });
    }
  }, [addLessonModuleId, addLessonModuleId ? newLessonInputs[addLessonModuleId]?.type : undefined]);

  // Add state for quiz question in the edit lesson form
  const [editQuizQuestion, setEditQuizQuestion] = useState<QuizQuestion>({
    id: 'q-1',
    text: '',
    type: 'single',
    options: [
      { id: 'opt-1', text: '', isCorrect: false },
      { id: 'opt-2', text: '', isCorrect: false }
    ],
    includeNoneOfTheAbove: false,
    includeAllOfTheAbove: false
  });

  // Add useEffect to initialize editQuizQuestion when lessonInput?.type changes to 'Quiz'
  React.useEffect(() => {
    if (lessonInput?.type === 'Quiz' && (!editQuizQuestion || !editQuizQuestion.options || editQuizQuestion.options.length === 0)) {
      setEditQuizQuestion({
        id: 'q-1',
        text: '',
        type: 'single',
        options: [
          { id: 'opt-1', text: '', isCorrect: false },
          { id: 'opt-2', text: '', isCorrect: false }
        ],
        includeNoneOfTheAbove: false,
        includeAllOfTheAbove: false
      });
    }
  }, [lessonInput?.type]);

  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', p: 0, m: 0 }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -80 }}
          transition={{ duration: 0.6, ease: [0.4, 0.2, 0.6, 1] }}
          style={{ minHeight: '100vh', width: '100vw', position: 'absolute', top: 0, left: 0, background: backgrounds[activeStep], zIndex: 0 }}
        >
          <Container maxWidth="lg" sx={{ py: 6, position: 'relative', minHeight: '100vh' }}>
            <StepperRail>
              {steps.map((label, idx) => (
                <React.Fragment key={label}>
                  <Tooltip title={label} placement="right" arrow>
                    <StepOrb
                      active={activeStep === idx}
                      completed={idx < activeStep}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveStep(idx)}
                      tabIndex={0}
                      aria-label={label}
                    >
                      {idx < activeStep ? (
                        <CheckCircle fontSize="large" />
                      ) : (
                        <RadioButtonUnchecked fontSize={activeStep === idx ? 'large' : 'medium'} />
                      )}
                      {activeStep === idx && (
                        <motion.div
                          layoutId="active-glow"
                          animate={{
                            boxShadow: [
                              '0 0 32px 12px #00FFC6, 0 2px 16px 0 #6C63FF44',
                              '0 0 48px 18px #00FFC6, 0 2px 16px 0 #6C63FF44',
                              '0 0 32px 12px #00FFC6, 0 2px 16px 0 #6C63FF44',
                            ],
                          }}
                          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                          style={{
                            position: 'absolute',
                            top: -18,
                            left: -18,
                            width: 100,
                            height: 100,
                            borderRadius: '50%',
                            background:
                              'radial-gradient(circle, #00FFC6 0%, #6C63FF 60%, transparent 100%)',
                            opacity: 0.18,
                            zIndex: 0,
                          }}
                        />
                      )}
                      {activeStep === idx && (
                        <FloatingLabel
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.4 }}
                        >
                          {label}
                        </FloatingLabel>
                      )}
                    </StepOrb>
                  </Tooltip>
                </React.Fragment>
              ))}
            </StepperRail>
            <StepLabelBox>
              <Typography
                variant="h4"
                fontWeight={700}
                color="#6C63FF"
                mb={2}
                sx={{
                  textShadow: '0 2px 16px #00FFC644',
                  letterSpacing: 1,
                  fontSize: { xs: 24, md: 32 },
                }}
              >
                {steps[activeStep]}
              </Typography>
            </StepLabelBox>
            <GlassPanel sx={{ width: '100%', minHeight: 220, position: 'relative', boxSizing: 'border-box', marginTop: 0 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.5 }}
                >
                  {activeStep === 0 ? (
                    <Box component="form" noValidate autoComplete="off" sx={{ width: '100%' }}>
                      <Stack spacing={3}>
                        <TextField
                          label="Course Title"
                          value={title}
                          onChange={e => setTitle(e.target.value)}
                          required
                          error={!!errors.title}
                          helperText={errors.title}
                          fullWidth
                        />
                        <TextField
                          label="Subtitle"
                          value={subtitle}
                          onChange={e => setSubtitle(e.target.value)}
                          fullWidth
                        />
                        <TextField
                          label="Description"
                          value={description}
                          onChange={e => setDescription(e.target.value)}
                          multiline
                          minRows={3}
                          fullWidth
                        />
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center">
                          <Box>
                            <Button variant="outlined" component="label">
                              Upload Cover Image
                              <input type="file" accept="image/*" hidden onChange={handleCoverChange} />
                            </Button>
                            {cover && (
                              <Box mt={1}>
                                <img src={cover} alt="cover preview" style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 8, boxShadow: '0 2px 8px #00FFC622' }} />
                              </Box>
                            )}
                          </Box>
                          <FormControl sx={{ minWidth: 180 }} error={!!errors.category}>
                            <InputLabel>Category *</InputLabel>
                            <Select
                              value={category}
                              onChange={e => setCategory(e.target.value)}
                              label="Category *"
                              required
                            >
                              {categories.map(cat => (
                                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                              ))}
                            </Select>
                            {errors.category && <Typography color="error" variant="caption">{errors.category}</Typography>}
                          </FormControl>
                          <FormControl sx={{ minWidth: 160 }} error={!!errors.level}>
                            <InputLabel>Level *</InputLabel>
                            <Select
                              value={level}
                              onChange={e => setLevel(e.target.value)}
                              label="Level *"
                              required
                            >
                              {levels.map(lvl => (
                                <MenuItem key={lvl} value={lvl}>{lvl}</MenuItem>
                              ))}
                            </Select>
                            {errors.level && <Typography color="error" variant="caption">{errors.level}</Typography>}
                          </FormControl>
                          <FormControl sx={{ minWidth: 160 }} error={!!errors.language}>
                            <InputLabel>Language *</InputLabel>
                            <Select
                              value={language}
                              onChange={e => setLanguage(e.target.value)}
                              label="Language *"
                              required
                            >
                              {languages.map(lang => (
                                <MenuItem key={lang} value={lang}>{lang}</MenuItem>
                              ))}
                            </Select>
                            {errors.language && <Typography color="error" variant="caption">{errors.language}</Typography>}
                          </FormControl>
                        </Stack>
                        <FormControl fullWidth>
                          <InputLabel>Tags</InputLabel>
                          <Select
                            multiple
                            value={tags}
                            onChange={e => setTags(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value as string[])}
                            input={<OutlinedInput label="Tags" />}
                            renderValue={(selected) => (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {(selected as string[]).map((value) => (
                                  <Chip key={value} label={value} />
                                ))}
                              </Box>
                            )}
                          >
                            {allTags.map(tag => (
                              <MenuItem key={tag} value={tag}>{tag}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <FormControl sx={{ minWidth: 180 }}>
                          <InputLabel>Visibility</InputLabel>
                          <Select
                            value={visibility}
                            onChange={e => setVisibility(e.target.value)}
                            label="Visibility"
                          >
                            {visibilities.map(vis => (
                              <MenuItem key={vis} value={vis}>{vis}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Stack>
                      <Stack direction="row" spacing={2} justifyContent="flex-end" mt={4}>
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={handleSaveDraft}
                          disabled={saving}
                        >
                          {saving ? 'Saving...' : 'Save as Draft'}
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleNext}
                        >
                          Next
                        </Button>
                      </Stack>
                    </Box>
                  ) : activeStep === 1 ? (
                    <Box sx={{ display: 'flex', gap: 3 }}>
                      {/* Left Panel: Modules and Lessons List */}
                      {/* LEFT COLUMN: Only structure, add/reorder, and edit buttons */}
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h5" fontWeight={700} color="#6C63FF" mb={2}>
                          Curriculum Builder
                        </Typography>
                        {modules.map((mod, modIdx) => (
                          <Paper key={mod.id} sx={{ mb: 3, p: 2, borderRadius: 3, boxShadow: 2, background: '#fff' }}>
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Box sx={{ color: '#6C63FF' }}>
                                <RadioButtonUnchecked />
                              </Box>
                              <Typography variant="h6" sx={{ flex: 1 }}>{mod.title}</Typography>
                              <IconButton size="small" onClick={() => moveModule(modIdx, modIdx - 1)} disabled={modIdx === 0}><ArrowUpward /></IconButton>
                              <IconButton size="small" onClick={() => moveModule(modIdx, modIdx + 1)} disabled={modIdx === modules.length - 1}><ArrowDownward /></IconButton>
                              <Button size="small" onClick={() => { setSelectedModuleId(mod.id); setSelectedLessonId(null); }}>Edit</Button>
                              <Button size="small" color="error" onClick={() => handleDeleteModule(mod.id)}>Delete</Button>
                            </Stack>
                            {/* Lessons List */}
                            <Box sx={{ paddingLeft: 4, paddingTop: 2 }}>
                              {mod.lessons.map((lesson, lessonIdx) => (
                                <Paper key={lesson.id} sx={{ mb: 2, p: 1.5, borderRadius: 2, background: '#f8fafc', display: 'flex', alignItems: 'center' }}>
                                  <Box sx={{ color: '#00FFC6', mr: 2 }}>
                                    <RadioButtonUnchecked />
                                  </Box>
                                  <Typography sx={{ flex: 1 }}>{lesson.title} <Chip label={lesson.type} size="small" sx={{ ml: 1 }} /></Typography>
                                  <IconButton size="small" onClick={() => moveLesson(modIdx, lessonIdx, lessonIdx - 1)} disabled={lessonIdx === 0}><ArrowUpward /></IconButton>
                                  <IconButton size="small" onClick={() => moveLesson(modIdx, lessonIdx, lessonIdx + 1)} disabled={lessonIdx === mod.lessons.length - 1}><ArrowDownward /></IconButton>
                                  <Button size="small" onClick={() => { setSelectedLessonId(lesson.id); setSelectedModuleId(null); }}>Edit</Button>
                                  <Button size="small" color="error" onClick={() => handleDeleteLesson(modIdx, lesson.id)}>Delete</Button>
                                </Paper>
                              ))}
                              {/* Add Lesson Button */}
                              <Button size="small" variant="outlined" onClick={() => { setAddLessonModuleId(mod.id); setSelectedModuleId(null); setSelectedLessonId(null); }} sx={{ mt: 1 }}>
                                Add Lesson
                              </Button>
                            </Box>
                          </Paper>
                        ))}
                        {/* Add Module Button */}
                        <Button size="small" variant="contained" onClick={() => { setSelectedModuleId('new'); setSelectedLessonId(null); }}>
                          Add Module
                        </Button>
                      </Box>

                      {/* Right Panel: Lesson Details */}
                      <Box sx={{ flex: 1, minWidth: 300 }}>
                        {addLessonModuleId ? (
                          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2, background: '#fff' }}>
                            <Typography variant="h6" fontWeight={700} color="#6C63FF" mb={2}>
                              Add New Lesson to {modules.find(mod => mod.id === addLessonModuleId)?.title}
                            </Typography>
                            <Stack spacing={2}>
                              {/* Type Tabs/Buttons */}
                              <FormControl size="small" sx={{ minWidth: 100 }}>
                                <InputLabel id="lesson-type-label">Lesson Type</InputLabel>
                                <Select
                                  labelId="lesson-type-label"
                                  label="Lesson Type"
                                  value={newLessonInputs[addLessonModuleId]?.type || lessonTypes[0]}
                                  onChange={e => setNewLessonInputs(inputs => ({ ...inputs, [addLessonModuleId]: { ...(inputs[addLessonModuleId] || { title: '', type: lessonTypes[0] }), type: e.target.value } }))}
                                >
                                  {lessonTypes.map(type => (
                                    <MenuItem key={type} value={type}>
                                      <ListItemIcon>{lessonTypeIcons[type]}</ListItemIcon>
                                      <ListItemText primary={type} />
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                              {/* Title */}
                              <TextField
                                label="Title"
                                value={newLessonInputs[addLessonModuleId]?.title || ''}
                                onChange={e => setNewLessonInputs(inputs => ({ ...inputs, [addLessonModuleId]: { ...(inputs[addLessonModuleId] || { type: lessonTypes[0] }), title: e.target.value } }))}
                                size="small"
                                autoFocus
                                sx={{ mr: 1 }}
                              />
                              {/* Description */}
                              <TextField
                                size="small"
                                label="Description"
                                value={newLessonDescriptions[addLessonModuleId] || ''}
                                onChange={e => setNewLessonDescriptions(descs => ({ ...descs, [addLessonModuleId]: e.target.value }))}
                                sx={{ width: '100%' }}
                                multiline
                                minRows={2}
                              />
                              {/* Pre/Post Class Messages */}
                              {['Video', 'Text', 'Quiz', 'Assignment', 'Live'].includes(newLessonInputs[addLessonModuleId]?.type || '') && (
                                <>
                                  <TextField
                                    size="small"
                                    label="Pre Class Message"
                                    value={newLessonPreClassMessages[addLessonModuleId] || ''}
                                    onChange={e => setNewLessonPreClassMessages(msgs => ({ ...msgs, [addLessonModuleId]: e.target.value }))}
                                    sx={{ width: '100%' }}
                                    multiline
                                    minRows={1}
                                  />
                                  <TextField
                                    size="small"
                                    label="Post Class Message"
                                    value={newLessonPostClassMessages[addLessonModuleId] || ''}
                                    onChange={e => setNewLessonPostClassMessages(msgs => ({ ...msgs, [addLessonModuleId]: e.target.value }))}
                                    sx={{ width: '100%' }}
                                    multiline
                                    minRows={1}
                                  />
                                </>
                              )}
                              {/* Quiz Question Editor */}
                              {newLessonInputs[addLessonModuleId]?.type === 'Quiz' && (
                                <QuizQuestionEditor value={newQuizQuestion} onChange={setNewQuizQuestion} />
                              )}
                              {/* Resource Upload */}
                              <Button
                                variant="outlined"
                                component="label"
                                size="small"
                                sx={{ mr: 1 }}
                                disabled={(newLessonResources[addLessonModuleId]?.length || 0) >= 10}
                              >
                                Upload Resources
                                <input
                                  type="file"
                                  multiple
                                  hidden
                                  accept=".pdf,.doc,.docx,.ppt,.pptx,image/*"
                                  onChange={e => {
                                    const files = Array.from(e.target.files || []);
                                    const prevFiles = newLessonResources[addLessonModuleId] || [];
                                    let error = '';
                                    let validFiles = [];
                                    for (const file of files) {
                                      if (file.size > 2 * 1024 * 1024) {
                                        error = `File ${file.name} exceeds 2MB.`;
                                        continue;
                                      }
                                      validFiles.push(file);
                                    }
                                    if (prevFiles.length + validFiles.length > 10) {
                                      error = 'Cannot upload more than 10 resources.';
                                      validFiles = validFiles.slice(0, 10 - prevFiles.length);
                                    }
                                    setResourceUploadErrors(errs => ({ ...errs, [addLessonModuleId]: error }));
                                    setNewLessonResources(res => ({
                                      ...res,
                                      [addLessonModuleId]: [...prevFiles, ...validFiles]
                                    }));
                                    e.target.value = '';
                                  }}
                                />
                              </Button>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                Max 10 files. Only PDF, PPT, DOC, DOCX, and images. Max size 2MB each.
                              </Typography>
                              {resourceUploadErrors[addLessonModuleId] && (
                                <Typography color="error" variant="caption">{resourceUploadErrors[addLessonModuleId]}</Typography>
                              )}
                              {/* Show uploaded resources */}
                              {(newLessonResources[addLessonModuleId] || []).map((file, idx) => (
                                <Chip
                                  key={file.name + idx}
                                  label={file.name}
                                  onDelete={() => setNewLessonResources(res => ({
                                    ...res,
                                    [addLessonModuleId]: res[addLessonModuleId].filter((_, i) => i !== idx)
                                  }))}
                                />
                              ))}
                              {/* Video Upload (if type is Video) */}
                              {(newLessonInputs[addLessonModuleId]?.type === 'Video') && (
                                <>
                                  {/* Show video-thumbnail pairs */}
                                  {(newLessonVideoPairs[addLessonModuleId] || []).map((pair, idx) => (
                                    <Box key={pair.video.name + idx} sx={{ mt: 1 }}>
                                      <Stack direction="row" alignItems="flex-start" spacing={1} flexWrap="wrap">
                                        <Chip
                                          label={pair.video.name}
                                          sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}
                                          onDelete={() => setNewLessonVideoPairs(pairs => ({
                                            ...pairs,
                                            [addLessonModuleId]: (pairs[addLessonModuleId] || []).filter((_, i) => i !== idx)
                                          }))}
                                        />
                                        <Box>
                                          {pair.thumbnail ? (
                                            <Chip
                                              label={pair.thumbnail.name}
                                              sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}
                                              onDelete={() => setNewLessonVideoPairs(pairs => ({
                                                ...pairs,
                                                [addLessonModuleId]: (pairs[addLessonModuleId] || []).map((p, i) => i === idx ? { ...p, thumbnail: null } : p)
                                              }))}
                                            />
                                          ) : (
                                            <Button
                                              variant="outlined"
                                              component="label"
                                              size="small"
                                              sx={{ minWidth: 120, mt: 0.5 }}
                                            >
                                              Upload Thumbnail
                                              <input
                                                type="file"
                                                hidden
                                                accept="image/*"
                                                onChange={e => {
                                                  const file = e.target.files?.[0];
                                                  if (file) {
                                                    setNewLessonVideoPairs(pairs => ({
                                                      ...pairs,
                                                      [addLessonModuleId]: (pairs[addLessonModuleId] || []).map((p, i) => i === idx ? { ...p, thumbnail: file } : p)
                                                    }));
                                                  }
                                                  e.target.value = '';
                                                }}
                                              />
                                            </Button>
                                          )}
                                        </Box>
                                      </Stack>
                                      {/* Preview section for video and thumbnail */}
                                      <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                                        <Box>
                                          <video
                                            src={URL.createObjectURL(pair.video)}
                                            controls
                                            style={{ maxWidth: 120, maxHeight: 80, borderRadius: 6, border: '1px solid #eee' }}
                                          />
                                        </Box>
                                        {pair.thumbnail && (
                                          <Box>
                                            <img
                                              src={URL.createObjectURL(pair.thumbnail)}
                                              alt="Thumbnail Preview"
                                              style={{ maxWidth: 80, maxHeight: 80, borderRadius: 6, border: '1px solid #eee' }}
                                            />
                                          </Box>
                                        )}
                                      </Stack>
                                    </Box>
                                  ))}
                                  {/* Upload Video (if less than 3) */}
                                  {(newLessonVideoPairs[addLessonModuleId]?.length || 0) < 3 && (
                                    <Button
                                      variant="outlined"
                                      component="label"
                                      size="small"
                                      sx={{ mt: 1 }}
                                    >
                                      Upload Video
                                      <input
                                        type="file"
                                        hidden
                                        accept="video/*"
                                        onChange={e => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                            setNewLessonVideoPairs(pairs => ({
                                              ...pairs,
                                              [addLessonModuleId]: [...(pairs[addLessonModuleId] || []), { video: file, thumbnail: null }]
                                            }));
                                          }
                                          e.target.value = '';
                                        }}
                                      />
                                    </Button>
                                  )}
                                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                    Max 3 videos. Only video files. Max size 2MB each.
                                  </Typography>
                                </>
                              )}
                              {/* Live Lesson Specific Fields */}
                              {newLessonInputs[addLessonModuleId]?.type === 'Live' && (
                                <>
                                  <TextField
                                    size="small"
                                    label="Start Date and Time"
                                    type="datetime-local"
                                    value={newLessonLiveFields[addLessonModuleId]?.startDateTime || ''}
                                    onChange={e => setNewLessonLiveFields(fields => ({
                                      ...fields,
                                      [addLessonModuleId]: {
                                        ...fields[addLessonModuleId],
                                        startDateTime: e.target.value
                                      }
                                    }))}
                                    sx={{ mr: 1, width: 220 }}
                                    InputLabelProps={{ shrink: true }}
                                  />
                                  <TextField
                                    size="small"
                                    label="Duration (minutes)"
                                    type="number"
                                    value={newLessonLiveFields[addLessonModuleId]?.duration || ''}
                                    onChange={e => setNewLessonLiveFields(fields => ({
                                      ...fields,
                                      [addLessonModuleId]: {
                                        ...fields[addLessonModuleId],
                                        duration: e.target.value
                                      }
                                    }))}
                                    sx={{ mr: 1, width: 220 }}
                                  />
                                  <FormControl size="small" sx={{ minWidth: 180 }}>
                                    <InputLabel>Virtual Meeting Link</InputLabel>
                                    <Select
                                      value={newLessonLiveFields[addLessonModuleId]?.meetingLink || ''}
                                      onChange={e => setNewLessonLiveFields(fields => ({
                                        ...fields,
                                        [addLessonModuleId]: {
                                          ...fields[addLessonModuleId],
                                          meetingLink: e.target.value,
                                          customLink: fields[addLessonModuleId]?.customLink || ''
                                        }
                                      }))}
                                      label="Virtual Meeting Link"
                                    >
                                      <MenuItem value="Google Meet">Google Meet</MenuItem>
                                      <MenuItem value="Zoom">Zoom</MenuItem>
                                      <MenuItem value="Webex">Webex</MenuItem>
                                      <MenuItem value="Custom Link">Custom</MenuItem>
                                    </Select>
                                  </FormControl>
                                  <TextField
                                    size="small"
                                    label={meetingLinkMeta[newLessonLiveFields[addLessonModuleId]?.meetingLink || 'Custom Link'].label}
                                    value={newLessonLiveFields[addLessonModuleId]?.customLink || ''}
                                    onChange={e => setNewLessonLiveFields(fields => ({
                                      ...fields,
                                      [addLessonModuleId]: {
                                        ...fields[addLessonModuleId],
                                        customLink: e.target.value
                                      }
                                    }))}
                                    sx={{ mt: 1, width: '100%' }}
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          {meetingLinkMeta[newLessonLiveFields[addLessonModuleId]?.meetingLink || 'Custom Link'].icon}
                                        </InputAdornment>
                                      )
                                    }}
                                    placeholder={meetingLinkMeta[newLessonLiveFields[addLessonModuleId]?.meetingLink || 'Custom Link'].placeholder}
                                  />
                                  <Button
                                    variant="outlined"
                                    component="label"
                                    size="small"
                                    sx={{ mr: 1 }}
                                    disabled={(newLessonLiveFields[addLessonModuleId]?.documents?.length || 0) >= 10}
                                  >
                                    Upload Documents
                                    <input
                                      type="file"
                                      multiple
                                      hidden
                                      accept=".pdf,.doc,.docx,.ppt,.pptx,image/*"
                                      onChange={e => {
                                        const files = Array.from(e.target.files || []);
                                        setNewLessonLiveFields(fields => ({
                                          ...fields,
                                          [addLessonModuleId]: {
                                            ...fields[addLessonModuleId],
                                            documents: [...(fields[addLessonModuleId]?.documents || []), ...files].slice(0, 10)
                                          }
                                        }));
                                        e.target.value = '';
                                      }}
                                    />
                                  </Button>
                                  {/* Show uploaded documents */}
                                  {(newLessonLiveFields[addLessonModuleId]?.documents || []).map((file, idx) => (
                                    <Chip
                                      key={file.name + idx}
                                      label={file.name}
                                      onDelete={() => setNewLessonLiveFields(fields => ({
                                        ...fields,
                                        [addLessonModuleId]: {
                                          ...fields[addLessonModuleId],
                                          documents: (fields[addLessonModuleId]?.documents || []).filter((_, i) => i !== idx)
                                        }
                                      }))}
                                    />
                                  ))}
                                </>
                              )}
                              <Stack direction="row" spacing={1} justifyContent="flex-end">
                                <Button size="small" variant="contained" onClick={() => handleAddLesson(addLessonModuleId)}>
                                  Add Lesson
                                </Button>
                                <Button size="small" onClick={() => setAddLessonModuleId(null)}>Cancel</Button>
                              </Stack>
                            </Stack>
                          </Paper>
                        ) : selectedModuleId === 'new' ? (
                          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2, background: '#fff' }}>
                            <Typography variant="h6" fontWeight={700} color="#6C63FF" mb={2}>
                              Add New Module
                            </Typography>
                            <Stack spacing={2}>
                              <TextField
                                label="Module Title"
                                value={newModuleTitle}
                                onChange={e => setNewModuleTitle(e.target.value)}
                                fullWidth
                                autoFocus
                              />
                              <Button
                                variant="contained"
                                onClick={handleAddModule}
                                disabled={!newModuleTitle.trim() || saving}
                              >
                                {saving ? 'Adding...' : 'Add Module'}
                              </Button>
                              <Button
                                variant="outlined"
                                onClick={() => setSelectedModuleId(null)}
                                disabled={saving}
                              >
                                Cancel
                              </Button>
                            </Stack>
                          </Paper>
                        ) : selectedModuleId && !selectedLessonId ? (
                          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2, background: '#fff' }}>
                            <Typography variant="h6" fontWeight={700} color="#6C63FF" mb={2}>
                              Edit Module
                            </Typography>
                            <Stack spacing={2}>
                              <TextField
                                label="Module Title"
                                value={newModuleTitle}
                                onChange={e => setNewModuleTitle(e.target.value)}
                                fullWidth
                                autoFocus
                              />
                              <Button
                                variant="contained"
                                onClick={() => handleEditModule(selectedModuleId, newModuleTitle)}
                                disabled={!newModuleTitle.trim() || saving}
                              >
                                {saving ? 'Saving...' : 'Save Module'}
                              </Button>
                              <Button
                                variant="outlined"
                                onClick={() => setSelectedModuleId(null)}
                                disabled={saving}
                              >
                                Cancel
                              </Button>
                            </Stack>
                          </Paper>
                        ) : selectedLessonId && !selectedModuleId ? (
                          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2, background: '#fff' }}>
                            <Typography variant="h6" fontWeight={700} color="#6C63FF" mb={2}>
                              Edit Lesson
                            </Typography>
                            <Stack spacing={2}>
                              {/* Type Tabs/Buttons */}
                              <FormControl size="small" sx={{ minWidth: 100 }}>
                                <InputLabel id="edit-lesson-type-label">Lesson Type</InputLabel>
                                <Select
                                  labelId="edit-lesson-type-label"
                                  label="Lesson Type"
                                  value={lessonInput?.type || lessonTypes[0]}
                                  onChange={e => setNewLessonInputs(inputs => ({ ...inputs, [selectedLessonId]: { ...(inputs[selectedLessonId] || { title: '', type: lessonTypes[0] }), type: e.target.value } }))}
                                >
                                  {lessonTypes.map(type => (
                                    <MenuItem key={type} value={type}>
                                      <ListItemIcon>{lessonTypeIcons[type]}</ListItemIcon>
                                      <ListItemText primary={type} />
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                              {/* Title */}
                              <TextField
                                label="Title"
                                value={lessonInput?.title || ''}
                                onChange={e => setNewLessonInputs(inputs => ({ ...inputs, [selectedLessonId]: { ...(inputs[selectedLessonId] || { type: lessonTypes[0] }), title: e.target.value } }))}
                                size="small"
                                autoFocus
                                sx={{ mr: 1 }}
                              />
                              {/* Description */}
                              <TextField
                                size="small"
                                label="Description"
                                value={lessonDescription}
                                onChange={e => setNewLessonDescriptions(descs => ({ ...descs, [selectedLessonId]: e.target.value }))}
                                sx={{ width: '100%' }}
                                multiline
                                minRows={2}
                              />
                              {/* Pre/Post Class Messages */}
                              {['Video', 'Text', 'Quiz', 'Assignment', 'Live'].includes(lessonInput?.type || '') && (
                                <>
                                  <TextField
                                    size="small"
                                    label="Pre Class Message"
                                    value={newLessonPreClassMessages[selectedLessonId] || ''}
                                    onChange={e => setNewLessonPreClassMessages(msgs => ({ ...msgs, [selectedLessonId]: e.target.value }))}
                                    sx={{ width: '100%' }}
                                    multiline
                                    minRows={1}
                                  />
                                  <TextField
                                    size="small"
                                    label="Post Class Message"
                                    value={newLessonPostClassMessages[selectedLessonId] || ''}
                                    onChange={e => setNewLessonPostClassMessages(msgs => ({ ...msgs, [selectedLessonId]: e.target.value }))}
                                    sx={{ width: '100%' }}
                                    multiline
                                    minRows={1}
                                  />
                                </>
                              )}
                              {/* Resource Upload */}
                              <Button
                                variant="outlined"
                                component="label"
                                size="small"
                                sx={{ mr: 1 }}
                                disabled={(lessonResources?.length || 0) >= 10}
                              >
                                Upload Resources
                                <input
                                  type="file"
                                  multiple
                                  hidden
                                  accept=".pdf,.doc,.docx,.ppt,.pptx,image/*"
                                  onChange={e => {
                                    const files = Array.from(e.target.files || []);
                                    const prevFiles = lessonResources || [];
                                    let error = '';
                                    let validFiles = [];
                                    for (const file of files) {
                                      if (file.size > 2 * 1024 * 1024) {
                                        error = `File ${file.name} exceeds 2MB.`;
                                        continue;
                                      }
                                      validFiles.push(file);
                                    }
                                    if (prevFiles.length + validFiles.length > 10) {
                                      error = 'Cannot upload more than 10 resources.';
                                      validFiles = validFiles.slice(0, 10 - prevFiles.length);
                                    }
                                    setResourceUploadErrors(errs => ({ ...errs, [selectedLessonId]: error }));
                                    setNewLessonResources(res => ({
                                      ...res,
                                      [selectedLessonId]: [...prevFiles, ...validFiles]
                                    }));
                                    e.target.value = '';
                                  }}
                                />
                              </Button>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                Max 10 files. Only PDF, PPT, DOC, DOCX, and images. Max size 2MB each.
                              </Typography>
                              {resourceUploadErrors[selectedLessonId] && (
                                <Typography color="error" variant="caption">{resourceUploadErrors[selectedLessonId]}</Typography>
                              )}
                              {/* Show uploaded resources */}
                              {(lessonResources || []).map((file, idx) => (
                                <Chip
                                  key={file.name + idx}
                                  label={file.name}
                                  onDelete={() => setNewLessonResources(res => ({
                                    ...res,
                                    [selectedLessonId]: res[selectedLessonId].filter((_, i) => i !== idx)
                                  }))}
                                />
                              ))}
                              {/* Video Upload (if type is Video) */}
                              {(lessonInput?.type === 'Video') && (
                                <Button
                                  variant="outlined"
                                  component="label"
                                  size="small"
                                  sx={{ mr: 1 }}
                                >
                                  Upload Video
                                  <input
                                    type="file"
                                    hidden
                                    accept="video/*"
                                    onChange={e => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        setNewLessonVideoPairs(pairs => ({ ...pairs, [selectedLessonId]: [...(pairs[selectedLessonId] || []), { video: file, thumbnail: null }] }));
                                      }
                                      e.target.value = '';
                                    }}
                                  />
                                </Button>
                              )}
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                Max 3 videos. Only video files. Max size 2MB each.
                              </Typography>
                              {/* Show uploaded video */}
                              {(lessonInput?.type === 'Video' && lessonVideos?.length > 0) && (
                                lessonVideos.map((v, idx) => (
                                  <Chip
                                    key={v.video.name + idx}
                                    label={v.video.name}
                                    onDelete={() => setNewLessonVideoPairs(pairs => ({
                                      ...pairs,
                                      [selectedLessonId]: (pairs[selectedLessonId] || []).filter((_, i) => i !== idx)
                                    }))}
                                    sx={{ mr: 1 }}
                                  />
                                ))
                              )}
                              {/* Thumbnail Upload (if type is Video) */}
                              {(lessonInput?.type === 'Video') && (
                                <Button
                                  variant="outlined"
                                  component="label"
                                  size="small"
                                  sx={{ mr: 1 }}
                                >
                                  Upload Thumbnail
                                  <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={e => {
                                      const file = e.target.files?.[0] || null;
                                      setLessonThumbnails(thumbnails => ({ ...thumbnails, [selectedLessonId]: [...(thumbnails[selectedLessonId] || []), file] }));
                                      e.target.value = '';
                                    }}
                                  />
                                </Button>
                              )}
                              {/* Show uploaded thumbnail */}
                              {(lessonInput?.type === 'Video' && lessonThumbnailsArray?.length > 0) && (
                                <Chip
                                  label={lessonThumbnailsArray[0]?.name}
                                  onDelete={() => setLessonThumbnails(thumbnails => ({ ...thumbnails, [selectedLessonId]: (thumbnails[selectedLessonId] || []).filter(t => t?.name !== lessonThumbnailsArray[0]?.name) }))}
                                  sx={{ mr: 1 }}
                                />
                              )}
                              {/* Live Lesson Specific Fields */}
                              {lessonInput?.type === 'Live' && (
                                <>
                                  <TextField
                                    size="small"
                                    label="Start Date and Time"
                                    type="datetime-local"
                                    value={newLessonLiveFields[selectedLessonId]?.startDateTime || ''}
                                    onChange={e => setNewLessonLiveFields(fields => ({
                                      ...fields,
                                      [selectedLessonId]: {
                                        ...fields[selectedLessonId],
                                        startDateTime: e.target.value
                                      }
                                    }))}
                                    sx={{ mr: 1, width: 220 }}
                                    InputLabelProps={{ shrink: true }}
                                  />
                                  <TextField
                                    size="small"
                                    label="Duration (minutes)"
                                    type="number"
                                    value={newLessonLiveFields[selectedLessonId]?.duration || ''}
                                    onChange={e => setNewLessonLiveFields(fields => ({
                                      ...fields,
                                      [selectedLessonId]: {
                                        ...fields[selectedLessonId],
                                        duration: e.target.value
                                      }
                                    }))}
                                    sx={{ mr: 1, width: 220 }}
                                  />
                                  <FormControl size="small" sx={{ minWidth: 180 }}>
                                    <InputLabel>Virtual Meeting Link</InputLabel>
                                    <Select
                                      value={newLessonLiveFields[selectedLessonId]?.meetingLink || ''}
                                      onChange={e => setNewLessonLiveFields(fields => ({
                                        ...fields,
                                        [selectedLessonId]: {
                                          ...fields[selectedLessonId],
                                          meetingLink: e.target.value,
                                          customLink: fields[selectedLessonId]?.customLink || ''
                                        }
                                      }))}
                                      label="Virtual Meeting Link"
                                    >
                                      <MenuItem value="Google Meet">Google Meet</MenuItem>
                                      <MenuItem value="Zoom">Zoom</MenuItem>
                                      <MenuItem value="Webex">Webex</MenuItem>
                                      <MenuItem value="Custom Link">Custom</MenuItem>
                                    </Select>
                                  </FormControl>
                                  <TextField
                                    size="small"
                                    label={meetingLinkMeta[newLessonLiveFields[selectedLessonId]?.meetingLink || 'Custom Link'].label}
                                    value={newLessonLiveFields[selectedLessonId]?.customLink || ''}
                                    onChange={e => setNewLessonLiveFields(fields => ({
                                      ...fields,
                                      [selectedLessonId]: {
                                        ...fields[selectedLessonId],
                                        customLink: e.target.value
                                      }
                                    }))}
                                    sx={{ mt: 1, width: '100%' }}
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          {meetingLinkMeta[newLessonLiveFields[selectedLessonId]?.meetingLink || 'Custom Link'].icon}
                                        </InputAdornment>
                                      )
                                    }}
                                    placeholder={meetingLinkMeta[newLessonLiveFields[selectedLessonId]?.meetingLink || 'Custom Link'].placeholder}
                                  />
                                  <Button
                                    variant="outlined"
                                    component="label"
                                    size="small"
                                    sx={{ mr: 1 }}
                                    disabled={(newLessonLiveFields[selectedLessonId]?.documents?.length || 0) >= 10}
                                  >
                                    Upload Documents
                                    <input
                                      type="file"
                                      multiple
                                      hidden
                                      accept=".pdf,.doc,.docx,.ppt,.pptx,image/*"
                                      onChange={e => {
                                        const files = Array.from(e.target.files || []);
                                        setNewLessonLiveFields(fields => ({
                                          ...fields,
                                          [selectedLessonId]: {
                                            ...fields[selectedLessonId],
                                            documents: [...(fields[selectedLessonId]?.documents || []), ...files].slice(0, 10)
                                          }
                                        }));
                                        e.target.value = '';
                                      }}
                                    />
                                  </Button>
                                  {/* Show uploaded documents */}
                                  {(newLessonLiveFields[selectedLessonId]?.documents || []).map((file, idx) => (
                                    <Chip
                                      key={file.name + idx}
                                      label={file.name}
                                      onDelete={() => setNewLessonLiveFields(fields => ({
                                        ...fields,
                                        [selectedLessonId]: {
                                          ...fields[selectedLessonId],
                                          documents: (fields[selectedLessonId]?.documents || []).filter((_, i) => i !== idx)
                                        }
                                      }))}
                                    />
                                  ))}
                                </>
                              )}
                              {/* Quiz Question Editor */}
                              {lessonInput?.type === 'Quiz' && (
                                <QuizQuestionEditor value={editQuizQuestion} onChange={setEditQuizQuestion} />
                              )}
                              <Stack direction="row" spacing={1} justifyContent="flex-end">
                                <Button size="small" variant="contained" onClick={() => handleEditLesson(modules.findIndex(mod => mod.lessons.some(l => l.id === selectedLessonId)), selectedLessonId, lessonInput?.title || '', lessonInput?.type || lessonTypes[0])}>
                                  Save
                                </Button>
                                <Button size="small" onClick={() => setEditingLessonId(null)}>Cancel</Button>
                              </Stack>
                            </Stack>
                          </Paper>
                        ) : (
                          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <Typography variant="body1" color="text.secondary">
                              Select a module to edit or add a new lesson to get started.
                            </Typography>
                          </Paper>
                        )}
                      </Box>
                    </Box>
                  ) : (
                    <Typography variant="body1" color="text.secondary">
                      [Futuristic {steps[activeStep]} UI coming soon...]
                    </Typography>
                  )}
                </motion.div>
              </AnimatePresence>
              <Stack direction="row" spacing={2} justifyContent="flex-end" mt={4}>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<ArrowBack />}
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
                  sx={{ minWidth: 120 }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<ArrowForward />}
                  disabled={activeStep === steps.length - 1}
                  onClick={() => setActiveStep((s) => Math.min(steps.length - 1, s + 1))}
                  sx={{ minWidth: 120, boxShadow: '0 2px 12px #00FFC633' }}
                >
                  Next
                </Button>
              </Stack>
            </GlassPanel>
          </Container>
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default CourseBuilderPage; 