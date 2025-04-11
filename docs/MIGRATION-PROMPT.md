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

Each mini-app in Mixcore should be designed as a self-contained mini-application that can be hot-loaded into the main application. This modular approach allows for better separation of concerns and improved performance through code splitting.

### Key Concepts

- **Hot-Loading**: mini-apps load dynamically without requiring full page reloads
- **Isolated Shell Layouts**: Each mini-app has its own shell layout displayed within the `<main>` element of /dashboard/apps/
- **Contextual UI**: UI elements adapt based on the active app
- **Code Splitting**: Only load code necessary for the current app
- **Authentication Integration**: Built-in authentication sync with dashboard
- **Role-Based Access Control**: Support for role and permission-based UI adaption
- **Internationalization**: Multi-language support with culture handling
- **API Integration**: Standardized API client for consistent data access

### Mini-App Template

To accelerate mini-app development, we've created a comprehensive starter template located at `/src/routes/dashboard/apps/_template`. This template provides all the essential components and infrastructure needed to build a fully functional mini-app with minimal setup.

#### Template Features

- **Complete Project Structure**: Pre-organized directories for components, layouts, stores, and libraries
- **Authentication System**: Ready-to-use authentication with role-based access control
- **Internationalization**: Built-in localization with culture-aware formatting 
- **API Client**: Type-safe MixDB API client with automatic auth and culture integration
- **Modern UI Components**: DaisyUI based components with light/dark mode support
- **Documentation**: Comprehensive README with usage examples and best practices

#### Template Structure

```
mini-app/
├── app-globals.css          # App-specific styles
├── +page.svelte             # Main entry point
├── +layout.svelte           # App layout
├── components/              # UI components
│   └── Dashboard.svelte     # Main dashboard component
├── config/                  # Configuration files
│   ├── app.config.json      # App configuration
│   ├── demo-data.json       # Demo data
│   └── mixdb.schema.json    # Database schema
├── stores/                  # Svelte stores
│   ├── app-store.js         # App state management
│   └── settings-store.js    # App settings management
├── lib/                     # Utility functions and types
│   ├── mixdb-api.js         # MixDB API client for data access
│   ├── auth.js              # Authentication and authorization
│   ├── culture.js           # Localization and culture handling
│   ├── types.js             # Common types for API interaction
│   └── index.js             # Exports all utilities for easy importing
```

#### Authentication & Role-Based Access Control

The template includes a robust authentication system that integrates with Mixcore Dashboard:

```javascript
// Initialize the auth service
import { createAuthStore } from '$lib/auth';

const authStore = createAuthStore({
  authEndpoint: '/api/auth',
  persistToken: true
});

// Check if user has a role
$: isAdmin = $authStore.hasRole('Admin');

// Check if user has a permission
$: canEditProducts = $authStore.hasPermission('products.edit');

// Create reusable permission guards
const checkEditPermission = (permission) => $authStore.hasPermission(permission);
```

#### Internationalization & Culture Support

The template includes comprehensive internationalization:

```javascript
// Initialize the culture service
import { createCultureStore } from '$lib/culture';

const culture = createCultureStore({
  defaultCulture: 'en-US'
});

// Create a translator function
import { _ } from '$lib/i18n';
const greeting = _('hello', 'Hello');

// Format dates and numbers according to culture
$: formattedDate = $culture.formatDate(new Date());
$: formattedNumber = $culture.formatNumber(1234.56);
$: formattedCurrency = $culture.formatCurrency(99.99, 'EUR');
```

#### API Integration

The template includes a comprehensive MixDB API client:

```javascript
// Initialize the API client with auth and culture services
import { createApiStore } from '$lib/api';
import { authStore } from '$lib/auth';
import { cultureStore } from '$lib/culture';

const api = createApiStore({
  basePath: '/api/v2/mixdb',
  authStore,         // Automatic auth integration
  cultureStore,      // Automatic culture integration
  includeCulture: true  // Include culture in requests
});

// Get paginated data (auth headers and culture are automatically included)
$: apiCall = async () => {
  try {
    const products = await $api.getItems('product', {
      page: 1,
      pageSize: 10,
      filter: { status: 'Published' }
    });
    return products;
  } catch (error) {
    console.error('Failed to fetch products', error);
    return [];
  }
}
```

### Implementation

1. **App Module Structure**:
```
/src/routes/dashboard/apps
  /cms
    /components
    /stores
    +page.svelte    # Main entry point
    +layout.svelte  # App-specific shell layout
    /lib
      /auth.js      # Authentication utilities
      /culture.js   # Localization utilities
      /mixdb-api.js # API client
      /types.js     # Type definitions
      /index.js     # Library exports
  /mixdb
    ...
  /design
    ...
```

