import { styled } from '@mui/material/styles';
import { Box, Typography, Avatar, IconButton } from '@mui/material';
import { extendedPalette } from '@/theme';

// ── Left Side Panel Wrappers ───────────────────────────────

export const SidePanelRoot = styled(Box)(({ theme }) => ({
  width: 390,
  minWidth: 390,
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  background: extendedPalette.gradients.sidebar,
  borderRight: `1px solid ${extendedPalette.glass.border}`,
  [theme.breakpoints.down('md')]: {
    width: '100%',
    minWidth: '100%',
    paddingBottom: 64, // Height of bottom navigation
  },
}));

export const SectionTitleWrapper = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 20,
}));

export const ScrollArea = styled(Box)(() => ({
  flex: 1,
  overflowY: 'auto',
  overflowX: 'hidden',
  paddingBottom: 16,
  '&::-webkit-scrollbar': { width: '4px' },
  '&::-webkit-scrollbar-thumb': { background: 'rgba(108, 92, 231, 0.1)', borderRadius: '10px' },
}));

// Using ScrollBar and Flex components from common.tsx

// ── Conversation List Wrappers ─────────────────────────────

export const ConversationItemWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive: boolean }>(({ isActive }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '12px 16px',
  margin: '0 8px',
  borderRadius: 12,
  cursor: 'pointer',
  position: 'relative',
  transition: 'all 0.2s ease',
  background: isActive ? 'rgba(108, 92, 231, 0.08)' : 'transparent',
  borderLeft: isActive ? '3px solid' : '3px solid transparent',
  borderLeftColor: isActive ? '#6C5CE7' : 'transparent',
  '&:hover': {
    background: isActive ? 'rgba(108, 92, 231, 0.12)' : 'rgba(255, 255, 255, 0.03)',
  },
}));

export const ActiveConversationAvatar = styled(Avatar, {
  shouldForwardProp: (prop) => prop !== 'gradient' && prop !== 'isActive',
})<{ gradient: string; isActive: boolean }>(({ gradient, isActive }) => ({
  width: 48,
  height: 48,
  background: gradient,
  fontSize: '0.875rem',
  fontWeight: 700,
  border: isActive ? '2px solid rgba(108, 92, 231, 0.5)' : '2px solid transparent',
  transition: 'border-color 0.2s ease',
}));

export const TimeTextWrapper = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isRead',
})<{ isRead?: boolean }>(({ theme, isRead }) => ({
  color: isRead ? theme.palette.text.secondary : theme.palette.primary.light,
  fontSize: '0.68rem',
  fontWeight: isRead ? 400 : 600,
  flexShrink: 0,
}));

// ── Message Bubble Wrappers ────────────────────────────────

export const MessageRow = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isOwn',
})<{ isOwn: boolean }>(({ theme, isOwn }) => ({
  display: 'flex',
  justifyContent: isOwn ? 'flex-end' : 'flex-start',
  marginBottom: 8,
  padding: '0 16px',
  position: 'relative',
  gap: 12,
  [theme.breakpoints.down('sm')]: {
    padding: '0 8px',
    gap: 8,
  },
}));

export const BubbleContent = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isOwn',
})<{ isOwn: boolean }>(({ theme, isOwn }) => ({
  position: 'relative',
  padding: '10px 16px',
  borderRadius: isOwn ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
  background: isOwn ? extendedPalette.chat.outgoing : extendedPalette.chat.incoming,
  border: `1px solid ${isOwn ? extendedPalette.chat.outgoingBorder : extendedPalette.chat.incomingBorder}`,
  maxWidth: '75%',
  [theme.breakpoints.down('md')]: {
    maxWidth: '85%',
  },
  transition: 'background 0.2s ease',
  '&:hover': {
    background: isOwn ? 'rgba(108, 92, 231, 0.2)' : 'rgba(255, 255, 255, 0.06)',
  },
}));

export const MessageHoverActions = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isVisible' && prop !== 'isOwn',
})<{ isVisible: boolean; isOwn: boolean }>(({ isVisible, isOwn }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  opacity: isVisible ? 1 : 0,
  visibility: isVisible ? 'visible' : 'hidden',
  transition: 'all 0.2s ease',
  position: 'absolute',
  top: -30,
  [isOwn ? 'right' : 'left']: 0,
  zIndex: 10,
  background: 'rgba(18, 21, 42, 0.8)',
  backdropFilter: 'blur(8px)',
  padding: '4px 8px',
  borderRadius: '10px',
  border: '1px solid rgba(255, 255, 255, 0.05)',
}));

