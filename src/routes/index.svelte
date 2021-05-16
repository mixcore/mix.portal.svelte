<script context="module" lang="ts">
	// export const prerender = true;
</script>

<script lang="ts">
	import type {mixSettingService, MixPostPortalViewModel} from '$lib/mix-lib';
	import Counter from '$lib/Counter/index.svelte';
	
	import { Button, ButtonSkeleton, ButtonSet } from "carbon-components-svelte/src/Button";	import {
		TileGroup,
		RadioTile,
	} from "carbon-components-svelte";

	

	// export class PostService extends mixSettingService<MixPostPortalViewModel> {
	// 	constructor() {
	// 		let appUrl = 'https://store.mixcore.org/api/v1/rest/';
	// 		let viewName = 'mvc';
	// 		let specificulture = 'en-us';
	// 		var conf = getDefaultAxiosConfiguration();
	// 		conf.withCredentials = false;
	// 		super(appUrl, MixModelType.Post, viewName, specificulture, conf);
	// 	}
	// 	public getSingleModel(id: any) {
	// 		let queries = {
	// 			kw: 'test'
	// 		};
	// 		return super.getSingleModel(id, queries);
	// 	}
	// }

	// export let response = [];

	// onMount(async () => {
	// 	var srv = new PostService();
	// 	srv.getListModel().then(resp => {
	// 		response = resp.items;
	// 		console.log(resp);
	// 	})
	// });
	
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