2. **App Loading**:
```svelte
<!-- routes/dashboard/apps/[app-name]/+layout.svelte -->
<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { appStore } from '$lib/stores/app-store';
  import LoadingSpinner from '$components/LoadingSpinner.svelte';

  let isLoading = true;
  let error = null;

  onMount(async () => {
    try {
      await appStore.initialize();
      isLoading = false;
    } catch (err) {
      error = err;
      isLoading = false;
    }
  });
</script>

{#if isLoading}
  <LoadingSpinner />
{:else if error}
  <div class="error">Failed to load app: {error.message}</div>
{:else}
  <div class="app-shell">
    <!-- App shell UI -->
    <slot />
  </div>
{/if}
```

### Mini-App Requirements

Each mini-app must include the following files and features to ensure proper integration with the Mixcore system:

#### Required Files

1. **app-globals.css**: App-specific styles that override or extend the global styles
   ```
   /src/routes/dashboard/apps/[app-name]/app-globals.css
   ```

2. **Configuration Files**: Located in the config directory
   ```
   /src/routes/dashboard/apps/[app-name]/config/
   ├── app.config.json      # App configuration
   ├── demo-data.json       # Sample data for initialization
   └── mixdb.schema.json    # MixDB schema definition
   ```

3. **Core Store Files**: For authentication, API, and internationalization
   ```
   /src/routes/dashboard/apps/[app-name]/stores/
   ├── auth-store.js        # Authentication store
   ├── api-store.js         # API communication
   └── settings-store.js    # App settings
   ```

4. **Documentation**: Basic usage and development guides
   ```
   /src/routes/dashboard/apps/[app-name]/README.md
   ```

#### Configuration Schema

The `app.config.json` should follow this structure:

```json
{
  "appId": "[unique-app-id]",
  "version": "1.0.0",
  "displayName": "App Display Name",
  "description": "App description",
  "category": "category",
  "icon": "material_icon_name",
  "author": {
    "name": "Author Name",
    "email": "email@example.com",
    "url": "https://example.com"
  },
  "license": "MIT",
  "entryPoint": "+page.svelte",
  "init": {
    "initOnInstall": true,
    "schemaFile": "./mixdb.schema.json",
    "demoDataFile": "./demo-data.json",
    "createDefaultPermissions": true
  },
  "mainStyles": "app-globals.css",
  "navigation": {
    "position": "main",
    "priority": 5,
    "menuItem": {
      "title": "App Name",
      "icon": "icon_name",
      "url": "/dashboard/apps/[app-id]",
      "badge": null,
      "contextId": "[app-id]"
    }
  },
  "permissions": [
    {
      "name": "[app-id].action",
      "displayName": "Action Name",
      "description": "Action description"
    }
  ],
  "settings": {
    // App-specific settings
  },
  "integrations": {
    "cms": {
      "enabled": true,
      "createContentTypes": true
    },
    "mixdb": {
      "enabled": true
    },
    "authentication": {
      "enabled": true,
      "requiredRoles": ["Administrator", "Editor"]
    },
    "localization": {
      "enabled": true,
      "defaultCulture": "en-US",
      "supportedCultures": ["en-US", "fr-FR", "es-ES", "ar-SA"]
    }
  }
}
```

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

## Additional Resources

For more information, please refer to:

- [SvelteKit Documentation](https://kit.svelte.dev/docs)
- [Svelte Documentation](https://svelte.dev/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [DaisyUI Documentation](https://daisyui.com/docs)
- [Zod Documentation](https://zod.dev/)

## Current Migration Status

We are currently in **Phase 2: Content Management** with the following priorities:

- Complete the Pages feature (including edit functionality)
- Implement Posts management
- Refine authentication system

For detailed status, see the [Progress Tracker](./tracking/PROGRESS-TRACKER.md). 

## UI Component Standardization

To ensure a consistent user experience across the application, all mini-apps and components should use the UI component library based on DaisyUI. This helps maintain a cohesive design language throughout the application.

### Key UI Standardization Requirements

1. **Use DaisyUI Components**: Rather than building custom UI elements, leverage the DaisyUI components for all common UI needs.
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

### Example: Toolbar Implementation

When implementing toolbars, such as those in the Gantt chart component:

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

By following these standards, we ensure that all parts of the application look and feel consistent, which improves user experience and makes maintenance easier. 