export const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL;
export const frontUrl = process.env.NEXT_PUBLIC_APP_FRONTEND_BASE_URL;
export const baseUrlApi = process.env.NEXT_PUBLIC_APP_BASE_URL;
export const baseUrlMedia = process.env.NEXT_PUBLIC_APP_MEDIA_BASE_URL;
export const clientSideUrl = process.env.NEXT_PUBLIC_APP_CLIENT_SIDE_BASE_URL;
export const cmsSideUrl = process.env.NEXT_PUBLIC_APP_CMS_SIDE_BASE_URL;

// api doc => https://vishmo.dedicateddevelopers.us/apidoc

export const mediaUrl = (url: string) => {
  if (!url) return '';
  const sanitizedUrl = url.startsWith('/') ? url.slice(1) : url;
  return `${baseUrlMedia}/${sanitizedUrl}`;
};

export type TAPIVersions = 'v1';

export const endpoints = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    logout: '/auth/logout',
    profileDetails: '/auth/me',
  },
  user: {
    me: '/users/me',
    updateProfile: '/users/profile',
    list: '/users',
  },
  chat: {
    conversations: '/chat/conversations',
    messages: (id: string) => `/chat/messages/${id}`,
    initiate: '/chat/conversation',
    upload: '/chat/upload',
  },
};

export const successNotificationEndPoints = [
  endpoints.auth.login,
  endpoints.auth.logout,
  endpoints.auth.register,
];
