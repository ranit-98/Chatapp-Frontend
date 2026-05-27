// ─────────────────────────────────────────────────────────────
//  ChatLayout – Main Application Shell
//  Orchestrates NavigationRail, side panels, and chat area.
// ─────────────────────────────────────────────────────────────

'use client';

import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { useTheme, useMediaQuery } from '@mui/material';
import NavigationRail from '@/components/layout/NavigationRail';
import ConversationList from '@/components/chat/ConversationList';
import ChatArea from '@/components/chat/ChatArea';
import EmptyState from '@/components/chat/EmptyState';
import CallsPanel from '@/components/calls/CallsPanel';
import ProfilePanel from '@/components/profile/ProfilePanel';
import SettingsPanel from '@/components/settings/SettingsPanel';
import { useGetMe } from '@/api/hooks/useUser.hook';
import { useGetConversations } from '@/api/hooks/useChat.hook';
import { useSocketConnection } from '@/lib/socket/socket.hooks';
import type { Conversation } from '@/typescript/types/chat.types';
import CallInterface from '@/components/calls/CallInterface';
import IncomingCallModal from '@/components/calls/IncomingCallModal';
import CallDebug from '@/components/calls/CallDebug';

// ── Types ───────────────────────────────────────────────────

type NavSection = 'chats' | 'calls' | 'profile' | 'settings';

// ── Styled Components ───────────────────────────────────────

const LayoutRoot = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: '100vh',
  overflow: 'hidden',
  background: '#0B0D17',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}));

// ── Component ───────────────────────────────────────────────

export default function ChatLayout() {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('md'));
  const isConnected = useSocketConnection();
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<NavSection>('chats');
  const [activeConversationId, setActiveConversationId] = useState<string>('');

  useEffect(() => {
    setIsMobile(matches);
  }, [matches]);

  // Fetch real data
  const { data: userData } = useGetMe();
  const { data: conversations = [], isLoading: isConvsLoading } = useGetConversations();

  const selectedConversation = (conversations as Conversation[]).find(
    (c) => c._id === activeConversationId,
  );

  const renderSidePanel = () => {
    switch (activeSection) {
      case 'chats':
        return (
          <ConversationList
            activeConversationId={activeConversationId}
            onConversationSelect={setActiveConversationId}
            conversations={conversations}
            isLoading={isConvsLoading}
          />
        );
      case 'calls':
        return <CallsPanel />;
      case 'profile':
        return <ProfilePanel userData={userData} />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return null;
    }
  };

  return (
    <LayoutRoot>
      {/* Sidebar & Navigation */}
      {(!isMobile || !selectedConversation) && (
        <>
          {!isMobile && (
            <NavigationRail activeSection={activeSection} onSectionChange={setActiveSection} />
          )}
          <Box sx={{ position: 'fixed', bottom: 10, right: 10, zIndex: 9999 }}>
            <Box sx={{
              width: 12, height: 12, borderRadius: '50%',
              background: isConnected ? '#2ECC71' : '#E74C3C',
              boxShadow: isConnected ? '0 0 10px #2ECC71' : '0 0 10px #E74C3C'
            }} />
          </Box>
          {renderSidePanel()}
        </>
      )}

      {/* Main Chat Area */}
      {selectedConversation ? (
        <ChatArea conversation={selectedConversation} onBack={() => setActiveConversationId('')} />
      ) : (
        !isMobile && <EmptyState />
      )}

      {/* Bottom Navigation for Mobile */}
      {isMobile && !selectedConversation && (
        <NavigationRail activeSection={activeSection} onSectionChange={setActiveSection} />
      )}

      {/* Global Overlays */}
      <CallInterface />
      <IncomingCallModal />
      <CallDebug />
    </LayoutRoot>
  );
}
