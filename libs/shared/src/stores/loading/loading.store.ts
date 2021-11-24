import { writable } from 'svelte/store';

//
export const loadingStore = writable(false);

//
export function showLoading() {
    loadingStore.update(val => val = true);
}

//
export function hideLoading() {
    loadingStore.update(val => val = false);
}