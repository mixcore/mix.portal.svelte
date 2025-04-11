<script lang="ts">
  import { goto } from '$app/navigation';
  import { authStore, isAuthenticated, isLoading, authError } from '$lib/stores/authStore';
  
  // Form data
  let name = '';
  let email = '';
  let password = '';
  let confirmPassword = '';
  
  // Redirects to dashboard if already authenticated
  $: if ($isAuthenticated) {
    goto('/dashboard');
  }
  
  // Validation
  $: passwordsMatch = password === confirmPassword;
  $: formValid = name && email && password && confirmPassword && passwordsMatch;
  
  // Submit the registration form
  async function handleSubmit() {
    if (!formValid) return;
    
    try {
      const success = await authStore.register(name, email, password);
      if (success) {
        goto('/auth/login?registered=true');
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  }
</script>

<div class="w-full max-w-md mx-auto">
  <div class="space-y-8">
    <div>
      <h2 class="text-center text-3xl font-extrabold">
        Create your account
      </h2>
      <p class="mt-2 text-center text-sm text-muted-foreground">
        Or <a href="/auth/login" class="font-medium text-primary hover:underline">
          sign in to your account
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
          <label for="name" class="sr-only">Full Name</label>
          <input 
            id="name" 
            name="name" 
            type="text" 
            required 
            bind:value={name}
            disabled={$isLoading}
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-input placeholder-muted-foreground text-foreground rounded-t-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 text-sm" 
            placeholder="Full Name" 
          />
        </div>
        <div>
          <label for="email" class="sr-only">Email address</label>
          <input 
            id="email" 
            name="email" 
            type="email" 
            autocomplete="email" 
            required 
            bind:value={email}
            disabled={$isLoading}
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-input placeholder-muted-foreground text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 text-sm" 
            placeholder="Email address" 
          />
        </div>
        <div>
          <label for="password" class="sr-only">Password</label>
          <input 
            id="password" 
            name="password" 
            type="password" 
            autocomplete="new-password" 
            required 
            bind:value={password}
            disabled={$isLoading}
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-input placeholder-muted-foreground text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 text-sm" 
            placeholder="Password" 
          />
        </div>
        <div>
          <label for="confirm-password" class="sr-only">Confirm Password</label>
          <input 
            id="confirm-password" 
            name="confirm-password" 
            type="password" 
            autocomplete="new-password" 
            required 
            bind:value={confirmPassword}
            disabled={$isLoading}
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-input placeholder-muted-foreground text-foreground rounded-b-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 text-sm" 
            placeholder="Confirm Password" 
          />
        </div>
      </div>

      {#if confirmPassword && !passwordsMatch}
        <div class="text-destructive text-sm">
          Passwords don't match
        </div>
      {/if}

      <div>
        <button 
          type="submit" 
          disabled={!formValid || $isLoading}
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
        >
          {#if $isLoading}
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin h-5 w-5 text-primary/50" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            Creating account...
          {:else}
            Create account
          {/if}
        </button>
      </div>
      
      <div class="text-sm text-center text-muted-foreground">
        By creating an account, you agree to our <a href="/terms" class="font-medium text-primary hover:underline">Terms of Service</a> and <a href="/privacy" class="font-medium text-primary hover:underline">Privacy Policy</a>
      </div>
    </form>
  </div>
</div> 