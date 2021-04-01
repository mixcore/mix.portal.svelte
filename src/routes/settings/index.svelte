<script lang="ts">
	import Counter from '$lib/Counter.svelte';
</script>
<script context="module">
	export const ssr = false;
</script>


<main>
	<h1>Settings</h1>

	<Counter />
	<p>Visit <a href="https://svelte.dev">svelte.dev</a> to learn how to build Svelte apps.</p>
</main>
		