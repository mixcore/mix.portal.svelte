<script lang="ts">
    import { cn } from '$lib/utils';
    import { onMount, createEventDispatcher } from 'svelte';
    import { fade } from 'svelte/transition';
    import { cubicOut } from 'svelte/easing';
    
    // Props
    export let className = '';
    export let fullWidth = false;
    export let padded = true;
    export let size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full' = '6xl';
    export let animated = false;
    export let animationDelay = 0;
    export let id = '';
    export let transparent = false;
    export let rounded = false;
    export let shadowed = false;
    export let bordered = false;
    
    // State
    let containerElement: HTMLElement;
    let isVisible = false;
    
    // Events
    const dispatch = createEventDispatcher<{
        mount: HTMLElement;
        intersect: {isIntersecting: boolean, element: HTMLElement};
    }>();
    
    // Initialize intersection observer to detect when container is in viewport
    onMount(() => {
        if (animated && typeof IntersectionObserver !== 'undefined') {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        isVisible = true;
                        dispatch('intersect', {isIntersecting: true, element: containerElement});
                        observer.unobserve(containerElement);
                    }
                });
            }, {
                threshold: 0.1
            });
            
            observer.observe(containerElement);
            
            return () => {
                if (containerElement) {
                    observer.unobserve(containerElement);
                }
            };
        } else {
            isVisible = true;
        }
        
        dispatch('mount', containerElement);
    });
    
    // Get container size class
    function getSizeClass(size: string): string {
        if (fullWidth) return '';
        
        switch(size) {
            case 'xs': return 'max-w-xs';
            case 'sm': return 'max-w-sm';
            case 'md': return 'max-w-md';
            case 'lg': return 'max-w-lg';
            case 'xl': return 'max-w-xl';
            case '2xl': return 'max-w-2xl';
            case '3xl': return 'max-w-3xl';
            case '4xl': return 'max-w-4xl';
            case '5xl': return 'max-w-5xl';
            case '6xl': return 'max-w-6xl';
            case '7xl': return 'max-w-7xl';
            case 'full': return 'max-w-full';
            default: return 'max-w-6xl';
        }
    }
    
    // Compute container classes
    $: containerClasses = cn(
        "mx-auto",
        padded && "px-4 py-4 md:px-6 md:py-6",
        getSizeClass(size),
        rounded && "rounded-lg",
        shadowed && "shadow-sm",
        bordered && "border",
        !transparent && "bg-card text-card-foreground",
        className
    );
</script>

<div 
    class={containerClasses}
    bind:this={containerElement}
    id={id}
    data-layout-container
    data-size={size}
>
    {#if animated}
        {#if isVisible}
            <div 
                transition:fade={{
                    delay: animationDelay,
                    duration: 300,
                    easing: cubicOut
                }}
            >
                <slot />
            </div>
        {/if}
    {:else}
        <slot />
    {/if}
</div> 