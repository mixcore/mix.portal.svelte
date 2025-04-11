<script lang="ts">
    import { page } from '$app/stores';
    import { cn } from '$lib/utils';
    import { onMount, createEventDispatcher } from 'svelte';
    import { fade, slide } from 'svelte/transition';
    
    // Props
    export let appId: string;
    export let title: string = '';
    export let description: string = '';
    export let version: string = '1.0.0';
    export let icon: any = null;
    export let hasSidebar: boolean = true;
    export let hasToolbar: boolean = true;
    export let hasTabs: boolean = false;
    export let primaryColor: string = 'var(--primary)';
    export let secondaryColor: string = 'var(--secondary)';
    export let appConfig: any = null;
    
    // Optional component props
    export let tabs: Array<{ id: string, title: string, icon?: any }> = [];
    export let activeTabId: string = tabs.length > 0 ? tabs[0].id : '';
    export let sidebarItems: Array<{
        title: string;
        icon?: any;
        expanded?: boolean;
        items?: Array<{
            id: string;
            title: string;
            icon?: any;
            path?: string;
            badge?: number | string;
        }>;
    }> = [];
    
    // State
    let isLoading = true;
    let error: Error | null = null;
    let appReady = false;
    let sidebarCollapsed = false;
    let miniAppElement: HTMLElement;
    let contentHeight: number = 0;
    let shellHeight: number = 0;
    let appStyles: Record<string, string> = {};
    
    // Event dispatcher
    const dispatch = createEventDispatcher<{
        ready: { appId: string };
        error: { error: Error, appId: string };
        tabChange: { tabId: string };
        navigate: { path: string };
        action: { action: string, data?: any };
    }>();
    
    onMount(async () => {
        try {
            // Initialize the mini-app
            // Load configuration if not provided
            if (!appConfig) {
                try {
                    // In a real implementation, load from API or JSON file
                    appConfig = {
                        appId,
                        version,
                        title: title || appId,
                        description,
                        primaryColor,
                        secondaryColor,
                        hasSidebar,
                        hasToolbar,
                        hasTabs
                    };
                } catch (error: unknown) {
                    console.error(`Failed to load app config for ${appId}:`, error);
                    const errorMessage = error instanceof Error 
                        ? error.message 
                        : 'Unknown configuration error';
                    error = new Error(`Failed to load app configuration: ${errorMessage}`);
                }
            }
            
            // Set custom app styles
            if (appConfig) {
                appStyles = {
                    '--app-primary': appConfig.primaryColor || primaryColor,
                    '--app-secondary': appConfig.secondaryColor || secondaryColor,
                    '--app-background': 'var(--background)',
                    '--app-foreground': 'var(--foreground)'
                };
            }
            
            isLoading = false;
            appReady = true;
            
            // Notify that the app is ready
            dispatch('ready', { appId });
        } catch (caughtError: unknown) {
            console.error(`Failed to initialize mini-app ${appId}:`, caughtError);
            error = caughtError instanceof Error 
                ? caughtError 
                : new Error(String(caughtError));
            isLoading = false;
            
            // Notify of error
            dispatch('error', { error, appId });
        }
    });
    
    // Calculate dimensions for layout adjustments
    function updateDimensions() {
        if (!miniAppElement) return;
        
        shellHeight = miniAppElement.clientHeight;
        
        // Calculate content height based on toolbar/tabs visibility
        const toolbarHeight = hasToolbar ? 56 : 0;
        const tabsHeight = hasTabs ? 48 : 0;
        contentHeight = shellHeight - toolbarHeight - tabsHeight;
    }
    
    // Handle tab change
    function handleTabChange(tabId: string) {
        if (activeTabId === tabId) return;
        activeTabId = tabId;
        dispatch('tabChange', { tabId });
    }
    
    // Handle sidebar navigation
    function handleNavigate(path: string) {
        dispatch('navigate', { path });
    }
    
    // Toggle sidebar collapse
    function toggleSidebar() {
        sidebarCollapsed = !sidebarCollapsed;
    }
    
    // Watch for resize and update dimensions
    $: if (appReady && miniAppElement) {
        updateDimensions();
    }
</script>

<div 
    bind:this={miniAppElement}
    class={cn(
        "mini-app-shell relative h-full w-full flex flex-col overflow-hidden",
        appReady ? "app-ready" : "",
        error ? "app-error" : ""
    )}
    data-app-id={appId}
    style={Object.entries(appStyles).map(([key, value]) => `${key}:${value}`).join(';')}
