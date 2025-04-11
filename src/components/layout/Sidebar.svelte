<script lang="ts">
    import { page } from '$app/stores';
    import { cn } from '$lib/utils';
    import { createEventDispatcher, onMount, tick } from 'svelte';
    import { slide, fade } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import { writable } from 'svelte/store';
    import {
        ChevronDown,
        ChevronRight,
        ChevronLeft,
        ChevronsUpDown,
        MoreHorizontal,
        User,
        Settings,
        LogOut,
        Bell,
        Keyboard,
        HelpCircle,
        ExternalLink
    } from 'lucide-svelte';

    // Event dispatcher for the overlay click
    const dispatch = createEventDispatcher<{
        overlayClick: void;
        toggleCollapsed: boolean;
        userAction: string;
    }>();

    // Props
    export let isMobileMenuOpen: boolean;
    export let activeNavItems: { 
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
    }[];
    export let isCollapsed = false; // Sidebar collapsed state
    export let userFullName = 'John Doe';
    export let userEmail = 'john.doe@example.com';
    export let userAvatar = '';
    export let userInitials = 'JD';
    export let notificationCount = 0;
    
    // Create stores to track expanded sections and items
    const expandedSections = writable<Record<string, boolean>>({});
    const expandedItems = writable<Record<string, boolean>>({});
    
    // Local state
    let isUserMenuOpen = false;
    let focusedItem: {sectionIndex: number, itemIndex: number} | null = null;
    let hoverSection: string | null = null;
    
    // Initialize expanded sections
    onMount(() => {
        // Initialize section expansion state
        const sections = activeNavItems.reduce((acc, section) => {
            // By default, expand only the section containing the active item
            const hasActiveItem = section.items.some(item => 
                $page.url.pathname === item.path || 
                (item.items?.some(subItem => $page.url.pathname === subItem.path) || false)
            );
            acc[section.section] = hasActiveItem;
            return acc;
        }, {} as Record<string, boolean>);
        expandedSections.set(sections);
        
        // Initialize item expansion state
        const items = activeNavItems.flatMap(section => section.items)
            .filter(item => item.items && item.items.length > 0)
            .reduce((acc, item) => {
                // Expand item if it contains the active path
                const hasActiveSubItem = item.items?.some(subItem => 
                    $page.url.pathname === subItem.path
                ) || false;
                acc[item.name] = hasActiveSubItem;
                return acc;
            }, {} as Record<string, boolean>);
        expandedItems.set(items);
        
        // Load sidebar collapsed state from localStorage
        if (typeof window !== 'undefined') {
            const savedCollapsedState = localStorage.getItem('mixcore_sidebar_collapsed');
            if (savedCollapsedState !== null) {
                isCollapsed = savedCollapsedState === 'true';
            }
        }
        
        // Add keyboard navigation event listener
        document.addEventListener('keydown', handleKeyboardNavigation);
        
        return () => {
            document.removeEventListener('keydown', handleKeyboardNavigation);
        };
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
    
    // Toggle item expansion (for nested items)
    function toggleItem(item: string) {
        expandedItems.update(items => {
            return { ...items, [item]: !items[item] };
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
    
    // Get active state for a menu item
    function isActiveItem(path: string): boolean {
        return $page.url.pathname === path;
    }
    
    // Toggle user menu dropdown
    function toggleUserMenu() {
        isUserMenuOpen = !isUserMenuOpen;
    }
    
    // Close user menu dropdown
    function closeUserMenu() {
        isUserMenuOpen = false;
    }
    
    // Handle user menu actions (logout, settings, etc.)
    function handleUserAction(action: string) {
        closeUserMenu();
        dispatch('userAction', action);
    }
    
    // Keyboard navigation for accessibility
    function handleKeyboardNavigation(e: KeyboardEvent) {
        // Only handle when sidebar is visible
        if (isCollapsed && !isMobileMenuOpen) return;
        
        // Alt+numeric keys to navigate sections
        if (e.altKey && e.key >= '1' && e.key <= '9') {
            const sectionIndex = parseInt(e.key) - 1;
            if (sectionIndex < activeNavItems.length) {
                // Expand the section
                const sectionName = activeNavItems[sectionIndex].section;
                expandedSections.update(sections => ({
                    ...sections,
                    [sectionName]: true
                }));
                
                // Focus the first item
                focusedItem = { sectionIndex, itemIndex: 0 };
                tick().then(() => {
                    const elem = document.querySelector(`[data-section-index="${sectionIndex}"][data-item-index="0"]`) as HTMLElement;
                    if (elem) elem.focus();
                });
                e.preventDefault();
            }
        }
        
        // Esc to close user menu
        if (e.key === 'Escape' && isUserMenuOpen) {
            closeUserMenu();
            e.preventDefault();
        }
    }
    
    // Mark section as hovered
    function setHoverSection(section: string | null) {
        hoverSection = section;
    }
</script>

<div 
    class={cn(
        "group peer hidden text-sidebar-foreground md:block",
        isCollapsed ? "data-[collapsible=icon]" : "data-[state=expanded]",
    )}
    data-variant="sidebar" 
    data-side="left"
    role="navigation"
    aria-label="Main navigation"
>
    <div 
        class="fixed inset-y-0 z-10 hidden h-svh border-r bg-sidebar transition-[left,right,width] duration-300 ease-in-out md:flex left-0"
        style:width={isCollapsed ? 'var(--sidebar-width-icon, 60px)' : 'var(--sidebar-width, 250px)'}
    >
        <div data-sidebar="sidebar" class="flex h-full w-full flex-col bg-sidebar">
            <!-- Sidebar header -->
            <div data-sidebar="header" class="flex flex-col gap-2 p-2 border-b">
                <ul data-sidebar="menu" class="flex w-full min-w-0 flex-col gap-1">
                    <li data-sidebar="menu-item" class="group/menu-item relative">
                        <button 
                            type="button"
                            data-sidebar="menu-button" 
                            data-size="lg"
                            class="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none h-12 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring"
                            style:padding={isCollapsed ? '0' : undefined}
                            aria-label={isCollapsed ? "Mixcore CMS" : undefined}
                        >
                            <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                <img src="/logo.png" alt="Mixcore CMS Logo" class="h-5 w-5" />
                            </div>
                            {#if !isCollapsed}
                                <div class="grid flex-1 text-left text-sm leading-tight">
                                    <span class="truncate font-semibold">Mixcore CMS</span>
                                    <span class="truncate text-xs text-sidebar-foreground/70">Enterprise</span>
                                </div>
                                <ChevronsUpDown class="ml-auto size-4" />
                            {/if}
                        </button>
                    </li>
                </ul>
            </div>
            
            <!-- Notifications badge (only in collapsed mode) -->
            {#if isCollapsed && notificationCount > 0}
                <div class="mt-2 flex justify-center">
                    <a
                        href="/notifications"
                        class="relative flex items-center justify-center rounded-md p-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring"
                        aria-label="Notifications"
                    >
                        <Bell class="size-5" />
                        <span class="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                            {notificationCount > 99 ? '99+' : notificationCount}
                        </span>
                    </a>
                </div>
            {/if}
            
            <!-- Sidebar content -->
            <div data-sidebar="content" class="flex min-h-0 flex-1 flex-col gap-0 overflow-auto p-1">
                <!-- Map each nav section group -->
                {#each activeNavItems as section, sectionIndex}
                    <div 
                        data-sidebar="group" 
                        class="relative flex w-full min-w-0 flex-col p-2"
                        on:mouseenter={() => setHoverSection(section.section)}
                        on:mouseleave={() => setHoverSection(null)}
                    >
                        {#if !isCollapsed}
                            <div data-sidebar="group-label" class="flex h-8 shrink-0 items-center px-2 text-xs font-medium text-sidebar-foreground/70 transition-opacity">
                                {section.section}
                            </div>
                        {/if}
                        
                        <ul data-sidebar="menu" class="flex w-full min-w-0 flex-col gap-1">
                            <!-- Map each item in the section -->
                            {#each section.items as item, itemIndex}
                                <li 
                                    data-sidebar="menu-item" 
                                    class="group/menu-item relative group/collapsible" 
                                    data-state={$expandedSections[section.section] ? 'open' : 'closed'}
                                >
                                    {#if item.items?.length}
                                        <!-- Collapsible menu item with children -->
                                        <button
                                            data-sidebar="menu-button"
                                            data-size="default"
                                            class={cn(
                                                "flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none h-8 text-sm transition-all",
                                                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                                                isActiveItem(item.path) && "bg-sidebar-accent font-medium text-sidebar-accent-foreground",
                                                isCollapsed && "!size-8 !p-2"
                                            )}
                                            aria-expanded={$expandedSections[item.name] || false}
                                            on:click={() => toggleSection(item.name)}
                                        >
                                            <svelte:component this={item.icon} class="size-4" />
                                            
                                            {#if !isCollapsed}
                                                <span class="truncate flex-1">{item.name}</span>
                                                <ChevronRight 
                                                    class={cn(
                                                        "ml-auto size-4 transition-transform",
                                                        $expandedSections[item.name] && "rotate-90"
                                                    )}
                                                />
                                            {/if}
                                        </button>
                                        
                                        {#if $expandedSections[item.name] && !isCollapsed}
                                            <ul data-sidebar="menu-sub" class="mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5">
                                                {#each item.items as subItem}
                                                    <li>
                                                        <a 
                                                            href={subItem.path}
                                                            data-sidebar="menu-sub-button"
                                                            data-size="md"
                                                            data-active={isActiveItem(subItem.path)}
                                                            class={cn(
                                                                "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground",
                                                                "outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2",
                                                                "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
                                                                "text-sm"
                                                            )}
                                                        >
                                                            <span>{subItem.name}</span>
                                                        </a>
                                                    </li>
                                                {/each}
                                            </ul>
                                        {/if}
                                    {:else}
                                        <!-- Regular menu item -->
                                        <a 
                                            href={item.path}
                                            data-sidebar="menu-button"
                                            data-size="default"
                                            data-active={isActiveItem(item.path)}
                                            data-section-index={sectionIndex}
                                            data-item-index={itemIndex}
                                            class={cn(
                                                "flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none h-8 text-sm transition-all",
                                                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                                                "data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground",
                                                isCollapsed && "!size-8 !p-2"
                                            )}
                                            aria-current={isActiveItem(item.path) ? "page" : undefined}
                                            title={isCollapsed ? item.name : undefined}
                                            target={item.external ? "_blank" : undefined}
                                            rel={item.external ? "noopener noreferrer" : undefined}
                                        >
                                            <span class="relative">
                                                <svelte:component this={item.icon} class="size-4" />
                                                
                                                <!-- Badge indicator -->
                                                {#if item.badge && item.badge > 0}
                                                    <span class="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[8px] font-medium text-primary-foreground">
                                                        {item.badge > 9 ? '9+' : item.badge}
                                                    </span>
                                                {/if}
                                            </span>
                                            
                                            {#if !isCollapsed}
                                                <span class="truncate flex-1">{item.name}</span>
                                                
                                                <!-- External link indicator -->
                                                {#if item.external}
                                                    <ExternalLink class="ml-auto size-3 text-sidebar-foreground/50" />
                                                {/if}
                                                
                                                <!-- Badge counter -->
                                                {#if item.badge && item.badge > 0}
                                                    <span class="ml-auto flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary/10 px-1 text-xs font-medium text-primary">
                                                        {item.badge > 99 ? '99+' : item.badge}
                                                    </span>
                                                {/if}
                                            {/if}
                                        </a>
                                    {/if}
                                </li>
                            {/each}
                            
                            <!-- Section indicator for collapsed mode -->
                            {#if isCollapsed && hoverSection === section.section}
                                <div 
                                    class="absolute -right-[130px] z-30 rounded-md bg-popover p-2 shadow-md border border-border"
                                    transition:fade={{ duration: 150 }}
                                >
                                    <span class="text-xs font-medium">{section.section}</span>
                                </div>
                            {/if}
                        </ul>
                    </div>
                {/each}
            </div>
            
            <!-- Sidebar footer -->
            <div data-sidebar="footer" class="flex flex-col gap-2 p-2 border-t">
                <ul data-sidebar="menu" class="flex w-full min-w-0 flex-col gap-1">
                    <li data-sidebar="menu-item" class="group/menu-item relative">
                        <button 
                            type="button"
                            data-sidebar="menu-button"
                            data-size="lg"
                            class="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none h-12 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring"
                            style:padding={isCollapsed ? '0' : undefined}
                            on:click={toggleUserMenu}
                            aria-haspopup="menu"
                            aria-expanded={isUserMenuOpen}
                        >
                            <div 
                                class={cn(
                                    "flex aspect-square size-8 items-center justify-center rounded-lg",
                                    "bg-primary/10 text-primary",
                                    userAvatar ? "p-0 overflow-hidden border" : ""
                                )}
                            >
                                {#if userAvatar}
                                    <img src={userAvatar} alt={userFullName} class="h-full w-full object-cover" />
                                {:else}
                                    <span class="text-xs font-medium">{userInitials}</span>
                                {/if}
                            </div>
                            
                            {#if !isCollapsed}
                                <div class="grid flex-1 text-left text-sm leading-tight">
                                    <span class="truncate font-semibold">{userFullName}</span>
                                    <span class="truncate text-xs">{userEmail}</span>
                                </div>
                                <MoreHorizontal class="ml-auto size-4" />
                            {/if}
                        </button>
                        
                        <!-- User menu dropdown -->
                        {#if isUserMenuOpen && !isCollapsed}
                            <div 
                                class="absolute bottom-full left-0 right-0 mb-2 rounded-md border bg-popover p-1 shadow-md"
                                transition:slide={{ duration: 200, easing: quintOut }}
                                use:clickOutside={closeUserMenu}
                            >
                                <div class="p-2 border-b mb-1">
                                    <p class="text-xs text-muted-foreground">Signed in as <strong>{userFullName}</strong></p>
                                </div>
                                <button 
                                    type="button"
                                    class="flex w-full items-center rounded-sm p-2 text-sm hover:bg-accent"
                                    on:click={() => handleUserAction('profile')}
                                >
                                    <User class="mr-2 h-4 w-4" />
                                    <span>Your Profile</span>
                                </button>
                                <button 
                                    type="button"
                                    class="flex w-full items-center rounded-sm p-2 text-sm hover:bg-accent"
                                    on:click={() => handleUserAction('settings')}
                                >
                                    <Settings class="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </button>
                                <button 
                                    type="button"
                                    class="flex w-full items-center rounded-sm p-2 text-sm hover:bg-accent"
                                    on:click={() => handleUserAction('keyboard')}
                                >
                                    <Keyboard class="mr-2 h-4 w-4" />
                                    <span>Keyboard Shortcuts</span>
                                </button>
                                <button 
                                    type="button"
                                    class="flex w-full items-center rounded-sm p-2 text-sm hover:bg-accent"
                                    on:click={() => handleUserAction('help')}
                                >
                                    <HelpCircle class="mr-2 h-4 w-4" />
                                    <span>Help & Support</span>
                                </button>
                                <div class="mt-1 border-t pt-1">
                                    <button 
                                        type="button"
                                        class="flex w-full items-center rounded-sm p-2 text-sm text-red-500 hover:bg-red-500/10"
                                        on:click={() => handleUserAction('logout')}
                                    >
                                        <LogOut class="mr-2 h-4 w-4" />
                                        <span>Sign out</span>
                                    </button>
                                </div>
                            </div>
                        {/if}
                    </li>
                    
                    <!-- Toggle collapse button -->
                    <li class={isCollapsed ? "text-center" : ""}>
                        <button
                            type="button"
                            on:click={toggleCollapsed}
                            class="flex w-full items-center gap-2 rounded-md p-2 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring"
                            style:justify-content={isCollapsed ? 'center' : 'flex-start'}
                            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                        >
                            {#if isCollapsed}
                                <ChevronRight class="size-4" />
                            {:else}
                                <ChevronLeft class="size-4" />
                                <span>Collapse sidebar</span>
                            {/if}
                        </button>
                    </li>
                </ul>
            </div>
            
            <!-- Sidebar rail (resize handle) -->
            <button 
                data-sidebar="rail"
                aria-label="Toggle Sidebar"
                title="Toggle Sidebar"
                class="absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 sm:flex"
                on:click={toggleCollapsed}
            ></button>
        </div>
    </div>
</div>

<!-- Mobile sidebar variant -->
<aside 
    class={cn(
        "md:hidden fixed inset-y-0 left-0 z-50 flex w-full max-w-[250px] flex-col border-r bg-background/80 backdrop-blur-sm transition-all duration-300",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
    )}
    role="dialog"
    aria-modal="true"
    aria-label="Navigation menu"
>
    <div class="flex h-14 items-center justify-between border-b px-4">
        <a href="/" class="flex items-center gap-2 font-semibold">
            <img src="/logo.png" alt="Mixcore CMS Logo" class="h-6 w-6" />
            <span>Mixcore CMS</span>
        </a>
        <button
            type="button"
            class="rounded-md p-1 text-muted-foreground hover:bg-accent"
            on:click={handleOverlayClick}
            aria-label="Close menu"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
    </div>
    
    <div class="flex-1 overflow-auto py-4">
        {#each activeNavItems as section}
            <div class="px-3 py-2">
                <h3 class="mb-2 px-2 text-xs font-medium text-muted-foreground">{section.section}</h3>
                <div class="space-y-1">
                    {#each section.items as item}
                        <a
                            href={item.path}
                            class={cn(
                                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent',
                                isActiveItem(item.path) ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:text-foreground'
                            )}
                            aria-current={isActiveItem(item.path) ? "page" : undefined}
                            target={item.external ? "_blank" : undefined}
                            rel={item.external ? "noopener noreferrer" : undefined}
                        >
                            <span class="relative">
                                <svelte:component this={item.icon} class="h-4 w-4" aria-hidden="true" />
                                
                                <!-- Badge indicator -->
                                {#if item.badge && item.badge > 0}
                                    <span class="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[8px] font-medium text-primary-foreground">
                                        {item.badge > 9 ? '9+' : item.badge}
                                    </span>
                                {/if}
                            </span>
                            
                            <span class="flex-1">{item.name}</span>
                            
                            <!-- External link indicator -->
                            {#if item.external}
                                <ExternalLink class="ml-auto size-3 text-muted-foreground" />
                            {/if}
                            
                            <!-- Badge counter -->
                            {#if item.badge && item.badge > 0}
                                <span class="ml-auto flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary/10 px-1 text-xs font-medium text-primary">
                                    {item.badge > 99 ? '99+' : item.badge}
                                </span>
                            {/if}
                        </a>
                    {/each}
                </div>
            </div>
        {/each}
    </div>
    
    <div class="border-t p-4">
        <div class="flex items-center gap-3 mb-4">
            <div 
                class={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full",
                    "bg-primary/10 text-primary",
                    userAvatar ? "p-0 overflow-hidden border" : ""
                )}
            >
                {#if userAvatar}
                    <img src={userAvatar} alt={userFullName} class="h-full w-full object-cover" />
                {:else}
                    <span class="text-sm font-medium">{userInitials}</span>
                {/if}
            </div>
            <div>
                <p class="font-medium text-sm">{userFullName}</p>
                <p class="text-xs text-muted-foreground">{userEmail}</p>
            </div>
        </div>
        
        <div class="space-y-1">
            <a 
                href="/settings"
                class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent"
            >
                <Settings class="h-4 w-4" />
                <span>Settings</span>
            </a>
            <button 
                type="button"
                class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-500/10"
                on:click={() => handleUserAction('logout')}
            >
                <LogOut class="h-4 w-4" />
                <span>Sign out</span>
            </button>
        </div>
    </div>
</aside>

<!-- Mobile overlay -->
{#if isMobileMenuOpen}
    <div 
        class="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
        on:click={handleOverlayClick}
        aria-hidden="true"
    ></div>
{/if}

<script context="module">
    // Click outside directive to close dropdowns
    export function clickOutside(node: HTMLElement, handler: () => void) {
        const handleClick = (event: MouseEvent) => {
            if (!node.contains(event.target as Node) && !event.defaultPrevented) {
                handler();
            }
        };
        
        document.addEventListener('click', handleClick, true);
        
        return {
            destroy() {
                document.removeEventListener('click', handleClick, true);
            }
        };
    }
</script>