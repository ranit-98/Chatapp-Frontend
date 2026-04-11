// ─────────────────────────────────────────────────────────────
//  EmptyState – No Conversation Selected Placeholder
//  Displayed when no conversation is active.
// ─────────────────────────────────────────────────────────────

'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import { extendedPalette } from '@/theme';
import { EmptyStateRoot, PulsingIcon, EncryptionTag } from '@/components/ui';

export default function EmptyState() {
  return (
    <EmptyStateRoot>
      {/* Background Glow */}
      <Box
        sx={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(108,92,231,0.08) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Main Content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <PulsingIcon>
          <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 44, color: 'white' }} />
        </PulsingIcon>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            mb: 1,
            background: extendedPalette.gradients.accent,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          NexaChat
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            textAlign: 'center',
            maxWidth: 360,
            mb: 4,
            lineHeight: 1.7,
          }}
        >
          Select a conversation from the sidebar to start messaging in real-time.
        </Typography>

        <EncryptionTag>
          <LockRoundedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            END-TO-END ENCRYPTED
          </Typography>
        </EncryptionTag>
      </Box>
    </EmptyStateRoot>
  );
}
