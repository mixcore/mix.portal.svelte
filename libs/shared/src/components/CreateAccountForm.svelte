<script lang="ts">
    import { Button, FormGroup, TextInput } from "carbon-components-svelte";
    import { showGlobalToastNotification } from '../stores/toast/toast.store';
    import { Confirmation, Email, FormControl, MixForm, Required } from "../validations";
    import { createEventDispatcher } from "svelte";
    import type { AccountModel } from "@mix.core/mix.lib";
    import ArrowRight16 from "carbon-icons-svelte/lib/ArrowRight16";

    const dispatch = createEventDispatcher();
    const createAccountEvent = 'onCreateACcountSubmit';

    const { form, errors, state, handleChange, handleSubmit } = MixForm.createForm<AccountModel>({
        'userName': new FormControl('', new Required()),
        'passWord': new FormControl('', new Required()),
        'confirmPassword': new FormControl('', new Required(), new Confirmation(() => $form['passWord'])),
        'email': new FormControl('', new Required(), new Email())},
        (value) => submitForm(value)
    );

    function submitForm(value: AccountModel): void {
        showGlobalToastNotification({title: 'Successfully', subTitle: 'Complete create account information', kind: 'success'})
        dispatch(createAccountEvent, value);
    }
</script>

<form on:submit="{handleSubmit}">
    <FormGroup legendText="Administrator Username">
        <TextInput
            id="userName"
            name="userName"
            on:change={handleChange}
            on:blur={handleChange}
            bind:value={$form['userName']}/>
        {#if $errors['userName']['required']}
            <span class="form-error">{$errors['userName']['required']}</span>
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

    <FormGroup legendText="Confirm Password">
            <TextInput
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            on:change={handleChange}
            on:blur={handleChange}
            bind:value={$form['confirmPassword']}/>
        {#if $errors['confirmPassword']['required']}
            <span class="form-error">{$errors['confirmPassword']['required']}</span>
        {/if}

        {#if $errors['confirmPassword']['confirm']}
            <span class="form-error">{$errors['confirmPassword']['confirm']}</span>
        {/if}
    </FormGroup>

    <FormGroup legendText="Your Email Address">
        <TextInput
            type="text"
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

    <Button class="full-width"
            type="submit"
            icon={ArrowRight16}> Continue </Button>
</form>

<style lang="scss"></style>