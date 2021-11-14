<script lang="ts">
	import { Accordion, AccordionItem } from "carbon-components-svelte";

	export let name: string;
</script>

<main>
	<h1>Welcome to {name} MIXCORE!</h1>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>

	<div >
		<Accordion style="width: 300px;">
			<AccordionItem title="Section 1">  <p>
				Translate text, documents, and websites from one language to another.
				Create industry or region-specific translations via the service's
				customization capability.
			  </p> </AccordionItem>
			<AccordionItem title="Section 2">  <p>
				Translate text, documents, and websites from one language to another.
				Create industry or region-specific translations via the service's
				customization capability.
			  </p> </AccordionItem>
			<AccordionItem title="Section 3">  <p>
				Translate text, documents, and websites from one language to another.
				Create industry or region-specific translations via the service's
				customization capability.
			  </p> </AccordionItem>
		</Accordion>
	</div>
</main>

<style>
</style>
