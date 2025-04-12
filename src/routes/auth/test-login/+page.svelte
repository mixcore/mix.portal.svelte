<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore, isAuthenticated, isLoading, authError } from '$lib/stores/authStore';
  import { CryptoService } from '$lib/api/cryptoService';
  
  // Form data
  let username = '';
  let password = '';
  let rememberMe = false;
  let loginMessage = '';
  let apiResponse = '';
  let debugInfo = '';
  
  // Redirects to dashboard if already authenticated
  $: if ($isAuthenticated) {
    loginMessage = 'Authenticated! You will be redirected to dashboard shortly...';
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 2000);
  }
  
  // Use the debug function to test encryption
  function testEncryption() {
    try {
      debugInfo = 'Running encryption diagnostics. See console for details.';
      CryptoService.debugEncryption();
      loginMessage = 'Encryption test complete. Check browser console for details.';
    } catch (error) {
      console.error('Encryption test error:', error);
      loginMessage = `Encryption test error: ${error}`;
    }
  }
  
  // Test a direct fetch call to the API
  async function testFetch() {
    try {
      debugInfo = 'Testing direct fetch to API...';
      
      // Create test data in the same format as the login form
      const testData = {
        UserName: username || 'testuser',
        Password: password || 'testpassword',
        RememberMe: rememberMe,
        Email: '',
        ReturnUrl: ''
      };
      
      // Encrypt the data
      const message = CryptoService.encryptAES(JSON.stringify(testData));
      
      // Send the request directly
      const response = await fetch('/api/auth/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
      });
      
      // Get the response text
      const responseText = await response.text();
      apiResponse = responseText;
      
      // Try to parse as JSON
      try {
        const responseJson = JSON.parse(responseText);
        debugInfo = `API Response (status ${response.status}): ${JSON.stringify(responseJson, null, 2)}`;
      } catch (e) {
        debugInfo = `API Response (status ${response.status}) - Could not parse as JSON: ${responseText}`;
      }
    } catch (error) {
      console.error('Test fetch error:', error);
      debugInfo = `Test fetch error: ${error}`;
    }
  }
  
  // Submit the login form
  async function handleSubmit() {
    if (!username || !password) {
      loginMessage = 'Please enter username and password';
      return;
    }
    
    loginMessage = 'Logging in...';
    debugInfo = '';
    
    try {
      const success = await authStore.login(username, password, rememberMe);
      if (success) {
        loginMessage = 'Login successful!';
      } else {
        loginMessage = $authError ? $authError.message : 'Login failed';
        // Add more details
        if ($authError) {
          debugInfo = `Error details: ${JSON.stringify($authError)}`;
        }
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
      
      <button 
        type="button" 
        on:click={testFetch}
        class="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Test API
      </button>
    </div>
  </form>
  
  {#if debugInfo}
    <div class="mt-6">
      <h3 class="text-sm font-medium text-gray-700">Debug Information</h3>
      <pre class="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto max-h-60">{debugInfo}</pre>
    </div>
  {/if}
</div> 