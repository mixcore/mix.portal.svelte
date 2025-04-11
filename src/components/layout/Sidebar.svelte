<script lang="ts">
    import { page } from '$app/stores';
    import { cn } from '$lib/utils';
    import { createEventDispatcher } from 'svelte';

    // Event dispatcher for the overlay click
    const dispatch = createEventDispatcher<{
        overlayClick: void;
    }>();

    // Props
    export let isMobileMenuOpen: boolean;
    export let activeNavItems: { 
        section: string;
        items: {
            name: string;
            path: string;
            icon: any;
        }[];
    }[];

    // Handler for the overlay click
    function handleOverlayClick() {
        dispatch('overlayClick');
    }
</script>

<aside 
    id="sidebar"
    class={cn(
        "z-30 bg-background border-r transition-all duration-300 ease-in-out",
        isMobileMenuOpen 
            ? "fixed inset-y-0 left-0 w-[250px] h-full" 
            : "fixed -left-[250px] w-[250px] h-full md:left-0 md:block"
    )}
>
    <nav class="flex flex-col h-full" aria-label="Main navigation">
        <!-- Mobile header -->
        <div class="flex h-14 items-center border-b px-4 md:hidden">
            <a href="/" class="flex items-center gap-2 font-semibold">
                <img src="/logo.png" alt="Mixcore CMS Logo" class="h-6 w-6" />
                <span>Mixcore CMS</span>
            </a>
        </div>
        
        <!-- Navigation sections -->
        <div class="flex-1 overflow-auto py-4 px-4 space-y-6">
            {#each activeNavItems as section}
                <div class="space-y-1">
                    <h2 id={`nav-section-${section.section.toLowerCase()}`} class="px-2 text-lg font-semibold tracking-tight">{section.section}</h2>
                    <div class="space-y-1" role="group" aria-labelledby={`nav-section-${section.section.toLowerCase()}`}>
                        {#each section.items as item}
                            <a
                                href={item.path}
                                class={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                                    $page.url.pathname === item.path ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                                )}
                                aria-current={$page.url.pathname === item.path ? "page" : undefined}
                            >
                                <svelte:component this={item.icon} class="h-4 w-4" aria-hidden="true" />
                                <span>{item.name}</span>
                            </a>
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
    </nav>
</aside>

<!-- Mobile overlay for sidebar -->
{#if isMobileMenuOpen}
    <div 
        class="fixed inset-0 z-20 bg-background/80 backdrop-blur-sm md:hidden"
        on:click={handleOverlayClick}
        aria-hidden="true"
    ></div>
{/if} 