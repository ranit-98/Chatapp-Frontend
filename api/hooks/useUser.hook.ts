import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userUpdateProfileFn, userGetMeFn, userListFn } from '../functions/user.api';
import { authStore } from '@/zustand/auth.zustand';
import { AxiosResponse } from 'axios';

/**
 * useUserUpdateProfile - Hook for updating user profile
 */
export const useUserUpdateProfile = ({
  onSuccessCallback,
  onErrorCallback,
}: {
  onSuccessCallback?: () => void;
  onErrorCallback?: () => void;
} = {}) => {
  const { setUserData } = authStore.actions;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userUpdateProfileFn,
    onSuccess: (res: AxiosResponse) => {
      const { data } = res?.data || {};
      if (data) {
        setUserData(data);
        queryClient.setQueryData(['user-me'], data);
        onSuccessCallback?.();
      }
    },
    onError: () => {
      onErrorCallback?.();
    },
  });
};

/**
 * useGetMe - Hook for getting current user details
 */
export const useGetMe = () => {
  const { setUserData } = authStore.actions;

  return useQuery({
    queryKey: ['user-me'],
    queryFn: async () => {
      const res = await userGetMeFn();
      const { data } = res?.data || {};
      if (data) {
        setUserData(data);
      }
      return data;
    },
  });
};

/**
 * useUserList - Hook for getting all users
 */
export const useUserList = () => {
  return useQuery({
    queryKey: ['user-list'],
    queryFn: async () => {
      const res = await userListFn();
      return res?.data?.data || [];
    },
  });
};
