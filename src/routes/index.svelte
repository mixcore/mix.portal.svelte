<script context="module" lang="ts">
	// export const prerender = true;
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	// import type {
	// 	mixSettingService
	// 	} from '$lib/mix.lib.ts';
		
	import {
		LocalStorageKeys,
		} from '$mixlib/lib/constants/local-storage-keys'; 
		
	import {
		mixSettingService,
		} from '$mixlib/lib/services/mix-setting-service'; 
		
	import Counter from '$lib/Counter/index.svelte';
	
	import { Button, ButtonSkeleton, ButtonSet } from "carbon-components-svelte/src/Button";	import {
		TileGroup,
		RadioTile,
	} from "carbon-components-svelte";
	let CONF_APP_URL = LocalStorageKeys.CONF_APP_URL;


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

	function initParams() {
		console.log('Init Mix Params');
		localStorage.setItem(
			LocalStorageKeys.CONF_APP_URL,
			'https://store.mixcore.org/api/v1'
		);
		localStorage.setItem(
			LocalStorageKeys.CONF_CURRENT_CULTURE, 
			'en-us'
		);
		mixSettingService.getAllSettings('en-us');
  	}
	
	onMount(async () => {
		initParams();
	});

	
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