>
    {#if isLoading}
        <!-- Loading state -->
        <div class="w-full h-full flex items-center justify-center bg-background">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    {:else if error}
        <!-- Error state -->
        <div class="w-full h-full flex flex-col items-center justify-center bg-background text-foreground p-4">
            <svg class="w-16 h-16 text-destructive mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 class="text-xl font-bold mb-2">Failed to load {appId}</h2>
            <p class="text-muted-foreground text-center max-w-md">{error.message}</p>
            <button 
                class="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                on:click={() => window.location.reload()}
            >
                Reload App
            </button>
        </div>
    {:else}
        <!-- App toolbar -->
        {#if hasToolbar}
            <div 
                class="app-toolbar h-14 min-h-14 border-b flex items-center justify-between px-4 bg-background"
                in:fade={{duration: 200}}
            >
                <!-- Left section: App title and icon -->
                <div class="flex items-center gap-2">
                    {#if icon}
                        <div class="w-6 h-6 flex items-center justify-center">
                            <svelte:component this={icon} size={20} />
                        </div>
                    {/if}
                    <h1 class="text-lg font-medium truncate">
                        {title || appId}
                    </h1>
                    {#if version}
                        <span class="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                            v{version}
                        </span>
                    {/if}
                </div>
                
                <!-- Right section: Actions -->
                <div class="flex items-center gap-2">
                    <!-- App-specific actions go here -->
                    <slot name="toolbar-actions" />
                </div>
            </div>
        {/if}
        
        <!-- App tabs -->
        {#if hasTabs && tabs.length > 0}
            <div 
                class="app-tabs h-12 min-h-12 border-b flex items-center justify-start px-2 bg-background overflow-x-auto"
                in:fade={{duration: 200, delay: 100}}
            >
                {#each tabs as tab}
                    <button 
                        class={cn(
                            "flex items-center gap-1.5 px-3 py-2 text-sm transition-colors",
                            "border-b-2 min-w-[80px] h-full",
                            activeTabId === tab.id 
                                ? "border-primary text-foreground font-medium" 
                                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                        on:click={() => handleTabChange(tab.id)}
                    >
                        {#if tab.icon}
                            <svelte:component this={tab.icon} size={16} />
                        {/if}
                        <span>{tab.title}</span>
                    </button>
                {/each}
            </div>
        {/if}
        
        <!-- Main app content area with optional sidebar -->
        <div class="app-content flex-1 flex overflow-hidden" style="height: {contentHeight}px">
            <!-- App sidebar -->
            {#if hasSidebar && sidebarItems.length > 0}
                <div 
                    class={cn(
                        "app-sidebar border-r flex flex-col bg-background transition-all",
                        sidebarCollapsed ? "w-12" : "w-64"
                    )}
                    in:slide={{duration: 200, delay: 150, axis: 'x'}}
                >
                    <!-- Sidebar toggle -->
                    <button 
                        class="p-2 hover:bg-muted self-end"
                        on:click={toggleSidebar}
                        title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        <svg 
                            class={cn("w-5 h-5 transition-transform", sidebarCollapsed ? "rotate-180" : "")}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                stroke-linecap="round" 
                                stroke-linejoin="round" 
                                stroke-width="2" 
                                d={sidebarCollapsed ? "M13 5l7 7-7 7" : "M11 19l-7-7 7-7"}
                            />
                        </svg>
                    </button>
                    
                    <!-- Sidebar content -->
                    <div class="flex-1 overflow-y-auto p-2">
                        {#each sidebarItems as section}
                            <div class="mb-4">
                                {#if !sidebarCollapsed}
                                    <h3 class="text-xs uppercase font-medium text-muted-foreground tracking-wider px-2 my-2">
                                        {section.title}
                                    </h3>
                                {/if}
                                
                                {#if section.items && section.items.length > 0}
                                    <div class="space-y-1">
                                        {#each section.items as item}
                                            <button 
                                                class={cn(
                                                    "w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                                                    $page.url.pathname.endsWith(item.path || '') 
                                                        ? "bg-primary/10 text-primary font-medium" 
                                                        : "text-foreground hover:bg-muted"
                                                )}
                                                on:click={() => handleNavigate(item.path || '#')}
                                                title={sidebarCollapsed ? item.title : ''}
                                            >
                                                {#if item.icon}
                                                    <div class="w-5 h-5 flex items-center justify-center">
                                                        <svelte:component this={item.icon} size={16} />
                                                    </div>
                                                {/if}
                                                
                                                {#if !sidebarCollapsed}
                                                    <span class="truncate">{item.title}</span>
                                                    
                                                    {#if item.badge}
                                                        <span class="ml-auto bg-primary/20 text-primary text-xs rounded-full px-2 py-0.5">
                                                            {item.badge}
                                                        </span>
                                                    {/if}
                                                {/if}
                                            </button>
                                        {/each}
                                    </div>
                                {/if}
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}
            
            <!-- Main app content -->
            <div 
                class="app-main-content flex-1 overflow-auto bg-background"
                in:fade={{duration: 250, delay: 200}}
            >
                <slot />
            </div>
        </div>
    {/if}
</div>

<style>
    .mini-app-shell {
        --app-primary: var(--primary);
        --app-secondary: var(--secondary);
        --app-background: var(--background);
        --app-foreground: var(--foreground);
    }
    
    .app-ready {
        animation: fadeIn 0.3s ease-out;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    /* Custom scrollbar for app content */
    :global(.app-main-content::-webkit-scrollbar) {
        width: 8px;
        height: 8px;
    }
    
    :global(.app-main-content::-webkit-scrollbar-thumb) {
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 4px;
    }
    
    :global(.app-main-content::-webkit-scrollbar-track) {
        background-color: transparent;
    }
    
    /* Dark mode scrollbar */
    :global(.dark .app-main-content::-webkit-scrollbar-thumb) {
        background-color: rgba(255, 255, 255, 0.2);
    }
</style> 