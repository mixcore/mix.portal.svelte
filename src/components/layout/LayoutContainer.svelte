<script lang="ts">
    import { cn } from '$lib/utils';
    
    // Props
    export let className = '';
    export let fullWidth = false;
    export let padded = true;
</script>

<div 
    class={cn(
        "mx-auto",
        padded && "px-4 py-4 md:px-6 md:py-6",
        !fullWidth && "max-w-6xl",
        className
    )}
>
    <slot />
</div> 