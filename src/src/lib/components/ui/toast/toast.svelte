<script lang="ts">
    import { cn } from "$lib/utils";
    import { fly } from "svelte/transition";
    import { X } from "lucide-svelte";
    import { toasts } from "$lib/services/common";
    
    export let variant: "info" | "success" | "warning" | "error" = "info";
    
    let className = "";
    export { className as class };
    
    const variantClasses = {
      info: "bg-blue-50 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200",
      success: "bg-green-50 text-green-800 dark:bg-green-900/50 dark:text-green-200",
      warning: "bg-yellow-50 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200", 
      error: "bg-red-50 text-red-800 dark:bg-red-900/50 dark:text-red-200"
    };
    
    function removeToast(id: string) {
      toasts.update(t => t.filter(toast => toast.id !== id));
    }
  </script>
  
  <div
    class={cn(
      "pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 shadow-lg transition-all",
      variantClasses[variant],
      className
    )}
    transition:fly={{ x: "100%", duration: 300 }}
    role="alert"
    {...$$restProps}
  >
    <div class="grid gap-1">
      <slot />
    </div>
    <button
      class="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm opacity-50 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2"
      on:click={() => {
        if ($$restProps.id) removeToast($$restProps.id);
      }}
    >
      <X class="h-4 w-4" />
      <span class="sr-only">Close</span>
    </button>
  </div>