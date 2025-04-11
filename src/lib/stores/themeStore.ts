import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Create a writable store with an initial value of false
export const isDarkMode = writable(false);

// Function to toggle the theme
export function toggleTheme() {
    isDarkMode.update(value => {
        const newValue = !value;
        if (browser) {
            document.documentElement.classList.toggle('dark', newValue);
            localStorage.setItem('darkMode', newValue ? 'true' : 'false');
        }
        return newValue;
    });
}

// Function to initialize the theme based on user preference or saved setting
export function initializeTheme() {
    if (browser) {
        // Check for saved theme preference in localStorage
        const savedTheme = localStorage.getItem('darkMode');
        
        // If we have a saved preference, use it
        if (savedTheme !== null) {
            const isPreferDark = savedTheme === 'true';
            isDarkMode.set(isPreferDark);
            document.documentElement.classList.toggle('dark', isPreferDark);
        } 
        // Otherwise, use system preference
        else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            isDarkMode.set(prefersDark);
            document.documentElement.classList.toggle('dark', prefersDark);
        }
        
        // Listen for changes in system color scheme preference
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            // Only update if there's no saved preference
            if (localStorage.getItem('darkMode') === null) {
                isDarkMode.set(e.matches);
                document.documentElement.classList.toggle('dark', e.matches);
            }
        });
    }
} 