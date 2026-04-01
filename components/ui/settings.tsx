import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { extendedPalette } from '@/theme';

export const SettingsRoot = styled(Box)(({ theme }) => ({
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

export const SettingIconWrapper = styled(Box, {
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

export const SettingActionRow = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'danger' && prop !== 'clickable',
})<{ danger?: boolean; clickable?: boolean }>(({ danger, clickable }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: '12px 0',
    cursor: clickable ? 'pointer' : 'default',
    borderRadius: 8,
    transition: 'background 0.2s ease',
    ...(clickable && {
        '&:hover': {
            background: danger ? 'rgba(255, 107, 107, 0.05)' : 'rgba(255, 255, 255, 0.02)',
        },
    }),
}));

export const SettingTextGroup = styled(Box)({
    flex: 1,
});

export const SectionLabel = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: '0.65rem',
    textTransform: 'uppercase',
    fontWeight: 700,
    letterSpacing: 1,
    marginBottom: 12,
    marginTop: 24,
    paddingLeft: 4,
}));
