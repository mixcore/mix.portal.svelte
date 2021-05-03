<script lang="ts">
	import Counter from '$lib/Counter.svelte';
</script>

<script context="module">
	export const ssr = false;
</script>

<main>
	<h1>Welcome to Mixcore</h1>

	<Counter />
	<br/>
	<Counter count={3} text={"hello 1"} />
	<br/>
	<Counter count={6} text={"hello 2"} />
	<br/>

</main>

