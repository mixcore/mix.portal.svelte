import { writable } from 'svelte/store';

export interface IToastOption {
  id?: string;
  title?: string;
  subTitle?: string;
  timeOut?: number;
  time?: Date;
  kind?:
    | 'error'
    | 'info'
    | 'info-square'
    | 'success'
    | 'warning'
    | 'warning-alt';
}

export const toastStore = writable([] as IToastOption[]);

export function showGlobalToastNotification(value: IToastOption) {
  let time = new Date();
  let defaultTimeOut = 5000;

  value.time = time;
  value.id = time.toISOString();
  value.timeOut = value.timeOut ?? defaultTimeOut;

  toastStore.update((val) => [...val, value]);
}

export function removeNotification(id: string) {
  toastStore.update((val) => val.filter(t => t.id !== id));
}