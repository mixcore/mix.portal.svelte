<script lang="ts">
    import { page } from '$app/stores';
    import ErrorDisplay from '../../../../components/ErrorDisplay.svelte';

    // Error info from the error page
    export let data: Record<string, any>;
    
    // Convert SvelteKit's error into standard Error to avoid type issues
    $: error = $page.error ? 
        ($page.error instanceof Error ? 
            $page.error : 
            new Error($page.error.message || 'Unknown error')) 
        : null;
</script>

<!-- Using the ErrorDisplay component for consistent error handling -->
<ErrorDisplay 
    error={error}
    statusCode={$page.status}
    title={$page.status === 500 ? "Server Error" : "Application Error"}
    message={$page.status === 404 ? "The page you're looking for doesn't exist." : ""}
    showRetry={$page.status !== 404} 
/>

<style>
    :global(html, body) {
        height: 100%;
    }
</style> 