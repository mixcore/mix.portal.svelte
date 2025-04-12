<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore, isAuthenticated, isLoading, authError } from '$lib/stores/authStore';
  import { AuthService } from '$lib/api/authService';
  import { CryptoService } from '$lib/api/cryptoService';
  import { page } from '$app/stores';
  
  // Form data
  let username = '';
  let email = '';
  let phoneNumber = '';
  let password = '';
  let rememberMe = false;
  let returnUrl = '';
  let externalProviders: string[] = [];
  let loginStatus = '';
  let isDirectLogin = false;
  let loginMethod = 'username'; // 'username', 'email', or 'phone'
  
  // Get return URL from query params
  $: if ($page.url.searchParams) {
    const queryReturnUrl = $page.url.searchParams.get('returnUrl');
    if (queryReturnUrl) {
      returnUrl = decodeURIComponent(queryReturnUrl);
    }
  }
  
  // Redirects to dashboard if already authenticated
  $: if ($isAuthenticated) {
    // If we have a return URL, go there
    if (returnUrl) {
      goto(returnUrl);
    } else {
      goto('/dashboard');
    }
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
    if (validateForm() === false) return;
    
    loginStatus = '';
    
    try {
      const success = await authStore.login(
        loginMethod === 'username' ? username : '',
        password,
        rememberMe,
        loginMethod === 'email' ? email : '',
        loginMethod === 'phone' ? phoneNumber : '',
        returnUrl
      );
      
      if (success) {
        loginStatus = 'Login successful! Redirecting...';
        if (returnUrl) {
          goto(returnUrl);
        } else {
          goto('/dashboard');
        }
      } else {
        loginStatus = $authError ? $authError.message : 'Login failed. Please check your credentials.';
      }
    } catch (error) {
      console.error('Login error:', error);
      loginStatus = 'An error occurred during login. Please try again.';
    }
  }
  
  // Direct login using fetch (for testing unsecure endpoint)
  async function handleDirectLogin() {
    if (validateForm() === false) return;
    
    loginStatus = 'Attempting direct login...';
    
    try {
      // Prepare login data according to API specification
      const data = {
        email: loginMethod === 'email' ? email : '',
        userName: loginMethod === 'username' ? username : '',
        phoneNumber: loginMethod === 'phone' ? phoneNumber : '',
        password: password,
        rememberMe: rememberMe,
        returnUrl: returnUrl
      };
      
      console.log('[Direct Login] Request payload:', data);
      
      const response = await fetch('https://mixcore.net/api/v2/rest/auth/user/login-unsecure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json-patch+json'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        loginStatus = `HTTP error: ${response.status}`;
        return;
      }
      
      const responseData = await response.json();
      console.log('[Direct Login] Response:', responseData);
      
      if (responseData) {
        loginStatus = 'Direct login successful! Processing data...';
        
        // API response format is different than expected
        // Store tokens in localStorage
        localStorage.setItem('authToken', responseData.accessToken || '');
        localStorage.setItem('refreshToken', responseData.refreshToken || '');
        localStorage.setItem('userId', responseData.info?.parentId || '');
        
        // Extract roles from the JWT token if available
        const roles = [];
        if (responseData.accessToken) {
          try {
            const tokenParts = responseData.accessToken.split('.');
            if (tokenParts.length > 1) {
              const tokenPayload = JSON.parse(atob(tokenParts[1]));
              if (tokenPayload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']) {
                const roleData = tokenPayload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
                localStorage.setItem('roles', JSON.stringify(
                  Array.isArray(roleData) ? roleData : [roleData]
                ));
              }
            }
          } catch (e) {
            console.error('Error parsing token:', e);
            localStorage.setItem('roles', JSON.stringify([]));
          }
        } else {
          localStorage.setItem('roles', JSON.stringify([]));
        }
        
        localStorage.setItem('permissions', JSON.stringify([]));
        
        // Reload the page to let the auth store initialize with the new token
        window.location.href = '/dashboard';
      } else {
        loginStatus = 'Login failed';
      }
    } catch (error) {
      console.error('Direct login error:', error);
      loginStatus = `Direct login error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }
  
  // Validate form based on selected login method
  function validateForm(): boolean {
    // At least one identifier (username, email, phone) must be provided
    let hasIdentifier = false;
    
    if (loginMethod === 'username' && username) {
      hasIdentifier = true;
    } else if (loginMethod === 'email' && email) {
      hasIdentifier = true;
    } else if (loginMethod === 'phone' && phoneNumber) {
      hasIdentifier = true;
    }
    
    if (!hasIdentifier) {
      loginStatus = `Please enter your ${loginMethod}`;
      return false;
    }
    
    // Password is required according to the API schema
    if (!password) {
      loginStatus = 'Please enter your password';
      return false;
    }
    
    return true;
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
    
    {#if loginStatus}
      <div class="p-4 rounded-md text-sm {loginStatus.includes('successful') ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
        {loginStatus}
      </div>
    {/if}
    
    <div class="flex space-x-2 rounded-md shadow-sm p-1 bg-muted/20">
      <button 
        type="button"
        class="flex-1 py-2 px-3 text-sm font-medium rounded-md {loginMethod === 'username' ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'}"
        on:click={() => loginMethod = 'username'}
      >
        Username
      </button>
      <button 
        type="button"
        class="flex-1 py-2 px-3 text-sm font-medium rounded-md {loginMethod === 'email' ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'}"
        on:click={() => loginMethod = 'email'}
      >
        Email
      </button>
      <button 
        type="button"
        class="flex-1 py-2 px-3 text-sm font-medium rounded-md {loginMethod === 'phone' ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'}"
        on:click={() => loginMethod = 'phone'}
      >
        Phone
      </button>
    </div>
    
    <form class="space-y-6" on:submit|preventDefault={isDirectLogin ? handleDirectLogin : handleSubmit}>
      <!-- Username/Email/Phone fields - show based on selected method -->
      {#if loginMethod === 'username'}
        <div>
          <label for="username" class="block text-sm font-medium">Username</label>
          <input 
            id="username" 
            name="username" 
            type="text" 
            autocomplete="username" 
            bind:value={username}
            disabled={$isLoading}
            class="mt-1 appearance-none block w-full px-3 py-2 border border-input rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm" 
            placeholder="Enter your username" 
          />
        </div>
      {:else if loginMethod === 'email'}
        <div>
          <label for="email" class="block text-sm font-medium">Email address</label>
          <input 
            id="email" 
            name="email" 
            type="email" 
            autocomplete="email" 
            bind:value={email}
            disabled={$isLoading}
            class="mt-1 appearance-none block w-full px-3 py-2 border border-input rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm" 
            placeholder="you@example.com" 
          />
        </div>
      {:else}
        <div>
          <label for="phone" class="block text-sm font-medium">Phone number</label>
          <input 
            id="phone" 
            name="phone" 
            type="tel" 
            autocomplete="tel" 
            bind:value={phoneNumber}
            disabled={$isLoading}
            class="mt-1 appearance-none block w-full px-3 py-2 border border-input rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm" 
            placeholder="+1 (555) 000-0000" 
          />
        </div>
      {/if}

      <div>
        <label for="password" class="block text-sm font-medium">Password</label>
        <input 
          id="password" 
          name="password" 
          type="password" 
          autocomplete="current-password" 
          required 
          bind:value={password}
          disabled={$isLoading}
          class="mt-1 appearance-none block w-full px-3 py-2 border border-input rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm" 
          placeholder="Enter your password" 
        />
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
        <label for="return-url" class="block text-sm font-medium">Return URL (optional)</label>
        <input 
          id="return-url" 
          name="return-url" 
          type="text" 
          bind:value={returnUrl}
          disabled={$isLoading}
          class="mt-1 appearance-none block w-full px-3 py-2 border border-input rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm" 
          placeholder="/dashboard" 
        />
      </div>
      
      <div class="flex items-center">
        <input 
          id="direct-login" 
          name="direct-login" 
          type="checkbox" 
          bind:checked={isDirectLogin}
          class="h-4 w-4 text-primary focus:ring-primary border-input rounded" 
        />
        <label for="direct-login" class="ml-2 block text-sm">
          Use direct unsecure login
        </label>
      </div>

      <div>
        <button 
          type="submit" 
          disabled={$isLoading}
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
        >
          {#if $isLoading}
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-primary-foreground" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
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