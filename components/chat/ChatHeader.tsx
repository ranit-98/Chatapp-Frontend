'use client';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded';
import CallRoundedIcon from '@mui/icons-material/CallRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { authStore } from '@/zustand/auth.zustand';
import StatusBadge from '@/components/common/StatusBadge';
import {
    MainHeaderWrapper
} from '@/components/ui';

// ── Props ───────────────────────────────────────────────────

interface ChatHeaderProps {
    conversation: any;
    onBack?: () => void;
}

// ── Helpers ─────────────────────────────────────────────────

const getInitials = (name: string) => (name || '?').split(' ').map((n: string) => n[0]).join('').toUpperCase();

// ── Component ───────────────────────────────────────────────

export default function ChatHeader({ conversation, onBack }: ChatHeaderProps) {
    const me = authStore.useStore((s: any) => s.userData);
    const otherUser = conversation.participants?.find((p: any) => p._id !== me?._id) || conversation.participants?.[0] || {};

    return (
        <MainHeaderWrapper>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {onBack && (
                    <IconButton onClick={onBack} sx={{ mr: -1, color: 'text.secondary' }}>
                        <ArrowBackRoundedIcon />
                    </IconButton>
                )}
                <StatusBadge status={otherUser.status || 'offline'}>
                    <Avatar
                        src={otherUser.avatar}
                        sx={{
                            width: 44,
                            height: 44,
                            background: 'linear-gradient(135deg, #6C5CE7, #A29BFE)',
                            fontSize: '0.9rem',
                            fontWeight: 700
                        }}
                    >
                        {!otherUser.avatar && getInitials(otherUser.name)}
                    </Avatar>
                </StatusBadge>

                <Box>
                    <Typography variant="subtitle1" fontWeight={600} lineHeight={1.3}>
                        {otherUser.name}
                    </Typography>
                    <Typography
                        variant="caption"
                        color={otherUser.status === 'online' ? 'secondary.main' : 'text.secondary'}
                        fontWeight={otherUser.status === 'online' ? 500 : 400}
                    >
                        {conversation.isTyping ? (
                            <Box component="span" sx={{ color: 'secondary.main', fontStyle: 'italic' }}>
                                typing...
                            </Box>
                        ) : (otherUser.status === 'online' ? 'Online' : 'Offline')}
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Tooltip title="Search in Chat">
                    <IconButton sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
                        <SearchRoundedIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Voice Call">
                    <IconButton sx={{ color: 'text.secondary', '&:hover': { color: 'secondary.main', background: 'rgba(0, 206, 201, 0.1)' } }}>
                        <CallRoundedIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Video Call">
                    <IconButton sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main', background: 'rgba(108, 92, 231, 0.1)' } }}>
                        <VideocamRoundedIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Options">
                    <IconButton sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
                        <MoreVertRoundedIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>
        </MainHeaderWrapper>
    );
}
