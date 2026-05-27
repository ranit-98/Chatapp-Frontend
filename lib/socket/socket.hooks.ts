// ─────────────────────────────────────────────────────────────
//  Socket Hooks – Clean React abstractions over SocketService
// ─────────────────────────────────────────────────────────────

'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { socketService } from './socket.service';
import { SocketEvents } from './socket-events';
import type {
    ChatMessage,
    UserTypingEvent,
    OnlineStatusPayload,
    MessageDeletedEvent,
    SendMessagePayload,
    Conversation,
} from '@/typescript/types/chat.types';
import type { SocketReceiveEvents, SocketListener } from '@/typescript/interfaces/socket.interface';
import { encryptMessage } from '@/lib/utils/encryption';

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

        setIsConnected(socketService.isConnected());

        return () => {
            socketService.off(SocketEvents.CONNECTION, onConnect);
            socketService.off(SocketEvents.DISCONNECT, onDisconnect);
        };
    }, []);

    return isConnected;
}

export function useSocketEvent<K extends keyof SocketReceiveEvents>(
    event: K,
    handler: SocketListener<SocketReceiveEvents[K]>,
): void {
    const stableHandler = useRef(handler);
    stableHandler.current = handler;

    useEffect(() => {
        const cb = (data: SocketReceiveEvents[K]) => stableHandler.current(data);
        socketService.on(event, cb);
        return () => socketService.off(event, cb);
    }, [event]);
}

export function usePresence() {
    const queryClient = useQueryClient();

    useSocketEvent(
        SocketEvents.ONLINE_STATUS,
        useCallback(
            (event: OnlineStatusPayload) => {
                const affectedIds = (event.userIds || (event.userId ? [event.userId] : [])).map(id => String(id));
                if (affectedIds.length === 0) return;

                console.debug(`[Presence] 📡 Processing ${event.status} status for:`, affectedIds);

                // 1. Update Current User
                queryClient.setQueriesData({ queryKey: ['user-me'] }, (old: any) => {
                    if (!old) return old;
                    const oldId = String(old._id || old.id || '');
                    if (affectedIds.includes(oldId)) {
                        console.debug(`[Presence] ✅ Updated 'user-me' status to ${event.status}`);
                        return { ...old, status: event.status };
                    }
                    return old;
                });

                // 2. Update User List
                queryClient.setQueriesData({ queryKey: ['user-list'] }, (old: any) => {
                    if (!old) return old;
                    let updated = false;
                    const next = old.map((user: any) => {
                        const uId = String(user._id || user.id || '');
                        if (affectedIds.includes(uId)) {
                            updated = true;
                            return { ...user, status: event.status };
                        }
                        return user;
                    });
                    if (updated) console.debug(`[Presence] ✅ Updated ${affectedIds.length} users in 'user-list'`);
                    return next;
                });

                // 3. Update Conversations
                queryClient.setQueriesData(
                    { queryKey: ['conversations'] },
                    (old: Conversation[] | undefined) => {
                        if (!old) return old;
                        return old.map((conv) => {
                            let convUpdated = false;
                            const updatedParticipants = conv.participants?.map((p) => {
                                const pId = String(typeof p === 'string' ? p : p._id || (p as any).id || '');
                                if (affectedIds.includes(pId)) {
                                    convUpdated = true;
                                    return typeof p === 'string' ? p : { ...p, status: event.status };
                                }
                                return p;
                            });
                            return convUpdated ? { ...conv, participants: updatedParticipants } : conv;
                        });
                    },
                );

                // 4. Fallback: Invalidate to ensure consistency
                // We use a slight delay to allow the manual cache updates to settle
                setTimeout(() => {
                    queryClient.invalidateQueries({ queryKey: ['user-list'], refetchType: 'none' });
                    queryClient.invalidateQueries({ queryKey: ['conversations'], refetchType: 'none' });
                }, 100);
            },
            [queryClient],
        ),
    );
}

export function useConversation(conversationId: string | undefined) {
    const queryClient = useQueryClient();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [typingUserIds, setTypingUserIds] = useState<Set<string>>(new Set());

    const isConnected = useSocketConnection();

    useEffect(() => {
        if (!conversationId || !isConnected) return;
        socketService.joinConversation(conversationId);
        return () => socketService.leaveConversation(conversationId);
    }, [conversationId, isConnected]);

    useSocketEvent(
        SocketEvents.NEW_MESSAGE,
        useCallback(
            (message: ChatMessage) => {
                const msgConvId =
                    typeof message.conversation === 'string'
                        ? message.conversation
                        : message.conversation?._id;

                if (msgConvId !== conversationId) return;

                setMessages((prev) => {
                    if (prev.some((m) => m._id === message._id)) return prev;
                    return [...prev, message];
                });

                // Update sidebar
                queryClient.invalidateQueries({ queryKey: ['conversations'] });
            },
            [conversationId, queryClient],
        ),
    );

    useSocketEvent(
        SocketEvents.MESSAGE_UPDATED,
        useCallback(
            (updated: ChatMessage) => {
                const updatedConvId =
                    typeof updated.conversation === 'string'
                        ? updated.conversation
                        : (updated.conversation as any)?._id;

                if (updatedConvId !== conversationId) return;

                setMessages((prev) => prev.map((m) => (m._id === updated._id ? updated : m)));
            },
            [conversationId],
        ),
    );

    useSocketEvent(
        SocketEvents.MESSAGE_DELETED,
        useCallback(
            (event: MessageDeletedEvent) => {
                if (event.conversationId !== conversationId) return;

                setMessages((prev) =>
                    prev.map((m) => (m._id === event.messageId ? { ...m, isDeleted: true, content: '' } : m)),
                );
            },
            [conversationId],
        ),
    );

    useSocketEvent(
        SocketEvents.USER_TYPING,
        useCallback((event: UserTypingEvent) => {
            setTypingUserIds((prev) => {
                const next = new Set(prev);
                if (event.isTyping) next.add(event.userId);
                else next.delete(event.userId);
                return next;
            });
        }, []),
    );

    const sendMessage = useCallback(
        (content: string, type: ChatMessage['type'] = 'text', repliedTo?: string) => {
            if (!conversationId || !content.trim()) return;

            const encodedContent = type === 'text' ? encryptMessage(content.trim()) : content.trim();

            const payload: SendMessagePayload = {
                conversationId,
                content: encodedContent,
                type,
                ...(repliedTo ? { repliedTo } : {}),
            };

            socketService.sendMessage(payload);
        },
        [conversationId],
    );

    const setTyping = useCallback(
        (isTyping: boolean) => {
            if (!conversationId) return;
            socketService.setTyping(conversationId, isTyping);
        },
        [conversationId],
    );

    const reactToMessage = useCallback((messageId: string, emoji: string) => {
        socketService.reactToMessage(messageId, emoji);
    }, []);

    const editMessage = useCallback((messageId: string, content: string) => {
        socketService.editMessage(messageId, encryptMessage(content));
    }, []);

    const deleteMessage = useCallback((messageId: string) => {
        socketService.deleteMessage(messageId);
    }, []);

    return {
        messages,
        typingUserIds,
        isAnyoneTyping: typingUserIds.size > 0,
        setInitialMessages: setMessages,
        sendMessage,
        setTyping,
        reactToMessage,
        editMessage,
        deleteMessage,
    };
}
