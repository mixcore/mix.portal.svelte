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
<!-- TEMPLATE -->

<style lang="scss">
	@import './Counter';
</style>