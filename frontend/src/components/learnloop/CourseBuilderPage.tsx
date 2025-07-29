import React, { useState, Suspense, Component, ReactNode } from 'react';
import { Box, Container, Typography, Paper, IconButton, Tooltip, Button, Stack, TextField, MenuItem, Chip, InputLabel, Select, FormControl, OutlinedInput, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import { CheckCircle, RadioButtonUnchecked, ArrowForward, ArrowBack, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

import CurriculumStep from './CurriculumStep';
// import DripContentStep from './DripContentStep';
// import CertificateStep from './CertificateStep';
import PreviewPublishStep from './PreviewPublishStep';

// Lazy load heavy components
const DripContentStep = React.lazy(() => import('./DripContentStep'));
const CertificateStep = React.lazy(() => import('./CertificateStep'));
const PaymentDetailsStep = React.lazy(() => import('./PaymentDetailsStep'));
const AdditionalDetailsStep = React.lazy(() => import('./AdditionalDetailsStep'));



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



const categories = ['Business', 'Technology', 'Design', 'Marketing', 'Personal Development', 'Health', 'Other'];
const levels = ['Beginner', 'Intermediate', 'Advanced'];
const languages = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Other'];
const visibilities = ['Public', 'Unlisted', 'Private'];
const allTags = ['AI', 'Web', 'Startup', 'Productivity', 'Coding', 'Art', 'Finance', 'Growth'];



// Add custom animated spinner component
// Error boundary component
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    console.error('ErrorBoundary caught an error:', error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error details:', error);
    console.error('Error info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '400px',
          background: '#f8f9ff',
          borderRadius: 2
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Something went wrong
            </Typography>
            <Button 
              variant="outlined" 
              onClick={() => window.location.reload()}
              sx={{ mt: 2 }}
            >
              Reload Page
            </Button>
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}

const AnimatedSpinner = () => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: [0.8, 1.1, 1], rotate: [0, 360], opacity: 1, boxShadow: [
      '0 0 0px 0px #00FFC6',
      '0 0 32px 12px #00FFC6',
      '0 0 0px 0px #00FFC6',
    ] }}
    transition={{
      duration: 1.2,
      repeat: Infinity,
      repeatType: 'loop',
      ease: 'easeInOut',
      times: [0, 0.5, 1],
    }}
    style={{
      width: 90,
      height: 90,
      borderRadius: '50%',
      background: 'conic-gradient(from 90deg at 50% 50%, #6C63FF, #00FFC6, #00F5FF, #6C63FF)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 0 32px 12px #00FFC6',
      position: 'relative',
    }}
  >
    <motion.div
      animate={{
        scale: [1, 1.15, 1],
        opacity: [0.7, 1, 0.7],
        filter: [
          'blur(0px)',
          'blur(2px)',
          'blur(0px)'
        ]
      }}
      transition={{
        duration: 1.2,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'easeInOut',
        times: [0, 0.5, 1],
      }}
      style={{
        width: 60,
        height: 60,
        borderRadius: '50%',
        background: 'radial-gradient(circle, #fff 0%, #00FFC6 60%, transparent 100%)',
        position: 'absolute',
        top: 15,
        left: 15,
        zIndex: 1,
        opacity: 0.7,
      }}
    />
    <motion.div
      animate={{
        scale: [1, 1.08, 1],
        opacity: [1, 0.8, 1],
      }}
      transition={{
        duration: 1.2,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'easeInOut',
        times: [0, 0.5, 1],
      }}
      style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #6C63FF 0%, #00FFC6 100%)',
        boxShadow: '0 0 16px 4px #00FFC6',
        zIndex: 2,
      }}
    />
  </motion.div>
);

