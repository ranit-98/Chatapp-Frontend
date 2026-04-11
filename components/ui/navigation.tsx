import { styled } from '@mui/material/styles';
import { Box, IconButton, Badge, Avatar } from '@mui/material';
import { extendedPalette } from '@/theme';

export const RailRoot = styled(Box)(({ theme }) => ({
  width: 72,
  minWidth: 72,
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingTop: 16,
  paddingBottom: 16,
  background: extendedPalette.gradients.sidebar,
  borderRight: `1px solid ${extendedPalette.glass.border}`,
  zIndex: 1000,
  [theme.breakpoints.down('md')]: {
    width: '100%',
    height: 64,
    minWidth: '100%',
    flexDirection: 'row',
    padding: '0 16px',
    borderRight: 'none',
    borderTop: `1px solid ${extendedPalette.glass.border}`,
    justifyContent: 'space-between',
    bottom: 0,
    position: 'fixed',
  },
}));

export const BrandLogoWrapper = styled(Box)(({ theme }) => ({
  width: 44,
  height: 44,
  borderRadius: 14,
  background: extendedPalette.gradients.primary,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 32,
  boxShadow: extendedPalette.shadows.glow,
  cursor: 'pointer',
  transition: 'transform 0.2s ease',
  '&:hover': { transform: 'scale(1.05)' },
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

export const NavListWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  flex: 1,
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
}));

export const NavItemContainer = styled(Box)(() => ({
  position: 'relative',
}));

export const IndicatorLine = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: -8,
  top: '50%',
  transform: 'translateY(-50%)',
  width: 4,
  height: 24,
  borderRadius: '0 4px 4px 0',
  background: extendedPalette.gradients.primary,
  transition: 'all 0.3s ease',
  [theme.breakpoints.down('md')]: {
    left: '50%',
    bottom: -24,
    top: 'auto',
    transform: 'translateX(-50%)',
    width: 24,
    height: 4,
    borderRadius: '4px 4px 0 0',
  },
}));

export const CustomNavButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive: boolean }>(({ theme, isActive }) => ({
  width: 48,
  height: 48,
  borderRadius: 14,
  color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
  background: isActive ? 'rgba(108, 92, 231, 0.12)' : 'transparent',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: isActive ? 'rgba(108, 92, 231, 0.16)' : 'rgba(255, 255, 255, 0.05)',
    color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
  },
}));

export const StyledNavBadge = styled(Badge)(() => ({
  '& .MuiBadge-badge': {
    fontSize: '0.65rem',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
  },
}));

export const BottomActionsStack = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 8,
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

export const UserAvatarWrapper = styled(Avatar)(() => ({
  width: 40,
  height: 40,
  background: extendedPalette.gradients.accent,
  fontSize: '0.875rem',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'transform 0.2s ease',
  '&:hover': { transform: 'scale(1.08)' },
}));
