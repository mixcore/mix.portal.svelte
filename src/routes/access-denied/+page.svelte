<script lang="ts">
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/authStore';
  
  function handleLogout() {
    authStore.logout();
    goto('/auth/login');
  }
  
  function goBack() {
    history.back();
  }
</script>

<div class="flex flex-col items-center justify-center min-h-[80vh] text-center p-4">
  <div class="w-full max-w-md mx-auto">
    <div class="space-y-8">
      <div>
        <h1 class="text-4xl font-bold text-destructive mb-2">Access Denied</h1>
        <p class="text-xl text-muted-foreground mb-6">
          You don't have permission to access this page.
        </p>
        
        <div class="p-4 rounded-md bg-destructive/10 text-destructive mb-8">
          You need higher privileges or different permissions to access this resource.
        </div>
        
        <div class="flex flex-col space-y-4">
          <button 
            onclick={goBack}
            class="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors"
          >
            Go Back
          </button>
          
          <button 
            onclick={() => goto('/dashboard')}
            class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Go to Dashboard
          </button>
          
          <button 
            onclick={handleLogout}
            class="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  </div>
</div> 