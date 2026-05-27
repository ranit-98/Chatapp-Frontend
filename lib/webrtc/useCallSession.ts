'use client';

import { SocketEvents } from '@/lib/socket/socket-events';
import { useSocketEvent } from '@/lib/socket/socket.hooks';
import { socketService } from '@/lib/socket/socket.service';
import type {
  CallAnsweredEvent,
  IceCandidateEvent,
  IncomingCallEvent,
} from '@/typescript/types/chat.types';
import { useCallback, useMemo } from 'react';
import { CallType, useWebRTC } from './useWebRTC';

//===============================================>
// this is for socket powered call signaling
//===============================================>

export function useCallSession() {
  //===============================================>
  // this is for outgoing signaling messages
  //===============================================>

  const signalingMethods = useMemo(
    () => ({
      sendOffer: (to: string, offer: RTCSessionDescriptionInit, type: CallType) => {
        socketService.callUser({ to, offer, type });
      },
      sendAnswer: (to: string, answer: RTCSessionDescriptionInit) => {
        socketService.answerCall({ to, answer });
      },
      sendCandidate: (to: string, candidate: RTCIceCandidateInit) => {
        socketService.sendIceCandidate({ to, candidate });
      },
      sendReject: (to: string) => {
        socketService.rejectCall({ to });
      },
      sendEnd: (to: string) => {
        socketService.endCall({ to });
      },
    }),
    [],
  );

  const webrtc = useWebRTC(signalingMethods);

  //===============================================>
  // this is for incoming call offers
  //===============================================>

  useSocketEvent(
    SocketEvents.INCOMING_CALL,
    useCallback(
      (event: IncomingCallEvent) => {
        console.info('🚨 [useCallSession] INCOMING_CALL event received:', {
          from: event.from,
          type: event.type,
          callerName: event.callerName,
        });
        webrtc.handleIncomingCall(event);
      },
      [webrtc],
    ),
  );

  //===============================================>
  // this is for received call answers
  //===============================================>

  useSocketEvent(
    SocketEvents.CALL_ANSWERED,
    useCallback(
      (event: CallAnsweredEvent) => {
        webrtc.handleCallAnswered(event.answer);
      },
      [webrtc],
    ),
  );

  //===============================================>
  // this is for received ice candidates
  //===============================================>

  useSocketEvent(
    SocketEvents.ICE_CANDIDATE,
    useCallback(
      (event: IceCandidateEvent) => {
        webrtc.handleNewIceCandidate(event.candidate);
      },
      [webrtc],
    ),
  );

  //===============================================>
  // this is for remote call rejection
  //===============================================>

  useSocketEvent(
    SocketEvents.CALL_REJECTED,
    useCallback(() => {
      webrtc.handleRemoteCallEnded();
    }, [webrtc]),
  );

  //===============================================>
  // this is for remote call ending
  //===============================================>

  useSocketEvent(
    SocketEvents.CALL_ENDED,
    useCallback(() => {
      webrtc.handleRemoteCallEnded();
    }, [webrtc]),
  );

  return webrtc;
}
