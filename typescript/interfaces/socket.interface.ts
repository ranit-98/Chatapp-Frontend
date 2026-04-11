import { Socket } from 'socket.io-client';
import { SocketEvents } from '@/lib/socket/socket-events';
import type {
  ChatMessage,
  SendMessagePayload,
  TypingPayload,
  JoinConversationPayload,
  ReactPayload,
  EditMessagePayload,
  DeleteMessagePayload,
  UserTypingEvent,
  OnlineStatusPayload,
  MessageDeletedEvent,
  CallUserPayload,
  AnswerCallPayload,
  IceCandidatePayload,
  EndCallPayload,
  IncomingCallEvent,
  CallAnsweredEvent,
  IceCandidateEvent,
} from '@/typescript/types/chat.types';

/** Maps each SocketEvent to its expected payload type for emit calls */
export interface SocketEmitEvents {
  [SocketEvents.JOIN_CONVERSATION]: JoinConversationPayload;
  [SocketEvents.LEAVE_CONVERSATION]: JoinConversationPayload;
  [SocketEvents.SEND_MESSAGE]: SendMessagePayload;
  [SocketEvents.EDIT_MESSAGE]: EditMessagePayload;
  [SocketEvents.DELETE_MESSAGE]: DeleteMessagePayload;
  [SocketEvents.REACT]: ReactPayload;
  [SocketEvents.TYPING]: TypingPayload;
  [SocketEvents.CALL_USER]: CallUserPayload;
  [SocketEvents.ANSWER_CALL]: AnswerCallPayload;
  [SocketEvents.ICE_CANDIDATE]: IceCandidatePayload;
  [SocketEvents.CALL_REJECTED]: EndCallPayload;
  [SocketEvents.END_CALL]: EndCallPayload;
}

/** Maps each SocketEvent to its expected payload type for receive (on) calls */
export interface SocketReceiveEvents {
  [SocketEvents.NEW_MESSAGE]: ChatMessage;
  [SocketEvents.MESSAGE_UPDATED]: ChatMessage;
  [SocketEvents.MESSAGE_DELETED]: MessageDeletedEvent;
  [SocketEvents.USER_TYPING]: UserTypingEvent;
  [SocketEvents.ONLINE_STATUS]: OnlineStatusPayload;
  [SocketEvents.INCOMING_CALL]: IncomingCallEvent;
  [SocketEvents.CALL_ANSWERED]: CallAnsweredEvent;
  [SocketEvents.ICE_CANDIDATE]: IceCandidateEvent;
  [SocketEvents.CALL_REJECTED]: { from: string };
  [SocketEvents.CALL_ENDED]: { from: string };
  [SocketEvents.CONNECTION]: void;
  [SocketEvents.DISCONNECT]: string;
  [SocketEvents.ERROR]: Error;
}

export interface QueuedEmission<K extends keyof SocketEmitEvents = keyof SocketEmitEvents> {
  event: K;
  data: SocketEmitEvents[K];
}

export type SocketListener<T> = (data: T) => void;
