import React from 'react';
import { Box, Grid, Card, CardContent, Typography, Avatar, Chip, Divider, Tooltip, Tabs, Tab, IconButton } from '@mui/material';
import { Instagram, Facebook, YouTube, Language, LocationOn, Male, Female, EmojiEvents, TrendingUp, BarChart, AccessTime, Tag, Public, Group, InsertChart, Favorite, Comment, Share, Visibility } from '@mui/icons-material';
import { PieChart, Pie, Cell, BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip, ResponsiveContainer } from 'recharts';
import { useParams } from 'react-router-dom';

// Mock data for a creator
const creator = {
  id: '1',
  name: 'Cathy Creator',
  bio: 'Lifestyle & Travel Influencer. Sharing my adventures and tips for a vibrant life!',
  avatar: '',
  platforms: [
    { name: 'Instagram', icon: <Instagram color="secondary" />, followers: 120000, growth: 8, engagement: 4.2 },
    { name: 'Facebook', icon: <Facebook color="primary" />, followers: 45000, growth: 2, engagement: 2.1 },
    { name: 'YouTube', icon: <YouTube color="error" />, followers: 80000, growth: 5, engagement: 3.5 },
  ],
  region: 'India',
  languages: [ { name: 'English', percent: 60 }, { name: 'Hindi', percent: 30 }, { name: 'Tamil', percent: 10 } ],
  geo: [ { country: 'India', percent: 70 }, { country: 'USA', percent: 15 }, { country: 'UK', percent: 10 }, { country: 'Other', percent: 5 } ],
  gender: [ { gender: 'Female', percent: 65 }, { gender: 'Male', percent: 35 } ],
  age: [ { group: '13-17', percent: 10 }, { group: '18-24', percent: 40 }, { group: '25-34', percent: 30 }, { group: '35+', percent: 20 } ],
  topPosts: [
    { id: 1, platform: 'Instagram', img: '', likes: 12000, comments: 800, shares: 200, date: '2024-05-01' },
    { id: 2, platform: 'YouTube', img: '', likes: 9000, comments: 600, shares: 150, date: '2024-04-20' },
    { id: 3, platform: 'Facebook', img: '', likes: 7000, comments: 400, shares: 100, date: '2024-04-10' },
  ],
  bestTimes: [
    { day: 'Mon', hour: '6PM', engagement: 4.5 },
    { day: 'Wed', hour: '8PM', engagement: 5.2 },
    { day: 'Fri', hour: '7PM', engagement: 4.8 },
  ],
  hashtags: [ { tag: '#travel', count: 120 }, { tag: '#lifestyle', count: 90 }, { tag: '#adventure', count: 70 } ],
  campaigns: [
    { brand: 'BrandX', logo: '', reach: 50000, engagement: 3.8, value: '$2,000' },
    { brand: 'BrandY', logo: '', reach: 30000, engagement: 4.1, value: '$1,200' },
  ],
  recentActivity: [
    { type: 'post', platform: 'Instagram', date: '2024-05-01', desc: 'Posted a new travel reel.' },
    { type: 'comment', platform: 'YouTube', date: '2024-04-28', desc: 'Replied to a fan comment.' },
    { type: 'story', platform: 'Instagram', date: '2024-04-25', desc: 'Shared a story from Goa.' },
  ],
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A020F0'];

const CreatorProfile: React.FC = () => {
  const { id } = useParams();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e1e2f 0%, #23234a 100%)',
        py: { xs: 3, md: 8 },
        px: { xs: 1, md: 0 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflowX: 'hidden',
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          width: '100%',
          maxWidth: 1200,
          mb: 6,
          borderRadius: 6,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          background: 'rgba(255,255,255,0.10)',
          backdropFilter: 'blur(16px)',
          border: '1.5px solid rgba(255,255,255,0.18)',
          p: { xs: 5, md: 8 },
          position: 'relative',
          overflow: 'visible',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Avatar, Name, Bio */}
        <Avatar
          src={creator.avatar}
          sx={{
            width: 120,
            height: 120,
            bgcolor: 'primary.main',
            fontSize: 48,
            boxShadow: '0 0 32px 8px #6C63FF55',
            border: '4px solid #fff',
            animation: 'pulseGlow 2.5s infinite',
            '@keyframes pulseGlow': {
              '0%': { boxShadow: '0 0 32px 8px #6C63FF55' },
              '50%': { boxShadow: '0 0 64px 16px #6C63FF99' },
              '100%': { boxShadow: '0 0 32px 8px #6C63FF55' },
            },
            mb: 3,
          }}
        >
          {creator.name.split(' ').map(n => n[0]).join('')}
        </Avatar>
        <Typography variant="h3" fontWeight={900} color="#fff" sx={{ letterSpacing: 1, mb: 1, textAlign: 'center' }}>
          {creator.name}
        </Typography>
        <Typography variant="h6" color="#cfd8dc" sx={{ mb: 4, fontWeight: 400, lineHeight: 1.5, textAlign: 'center', maxWidth: 600 }}>
          {creator.bio}
        </Typography>
        {/* Platform Badges */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 3,
            mb: 4,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {creator.platforms.map((p, i) => (
            <Chip
              key={p.name}
              icon={p.icon}
              label={p.name}
              color="default"
              size="medium"
              sx={{
                bgcolor: 'rgba(255,255,255,0.18)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '1.1rem',
                px: 3,
                py: 1.5,
                borderRadius: 2,
                boxShadow: '0 2px 8px #6C63FF33',
                border: '1px solid #6C63FF44',
                backdropFilter: 'blur(8px)',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.08)' },
              }}
            />
          ))}
        </Box>
        {/* Platform Stats */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
            gap: 4,
            width: '100%',
            maxWidth: 900,
            justifyContent: 'center',
          }}
        >
          {creator.platforms.map((p, i) => (
            <Box
              key={p.name}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                bgcolor: 'rgba(255,255,255,0.13)',
                borderRadius: 4,
                px: 4,
                py: 3,
                boxShadow: '0 2px 8px #6C63FF22',
                minWidth: 200,
                maxWidth: 260,
                mx: 'auto',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                {p.icon}
                <Typography color="#fff" fontWeight={800} sx={{ fontSize: '1.5rem', letterSpacing: 0.5 }}>{p.followers.toLocaleString()}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                <Chip icon={<Favorite fontSize="small" />} label={`${p.engagement}%`} color="success" size="small" sx={{ fontWeight: 700, bgcolor: 'rgba(255,255,255,0.18)', color: '#fff', px: 2, py: 1, borderRadius: 2 }} />
                <Chip icon={<TrendingUp fontSize="small" />} label={`+${p.growth}%`} color="primary" size="small" sx={{ fontWeight: 700, bgcolor: 'rgba(255,255,255,0.18)', color: '#fff', px: 2, py: 1, borderRadius: 2 }} />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
      {/* ...rest of your beautiful profile UI, analytics, cards, etc... */}
    </Box>
  );
};

export default CreatorProfile; 