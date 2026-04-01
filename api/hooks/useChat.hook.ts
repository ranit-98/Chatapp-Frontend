import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getConversationsFn, getMessagesFn, initiateConversationFn } from "../functions/chat.api";

/**
 * useGetConversations - Hook to fetch all user conversations
 */
export const useGetConversations = () => {
    return useQuery({
        queryKey: ['conversations'],
        queryFn: async () => {
            const res = await getConversationsFn();
            return res?.data?.data || [];
        }
    });
};

/**
 * useGetMessages - Hook to fetch messages for a specific conversation
 */
export const useGetMessages = (conversationId: string) => {
    return useQuery({
        queryKey: ['messages', conversationId],
        queryFn: async () => {
            if (!conversationId) return [];
            const res = await getMessagesFn(conversationId);
            return res?.data?.data || [];
        },
        enabled: !!conversationId
    });
};

/**
 * useInitiateConversation - Hook to start/find a conversation with a user
 */
export const useInitiateConversation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: initiateConversationFn,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
        }
    });
};
