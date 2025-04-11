<script lang="ts">
    import { setContext, createEventDispatcher } from 'svelte';
    import { writable, derived } from 'svelte/store';
    import { 
        currentContext, 
        getNavigationItems, 
        getActiveContext, 
        type AppContext, 
        type NavSection 
    } from '$lib/stores/navigationStore';

    // Create event dispatcher
    const dispatch = createEventDispatcher<{
        contextChange: { prevContext: AppContext; newContext: AppContext };
    }>();

    // Props
    export let initialContext: AppContext = 'cms';

    // Set initial context
    if ($currentContext !== initialContext) {
        currentContext.set(initialContext);
    }

    // Create derived stores for UI
    const activeContext = derived(currentContext, ($ctx) => getActiveContext($ctx));
    const navigationItems = derived(currentContext, ($ctx) => getNavigationItems($ctx));

    // Helper functions
    function setAppContext(contextId: AppContext) {
        const prevContext = $currentContext;
        if (prevContext !== contextId) {
            currentContext.set(contextId);
            dispatch('contextChange', { prevContext, newContext: contextId });
        }
    }

    // Set context for child components
    setContext('navigation', {
        context: currentContext,
        activeContext,
        navigationItems,
        setContext: setAppContext
    });
</script>

<slot 
    context={$currentContext}
    activeContext={$activeContext}
    navigationItems={$navigationItems}
    setContext={setAppContext}
/> 