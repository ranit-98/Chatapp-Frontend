'use client';

import React, { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import MicRoundedIcon from '@mui/icons-material/MicRounded';
import MicOffRoundedIcon from '@mui/icons-material/MicOffRounded';
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded';
import VideocamOffRoundedIcon from '@mui/icons-material/VideocamOffRounded';
import CallEndRoundedIcon from '@mui/icons-material/CallEndRounded';
import { styled, keyframes } from '@mui/material/styles';
import { useCall } from '@/lib/webrtc/CallContext';
import { extendedPalette } from '@/theme';

//===============================================>
// this is for animation
//===============================================>

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(255, 71, 87, 0.4); }
  70% { box-shadow: 0 0 0 20px rgba(255, 71, 87, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 71, 87, 0); }
`;

//===============================================>
// this is for layout
//===============================================>

const CallOverlay = styled(Box)(() => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  zIndex: 9999,
  background: '#0B0D17',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
}));

const VideoContainer = styled(Box)(() => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
}));

const RemoteVideo = styled('video')(() => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  background: '#0B0D17',
}));

const LocalVideo = styled('video')(({ theme }) => ({
  position: 'absolute',
  bottom: 24,
  right: 24,
  width: 240,
  height: 160,
  background: '#12152A',
  borderRadius: 16,
  objectFit: 'cover',
  border: '2px solid rgba(108, 92, 231, 0.5)',
  boxShadow: extendedPalette.shadows.card,
  [theme.breakpoints.down('sm')]: {
    width: 150,
    height: 100,
    bottom: 100,
  },
}));

const WaitingVideoState = styled(Box)(() => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#0B0D17',
}));

const Controls = styled(Box)(() => ({
  position: 'absolute',
  bottom: 40,
  display: 'flex',
  gap: 24,
  padding: '16px 32px',
  borderRadius: 40,
  background: 'rgba(18, 21, 42, 0.8)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
}));

//===============================================>
// this is for controls
//===============================================>

const ControlButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'variant',
})<{ active?: boolean; variant?: 'danger' | 'success' | 'default' }>(({ active, variant }) => ({
  width: 56,
  height: 56,
  background:
    variant === 'danger'
      ? '#FF4757'
      : active
        ? 'rgba(108, 92, 231, 0.2)'
        : 'rgba(255, 255, 255, 0.05)',
  color: variant === 'danger' ? 'white' : active ? '#6C5CE7' : 'white',
  '&:hover': {
    background: variant === 'danger' ? '#FF6B81' : 'rgba(108, 92, 231, 0.3)',
    transform: 'scale(1.05)',
  },
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  ...(variant === 'danger' && { animation: `${pulse} 2s infinite` }),
}));

//===============================================>
// this is for media helpers
//===============================================>

function hasLiveVideo(stream: MediaStream | null): boolean {
  return stream?.getVideoTracks().some((track) => track.readyState === 'live') ?? false;
}

async function attachStreamToElement(
  element: HTMLMediaElement | null,
  stream: MediaStream | null,
): Promise<void> {
  if (!element || !stream) return;

  element.srcObject = stream;

  try {
    await element.play();
  } catch (error) {
    if (error instanceof Error) {
      console.warn(
        '[CallInterface] Media playback is waiting for browser permission:',
        error.message,
      );
    }
  }
}

//===============================================>
// this is for call screen component
//===============================================>

export default function CallInterface() {
  const {
    localStream,
    remoteStream,
    callStatus,
    callType,
    remoteUser,
    isAudioMuted,
    isVideoOff,
    handleEndCall,
    toggleAudio,
    toggleVideo,
  } = useCall();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const hasRemoteVideo = hasLiveVideo(remoteStream);

  useEffect(() => {
    void attachStreamToElement(localVideoRef.current, localStream);
  }, [localStream]);

  useEffect(() => {
    void attachStreamToElement(remoteVideoRef.current, remoteStream);
    void attachStreamToElement(remoteAudioRef.current, remoteStream);
  }, [remoteStream]);

  if (callStatus === 'idle' || callStatus === 'incoming') return null;

  return (
    <CallOverlay>
      <VideoContainer>
        {callType === 'video' ? (
          <>
            {hasRemoteVideo ? (
              <RemoteVideo ref={remoteVideoRef} autoPlay playsInline muted />
            ) : (
              <WaitingVideoState>
                <Avatar
                  src={remoteUser?.avatar}
                  sx={{
                    width: 120,
                    height: 120,
                    mb: 3,
                    background: extendedPalette.gradients.primary,
                    fontSize: '3rem',
                  }}
                >
                  {remoteUser?.name?.[0]?.toUpperCase()}
                </Avatar>
                <Typography variant="h4" fontWeight={700}>
                  {remoteUser?.name || 'Video Call'}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {callStatus === 'active' ? 'Connecting video...' : 'Dialing...'}
                </Typography>
              </WaitingVideoState>
            )}
            <LocalVideo ref={localVideoRef} autoPlay playsInline muted />
            <audio ref={remoteAudioRef} autoPlay />
          </>
        ) : (
          <Box sx={{ textAlign: 'center' }}>
            <Avatar
              src={remoteUser?.avatar}
              sx={{
                width: 120,
                height: 120,
                mb: 3,
                marginInline: 'auto',
                background: extendedPalette.gradients.primary,
                fontSize: '3rem',
              }}
            >
              {remoteUser?.name?.[0]?.toUpperCase()}
            </Avatar>
            <Typography variant="h4" fontWeight={700}>
              {remoteUser?.name || 'Voice Call'}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {callStatus === 'active' ? 'Ongoing Session' : 'Dialing...'}
            </Typography>
            <audio ref={remoteAudioRef} autoPlay />
          </Box>
        )}

        <Controls>
          <ControlButton onClick={toggleAudio} active={isAudioMuted}>
            {isAudioMuted ? <MicOffRoundedIcon /> : <MicRoundedIcon />}
          </ControlButton>

          {callType === 'video' && (
            <ControlButton onClick={toggleVideo} active={isVideoOff}>
              {isVideoOff ? <VideocamOffRoundedIcon /> : <VideocamRoundedIcon />}
            </ControlButton>
          )}

          <ControlButton variant="danger" onClick={handleEndCall}>
            <CallEndRoundedIcon />
          </ControlButton>
        </Controls>
      </VideoContainer>
    </CallOverlay>
  );
}
