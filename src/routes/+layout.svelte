<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { cn } from '$lib/utils';
	import { Menu } from 'lucide-svelte';
</script>

<div class="relative flex min-h-screen">
	<!-- Sidebar -->
	<div class="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40 w-[250px]">
		<div class="flex flex-col gap-2">
			<div class="flex h-[60px] items-center px-6 border-b">
				<a href="/" class="flex items-center gap-2 font-semibold">
					<img src="/logo.png" alt="Logo" class="h-6 w-6" />
					<span>Mixcore CMS</span>
				</a>
			</div>
			
			<!-- Navigation -->
			<nav class="flex-1 space-y-1 p-4">
				<div class="space-y-2">
					<div class="flex items-center justify-between">
						<h2 class="text-lg font-semibold tracking-tight">Platform</h2>
					</div>
					<div class="space-y-1">
						<a
							href="/playground"
							class={cn(
								'flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50',
								$page.url.pathname === '/playground' && 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50'
							)}
						>
							<span>Playground</span>
						</a>
						<a
							href="/models"
							class={cn(
								'flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50',
								$page.url.pathname === '/models' && 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50'
							)}
						>
							<span>Models</span>
						</a>
						<a
							href="/docs"
							class={cn(
								'flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50',
								$page.url.pathname === '/docs' && 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50'
							)}
						>
							<span>Documentation</span>
						</a>
					</div>
				</div>

				<div class="space-y-2 pt-4">
					<div class="flex items-center justify-between">
						<h2 class="text-lg font-semibold tracking-tight">Projects</h2>
					</div>
					<div class="space-y-1">
						<a
							href="/design"
							class={cn(
								'flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50',
								$page.url.pathname === '/design' && 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50'
							)}
						>
							<span>Design Engineering</span>
						</a>
						<a
							href="/marketing"
							class={cn(
								'flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50',
								$page.url.pathname === '/marketing' && 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50'
							)}
						>
							<span>Sales & Marketing</span>
						</a>
					</div>
				</div>
			</nav>
		</div>
	</div>

	<!-- Main Content -->
	<div class="flex-1">
		<header class="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
			<button class="lg:hidden">
				<Menu class="h-6 w-6" />
				<span class="sr-only">Toggle Menu</span>
			</button>
			<div class="flex-1">
				<h1 class="font-semibold text-lg">Dashboard</h1>
			</div>
			<div class="flex items-center gap-4">
				<!-- Add user menu, notifications, etc. here -->
			</div>
		</header>

		<main class="flex-1 p-4 md:p-6">
			<slot />
		</main>
	</div>
</div>

<style>
	:global(html) {
		@apply antialiased;
	}
</style>
