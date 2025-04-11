<script lang="ts">
    import { cn } from '$lib/utils';
    
    // Props
    export let title: string = '';
    export let description: string = '';
    export let className: string = '';
    export let headerSlot = !!$$slots.header || !!(title || description);
</script>

<div class={cn("space-y-4 md:space-y-6", className)}>
    {#if headerSlot}
        <div class="flex items-center justify-between gap-4">
            <div>
                {#if title}
                    <h1 class="text-2xl font-bold tracking-tight">{title}</h1>
                {/if}
                {#if description}
                    <p class="text-sm text-muted-foreground">{description}</p>
                {/if}
            </div>
            
            {#if $$slots.header}
                <div>
                    <slot name="header" />
                </div>
            {/if}
        </div>
    {/if}
    
    <div>
        <slot />
    </div>
</div> 