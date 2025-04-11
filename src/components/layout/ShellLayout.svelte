<script lang="ts">
    import { page } from '$app/stores';
    import { cn } from '$lib/utils';
    import { onMount, createEventDispatcher } from 'svelte';
    
    // Components
    import Header from './Header.svelte';
    import Sidebar from './Sidebar.svelte';
    
    // Stores & Types
    import { type AppContext } from '$lib/stores/navigationStore';
    
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
        }[];
    }>;
    
    // Function props (events)
    export let toggleTheme: () => void;
    export let toggleMobileMenu: () => void;
    export let setContext: (contextId: AppContext) => void;
    
    // Event dispatcher
    const dispatch = createEventDispatcher<{
        overlayClick: void;
    }>();
    
    // Handle overlay click to close the mobile menu
    function handleOverlayClick() {
        dispatch('overlayClick');
    }
    
    // Performance optimization - memoize/cache context data
    let cachedPagePath = '';
    let isCurrentPage = (path: string) => {
        if (cachedPagePath !== $page.url.pathname) {
            cachedPagePath = $page.url.pathname;
        }
        return cachedPagePath === path;
    };
</script>

<div class={cn(
    "h-screen overflow-hidden",
    "bg-background text-foreground",
    isDarkMode ? "dark" : ""
)}>
    <div class="flex h-full flex-col md:flex-row">
        <!-- Sidebar - hidden by default on mobile, always visible on desktop -->
        <Sidebar 
            isMobileMenuOpen={isMobileMenuOpen}
            activeNavItems={activeNavItems}
            on:overlayClick={handleOverlayClick}
        />
        
        <!-- Main content container including header and scrollable content -->
        <div class="flex flex-1 flex-col md:ml-[250px] w-full">
            <!-- Header - fixed at top -->
            <Header 
                isDarkMode={isDarkMode}
                isMobileMenuOpen={isMobileMenuOpen}
                activeContext={activeContext}
                appContexts={appContexts} 
                toggleTheme={toggleTheme}
                toggleMobileMenu={toggleMobileMenu}
                setContext={setContext}
            />
            
            <!-- Main scrollable content area -->
            <main 
                id="main-content"
                class="flex-1 overflow-auto p-4 md:p-6"
                data-app-context={activeContext.id}
            >
                <!-- Page layout wrapper -->
                <div class="container mx-auto">
                    <slot />
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
</style> 