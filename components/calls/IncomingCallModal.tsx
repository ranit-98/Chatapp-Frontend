'use client';

import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import CallRoundedIcon from '@mui/icons-material/CallRounded';
import CallEndRoundedIcon from '@mui/icons-material/CallEndRounded';
import { styled, keyframes } from '@mui/material/styles';
import { useCall } from '@/lib/webrtc/CallContext';
import { extendedPalette } from '@/theme';

const ring = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const ModalRoot = styled(Box)(() => ({
  position: 'fixed',
  top: 60,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 99999,
  width: 420,
  background: '#12152A',
  border: '2px solid #6C5CE7',
  boxShadow: '0 0 50px rgba(108, 92, 231, 0.5)',
  padding: '24px',
  display: 'flex',
  alignItems: 'center',
  gap: 20,
  borderRadius: 32,
  animation: `${ring} 2s infinite ease-in-out`,
}));

const ActionButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'variant',
})<{ variant: 'success' | 'danger' }>(({ variant }) => ({
  width: 48,
  height: 48,
  background: variant === 'success' ? '#27AE60' : '#FF4757',
  color: 'white',
  '&:hover': {
    background: variant === 'success' ? '#2ECC71' : '#FF6B81',
    transform: 'scale(1.1)',
  },
  transition: 'all 0.2s',
}));

export default function IncomingCallModal() {
  const { callStatus, callType, remoteUser, rejectCall, acceptCall } = useCall();

  // Debug logging
  useEffect(() => {
    console.log(
      '🔍 [IncomingCallModal] Render triggered - callStatus:',
      callStatus,
      'remoteUser:',
      remoteUser,
    );
  }, [callStatus, remoteUser]);

  if (callStatus === 'incoming') {
    console.info('✅ [IncomingCallModal] Should render - callStatus is "incoming"', {
      callStatus,
      callType,
      remoteUser,
    });
  } else {
    console.debug('❌ [IncomingCallModal] Not rendering - callStatus is:', callStatus);
  }

  if (callStatus !== 'incoming') return null;

  const handleReject = () => {
    console.info('❌ [IncomingCallModal] Call rejected by user');
    rejectCall();
  };

  const handleAcceptCall = () => {
    console.info('✅ [IncomingCallModal] Call accepted by user');
    acceptCall();
  };

  return (
    <ModalRoot>
      <Avatar
        src={remoteUser?.avatar}
        sx={{
          width: 56,
          height: 56,
          background: extendedPalette.gradients.primary,
        }}
      >
        {!remoteUser?.avatar && (remoteUser?.name?.[0]?.toUpperCase() || <CallRoundedIcon />)}
      </Avatar>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="subtitle1" fontWeight={700} noWrap>
          {remoteUser?.name || 'Unknown Caller'}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Incoming {callType} call...
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <ActionButton variant="danger" onClick={handleReject}>
          <CallEndRoundedIcon fontSize="small" />
        </ActionButton>
        <ActionButton variant="success" onClick={handleAcceptCall}>
          <CallRoundedIcon fontSize="small" />
        </ActionButton>
      </Box>
    </ModalRoot>
  );
}
