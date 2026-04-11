// ─────────────────────────────────────────────────────────────
//  SocketService – Professional Singleton Socket.IO Manager
// ─────────────────────────────────────────────────────────────

import { io, Socket } from 'socket.io-client';
import { SocketEvents } from './socket-events';
import { baseUrl } from '@/api/endpoints';
import type {
    SendMessagePayload,
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

    private reattachListeners(): void {
        const reservedEvents = new Set(['connect', 'disconnect', 'connect_error']);
        this.listeners.forEach((callbacks, event) => {
            if (reservedEvents.has(event as string)) return;
            callbacks.forEach((cb) => {
                this.socket?.on(event as string, cb);
            });
        });
    }
}

export const socketService = new SocketService();
