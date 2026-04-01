'use client';

// ─────────────────────────────────────────────────────────────
//  ChatArea – Main Messaging View
//  Uses the typed useConversation hook for all real-time logic.
// ─────────────────────────────────────────────────────────────

import { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { useConversation } from '@/lib/socket/socket.hooks';
import { useGetMessages } from '@/api/hooks/useChat.hook';
import { authStore } from '@/zustand/auth.zustand';
import { decryptMessage } from '@/lib/utils/encryption';
import type { Conversation, ChatMessage } from '@/typescript/types/chat.types';
import {
    ChatViewRoot,
    ScrollBar
} from '@/components/ui';

// ── Props ────────────────────────────────────────────────────

interface ChatAreaProps {
    conversation: Conversation;
    onBack?: () => void;
}

// ── Helpers ──────────────────────────────────────────────────

function getSenderId(message: ChatMessage): string {
    if (typeof message.sender === 'string') return message.sender;
    return message.sender._id;
}

// ── Component ────────────────────────────────────────────────

export default function ChatArea({ conversation, onBack }: ChatAreaProps) {
    const convId = conversation._id;
    const me = authStore.useStore((s: { userData: { _id: string } | null }) => s.userData);

    // Fetch historical messages from the database
    const { data: initialMessages = [], isLoading } = useGetMessages(convId);

    // All real-time socket logic lives here
    const {
        messages,
        typingUserIds,
        isAnyoneTyping,
        setInitialMessages,
        sendMessage,
        setTyping,
    } = useConversation(convId);

    // Seed the socket hook's local state with fetched history
    useEffect(() => {
        if (!isLoading && initialMessages.length > 0) {
            setInitialMessages([...initialMessages].reverse() as ChatMessage[]);
        }
    }, [initialMessages, isLoading, setInitialMessages]);

    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to latest message
    useEffect(() => {
        scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: 'smooth',
        });
    }, [messages.length, isAnyoneTyping]);

    return (
        <ChatViewRoot sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <ChatHeader conversation={conversation} onBack={onBack} />

            <ScrollBar ref={scrollRef} sx={{ flex: 1, px: 0, py: 3, display: 'flex', flexDirection: 'column' }}>
                {/* Encryption Badge */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <Box sx={{
                        display: 'flex', alignItems: 'center', gap: 1.5,
                        background: 'rgba(108, 92, 231, 0.05)', px: 2.5, py: 1.2,
                        borderRadius: 2.5, border: '1px solid rgba(108, 92, 231, 0.1)'
                    }}>
                        <LockRoundedIcon sx={{ fontSize: 13, color: 'primary.light' }} />
                        <Typography variant="caption" sx={{ color: 'text.secondary', letterSpacing: 0.8, fontWeight: 500, fontSize: '0.65rem' }}>
                            MESSAGES ARE END-TO-END ENCRYPTED
                        </Typography>
                    </Box>
                </Box>

                {/* Loading State */}
                {isLoading ? (
                    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CircularProgress size={28} sx={{ color: 'primary.main' }} />
                    </Box>
                ) : (
                    <>
                        {/* Date Divider */}
                        {messages.length > 0 && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, px: 4 }}>
                                <Divider sx={{ flex: 1, opacity: 0.1 }} />
                                <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600, fontSize: '0.65rem' }}>
                                    TODAY
                                </Typography>
                                <Divider sx={{ flex: 1, opacity: 0.1 }} />
                            </Box>
                        )}

                        {/* Empty State */}
                        {messages.length === 0 && (
                            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, opacity: 0.5 }}>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    No messages yet...
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                                    Say hello! 👋
                                </Typography>
                            </Box>
                        )}

                        {/* Message List */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', mt: 'auto' }}>
                            {messages.map((msg) => (
                                <MessageBubble
                                    key={msg._id}
                                    message={{ ...msg, content: decryptMessage(msg.content) }}
                                    isOwn={getSenderId(msg) === me?._id}
                                />
                            ))}
                        </Box>

                        {/* Typing Indicator */}
                        {isAnyoneTyping && (
                            <Box sx={{ px: 4, mt: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box sx={{
                                    display: 'flex', gap: 0.5,
                                    background: 'rgba(255,255,255,0.03)',
                                    p: '8px 12px', borderRadius: '12px 12px 12px 4px'
                                }}>
                                    {[0, 1, 2].map((i) => (
                                        <Box key={i} sx={{
                                            width: 6, height: 6, borderRadius: '50%',
                                            background: '#6C5CE7',
                                            animation: 'typingDot 1.4s infinite ease-in-out',
                                            animationDelay: `${i * 0.2}s`,
                                            '@keyframes typingDot': {
                                                '0%, 80%, 100%': { transform: 'scale(0.6)', opacity: 0.4 },
                                                '40%': { transform: 'scale(1)', opacity: 1 },
                                            },
                                        }} />
                                    ))}
                                </Box>
                                <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                    {typingUserIds.size === 1 ? 'Someone is typing...' : `${typingUserIds.size} people are typing...`}
                                </Typography>
                            </Box>
                        )}
                    </>
                )}
            </ScrollBar>

            {/* Message Input */}
            <Box sx={{ flexShrink: 0 }}>
                <MessageInput onSend={sendMessage} onTyping={setTyping} />
            </Box>
        </ChatViewRoot>
    );
}
