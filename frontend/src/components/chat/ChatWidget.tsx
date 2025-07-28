import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Badge,
  Tooltip,
  Fade,
  Slide,
  Zoom,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Switch,
  styled,
  keyframes,
} from '@mui/material';
import {
  Chat as ChatIcon,
  Send as SendIcon,
  Close as CloseIcon,
  Minimize as MinimizeIcon,
  ExpandMore as ExpandMoreIcon,
  SmartToy as AIIcon,
  EmojiEmotions as EmojiIcon,
  AttachFile as AttachFileIcon,
  Mic as MicIcon,
  Schedule as ScheduleIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  KeyboardArrowUp as ArrowUpIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Futuristic animations
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(25, 118, 210, 0.5); }
  50% { box-shadow: 0 0 20px rgba(25, 118, 210, 0.8); }
  100% { box-shadow: 0 0 5px rgba(25, 118, 210, 0.5); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
`;

// Styled Components
const FloatingContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  zIndex: 1000,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
}));

const MinimizedChat = styled(motion.div)(({ theme }) => ({
  width: '70px',
  height: '70px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  animation: `${float} 3s ease-in-out infinite`,
  position: 'relative',
  '&:hover': {
    animation: `${pulse} 1s ease-in-out infinite`,
    boxShadow: '0 12px 40px rgba(31, 38, 135, 0.5)',
  },
}));

const ExpandedChat = styled(motion.div)(({ theme }) => ({
  width: '350px',
  height: '500px',
  borderRadius: '20px',
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  animation: `${glow} 2s ease-in-out infinite`,
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  padding: '16px 20px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderRadius: '20px 20px 0 0',
}));

const ChatMessages = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: '16px',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  background: 'rgba(255, 255, 255, 0.05)',
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '3px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '3px',
  },
}));

const MessageBubble = styled(motion.div)<{ isOwn: boolean }>(({ theme, isOwn }) => ({
  maxWidth: '80%',
  padding: '12px 16px',
  borderRadius: isOwn ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
  alignSelf: isOwn ? 'flex-end' : 'flex-start',
  background: isOwn 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    : 'rgba(255, 255, 255, 0.1)',
  color: isOwn ? 'white' : theme.palette.text.primary,
  backdropFilter: 'blur(10px)',
  border: `1px solid ${isOwn ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'}`,
  wordWrap: 'break-word',
  position: 'relative',
}));

const ChatInput = styled(Box)(({ theme }) => ({
  padding: '16px 20px',
  background: 'rgba(255, 255, 255, 0.05)',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  borderRadius: '0 0 20px 20px',
}));

const EmojiPicker = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  bottom: '100%',
  left: "50%",
  transform: "translateX(-50%)",
  minWidth: "140px",
  maxWidth: "180px",
  marginBottom: "8px",
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '12px',
  padding: '8px',
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '4px',
  zIndex: 1001,
  overflow: "hidden",
}));

const EmojiButton = styled(Button)(({ theme }) => ({
  minWidth: '32px',
  height: '32px',
  fontSize: '16px',
  borderRadius: '8px',
  background: 'rgba(255, 255, 255, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.2)',
    transform: 'scale(1.1)',
  },
}));

interface Message {
  id: string;
  text: string;
  sender: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  timestamp: Date;
  type: 'text' | 'file' | 'voice';
  fileUrl?: string;
  fileName?: string;
}

