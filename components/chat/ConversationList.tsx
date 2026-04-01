'use client';

import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import CircularProgress from '@mui/material/CircularProgress';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import PushPinRoundedIcon from '@mui/icons-material/PushPinRounded';
import { authStore } from '@/zustand/auth.zustand';
import SearchBar from '@/components/common/SearchBar';
import StatusBadge from '@/components/common/StatusBadge';
import { useUserList } from '@/api/hooks/useUser.hook';
import { useInitiateConversation } from '@/api/hooks/useChat.hook';

import {
    SidePanelRoot,
    SectionTitleWrapper,
    ScrollArea,
    ConversationItemWrapper,
    ActiveConversationAvatar,
    TimeTextWrapper,
    FlexBetween,
    FlexCenter
} from '@/components/ui';

// ── Props ───────────────────────────────────────────────────

interface ConversationListProps {
    activeConversationId: string;
    onConversationSelect: (id: string) => void;
    conversations: any[];
    isLoading: boolean;
}

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

const getInitials = (name: string) => (name || '?').split(' ').map((n) => n[0]).join('').toUpperCase();

// ── Component ───────────────────────────────────────────────

export default function ConversationList({
    activeConversationId,
    onConversationSelect,
    conversations,
    isLoading
}: ConversationListProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showUserList, setShowUserList] = useState(false);
    const me = authStore.useStore((s) => s.userData);

    const { data: users = [], isLoading: isUsersLoading } = useUserList();
    const { mutate: initiateChat, isPending: isInitiating } = useInitiateConversation();

    const filterConversations = (convs: any[]) =>
        convs.filter((c) => {
            const otherUser = c.participants.find((p: any) => p._id !== me?._id);
            return otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase());
        });

    const handleStartChat = (userId: string) => {
        initiateChat(userId, {
            onSuccess: (res: any) => {
                const convId = res.data.data._id || res.data.data.id;
                onConversationSelect(convId);
                setShowUserList(false);
            }
        });
    };

    const renderConversation = (conv: any, index: number) => {
        const id = conv._id || conv.id;
        const otherUser = conv.participants.find((p: any) => p._id !== me?._id) || conv.participants[0];
        const isActive = activeConversationId === id;
        const lastMsg = typeof conv.lastMessage === 'string' ? conv.lastMessage : conv.lastMessage?.content;

        return (
            <ConversationItemWrapper key={id} isActive={isActive} onClick={() => onConversationSelect(id)}>
                <StatusBadge status={otherUser.status || 'offline'}>
                    <ActiveConversationAvatar src={otherUser.avatar} gradient={AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length]} isActive={isActive}>
                        {!otherUser.avatar && getInitials(otherUser.name)}
                    </ActiveConversationAvatar>
                </StatusBadge>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <FlexBetween sx={{ mb: 0.3 }}>
                        <Typography variant="subtitle2" fontWeight={conv.unreadCount > 0 ? 700 : 500}>
                            {otherUser.name}
                        </Typography>
                        <TimeTextWrapper variant="caption" isRead={true}>
                            {conv.updatedAt ? new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </TimeTextWrapper>
                    </FlexBetween>

                    <FlexBetween>
                        <Typography
                            variant="caption"
                            sx={{
                                color: conv.isTyping ? 'secondary.main' : 'text.secondary',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '75%',
                                fontStyle: conv.isTyping ? 'italic' : 'normal',
                                fontWeight: conv.isTyping ? 500 : 400,
                            }}
                        >
                            {conv.isTyping ? 'is typing...' : (lastMsg || 'No messages yet')}
                        </Typography>
                        {conv.unreadCount > 0 && (
                            <Chip
                                label={conv.unreadCount}
                                size="small"
                                sx={{
                                    height: 20,
                                    minWidth: 20,
                                    fontSize: '0.65rem',
                                    fontWeight: 700,
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
                    <Typography variant="h5" fontWeight={700}>
                        Messages
                    </Typography>
                    <Tooltip title="New Message">
                        <IconButton
                            onClick={() => setShowUserList(true)}
                            sx={{ background: 'rgba(108, 92, 231, 0.1)', color: 'primary.main' }}
                        >
                            <EditNoteRoundedIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </SectionTitleWrapper>
                <SearchBar placeholder="Search conversations..." value={searchQuery} onChange={setSearchQuery} />
            </Box>

            <ScrollArea>
                {isLoading ? (
                    <FlexCenter sx={{ height: 100 }}><CircularProgress size={20} /></FlexCenter>
                ) : (
                    filterConversations(conversations).map((conv, idx) => renderConversation(conv, idx))
                )}
            </ScrollArea>

            {/* User Discovery Dialog */}
            <Dialog
                open={showUserList}
                onClose={() => setShowUserList(false)}
                PaperProps={{
                    sx: {
                        background: '#12152A',
                        borderRadius: 4,
                        border: '1px solid rgba(255,255,255,0.05)',
                        minWidth: 320
                    }
                }}
            >
                <DialogTitle sx={{ fontWeight: 700 }}>New Message</DialogTitle>
                <Box sx={{ px: 2, pb: 2 }}>
                    {isUsersLoading ? (
                        <FlexCenter sx={{ py: 4 }}><CircularProgress /></FlexCenter>
                    ) : (
                        <List>
                            {users.map((user: any) => (
                                <ListItem key={user._id} disablePadding>
                                    <ListItemButton
                                        disabled={isInitiating}
                                        onClick={() => handleStartChat(user._id)}
                                        sx={{ borderRadius: 2 }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar src={user.avatar} sx={{ background: AVATAR_GRADIENTS[0] }}>
                                                {!user.avatar && getInitials(user.name)}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={user.name}
                                            secondary={user.status || 'offline'}
                                            primaryTypographyProps={{ fontWeight: 600 }}
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
