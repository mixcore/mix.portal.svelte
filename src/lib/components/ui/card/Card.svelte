<script lang="ts">
    import { cn } from '$lib/utils';
    
    export let className = '';
</script>

<div 
    class={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
    )}
>
    <slot />
</div> 