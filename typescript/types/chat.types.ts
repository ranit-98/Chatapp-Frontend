// ─────────────────────────────────────────────────────────────
//  Chat Domain Types
// ─────────────────────────────────────────────────────────────

export type UserStatus = 'online' | 'offline' | 'away';

export interface ChatUser {
  _id: string;
  id?: string;
  name: string;
  email: string;
  avatar?: string;
  profile_image?: string;
  status?: UserStatus;
}

export interface MessageReaction {
  emoji: string;
  userId: string;
}

export interface ChatMessage {
  _id: string;
  conversation: string | { _id: string };
  sender: ChatUser | string;
  content: string;
  type: 'text' | 'image' | 'file' | 'audio' | 'video';
  reactions: MessageReaction[];
  isEdited: boolean;
  isDeleted: boolean;
  repliedTo?: string | ChatMessage;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  _id: string;
  participants: ChatUser[];
  type: 'direct' | 'group';
  lastMessage?: ChatMessage | string;
  unreadCount?: number;
  updatedAt: string;
  createdAt: string;
}

// ── Socket Payload Types ─────────────────────────────────────

export interface SendMessagePayload {
  conversationId: string;
  content: string;
  type: ChatMessage['type'];
  repliedTo?: string;
}

export interface TypingPayload {
  conversationId: string;
  isTyping: boolean;
}

export interface UserTypingEvent {
  userId: string;
  isTyping: boolean;
}

export interface OnlineStatusPayload {
  userId?: string;
  userIds?: string[];
  status: 'online' | 'offline';
}

export interface JoinConversationPayload {
  conversationId: string;
}

export interface ReactPayload {
  messageId: string;
  emoji: string;
}

export interface EditMessagePayload {
  messageId: string;
  content: string;
}

export interface DeleteMessagePayload {
  messageId: string;
}

export interface MessageDeletedEvent {
  messageId: string;
  conversationId: string;
}

export interface CallUserPayload {
  to: string;
  offer: RTCSessionDescriptionInit;
  type: 'audio' | 'video';
}

export interface AnswerCallPayload {
  to: string;
  answer: RTCSessionDescriptionInit;
}

export interface IceCandidatePayload {
  to: string;
  candidate: RTCIceCandidateInit;
}

export interface EndCallPayload {
  to: string;
}

export interface IncomingCallEvent {
  from: string;
  offer: RTCSessionDescriptionInit;
  type: 'audio' | 'video';
  callerName?: string;
  callerAvatar?: string;
}

export interface CallAnsweredEvent {
  from: string;
  answer: RTCSessionDescriptionInit;
}

export interface IceCandidateEvent {
  from: string;
  candidate: RTCIceCandidateInit;
}
