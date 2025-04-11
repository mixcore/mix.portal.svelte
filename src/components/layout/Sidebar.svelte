<script lang="ts">
    import { page } from '$app/stores';
    import { cn } from '$lib/utils';
    import { createEventDispatcher, onMount } from 'svelte';
    import { slide } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import { writable } from 'svelte/store';
    import {
        ChevronDown,
        ChevronRight,
        ChevronLeft,
        PanelLeft,
        Home,
        Settings,
        LogOut
    } from 'lucide-svelte';

    // Event dispatcher for the overlay click
    const dispatch = createEventDispatcher<{
        overlayClick: void;
        toggleCollapsed: boolean;
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
    export let isCollapsed = false; // New prop for collapsible sidebar

    // Create a store to track expanded sections
    const expandedSections = writable<Record<string, boolean>>({});
    
    // Initialize expanded sections
    onMount(() => {
        const sections = activeNavItems.reduce((acc, section) => {
            // By default, expand only the section containing the active item
            const hasActiveItem = section.items.some(item => $page.url.pathname === item.path);
            acc[section.section] = hasActiveItem;
            return acc;
        }, {} as Record<string, boolean>);
        
        expandedSections.set(sections);
        
        // Save preferences to localStorage
        if (typeof window !== 'undefined') {
            const savedCollapsedState = localStorage.getItem('mixcore_sidebar_collapsed');
            if (savedCollapsedState !== null) {
                isCollapsed = savedCollapsedState === 'true';
            }
        }
    });

    // Handler for the overlay click
    function handleOverlayClick() {
        dispatch('overlayClick');
    }
    
    // Toggle section expansion
    function toggleSection(section: string) {
        expandedSections.update(sections => {
            return { ...sections, [section]: !sections[section] };
        });
    }
    
    // Toggle sidebar collapsed state
    function toggleCollapsed() {
        isCollapsed = !isCollapsed;
        
        // Save preference to localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem('mixcore_sidebar_collapsed', isCollapsed.toString());
        }
        
        dispatch('toggleCollapsed', isCollapsed);
    }
</script>

<aside 
    id="sidebar"
    class={cn(
        "z-30 bg-background border-r transition-all duration-300 ease-in-out",
        isMobileMenuOpen 
            ? "fixed inset-y-0 left-0 h-full" 
            : "fixed -left-[250px] h-full md:left-0 md:block",
        isCollapsed ? "w-[60px]" : "w-[250px]"
    )}
>
    <nav class="flex flex-col h-full" aria-label="Main navigation">
        <!-- Mobile header -->
        <div class="flex h-14 items-center justify-between border-b px-4">
            <a href="/" class="flex items-center gap-2 font-semibold">
                <img src="/logo.png" alt="Mixcore CMS Logo" class="h-6 w-6" />
                {#if !isCollapsed}
                    <span>Mixcore CMS</span>
                {/if}
            </a>
            
            <!-- Collapse toggle button (desktop only) -->
            <button 
                type="button"
                class="hidden md:flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                on:click={toggleCollapsed}
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
                {#if isCollapsed}
                    <ChevronRight class="h-4 w-4" />
                {:else}
                    <ChevronLeft class="h-4 w-4" />
                {/if}
            </button>
        </div>
        
        <!-- Navigation sections -->
        <div class="flex-1 overflow-auto py-4 px-2 space-y-3">
            {#each activeNavItems as section}
                <div class="space-y-1">
                    {#if !isCollapsed}
                        <!-- Section header with toggle -->
                        <button 
                            type="button"
                            class="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-accent/50 transition-colors"
                            on:click={() => toggleSection(section.section)}
                            aria-expanded={$expandedSections[section.section]}
                            aria-controls={`nav-section-${section.section.toLowerCase()}`}
                        >
                            <span>{section.section}</span>
                            <ChevronDown 
                                class={cn(
                                    "h-4 w-4 transition-transform", 
                                    $expandedSections[section.section] ? "rotate-0" : "-rotate-90"
                                )} 
                            />
                        </button>
                    {:else}
                        <!-- Section divider for collapsed mode -->
                        <div class="h-px bg-border mx-2 my-3"></div>
                    {/if}
                    
                    <!-- Section items -->
                    {#if !isCollapsed || !$expandedSections[section.section]}
                        <div 
                            id={`nav-section-${section.section.toLowerCase()}`}
                            role="group" 
                            aria-labelledby={`nav-section-${section.section.toLowerCase()}`}
                            class="space-y-1"
                        >
                            {#each section.items as item}
                                <a
                                    href={item.path}
                                    class={cn(
                                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                                        $page.url.pathname === item.path 
                                            ? 'bg-primary/10 text-primary font-medium' 
                                            : 'text-muted-foreground hover:text-foreground',
                                        isCollapsed && 'justify-center px-0'
                                    )}
                                    aria-current={$page.url.pathname === item.path ? "page" : undefined}
                                    title={isCollapsed ? item.name : undefined}
                                >
                                    <svelte:component this={item.icon} class={cn("h-4 w-4", isCollapsed && "h-5 w-5")} aria-hidden="true" />
                                    {#if !isCollapsed}
                                        <span>{item.name}</span>
                                    {/if}
                                </a>
                            {/each}
                        </div>
                    {:else if $expandedSections[section.section] && !isCollapsed}
                        <div 
                            transition:slide={{ duration: 200, easing: quintOut }}
                            id={`nav-section-${section.section.toLowerCase()}`}
                            role="group" 
                            aria-labelledby={`nav-section-${section.section.toLowerCase()}`}
                            class="space-y-1"
                        >
                            {#each section.items as item}
                                <a
                                    href={item.path}
                                    class={cn(
                                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                                        $page.url.pathname === item.path 
                                            ? 'bg-primary/10 text-primary font-medium' 
                                            : 'text-muted-foreground hover:text-foreground'
                                    )}
                                    aria-current={$page.url.pathname === item.path ? "page" : undefined}
                                >
                                    <svelte:component this={item.icon} class="h-4 w-4" aria-hidden="true" />
                                    <span>{item.name}</span>
                                </a>
                            {/each}
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
        
        <!-- Footer actions -->
        <div class={cn("border-t p-3", isCollapsed ? "text-center" : "")}>
            <div class="space-y-1">
                {#if !isCollapsed}
                    <a 
                        href="/settings"
                        class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all text-muted-foreground hover:text-foreground hover:bg-accent"
                    >
                        <Settings class="h-4 w-4" />
                        <span>Settings</span>
                    </a>
                    <button 
                        type="button"
                        class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all text-red-500 hover:bg-red-500/10"
                    >
                        <LogOut class="h-4 w-4" />
                        <span>Sign out</span>
                    </button>
                {:else}
                    <a 
                        href="/settings"
                        class="flex justify-center items-center rounded-lg p-2 text-sm transition-all text-muted-foreground hover:text-foreground hover:bg-accent"
                        title="Settings"
                    >
                        <Settings class="h-5 w-5" />
                    </a>
                    <button 
                        type="button"
                        class="flex justify-center w-full items-center rounded-lg p-2 text-sm transition-all text-red-500 hover:bg-red-500/10"
                        title="Sign out"
                    >
                        <LogOut class="h-5 w-5" />
                    </button>
                {/if}
            </div>
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