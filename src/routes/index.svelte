<script lang="ts">
	import Counter from '$lib/Counter.svelte';
</script>

<script context="module">
	export const ssr = false;
</script>

<main>
	<h1>Welcome to Mixcore</h1>

	<Counter />

	<Counter count={3} text={"Hello 1"} />

	<Counter count={6} text={"Hello 2"} />


</main>

