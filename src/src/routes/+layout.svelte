<!-- <script lang="ts">
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import Header from './Header.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<ParaglideJS {i18n}>
	<div class="app">
		<Header></Header>

		<main>
			{@render children()}
		</main>

		<footer>
			<p>
				visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to learn about SvelteKit
			</p>
		</footer>
	</div>
</ParaglideJS>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style> -->

<script lang="ts">
	import "../app.css";
	import { toasts, isBusy } from "$lib/services/common";
	import { Toast, ToastViewport } from "$lib/components/ui/toast";
	import { Loader } from "lucide-svelte";
  </script>
  
  <div class="min-h-screen">
	{#if $isBusy}
	  <div class="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-black/20">
		<div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg flex items-center gap-2">
		  <Loader class="h-5 w-5 animate-spin text-primary" />
		  <span>Loading...</span>
		</div>
	  </div>
	{/if}
  
	<slot />
	
	{#if $toasts.length > 0}
	  <ToastViewport class="fixed top-0 right-0 flex flex-col p-4 gap-2 w-full md:max-w-[420px] max-h-screen overflow-hidden z-50">
		{#each $toasts as toast (toast.id)}
		  <Toast variant={toast.type}>
			<span>{toast.message}</span>
		  </Toast>
		{/each}
	  </ToastViewport>
	{/if}
  </div>