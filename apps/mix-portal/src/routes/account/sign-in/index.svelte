<script lang="ts">
  import {
    environment,
    Divider,
    FormControl,
    MixForm,
    Required,
    showLoading,
    hideLoading,
    MixApi,
    authService,
  } from '@mix.core/shared';
  import { MixSharedService } from '@mix.core/mix.lib';
  import {
    Button,
    Checkbox,
    FormGroup,
    TextInput,
  } from 'carbon-components-svelte';
  import ArrowRight16 from 'carbon-icons-svelte/lib/ArrowRight16';
import { goto } from '$app/navigation';

  const { form, errors, state, handleChange, handleSubmit } =
    MixForm.createForm({
        password: new FormControl('', new Required()),
        username: new FormControl('', new Required())},
      (value) => submitForm(value)
  );

  function submitForm(value): void {
    let sharedSrv = new MixSharedService(environment.baseUrl);
    let loginData = {
      UserName: value['username'],
      Password: value['password'],
      RememberMe: true,
      Email: '',
      ReturnUrl: ''
    };

    Promise.resolve()
           .then(() => showLoading())
           .then(() =>  MixApi.get<string>(sharedSrv.getGlobalSettings))
           .then((key) => authService.login(loginData, key))
           .then((res) => authService.updateHeaderAuthData(res))
           .then(() => authService.initUserConfigSetting())
           .then(() =>  goto('/cms'))
           .finally(() => hideLoading())
  }
</script>

<form on:submit={handleSubmit} class="form-sign-in w-100">
  <h3 class="form-sign-in__title">Log-in</h3>

  <span class="form-sign-in__description"
    >Don't have an account yet? <a href="/sign-up">Create an account now</a>
  </span>

  <Divider />

  <FormGroup legendText="Username">
    <TextInput
      id="username"
      name="username"
      on:change={handleChange}
      on:blur={handleChange}
      bind:value={$form['username']}
    />
    {#if $errors['username']['required']}
      <span class="form-error">{$errors['username']['required']}</span>
    {/if}

    {#if $errors['username']['username']}
      <span class="form-error">{$errors['username']['username']}</span>
    {/if}
  </FormGroup>
  
  <FormGroup legendText="Password">
    <TextInput
      type="password"
      id="password"
      name="password"
      on:change={handleChange}
      on:blur={handleChange}
      bind:value={$form['password']}/>
    {#if $errors['password']['required']}
      <span class="form-error">{$errors['password']['required']}</span>
    {/if}
  </FormGroup>

  <FormGroup>
    <div class="d-flex justify-content-between align-items-center">
      <Checkbox labelText="Remember Me" />

      <a href="/forgot-password"> Forgot password ? </a>
    </div>
  </FormGroup>

  <Button class="full-width" type="submit" icon={ArrowRight16}>Continue</Button>

  <Divider />
</form>

<style lang="scss">
  .form-sign-in {
    &__title {
      margin-bottom: var(--cds-spacing-03);
    }

    &__description {
      display: block;
      margin-bottom: var(--cds-spacing-07);
    }
  }
</style>
