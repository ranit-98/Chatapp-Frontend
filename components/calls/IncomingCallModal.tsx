// ─────────────────────────────────────────────────────────────
//  IncomingCallModal – Full-screen Call UI Overlay
//  Shows incoming/active call with user info and controls.
// ─────────────────────────────────────────────────────────────

'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CallEndRoundedIcon from '@mui/icons-material/CallEndRounded';
import CallRoundedIcon from '@mui/icons-material/CallRounded';
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded';
import MicOffRoundedIcon from '@mui/icons-material/MicOffRounded';
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded';
import { extendedPalette } from '@/theme';
import { User } from '@/lib/mock-data';

interface IncomingCallModalProps {
    user: User;
    callType: 'audio' | 'video';
    onAccept: () => void;
    onReject: () => void;
}

export default function IncomingCallModal({ user, callType, onAccept, onReject }: IncomingCallModalProps) {
    return (
        <Box
            sx={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(11, 13, 23, 0.95)',
                backdropFilter: 'blur(30px)',
            }}
        >
            {/* Animated Ring Effect */}
            {[0, 1, 2].map((i) => (
                <Box
                    key={i}
                    sx={{
                        position: 'absolute',
                        width: 200 + i * 60,
                        height: 200 + i * 60,
                        borderRadius: '50%',
                        border: '1px solid rgba(108, 92, 231, 0.1)',
                        animation: `callRipple 2.5s ease-out infinite`,
                        animationDelay: `${i * 0.5}s`,
                        '@keyframes callRipple': {
                            '0%': {
                                transform: 'scale(0.8)',
                                opacity: 0.6,
                            },
                            '100%': {
                                transform: 'scale(1.5)',
                                opacity: 0,
                            },
                        },
                    }}
                />
            ))}

            {/* User Avatar */}
            <Box sx={{ position: 'relative', mb: 4 }}>
                <Avatar
                    sx={{
                        width: 120,
                        height: 120,
                        background: extendedPalette.gradients.accent,
                        fontSize: '2.5rem',
                        fontWeight: 700,
                        border: '3px solid rgba(108, 92, 231, 0.4)',
                        boxShadow: extendedPalette.shadows.glow,
                    }}
                >
                    {user.name.split(' ').map((n) => n[0]).join('')}
                </Avatar>
            </Box>

            {/* Call Info */}
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {user.name}
            </Typography>
            <Typography
                variant="body1"
                sx={{
                    color: 'text.secondary',
                    mb: 6,
                    animation: 'fadeInOut 2s ease-in-out infinite',
                    '@keyframes fadeInOut': {
                        '0%, 100%': { opacity: 0.5 },
                        '50%': { opacity: 1 },
                    },
                }}
            >
                Incoming {callType === 'video' ? 'Video' : 'Voice'} Call...
            </Typography>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {/* Reject */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                    <Tooltip title="Decline">
                        <IconButton
                            onClick={onReject}
                            sx={{
                                width: 64,
                                height: 64,
                                background: 'rgba(255, 107, 107, 0.15)',
                                border: '2px solid rgba(255, 107, 107, 0.3)',
                                color: '#FF6B6B',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    background: 'rgba(255, 107, 107, 0.25)',
                                    transform: 'scale(1.1)',
                                },
                            }}
                        >
                            <CallEndRoundedIcon sx={{ fontSize: 28 }} />
                        </IconButton>
                    </Tooltip>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Decline
                    </Typography>
                </Box>

                {/* Mute */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                    <Tooltip title="Mute & Accept">
                        <IconButton
                            sx={{
                                width: 52,
                                height: 52,
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: `1px solid ${extendedPalette.glass.border}`,
                                color: 'text.secondary',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    background: 'rgba(255, 255, 255, 0.08)',
                                },
                            }}
                        >
                            <MicOffRoundedIcon sx={{ fontSize: 22 }} />
                        </IconButton>
                    </Tooltip>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Mute
                    </Typography>
                </Box>

                {/* Speaker */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                    <Tooltip title="Speaker">
                        <IconButton
                            sx={{
                                width: 52,
                                height: 52,
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: `1px solid ${extendedPalette.glass.border}`,
                                color: 'text.secondary',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    background: 'rgba(255, 255, 255, 0.08)',
                                },
                            }}
                        >
                            <VolumeUpRoundedIcon sx={{ fontSize: 22 }} />
                        </IconButton>
                    </Tooltip>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Speaker
                    </Typography>
                </Box>

                {/* Accept */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                    <Tooltip title="Accept">
                        <IconButton
                            onClick={onAccept}
                            sx={{
                                width: 64,
                                height: 64,
                                background: 'rgba(0, 184, 148, 0.15)',
                                border: '2px solid rgba(0, 184, 148, 0.3)',
                                color: '#00B894',
                                transition: 'all 0.2s ease',
                                animation: 'pulse 1.5s ease-in-out infinite',
                                '&:hover': {
                                    background: 'rgba(0, 184, 148, 0.25)',
                                    transform: 'scale(1.1)',
                                },
                                '@keyframes pulse': {
                                    '0%, 100%': { boxShadow: '0 0 0 0 rgba(0, 184, 148, 0.3)' },
                                    '50%': { boxShadow: '0 0 0 12px rgba(0, 184, 148, 0)' },
                                },
                            }}
                        >
                            {callType === 'video' ? (
                                <VideocamRoundedIcon sx={{ fontSize: 28 }} />
                            ) : (
                                <CallRoundedIcon sx={{ fontSize: 28 }} />
                            )}
                        </IconButton>
                    </Tooltip>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Accept
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}
