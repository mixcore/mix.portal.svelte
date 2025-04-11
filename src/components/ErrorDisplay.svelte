<script lang="ts">
    import { browser } from '$app/environment';

    // Props
    export let error: Error | null = null;
    export let statusCode: number = 500;
    export let title: string = 'Server Error';
    export let message: string = '';
    export let onRetry: (() => void) | null = null;
    export let showRetry: boolean = true;
    export let showDetails: boolean = browser && import.meta.env.DEV;
    
    // Get appropriate error message based on status code
    function getDefaultMessageForStatus(code: number): string {
        switch (code) {
            case 400:
                return 'Bad request. The server could not understand the request.';
            case 401:
                return 'Unauthorized. Authentication is required to access this resource.';
            case 403:
                return 'Forbidden. You do not have permission to access this resource.';
            case 404:
                return 'Not found. The requested resource could not be found.';
            case 500:
                return 'Internal server error. The server encountered an unexpected condition.';
            case 502:
                return 'Bad gateway. The server received an invalid response from an upstream server.';
            case 503:
                return 'Service unavailable. The server is currently unable to handle the request.';
            case 504:
                return 'Gateway timeout. The server did not receive a timely response from an upstream server.';
            default:
                return 'An error occurred while processing your request.';
        }
    }
    
    // Use provided message or get default based on status code
    $: effectiveMessage = message || (error?.message || getDefaultMessageForStatus(statusCode));
</script>

<div class="flex items-center justify-center w-full h-full min-h-[400px] p-4">
    <div class="flex flex-col items-center gap-4 max-w-md text-center">
        <div class="bg-error/10 text-error p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        </div>
        
        <h2 class="text-lg font-medium">{title} {statusCode > 0 ? `(${statusCode})` : ''}</h2>
        <p class="text-sm text-muted-foreground">{effectiveMessage}</p>
        
        {#if error && error.stack && showDetails}
            <div class="mt-4 w-full">
                <details class="text-left">
                    <summary class="text-xs text-muted-foreground cursor-pointer">View Details</summary>
                    <pre class="mt-2 p-4 bg-base-200 rounded text-xs overflow-x-auto">{error.stack}</pre>
                </details>
            </div>
        {/if}
        
        {#if showRetry && onRetry}
            <button 
                class="btn btn-sm btn-primary mt-2" 
                on:click={onRetry}
            >
                Retry
            </button>
        {/if}
    </div>
</div> 