<script lang="ts">
    import { goto } from "$app/navigation";
    import { Divider, Email, FormControl, MixForm, Required } from "@mix.core/shared";
    import { Button, Checkbox, FormGroup, TextInput } from "carbon-components-svelte";
    import ArrowRight16 from "carbon-icons-svelte/lib/ArrowRight16";

    const { form, errors, state, handleChange, handleSubmit } = MixForm.createForm({
        'passWord': new FormControl('', new Required()),
        'email': new FormControl('', new Required(), new Email())},
        (value) => submitForm(value)
    );

    function submitForm(value): void {
        console.log(value['email'] , value['passWord']);
        goto('/cms/dashboard');
    }
</script>

<form on:submit="{handleSubmit}"
      class="form-sign-in w-100">

    <h3 class="form-sign-in__title">Log-in</h3>

    <span class="form-sign-in__description">Don't have an account yet? <a href="/sign-up">Create an account now</a></span>

    <Divider></Divider>

    <FormGroup legendText="Email">
        <TextInput
            id="email"
            name="email"
            on:change={handleChange}
            on:blur={handleChange}
            bind:value={$form['email']}/>
        {#if $errors['email']['required']}
            <span class="form-error">{$errors['email']['required']}</span>
        {/if}

        {#if $errors['email']['email']}
            <span class="form-error">{$errors['email']['email']}</span>
        {/if}
    </FormGroup>

    <FormGroup legendText="Password">
        <TextInput
            type="password"
            id="passWord"
            name="passWord"
            on:change={handleChange}
            on:blur={handleChange}
            bind:value={$form['passWord']}/>
        {#if $errors['passWord']['required']}
            <span class="form-error">{$errors['passWord']['required']}</span>
        {/if}
    </FormGroup>
    
    <FormGroup>
        <div class="d-flex justify-content-between align-items-center">
            <Checkbox labelText="Remember Me" />

            <a href="/forgot-password"> Forgot password ? </a>
        </div>
    </FormGroup>

    <Button class="full-width"
            type="submit"
            icon={ArrowRight16}> Continue </Button>

    <Divider></Divider>
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