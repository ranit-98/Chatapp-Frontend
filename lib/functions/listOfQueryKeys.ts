/**
 * List of Query Keys to use inside React Query
 */


export const listOfQueryKeys = {
  auth: {
    login: "auth-login-query-key",
    register: "auth-register-query-key",
    forgotPassword: "auth-forgot-password-query-key",
    resetPassword: "auth-reset-password-query-key",
    profileDetails: "auth-profile-details-query-key",
    logout: "auth-logout-query-key"
  },
  chat: {
    chatRoomList: "chat-room-list-query-key",
    chatMessageList: "chat-message-list-query-key",
    chatSave: "chat-save-query-key"
  }
}