<script lang="ts">
    import { Button, FormGroup, TextInput } from "carbon-components-svelte";
    import { MixForm } from '@mix.core/shared';
import { FormControl, Required } from "../validations";

    MixForm.createForm({
        'userName': new FormControl('', new Required()),
        'passWord': new FormControl('', new Required())
    })
</script>

<form>
    <FormGroup legendText="Administrator Username">
        <TextInput></TextInput>
    </FormGroup>

    <FormGroup legendText="Password">
        <TextInput type="password"></TextInput>
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