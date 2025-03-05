<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { AuthService } from "$lib/services/auth-service";
  import { isBusy, showErrors, goToSiteUrl } from "$lib/services/common";
  import type { LoginData, ExternalLoginData } from "$lib/types";
  import { Button } from "$lib/components/ui/button";
  import { Card, CardHeader, CardContent, CardFooter } from "$lib/components/ui/card";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Checkbox } from "$lib/components/ui/checkbox";

  let loginData: LoginData = {
    username: "",
    password: "",
    rememberMe: true
  };

  let externalLoginData: ExternalLoginData = {
    username: "",
    email: "",
    accessToken: ""
  };

  let canLogin = true;
  let error = "";

  onMount(async () => {
    $isBusy = false;
  });

  // Function to check if the user has permissions for a given URL
  function hasPermission(url: string): boolean {
    return url === "/" || globalThis.$isAdmin || false; // Add permission check here
  }

  // Get the return URL from the query parameters or use a default
  function getReturnUrl(): string {
    const returnUrl = $page.url.searchParams.get("ReturnUrl");
    if (returnUrl) return returnUrl;

    const referrer = document.referrer;
    if (referrer && referrer.indexOf("init") === -1) {
      return referrer;
    }

    return "/";
  }

  async function handleLogin() {
    $isBusy = true;
    error = "";

    try {
      const result = await AuthService.externalLogin(externalLoginData, "providerName");

      if (result.isSucceed) {
        const returnUrl = getReturnUrl();
        window.top.location.href = returnUrl;
      } else {
        if (result.errors) {
          error = result.errors[0];
          showErrors(result.errors);
        }
      }
    } catch (err) {
      error = "An error occurred during login";
      console.error(err);
    } finally {
      $isBusy = false;
    }
  }

  async function handleExternalLogin(response: any, provider: string) {
    try {
      const result = await AuthService.externalLogin(response, provider);

      if (result) {
        canLogin = false;
        const returnUrl = getReturnUrl();

        if (hasPermission(returnUrl)) {
          window.top.location.href = returnUrl;
        } else {
          error = "You don't have permission to access this URL";
          showErrors(["You don't have permission to access this URL"]);
        }
      }
    } catch (err) {
      error = "An error occurred during external login";
      console.error(err);
    }
  }

  function logOut() {
    canLogin = true;
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter") {
      handleLogin();
    }
  }
</script>

<svelte:window on:keydown={handleKeyPress} />

<div class="container-tight py-4">
  <div class="text-center m-4">
    <a href="/"><img src="/mix-app/css/portal/img/mixcore-logo-red-2.svg" alt="Mixcore CMS" height="36"></a>
  </div>

  <Card class="max-w-md mx-auto">
    <CardHeader class="text-center py-4 p-sm-5">
      <img src="/mix-app/css/portal/img/illustrations/undraw_secure_login_pdn4.svg" height="128" class="mb-2 mx-auto" alt="">
      <h1 class="mt-5 text-2xl font-bold">Portal</h1>
      <p class="text-muted-foreground">Let manage your site together!</p>
    </CardHeader>

    <div class="relative">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t"></div>
      </div>
      <div class="relative flex justify-center text-xs uppercase">
        <span class="bg-background px-2 text-muted-foreground">login form</span>
      </div>
    </div>

    <CardContent class="p-5">
      <form class="mb-3 space-y-4">
        {#if canLogin}
          <div>
            <Label for="username">Username</Label>
            <Input 
              id="username" 
              placeholder="Username" 
              bind:value={externalLoginData.username} 
              required
            />
          </div>

          <div>
            <Label for="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="Email" 
              bind:value={externalLoginData.email} 
              required
            />
          </div>

          <div>
            <Label for="accessToken">Access Token</Label>
            <Input 
              id="accessToken" 
              placeholder="Access Token" 
              bind:value={externalLoginData.accessToken} 
              required
            />
          </div>
        {/if}
      </form>
    </CardContent>

    <CardFooter class="flex-col items-center space-y-4">
      <!-- External login buttons would go here -->
      <!-- <button on:click={() => externalLogin(...)} class="...">Facebook Login</button> -->

      {#if canLogin}
        <Button 
          onclick={() => handleLogin()}
          disabled={!externalLoginData.username || !externalLoginData.email || !externalLoginData.accessToken}
          class="px-5"
        >
          Login
        </Button>
      {/if}

      {#if error}
        <p class="text-destructive text-sm">{error}</p>
      {/if}

      <div class="flex space-x-2">
        <Button variant="link" onclick={() => goToSiteUrl('/')}>
          Homepage
        </Button>
        <span>|</span>
        <Button variant="link" onclick={() => goToSiteUrl('/security/register')}>
          Register
        </Button>
      </div>
    </CardFooter>
  </Card>
</div>