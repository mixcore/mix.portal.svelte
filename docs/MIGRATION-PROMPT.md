# Mixcore Migration Prompt

This document serves as a prompt reference for working on the Mixcore application migration from AngularJS to Svelte/SvelteKit. It provides a high-level overview and directs you to the detailed documentation.

## Documentation Structure

We have organized the migration documentation into a clear, structured format:

```
mix-app/                     # angulajs source code
docs/
├── MIGRATION-GUIDE.md       # Main entry point and overview
├── guides/                  # Detailed development guides
│   ├── API-GUIDE.md         # API integration guidelines
│   ├── ANGULAR-TO-SVELTE-PATTERNS.md  # Migration patterns
│   ├── CODING-STANDARDS.md  # Coding standards & best practices
│   ├── mini-app-framework.md  # Mini-App development guide
│   └── ...
├── tracking/                # Progress tracking documents
│   ├── IMPLEMENTATION-PLAN.md # Overall implementation plan
│   ├── PROGRESS-TRACKER.md  # Detailed status tracking
│   └── ...
└── reference/               # Reference documentation
    ├── COMPONENT-REGISTRY.md # Component library catalog
    └── ...
```

## Getting Started

To work on the migration:

1. Start with the [Migration Guide](./MIGRATION-GUIDE.md) for an overview
2. Check the [Progress Tracker](./tracking/PROGRESS-TRACKER.md) to see what to work on next
3. Follow the [Implementation Plan](./tracking/IMPLEMENTATION-PLAN.md) for phase details
4. Use the [Component Registry](./reference/COMPONENT-REGISTRY.md) to find reusable components
5. Refer to specific guides as needed:
   - [API Guide](./guides/API-GUIDE.md) for API integration
   - [AngularJS-to-Svelte Patterns](./guides/ANGULAR-TO-SVELTE-PATTERNS.md) for conversion patterns
   - [Coding Standards](./guides/CODING-STANDARDS.md) for implementation standards
   - [Mini-App Framework Guide](./guides/mini-app-framework.md) for mini-app development

## Helper Script

We've created a helper script to streamline the migration process:

```bash
# View migration status
./docs/migration.sh status

# Show component implementation status
./docs/migration.sh component-status

# Show API integration status
./docs/migration.sh api-status

# Create a new component from template
./docs/migration.sh create-component ComponentName

# Create a new page from template
./docs/migration.sh create-page path/to/page
```

## Core Migration Process

When migrating a component or page, follow these steps:

1. Check the [Progress Tracker](./tracking/PROGRESS-TRACKER.md) to confirm it's not already in progress
2. Consult the [Component Registry](./reference/COMPONENT-REGISTRY.md) for reusable components
3. Create the component/page using the helper script or templates
4. Use the [AngularJS-to-Svelte Patterns](./guides/ANGULAR-TO-SVELTE-PATTERNS.md) for guidance
5. Implement API integration following the [API Guide](./guides/API-GUIDE.md)
6. Update the [Progress Tracker](./tracking/PROGRESS-TRACKER.md) once completed

## Navigation Context System

The application now supports context-specific navigation based on app context, user persona, roles, and permissions. This allows the UI to adapt based on user context:

### Key Features

- **Context-Specific Navigation**: Menu items can be filtered based on the active context (CMS, MixDB, Design, etc.)
- **Persona-Based Views**: Different users can have tailored experiences (Admin, Content Manager, Designer, etc.)
- **Role and Permission Support**: Navigation adapts to user's assigned roles and permissions
- **Priority-Based Ordering**: Menu items are displayed in priority order for better organization
- **Apps CTA in Header**: Users can quickly switch between app contexts via a dropdown in the header

### Implementation

Context-specific navigation is implemented through:

1. **NavItem Extensions**: The NavItem interface now includes `contextId`, `appId`, `personaIds`, `roleIds`, etc.
2. **Context Provider**: The `NavigationContextProvider` manages the active context and persona
3. **Context Selector**: Users can switch between contexts and personas via the sidebar and header
4. **Filtered Items**: The sidebar dynamically renders navigation based on the active context
5. **Header Apps CTA**: Provides a convenient way to switch between app contexts from any page

### Example Usage

To create a context-specific menu item:

```svelte
<!-- navigation.js -->
export const navigationItems = [
  {
    title: 'Content',
    url: '#',
    icon: 'post',
    contextId: 'cms', // Context identification
    appId: 'cms',
    personaIds: ['admin', 'content-manager'], // Only visible to these personas
    priority: 10, // Ordering priority
    items: [
      // Child items
    ]
  }
];
```

