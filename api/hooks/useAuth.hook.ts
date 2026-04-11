import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authLoginFn, authRegisterFn, authLogoutFn } from '../functions/auth.api';
import { listOfQueryKeys } from '@/lib/functions/listOfQueryKeys';
import { authStore } from '@/zustand/auth.zustand';
import { HttpStatusCode } from '@/typescript/interfaces/common.interface';
import { AxiosResponse } from 'axios';
import { IAuthLoginResponse, IAuthRegisterResponse } from '@/typescript/interfaces/auth.interface';

/**
 * useAuthLogin - Hook for user login
 */
export const useAuthLogin = ({
  onSuccessCallback,
  onErrorCallback,
}: {
  onSuccessCallback?: () => void;
  onErrorCallback?: () => void;
}) => {
  const router = useRouter();
  const { setUserData, setIsLoggedIn } = authStore.actions;

  return useMutation({
    mutationKey: [listOfQueryKeys.auth.login],
    mutationFn: authLoginFn,
    onSuccess: (res: AxiosResponse<IAuthLoginResponse>) => {
      const { statusCode, data } = res?.data || {};

      if (statusCode === HttpStatusCode.Ok || statusCode === HttpStatusCode.Created) {
        if (data) {
          setUserData(data);
          setIsLoggedIn(true);
          onSuccessCallback?.();
          router.push('/chat'); // Default route to chat
        } else {
          onErrorCallback?.();
        }
      }
    },
    onError: () => {
      onErrorCallback?.();
    },
  });
};

/**
 * useAuthRegister - Hook for user registration
 */
export const useAuthRegister = ({
  onSuccessCallback,
  onErrorCallback,
}: {
  onSuccessCallback?: () => void;
  onErrorCallback?: () => void;
}) => {
  const router = useRouter();
  const { setUserData, setIsLoggedIn } = authStore.actions;

  return useMutation({
    mutationKey: [listOfQueryKeys.auth.register],
    mutationFn: authRegisterFn,
    onSuccess: (res: AxiosResponse<IAuthRegisterResponse>) => {
      const { statusCode, data } = res?.data || {};

      if (statusCode === HttpStatusCode.Created || statusCode === HttpStatusCode.Ok) {
        if (data) {
          setUserData(data);
          setIsLoggedIn(true);
          onSuccessCallback?.();
          router.push('/chat');
        } else {
          onErrorCallback?.();
        }
      }
    },
    onError: () => {
      onErrorCallback?.();
    },
  });
};

/**
 * useAuthLogout - Hook for user logout
 */
export const useAuthLogout = () => {
  const router = useRouter();
  const { reset } = authStore.actions;
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [listOfQueryKeys.auth.logout],
    mutationFn: authLogoutFn,
    onSuccess: () => {
      reset();
      queryClient.clear();
      router.push('/');
    },
  });
};
