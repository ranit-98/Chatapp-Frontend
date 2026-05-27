'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AUDIO_ONLY_CONSTRAINTS, ICE_SERVERS, MEDIA_CONSTRAINTS } from './webrtc-utils';
import { getUserId, type IdentifiableUser } from '@/lib/users/user-id';

export type CallStatus = 'idle' | 'calling' | 'incoming' | 'active';
export type CallType = 'audio' | 'video';

//===============================================>
// this is for shared call types
//===============================================>

export interface CallPeer extends IdentifiableUser {
  _id: string;
  name?: string;
}

interface UseWebRTCOptions {
  sendOffer: (to: string, offer: RTCSessionDescriptionInit, type: CallType) => void;
  sendAnswer: (to: string, answer: RTCSessionDescriptionInit) => void;
  sendCandidate: (to: string, candidate: RTCIceCandidateInit) => void;
  sendReject: (to: string) => void;
  sendEnd: (to: string) => void;
}

interface IncomingCallInput {
  from: string;
  offer: RTCSessionDescriptionInit;
  type: CallType;
  callerName?: string;
  callerAvatar?: string;
}

//===============================================>
// this is for user normalization
//===============================================>

function toCallPeer(user: IdentifiableUser): CallPeer | null {
  const id = getUserId(user);
  if (!id) return null;

  return {
    ...user,
    _id: id,
    avatar: user.avatar || user.profile_image,
  };
}

//===============================================>
// this is for browser media errors
//===============================================>

function getMediaErrorMessage(error: Error | DOMException): string {
  return error.message || error.name;
}

