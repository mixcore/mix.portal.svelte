<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore, isAuthenticated, isLoading, authError } from '$lib/stores/authStore';
  import { AuthService } from '$lib/api/authService';
  
  // Form data
  let username = '';
  let password = '';
  let rememberMe = false;
  let externalProviders: string[] = [];
  
  // Redirects to dashboard if already authenticated
  $: if ($isAuthenticated) {
    goto('/dashboard');
  }
  
  // Load external providers on mount
  onMount(async () => {
    try {
      externalProviders = await AuthService.getExternalLoginProviders();
    } catch (error) {
      console.error('Failed to load external providers:', error);
    }
  });
  
  // Submit the login form
  async function handleSubmit() {
    if (!username || !password) return;
    
    try {
      const success = await authStore.login(username, password, rememberMe);
      if (success) {
        goto('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  }
</script>

<div class="w-full max-w-md mx-auto">
  <div class="space-y-8">
    <div>
      <h2 class="text-center text-3xl font-extrabold">
        Sign in to your account
      </h2>
      <p class="mt-2 text-center text-sm text-muted-foreground">
        Or <a href="/auth/register" class="font-medium text-primary hover:underline">
          create a new account
        </a>
      </p>
    </div>
    
    {#if $authError}
      <div class="bg-destructive/10 p-4 rounded-md text-sm text-destructive">
        {$authError.message}
      </div>
    {/if}
    
    <form class="space-y-6" on:submit|preventDefault={handleSubmit}>
      <div class="rounded-md shadow-sm -space-y-px">
        <div>
          <label for="username" class="sr-only">Username or Email</label>
          <input 
            id="username" 
            name="username" 
            type="text" 
            autocomplete="username" 
            required 
            bind:value={username}
            disabled={$isLoading}
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-input placeholder-muted-foreground text-foreground rounded-t-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 text-sm" 
            placeholder="Username or Email" 
          />
        </div>
        <div>
          <label for="password" class="sr-only">Password</label>
          <input 
            id="password" 
            name="password" 
            type="password" 
            autocomplete="current-password" 
            required 
            bind:value={password}
            disabled={$isLoading}
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-input placeholder-muted-foreground text-foreground rounded-b-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 text-sm" 
            placeholder="Password" 
          />
        </div>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <input 
            id="remember-me" 
            name="remember-me" 
            type="checkbox" 
            bind:checked={rememberMe}
            class="h-4 w-4 text-primary focus:ring-primary border-input rounded" 
          />
          <label for="remember-me" class="ml-2 block text-sm">
            Remember me
          </label>
        </div>

        <div class="text-sm">
          <a href="/auth/forgot-password" class="font-medium text-primary hover:underline">
            Forgot your password?
          </a>
        </div>
      </div>

      <div>
        <button 
          type="submit" 
          disabled={$isLoading}
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
        >
          {#if $isLoading}
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin h-5 w-5 text-primary/50" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            Signing in...
          {:else}
            Sign in
          {/if}
        </button>
      </div>
    </form>
    
    {#if externalProviders.length > 0}
      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-muted"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-background text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        
        <div class="mt-6 grid grid-cols-3 gap-3">
          {#each externalProviders as provider}
            <button 
              type="button"
              class="w-full inline-flex justify-center py-2 px-4 border border-input rounded-md shadow-sm bg-background text-sm font-medium text-muted-foreground hover:bg-muted/50"
            >
              {provider}
            </button>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</div> 