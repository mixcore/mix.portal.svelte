<script lang="ts">
    import { onMount, onDestroy, createEventDispatcher } from 'svelte';
    import { miniAppRegistry } from './MiniAppRegistry';
    import ErrorDisplay from '../../components/ErrorDisplay.svelte';
    
    // Props
    export let appId: string | null = null;
    export let appUrl: string | null = null;
    export let autoLoad: boolean = true;
    export let appProps: Record<string, any> = {};
    
    // State
    let isLoading = false;
    let error: Error | null = null;
    let statusCode = 0;
    let component: any = null;
    let appStyles: string | null = null;
    let appConfig: any = null;
    
    // Event dispatcher for communication
    const dispatch = createEventDispatcher<{
        load: { appId: string, config: any };
        error: { error: Error, appId: string | null };
        unload: { appId: string | null };
    }>();
    
    // Track if this component is mounted
    let isMounted = false;
    
    // Initialize the mini-app
    onMount(() => {
        isMounted = true;
        if (autoLoad && (appId || appUrl)) {
            loadApp();
        }
        
        // Return cleanup function
        return () => {
            isMounted = false;
        };
    });
    
    // Subscribe to registry changes
    const unsubscribe = miniAppRegistry.activeApp.subscribe(activeApp => {
        if (isMounted && activeApp && (!appId || activeApp.config.appId === appId)) {
            component = activeApp.default;
            appConfig = activeApp.config;
            appStyles = activeApp.styles || null;
            dispatch('load', { appId: activeApp.config.appId, config: activeApp.config });
        }
    });
    
    // Cleanup
    onDestroy(() => {
        isMounted = false;
        if (unsubscribe) unsubscribe();
        dispatch('unload', { appId });
    });
    
    // Load the mini-app
    async function loadApp() {
        if (!appId && !appUrl) return;
        
        isLoading = true;
        error = null;
        statusCode = 0;
        component = null;
        
        try {
            let moduleApp;
            
            // If we have an appId, try to get it from the registry first
            if (appId) {
                moduleApp = miniAppRegistry.getApp(appId);
            }
            
            // If not found in registry and we have a URL, load it
            if (!moduleApp && appUrl) {
                moduleApp = await miniAppRegistry.loadApp(
                    appId || `app-${Date.now()}`, 
                    appUrl
                );
            }
            
            // If we have a module now, set it as the component
            if (moduleApp) {
                component = moduleApp.default;
                appConfig = moduleApp.config;
                appStyles = moduleApp.styles || null;
                
                // Dispatch load event
                dispatch('load', { appId: moduleApp.config.appId, config: moduleApp.config });
            } else {
                throw new Error(`Mini-app ${appId} not found and no URL provided`);
            }
        } catch (err) {
            console.error('Failed to load mini-app:', err);
            error = err instanceof Error ? err : new Error('Unknown error loading mini-app');
            statusCode = 500;
            
            // Dispatch error event
            dispatch('error', { error, appId });
        } finally {
            isLoading = false;
        }
    }
    
    // Handle retry
    function handleRetry() {
        if (appId || appUrl) {
            loadApp();
        }
    }
    
    // Apply props to the component
    $: componentProps = { ...appProps };
</script>

<!-- Add app styles if available at the top level -->
<svelte:head>
    {#if appStyles}
        <style>{@html appStyles}</style>
    {/if}
    
    {#if appConfig?.mainStyles}
        <link rel="stylesheet" href={appConfig.mainStyles}>
    {/if}
</svelte:head>

<!-- App loading state -->
{#if isLoading}
<div class="flex items-center justify-center h-full w-full">
    <div class="flex flex-col items-center gap-4">
        <div class="loading loading-spinner loading-lg text-primary"></div>
        <p class="text-sm text-muted-foreground">Loading mini-app...</p>
    </div>
</div>

<!-- Error state -->
{:else if error}
<ErrorDisplay 
    {error}
    statusCode={statusCode}
    title="Failed to Load Mini-App"
    onRetry={handleRetry}
/>

<!-- Render the mini-app component -->
{:else if component}
<div class="mini-app-container h-full">
    <svelte:component this={component} {...componentProps} />
</div>

<!-- No app loaded state -->
{:else}
<div class="flex flex-col items-center justify-center h-full text-center p-4">
    <div class="bg-primary/10 text-primary p-3 rounded-full mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
    </div>
    <h2 class="text-lg font-medium mb-1">No Mini-App Loaded</h2>
    <p class="text-sm text-muted-foreground mb-4">Select a mini-app to load or provide an app ID/URL</p>
    
    {#if appId || appUrl}
        <button class="btn btn-sm btn-primary" on:click={loadApp}>
            Load Mini-App
        </button>
    {/if}
</div>
{/if} 