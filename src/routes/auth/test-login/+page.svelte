<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore, isAuthenticated, isLoading, authError } from '$lib/stores/authStore';
  import { CryptoService } from '$lib/api/cryptoService';
  
  // Form data
  let username = '';
  let password = '';
  let rememberMe = false;
  let loginMessage = '';
  
  // Redirects to dashboard if already authenticated
  $: if ($isAuthenticated) {
    loginMessage = 'Authenticated! You will be redirected to dashboard shortly...';
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 2000);
  }
  
  // Debug function to test encryption
  function testEncryption() {
    try {
      const testData = {
        UserName: 'testuser',
        Password: 'testpassword',
        RememberMe: true,
        Email: '',
        ReturnUrl: ''
      };
      
      const testDataJson = JSON.stringify(testData);
      console.log('Original data:', testData);
      
      const encrypted = CryptoService.encryptAES(testDataJson);
      console.log('Encrypted:', encrypted);
      
      loginMessage = 'Encryption test logged to console';
    } catch (error) {
      console.error('Encryption test error:', error);
      loginMessage = `Encryption test error: ${error}`;
    }
  }
  
  // Submit the login form
  async function handleSubmit() {
    if (!username || !password) {
      loginMessage = 'Please enter username and password';
      return;
    }
    
    loginMessage = 'Logging in...';
    
    try {
      const success = await authStore.login(username, password, rememberMe);
      if (success) {
        loginMessage = 'Login successful!';
      } else {
        loginMessage = $authError ? $authError.message : 'Login failed';
      }
    } catch (error) {
      console.error('Login error:', error);
      loginMessage = `Login error: ${error}`;
    }
  }
</script>

<div class="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
  <div class="text-center mb-6">
    <h2 class="text-2xl font-bold">Test Login Page</h2>
    <p class="text-sm text-gray-600">Testing auth fixes with encryption</p>
  </div>
  
  {#if loginMessage}
    <div class="bg-blue-100 p-4 rounded-md text-sm text-blue-800 mb-4">
      {loginMessage}
    </div>
  {/if}
  
  {#if $authError}
    <div class="bg-red-100 p-4 rounded-md text-sm text-red-800 mb-4">
      {$authError.message}
    </div>
  {/if}
  
  <form class="space-y-4" on:submit|preventDefault={handleSubmit}>
    <div>
      <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
      <input 
        id="username" 
        name="username" 
        type="text" 
        bind:value={username}
        disabled={$isLoading}
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
        placeholder="Username" 
      />
    </div>
    
    <div>
      <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
      <input 
        id="password" 
        name="password" 
        type="password" 
        bind:value={password}
        disabled={$isLoading}
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
        placeholder="Password" 
      />
    </div>

    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <input 
          id="remember-me" 
          name="remember-me" 
          type="checkbox" 
          bind:checked={rememberMe}
          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
        />
        <label for="remember-me" class="ml-2 block text-sm text-gray-900">
          Remember me
        </label>
      </div>
    </div>

    <div class="flex space-x-2">
      <button 
        type="submit" 
        disabled={$isLoading}
        class="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {$isLoading ? 'Signing in...' : 'Sign in'}
      </button>
      
      <button 
        type="button" 
        on:click={testEncryption}
        class="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Test Encryption
      </button>
    </div>
  </form>
</div> 