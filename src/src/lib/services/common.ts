import { writable } from 'svelte/store';
import { getApiResult } from './api';
import type { ApiResponse } from '$lib/types';

// Settings store
export const settings = writable<Record<string, any>>({});

// Toast notification store
type ToastType = 'info' | 'success' | 'warning' | 'error';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export const toasts = writable<Toast[]>([]);

export function showToast(message: string, type: ToastType = 'info'): void {
  const id = Date.now().toString();
  toasts.update(t => [...t, { id, message, type }]);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    toasts.update(t => t.filter(toast => toast.id !== id));
  }, 5000);
}
export function showMessage(message: string, type: ToastType = 'info'): void {
  const id = Date.now().toString();
  toasts.update(t => [...t, { id, message, type }]);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    toasts.update(t => t.filter(toast => toast.id !== id));
  }, 5000);
}

export function showSuccess(message: string): void {
  showToast(message, 'success');
}

export function showWarning(message: string): void {
  showToast(message, 'warning');
}

export function showError(message: string): void {
  showToast(message, 'error');
}

export function showErrors(errors: string[]): void {
  if (errors && errors.length > 0) {
    errors.forEach(error => showError(error));
  }
}

// Loading indicator store
export const isBusy = writable(false);

// Settings service
export async function fillAllSettings(): Promise<void> {
  isBusy.set(true);
  
  try {
    const result = await getApiResult<Record<string, any>>({
      method: 'GET',
      url: '/api/settings'
    });
    
    if (result.isSucceed && result.data) {
      settings.set(result.data);
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  } finally {
    isBusy.set(false);
  }
}

// Navigate helper to match your original goToSiteUrl functionality
export function goToSiteUrl(url: string): void {
  window.location.href = url;
}