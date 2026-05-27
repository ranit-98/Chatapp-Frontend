// ─────────────────────────────────────────────────────────────
//  SocketService – Professional Singleton Socket.IO Manager
// ─────────────────────────────────────────────────────────────

import { io, Socket } from 'socket.io-client';
import { SocketEvents } from './socket-events';
import { baseUrl } from '@/api/endpoints';
import type {
    SendMessagePayload,
    CallUserPayload,
    AnswerCallPayload,
    IceCandidatePayload,
    EndCallPayload,
} from '@/typescript/types/chat.types';
import type {
    SocketEmitEvents,
    SocketReceiveEvents,
    QueuedEmission,
    SocketListener,
} from '@/typescript/interfaces/socket.interface';

class SocketService {
    private socket: Socket | null = null;
    private emissionQueue: QueuedEmission[] = [];
    private listeners = new Map<keyof SocketReceiveEvents, Set<SocketListener<unknown>>>();

    public connect(options: { withCredentials?: boolean } = {}): void {
        // Guard against both connected AND connecting sockets to prevent duplicate instances
        if (this.socket) {
            console.debug('[Socket] Socket instance already exists, skipping connect. Connected:', this.socket.connected);
            return;
        }

        const socketUrl = (baseUrl ?? '').replace('/api', '');
        console.info(`🔌 [Socket] Connecting to: ${socketUrl} | BaseUrl: ${baseUrl}`);

        this.socket = io(socketUrl, {
            withCredentials: options.withCredentials ?? true,
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

        // Debug: Log all incoming events
        this.socket.onAny((event, ...args) => {
            console.debug(`📡 [Socket RX] ${event}:`, args);
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

    public emit<K extends keyof SocketEmitEvents>(event: K, data: SocketEmitEvents[K]): void {
        if (!this.socket?.connected) {
            this.emissionQueue.push({ event, data } as QueuedEmission);
            return;
        }
        this.socket.emit(event, data);
    }

    public on<K extends keyof SocketReceiveEvents>(
        event: K,
        callback: SocketListener<SocketReceiveEvents[K]>,
    ): void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }

        const castedCallback = callback as SocketListener<unknown>;
        this.listeners.get(event)!.add(castedCallback);
        this.socket?.on(event as string, castedCallback);
    }

    public off<K extends keyof SocketReceiveEvents>(
        event: K,
        callback?: SocketListener<SocketReceiveEvents[K]>,
    ): void {
        if (callback) {
            const castedCallback = callback as SocketListener<unknown>;
            this.socket?.off(event as string, castedCallback);
            this.listeners.get(event)?.delete(castedCallback);
        } else {
            this.socket?.off(event as string);
            this.listeners.delete(event);
        }
    }

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

    private flushQueue(): void {
        if (this.emissionQueue.length === 0) return;
        const queue = [...this.emissionQueue];
        this.emissionQueue = [];
        queue.forEach(({ event, data }) => this.emit(event, data));
    }

    // --- WebRTC Signaling ---

    public callUser(payload: CallUserPayload): void {
        this.emit(SocketEvents.CALL_USER, payload);
    }

    public answerCall(payload: AnswerCallPayload): void {
        this.emit(SocketEvents.ANSWER_CALL, payload);
    }

    public sendIceCandidate(payload: IceCandidatePayload): void {
        this.emit(SocketEvents.ICE_CANDIDATE, payload);
    }

    public rejectCall(payload: EndCallPayload): void {
        this.emit(SocketEvents.CALL_REJECTED, payload);
    }

    public endCall(payload: EndCallPayload): void {
        this.emit(SocketEvents.END_CALL, payload);
    }

    private reattachListeners(): void {
        const reservedEvents = new Set(['connect', 'disconnect', 'connect_error']);
        this.listeners.forEach((callbacks, event) => {
            if (reservedEvents.has(event as string)) return;

            // Clear existing listeners for this event to avoid duplicates during reconnection
            this.socket?.removeAllListeners(event as string);

            callbacks.forEach((cb) => {
                this.socket?.on(event as string, cb);
            });
        });
        console.debug(`[Socket] Reattached listeners for ${this.listeners.size} events`);
    }
}

export const socketService = new SocketService();
