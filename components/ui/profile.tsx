import { styled } from '@mui/material/styles';
import { Box, Typography, Avatar, IconButton } from '@mui/material';
import { extendedPalette } from '@/theme';

export const ProfileRoot = styled(Box)(({ theme }) => ({
  width: 390,
  minWidth: 390,
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  background: extendedPalette.gradients.sidebar,
  borderRight: `1px solid ${extendedPalette.glass.border}`,
  overflowY: 'auto',
  '&::-webkit-scrollbar': { width: '4px' },
  '&::-webkit-scrollbar-thumb': { background: 'rgba(108, 92, 231, 0.1)', borderRadius: '10px' },
  [theme.breakpoints.down('md')]: {
    width: '100%',
    minWidth: '100%',
    paddingBottom: 64, // Height of bottom navigation
  },
}));

export const AvatarSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '32px 0',
  position: 'relative',
}));

export const AvatarBackgroundGlow = styled(Box)(() => ({
  position: 'absolute',
  width: 200,
  height: 200,
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(108,92,231,0.12) 0%, transparent 70%)',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  pointerEvents: 'none',
}));

export const ProfileAvatar = styled(Avatar)(() => ({
  width: 100,
  height: 100,
  background: extendedPalette.gradients.accent,
  fontSize: '2rem',
  fontWeight: 700,
  border: '3px solid rgba(108, 92, 231, 0.4)',
  boxShadow: extendedPalette.shadows.glow,
}));

export const AvatarEditBtn = styled(IconButton)(() => ({
  position: 'absolute',
  bottom: -4,
  right: -4,
  width: 32,
  height: 32,
  background: extendedPalette.gradients.primary,
  color: 'white',
  '&:hover': {
    background: extendedPalette.gradients.primary,
    filter: 'brightness(1.1)',
  },
  boxShadow: extendedPalette.shadows.card,
}));

export const InfoRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 16,
});

export const InfoIconWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'bg',
})<{ bg: string }>(({ bg }) => ({
  width: 40,
  height: 40,
  borderRadius: '12px',
  background: bg,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}));