const CourseBuilderPage: React.FC = React.memo(() => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [loadingStep, setLoadingStep] = React.useState(false);
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

  // Auto-save functionality
  const [autoSaveEnabled, setAutoSaveEnabled] = React.useState(true);
  const [lastSaved, setLastSaved] = React.useState<Date | null>(null);



  // Auto-save function
  const handleAutoSave = async () => {
    try {
      console.log('Auto-saving course data...');
      // Simulate API call for auto-save
      await new Promise(resolve => setTimeout(resolve, 500));
      setLastSaved(new Date());
      console.log('Auto-save completed at:', new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

  // Save as draft function
  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      console.log('Saving draft...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLastSaved(new Date());
      console.log('Draft saved successfully');
    } catch (error) {
      console.error('Save draft failed:', error);
    } finally {
      setSaving(false);
    }
  };

  // Next step
  const handleNext = () => {
    if (validate()) setActiveStep((s) => Math.min(steps.length - 1, s + 1));
  };







  // Certificate state
  const [certificateEnabled, setCertificateEnabled] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('1');
  const [certificateTitle, setCertificateTitle] = useState('Certificate of Completion');
  const [certificateDescription, setCertificateDescription] = useState('This is to certify that [Name] has successfully completed the course');
  const [completionPercentage, setCompletionPercentage] = useState(100);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [applicationLogoEnabled, setApplicationLogoEnabled] = useState(true); // Default enabled
  const [signatures, setSignatures] = useState<Array<{
    id: string;
    name: string;
    designation: string;
    type: 'upload' | 'draw';
    image?: string;
    enabled: boolean;
    isDefault?: boolean;
  }>>([]);

  // New state variables for creator logo
  const [creatorLogoFile, setCreatorLogoFile] = useState<File | null>(null);





  // Debug activeStep changes
  React.useEffect(() => {
    console.log('Active step changed to:', activeStep, 'Step name:', steps[activeStep]);
  }, [activeStep]);

  // Course data state for auto-save
  const courseData = React.useMemo(() => ({
    // Step 0: Course Details
    title,
    subtitle,
    description,
    category,
    level,
    language,
    tags,
    visibility,
    cover,
    

    

    
    // Step 3: Certificate
    certificateEnabled,
    selectedTemplate,
    certificateTitle,
    certificateDescription,
    completionPercentage,
    applicationLogoEnabled,
    signatures,
    creatorLogoFile,
    
    // Step 4: Payment Details (will be added by PaymentDetailsStep)
    // Step 5: Additional Details (will be added by AdditionalDetailsStep)
    // Step 6: Preview & Publish (will be added by PreviewPublishStep)
  }), [
    title, subtitle, description, category, level, language, tags, visibility, cover,
    certificateEnabled, selectedTemplate, certificateTitle, certificateDescription, 
    completionPercentage, applicationLogoEnabled, signatures, creatorLogoFile
  ]);

  // Auto-save every 10 seconds
  React.useEffect(() => {
    if (!autoSaveEnabled) return;
    
    const autoSaveInterval = setInterval(() => {
      handleAutoSave();
    }, 10000); // 10 seconds
    
    return () => clearInterval(autoSaveInterval);
  }, [autoSaveEnabled, courseData]);

  // Stepper click handler with loading simulation
  const handleStepClick = (idx: number) => {
    if (activeStep === idx) return;
    setLoadingStep(true);
    setTimeout(() => {
      setActiveStep(idx);
      setLoadingStep(false);
    }, 100); // Reduced to 100ms for faster loading
  };

  // Preload adjacent steps for faster navigation
  React.useEffect(() => {
    const preloadAdjacentSteps = () => {
      const adjacentSteps = [activeStep - 1, activeStep + 1].filter(
        step => step >= 0 && step < steps.length
      );
      
      // Preload heavy components for adjacent steps
      if (adjacentSteps.includes(2)) { // Drip Content
        import('./DripContentStep');
      }
      if (adjacentSteps.includes(3)) { // Certificate
        import('./CertificateStep');
      }
      if (adjacentSteps.includes(4)) { // Payment Details
        import('./PaymentDetailsStep');
      }
      if (adjacentSteps.includes(5)) { // Additional Details
        import('./AdditionalDetailsStep');
      }
    };

    // Preload immediately for faster loading
    preloadAdjacentSteps();
  }, [activeStep]);

  return (
    <Box sx={{ minHeight: '100vh', width: '100%', p: 0, m: 0, overflow: 'hidden' }}>
      {loadingStep && (
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255,255,255,0.18)',
          backdropFilter: 'blur(2px)',
        }}>
          <AnimatedSpinner />
        </Box>
      )}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -80 }}
          transition={{ duration: 0.6, ease: [0.4, 0.2, 0.6, 1] }}
          style={{ 
            minHeight: '100vh', 
            width: '100%', 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            background: '#ffffff', 
            zIndex: 0, 
            overflow: 'hidden',
            maxWidth: '100%'
          }}
        >
          <Container maxWidth="lg" sx={{ 
            py: 6, 
            position: 'relative', 
            minHeight: '100vh', 
            overflow: 'hidden',
            maxWidth: '100%',
            width: '100%'
          }}>
            <StepperRail>
              {steps.map((label, idx) => (
                <React.Fragment key={label}>
                  <Tooltip title={label} placement="right" arrow>
                    <StepOrb
                      active={activeStep === idx}
                      completed={idx < activeStep}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleStepClick(idx)}
                      tabIndex={0}
                      aria-label={label}
                      style={{ pointerEvents: loadingStep ? 'none' : 'auto', opacity: loadingStep ? 0.5 : 1 }}
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
            <GlassPanel sx={{ width: '100%', minHeight: 220, position: 'relative', boxSizing: 'border-box', marginTop: 0, overflow: 'hidden' }}>
              <Box sx={{ mb: 2, p: 2, bgcolor: 'rgba(108, 99, 255, 0.1)', borderRadius: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Current Step: {activeStep} - {steps[activeStep]}
                </Typography>
              </Box>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.5 }}
                  style={{ overflow: 'hidden' }}
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
                    <CurriculumStep />
                  ) : activeStep === 2 ? (
                    <Suspense fallback={<CircularProgress />}>
                      <DripContentStep />
                    </Suspense>
                  ) : activeStep === 3 ? (
                    <Suspense fallback={
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        height: '400px',
                        background: '#f8f9ff',
                        borderRadius: 2
                      }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <CircularProgress size={60} sx={{ mb: 3, color: '#6C63FF' }} />
                          <Typography variant="h6" color="text.secondary" gutterBottom>
                            Loading Certificate Builder
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Preparing certificate templates and settings...
                          </Typography>
                        </Box>
                      </Box>
                    }>
                    <ErrorBoundary>
                    <CertificateStep
                      certificateEnabled={certificateEnabled}
                      onCertificateEnabledChange={setCertificateEnabled}
                      selectedTemplate={selectedTemplate}
                      onTemplateChange={setSelectedTemplate}
                      certificateTitle={certificateTitle}
                      onCertificateTitleChange={setCertificateTitle}
                      certificateDescription={certificateDescription}
                      onCertificateDescriptionChange={setCertificateDescription}
                      completionPercentage={completionPercentage}
                      onCompletionPercentageChange={setCompletionPercentage}
                      logoFile={logoFile}
                      onLogoChange={setLogoFile}
                      applicationLogoEnabled={applicationLogoEnabled}
                      onApplicationLogoEnabledChange={setApplicationLogoEnabled}
                      signatures={signatures}
                      onSignaturesChange={setSignatures}
                      creatorLogoFile={creatorLogoFile}
                      onCreatorLogoChange={setCreatorLogoFile}
                    />
                    </ErrorBoundary>
                    </Suspense>
                  ) : activeStep === 4 ? (
                    <Suspense fallback={<CircularProgress />}>
                    <PaymentDetailsStep />
                    </Suspense>
                  ) : activeStep === 5 ? (
                    <Suspense fallback={<CircularProgress />}>
                      <AdditionalDetailsStep lastSaved={lastSaved} />
                    </Suspense>
                  ) : activeStep === 6 ? (
                    <>
                      {console.log('Rendering PreviewPublishStep, activeStep:', activeStep)}
                      <PreviewPublishStep />
                    </>
                  ) : (
                    <Typography variant="body1" color="text.secondary">
                      [Futuristic {steps[activeStep]} UI coming soon...]
                    </Typography>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Auto-save indicator */}
              {lastSaved && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  mt: 2,
                  p: 1,
                  bgcolor: 'rgba(76, 175, 80, 0.1)',
                  borderRadius: 1,
                  border: '1px solid rgba(76, 175, 80, 0.2)'
                }}>
                  <Typography variant="caption" color="success.main">
                    💾 Last saved: {lastSaved.toLocaleTimeString()}
                  </Typography>
                </Box>
              )}

              <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center" mt={4}>
                {/* Left side - Back button */}
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

                {/* Center - Save Draft button */}
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleSaveDraft}
                  disabled={saving}
                  sx={{ 
                    minWidth: 120,
                    borderColor: '#6C63FF',
                    color: '#6C63FF',
                    '&:hover': {
                      borderColor: '#5A52D5',
                      backgroundColor: 'rgba(108, 99, 255, 0.08)'
                    }
                  }}
                >
                  {saving ? 'Saving...' : 'Save Draft'}
                </Button>

                {/* Right side - Next button */}
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<ArrowForward />}
                  disabled={activeStep === steps.length - 1}
                  onClick={() => {
                    console.log('Next button clicked, current step:', activeStep);
                    // Only validate for step 0 (Course Details)
                    if (activeStep === 0) {
                      if (validate()) {
                        setActiveStep((s) => {
                          const nextStep = Math.min(steps.length - 1, s + 1);
                          console.log('Moving to step:', nextStep);
                          return nextStep;
                        });
                      } else {
                        console.log('Validation failed, staying on step:', activeStep);
                      }
                    } else {
                      // For all other steps, allow navigation without validation
                      setActiveStep((s) => {
                        const nextStep = Math.min(steps.length - 1, s + 1);
                        console.log('Moving to step:', nextStep);
                        return nextStep;
                      });
                    }
                  }}
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
});

export default CourseBuilderPage; 