<script lang="ts">
  import { register } from "$lib/services/auth";
  import { isBusy, showErrors, showMessage, goToSiteUrl } from "$lib/services/common";
  import type { User } from "$lib/types";
  import { Button } from "$lib/components/ui/button";
  import { Card, CardHeader, CardContent, CardFooter } from "$lib/components/ui/card";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Checkbox } from "$lib/components/ui/checkbox";
  
  let user: User = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    isAgreed: false
  };
  
  let error = "";
  
  async function handleRegister() {
    if (!user.isAgreed) {
      showMessage("Please agreed with our policy", "warning");
      return;
    }
    
    if (user.password !== user.confirmPassword) {
      showErrors(["Confirm Password is not matched"]);
      error = "Confirm Password is not matched";
      return;
    }
    
    $isBusy = true;
    error = "";
    
    try {
      const result = await register(user);
      
      if (result.isSucceed) {
        window.location.href = "/security/login";
      } else if (result.errors) {
        error = result.errors[0];
        showErrors(result.errors);
      }
    } catch (err) {
      error = "An error occurred during registration";
      console.error(err);
    } finally {
      $isBusy = false;
    }
  }
  
  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter") {
      handleRegister();
    }
  }
</script>

<svelte:window on:keydown={handleKeyPress} />

<div class="container-tight py-4">
  <div class="text-center mb-4">
    <a href="/"><img src="/mix-app/css/portal/img/mixcore-logo-red-2.svg" alt="Mixcore CMS" height="36"></a>
  </div>
  
  <Card class="max-w-md mx-auto">
    <CardHeader class="text-center py-4 p-sm-5">
      <img src="/mix-app/css/portal/img/illustrations/undraw_Profile_re_4a55.svg" height="128" class="mb-2 mx-auto" alt="">
      <h1 class="mt-5 text-2xl font-bold">Portal</h1>
      <p class="text-muted-foreground">Hi! Let's create your new account.</p>
    </CardHeader>
    
    <div class="relative">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t"></div>
      </div>
      <div class="relative flex justify-center text-xs uppercase">
        <span class="bg-background px-2 text-muted-foreground">register form</span>
      </div>
    </div>
    
    <CardContent class="p-5">
      <form class="space-y-4">
        <div>
          <Label for="username">Username</Label>
          <Input 
            id="username" 
            placeholder="Handsome..." 
            bind:value={user.username} 
            required
          />
        </div>
        
        <div>
          <Label for="password">Password</Label>
          <Input 
            id="password" 
            type="password" 
            placeholder="MyC0mpl3xP@ssw0rd" 
            bind:value={user.password} 
            required
          />
        </div>
        
        <div>
          <Label for="confirmPassword">Confirm Password</Label>
          <Input 
            id="confirmPassword" 
            type="password" 
            placeholder="MyC0mpl3xP@ssw0rd" 
            bind:value={user.confirmPassword} 
            required
          />
        </div>
        
        <div>
          <Label for="email">Email address</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="your-email-address@domain.com" 
            bind:value={user.email} 
            required
          />
        </div>
        
        <div class="flex items-center space-x-2">
          <Checkbox 
            id="terms" 
            bind:checked={user.isAgreed} 
            required
          />
          <Label for="terms" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            I agree to the
            <a href="https://mixcore.org/terms-and-conditions.html" target="_blank" class="text-primary hover:underline">terms and conditions</a>.
          </Label>
        </div>
      </form>
    </CardContent>
    
    <CardFooter class="flex-col items-center space-y-4">
      <Button 
        onclick={handleRegister} 
        type="submit" 
        class="px-5"
      >
        Register
      </Button>
      
      {#if error}
        <p class="text-destructive text-sm">{error}</p>
      {/if}
      
      <div class="flex space-x-2">
        <Button variant="link" onclick={() => goToSiteUrl('/')}>
          Back to Home page
        </Button>
        <span>|</span>
        <Button variant="link" onclick={() => goToSiteUrl('/security/login?ReturnUrl=%2Fportal')}>
          Login
        </Button>
      </div>
    </CardFooter>
  </Card>
</div>