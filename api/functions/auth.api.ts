import axiosInstance from '../axiosInstance';
import { endpoints } from '../endpoints';
import {
  IAuthLoginParamType,
  IAuthLoginResponse,
  IAuthProfileDetailsResponse,
  IAuthRegisterParamType,
  IAuthRegisterResponse,
} from '@/typescript/interfaces/auth.interface';

/**
 * @param body Object {
    name: string;
    email: string;
    password: string;
  }
 * @returns AxiosResponse<IAuthRegisterResponse>
 */
export const authRegisterFn = async (body: IAuthRegisterParamType) => {
  const res = await axiosInstance.post<IAuthRegisterResponse>(endpoints.auth.register, body);

  return res;
};

/**
 * @param body Object {
    email: string;
    password: string;
  }
 * @returns AxiosResponse<IAuthLoginResponse>
 */
export const authLoginFn = async (body: IAuthLoginParamType) => {
  const res = await axiosInstance.post<IAuthLoginResponse>(endpoints.auth.login, body);

  return res;
};

/**
 * @returns AxiosResponse<IAuthLoginResponse>
 */
export const authLogoutFn = async () => {
  const res = await axiosInstance.post<IAuthLoginResponse>(endpoints.auth.logout);

  return res;
};

/**
 * @returns AxiosResponse<IAuthProfileDetailsResponse>
 */
export const authProfileDetailsFn = async () => {
  const res = await axiosInstance.get<IAuthProfileDetailsResponse>(endpoints.auth.profileDetails);

  return res;
};
