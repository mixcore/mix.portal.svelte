<script lang="ts">
    import { fly } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import { clickOutside } from '$lib/actions/clickOutside';
    
    export let open = false;
    export let align: 'left' | 'right' = 'left';
    export let width = 'w-56';
    export let onClose: () => void;
</script>

{#if open}
    <div 
        class="absolute z-50 mt-2 {width} rounded-md bg-popover shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden {align === 'right' ? 'right-0' : 'left-0'}"
        transition:fly={{ y: -5, duration: 150, easing: quintOut }}
        role="menu" 
        aria-orientation="vertical"
        use:clickOutside={onClose}
    >
        <slot />
    </div>
{/if} 