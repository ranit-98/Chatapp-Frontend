import { styled } from '@mui/material/styles';
import { Box, Typography, Avatar, IconButton } from '@mui/material';
import { extendedPalette } from '@/theme';

export const CallsRoot = styled(Box)(({ theme }) => ({
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

export const CallItemWrapper = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: '12px 16px',
    margin: '0 8px',
    borderRadius: 12,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
        background: 'rgba(255, 255, 255, 0.03)',
    },
}));

export const CallAvatar = styled(Avatar, {
    shouldForwardProp: (prop) => prop !== 'bg',
})<{ bg: string }>(({ bg }) => ({
    width: 48,
    height: 48,
    background: bg,
    fontSize: '0.875rem',
    fontWeight: 700,
}));

export const CallInfo = styled(Box)({
    flex: 1,
    minWidth: 0,
});

export const CallActions = styled(Box)({
    display: 'flex',
    gap: 4,
});

export const QuickDialAvatar = styled(Avatar, {
    shouldForwardProp: (prop) => prop !== 'bg',
})<{ bg: string }>(({ bg }) => ({
    width: 52,
    height: 52,
    background: bg,
    fontSize: '0.875rem',
    fontWeight: 700,
    transition: 'transform 0.2s ease',
    '&:hover': { transform: 'scale(1.08)' },
}));
