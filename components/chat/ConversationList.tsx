'use client';

// ─────────────────────────────────────────────────────────────
//  ConversationList – Sidebar with Last Message Decryption
// ─────────────────────────────────────────────────────────────

import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import { authStore } from '@/zustand/auth.zustand';
import SearchBar from '@/components/common/SearchBar';
import StatusBadge from '@/components/common/StatusBadge';
import { useUserList } from '@/api/hooks/useUser.hook';
import { useInitiateConversation } from '@/api/hooks/useChat.hook';
import { decryptMessage } from '@/lib/utils/encryption';
import { getOtherParticipant, getUserId } from '@/lib/users/user-id';
import type { Conversation, ChatMessage, ChatUser } from '@/typescript/types/chat.types';
import type { TLoginWithPasswordUser } from '@/typescript/types/authentication.type';

import {
  SidePanelRoot,
  SectionTitleWrapper,
  ScrollArea,
  ConversationItemWrapper,
  ActiveConversationAvatar,
  TimeTextWrapper,
  FlexBetween,
  FlexCenter,
} from '@/components/ui';

// ── Props ───────────────────────────────────────────────────

interface ConversationListProps {
  activeConversationId: string;
  onConversationSelect: (id: string) => void;
  conversations: ConversationItem[];
  isLoading: boolean;
}

type ConversationItem = Omit<Conversation, 'lastMessage'> & {
  id?: string;
  lastMessage?: string | ChatMessage;
};

type InitiateConversationResponse = {
  data: {
    data: {
      _id?: string;
      id?: string;
    };
  };
};

// ── Constants ───────────────────────────────────────────────

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #6C5CE7, #A29BFE)',
  'linear-gradient(135deg, #00CEC9, #55EFC4)',
  'linear-gradient(135deg, #FF6B6B, #FDCB6E)',
  'linear-gradient(135deg, #74B9FF, #A29BFE)',
  'linear-gradient(135deg, #00B894, #55EFC4)',
  'linear-gradient(135deg, #E17055, #FDCB6E)',
];

// ── Helpers ─────────────────────────────────────────────────

const getInitials = (name: string) =>
  (name || '?')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

// ── Component ───────────────────────────────────────────────

