'use client';

// ─────────────────────────────────────────────────────────────
//  MessageBubble – Individual Chat Message Component
//  Renders a single message with reactions, timestamps, and
//  hover action controls (reply, react, edit, more).
// ─────────────────────────────────────────────────────────────

import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';
import EmojiEmotionsRoundedIcon from '@mui/icons-material/EmojiEmotionsRounded';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import { extendedPalette } from '@/theme';
import type { ChatMessage, ChatUser } from '@/typescript/types/chat.types';
import {
    MessageRow,
    BubbleContent,
    MessageHoverActions,
} from '@/components/ui';

// ── Props ────────────────────────────────────────────────────

interface MessageBubbleProps {
    /** The message — content should already be decrypted by the parent */
    message: ChatMessage;
    isOwn: boolean;
}

// ── Helpers ──────────────────────────────────────────────────

function getSenderName(sender: ChatUser | string): string {
    if (typeof sender === 'string') return '';
    return sender.name ?? '';
}

function getSenderAvatar(sender: ChatUser | string): string | undefined {
    if (typeof sender === 'string') return undefined;
    return sender.avatar ?? sender.profile_image;
}

function formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ── Component ────────────────────────────────────────────────

export default function MessageBubble({ message, isOwn }: MessageBubbleProps) {
    const [hovered, setHovered] = useState(false);

    if (message.isDeleted) {
        return (
            <Box sx={{ display: 'flex', justifyContent: isOwn ? 'flex-end' : 'flex-start', mb: 1, px: 3 }}>
                <Box sx={{ p: '8px 16px', borderRadius: 3, background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(138, 141, 163, 0.2)' }}>
                    <Typography variant="caption" color="text.disabled" fontStyle="italic">
                        This message was deleted
                    </Typography>
                </Box>
            </Box>
        );
    }

    const senderName = getSenderName(message.sender);
    const senderAvatar = getSenderAvatar(message.sender);

    return (
        <MessageRow isOwn={isOwn} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            {/* Sender avatar (left) */}
            {!isOwn && (
                <Avatar
                    src={senderAvatar}
                    sx={{
                        width: 32, height: 32, mt: 'auto', mb: 0.5,
                        fontSize: '0.8rem',
                        background: 'linear-gradient(135deg, #6C5CE7, #A29BFE)',
                        border: '2px solid rgba(108, 92, 231, 0.2)'
                    }}
                >
                    {senderName[0]}
                </Avatar>
            )}

            <Box sx={{ position: 'relative', maxWidth: '70%', display: 'flex', flexDirection: 'column', alignItems: isOwn ? 'flex-end' : 'flex-start' }}>
                {/* Hover Action Toolbar */}
                <MessageHoverActions isVisible={hovered} isOwn={isOwn}>
                    <Tooltip title="React">
                        <IconButton size="small" sx={{ color: 'white' }}><EmojiEmotionsRoundedIcon fontSize="inherit" /></IconButton>
                    </Tooltip>
                    <Tooltip title="Reply">
                        <IconButton size="small" sx={{ color: 'white' }}><ReplyRoundedIcon fontSize="inherit" /></IconButton>
                    </Tooltip>
                    {isOwn && (
                        <Tooltip title="Edit">
                            <IconButton size="small" sx={{ color: 'white' }}><EditRoundedIcon fontSize="inherit" /></IconButton>
                        </Tooltip>
                    )}
                    <Tooltip title="More">
                        <IconButton size="small" sx={{ color: 'white' }}><MoreHorizRoundedIcon fontSize="inherit" /></IconButton>
                    </Tooltip>
                </MessageHoverActions>

                {/* Message Bubble */}
                <BubbleContent isOwn={isOwn} sx={{ maxWidth: '100%' }}>
                    <Typography variant="body2" sx={{ lineHeight: 1.55, wordBreak: 'break-word' }}>
                        {message.content}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5, mt: 0.5 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                            {formatTime(message.createdAt)}
                        </Typography>
                        {isOwn && (
                            <DoneAllRoundedIcon sx={{ fontSize: 14, color: '#6C5CE7' }} />
                        )}
                    </Box>
                </BubbleContent>

                {/* Reactions */}
                {message.reactions.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 0.5, mt: -1, zIndex: 1, justifyContent: isOwn ? 'flex-end' : 'flex-start' }}>
                        {message.reactions.map((reaction, idx) => (
                            <Tooltip key={idx} title={reaction.userId}>
                                <Box sx={{ p: '2px 6px', borderRadius: 2, background: 'rgba(18, 21, 42, 0.95)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.7rem' }}>
                                    {reaction.emoji}
                                </Box>
                            </Tooltip>
                        ))}
                    </Box>
                )}
            </Box>

            {/* Own avatar (right) */}
            {isOwn && (
                <Avatar
                    src={senderAvatar}
                    sx={{
                        width: 32, height: 32, mt: 'auto', mb: 0.5,
                        fontSize: '0.8rem',
                        background: 'linear-gradient(135deg, #00CEC9, #55EFC4)',
                        border: '2px solid rgba(0, 206, 201, 0.2)'
                    }}
                >
                    {senderName[0]}
                </Avatar>
            )}
        </MessageRow>
    );
}
