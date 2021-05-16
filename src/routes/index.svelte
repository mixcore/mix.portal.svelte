<script context="module" lang="ts">
	// export const prerender = true;
</script>

<script lang="ts">
		
	import Counter from '$lib/Counter/index.svelte';
	
	import { Button, ButtonSkeleton, ButtonSet } from "carbon-components-svelte/src/Button";	import {
		TileGroup,
		RadioTile,
	} from "carbon-components-svelte";
	
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section>
	<h1>HeaderSwitcher</h1>
	<p>
	  Select a transition option below and click on the App Switcher icon in
	  the top right.
	</p>

	<Counter />

	<Button>Primary button</Button>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}
</style>
