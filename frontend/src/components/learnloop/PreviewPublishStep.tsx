import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  Paper,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  AlertTitle
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  PlayArrow as PlayArrowIcon,
  Description as DescriptionIcon,
  Quiz as QuizIcon,
  AssignmentTurnedIn as AssignmentIcon,
  LiveTv as LiveTvIcon,
  AudioFile as AudioFileIcon,
  MonetizationOn as MonetizationOnIcon,
  CreditCard as CreditCardIcon,
  Receipt as ReceiptIcon,
  WaterDrop as WaterDropIcon,
  QuestionAnswer as QuestionAnswerIcon,
  Visibility as VisibilityIcon,
  Schedule as ScheduleIcon,
  LocalOffer as LocalOfferIcon,
  Language as LanguageIcon,
  School as SchoolIcon,
  Category as CategoryIcon,
  Publish as PublishIcon,
  Save as SaveIcon,
  Celebration as CelebrationIcon,
  Rocket as RocketIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface PreviewPublishStepProps {
  // Add props for all the data from previous steps
}

interface CoursePreviewData {
  // Course Details
  title: string;
  subtitle: string;
  description: string;
  category: string;
  level: string;
  language: string;
  tags: string[];
  visibility: string;
  coverImage?: string;

  // Curriculum
  modules: Array<{
    id: string;
    title: string;
    lessons: Array<{
      id: string;
      title: string;
      type: string;
    }>;
  }>;

  // Drip Content
  dripEnabled: boolean;
  dripMethods: string[];
  displayOption: string;
  hideUnlockDate: boolean;
  sendCommunication: boolean;

  // Certificate
  certificateEnabled: boolean;
  certificateTitle: string;
  certificateDescription: string;
  completionPercentage: number;
  template: string;

  // Payment Details
  globalPricingEnabled: boolean;
  currencySpecificPricingEnabled: boolean;
  globalListPrice: string;
  globalActualPrice: string;
  currencyListPrices: { [key: string]: string };
  currencyActualPrices: { [key: string]: string };
  emiEnabled: boolean;
  installmentPeriod: number;
  numberOfInstallments: number;
  bufferTime: number;

  // Additional Details
  affiliateRewardEnabled: boolean;
  affiliateRewardPercentage: string;
  watermarkRemovalEnabled: boolean;
  faqs: Array<{
    id: number;
    question: string;
    answer: string;
  }>;
}

