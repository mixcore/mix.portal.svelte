<script lang="ts">
    import { cn } from '$lib/utils';
    
    export let className = '';
</script>

<div 
    class={cn(
        "p-6 pt-0",
        className
    )}
>
    <slot />
</div> 