## Mini-App Architecture

Mixcore implements a robust Mini-App Framework that enables the creation of modular, pluggable applications that can be dynamically loaded and integrated into the main portal. This architecture provides a standardized way to extend the platform's functionality while maintaining consistency in the user experience.

### Key Components

The Mini-App Framework consists of several core components:

1. **MiniAppRegistry**: A centralized store for registering and managing mini-apps
   - Implemented as a Svelte store with state persistence
   - Provides methods for app registration, activation, and dynamic loading
   - Maintains the state of all registered apps and the currently active app

2. **MiniAppLoader**: A component for loading and rendering mini-apps
   - Handles asynchronous loading of mini-app modules
   - Provides error handling and loading states
   - Exposes events for app lifecycle management

3. **ShellLayout**: A container component that provides common UI elements for mini-apps
   - Creates a consistent layout structure for mini-apps
   - Adapts to the mini-app's specific requirements

### Implementation Details

The Mini-App system is implemented with the following files:

- `src/lib/mini-app/MiniAppRegistry.ts`: Core registry and state management
- `src/lib/mini-app/MiniAppLoader.svelte`: App loading and rendering component
- `src/routes/dashboard/apps/`: Directory containing all mini-apps
- `src/routes/dashboard/apps/_template/`: Reference implementation for mini-app developers

### Mini-App Structure

Each mini-app should be structured as follows:

```
src/routes/dashboard/apps/[app-name]/
├── +page.svelte             # Main entry point
├── components/              # App-specific components
├── stores/                  # App-specific stores
└── lib/                     # App-specific utilities
```

### Mini-App Configuration

Mini-apps are registered with the registry using a standardized configuration object:

```typescript
interface MiniAppConfig {
  appId: string;           // Unique identifier
  version: string;         // Version number
  displayName: string;     // Human-readable name
  description: string;     // Short description
  category: string;        // Category for grouping
  icon: string;            // Icon path or name
  entryPoint: string;      // Main entry point path
  mainStyles?: string;     // Optional CSS file path
  permissions?: Array<{    // Optional permissions
    name: string;
    displayName: string;
    description: string;
  }>;
  navigation?: {           // Optional navigation settings
    position: string;
    priority: number;
    menuItem: {
      title: string;
      icon: string;
      url: string;
      badge?: number | null;
      contextId: string;
    };
  };
  author?: {               // Optional author information
    name: string;
    email: string;
    url: string;
  };
  settings?: Record<string, any>;      // Optional app settings
  integrations?: Record<string, any>;  // Optional integrations
}
```

### Mini-App Registration

To register a mini-app, use the following pattern in your app's main component:

```svelte
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { miniAppRegistry } from '$lib/mini-app/MiniAppRegistry';
  
  // Mini-app metadata
  const APP_ID = 'my-app';
  const APP_NAME = 'My App';
  const APP_VERSION = '1.0.0';
  
  // Register the app on mount
  onMount(() => {
    if (!browser) return;
    
    miniAppRegistry.registerApp({
      config: {
        appId: APP_ID,
        version: APP_VERSION,
        displayName: APP_NAME,
        description: 'My awesome mini-app',
        category: 'Tools',
        icon: '/icons/my-app.svg',
        entryPoint: '/dashboard/apps/my-app'
      },
      default: MyAppComponent, // Component reference
      styles: '.my-app { color: blue; }' // Optional inline styles
    });
    
    // Set as active app
    miniAppRegistry.setActiveApp(APP_ID);
  });
  
  // Clean up on destroy
  onDestroy(() => {
    if (!browser) return;
    // Any cleanup code
  });
</script>
```

### State Persistence

Mini-apps can persist state using localStorage. Here's a recommended pattern:

```javascript
// Load state on mount
onMount(() => {
  if (browser) {
    const savedState = localStorage.getItem(`${APP_ID}_state`);
    if (savedState) {
      try {
        myState = JSON.parse(savedState).state || defaultState;
      } catch (e) {
        console.error('Failed to load state', e);
      }
    }
  }
});

// Save state on destroy
onDestroy(() => {
  if (browser) {
    localStorage.setItem(`${APP_ID}_state`, JSON.stringify({
      state: myState,
      lastUpdated: new Date().toISOString()
    }));
  }
});
```

### Mini-App Loading

