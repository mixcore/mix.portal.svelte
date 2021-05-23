<script context="module" lang="ts">
	export const prerender = true;
	// export const ssr = false;
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { Tabs, Tab, TabContent, 
    Button,
	Form,
    FormGroup,
    Checkbox,
    RadioButtonGroup,
    RadioButton,
    Select,
    SelectItem,
	} from "carbon-components-svelte";

  	let selected = 0;

	onMount(async () => {
		// skeleton.hide();
	});

	
</script>

<svelte:head>
	<title>Create Post - Mixcore Portal</title>
</svelte:head>

<section>
	<h1>Create Post</h1>
	<p>
		Fill all of the following columns to create a new post.
	</p>
	<br/>

	<Form on:submit>
		<FormGroup legendText="Checkboxes">
		  <Checkbox id="checkbox-0" labelText="Checkbox Label" checked />
		  <Checkbox id="checkbox-1" labelText="Checkbox Label" />
		  <Checkbox id="checkbox-2" labelText="Checkbox Label" disabled />
		</FormGroup>
		<FormGroup legendText="Radio buttons">
		  <RadioButtonGroup name="radio-button-group" selected="default-selected">
			<RadioButton
			  id="radio-1"
			  value="standard"
			  labelText="Standard Radio Button"
			/>
			<RadioButton
			  id="radio-2"
			  value="default-selected"
			  labelText="Default Selected Radio Button"
			/>
			<RadioButton
			  id="radio-4"
			  value="disabled"
			  labelText="Disabled Radio Button"
			  disabled
			/>
		  </RadioButtonGroup>
		</FormGroup>
		<FormGroup>
		  <Select id="select-1" labelText="Select menu" value="placeholder-item">
			<SelectItem
			  disabled
			  hidden
			  value="placeholder-item"
			  text="Choose an option"
			/>
			<SelectItem value="option-1" text="Option 1" />
			<SelectItem value="option-2" text="Option 2" />
			<SelectItem value="option-3" text="Option 3" />
		  </Select>
		</FormGroup>
		<Button type="submit">Submit</Button>
	  </Form>
	

</section>
