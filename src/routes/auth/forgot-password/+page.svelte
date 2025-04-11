<script lang="ts">
  import { goto } from '$app/navigation';
  import { authStore, isAuthenticated, isLoading, authError } from '$lib/stores/authStore';
  
  // Form data
  let email = '';
  let submitted = false;
  
  // Redirects to dashboard if already authenticated
  $: if ($isAuthenticated) {
    goto('/dashboard');
  }
  
  // Submit the forgot password form
  async function handleSubmit() {
    if (!email) return;
    
    try {
      const success = await authStore.forgotPassword(email);
      if (success) {
        submitted = true;
      }
    } catch (error) {
      console.error('Forgot password error:', error);
    }
  }
</script>

<div class="w-full max-w-md mx-auto">
  <div class="space-y-8">
    <div>
      <h2 class="text-center text-3xl font-extrabold">
        Reset your password
      </h2>
      <p class="mt-2 text-center text-sm text-muted-foreground">
        Enter your email and we'll send you a link to reset your password
      </p>
    </div>
    
    {#if submitted}
      <div class="bg-success/10 p-4 rounded-md">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-success">
              Reset email sent
            </h3>
            <div class="mt-2 text-sm text-success-foreground">
              <p>
                If your email exists in our system, you will receive a password reset link shortly. Please check your email.
              </p>
            </div>
            <div class="mt-4">
              <a href="/auth/login" class="text-sm font-medium text-success hover:underline">
                Return to login
              </a>
            </div>
          </div>
        </div>
      </div>
    {:else}
      {#if $authError}
        <div class="bg-destructive/10 p-4 rounded-md text-sm text-destructive">
          {$authError.message}
        </div>
      {/if}
      
      <form class="space-y-6" on:submit|preventDefault={handleSubmit}>
        <div>
          <label for="email" class="block text-sm font-medium">Email address</label>
          <div class="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              bind:value={email}
              disabled={$isLoading}
              class="appearance-none block w-full px-3 py-2 border border-input rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={!email || $isLoading}
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
          >
            {#if $isLoading}
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-primary-foreground" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            {:else}
              Send reset link
            {/if}
          </button>
        </div>
        
        <div class="text-sm text-center">
          <a href="/auth/login" class="font-medium text-primary hover:underline">
            Back to login
          </a>
        </div>
      </form>
    {/if}
  </div>
</div> 