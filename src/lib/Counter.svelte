<script lang="ts" src="./Counter.ts"></script>
<style lang="scss">
	@import "./Counter";
</style>

<!-- TEMPLATE -->
<button on:click={() => count = mainIncrement(count)}>
	Clicks: {count}
</button>
{text}: {count}
<!-- TEMPLATE --> 
