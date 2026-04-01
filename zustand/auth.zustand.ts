
import { TLoginWithPasswordUser } from '@/typescript/types/authentication.type';
import { createStore } from 'zustand-x';

interface AuthStore {
  isLoggedIn: boolean;
  userData: TLoginWithPasswordUser | null;
}

const initialState: AuthStore = {
  isLoggedIn: false,
  userData: null,
};

export const authStore = createStore<AuthStore>(initialState, {
  name: 'authStore',
  persist: true,
  mutative: true,
}).extendActions(api => ({
  setIsLoggedIn: (isLoggedIn: boolean) => {
    api.set('isLoggedIn', isLoggedIn);
  },
  setUserData: (userData: TLoginWithPasswordUser | null) => {
    api.set('userData', userData);
  },

  reset: () => {
    api.set('isLoggedIn', false);
    api.set('userData', null);
  },
}));
