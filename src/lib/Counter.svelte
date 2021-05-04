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
	{#each photos as photo}
		<figure>
			<img src={photo.thumbnailUrl} alt={photo.title}>
			<figcaption>{photo.title}</figcaption>
		</figure>
	{:else}
		<!-- this block renders when photos.length === 0 -->
		<p>loading...</p>
	{/each}
</div>
<!-- TEMPLATE -->

<style lang="scss">
	@import './Counter';
</style>