The `MiniAppLoader` component provides a simple way to load mini-apps:

```svelte
<MiniAppLoader 
  appId="my-app"             <!-- App ID to load -->
  appUrl="/path/to/app"      <!-- URL to load if app isn't registered -->
  autoLoad={true}            <!-- Auto-load on mount -->
  appProps={{ key: 'value' }} <!-- Props to pass to app -->
  on:load={handleLoad}       <!-- Event handlers -->
  on:error={handleError}
  on:unload={handleUnload}
/>
```

### For More Information

For detailed documentation on creating and using mini-apps, refer to the [Mini-App Framework Guide](./guides/mini-app-framework.md).

## Component Templates

### UI Component Template

```svelte
<!-- Component.svelte -->
<script>
  import { onMount } from 'svelte';
  
  // Props
  export let title = '';
  export let description = '';
  
  // State
  let isLoading = false;
  let data = [];
  
  onMount(async () => {
    // Initialize component
  });
  
  // Event handlers
  function handleClick() {
    // Handle click event
  }
</script>

<div class="container mx-auto p-4">
  <h1>{title}</h1>
  <p>{description}</p>
  
  {#if isLoading}
    <div>Loading...</div>
  {:else}
    <!-- Component content -->
    <button on:click={handleClick} class="btn btn-primary">
      Click me
    </button>
  {/if}
</div>

<style>
  /* Component-specific styles */
</style>
```

### Page Template

```svelte
<!-- routes/dashboard/[page]/+page.svelte -->
<script>
  import PageLayout from '$components/layouts/PageLayout.svelte';
  import PageHeader from '$components/PageHeader.svelte';
  
  // Page data
  export let data;
</script>

<PageLayout>
  <PageHeader title="Page Title" />
  <main class="container mx-auto p-4">
    <!-- Page content -->
  </main>
</PageLayout>
```

## UI Component Standardization

To ensure a consistent user experience across the application, we use two different UI component libraries depending on the context:

1. **Admin UI**: Uses shadcn UI components for the main admin interface
2. **Mini-Apps**: Use DaisyUI components for mini-applications 

This separation helps distinguish the core admin functionality from modular mini-apps while maintaining a cohesive design language throughout the application.

### Admin UI Components (shadcn)

For the main admin interface, all components should use the shadcn UI library. This includes:

- Dashboard layouts and navigation
- Settings and configuration screens
- User management interfaces
- System-level administration tools

### Key shadcn Implementation Requirements

1. **Use shadcn Components**: For all admin UI, leverage the shadcn component library.
   - Buttons, inputs, selects, and dialogs should use shadcn implementations
   - Admin toolbars and control panels should be built from shadcn primitives
   
2. **Dark Mode Support**: All components must support both light and dark themes.
   - Use shadcn theme tokens instead of hardcoded colors
   - Test all components in both light and dark mode
   
3. **Responsive Design**: Components should adapt gracefully to different screen sizes.
   - Mobile-first approach
   - Use fluid layouts and responsive spacing
   
4. **Accessibility**: Ensure all UI components meet accessibility standards.
   - Proper keyboard navigation
   - Screen reader compatibility
   - Sufficient color contrast

### Mini-App Components (DaisyUI)

For mini-apps and embedded applications, all components should use the DaisyUI component library. This includes:

- Mini-app specific interfaces
- Embedded tools and utilities
- Content management interfaces
- Extension functionality

### Key DaisyUI Implementation Requirements

1. **Use DaisyUI Components**: For mini-apps, leverage the DaisyUI components for all common UI needs.
   - Buttons, inputs, selects, and dialogs should use DaisyUI implementations
   - Toolbars and control panels should be built from DaisyUI primitives
   
2. **Dark Mode Support**: All components must support both light and dark themes.
   - Use theme tokens instead of hardcoded colors
   - Test all components in both light and dark mode
   
3. **Responsive Design**: Components should adapt gracefully to different screen sizes.
   - Mobile-first approach
   - Use fluid layouts and responsive spacing
   
4. **Accessibility**: Ensure all UI components meet accessibility standards.
   - Proper keyboard navigation
   - Screen reader compatibility
   - Sufficient color contrast

### Example: DaisyUI Toolbar Implementation

When implementing toolbars in mini-apps, such as those in the Gantt chart component:

