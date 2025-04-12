<script lang="ts">
    import { page } from '$app/stores';
    import { cn } from '$lib/utils';
    import { onMount, createEventDispatcher, tick } from 'svelte';
    import { browser } from '$app/environment';
    
    // Components
    import Header from './Header.svelte';
    import Sidebar from './Sidebar.svelte';
    import MiniAppLoader from '../../lib/mini-app/MiniAppLoader.svelte';
    
    // Stores & Types
    import { type AppContext } from '$lib/stores/navigationStore';
    import { miniAppRegistry } from '../../lib/mini-app/MiniAppRegistry';
    import { authStore, currentUser } from '$lib/stores/authStore';
    
    // Props - Layout settings
    export let isDarkMode: boolean = false;
    export let isMobileMenuOpen: boolean = false;
    export let activeContext: {id: string, name: string, icon: any};
    export let appContexts: {id: string, name: string, icon: any}[];
    export let activeNavItems: Array<{
        section: string;
        items: {
            name: string;
            path: string;
            icon: any;
            badge?: number;
            external?: boolean;
            items?: {
                name: string;
                path: string;
                badge?: number;
            }[];
        }[];
    }>;
    export let condensed: boolean = false; // When true, content is constrained to max width
    export let hideHeader: boolean = false;
    
    // Mini-app related props
    export let miniAppId: string | null = null;
    export let miniAppUrl: string | null = null;
    export let miniAppProps: Record<string, any> = {};
    export let showMiniApp: boolean = false;
    
    // Function props (events)
    export let toggleTheme: () => void;
    export let toggleMobileMenu: () => void;
    export let setContext: (contextId: AppContext) => void;
    
    // State
    let mainElement: HTMLElement;
    let shellContainer: HTMLElement;
    let shellReady = false;
    let headerHeight = 56; // Default header height in pixels
    let sidebarCollapsed = false; // Track sidebar collapsed state
    
    // User info - will be populated from auth store
    let userFullName = '';
    let userEmail = '';
    let userAvatar = '';
    let userInitials = '';
    let notificationCount = 0; // Notification count example
    
    // Watch for changes in the currentUser store
    $: if ($currentUser) {
        userFullName = $currentUser.displayName || $currentUser.userName;
        userEmail = $currentUser.email;
        userAvatar = $currentUser.avatarUrl || '';
        
        // Generate initials from full name
        if (userFullName) {
            const nameParts = userFullName.split(' ');
            if (nameParts.length >= 2) {
                userInitials = nameParts[0][0] + nameParts[nameParts.length - 1][0];
            } else if (nameParts.length === 1) {
                userInitials = nameParts[0].substring(0, 2);
            }
            userInitials = userInitials.toUpperCase();
        }
    }
    
    // Event dispatcher
    const dispatch = createEventDispatcher<{
        overlayClick: void;
        ready: void;
        resize: { width: number; height: number };
        miniAppLoad: { appId: string, config: any };
        miniAppError: { error: Error, appId: string | null };
        miniAppUnload: { appId: string | null };
        logout: void;
    }>();
    
    // Handle overlay click to close the mobile menu
    function handleOverlayClick() {
        dispatch('overlayClick');
    }
    
    // Handle sidebar toggle
    function handleSidebarToggle(event: CustomEvent<boolean>) {
        sidebarCollapsed = event.detail;
        updateShellDimensions();
        
        // Save collapsed state to localStorage
        if (browser) {
            localStorage.setItem('mixcore_sidebar_collapsed', String(sidebarCollapsed));
        }
    }
    
    // Handle user action event from sidebar
    function handleUserAction(event: CustomEvent<string>) {
        const action = event.detail;
        
        if (action === 'logout') {
            // Log out the user
            authStore.logout();
            dispatch('logout');
        } else {
            console.log('User action:', action);
        }
    }
    
    // Handle mini-app events
    function handleMiniAppLoad(event: CustomEvent<{ appId: string, config: any }>) {
        dispatch('miniAppLoad', event.detail);
    }
    
    function handleMiniAppError(event: CustomEvent<{ error: Error, appId: string | null }>) {
        dispatch('miniAppError', event.detail);
    }
    
    function handleMiniAppUnload(event: CustomEvent<{ appId: string | null }>) {
        dispatch('miniAppUnload', event.detail);
    }
    
    // Initialize shell when mounted
    onMount(() => {
        // Skip browser-specific code during SSR
        if (!browser) return;
        
        // Initialize shell
        void tick().then(() => {
            updateShellDimensions();
            shellReady = true;
        });
        
        // Add resize listener
        const resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                if (entry.target === shellContainer) {
                    updateShellDimensions();
                    dispatch('resize', {
                        width: entry.contentRect.width,
                        height: entry.contentRect.height
                    });
                }
            }
        });
        
        resizeObserver.observe(shellContainer);
        
        // Initialize keyboard navigation
        if (shellContainer) {
            shellContainer.addEventListener('keydown', handleKeyDown);
        }
        
        // Load sidebar collapsed state from localStorage
        if (typeof window !== 'undefined') {
            const savedCollapsedState = localStorage.getItem('mixcore_sidebar_collapsed');
            if (savedCollapsedState !== null) {
                sidebarCollapsed = savedCollapsedState === 'true';
            }
        }
        
        // Cleanup on destroy
        return () => {
            resizeObserver.disconnect();
            if (shellContainer) {
                shellContainer.removeEventListener('keydown', handleKeyDown);
            }
        };
    });
    
    // Update shell dimensions for responsive layouts
    function updateShellDimensions() {
        if (mainElement) {
            mainElement.style.height = hideHeader 
                ? '100%' 
                : `calc(100% - ${headerHeight}px)`;
        }
    }
    
    // Handle keyboard navigation
    function handleKeyDown(e: KeyboardEvent) {
        // Close menu on Escape
        if (e.key === 'Escape' && isMobileMenuOpen) {
            handleOverlayClick();
        }
        
        // Toggle sidebar with keyboard shortcut (Alt+S)
        if (e.altKey && e.key === 's') {
            toggleMobileMenu();
            e.preventDefault();
        }
    }
    
    // Performance optimization - memoize/cache context data
    let cachedPagePath = '';
    let isCurrentPage = (path: string) => {
        if (cachedPagePath !== $page.url.pathname) {
            cachedPagePath = $page.url.pathname;
        }
        return cachedPagePath === path;
    };
    
    $: {
        // Update shell when these reactive values change
        if (shellReady && (isDarkMode || isMobileMenuOpen || hideHeader)) {
            updateShellDimensions();
        }
    }
