export enum SocketEvents {
    // --- Connection (Client Side) ---
    CONNECTION = 'connect',
    DISCONNECT = 'disconnect',
    ERROR = 'connect_error',

    // --- Conversations ---
    JOIN_CONVERSATION = 'join_conversation',
    LEAVE_CONVERSATION = 'leave_conversation',

    // --- Messages ---
    SEND_MESSAGE = 'send_message',
    NEW_MESSAGE = 'new_message',
    DELETE_MESSAGE = 'delete_message',
    EDIT_MESSAGE = 'edit_message',
    MESSAGE_UPDATED = 'message_updated',
    MESSAGE_DELETED = 'message_deleted',
    REACT = 'react',

    // --- Realtime States ---
    TYPING = 'typing',
    USER_TYPING = 'user_typing',
    ONLINE_STATUS = 'online_status',

    // --- WebRTC Signaling ---
    CALL_USER = 'call_user',
    ANSWER_CALL = 'answer_call',
    ICE_CANDIDATE = 'ice_candidate',
    INCOMING_CALL = 'incoming_call',
    CALL_ANSWERED = 'call_answered',
    CALL_REJECTED = 'call_rejected',
    CALL_ENDED = 'call_ended',
    END_CALL = 'end_call',
}
