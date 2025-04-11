<script lang="ts">
    import { page } from '$app/stores';
    import { cn } from '$lib/utils';
    import { 
        Search, 
        Bell, 
        User, 
        Moon, 
        Sun, 
        Menu, 
        X,
        ChevronDown
    } from 'lucide-svelte';
    import type { AppContext } from '$lib/stores/navigationStore';

    // Props
    export let isDarkMode: boolean;
    export let isMobileMenuOpen: boolean;
    export let activeContext: {id: string, name: string, icon: any};
    export let appContexts: {id: string, name: string, icon: any}[];
    
    // Function props (events)
    export let toggleTheme: () => void;
    export let toggleMobileMenu: () => void;
    export let setContext: (contextId: AppContext) => void;
</script>

<header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="container flex h-14 items-center">
        <!-- Mobile menu button -->
        <div class="mr-4 flex md:hidden">
            <button 
                type="button"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
                on:click={toggleMobileMenu}
                class="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
                {#if isMobileMenuOpen}
                    <X class="h-5 w-5" aria-hidden="true" />
                {:else}
                    <Menu class="h-5 w-5" aria-hidden="true" />
                {/if}
                <span class="sr-only">{isMobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
            </button>
        </div>
        
        <!-- Logo -->
        <div class="mr-4 hidden md:flex">
            <a href="/" class="flex items-center space-x-2">
                <img src="/logo.png" alt="Mixcore CMS Logo" class="h-6 w-6" />
                <span class="font-bold">Mixcore CMS</span>
            </a>
        </div>

        <!-- App Context Selector -->
        <div class="flex-1 items-center md:flex">
            <div class="relative inline-block text-left">
                <div>
                    <button 
                        type="button" 
                        id="app-context-button"
                        aria-haspopup="true"
                        aria-expanded="false"
                        class="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground"
                    >
                        <svelte:component this={activeContext.icon} class="mr-2 h-4 w-4" aria-hidden="true" />
                        {activeContext.name}
                        <ChevronDown class="ml-2 h-4 w-4" aria-hidden="true" />
                    </button>
                </div>
                
                <!-- App Context Dropdown would go here -->
                <!-- We'll just include a placeholder structure for now -->
                <!-- <div class="absolute left-0 z-10 mt-2 w-56 rounded-md bg-popover shadow-lg ring-1 ring-black ring-opacity-5">
                    <div class="p-1" role="menu" aria-orientation="vertical" aria-labelledby="app-context-button">
                        {#each appContexts as context}
                            <button 
                                on:click={() => setContext(context.id)}
                                class={cn(
                                    "flex w-full items-center rounded-md px-2 py-2 text-sm text-foreground",
                                    context.id === activeContext.id ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"
                                )}
                                role="menuitem"
                            >
                                <svelte:component this={context.icon} class="mr-2 h-4 w-4" aria-hidden="true" />
                                {context.name}
                            </button>
                        {/each}
                    </div>
                </div> -->
            </div>
        </div>

        <!-- Header Actions -->
        <div class="flex items-center justify-end space-x-1 md:space-x-2">
            <!-- Search button -->
            <button 
                type="button"
                aria-label="Search"
                class="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
                <Search class="h-5 w-5" aria-hidden="true" />
                <span class="sr-only">Search</span>
            </button>
            
            <!-- Notifications button -->
            <button 
                type="button"
                aria-label="Notifications"
                class="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
                <Bell class="h-5 w-5" aria-hidden="true" />
                <span class="sr-only">Notifications</span>
            </button>
            
            <!-- Theme toggle button -->
            <button 
                type="button"
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                on:click={toggleTheme} 
                class="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
                {#if isDarkMode}
                    <Sun class="h-5 w-5" aria-hidden="true" />
                {:else}
                    <Moon class="h-5 w-5" aria-hidden="true" />
                {/if}
                <span class="sr-only">{isDarkMode ? "Switch to light mode" : "Switch to dark mode"}</span>
            </button>
            
            <!-- User menu -->
            <div class="relative inline-block text-left">
                <button 
                    type="button"
                    aria-label="User menu"
                    aria-haspopup="true"
                    aria-expanded="false"
                    class="inline-flex items-center justify-center rounded-full h-8 w-8 border bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    <User class="h-4 w-4" aria-hidden="true" />
                    <span class="sr-only">User menu</span>
                </button>
                <!-- User dropdown would go here -->
            </div>
        </div>
    </div>
</header> 