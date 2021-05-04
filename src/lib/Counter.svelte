<script lang="ts" src="./Counter.ts"></script>

<script context="module">
	export const ssr = false;
</script>

<!-- TEMPLATE -->
<div class="buttonComp">
	<button on:click={() => (count = mainIncrement(count))}>
		Clicks: {count}
	</button>
	{text}: {count}
</div>


<div class="photos">
	{#each response as item}
		<h1>{item.title}</h1>
	{:else}
		<!-- this block renders when photos.length === 0 -->
		<p>loading...</p>
	{/each}
</div>
<!-- TEMPLATE -->

<style lang="scss">
	@import './Counter';
</style>