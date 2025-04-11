<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	
	// Layouts & Providers
	import ShellLayout from '../components/layout/ShellLayout.svelte';
	import NavigationContextProvider from '../lib/providers/NavigationContextProvider.svelte';
	
	// Stores
	import { currentContext, getNavigationItems, getActiveContext, type AppContext, appContexts } from '$lib/stores/navigationStore';
	import { isDarkMode, toggleTheme, initializeTheme } from '$lib/stores/themeStore';
	import { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } from '$lib/stores/mobileMenuStore';
	
	// Layout configuration
	let condensedLayout = false;
	let hideHeader = false;
	
	// Initialize the theme based on user preference
	onMount(() => {
		initializeTheme();
		
		// Restore layout preferences if any
		if (browser) {
			try {
				const savedCondensed = localStorage.getItem('mixcore_condensed_layout');
				if (savedCondensed) {
					condensedLayout = savedCondensed === 'true';
				}
				
				const savedHideHeader = localStorage.getItem('mixcore_hide_header');
				if (savedHideHeader) {
					hideHeader = savedHideHeader === 'true';
				}
			} catch (e) {
				console.warn('Failed to restore layout preferences:', e);
			}
		}
	});
	
	// Function to set the context
	function setContext(contextId: AppContext) {
		currentContext.set(contextId);
	}

	// Handle overlay click to close the mobile menu
	function handleOverlayClick() {
		closeMobileMenu();
	}
	
	// Toggle condensed layout
	function toggleCondensedLayout() {
		condensedLayout = !condensedLayout;
		if (browser) {
			try {
				localStorage.setItem('mixcore_condensed_layout', String(condensedLayout));
			} catch (e) {
				console.warn('Failed to save layout preference:', e);
			}
		}
	}
	
	// Toggle header visibility
	function toggleHeader() {
		hideHeader = !hideHeader;
		if (browser) {
			try {
				localStorage.setItem('mixcore_hide_header', String(hideHeader));
			} catch (e) {
				console.warn('Failed to save header preference:', e);
			}
		}
	}
	
	// Handle shell ready event
	function handleShellReady() {
		console.log('Shell UI is ready');
	}
</script>

<NavigationContextProvider 
	initialContext="cms" 
	let:activeContext 
	let:navigationItems
	let:isContextChanging
>
	<ShellLayout
		isDarkMode={$isDarkMode}
		isMobileMenuOpen={$isMobileMenuOpen}
		activeContext={activeContext}
		appContexts={appContexts}
		activeNavItems={navigationItems}
		condensed={condensedLayout}
		hideHeader={hideHeader}
		toggleTheme={toggleTheme}
		toggleMobileMenu={toggleMobileMenu}
		setContext={setContext}
		on:overlayClick={handleOverlayClick}
		on:ready={handleShellReady}
	>
		<slot />
	</ShellLayout>
</NavigationContextProvider>

<style>
	:global(html) {
		@apply antialiased;
	}
</style>
