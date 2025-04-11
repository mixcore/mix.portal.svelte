<script lang="ts">
    import { cn } from '$lib/utils';
    import { page } from '$app/stores';
    
    // Props
    export let title: string = '';
    export let description: string = '';
    export let className: string = '';
    export let breadcrumbs: Array<{ label: string; href?: string }> = [];
    export let isLoading: boolean = false;
    export let hasError: boolean = false;
    export let errorMessage: string = '';
    export let size: 'default' | 'sm' | 'lg' = 'default';
    export let headerBorder: boolean = false;
    export let contentBgColor: boolean = false;
    export let headerSlot = !!$$slots.header || !!(title || description);
    
    // Handle breadcrumb click
    function handleBreadcrumbClick(event: MouseEvent, href: string) {
        if (!href) {
            event.preventDefault();
        }
    }
    
    // Compute classes
    $: containerClasses = cn(
        "flex flex-col",
        size === 'sm' ? "space-y-3" : size === 'lg' ? "space-y-6" : "space-y-4 md:space-y-6",
        className
    );
    
    $: headerClasses = cn(
        "flex flex-col md:flex-row md:items-center justify-between gap-4",
        headerBorder && "pb-4 border-b"
    );
    
    $: contentClasses = cn(
        "flex-1",
        contentBgColor && "bg-card rounded-lg p-4 md:p-6 shadow-sm"
    );
</script>

<div class={containerClasses}>
    <!-- Breadcrumbs -->
    {#if breadcrumbs.length > 0}
        <nav class="flex" aria-label="Breadcrumb">
            <ol class="inline-flex items-center space-x-1 md:space-x-2 text-sm">
                {#each breadcrumbs as crumb, i}
                    <li class="inline-flex items-center">
                        {#if i > 0}
                            <span class="mx-1 text-gray-400">/</span>
                        {/if}
                        
                        {#if crumb.href && i < breadcrumbs.length - 1}
                            <a 
                                href={crumb.href} 
                                class="text-muted-foreground hover:text-foreground"
                                on:click={(e) => handleBreadcrumbClick(e, crumb.href || '')}
                            >
                                {crumb.label}
                            </a>
                        {:else}
                            <span class={i === breadcrumbs.length - 1 ? "text-foreground font-medium" : "text-muted-foreground"}>
                                {crumb.label}
                            </span>
                        {/if}
                    </li>
                {/each}
            </ol>
        </nav>
    {/if}
    
    <!-- Header section with title, description and actions -->
    {#if headerSlot}
        <div class={headerClasses}>
            <div>
                {#if title}
                    <h1 class={cn(
                        "font-bold tracking-tight", 
                        size === 'sm' ? "text-xl" : size === 'lg' ? "text-3xl" : "text-2xl"
                    )}>
                        {title}
                    </h1>
                {/if}
                {#if description}
                    <p class="text-sm text-muted-foreground mt-1">{description}</p>
                {/if}
            </div>
            
            {#if $$slots.header}
                <div class="flex items-center space-x-2">
                    <slot name="header" />
                </div>
            {/if}
        </div>
    {/if}
    
    <!-- Loading state -->
    {#if isLoading}
        <div class="flex-1 flex items-center justify-center py-12">
            <div class="flex flex-col items-center text-center space-y-4">
                <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                <p class="text-sm text-muted-foreground">Loading...</p>
            </div>
        </div>
    <!-- Error state -->
    {:else if hasError}
        <div class="flex-1 flex items-center justify-center py-12">
            <div class="flex flex-col items-center text-center space-y-4">
                <div class="rounded-full bg-destructive/10 p-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div>
                    <p class="text-lg font-medium text-destructive">An error occurred</p>
                    {#if errorMessage}
                        <p class="text-sm text-muted-foreground mt-1">{errorMessage}</p>
                    {/if}
                </div>
                <slot name="error" />
            </div>
        </div>
    <!-- Main content -->
    {:else}
        <div class={contentClasses}>
            <slot />
        </div>
    {/if}
    
    <!-- Footer section -->
    {#if $$slots.footer}
        <div class="mt-auto pt-4">
            <slot name="footer" />
        </div>
    {/if}
</div> 