export function useWebRTC({
  sendOffer,
  sendAnswer,
  sendCandidate,
  sendReject,
  sendEnd,
}: UseWebRTCOptions) {
  //===============================================>
  // this is for reactive call state
  //===============================================>

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [callType, setCallType] = useState<CallType | null>(null);
  const [remoteUserId, setRemoteUserId] = useState<string | null>(null);
  const [remoteUser, setRemoteUser] = useState<CallPeer | null>(null);
  const [incomingOffer, setIncomingOffer] = useState<RTCSessionDescriptionInit | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  //===============================================>
  // this is for mutable rtc handles
  //===============================================>

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
  const remoteUserIdRef = useRef<string | null>(null);

  //===============================================>
  // this is for complete call cleanup
  //===============================================>

  const resetCallState = useCallback(() => {
    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;

    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;
    remoteStreamRef.current = null;

    pendingCandidatesRef.current = [];
    remoteUserIdRef.current = null;

    setLocalStream(null);
    setRemoteStream(null);
    setCallStatus('idle');
    setCallType(null);
    setRemoteUserId(null);
    setRemoteUser(null);
    setIncomingOffer(null);
    setIsAudioMuted(false);
    setIsVideoOff(false);
  }, []);

  //===============================================>
  // this is for local camera and microphone capture
  //===============================================>

  const getLocalMedia = useCallback(async (type: CallType) => {
    try {
      const constraints = type === 'video' ? MEDIA_CONSTRAINTS : AUDIO_ONLY_CONSTRAINTS;
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;
      setLocalStream(stream);
      setIsVideoOff(stream.getVideoTracks().length === 0);
      return stream;
    } catch (error) {
      if (type !== 'video' || !(error instanceof Error || error instanceof DOMException)) {
        throw error;
      }

      console.warn(
        '[WebRTC] Camera unavailable, continuing video call with camera off:',
        getMediaErrorMessage(error),
      );

      const audioOnlyStream = await navigator.mediaDevices.getUserMedia(AUDIO_ONLY_CONSTRAINTS);
      localStreamRef.current = audioOnlyStream;
      setLocalStream(audioOnlyStream);
      setIsVideoOff(true);
      return audioOnlyStream;
    }
  }, []);

  //===============================================>
  // this is for peer connection setup
  //===============================================>

  const createPeerConnection = useCallback(
    (targetUserId: string) => {
      peerConnectionRef.current?.close();

      const pc = new RTCPeerConnection(ICE_SERVERS);
      peerConnectionRef.current = pc;

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          sendCandidate(targetUserId, event.candidate.toJSON());
        }
      };

      pc.ontrack = (event) => {
        if (!remoteStreamRef.current) {
          remoteStreamRef.current = new MediaStream();
        }

        const remoteMedia = remoteStreamRef.current;
        const trackAlreadyAdded = remoteMedia
          .getTracks()
          .some((track) => track.id === event.track.id);

        if (!trackAlreadyAdded) {
          remoteMedia.addTrack(event.track);
        }

        setRemoteStream(new MediaStream(remoteMedia.getTracks()));
      };

      pc.onconnectionstatechange = () => {
        console.info('[WebRTC] Peer connection state:', pc.connectionState);
        if (pc.connectionState === 'failed') {
          resetCallState();
        }
      };

      return pc;
    },
    [resetCallState, sendCandidate],
  );

  //===============================================>
  // this is for media track helpers
  //===============================================>

  const attachLocalTracks = useCallback((pc: RTCPeerConnection, stream: MediaStream) => {
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));
  }, []);

  const ensureVideoNegotiation = useCallback(
    (pc: RTCPeerConnection, stream: MediaStream, type: CallType) => {
      if (type !== 'video' || stream.getVideoTracks().length > 0) return;

      const hasVideoTransceiver = pc
        .getTransceivers()
        .some((transceiver) => transceiver.receiver.track.kind === 'video');

      if (!hasVideoTransceiver) {
        pc.addTransceiver('video', { direction: 'recvonly' });
      }
    },
    [],
  );

  //===============================================>
  // this is for queued ice candidates
  //===============================================>

  const flushPendingCandidates = useCallback(async (pc: RTCPeerConnection) => {
    const candidates = [...pendingCandidatesRef.current];
    pendingCandidatesRef.current = [];

    await Promise.all(
      candidates.map((candidate) => pc.addIceCandidate(new RTCIceCandidate(candidate))),
    );
  }, []);

  //===============================================>
  // this is for starting an outgoing call
  //===============================================>

  const initiateCall = useCallback(
    async (targetUser: IdentifiableUser, type: CallType) => {
      const peer = toCallPeer(targetUser);
      if (!peer) {
        console.warn('[WebRTC] Cannot start call without a target user id:', targetUser);
        return;
      }

      resetCallState();
      remoteUserIdRef.current = peer._id;
      setRemoteUserId(peer._id);
      setRemoteUser(peer);
      setCallType(type);
      setCallStatus('calling');

      try {
        const stream = await getLocalMedia(type);
        const pc = createPeerConnection(peer._id);
        attachLocalTracks(pc, stream);
        ensureVideoNegotiation(pc, stream, type);

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        sendOffer(peer._id, offer, type);
      } catch (error) {
        resetCallState();
        throw error;
      }
    },
    [
      attachLocalTracks,
      createPeerConnection,
      ensureVideoNegotiation,
      getLocalMedia,
      resetCallState,
      sendOffer,
    ],
  );

  //===============================================>
  // this is for receiving an incoming call offer
  //===============================================>

  const handleIncomingCall = useCallback(
    ({ from, offer, type, callerName, callerAvatar }: IncomingCallInput) => {
      resetCallState();
      remoteUserIdRef.current = from;
      setRemoteUserId(from);
      setRemoteUser({ _id: from, name: callerName || 'Unknown Caller', avatar: callerAvatar });
      setCallType(type);
      setIncomingOffer(offer);
      setCallStatus('incoming');
    },
    [resetCallState],
  );

  //===============================================>
  // this is for accepting an incoming call
  //===============================================>

  const acceptCall = useCallback(async () => {
    if (!callType || !remoteUserId || !incomingOffer) return;

    try {
      const stream = await getLocalMedia(callType);
      const pc = createPeerConnection(remoteUserId);
      attachLocalTracks(pc, stream);

      await pc.setRemoteDescription(new RTCSessionDescription(incomingOffer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      sendAnswer(remoteUserId, answer);
      await flushPendingCandidates(pc);

      setIncomingOffer(null);
      setCallStatus('active');
    } catch (error) {
      resetCallState();
      throw error;
    }
  }, [
    attachLocalTracks,
    callType,
    createPeerConnection,
    flushPendingCandidates,
    getLocalMedia,
    incomingOffer,
    remoteUserId,
    resetCallState,
    sendAnswer,
  ]);

  //===============================================>
  // this is for rejecting an incoming call
  //===============================================>

  const rejectCall = useCallback(() => {
    const targetUserId = remoteUserIdRef.current;
    if (targetUserId) sendReject(targetUserId);
    resetCallState();
  }, [resetCallState, sendReject]);

  //===============================================>
  // this is for ending a local call
  //===============================================>

  const handleEndCall = useCallback(() => {
    const targetUserId = remoteUserIdRef.current;
    if (targetUserId) sendEnd(targetUserId);
    resetCallState();
  }, [resetCallState, sendEnd]);

  //===============================================>
  // this is for handling remote call cleanup
  //===============================================>

  const handleRemoteCallEnded = useCallback(() => {
    resetCallState();
  }, [resetCallState]);

  //===============================================>
  // this is for receiving call answers
  //===============================================>

  const handleCallAnswered = useCallback(
    async (answer: RTCSessionDescriptionInit) => {
      const pc = peerConnectionRef.current;
      if (!pc) return;

      await pc.setRemoteDescription(new RTCSessionDescription(answer));
      await flushPendingCandidates(pc);
      setCallStatus('active');
    },
    [flushPendingCandidates],
  );

  //===============================================>
  // this is for receiving ice candidates
  //===============================================>

  const handleNewIceCandidate = useCallback(async (candidate: RTCIceCandidateInit) => {
    const pc = peerConnectionRef.current;

    if (!pc || !pc.remoteDescription) {
      pendingCandidatesRef.current.push(candidate);
      return;
    }

    await pc.addIceCandidate(new RTCIceCandidate(candidate));
  }, []);

  //===============================================>
  // this is for microphone controls
  //===============================================>

  const toggleAudio = useCallback(() => {
    const audioTrack = localStreamRef.current?.getAudioTracks()[0];
    if (!audioTrack) return;

    audioTrack.enabled = !audioTrack.enabled;
    setIsAudioMuted(!audioTrack.enabled);
  }, []);

  //===============================================>
  // this is for camera controls
  //===============================================>

  const toggleVideo = useCallback(() => {
    const videoTrack = localStreamRef.current?.getVideoTracks()[0];
    if (!videoTrack) return;

    videoTrack.enabled = !videoTrack.enabled;
    setIsVideoOff(!videoTrack.enabled);
  }, []);

  //===============================================>
  // this is for unmount cleanup
  //===============================================>

  useEffect(() => resetCallState, [resetCallState]);

  //===============================================>
  // this is for public call api
  //===============================================>

  return useMemo(
    () => ({
      localStream,
      remoteStream,
      callStatus,
      callType,
      remoteUserId,
      remoteUser,
      isAudioMuted,
      isVideoOff,
      initiateCall,
      acceptCall,
      rejectCall,
      handleIncomingCall,
      handleCallAnswered,
      handleNewIceCandidate,
      handleEndCall,
      handleRemoteCallEnded,
      toggleAudio,
      toggleVideo,
    }),
    [
      localStream,
      remoteStream,
      callStatus,
      callType,
      remoteUserId,
      remoteUser,
      isAudioMuted,
      isVideoOff,
      initiateCall,
      acceptCall,
      rejectCall,
      handleIncomingCall,
      handleCallAnswered,
      handleNewIceCandidate,
      handleEndCall,
      handleRemoteCallEnded,
      toggleAudio,
      toggleVideo,
    ],
  );
}
