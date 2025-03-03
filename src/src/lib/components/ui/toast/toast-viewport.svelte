<script lang="ts">
    import { cn } from "$lib/utils";
    
    let className = "";
    export { className as class };
  </script>
  
  <div
    class={cn(
      "fixed flex flex-col p-4 gap-2 w-full md:max-w-[420px] max-h-screen z-50",
      className
    )}
    {...$$restProps}
  >
    <slot />
  </div>