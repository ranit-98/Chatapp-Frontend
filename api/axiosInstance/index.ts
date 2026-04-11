import { BaseApiResponse } from '@/typescript/interfaces/common.interface';
import {
  globalCatchError,
  globalCatchSuccess,
  globalCatchWarning,
} from '@/lib/functions/_helpers.lib';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { baseUrlApi, successNotificationEndPoints } from '../endpoints';

let abortController = new AbortController();
let isHandlingServerError = false;

const axiosInstance = axios.create({
  baseURL: baseUrlApi,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  config.signal = abortController.signal;

  return config;
});

axiosInstance.interceptors.response.use(
  (res: AxiosResponse) => {
    if (successNotificationEndPoints.includes(res.config.url as string)) {
      if (res?.data?.statusCode !== 200) {
        globalCatchWarning(res);
      } else {
        globalCatchSuccess(res);
      }
    }

    return res;
  },
  async (error: AxiosError<BaseApiResponse>) => {
    if (isHandlingServerError) {
      return Promise.reject(error);
    }

    if (error?.response?.status && error.response.status >= 500) {
      isHandlingServerError = true;

      abortController.abort();
      abortController = new AbortController();

      globalCatchError(error);

      setTimeout(() => {
        isHandlingServerError = false;
      }, 1000);
    } else {
      globalCatchError(error);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
