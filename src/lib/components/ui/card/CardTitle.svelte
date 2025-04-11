<script lang="ts">
    import { cn } from '$lib/utils';
    
    export let className = '';
    export let tag = 'h3';
</script>

<svelte:element 
    this={tag}
    class={cn(
        "text-2xl font-semibold leading-none tracking-tight",
        className
    )}
>
    <slot />
</svelte:element> 