const PreviewPublishStep: React.FC<PreviewPublishStepProps> = () => {
  console.log('PreviewPublishStep rendered');
  
  const [publishing, setPublishing] = React.useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = React.useState(false);
  const [savingDraft, setSavingDraft] = React.useState(false);

  // Mock data for preview - in real implementation, this would come from props
  const courseData: CoursePreviewData = {
    title: "Complete Web Development Course",
    subtitle: "Learn HTML, CSS, JavaScript and React from scratch",
    description: "A comprehensive course covering all aspects of modern web development...",
    category: "Technology",
    level: "Beginner",
    language: "English",
    tags: ["Web Development", "JavaScript", "React"],
    visibility: "Public",
    modules: [
      {
        id: "module-1",
        title: "Introduction to Web Development",
        lessons: [
          { id: "lesson-1", title: "Welcome to the Course", type: "Video" },
          { id: "lesson-2", title: "Setting Up Your Environment", type: "Text" },
          { id: "lesson-3", title: "HTML Basics Quiz", type: "Quiz" }
        ]
      },
      {
        id: "module-2",
        title: "HTML Fundamentals",
        lessons: [
          { id: "lesson-4", title: "HTML Structure", type: "Video" },
          { id: "lesson-5", title: "HTML Assignment", type: "Assignment" }
        ]
      }
    ],
    dripEnabled: true,
    dripMethods: ["Time-based", "Completion-based"],
    displayOption: "Show all lessons",
    hideUnlockDate: false,
    sendCommunication: true,
    certificateEnabled: true,
    certificateTitle: "Web Development Certificate",
    certificateDescription: "Certificate of completion for web development course",
    completionPercentage: 80,
    template: "Modern",
    globalPricingEnabled: true,
    currencySpecificPricingEnabled: false,
    globalListPrice: "15",
    globalActualPrice: "10",
    currencyListPrices: { "USD": "15", "INR": "1200" },
    currencyActualPrices: { "USD": "10", "INR": "750" },
    emiEnabled: true,
    installmentPeriod: 3,
    numberOfInstallments: 2,
    bufferTime: 7,
    affiliateRewardEnabled: true,
    affiliateRewardPercentage: "10",
    watermarkRemovalEnabled: false,
    faqs: [
      { id: 1, question: "What will I learn in this course?", answer: "You will learn complete web development from basics to advanced concepts." },
      { id: 2, question: "Do I need any prior experience?", answer: "No prior experience is required. This course is designed for beginners." }
    ]
  };

  const handlePublish = async () => {
    setPublishing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setPublishing(false);
    setShowSuccessDialog(true);
  };

  const handleSaveDraft = async () => {
    setSavingDraft(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSavingDraft(false);
  };

  const getLessonTypeIcon = (type: string) => {
    const icons: { [key: string]: JSX.Element } = {
      Video: <PlayArrowIcon sx={{ color: '#6C63FF' }} />,
      Text: <DescriptionIcon sx={{ color: '#00BFFF' }} />,
      Quiz: <QuizIcon sx={{ color: '#FFD600' }} />,
      Assignment: <AssignmentIcon sx={{ color: '#00FFC6' }} />,
      Live: <LiveTvIcon sx={{ color: '#FF6B6B' }} />,
      Audio: <AudioFileIcon sx={{ color: '#FF8C00' }} />
    };
    return icons[type] || <DescriptionIcon />;
  };

  return (
    <Box sx={{ width: '100%' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{
          background: 'linear-gradient(135deg, #6C63FF 0%, #00FFC6 100%)',
          borderRadius: 4,
          p: 4,
          mb: 4,
          position: 'relative',
          overflow: 'hidden'
        }}>
          <Box sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            borderRadius: '50%'
          }} />
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h3" fontWeight={800} color="white" gutterBottom>
                Preview & Publish
              </Typography>
              <Typography variant="h6" color="rgba(255,255,255,0.8)" sx={{ mb: 2 }}>
                Review your course settings and publish to make it live
              </Typography>
              <Chip
                icon={<PublishIcon />}
                label="Ready to Launch"
                sx={{
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  backdropFilter: 'blur(10px)'
                }}
              />
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <RocketIcon sx={{ fontSize: 80, color: 'white', opacity: 0.8 }} />
              </motion.div>
            </Box>
          </Stack>
        </Box>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card sx={{
          background: 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(108, 99, 255, 0.1)',
          border: '1px solid rgba(108, 99, 255, 0.1)',
          mb: 4
        }}>
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={4}>
              
              {/* Course Overview */}
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  📚 Course Overview
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="h5" fontWeight={700} color="#6C63FF">
                      {courseData.title}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      {courseData.subtitle}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    <Chip icon={<CategoryIcon />} label={courseData.category} color="primary" />
                    <Chip icon={<SchoolIcon />} label={courseData.level} color="secondary" />
                    <Chip icon={<LanguageIcon />} label={courseData.language} />
                    <Chip icon={<VisibilityIcon />} label={courseData.visibility} />
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {courseData.description}
                  </Typography>
                </Stack>
              </Paper>

              {/* Curriculum Preview */}
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  📖 Curriculum ({courseData.modules.length} modules, {courseData.modules.reduce((acc, mod) => acc + mod.lessons.length, 0)} lessons)
                </Typography>
                <List>
                  {courseData.modules.map((module, modIndex) => (
                    <Box key={module.id}>
                      <ListItem sx={{ pl: 0 }}>
                        <ListItemIcon>
                          <Typography variant="h6" color="#6C63FF" fontWeight={600}>
                            {modIndex + 1}
                          </Typography>
                        </ListItemIcon>
                        <ListItemText
                          primary={module.title}
                          secondary={`${module.lessons.length} lessons`}
                        />
                      </ListItem>
                      <List sx={{ pl: 4 }}>
                        {module.lessons.map((lesson, lessonIndex) => (
                          <ListItem key={lesson.id} sx={{ pl: 0 }}>
                            <ListItemIcon>
                              {getLessonTypeIcon(lesson.type)}
                            </ListItemIcon>
                            <ListItemText
                              primary={lesson.title}
                              secondary={lesson.type}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  ))}
                </List>
              </Paper>

              {/* Drip Content Settings */}
              {courseData.dripEnabled && (
                <Paper sx={{ p: 3, borderRadius: 3 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    ⏰ Drip Content Settings
                  </Typography>
                  <Stack spacing={1}>
                    <Typography variant="body2" color="text.secondary">
                      • Drip Methods: {courseData.dripMethods.join(', ')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • Display Option: {courseData.displayOption}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • Hide Unlock Date: {courseData.hideUnlockDate ? 'Yes' : 'No'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • Send Communication: {courseData.sendCommunication ? 'Yes' : 'No'}
                    </Typography>
                  </Stack>
                </Paper>
              )}

              {/* Certificate Settings */}
              {courseData.certificateEnabled && (
                <Paper sx={{ p: 3, borderRadius: 3 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    🏆 Certificate Settings
                  </Typography>
                  <Stack spacing={1}>
                    <Typography variant="body2" color="text.secondary">
                      • Certificate Title: {courseData.certificateTitle}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • Completion Percentage: {courseData.completionPercentage}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • Template: {courseData.template}
                    </Typography>
                  </Stack>
                </Paper>
              )}

              {/* Payment Settings */}
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  💳 Payment Settings
                </Typography>
                <Stack spacing={2}>
                  {courseData.globalPricingEnabled && (
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Global Pricing
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        List Price: ${courseData.globalListPrice} | Actual Price: ${courseData.globalActualPrice}
                      </Typography>
                    </Box>
                  )}
                  {courseData.emiEnabled && (
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        EMI Options
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {courseData.numberOfInstallments} installments over {courseData.installmentPeriod} months
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Paper>

              {/* Additional Settings */}
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  ⚙️ Additional Settings
                </Typography>
                <Stack spacing={2}>
                  {courseData.affiliateRewardEnabled && (
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Affiliate Rewards
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {courseData.affiliateRewardPercentage}% commission for affiliates
                      </Typography>
                    </Box>
                  )}
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Watermark Removal
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {courseData.watermarkRemovalEnabled ? 'Enabled' : 'Disabled'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      FAQs
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {courseData.faqs.length} questions added
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              {/* Action Buttons */}
              <Paper sx={{ p: 3, borderRadius: 3, bgcolor: 'rgba(108, 99, 255, 0.05)' }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  🚀 Ready to Launch?
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Review all settings above and choose to publish your course or save as draft.
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveDraft}
                    disabled={savingDraft}
                    sx={{ minWidth: 150 }}
                  >
                    {savingDraft ? <CircularProgress size={20} /> : 'Save as Draft'}
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<PublishIcon />}
                    onClick={handlePublish}
                    disabled={publishing}
                    sx={{
                      minWidth: 150,
                      background: 'linear-gradient(135deg, #6C63FF 0%, #00FFC6 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5A52D5 0%, #00E6B8 100%)'
                      }
                    }}
                  >
                    {publishing ? <CircularProgress size={20} color="inherit" /> : 'Publish Course'}
                  </Button>
                </Stack>
              </Paper>

            </Stack>
          </CardContent>
        </Card>
      </motion.div>

      {/* Success Dialog */}
      <Dialog
        open={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ mb: 3 }}>
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 0.6, repeat: 3 }}
              >
                <CelebrationIcon sx={{ fontSize: 80, color: '#4CAF50' }} />
              </motion.div>
            </Box>
            <Typography variant="h4" fontWeight={700} color="#4CAF50" gutterBottom>
              🎉 Course Published Successfully!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Your course is now live and available to students worldwide. 
              You can manage it from your dashboard.
            </Typography>
            <Alert severity="success" sx={{ mb: 2 }}>
              <AlertTitle>What's Next?</AlertTitle>
              • Share your course link with potential students<br/>
              • Monitor your course analytics<br/>
              • Respond to student questions and feedback<br/>
              • Update content as needed
            </Alert>
          </motion.div>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            variant="contained"
            onClick={() => setShowSuccessDialog(false)}
            sx={{
              background: 'linear-gradient(135deg, #4CAF50 0%, #45A049 100%)',
              minWidth: 120
            }}
          >
            Go to Dashboard
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PreviewPublishStep; 