```svelte
<!-- ❌ Avoid custom implementations -->
<div class="toolbar">
  <button class="custom-button">
    <span class="icon">+</span>
    Add
  </button>
</div>

<!-- ✅ Use DaisyUI components -->
<div class="flex items-center gap-2">
  <button class="btn btn-outline btn-sm">
    <svg class="w-4 h-4 mr-1" viewBox="0 0 24 24">
      <path d="M12 4v16m-8-8h16" />
    </svg>
    Add
  </button>
  <div class="divider divider-horizontal"></div>
  <div class="btn-group btn-group-horizontal">
    <button class="btn btn-sm">Day</button>
    <button class="btn btn-sm btn-active">Week</button>
    <button class="btn btn-sm">Month</button>
  </div>
</div>
```

### Example: shadcn Admin UI Implementation

When implementing admin interfaces:

```svelte
<!-- ❌ Avoid using DaisyUI in admin interfaces -->
<div class="flex items-center gap-2">
  <button class="btn btn-outline btn-sm">Add</button>
</div>

<!-- ✅ Use shadcn components -->
<div class="flex items-center gap-2">
  <Button variant="outline" size="sm">
    <PlusIcon className="w-4 h-4 mr-1" />
    Add
  </Button>
  <Separator orientation="vertical" className="h-6" />
  <ToggleGroup type="single" defaultValue="week">
    <ToggleGroupItem value="day">Day</ToggleGroupItem>
    <ToggleGroupItem value="week">Week</ToggleGroupItem>
    <ToggleGroupItem value="month">Month</ToggleGroupItem>
  </ToggleGroup>
</div>
```

By following these standards, we ensure that all parts of the application maintain their distinct identity while providing a consistent experience, which improves user experience and makes maintenance easier.

## NextJS Layout and Style Reference

To assist with the migration process, we've included a comprehensive NextJS implementation in `docs/nextjs/` that can serve as a reference for layout structure, styling patterns, and component organization.

### Key NextJS Layout Files

1. **Root Layouts**:
   - `app/layout.tsx` - Server component root layout with theme configuration
   - `app/layout-client.tsx` - Client component root layout with client-side theme handling

2. **Dashboard Layout**:
   - `app/dashboard/layout.tsx` - Main dashboard layout with sidebar, header, and content area
   - `components/layout/dashboard-layout.tsx` - Reusable dashboard component with stats cards and content sections

3. **Layout Components**:
   ```
   components/layout/
   ├── app-sidebar.tsx         # Main navigation sidebar
   ├── header.tsx              # Application header with context selector
   ├── layout-container.tsx    # Content container with consistent padding
   ├── shell-layout.tsx        # High-level application shell
   ├── enhanced-shell.tsx      # Enhanced shell with additional features
   ├── page-container.tsx      # Container for standard pages
   └── ...                     # Other layout components
   ```

### Styling System

The NextJS implementation includes a robust styling system that can be adapted for Svelte:

1. **Theme Variables**:
   - `app/globals.css` - Core CSS variables and Tailwind configuration
   - `app/theme.css` - Theme-specific styles and color schemes

2. **Multiple Themes**:
   - Default, blue, green, amber, and monochrome themes
   - Light and dark mode variants for each theme
   - Scaling support for different device sizes

3. **CSS Architecture**:
   - CSS variables for consistent theming
   - Tailwind CSS for utility classes
   - Component-specific styles where needed

### When Implementing Layouts

When migrating layouts from AngularJS to Svelte, consider referencing the NextJS implementation for:

1. **Layout Structure**: 
   - How the app shell, sidebar, and content areas are organized
   - Responsive layout patterns for different screen sizes

2. **Theming Strategy**:
   - CSS variable structure for consistent theming
   - Dark/light mode implementation
   - Color scheme variations

3. **Component Patterns**:
   - Header implementation with context selector and user menu
   - Sidebar navigation with collapsible sections
   - Content layout patterns for different page types

By referencing these NextJS implementations, you can ensure consistency in your Svelte components while adhering to modern web standards and best practices.

## Additional Resources

For more information, please refer to:

- [SvelteKit Documentation](https://kit.svelte.dev/docs)
- [Svelte Documentation](https://svelte.dev/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn UI Documentation](https://ui.shadcn.com/)
- [DaisyUI Documentation](https://daisyui.com/docs)
- [Zod Documentation](https://zod.dev/)

## Current Migration Status

We are currently in **Phase 2: Content Management** with the following priorities:

- Complete the Mini-App Framework documentation
- Implement Media Management features
- Begin User Management implementation

For detailed status, see the [Progress Tracker](./tracking/PROGRESS-TRACKER.md). 