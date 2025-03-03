<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { resetPassword } from "$lib/services/auth";
    import { isBusy, showErrors, goToSiteUrl } from "$lib/services/common";
    import type { ResetPasswordData } from "$lib/types";
    import { Button } from "$lib/components/ui/button";
    import { Card, CardHeader, CardContent, CardFooter } from "$lib/components/ui/card";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    
    let user: ResetPasswordData = {
      email: "",
      password: "",
      confirmPassword: "",
      code: ""
    };
    
    let error = "";
    
    onMount(() => {
      // Get token from URL query parameter
      const token = $page.url.searchParams.get("token");
      if (token) {
        user.code = token;
      }
    });
    
    async function handleSubmit() {
      if (user.password !== user.confirmPassword) {
        error = "Confirm Password is not matched";
        showErrors(["Confirm Password is not matched"]);
        return;
      }
      
      $isBusy = true;
      error = "";
      
      try {
        const result = await resetPassword(user);
        
        if (result.isSucceed) {
          window.location.href = "/security/login";
        } else if (result.errors) {
          error = result.errors[0];
          showErrors(result.errors);
        }
      } catch (err) {
        error = "An error occurred while processing your request";
        console.error(err);
      } finally {
        $isBusy = false;
      }
    }
    
    function handleKeyPress(event: KeyboardEvent) {
      if (event.key === "Enter") {
        handleSubmit();
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
        <img src="/mix-app/css/portal/img/illustrations/undraw_forgot_password_gi2d.svg" height="128" class="mb-2 mx-auto" alt="">
        <h1 class="mt-5 text-2xl font-bold">Your new password</h1>
        <p class="text-muted-foreground">Please use a password that you can remember.</p>
      </CardHeader>
      
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t"></div>
        </div>
        <div class="relative flex justify-center text-xs uppercase">
          <span class="bg-background px-2 text-muted-foreground">reset password form</span>
        </div>
      </div>
      
      <CardContent class="p-5">
        <form class="space-y-4">
          <div>
            <Label for="email">Email address</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="Email..." 
              bind:value={user.email} 
              required
            />
          </div>
          
          <div>
            <Label for="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="Input password..." 
              bind:value={user.password} 
              required
            />
          </div>
          
          <div>
            <Label for="confirmPassword">Confirm Password</Label>
            <Input 
              id="confirmPassword" 
              type="password" 
              placeholder="Input confirm password..." 
              bind:value={user.confirmPassword} 
              required
            />
          </div>
        </form>
      </CardContent>
      
      <CardFooter class="flex-col items-center space-y-4">
        <Button 
          on:click={handleSubmit} 
          class="w-full"
        >
          Submit
        </Button>
        
        {#if error}
          <p class="text-destructive text-sm">{error}</p>
        {/if}
        
        <div class="mt-1 text-center">
          Back to <Button variant="link" class="p-0 h-auto" on:click={() => goToSiteUrl('/')}>homepage</Button>
        </div>
      </CardFooter>
    </Card>
  </div>