</script>

<div 
    id="shell" 
    class={cn(
        "flex h-screen flex-col overflow-hidden bg-background font-sans antialiased",
        condensed ? "shell-condensed" : "",
        isDarkMode ? "dark" : "",
        shellReady ? "shell-ready" : "shell-loading"
    )}
    bind:this={shellContainer}
>
    <div class="relative flex flex-1 overflow-hidden">
        <!-- Sidebar - hidden by default on mobile, always visible on desktop -->
        <Sidebar 
            isMobileMenuOpen={isMobileMenuOpen}
            activeNavItems={activeNavItems}
            isCollapsed={sidebarCollapsed}
            userFullName={userFullName}
            userEmail={userEmail}
            userAvatar={userAvatar}
            userInitials={userInitials}
            notificationCount={notificationCount}
            isAuthenticated={$authStore.isAuthenticated}
            on:overlayClick={handleOverlayClick}
            on:toggleCollapsed={handleSidebarToggle}
            on:userAction={handleUserAction}
        />
        
        <!-- Main content container including header and scrollable content -->
        <div 
            class={cn(
                "flex flex-1 flex-col w-full transition-all duration-300",
                !hideHeader && !sidebarCollapsed && "md:ml-[250px]",
                !hideHeader && sidebarCollapsed && "md:ml-[60px]"
            )}
        >
            <!-- Header - fixed at top -->
            {#if !hideHeader}
                <div bind:clientHeight={headerHeight}>
                    <Header 
                        isDarkMode={isDarkMode}
                        isMobileMenuOpen={isMobileMenuOpen}
                        activeContext={activeContext}
                        appContexts={appContexts} 
                        toggleTheme={toggleTheme}
                        toggleMobileMenu={toggleMobileMenu}
                        setContext={setContext}
                        condensed={condensed}
                        userFullName={userFullName}
                        userEmail={userEmail}
                        userAvatar={userAvatar}
                        userInitials={userInitials}
                        isAuthenticated={$authStore.isAuthenticated}
                        on:userAction={handleUserAction}
                    />
                </div>
            {/if}
            
            <!-- Main scrollable content area -->
            <main 
                id="main-content"
                class={cn(
                    "flex-1 overflow-auto relative p-4 md:p-6"
                )}
                data-app-context={activeContext.id}
                bind:this={mainElement}
            >
                <!-- Skip to content link for accessibility -->
                <a 
                    href="#main-content" 
                    class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:outline-none"
                >
                    Skip to content
                </a>
                
                <!-- Page layout wrapper -->
                <div class={cn("h-full w-full", condensed && "container max-w-7xl mx-auto")}>
                    <!-- Mini-app loader (shown if showMiniApp is true) -->
                    {#if showMiniApp}
                        <MiniAppLoader 
                            appId={miniAppId}
                            appUrl={miniAppUrl}
                            appProps={miniAppProps}
                            on:load={handleMiniAppLoad}
                            on:error={handleMiniAppError}
                            on:unload={handleMiniAppUnload}
                        />
                    <!-- Regular content slot -->
                    {:else}
                        <slot />
                    {/if}
                </div>
            </main>
        </div>
    </div>
</div>

<style>
    /* Shell-specific global styles */
    :global(body) {
        @apply overflow-hidden;
    }
    
    /* Focus styles for keyboard navigation */
    :global(:focus-visible) {
        @apply outline-2 outline-offset-2 outline-primary;
    }
</style> 