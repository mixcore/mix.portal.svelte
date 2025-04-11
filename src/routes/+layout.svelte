<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { initializeThemeVariables } from '$lib/utils';
	
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
	
	// Check if current route is an auth route
	$: isAuthRoute = $page.url.pathname.startsWith('/auth');
	
	// Initialize the theme based on user preference
	onMount(() => {
		if (!isAuthRoute) {
			initializeTheme();
			initializeThemeVariables();
			
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

{#if isAuthRoute}
	<!-- Auth routes use their own layout defined in /auth/+layout.svelte -->
	<slot />
{:else}
	<!-- Dashboard and other routes use the shell layout -->
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
{/if}

<style>
	:global(html) {
		@apply antialiased;
	}
	
	/* Define global CSS variables for sidebar theme */
	:global(:root) {
		--sidebar-foreground: theme('colors.foreground');
		--sidebar-background: theme('colors.background');
		--sidebar-border: theme('colors.border');
		--sidebar-accent: theme('colors.accent.DEFAULT');
		--sidebar-accent-foreground: theme('colors.accent.foreground');
		--sidebar-ring: theme('colors.ring');
		--sidebar-primary: theme('colors.primary.DEFAULT');
		--sidebar-primary-foreground: theme('colors.primary.foreground');
	}
</style>
