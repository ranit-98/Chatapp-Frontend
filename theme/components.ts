// ─────────────────────────────────────────────────────────────
//  Theme Component Overrides – MUI Component Customizations
//  Global style overrides for consistent look & feel.
// ─────────────────────────────────────────────────────────────

import { Components, Theme } from '@mui/material/styles';
import { extendedPalette } from './palette';

export const components: Components<Theme> = {
    MuiCssBaseline: {
        styleOverrides: {
            '*': {
                margin: 0,
                padding: 0,
                boxSizing: 'border-box',
            },
            'html, body': {
                height: '100%',
                scrollBehavior: 'smooth',
            },
            body: {
                overflowX: 'hidden',
            },
            '::-webkit-scrollbar': {
                width: '6px',
            },
            '::-webkit-scrollbar-track': {
                background: 'transparent',
            },
            '::-webkit-scrollbar-thumb': {
                background: 'rgba(108, 92, 231, 0.3)',
                borderRadius: '3px',
            },
            '::-webkit-scrollbar-thumb:hover': {
                background: 'rgba(108, 92, 231, 0.5)',
            },
        },
    },

    MuiButton: {
        defaultProps: {
            disableElevation: true,
            disableRipple: false,
        },
        styleOverrides: {
            root: {
                borderRadius: 12,
                padding: '10px 24px',
                fontWeight: 600,
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            },
            contained: {
                background: extendedPalette.gradients.primary,
                '&:hover': {
                    background: extendedPalette.gradients.primary,
                    filter: 'brightness(1.1)',
                    transform: 'translateY(-1px)',
                    boxShadow: extendedPalette.shadows.glow,
                },
            },
            outlined: {
                borderColor: 'rgba(108, 92, 231, 0.4)',
                '&:hover': {
                    borderColor: '#6C5CE7',
                    background: 'rgba(108, 92, 231, 0.08)',
                },
            },
            text: {
                '&:hover': {
                    background: 'rgba(108, 92, 231, 0.08)',
                },
            },
        },
    },

    MuiTextField: {
        defaultProps: {
            variant: 'outlined',
            fullWidth: true,
        },
        styleOverrides: {
            root: {
                '& .MuiOutlinedInput-root': {
                    borderRadius: 12,
                    background: 'rgba(255, 255, 255, 0.03)',
                    transition: 'all 0.2s ease',
                    '& fieldset': {
                        borderColor: 'rgba(138, 141, 163, 0.15)',
                        transition: 'border-color 0.2s ease',
                    },
                    '&:hover fieldset': {
                        borderColor: 'rgba(108, 92, 231, 0.4)',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: '#6C5CE7',
                        borderWidth: '1.5px',
                    },
                    '&.Mui-focused': {
                        boxShadow: '0 0 0 3px rgba(108, 92, 231, 0.1)',
                    },
                },
            },
        },
    },

    MuiPaper: {
        defaultProps: {
            elevation: 0,
        },
        styleOverrides: {
            root: {
                backgroundImage: 'none',
                borderRadius: 16,
            },
        },
    },

    MuiCard: {
        styleOverrides: {
            root: {
                borderRadius: 16,
                border: `1px solid ${extendedPalette.glass.border}`,
                background: extendedPalette.glass.background,
                backdropFilter: 'blur(12px)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    borderColor: 'rgba(108, 92, 231, 0.3)',
                    boxShadow: extendedPalette.shadows.card,
                },
            },
        },
    },

    MuiAvatar: {
        styleOverrides: {
            root: {
                border: '2px solid rgba(108, 92, 231, 0.3)',
                fontWeight: 600,
            },
        },
    },

    MuiChip: {
        styleOverrides: {
            root: {
                borderRadius: 8,
                fontWeight: 500,
            },
            filled: {
                background: 'rgba(108, 92, 231, 0.15)',
                color: '#A29BFE',
                '&:hover': {
                    background: 'rgba(108, 92, 231, 0.25)',
                },
            },
        },
    },

    MuiIconButton: {
        styleOverrides: {
            root: {
                borderRadius: 12,
                transition: 'all 0.2s ease',
                '&:hover': {
                    background: 'rgba(108, 92, 231, 0.1)',
                    transform: 'scale(1.05)',
                },
            },
        },
    },

    MuiTooltip: {
        defaultProps: {
            arrow: true,
        },
        styleOverrides: {
            tooltip: {
                background: 'rgba(18, 21, 42, 0.95)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 8,
                fontSize: '0.75rem',
                padding: '6px 12px',
            },
            arrow: {
                color: 'rgba(18, 21, 42, 0.95)',
            },
        },
    },

    MuiDivider: {
        styleOverrides: {
            root: {
                borderColor: 'rgba(138, 141, 163, 0.1)',
            },
        },
    },

    MuiBadge: {
        styleOverrides: {
            dot: {
                width: 10,
                height: 10,
                borderRadius: '50%',
                border: '2px solid #12152A',
            },
        },
    },

    MuiListItemButton: {
        styleOverrides: {
            root: {
                borderRadius: 12,
                margin: '2px 8px',
                padding: '10px 12px',
                transition: 'all 0.2s ease',
                '&:hover': {
                    background: extendedPalette.glass.hover,
                },
                '&.Mui-selected': {
                    background: extendedPalette.glass.active,
                    borderLeft: '3px solid #6C5CE7',
                    '&:hover': {
                        background: 'rgba(108, 92, 231, 0.16)',
                    },
                },
            },
        },
    },

    MuiDrawer: {
        styleOverrides: {
            paper: {
                background: extendedPalette.gradients.sidebar,
                borderRight: `1px solid ${extendedPalette.glass.border}`,
            },
        },
    },

    MuiDialog: {
        styleOverrides: {
            paper: {
                background: '#12152A',
                border: `1px solid ${extendedPalette.glass.border}`,
                borderRadius: 20,
                backdropFilter: 'blur(20px)',
            },
        },
    },

    MuiMenu: {
        styleOverrides: {
            paper: {
                background: 'rgba(18, 21, 42, 0.95)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${extendedPalette.glass.border}`,
                borderRadius: 12,
            },
        },
    },

    MuiMenuItem: {
        styleOverrides: {
            root: {
                borderRadius: 8,
                margin: '2px 6px',
                padding: '8px 12px',
                transition: 'all 0.15s ease',
                '&:hover': {
                    background: 'rgba(108, 92, 231, 0.1)',
                },
            },
        },
    },

    MuiTab: {
        styleOverrides: {
            root: {
                textTransform: 'none',
                fontWeight: 500,
                minHeight: 44,
                borderRadius: '10px 10px 0 0',
            },
        },
    },

    MuiSwitch: {
        styleOverrides: {
            root: {
                padding: 7,
            },
            thumb: {
                width: 18,
                height: 18,
            },
            track: {
                borderRadius: 12,
                opacity: 0.3,
            },
        },
    },
};
