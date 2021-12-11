<script lang="ts">
    import { Button, FormGroup, TextInput } from "carbon-components-svelte";
    import { MixForm } from '@mix.core/shared';
    import { FormControl, Required } from "../validations";

    const { form, errors, state, handleChange, handleSubmit } = MixForm.createForm({
        'userName': new FormControl('', new Required()),
        'passWord': new FormControl('', new Required())},
        () => submitForm()
    );

    function submitForm(): void {
        console.log($form);
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
            <span style="color: red">{$errors['userName']['required']}</span>
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
            <span style="color: red">{$errors['passWord']['required']}</span>
        {/if}
    </FormGroup>

    <FormGroup legendText="Confirm Password">
        <TextInput type="password"></TextInput>
    </FormGroup>

    <FormGroup legendText="Your Email Address">
        <TextInput></TextInput>
    </FormGroup>

    <Button type="submit">Submit Administrator Account</Button>
</form>

<style lang="scss"></style>