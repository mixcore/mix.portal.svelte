<script lang="ts">
    import { setContext, createEventDispatcher, onMount } from 'svelte';
    import { writable, derived, get } from 'svelte/store';
    import { browser } from '$app/environment';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { 
        currentContext, 
        getNavigationItems, 
        getActiveContext, 
        appContexts,
        type AppContext, 
        type NavSection,
        type NavItem
    } from '$lib/stores/navigationStore';

    // Create event dispatcher
    const dispatch = createEventDispatcher<{
        contextChange: { prevContext: AppContext; newContext: AppContext };
        navigationItemClicked: { item: NavItem; event: MouseEvent };
        ready: void;
    }>();

    // Props
    export let initialContext: AppContext = 'cms';
    export let saveHistory: boolean = true;
    export let historyKey: string = 'mixcore_nav_history';
    export let persistContext: boolean = true;
    export let persistKey: string = 'mixcore_active_context';
    export let lazyLoadContexts: boolean = false;
    export let defaultPath: string = '/';
    
    // Internal state
    let isReady = false;
    let contextHistory: AppContext[] = [];
    let loadedContexts: Set<AppContext> = new Set();
    
    // Create a store for context history
    const historyStore = writable<AppContext[]>([]);
    
    // Internal stores
    const isContextChanging = writable(false);
    const contextMetadata = writable<Record<AppContext, {
        lastVisited?: Date;
        visitCount: number;
        paths: Set<string>;
        favorites: Set<string>;
    }>>({} as any);
    
    // Set initial context based on preferences
    function initializeContext() {
        let targetContext: AppContext = initialContext;
        
        // Try to restore from storage if enabled
        if (persistContext && browser) {
            try {
                const storedContext = localStorage.getItem(persistKey);
                if (storedContext && appContexts.some(c => c.id === storedContext)) {
                    targetContext = storedContext as AppContext;
                }
            } catch (e) {
                console.warn('Failed to restore saved context:', e);
            }
        }
        
        // Set the initial context
        if ($currentContext !== targetContext) {
            currentContext.set(targetContext);
        }
        
        // Mark this context as loaded
        loadedContexts.add(targetContext);
    }
    
    // Restore navigation history from storage
    function loadContextHistory() {
        if (saveHistory && browser) {
            try {
                const storedHistory = localStorage.getItem(historyKey);
                if (storedHistory) {
                    const parsed = JSON.parse(storedHistory);
                    if (Array.isArray(parsed)) {
                        contextHistory = parsed.filter(ctx => 
                            appContexts.some(c => c.id === ctx)
                        );
                        historyStore.set(contextHistory);
                    }
                }
            } catch (e) {
                console.warn('Failed to load context history:', e);
            }
        }
    }
    
    // Save context to history and storage
    function saveContext(contextId: AppContext) {
        if (!browser) return;
        
        // Update history
        if (saveHistory) {
            // Remove if already exists to avoid duplicates
            contextHistory = contextHistory.filter(ctx => ctx !== contextId);
            // Add to front of array
            contextHistory.unshift(contextId);
            // Keep only last 10 entries
            contextHistory = contextHistory.slice(0, 10);
            // Update the store
            historyStore.set(contextHistory);
            
            // Save to storage
            try {
                localStorage.setItem(historyKey, JSON.stringify(contextHistory));
            } catch (e) {
                console.warn('Failed to save context history:', e);
            }
        }
        
        // Save current context if enabled
        if (persistContext) {
            try {
                localStorage.setItem(persistKey, contextId);
            } catch (e) {
                console.warn('Failed to save current context:', e);
            }
        }
        
        // Update metadata
        contextMetadata.update(meta => {
            if (!meta[contextId]) {
                meta[contextId] = {
                    visitCount: 0,
                    paths: new Set(),
                    favorites: new Set()
                };
            }
            
            meta[contextId].lastVisited = new Date();
            meta[contextId].visitCount += 1;
            
            return meta;
        });
    }
    
    // Helper function to set context with additional logic
    function setAppContext(contextId: AppContext, options: {
        saveToHistory?: boolean;
        navigate?: boolean;
        path?: string;
    } = {}) {
        const { saveToHistory = true, navigate = false, path } = options;
        const prevContext = $currentContext;
        
        if (prevContext !== contextId) {
            // Start transition
            isContextChanging.set(true);
            
            // Set new context
            currentContext.set(contextId);
            
            // Mark this context as loaded
            loadedContexts.add(contextId);
            
            // Save to history if enabled
            if (saveToHistory) {
                saveContext(contextId);
            }
            
            // Navigate if requested
            if (navigate) {
                const targetPath = path || defaultPath;
                if ($page.url.pathname !== targetPath) {
                    goto(targetPath);
                }
            }
            
            // Dispatch change event
            dispatch('contextChange', { 
                prevContext, 
                newContext: contextId 
            });
            
            // End transition
            setTimeout(() => {
                isContextChanging.set(false);
            }, 100);
        }
    }
    
    // Handle navigation item click
    function handleNavigationItemClick(item: NavItem, event: MouseEvent) {
        dispatch('navigationItemClicked', { item, event });
        
        // Update metadata
        contextMetadata.update(meta => {
            if (!meta[$currentContext]) {
                meta[$currentContext] = {
                    visitCount: 0,
                    paths: new Set(),
                    favorites: new Set()
                };
            }
            
            meta[$currentContext].paths.add(item.path);
            return meta;
        });
    }
    
    // Create derived stores for UI with more advanced logic
    const activeContext = derived(
        [currentContext, isContextChanging], 
        ([$ctx, $changing]) => ({
            ...getActiveContext($ctx),
            isChanging: $changing
        })
    );
    
    const navigationItems = derived(
        [currentContext, page, isContextChanging],
        ([$ctx, $page, $changing]) => {
            const items = getNavigationItems($ctx);
            
            // If lazy loading is enabled and this context isn't yet loaded
            if (lazyLoadContexts && !loadedContexts.has($ctx)) {
                return []; // Return empty array while loading
            }
            
            // Add active state based on current URL
            return items.map(section => ({
                ...section,
                items: section.items.map(item => ({
                    ...item,
                    isActive: $page.url.pathname === item.path,
                    isChanging: $changing
                }))
            }));
        }
    );
    
    const contextsMeta = derived(
        [contextMetadata, currentContext],
        ([$meta, $current]) => {
            return appContexts.map(ctx => ({
                ...ctx,
                isActive: ctx.id === $current,
                metadata: $meta[ctx.id] || {
                    visitCount: 0,
                    paths: new Set(),
                    favorites: new Set()
                }
            }));
        }
    );
    
    const recentContexts = derived(
        [historyStore, contextsMeta],
        ([$history, $contextsMeta]) => {
            return $history
                .map((id: AppContext) => $contextsMeta.find((c) => c.id === id))
                .filter(Boolean);
        }
    );
    
    // Initialize everything on mount
    onMount(() => {
        initializeContext();
        loadContextHistory();
        
        // Mark provider as ready
        setTimeout(() => {
            isReady = true;
            dispatch('ready');
        }, 0);
    });

    // Set context for child components
    setContext('navigation', {
        context: currentContext,
        activeContext,
        navigationItems,
        isChanging: isContextChanging,
        contextsMeta,
        recentContexts,
        history: historyStore,
        setContext: setAppContext,
        handleItemClick: handleNavigationItemClick,
        isReady: () => isReady
    });
</script>

<slot 
    context={$currentContext}
    activeContext={$activeContext}
    navigationItems={$navigationItems}
    isContextChanging={$isContextChanging}
    contextsMeta={$contextsMeta}
    recentContexts={$recentContexts}
    setContext={setAppContext}
    handleNavigationItemClick={handleNavigationItemClick}
/> 