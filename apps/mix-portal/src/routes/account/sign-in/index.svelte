<script lang="ts">
  import { onMount } from 'svelte';
  import {
    environment,
    Divider,
    FormControl,
    MixForm,
    Required,
    MixHttps,
showLoading,
hideLoading,
  } from '@mix.core/shared';
  import { CryptoService, MixSharedService } from '@mix.core/mix.lib';
  import {
    Button,
    Checkbox,
    FormGroup,
    TextInput,
  } from 'carbon-components-svelte';
  import ArrowRight16 from 'carbon-icons-svelte/lib/ArrowRight16';

  const { form, errors, state, handleChange, handleSubmit } =
    MixForm.createForm({
        password: new FormControl('', new Required()),
        username: new FormControl('', new Required())},
      (value) => submitForm(value)
  );

  function submitForm(value): void {
    let loginData = {
      username: value['username'],
      password: value['password'],
      rememberMe: true,
    };

    let sharedSrv = new MixSharedService(environment.baseUrl);
    let cryptoSrv = new CryptoService();

    Promise.resolve()
           .then(() => showLoading())
           .then(() =>  MixHttps.get<string>(sharedSrv.getGlobalSettings))
           .then((key) => {
              let encrypted = cryptoSrv.encryptAES(JSON.stringify(loginData), key['apiEncryptKey']);
              return MixHttps.post<any>(sharedSrv.signInEndpoint, { message: encrypted,})})
           .then((res) => {
              console.log(res);
           })
           .finally(() => hideLoading())
  }
</script>

<form on:submit={handleSubmit} class="form-sign-in w-100">
  <h3 class="form-sign-in__title">Log-in</h3>

  <span class="form-sign-in__description"
    >Don't have an account yet? <a href="/sign-up">Create an account now</a
    ></span
  >

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
      bind:value={$form['password']}
    />
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
