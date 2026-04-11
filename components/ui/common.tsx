import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import { extendedPalette } from '@/theme';

export const GlassContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'hoverable' && prop !== 'clickable',
})<{ hoverable?: boolean; clickable?: boolean }>(({ hoverable, clickable }) => ({
  background: extendedPalette.glass.background,
  backdropFilter: 'blur(16px)',
  border: `1px solid ${extendedPalette.glass.border}`,
  borderRadius: '16px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: clickable ? 'pointer' : 'default',
  ...(hoverable && {
    '&:hover': {
      borderColor: 'rgba(108, 92, 231, 0.3)',
      boxShadow: extendedPalette.shadows.card,
      transform: 'translateY(-2px)',
    },
  }),
}));

export const FlexBetween = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const FlexCenter = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const EmptyStateRoot = styled(Box)(() => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  background: extendedPalette.gradients.surface,
  position: 'relative',
  overflow: 'hidden',
}));

export const PulsingIcon = styled(Box)(() => ({
  width: 100,
  height: 100,
  borderRadius: '28px',
  background: extendedPalette.gradients.primary,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 32,
  boxShadow: extendedPalette.shadows.glow,
  position: 'relative',
  animation: 'floatIcon 4s ease-in-out infinite',
  '@keyframes floatIcon': {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-8px)' },
  },
}));

export const EncryptionTag = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '8px 20px',
  borderRadius: 20,
  background: 'rgba(255, 255, 255, 0.03)',
  border: `1px solid ${extendedPalette.glass.border}`,
}));

export const ScrollBar = styled(Box)({
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(108, 92, 231, 0.2)',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: 'rgba(108, 92, 231, 0.4)',
  },
});
