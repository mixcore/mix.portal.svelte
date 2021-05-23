<script context="module" lang="ts">
	export const prerender = false;
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
	Accordion, AccordionItem,
	TextInput, TextArea 
	} from "carbon-components-svelte";

	// import { Editor, Viewer } from 'bytemd';
  	// import gfm from '@bytemd/plugin-gfm';

  let value;
  const plugins = [
    // gfm(),
    // Add more plugins here
  ];

  function handleChange(e) {
    value = e.detail.value;
  }
  

  	let selected = 0;

	onMount(async () => {
		// skeleton.hide();
	});

	
</script>

<svelte:head>
	<title>Create Post - Mixcore Portal</title>
</svelte:head>

<section>

	
	<div class="bx--grid bx--grid--narrow">
		<div class="bx--row">
			<!-- <div class="bx--col-lg-4">
				<Accordion>
					<AccordionItem title="Natural Language Classifier">
					  <p>
						Natural Language Classifier uses advanced natural language processing and
						machine learning techniques to create custom classification models. Users
						train their data and the service predicts the appropriate category for the
						inputted text.
					  </p>
					</AccordionItem>
					<AccordionItem title="Natural Language Understanding">
					  <p>
						Analyze text to extract meta-data from content such as concepts, entities,
						emotion, relations, sentiment and more.
					  </p>
					</AccordionItem>
					<AccordionItem title="Language Translator">
					  <p>
						Translate text, documents, and websites from one language to another.
						Create industry or region-specific translations via the service's
						customization capability.
					  </p>
					</AccordionItem>
				  </Accordion>
			</div> -->
			<div class="bx--col-lg-12">
							
				<h1>Create Post</h1>
				<p>
					Fill all of the following columns to create a new post.
				</p>
				<br/>

				<Form on:submit>
					<FormGroup legendText="General Information">
						<TextInput labelText="Title" placeholder="Enter post title..." />
						<br/>
						<TextArea labelText="Excerpt" placeholder="Enter a excerpt..." />
						<br/>
						<!-- <Editor {value} {plugins} on:change={handleChange} /> -->
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
				
			</div>
		</div>
	  </div>


</section>
