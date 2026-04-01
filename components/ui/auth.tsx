import { styled } from '@mui/material/styles';
import { Box, Typography, Button, TextField } from '@mui/material';
import { extendedPalette } from '@/theme';

export const AuthRoot = styled(Box)(() => ({
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0B0D17',
    position: 'relative',
    overflow: 'hidden',
}));

export const AuthCardWrapper = styled(Box)(({ theme }) => ({
    width: '100%',
    maxWidth: 440,
    padding: '40px',
    background: extendedPalette.glass.background,
    backdropFilter: 'blur(24px)',
    border: `1px solid ${extendedPalette.glass.border}`,
    borderRadius: '24px',
    boxShadow: extendedPalette.shadows.elevated,
    position: 'relative',
    zIndex: 1,
    [theme.breakpoints.down('sm')]: {
        padding: '24px',
        maxWidth: '90%',
        margin: '16px',
    },
}));

export const GradientBackgroundBlob = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'blobType',
})<{ blobType: 'top' | 'bottom' }>(({ blobType }) => ({
    position: 'absolute',
    width: blobType === 'top' ? 600 : 500,
    height: blobType === 'top' ? 600 : 500,
    borderRadius: '50%',
    background: blobType === 'top'
        ? 'radial-gradient(circle, rgba(108,92,231,0.12) 0%, transparent 60%)'
        : 'radial-gradient(circle, rgba(0,206,201,0.08) 0%, transparent 60%)',
    top: blobType === 'top' ? '-10%' : undefined,
    right: blobType === 'top' ? '-10%' : undefined,
    bottom: blobType === 'bottom' ? '-15%' : undefined,
    left: blobType === 'bottom' ? '-10%' : undefined,
    pointerEvents: 'none',
}));

export const AuthLogoWrapper = styled(Box)(() => ({
    width: 56,
    height: 56,
    borderRadius: '16px',
    background: extendedPalette.gradients.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    boxShadow: extendedPalette.shadows.glow,
}));