interface ChatWidgetProps {
  currentUser: {
    id: string;
    name: string;
    role: string;
  };
  otherUser: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  chatSettings: {
    canInitiate: boolean;
    canRespond: boolean;
    allowFileSharing: boolean;
    allowVoiceMessages: boolean;
    allowScheduledChats: boolean;
    maxDailyMessages?: number;
    requiresCourseEnrollment?: boolean;
    requiresLessonCompletion?: number;
  };
  onSendMessage: (message: string, type: 'text' | 'file' | 'voice') => void;
  onScheduleChat?: (scheduledTime: Date) => void;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({
  currentUser,
  otherUser,
  chatSettings,
  onSendMessage,
  onScheduleChat,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [dailyMessageCount, setDailyMessageCount] = useState(0);
  const [canSendMessage, setCanSendMessage] = useState(true);
  const [restrictionMessage, setRestrictionMessage] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [botEnabled, setBotEnabled] = useState(true);
  const [botName, setBotName] = useState('Support Bot');
  const [botAvatar, setBotAvatar] = useState('🤖');
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [workingHours, setWorkingHours] = useState({ start: '09:00', end: '18:00' });
  const [responseTime, setResponseTime] = useState('Immediate');
  const [autoAway, setAutoAway] = useState(10); // minutes
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Emoji list
  const emojis = ['😊', '😂', '❤️', '👍', '🎉', '🔥', '💯', '👏', '🙏', '😍', '🤔', '😅', '😎', '🤩', '😭', '😡', '😴', '🤗', '😇', '🥳', '🤠', '👻', '🤖', '👽', '💪', '🧠', '💡', '🎯', '🚀', '⭐', '🌟', '💫'];

  // Add a static list of common timezones
  const timezones = [
    'UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
    'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Moscow',
    'Asia/Kolkata', 'Asia/Shanghai', 'Asia/Tokyo', 'Asia/Singapore',
    'Australia/Sydney', 'Australia/Perth', 'Pacific/Auckland',
  ];

  // Simulate initial messages
  useEffect(() => {
    const initialMessages: Message[] = [
      {
        id: '1',
        text: 'Hello! How can I help you today? 👋',
        sender: otherUser,
        timestamp: new Date(Date.now() - 60000),
        type: 'text',
      },
      {
        id: '2',
        text: 'I have a question about the course content 🤔',
        sender: currentUser,
        timestamp: new Date(Date.now() - 30000),
        type: 'text',
      },
    ];
    setMessages(initialMessages);
  }, [currentUser, otherUser]);

  // Check permissions
  useEffect(() => {
    let canSend = true;
    let message = '';

    if (messages.length === 0 && !chatSettings.canInitiate) {
      canSend = false;
      message = 'You cannot initiate conversations.';
    }

    if (chatSettings.maxDailyMessages && dailyMessageCount >= chatSettings.maxDailyMessages) {
      canSend = false;
      message = `Daily limit: ${chatSettings.maxDailyMessages} messages.`;
    }

    if (chatSettings.requiresCourseEnrollment) {
      const isEnrolled = true; // Simulate check
      if (!isEnrolled) {
        canSend = false;
        message = 'Course enrollment required.';
      }
    }

    if (chatSettings.requiresLessonCompletion && chatSettings.requiresLessonCompletion > 0) {
      const completedLessons = 1; // Simulate check
      if (completedLessons < chatSettings.requiresLessonCompletion) {
        canSend = false;
        message = `Complete ${chatSettings.requiresLessonCompletion} lessons first.`;
      }
    }

    setCanSendMessage(canSend);
    setRestrictionMessage(message);
  }, [chatSettings, dailyMessageCount, messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !canSendMessage) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: currentUser,
      timestamp: new Date(),
      type: 'text',
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setDailyMessageCount(prev => prev + 1);
    onSendMessage(newMessage, 'text');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Element;
    if (showEmojiPicker && !target.closest('.emoji-picker') && !target.closest('.emoji-button')) {
      setShowEmojiPicker(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && showEmojiPicker) {
      setShowEmojiPicker(false);
    }
  };

  useEffect(() => {
    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showEmojiPicker]);

  const toggleChat = () => {
    setIsExpanded(!isExpanded);
    setShowEmojiPicker(false);
  };

  return (
    <FloatingContainer>
      <AnimatePresence>
        {isExpanded ? (
          <ExpandedChat
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <ChatHeader>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <CheckCircleIcon sx={{ fontSize: 12, color: '#4caf50' }} />
                  }
                >
                  <Avatar 
                    src={otherUser.avatar}
                    sx={{ 
                      width: 32, 
                      height: 32,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    }}
                  >
                    {otherUser.name.charAt(0)}
                  </Avatar>
                </Badge>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Welcome! {currentUser.name}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {otherUser.role.charAt(0).toUpperCase() + otherUser.role.slice(1)}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Settings">
                  <IconButton size="small" onClick={() => setSettingsOpen(true)} sx={{ color: 'white' }}>
                    <SettingsIcon />
                  </IconButton>
                </Tooltip>
                {chatSettings.allowScheduledChats && (
                  <Tooltip title="Schedule Chat">
                    <IconButton size="small" sx={{ color: 'white' }}>
                      <ScheduleIcon />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Minimize">
                  <IconButton size="small" onClick={toggleChat} sx={{ color: 'white' }}>
                    <MinimizeIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </ChatHeader>

            <ChatMessages>
              {messages.map((message, index) => (
                <MessageBubble
                  key={message.id}
                  isOwn={message.sender.id === currentUser.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Typography variant="body2" sx={{ fontSize: '14px' }}>
                    {message.text}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      opacity: 0.7, 
                      display: 'block', 
                      mt: 0.5,
                      fontSize: '10px'
                    }}
                  >
                    {message.timestamp.toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    }) + ' ' + message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </Typography>
                </MessageBubble>
              ))}
              <div ref={messagesEndRef} />
            </ChatMessages>

            {!canSendMessage && (
              <Alert 
                severity="warning" 
                sx={{ 
                  mx: 2, 
                  mb: 1,
                  fontSize: '12px',
                  '& .MuiAlert-message': { fontSize: '12px' }
                }}
              >
                {restrictionMessage}
              </Alert>
            )}

            <ChatInput>
              <Box sx={{ position: 'relative', flex: 1 }}>
                <TextField
                  fullWidth
                  multiline
                  maxRows={3}
                  placeholder={canSendMessage ? "Type your message..." : "You cannot send messages"}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={!canSendMessage}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '20px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      '&:hover': {
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                      },
                      '&.Mui-focused': {
                        border: '1px solid rgba(102, 126, 234, 0.5)',
                      },
                    },
                    '& .MuiInputBase-input': {
                      fontSize: '14px',
                      color: 'black',
                      '&::placeholder': {
                        color: 'rgba(0, 0, 0, 0.6)',
                        opacity: 1,
                      },
                    },
                  }}
                />
                <AnimatePresence>
                  {showEmojiPicker && (
                    <EmojiPicker
                      className="emoji-picker"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {emojis.map((emoji, index) => (
                        <EmojiButton
                          key={index}
                          onClick={() => handleEmojiClick(emoji)}
                          sx={{ fontSize: '16px' }}
                        >
                          {emoji}
                        </EmojiButton>
                      ))}
                    </EmojiPicker>
                  )}
                </AnimatePresence>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Emoji">
                  <IconButton
                    className="emoji-button"
                    size="small"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    sx={{ 
                      color: showEmojiPicker ? '#FFA500' : '#FFD700',
                      background: showEmojiPicker ? 'rgba(255, 165, 0, 0.1)' : 'transparent',
                      borderRadius: '8px',
                      '&:hover': { 
                        color: '#FFA500',
                        background: 'rgba(255, 165, 0, 0.1)'
                      }
                    }}
                  >
                    <EmojiIcon />
                  </IconButton>
                </Tooltip>
                {chatSettings.allowFileSharing && (
                  <Tooltip title="Attach File">
                    <IconButton
                      size="small"
                      disabled={!canSendMessage}
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&:hover': { color: 'white' }
                      }}
                    >
                      <AttachFileIcon />
                    </IconButton>
                  </Tooltip>
                )}
                {chatSettings.allowVoiceMessages && (
                  <Tooltip title="Voice Message">
                    <IconButton
                      size="small"
                      disabled={!canSendMessage}
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&:hover': { color: 'white' }
                      }}
                    >
                      <MicIcon />
                    </IconButton>
                  </Tooltip>
                )}
                <IconButton
                  color="primary"
                  onClick={handleSendMessage}
                  disabled={!canSendMessage}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    },
                    '&:disabled': {
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'rgba(255, 255, 255, 0.3)',
                    },
                  }}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </ChatInput>
          </ExpandedChat>
        ) : (
          <Box sx={{ position: 'relative' }}>
            <MinimizedChat
              onClick={toggleChat}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <AIIcon sx={{ color: 'white', fontSize: 28 }} />
            </MinimizedChat>
            {messages.length > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  border: '2px solid white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  animation: `${pulse} 2s ease-in-out infinite`,
                }}
              >
                {messages.length}
              </Box>
            )}
          </Box>
        )}
      </AnimatePresence>

      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Chat Settings</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Switch checked={botEnabled} onChange={e => setBotEnabled(e.target.checked)} />
            <Typography sx={{ ml: 1 }}>Enable AI Bot</Typography>
          </Box>
          <TextField
            label="Bot Name"
            value={botName}
            onChange={e => setBotName(e.target.value)}
            fullWidth
            margin="dense"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Bot Avatar (emoji or URL)"
            value={botAvatar}
            onChange={e => setBotAvatar(e.target.value)}
            fullWidth
            margin="dense"
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
            <InputLabel>Timezone</InputLabel>
            <Select
              value={timezone}
              label="Timezone"
              onChange={e => setTimezone(e.target.value)}
            >
              {timezones.map(tz => (
                <MenuItem key={tz} value={tz}>{tz}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Working Start"
              type="time"
              value={workingHours.start}
              onChange={e => setWorkingHours({ ...workingHours, start: e.target.value })}
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 300 }}
              fullWidth
            />
            <TextField
              label="Working End"
              type="time"
              value={workingHours.end}
              onChange={e => setWorkingHours({ ...workingHours, end: e.target.value })}
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 300 }}
              fullWidth
            />
          </Box>
          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
            <InputLabel>Response Time</InputLabel>
            <Select
              value={responseTime}
              label="Response Time"
              onChange={e => setResponseTime(e.target.value)}
            >
              <MenuItem value="Immediate">Immediate</MenuItem>
              <MenuItem value="Within 1 hour">Within 1 hour</MenuItem>
              <MenuItem value="Within 24 hours">Within 24 hours</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Auto-away (minutes)"
            type="number"
            value={autoAway}
            onChange={e => setAutoAway(Number(e.target.value))}
            fullWidth
            margin="dense"
            inputProps={{ min: 1, max: 120 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </FloatingContainer>
  );
};

export default ChatWidget; 