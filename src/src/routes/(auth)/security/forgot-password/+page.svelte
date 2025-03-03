<script lang="ts">
    import { onMount } from "svelte";
    import { forgotPassword } from "$lib/services/auth";
    import { isBusy, showErrors, goToSiteUrl } from "$lib/services/common";
    import type { ForgotPasswordData } from "$lib/types";
    import { Button } from "$lib/components/ui/button";
    import { Card, CardHeader, CardContent, CardFooter } from "$lib/components/ui/card";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    
    let viewmodel: ForgotPasswordData = {
      email: ""
    };
    
    let isSucceed = false;
    let error = "";
    
    onMount(() => {
      $isBusy = false;
    });
    
    async function handleSubmit() {
      $isBusy = true;
      error = "";
      
      try {
        const result = await forgotPassword(viewmodel);
        
        if (result.isSucceed) {
          isSucceed = true;
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
      if (event.key === "Enter" && viewmodel.email) {
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
        <h1 class="mt-5 text-2xl font-bold">Forgot something?</h1>
        <p class="text-muted-foreground">Ops! No worry, you will get back your password soon!</p>
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
        <form class="mb-3 space-y-4">
          {#if !isSucceed}
            <div class="mb-5">
              <Label for="email">Your email address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Email" 
                bind:value={viewmodel.email} 
                required
              />
            </div>
          {/if}
        </form>
      </CardContent>
      
      <CardFooter class="flex-col items-center space-y-4">
        {#if !isSucceed}
          <Button 
            on:click={handleSubmit} 
            disabled={!viewmodel.email}
            class="px-5"
          >
            Submit
          </Button>
          
          {#if error}
            <p class="text-destructive text-sm">{error}</p>
          {/if}
          
          <Button variant="link" on:click={() => goToSiteUrl('/security/login?ReturnUrl=%2Fportal')}>
            Back to Login page
          </Button>
        {:else}
          <p class="text-green-600">
            Kindly check your email for reset password instructions.
          </p>
        {/if}
      </CardFooter>
    </Card>
  </div>