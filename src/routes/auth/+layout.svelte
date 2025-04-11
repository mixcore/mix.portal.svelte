<script lang="ts">
  import { onMount } from 'svelte';
  
  // Ensure proper theme handling for auth screens
  import { browser } from '$app/environment';
  import { isDarkMode, initializeTheme } from '$lib/stores/themeStore';
  import { initializeThemeVariables } from '$lib/utils';
  
  // Handle image error
  function handleImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = '/favicon.png';
  }
  
  // Initialize theme
  onMount(() => {
    initializeTheme();
    initializeThemeVariables();
    
    // You could initialize tracking, analytics, etc.
    console.log('Auth layout mounted');
  });
</script>

{#if browser}
<div class={`min-h-screen ${$isDarkMode ? 'dark' : ''}`}>
  <div class="min-h-screen bg-background text-foreground flex flex-col">
    <!-- Auth header with logo -->
    <header class="border-b">
      <div class="container mx-auto py-4 px-4 flex justify-center">
        <a href="/" class="flex items-center">
          <img src="/logo.png" alt="Mixcore" class="h-8 w-auto sm:h-10" on:error={handleImageError}>
          <span class="ml-3 text-xl font-bold">Mixcore CMS</span>
        </a>
      </div>
    </header>

    <!-- Main content area -->
    <main class="flex-1 flex items-center justify-center py-12 px-4">
      <slot />
    </main>

    <!-- Auth footer -->
    <footer class="py-6 border-t">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Mixcore. All rights reserved.
          </p>
          <div class="flex items-center space-x-4 mt-4 md:mt-0">
            <a href="/terms" class="text-sm text-muted-foreground hover:underline">Terms</a>
            <a href="/privacy" class="text-sm text-muted-foreground hover:underline">Privacy</a>
            <a href="/help" class="text-sm text-muted-foreground hover:underline">Help</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</div>
{/if} 