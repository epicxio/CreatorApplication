import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, IconButton, Tooltip, Button, Stack, TextField, MenuItem, Chip, InputLabel, Select, FormControl, OutlinedInput, CircularProgress } from '@mui/material';
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
import AudioFileIcon from '@mui/icons-material/AudioFile';
import SvgIcon from '@mui/material/SvgIcon';
import QuizQuestionEditor from './QuizQuestionEditor';

interface QuizQuestion {
  id: string;
  question: string;
  type: 'single' | 'multiple';
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
}

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

// Change lessonTypes to include Live and Audio
const lessonTypes = ['Video', 'Text', 'Quiz', 'Assignment', 'Live', 'Audio'];

// Helper for icon mapping
const lessonTypeIcons: { [key: string]: JSX.Element } = {
  Video: <VideocamIcon sx={{ color: '#6C63FF' }} />, 
  Text: <DescriptionIcon sx={{ color: '#00BFFF' }} />, 
  Quiz: <QuizIcon sx={{ color: '#FFD600' }} />, 
  Assignment: <AssignmentTurnedInIcon sx={{ color: '#00FFC6' }} />, 
  Live: <LiveTvIcon sx={{ color: '#FF6B6B' }} />,
  Audio: <AudioFileIcon sx={{ color: '#FF8C00' }} />
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

const CurriculumStep = (props: any) => {
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
  const [newLessonAudioFiles, setNewLessonAudioFiles] = useState<{ [moduleId: string]: File[] }>({});
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
        ? { ...m, lessons: m.lessons.map(l => l.id === lessonId ? { ...l, title, type } : l) } : m
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

  // Add state for quiz questions in the add lesson form
  const [newQuizQuestions, setNewQuizQuestions] = useState<QuizQuestion[]>([{
    id: 'q-1',
    question: '',
    type: 'single',
    options: [
      { id: 'opt-1', text: 'Option 1', isCorrect: false },
      { id: 'opt-2', text: 'Option 2', isCorrect: true }
    ],
  }]);

  useEffect(() => {
    if (!addLessonModuleId) return;
    if (newLessonInputs[addLessonModuleId]?.type === 'Quiz' && (!newQuizQuestions || newQuizQuestions.length === 0)) {
      setNewQuizQuestions([{
        id: 'q-1',
        question: '',
        type: 'single',
        options: [
          { id: 'opt-1', text: 'Option 1', isCorrect: false },
          { id: 'opt-2', text: 'Option 2', isCorrect: true }
        ],
      }]);
    }
  }, [addLessonModuleId, addLessonModuleId ? newLessonInputs[addLessonModuleId]?.type : undefined]);

  // Add state for quiz questions in the edit lesson form
  const [editQuizQuestions, setEditQuizQuestions] = useState<QuizQuestion[]>([{
    id: 'q-1',
    question: '',
    type: 'single',
    options: [
      { id: 'opt-1', text: 'Option 1', isCorrect: false },
      { id: 'opt-2', text: 'Option 2', isCorrect: true }
    ],
  }]);

  // Render the curriculum builder UI
  return (
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
              {['Video', 'Text', 'Quiz', 'Assignment', 'Live', 'Audio'].includes(newLessonInputs[addLessonModuleId]?.type || '') && (
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
                <QuizQuestionEditor value={newQuizQuestions} onChange={setNewQuizQuestions} />
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
                    let validFiles: File[] = [];
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
              {/* Audio Upload (if type is Audio) */}
              {(newLessonInputs[addLessonModuleId]?.type === 'Audio') && (
                <>
                  {/* Show uploaded audio files */}
                  {(newLessonAudioFiles[addLessonModuleId] || []).map((file, idx) => (
                    <Box key={file.name + idx} sx={{ mt: 1 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Chip
                          label={file.name}
                          sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}
                          onDelete={() => setNewLessonAudioFiles(files => ({
                            ...files,
                            [addLessonModuleId]: files[addLessonModuleId].filter((_, i) => i !== idx)
                          }))}
                        />
                      </Stack>
                      {/* Audio preview */}
                      <Box sx={{ mt: 1 }}>
                        <audio
                          src={URL.createObjectURL(file)}
                          controls
                          style={{ width: '100%', maxWidth: 300, borderRadius: 6, border: '1px solid #eee' }}
                        />
                      </Box>
                    </Box>
                  ))}
                  {/* Upload Audio (if less than 5) */}
                  {(newLessonAudioFiles[addLessonModuleId]?.length || 0) < 5 && (
                    <Button
                      variant="outlined"
                      component="label"
                      size="small"
                      sx={{ mt: 1 }}
                    >
                      Upload Audio
                      <input
                        type="file"
                        hidden
                        accept="audio/*"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setNewLessonAudioFiles(files => ({
                              ...files,
                              [addLessonModuleId]: [...(files[addLessonModuleId] || []), file]
                            }));
                          }
                          e.target.value = '';
                        }}
                      />
                    </Button>
                  )}
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    Max 5 audio files. Only audio files (MP3, WAV, etc.). Max size 10MB each.
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
                    sx={{ mr: 1, width: 220 }}
                    placeholder={meetingLinkMeta[newLessonLiveFields[addLessonModuleId]?.meetingLink || 'Custom Link'].placeholder}
                  />
                </>
              )}
              {/* Action Buttons */}
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => handleAddLesson(addLessonModuleId)}
                  disabled={!newLessonInputs[addLessonModuleId]?.title?.trim()}
                >
                  Add Lesson
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setAddLessonModuleId(null);
                    setNewLessonInputs(inputs => ({ ...inputs, [addLessonModuleId]: { title: '', type: lessonTypes[0] } }));
                    setNewLessonDescriptions(descs => ({ ...descs, [addLessonModuleId]: '' }));
                    setNewLessonResources(res => ({ ...res, [addLessonModuleId]: [] }));
                    setNewLessonVideoPairs(pairs => ({ ...pairs, [addLessonModuleId]: [] }));
                    setNewLessonAudioFiles(files => ({ ...files, [addLessonModuleId]: [] }));
                    setNewLessonPreClassMessages(msgs => ({ ...msgs, [addLessonModuleId]: '' }));
                    setNewLessonPostClassMessages(msgs => ({ ...msgs, [addLessonModuleId]: '' }));
                    setNewLessonLiveFields(fields => ({ ...fields, [addLessonModuleId]: { startDateTime: '', duration: '', meetingLink: '', documents: [] } }));
                    setNewQuizQuestions([{
                      id: 'q-1',
                      question: '',
                      type: 'single',
                      options: [
                        { id: 'opt-1', text: 'Option 1', isCorrect: false },
                        { id: 'opt-2', text: 'Option 2', isCorrect: true }
                      ],
                    }]);
                  }}
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </Paper>
        ) : selectedModuleId ? (
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2, background: '#fff' }}>
            <Typography variant="h6" fontWeight={700} color="#6C63FF" mb={2}>
              {selectedModuleId === 'new' ? 'Add New Module' : 'Edit Module'}
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Module Title"
                value={selectedModuleId === 'new' ? newModuleTitle : modules.find(m => m.id === selectedModuleId)?.title || ''}
                onChange={e => selectedModuleId === 'new' ? setNewModuleTitle(e.target.value) : handleEditModule(selectedModuleId, e.target.value)}
                size="small"
                autoFocus
              />
              {selectedModuleId === 'new' && (
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    onClick={handleAddModule}
                    disabled={!newModuleTitle.trim()}
                  >
                    Add Module
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setSelectedModuleId(null);
                      setNewModuleTitle('');
                    }}
                  >
                    Cancel
                  </Button>
                </Stack>
              )}
            </Stack>
          </Paper>
        ) : selectedLessonId ? (
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2, background: '#fff' }}>
            <Typography variant="h6" fontWeight={700} color="#6C63FF" mb={2}>
              Edit Lesson
            </Typography>
            <Stack spacing={2}>
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel id="edit-lesson-type-label">Lesson Type</InputLabel>
                <Select
                  labelId="edit-lesson-type-label"
                  label="Lesson Type"
                  value={lessonInput?.type || lessonTypes[0]}
                  onChange={e => setNewLessonInputs(inputs => ({ ...inputs, [selectedLessonId]: { ...(inputs[selectedLessonId] || { title: '' }), type: e.target.value } }))}
                >
                  {lessonTypes.map(type => (
                    <MenuItem key={type} value={type}>
                      <ListItemIcon>{lessonTypeIcons[type]}</ListItemIcon>
                      <ListItemText primary={type} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Title"
                value={lessonInput?.title || ''}
                onChange={e => setNewLessonInputs(inputs => ({ ...inputs, [selectedLessonId]: { ...(inputs[selectedLessonId] || { type: lessonTypes[0] }), title: e.target.value } }))}
                size="small"
              />
              <TextField
                size="small"
                label="Description"
                value={lessonDescription}
                onChange={e => setNewLessonDescriptions(descs => ({ ...descs, [selectedLessonId]: e.target.value }))}
                sx={{ width: '100%' }}
                multiline
                minRows={2}
              />
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  onClick={() => {
                    const lesson = modules.flatMap(m => m.lessons).find(l => l.id === selectedLessonId);
                    if (lesson && lessonInput) {
                      const modIdx = modules.findIndex(m => m.lessons.some(l => l.id === selectedLessonId));
                      handleEditLesson(modIdx, selectedLessonId, lessonInput.title || '', lessonInput.type || lessonTypes[0]);
                    }
                    setSelectedLessonId(null);
                  }}
                  disabled={!lessonInput?.title?.trim()}
                >
                  Save Changes
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setSelectedLessonId(null)}
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </Paper>
        ) : (
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Select a module or lesson to edit
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click "Edit" on any module or lesson to modify its details
              </Typography>
            </Box>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default CurriculumStep; 