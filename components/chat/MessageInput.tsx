'use client';

import { useState, useRef } from 'react';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import EmojiEmotionsRoundedIcon from '@mui/icons-material/EmojiEmotionsRounded';
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';
import MicRoundedIcon from '@mui/icons-material/MicRounded';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';
import EmojiPicker, { Theme as EmojiTheme, EmojiClickData } from 'emoji-picker-react';
import { extendedPalette } from '@/theme';
import { InputRoot, ComposerWrapper } from '@/components/ui';
import { socketService } from '@/lib/socket/socket.service';
import { SocketEvents } from '@/lib/socket/socket-events';

import type { ChatMessage } from '@/typescript/types/chat.types';

interface MessageInputProps {
    /** Called when the user sends a message */
    onSend: (content: string, type?: ChatMessage['type']) => void;
    /** Called when typing state changes */
    onTyping: (isTyping: boolean) => void;
}

export default function MessageInput({ onSend, onTyping }: MessageInputProps) {
    const [message, setMessage] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [emojiAnchorEl, setEmojiAnchorEl] = useState<HTMLButtonElement | null>(null);

    const hasContent = message.trim().length > 0;

    const handleSend = () => {
        if (!hasContent) return;
        // Encryption is handled by the hook layer — just pass plain text
        onSend(message.trim());
        setMessage('');
        onTyping(false);
    };

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        setMessage((prev) => prev + emojiData.emoji);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <InputRoot>
            <ComposerWrapper isFocused={isFocused}>
                {/* Left Actions */}
                <Box sx={{ display: 'flex', gap: 0.25 }}>
                    <Tooltip title="Emoji">
                        <IconButton
                            onClick={(e) => setEmojiAnchorEl(e.currentTarget)}
                            size="small"
                            sx={{ color: 'text.secondary', '&:hover': { color: '#FDCB6E' } }}
                        >
                            <EmojiEmotionsRoundedIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Popover
                        open={Boolean(emojiAnchorEl)}
                        anchorEl={emojiAnchorEl}
                        onClose={() => setEmojiAnchorEl(null)}
                        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        sx={{ mb: 2 }}
                    >
                        <EmojiPicker
                            theme={EmojiTheme.DARK}
                            onEmojiClick={handleEmojiClick}
                            lazyLoadEmojis
                        />
                    </Popover>

                    <Tooltip title="Attach File">
                        <IconButton size="small" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.light' } }}>
                            <AttachFileRoundedIcon fontSize="small" sx={{ transform: 'rotate(45deg)' }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Send Image">
                        <IconButton size="small" sx={{ color: 'text.secondary', '&:hover': { color: 'secondary.main' } }}>
                            <ImageRoundedIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>

                {/* Text Input */}
                <InputBase
                    multiline
                    maxRows={4}
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => {
                        setMessage(e.target.value);
                        onTyping(e.target.value.length > 0);
                    }}
                    onKeyDown={handleKeyPress}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    sx={{
                        flex: 1,
                        fontSize: '0.9rem',
                        color: 'text.primary',
                        pb: 0.5,
                        '& ::placeholder': { color: 'text.secondary', opacity: 0.6 },
                    }}
                />

                {/* Send / Voice */}
                {hasContent ? (
                    <Tooltip title="Send Message">
                        <IconButton
                            onClick={handleSend}
                            sx={{
                                width: 40,
                                height: 40,
                                background: extendedPalette.gradients.primary,
                                color: 'white',
                                boxShadow: extendedPalette.shadows.glow,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    filter: 'brightness(1.1)',
                                    transform: 'scale(1.05)',
                                    background: extendedPalette.gradients.primary,
                                },
                            }}
                        >
                            <SendRoundedIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Tooltip title="Voice Note">
                        <IconButton
                            sx={{
                                width: 40,
                                height: 40,
                                background: 'rgba(108, 92, 231, 0.1)',
                                color: 'primary.main',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    background: 'rgba(108, 92, 231, 0.2)',
                                    transform: 'scale(1.05)',
                                },
                            }}
                        >
                            <MicRoundedIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}
            </ComposerWrapper>
        </InputRoot>
    );
}
