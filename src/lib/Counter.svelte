<script lang="ts">
	import { mainIncrement } from './Counter';
	import {FW_DISPLAY_SPINNER} from './mix.lib.ts/src/lib/constants/constants.ts'; // src\lib\mix.lib.ts\src\lib\enums\display-direction.enum.ts
	// import { post } from 'mix.lib.ts';
	let counts = 0;
	let text = FW_DISPLAY_SPINNER;
	// let allPost = post.getAllPost();
</script>

<style lang="scss">
	@import "./Counter";
</style>

<!-- TEMPLATE -->
<button on:click={() => counts = mainIncrement(counts)}>
	Clicks: {counts}
</button>
{text}
<!-- TEMPLATE -->
