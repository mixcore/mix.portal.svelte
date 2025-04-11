<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	
	// Layouts & Providers
	import ShellLayout from '../components/layout/ShellLayout.svelte';
	import NavigationContextProvider from '../lib/providers/NavigationContextProvider.svelte';
	
	// Stores
	import { currentContext, getNavigationItems, getActiveContext, type AppContext, appContexts } from '$lib/stores/navigationStore';
	import { isDarkMode, toggleTheme, initializeTheme } from '$lib/stores/themeStore';
	import { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } from '$lib/stores/mobileMenuStore';
	
	// Initialize the theme based on user preference
	onMount(() => {
		initializeTheme();
	});
	
	// Function to set the context
	function setContext(contextId: AppContext) {
		currentContext.set(contextId);
	}

	// Handle overlay click to close the mobile menu
	function handleOverlayClick() {
		closeMobileMenu();
	}
</script>

<NavigationContextProvider initialContext="cms" let:activeContext let:navigationItems>
	<ShellLayout
		isDarkMode={$isDarkMode}
		isMobileMenuOpen={$isMobileMenuOpen}
		activeContext={activeContext}
		appContexts={appContexts}
		activeNavItems={navigationItems}
		toggleTheme={toggleTheme}
		toggleMobileMenu={toggleMobileMenu}
		setContext={setContext}
		on:overlayClick={handleOverlayClick}
	>
		<slot />
	</ShellLayout>
</NavigationContextProvider>

<style>
	:global(html) {
		@apply antialiased;
	}
</style>
