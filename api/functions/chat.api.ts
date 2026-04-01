import axiosInstance from "../axiosInstance";
import { endpoints } from "../endpoints";

/**
 * Get all conversations
 */
export const getConversationsFn = async () => {
    const res = await axiosInstance.get(endpoints.chat.conversations);
    return res;
};

/**
 * Get messages for a conversation
 */
export const getMessagesFn = async (conversationId: string, limit = 50, offset = 0) => {
    const res = await axiosInstance.get(
        (endpoints.chat.messages as (id: string) => string)(conversationId),
        { params: { limit, offset } }
    );
    return res;
};

/**
 * Initiate or find a conversation with a user
 */
export const initiateConversationFn = async (recipientId: string) => {
    const res = await axiosInstance.post(endpoints.chat.initiate, { recipientId });
    return res;
};

/**
 * Upload a file for a chat
 */
export const uploadChatFileFn = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axiosInstance.post(endpoints.chat.upload, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res;
};
