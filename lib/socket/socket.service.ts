// ─────────────────────────────────────────────────────────────
//  SocketService – Professional Singleton Socket.IO Manager
//  Features:
//    • Auto-reconnect with exponential backoff
//    • Emission queue – messages sent when offline are re-sent
//      once the connection is restored
//    • Fully typed emit/on methods via overloads
//    • Clean listener management to prevent memory leaks
// ─────────────────────────────────────────────────────────────

import { io, Socket } from 'socket.io-client';
import { SocketEvents } from './socket-events';
import { baseUrl } from '@/api/endpoints';
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

// ── Event Map (emit + receive) ───────────────────────────────

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

// ── Queued emission type ─────────────────────────────────────

interface QueuedEmission<K extends keyof SocketEmitEvents = keyof SocketEmitEvents> {
    event: K;
    data: SocketEmitEvents[K];
}

// ── SocketService Class ──────────────────────────────────────

class SocketService {
    private socket: Socket | null = null;
    private emissionQueue: QueuedEmission[] = [];

    /** Typed listener storage to prevent memory leaks */
    private listeners = new Map<string, Set<(...args: unknown[]) => void>>();

    // ── Connection ───────────────────────────────────────────

    public connect(options: { withCredentials?: boolean } = {}): void {
        if (this.socket?.connected) return;

        const socketUrl = (baseUrl ?? '').replace('/api', '');

        this.socket = io(socketUrl, {
            withCredentials: options.withCredentials ?? true,
            transports: ['websocket'],
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 10_000,
        });

        this.socket.on('connect', () => {
            console.info('[Socket] ✅ Connected to server');
            this.flushQueue();
            this.reattachListeners();
        });

        this.socket.on('disconnect', (reason: string) => {
            console.info(`[Socket] 🔴 Disconnected: ${reason}`);
        });

        this.socket.on('connect_error', (error: Error) => {
            console.warn('[Socket] ⚠️ Connection error:', error.message);
        });
    }

    public disconnect(): void {
        this.socket?.disconnect();
        this.socket = null;
        this.emissionQueue = [];
    }

    public isConnected(): boolean {
        return this.socket?.connected ?? false;
    }

    // ── Typed Emit ───────────────────────────────────────────

    public emit<K extends keyof SocketEmitEvents>(event: K, data: SocketEmitEvents[K]): void {
        if (!this.socket?.connected) {
            console.warn(`[Socket] ⏳ Queued emission (not connected): ${event}`);
            this.emissionQueue.push({ event, data } as QueuedEmission);
            return;
        }
        this.socket.emit(event, data);
    }

    // ── Typed On/Off ─────────────────────────────────────────

    public on<K extends keyof SocketReceiveEvents>(
        event: K,
        callback: (data: SocketReceiveEvents[K]) => void
    ): void {
        const key = event as string;
        if (!this.listeners.has(key)) {
            this.listeners.set(key, new Set());
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cb = callback as (...args: any[]) => void;
        this.listeners.get(key)!.add(cb);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.socket?.on(key, cb as any);
    }

    public off<K extends keyof SocketReceiveEvents>(
        event: K,
        callback?: (data: SocketReceiveEvents[K]) => void
    ): void {
        const key = event as string;
        if (callback) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const cb = callback as (...args: any[]) => void;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.socket?.off(key, cb as any);
            this.listeners.get(key)?.delete(cb);
        } else {
            this.socket?.off(key);
            this.listeners.delete(key);
        }
    }

    // ── Convenience Methods ──────────────────────────────────

    public joinConversation(conversationId: string): void {
        this.emit(SocketEvents.JOIN_CONVERSATION, { conversationId });
    }

    public leaveConversation(conversationId: string): void {
        this.emit(SocketEvents.LEAVE_CONVERSATION, { conversationId });
    }

    public sendMessage(payload: SendMessagePayload): void {
        this.emit(SocketEvents.SEND_MESSAGE, payload);
    }

    public setTyping(conversationId: string, isTyping: boolean): void {
        this.emit(SocketEvents.TYPING, { conversationId, isTyping });
    }

    public reactToMessage(messageId: string, emoji: string): void {
        this.emit(SocketEvents.REACT, { messageId, emoji });
    }

    public editMessage(messageId: string, content: string): void {
        this.emit(SocketEvents.EDIT_MESSAGE, { messageId, content });
    }

    public deleteMessage(messageId: string): void {
        this.emit(SocketEvents.DELETE_MESSAGE, { messageId });
    }

    public getSocket(): Socket | null {
        return this.socket;
    }

    // ── Private Helpers ──────────────────────────────────────

    /** Flush queued emissions after reconnect */
    private flushQueue(): void {
        if (this.emissionQueue.length === 0) return;
        console.info(`[Socket] Flushing ${this.emissionQueue.length} queued emissions`);
        const queue = [...this.emissionQueue];
        this.emissionQueue = [];
        for (const { event, data } of queue) {
            this.emit(event, data as SocketEmitEvents[typeof event]);
        }
    }

    /** Re-attach existing listeners after reconnect (skips reserved events) */
    private reattachListeners(): void {
        const reservedEvents = new Set(['connect', 'disconnect', 'connect_error']);
        this.listeners.forEach((callbacks, event) => {
            if (reservedEvents.has(event)) return;
            callbacks.forEach(cb => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                this.socket?.on(event, cb as any);
            });
        });
    }
}

// Singleton export
export const socketService = new SocketService();
