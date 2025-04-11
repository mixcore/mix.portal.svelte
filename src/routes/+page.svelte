<script lang="ts">
	import { page } from '$app/stores';
	import ShellLayout from '../components/layout/ShellLayout.svelte';
	import { writable } from 'svelte/store';
	import { 
		Home,
		SquareTerminal,
		Bot,
		BookOpen,
		Settings2,
		Frame,
		PieChart, 
		Map,
		Gallery,
		GalleryVerticalEnd,
		Settings
	} from 'lucide-svelte';
	
	// Example user state
	const isDarkMode = writable(false);
	let isMobileMenuOpen = false;
	
	// App contexts for demo
	const activeContext = {id: 'acme', name: 'Acme Inc', icon: GalleryVerticalEnd};
	const appContexts = [
		{id: 'acme', name: 'Acme Inc', icon: GalleryVerticalEnd},
		{id: 'personal', name: 'Personal', icon: Home},
		{id: 'team', name: 'Team Workspace', icon: Frame}
	];
	
	// Mock navigation structure matching the reference image
	const activeNavItems = [
		{
			section: "Platform",
			items: [
				{
					name: "Playground",
					path: "/playground",
					icon: SquareTerminal,
					items: [
						{
							name: "History",
							path: "/playground/history"
						},
						{
							name: "Starred",
							path: "/playground/starred"
						},
						{
							name: "Settings",
							path: "/playground/settings"
						}
					]
				},
				{
					name: "Models",
					path: "/models",
					icon: Bot
				},
				{
					name: "Documentation",
					path: "/docs",
					icon: BookOpen,
					external: true
				},
				{
					name: "Settings",
					path: "/settings",
					icon: Settings2
				}
			]
		},
		{
			section: "Projects",
			items: [
				{
					name: "Design Engineering",
					path: "/projects/design",
					icon: Frame,
					badge: 3
				},
				{
					name: "Sales & Marketing",
					path: "/projects/sales",
					icon: PieChart
				},
				{
					name: "Travel",
					path: "/projects/travel",
					icon: Map
				}
			]
		}
	];
	
	// Toggle functions
	function toggleTheme() {
		isDarkMode.update(v => !v);
	}
	
	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}
	
	function setContext(contextId: string) {
		console.log('Setting context:', contextId);
	}
</script>

<ShellLayout
	isDarkMode={$isDarkMode}
	{isMobileMenuOpen}
	{activeContext}
	{appContexts}
	{activeNavItems}
	{toggleTheme}
	{toggleMobileMenu}
	{setContext}
>
	<div class="flex items-center justify-center h-full w-full">
		<div class="max-w-md mx-auto p-6 bg-card rounded-lg shadow-lg border">
			<h1 class="text-2xl font-bold mb-4">Welcome to Acme Inc</h1>
			<p class="mb-4">This is a demonstration of the enhanced sidebar navigation based on the reference image.</p>
			<p class="mb-4">Features:</p>
			<ul class="list-disc pl-6 mb-4 space-y-2">
				<li>Nested navigation items with collapsible sections</li>
				<li>Improved visual styling matching modern design patterns</li>
				<li>Badge notifications on menu items</li>
				<li>External link indicators</li>
				<li>Keyboard navigation with Alt+number shortcuts</li>
				<li>Mobile-friendly responsive design</li>
			</ul>
			<div class="flex justify-center mt-6">
				<button class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
					Get Started
				</button>
			</div>
		</div>
	</div>
</ShellLayout>

<style>
	:global(html, body) {
		height: 100%;
		margin: 0;
		padding: 0;
	}
</style>
