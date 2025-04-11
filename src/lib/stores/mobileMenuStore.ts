import { writable } from 'svelte/store';

// Create a writable store with an initial value of false
export const isMobileMenuOpen = writable(false);

// Function to toggle the mobile menu
export function toggleMobileMenu() {
    isMobileMenuOpen.update(value => !value);
}

// Function to close the mobile menu
export function closeMobileMenu() {
    isMobileMenuOpen.set(false);
}

// Function to open the mobile menu
export function openMobileMenu() {
    isMobileMenuOpen.set(true);
} 