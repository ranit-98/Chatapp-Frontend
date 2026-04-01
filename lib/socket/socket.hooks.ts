// ─────────────────────────────────────────────────────────────
//  Socket Hooks – Clean React abstractions over SocketService
//  These hooks handle all connection lifecycle, event subscriptions,
//  and typed data automatically.
// ─────────────────────────────────────────────────────────────

'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { socketService, SocketReceiveEvents } from './socket.service';
import { SocketEvents } from './socket-events';
import type {
    ChatMessage,
    UserTypingEvent,
    OnlineStatusPayload,
    MessageDeletedEvent,
    SendMessagePayload,
} from '@/typescript/types/chat.types';
import { encryptMessage } from '@/lib/utils/encryption';

// ── useSocketConnection ──────────────────────────────────────
/**
 * Manages the socket connection lifecycle.
 * Call this once at the top-level authenticated layout.
 */
export function useSocketConnection(): boolean {
    const [isConnected, setIsConnected] = useState(socketService.isConnected());

    useEffect(() => {
        if (!socketService.isConnected()) {
            socketService.connect();
        }

        const onConnect = () => setIsConnected(true);
        const onDisconnect = () => setIsConnected(false);

        socketService.on(SocketEvents.CONNECTION, onConnect);
        socketService.on(SocketEvents.DISCONNECT, onDisconnect);

        // Initial sync
        setIsConnected(socketService.isConnected());

        return () => {
            socketService.off(SocketEvents.CONNECTION, onConnect);
            socketService.off(SocketEvents.DISCONNECT, onDisconnect);
        };
    }, []);

    return isConnected;
}

// ── useSocketEvent ───────────────────────────────────────────
/**
 * Subscribe to a socket event with automatic cleanup.
 * @param event - The socket event to listen to
 * @param handler - Typed callback for the event payload
 */
export function useSocketEvent<K extends keyof SocketReceiveEvents>(
    event: K,
    handler: (data: SocketReceiveEvents[K]) => void
): void {
    // Keep handler stable so the effect doesn't re-run on every render
    const stableHandler = useRef(handler);
    stableHandler.current = handler;

    useEffect(() => {
        const cb = (data: SocketReceiveEvents[K]) => stableHandler.current(data);

        socketService.on(event, cb);

        return () => {
            socketService.off(event, cb);
        };
    }, [event]);
}

// ── usePresence ──────────────────────────────────────────────
/**
 * Global hook to sync online/offline status with React Query cache.
 * Call this in the main layout.
 */
export function usePresence() {
    const queryClient = useQueryClient();

    useSocketEvent(SocketEvents.ONLINE_STATUS, useCallback((event: OnlineStatusPayload) => {
        // Update user list cache (if any)
        queryClient.setQueriesData({ queryKey: ['user-list'] }, (old: any) => {
            if (!old) return old;
            return old.map((user: any) =>
                user._id === event.userId ? { ...user, status: event.status } : user
            );
        });

        // Update conversations cache (updates the 'otherUser' status)
        queryClient.setQueriesData({ queryKey: ['conversations'] }, (old: any) => {
            if (!old) return old;
            return old.map((conv: any) => {
                const updatedParticipants = conv.participants?.map((p: any) => {
                    const pId = typeof p === 'string' ? p : p._id;
                    if (pId === event.userId) {
                        return typeof p === 'string' ? p : { ...p, status: event.status };
                    }
                    return p;
                });
                return { ...conv, participants: updatedParticipants };
            });
        });
    }, [queryClient]));
}

// ── useConversation ──────────────────────────────────────────
/**
 * The primary hook for managing a single chat conversation.
 * Handles joining/leaving rooms, real-time messages, and typing indicators.
 */
export function useConversation(conversationId: string | undefined) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [typingUserIds, setTypingUserIds] = useState<Set<string>>(new Set());

    // ── Join / Leave room ────────────────────────────────────
    useEffect(() => {
        if (!conversationId) return;

        socketService.joinConversation(conversationId);

        return () => {
            socketService.leaveConversation(conversationId);
        };
    }, [conversationId]);

    // ── New messages ─────────────────────────────────────────
    useSocketEvent(SocketEvents.NEW_MESSAGE, useCallback((message: ChatMessage) => {
        const msgConvId = typeof message.conversation === 'string'
            ? message.conversation
            : (message.conversation as unknown as { _id: string })?._id;

        if (msgConvId !== conversationId) return;

        setMessages((prev) => {
            if (prev.some((m) => m._id === message._id)) return prev;
            return [...prev, message];
        });
    }, [conversationId]));

    // ── Message updated (edit/react) ─────────────────────────
    useSocketEvent(SocketEvents.MESSAGE_UPDATED, useCallback((updated: ChatMessage) => {
        const updatedConvId = typeof updated.conversation === 'string'
            ? updated.conversation
            : (updated.conversation as unknown as { _id: string })?._id;

        if (updatedConvId !== conversationId) return;

        setMessages((prev) =>
            prev.map((m) => (m._id === updated._id ? updated : m))
        );
    }, [conversationId]));

    // ── Message deleted ──────────────────────────────────────
    useSocketEvent(SocketEvents.MESSAGE_DELETED, useCallback((event: MessageDeletedEvent) => {
        if (event.conversationId !== conversationId) return;

        setMessages((prev) =>
            prev.map((m) =>
                m._id === event.messageId
                    ? { ...m, isDeleted: true, content: '' }
                    : m
            )
        );
    }, [conversationId]));

    // ── Typing indicators ─────────────────────────────────────
    useSocketEvent(SocketEvents.USER_TYPING, useCallback((event: UserTypingEvent) => {
        setTypingUserIds((prev) => {
            const next = new Set(prev);
            if (event.isTyping) next.add(event.userId);
            else next.delete(event.userId);
            return next;
        });
    }, []));

    // ── Actions ──────────────────────────────────────────────

    const sendMessage = useCallback((content: string, type: ChatMessage['type'] = 'text') => {
        if (!conversationId || !content.trim()) return;

        const payload: SendMessagePayload = {
            conversationId,
            content: encryptMessage(content.trim()),
            type,
        };

        socketService.sendMessage(payload);
    }, [conversationId]);

    const setTyping = useCallback((isTyping: boolean) => {
        if (!conversationId) return;
        socketService.setTyping(conversationId, isTyping);
    }, [conversationId]);

    const reactToMessage = useCallback((messageId: string, emoji: string) => {
        socketService.reactToMessage(messageId, emoji);
    }, []);

    const editMessage = useCallback((messageId: string, content: string) => {
        socketService.editMessage(messageId, encryptMessage(content));
    }, []);

    const deleteMessage = useCallback((messageId: string) => {
        socketService.deleteMessage(messageId);
    }, []);

    const setInitialMessages = useCallback((msgs: ChatMessage[]) => {
        setMessages(msgs);
    }, []);

    return {
        messages,
        typingUserIds,
        isAnyoneTyping: typingUserIds.size > 0,
        setInitialMessages,
        sendMessage,
        setTyping,
        reactToMessage,
        editMessage,
        deleteMessage,
    };
}
