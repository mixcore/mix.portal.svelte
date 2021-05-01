<script lang="ts">
	import {count, increment, handleClick} from './Counter';
	import mainCount from './CounterScript.svelte';
	import mainIncrement from './CounterScript.svelte';
	
	// let mainCount = count;

	// const mainIncrement = (): void => {
	// 	mainCount += 1;
	// };
</script>

<button on:click={mainIncrement}>
	Clicks: {mainCount}
</button>

<style lang="scss">
	button {
		font-family: inherit;
		font-size: inherit;
		padding: 1em 2em;
		color: #ff3e00;
		background-color: rgba(255, 62, 0, 0.1);
		border-radius: 2em;
		border: 2px solid rgba(255, 62, 0, 0);
		outline: none;
		width: 200px;
		font-variant-numeric: tabular-nums;
	}

	button:focus {
		border: 2px solid #ff3e00;
	}

	button:active {
		background-color: rgba(255, 62, 0, 0.2);
	}
</style>
