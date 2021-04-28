<script lang="ts">
	import Counter from '$lib/Counter.svelte';
	import { DatePicker, DatePickerInput,
		Form,
    FormGroup,
    Checkbox,
    RadioButtonGroup,
    RadioButton,
    Select,
    SelectItem,
    Button,
	
	} from "carbon-components-svelte";
</script>
<script context="module">
	export const ssr = false;
</script>


<main>
	<h1>Settings - Hello!!!</h1>

	<Counter />
	<p>Visit <a href="https://svelte.dev">svelte.dev</a> to learn how to build Svelte apps.</p>

	<DatePicker>
		<DatePickerInput labelText="Date of birth" placeholder="mm/dd/yyyy" />
	  </DatePicker>

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
		<Button type="submit">Submit button</Button>
	  </Form>
</main>
		