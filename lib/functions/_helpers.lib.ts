import events from '@/json/events/events';
import eventEmitter from '@/services/event.emitter';
import { ToastVariant } from '@/typescript/enums/helper/index.enum';
import { BaseApiResponse } from '@/typescript/interfaces/common.interface';
import { AxiosError, AxiosResponse } from 'axios';
import dayjs from 'dayjs';
/**
 * Check if the window object exists.
 * @returns A function that checks if the window is undefined.
 */
export function checkWindow() {
  return typeof window !== 'undefined';
}

export function isInServer() {
  return typeof document === 'undefined';
}

export function isApple() {
  if (typeof navigator === 'undefined') {
    return false;
  }
  const platformExpression = /Mac|iPhone|iPod|iPad/i;
  const agent = navigator.userAgent;

  return platformExpression.test(agent);
}

export function isAppleSafari() {
  if (typeof navigator === 'undefined') {
    return false;
  }
  const rejectedExpression = /Chrome|Android|CriOS|FxiOS|EdgiOS/i;
  const expectedExpression = /Safari/i;

  const agent = navigator.userAgent;
  if (rejectedExpression.test(agent)) {
    return false;
  }

  return isApple() && expectedExpression.test(agent);
}

/**
 *
 * Global API Success message handler
 * @param response AxiosResponse<BaseApiResponse>
 */
export const globalCatchSuccess = (response: AxiosResponse<BaseApiResponse>) => {
  let message = 'Something went wrong';
  if (response?.data?.message) {
    message = response?.data.message;
  }
  eventEmitter.emit(events.showNotification, {
    message,
    variant: ToastVariant.SUCCESS,
  });
};

/**
 *
 * Global API Warning message handler
 * @param response AxiosResponse<BaseApiResponse>
 */
export const globalCatchWarning = (response: AxiosResponse<BaseApiResponse>) => {
  let message = 'Something went wrong';
  if (response?.data?.message) {
    message = response?.data.message;
  }

  eventEmitter.emit(events.showNotification, {
    message,
    variant: ToastVariant.WARNING,
  });
};

/**
 *
 * Global API Error message handler
 * @param error AxiosError<BaseApiResponse>
 */
export const globalCatchError = (error: AxiosError<BaseApiResponse>) => {
  let message = 'Something went wrong';
  if (error.response?.data?.message) {
    message = error.response?.data.message;
  }

  eventEmitter.emit(events.showNotification, {
    message,
    variant: ToastVariant.ERROR,
  });
};

export const formatDate = (dateString?: string | number | Date) => {
  if (!dateString) return 'N/A';

  const parsed = dayjs(dateString);
  if (!parsed.isValid()) return 'N/A';

  return parsed.format('D MMM YYYY');
};

export function formatDuration(minutes: number): string {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hrs > 0 && mins === 0) {
    return `${hrs}h`;
  }

  if (hrs === 0) {
    return `${mins}m`;
  }

  return `${hrs}h ${mins}m`;
}

export const generateBufferTimeDropdown = (hours: number, interval: number) => {
  const result: { id: number; label: string; value: string }[] = [];
  let id = 1;

  // Add 0 min option
  result.push({
    id: id++,
    label: '0 min',
    value: '0',
  });

  for (let minutes = interval; minutes <= hours * 60; minutes += interval) {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;

    const label = hrs > 0 ? `${hrs}h${mins > 0 ? ` ${mins}min` : ''}` : `${mins}min`;

    result.push({
      id: id++,
      label,
      value: String(minutes),
    });
  }

  return result;
};
