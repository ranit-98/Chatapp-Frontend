'use client';

// ─────────────────────────────────────────────────────────────
//  ChatArea – Refactored for Robust Message Management
// ─────────────────────────────────────────────────────────────

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { useConversation } from '@/lib/socket/socket.hooks';
import { useGetMessages } from '@/api/hooks/useChat.hook';
import { authStore } from '@/zustand/auth.zustand';
import { decryptMessage } from '@/lib/utils/encryption';
import { getUserId } from '@/lib/users/user-id';
import type { Conversation, ChatMessage } from '@/typescript/types/chat.types';
import type { TLoginWithPasswordUser } from '@/typescript/types/authentication.type';
import { ChatViewRoot, ScrollBar, FlexCenter } from '@/components/ui';
import { styled } from '@mui/material/styles';

// ── Styled Components ────────────────────────────────────────

const EncryptionBadge = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  background: 'rgba(108, 92, 231, 0.05)',
  padding: '10px 20px',
  borderRadius: 10,
  border: '1px solid rgba(108, 92, 231, 0.1)',
  marginBottom: 24,
  marginInline: 'auto',
}));

const TypingIndicatorWrapper = styled(Box)(() => ({
  paddingInline: 32,
  marginTop: 16,
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  pb: 2,
}));

const TypingDots = styled(Box)(() => ({
  display: 'flex',
  gap: 4,
  background: 'rgba(255,255,255,0.03)',
  padding: '8px 12px',
  borderRadius: '12px 12px 12px 4px',
}));

const TypingDot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'delay',
})<{ delay: number }>(({ delay }) => ({
  width: 6,
  height: 6,
  borderRadius: '50%',
  background: '#6C5CE7',
  animation: 'typingDot 1.4s infinite ease-in-out',
  animationDelay: `${delay}s`,
  '@keyframes typingDot': {
    '0%, 80%, 100%': { transform: 'scale(0.6)', opacity: 0.4 },
    '40%': { transform: 'scale(1)', opacity: 1 },
  },
}));

// ── Helpers ──────────────────────────────────────────────────

function getSenderId(message: ChatMessage): string {
  if (!message.sender) return '';
  return getUserId(message.sender);
}

// ── Component ────────────────────────────────────────────────

export default function ChatArea({
  conversation,
  onBack,
}: {
  conversation: Conversation;
  onBack?: () => void;
}) {
  const convId = conversation._id;
  const me = authStore.useStore((s) => s.userData as TLoginWithPasswordUser | null);

  const { data: initialMessages = [], isLoading: isHistoryLoading } = useGetMessages(convId);

  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [editingMsg, setEditingMsg] = useState<ChatMessage | null>(null);

  const {
    messages: liveMessages,
    typingUserIds,
    isAnyoneTyping,
    setInitialMessages,
    sendMessage,
    setTyping,
    reactToMessage,
    deleteMessage,
    editMessage,
  } = useConversation(convId);

  // Sync history once when it loads
  useEffect(() => {
    if (!isHistoryLoading) {
      setInitialMessages([...initialMessages].reverse() as ChatMessage[]);
    }
  }, [initialMessages, isHistoryLoading, setInitialMessages]);

  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior,
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [liveMessages.length, isAnyoneTyping, scrollToBottom]);

  const handleSend = useCallback(
    (content: string, type: ChatMessage['type'] = 'text', repliedTo?: string) => {
      sendMessage(content, type, repliedTo);
      setReplyTo(null);
    },
    [sendMessage],
  );

  const handleEditComplete = useCallback(
    (messageId: string, content: string) => {
      editMessage(messageId, content);
      setEditingMsg(null);
    },
    [editMessage],
  );

  const handleStartEdit = useCallback((msg: ChatMessage) => {
    setReplyTo(null);
    setEditingMsg(msg);
  }, []);

  // Memoize the display-ready messages to avoid re-decrypting every render
  const displayMessages = useMemo(() => {
    return liveMessages.map((msg) => ({
      ...msg,
      displayContent: msg.type === 'text' ? decryptMessage(msg.content) : msg.content,
    }));
  }, [liveMessages]);

  return (
    <ChatViewRoot>
      <ChatHeader conversation={conversation} onBack={onBack} />

      <ScrollBar ref={scrollRef}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <EncryptionBadge>
            <LockRoundedIcon sx={{ fontSize: 13, color: 'primary.light' }} />
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                letterSpacing: 0.8,
                fontWeight: 600,
                fontSize: '0.65rem',
              }}
            >
              MESSAGES ARE END-TO-END ENCRYPTED
            </Typography>
          </EncryptionBadge>
        </Box>

        {isHistoryLoading ? (
          <FlexCenter sx={{ flex: 1 }}>
            <CircularProgress size={28} sx={{ color: 'primary.main' }} />
          </FlexCenter>
        ) : (
          <>
            {displayMessages.length === 0 && (
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                  opacity: 0.5,
                  py: 8,
                }}
              >
                <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  No messages yet
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                  Start the conversation with a friendly &quot;Hello!&quot;
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', mt: 'auto' }}>
              {displayMessages.map((msg) => (
                <MessageBubble
                  key={msg._id}
                  message={{ ...msg, content: msg.displayContent }}
                  isOwn={getSenderId(msg) === getUserId(me)}
                  onReply={setReplyTo}
                  onReact={reactToMessage}
                  onDelete={deleteMessage}
                  onEdit={handleStartEdit}
                />
              ))}
            </Box>

            {isAnyoneTyping && (
              <TypingIndicatorWrapper>
                <TypingDots>
                  {[0, 0.2, 0.4].map((delay) => (
                    <TypingDot key={delay} delay={delay} />
                  ))}
                </TypingDots>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontStyle: 'italic', fontWeight: 500 }}
                >
                  {typingUserIds.size === 1 ? 'Typing...' : 'People are typing...'}
                </Typography>
              </TypingIndicatorWrapper>
            )}
          </>
        )}
      </ScrollBar>

      <Box sx={{ flexShrink: 0 }}>
        <MessageInput
          onSend={handleSend}
          onEdit={handleEditComplete}
          onTyping={setTyping}
          replyTo={replyTo}
          editingMsg={editingMsg}
          onCancelReply={() => setReplyTo(null)}
          onCancelEdit={() => setEditingMsg(null)}
        />
      </Box>
    </ChatViewRoot>
  );
}