// ── Media & Special Message Types ──────────────────────────

export const ImageWrapper = styled('img')(() => ({
  maxWidth: '100%',
  maxHeight: 300,
  borderRadius: 12,
  display: 'block',
  objectFit: 'contain',
  cursor: 'pointer',
  background: 'rgba(0,0,0,0.1)',
}));

export const FileMessageContainer = styled('a')(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '10px 14px',
  borderRadius: 8,
  background: 'rgba(108, 92, 231, 0.08)',
  border: '1px solid rgba(108, 92, 231, 0.2)',
  textDecoration: 'none',
  color: 'inherit',
  minWidth: 180,
  '&:hover': { background: 'rgba(108, 92, 231, 0.15)' },
}));

export const AudioContainer = styled(Box)(() => ({
  minWidth: 260,
  padding: '4px 0',
  '& audio': {
    width: '100%',
    height: 36,
    accentColor: '#6C5CE7',
  },
}));

export const ReplyContainer = styled(Box)(() => ({
  marginBottom: 4,
  padding: '6px 12px',
  borderRadius: '12px 12px 12px 0',
  background: 'rgba(108, 92, 231, 0.12)',
  borderLeft: '4px solid #6C5CE7',
  maxWidth: '100%',
}));

export const ReactionChip = styled(Box)(() => ({
  cursor: 'pointer',
  padding: '2px 8px',
  borderRadius: 10,
  background: 'rgba(18, 21, 42, 0.95)',
  border: '1px solid rgba(108, 92, 231, 0.25)',
  fontSize: '0.8rem',
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  '&:hover': { border: '1px solid rgba(108, 92, 231, 0.6)', transform: 'translateY(-1px)' },
  transition: 'all 0.2s',
}));

// ── Input & Composer ───────────────────────────────────────

export const InputRoot = styled(Box)(() => ({
  padding: '16px 24px',
  borderTop: `1px solid ${extendedPalette.glass.border}`,
  background: 'rgba(18, 21, 42, 0.65)',
  backdropFilter: 'blur(16px)',
}));

export const ComposerWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isFocused',
})<{ isFocused: boolean }>(({ isFocused }) => ({
  display: 'flex',
  alignItems: 'flex-end',
  gap: 12,
  padding: '10px 14px',
  borderRadius: 20,
  background: isFocused ? 'rgba(108, 92, 231, 0.05)' : 'rgba(255, 255, 255, 0.03)',
  border: `1px solid ${isFocused ? 'rgba(108, 92, 231, 0.3)' : 'rgba(255,255,255,0.06)'}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
}));

export const ReplyPreviewBar = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 16px',
  marginBottom: 10,
  background: 'rgba(108, 92, 231, 0.08)',
  borderLeft: '4px solid #6C5CE7',
  borderRadius: 8,
}));

export const RecordingOverlay = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  flex: 1,
  padding: '0 8px',
}));

export const WaveformBar = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'index',
})<{ index: number }>(({ index }) => ({
  width: 3,
  height: `${8 + Math.abs(Math.sin(index * 0.9)) * 16}px`,
  background: 'rgba(108, 92, 231, 0.5)',
  borderRadius: 2,
  animation: `waveBar 0.8s ${index * 0.05}s infinite alternate ease-in-out`,
  '@keyframes waveBar': {
    '0%': { transform: 'scaleY(0.4)', opacity: 0.3 },
    '100%': { transform: 'scaleY(1.2)', opacity: 1 },
  },
}));

// ── Chat View Wrappers ─────────────────────────────────────

export const ChatViewRoot = styled(Box)(() => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  position: 'relative',
  background: extendedPalette.gradients.surface,
}));

export const MainHeaderWrapper = styled(Box)(() => ({
  padding: '12px 24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: `1px solid ${extendedPalette.glass.border}`,
  background: 'rgba(18, 21, 42, 0.6)',
  backdropFilter: 'blur(12px)',
  zIndex: 10,
}));

export const PreviewStage = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '10px 14px',
  marginBottom: 10,
  background: 'rgba(108, 92, 231, 0.08)',
  borderRadius: 12,
  border: '1px solid rgba(108, 92, 231, 0.15)',
}));

export const PreviewImage = styled('img')(() => ({
  width: 56,
  height: 56,
  borderRadius: 8,
  objectFit: 'cover',
  border: '1px solid rgba(255,255,255,0.1)',
}));
