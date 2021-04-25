<script context="module" lang="ts">
	export const prerender = false;
	export const ssr = false;
</script>


<script lang="ts">
	import { Button } from "carbon-components-svelte";
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>
<Button>Primary button</Button>