export default function ConversationList({
  activeConversationId,
  onConversationSelect,
  conversations,
  isLoading,
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserList, setShowUserList] = useState(false);
  const me = authStore.useStore((s) => s.userData as TLoginWithPasswordUser | null);

  const { data: users = [], isLoading: isUsersLoading } = useUserList() as {
    data?: ChatUser[];
    isLoading: boolean;
  };
  const { mutate: initiateChat, isPending: isInitiating } = useInitiateConversation();

  const filterConversations = (convs: ConversationItem[]) =>
    convs.filter((c) => {
      const otherUser = getOtherParticipant(c.participants, me);
      return otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    });

  const handleStartChat = (userId: string) => {
    initiateChat(userId, {
      onSuccess: (res: InitiateConversationResponse) => {
        const convId = res.data.data._id || res.data.data.id;
        if (!convId) return;
        onConversationSelect(convId);
        setShowUserList(false);
      },
    });
  };

  const renderConversation = (conv: ConversationItem, index: number) => {
    const id = conv._id || conv.id;
    if (!id) return null;

    const otherUser = getOtherParticipant(conv.participants, me) || conv.participants[0];
    const isActive = activeConversationId === id;
    const unreadCount = conv.unreadCount ?? 0;

    const rawLastMsg =
      typeof conv.lastMessage === 'string' ? conv.lastMessage : conv.lastMessage?.content;
    const lastMsgType = typeof conv.lastMessage === 'object' ? conv.lastMessage?.type : 'text';

    let lastMsgDisplay = rawLastMsg || 'No messages yet';
    if (rawLastMsg && lastMsgType === 'text') {
      try {
        lastMsgDisplay = decryptMessage(rawLastMsg);
      } catch {
        lastMsgDisplay = rawLastMsg;
      }
    } else if (rawLastMsg && lastMsgType !== 'text') {
      lastMsgDisplay = `📎 ${lastMsgType}`;
    }

    return (
      <ConversationItemWrapper
        key={id}
        isActive={isActive}
        onClick={() => onConversationSelect(id)}
      >
        <StatusBadge status={otherUser.status || 'offline'}>
          <ActiveConversationAvatar
            src={otherUser.avatar}
            gradient={AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length]}
            isActive={isActive}
          >
            {!otherUser.avatar && getInitials(otherUser.name)}
          </ActiveConversationAvatar>
        </StatusBadge>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <FlexBetween sx={{ mb: 0.3 }}>
            <Typography
              variant="subtitle2"
              fontWeight={unreadCount > 0 ? 700 : 500}
              noWrap
              sx={{ maxWidth: '70%' }}
            >
              {otherUser.name}
            </Typography>
            <TimeTextWrapper variant="caption" isRead={true}>
              {conv.updatedAt
                ? new Date(conv.updatedAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : ''}
            </TimeTextWrapper>
          </FlexBetween>

          <FlexBetween>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '85%',
              }}
            >
              {lastMsgDisplay}
            </Typography>
            {unreadCount > 0 && (
              <Chip
                label={unreadCount}
                size="small"
                sx={{
                  height: 18,
                  minWidth: 18,
                  fontSize: '0.6rem',
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
                  color: 'white',
                  '& .MuiChip-label': { px: 0.5 },
                }}
              />
            )}
          </FlexBetween>
        </Box>
      </ConversationItemWrapper>
    );
  };

  return (
    <SidePanelRoot>
      <Box sx={{ px: 2.5, pt: 3, pb: 2 }}>
        <SectionTitleWrapper>
          <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: -0.5 }}>
            Messages
          </Typography>
          <Tooltip title="New Message">
            <IconButton
              onClick={() => setShowUserList(true)}
              size="small"
              sx={{ background: 'rgba(108, 92, 231, 0.1)', color: '#6C5CE7' }}
            >
              <EditNoteRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </SectionTitleWrapper>
        <SearchBar
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </Box>

      <ScrollArea>
        {isLoading ? (
          <FlexCenter sx={{ height: 100 }}>
            <CircularProgress size={24} sx={{ color: '#6C5CE7' }} />
          </FlexCenter>
        ) : (
          filterConversations(conversations).map((conv, idx) => renderConversation(conv, idx))
        )}
      </ScrollArea>

      <Dialog
        open={showUserList}
        onClose={() => setShowUserList(false)}
        PaperProps={{
          sx: {
            background: '#12152A',
            borderRadius: 4,
            border: '1px solid rgba(255,255,255,0.05)',
            minWidth: 320,
            backdropFilter: 'blur(20px)',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>New Message</DialogTitle>
        <Box sx={{ px: 2, pb: 2 }}>
          {isUsersLoading ? (
            <FlexCenter sx={{ py: 4 }}>
              <CircularProgress size={24} sx={{ color: '#6C5CE7' }} />
            </FlexCenter>
          ) : (
            <List>
              {users.map((user) => (
                <ListItem key={getUserId(user)} disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    disabled={isInitiating}
                    onClick={() => handleStartChat(getUserId(user))}
                    sx={{ borderRadius: 2, '&:hover': { background: 'rgba(255,255,255,0.03)' } }}
                  >
                    <ListItemAvatar>
                      <Avatar src={user.avatar} sx={{ background: AVATAR_GRADIENTS[0] }}>
                        {!user.avatar && getInitials(user.name)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={user.name}
                      secondary={user.status || 'offline'}
                      primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }}
                      secondaryTypographyProps={{ sx: { fontSize: '0.75rem', opacity: 0.7 } }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Dialog>
    </SidePanelRoot>
  );
}
