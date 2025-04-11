# Mini-App Framework Developer Guide

This guide provides information for developers who want to create mini-apps for Mixcore using the Mini-App Framework.

## Overview

The Mini-App Framework allows developers to create modular, pluggable applications that can be integrated into the Mixcore portal. These mini-apps can be loaded dynamically, maintain their own state, and provide specialized functionality while maintaining a consistent look and feel with the rest of the platform.

## Core Components

The Mini-App Framework consists of the following core components:

1. **MiniAppRegistry**: A centralized store for registering and managing mini-apps
2. **MiniAppLoader**: A component for loading and rendering mini-apps
3. **ShellLayout**: A container component that provides common UI elements for mini-apps

## Creating a Mini-App

### Step 1: Create a new route

Create a new route in the `routes/dashboard/apps/` directory for your mini-app. For example:

```
src/routes/dashboard/apps/my-app/+page.svelte
```

### Step 2: Set up your mini-app

Each mini-app should have the following structure:

```svelte
<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    
    // Import the registry
    import { miniAppRegistry } from '$lib/mini-app/MiniAppRegistry';
    
    // Mini-app metadata
    const APP_ID = 'my-app';
    const APP_NAME = 'My App';
    const APP_VERSION = '1.0.0';
    
    // Your app's state
    let myState = 0;
    
    // Mini-app lifecycle
    onMount(() => {
        if (!browser) return;
        
        // Register this mini-app
        miniAppRegistry.registerApp({
            config: {
                appId: APP_ID,
                version: APP_VERSION,
                displayName: APP_NAME,
                description: 'My awesome mini-app',
                category: 'Tools',
                icon: '/icons/my-app.svg',
                entryPoint: '/dashboard/apps/my-app',
                // Optional properties:
                mainStyles: '/css/my-app.css',
                permissions: [
                    {
                        name: 'read',
                        displayName: 'Read Access',
                        description: 'Allows reading data'
                    }
                ],
                navigation: {
                    position: 'sidebar',
                    priority: 10,
                    menuItem: {
                        title: APP_NAME,
                        icon: 'app',
                        url: '/dashboard/apps/my-app',
                        contextId: 'apps'
                    }
                },
                author: {
                    name: 'Your Name',
                    email: 'your.email@example.com',
                    url: 'https://example.com'
                }
            },
            default: YourAppComponent,
            styles: '.my-app { color: blue; }'
        });
        
        // Set as active app
        miniAppRegistry.setActiveApp(APP_ID);
    });
    
    onDestroy(() => {
        if (!browser) return;
        
        // Optional cleanup
    });
</script>

<div class="container mx-auto px-4 py-8">
    <h1>My Mini-App</h1>
    <!-- Your mini-app's UI goes here -->
</div>
```

### Step 3: Add your mini-app to the marketplace

To make your app appear in the marketplace, you'll need to add it to the list of available apps in the `src/routes/dashboard/apps/+page.svelte` file. Find the `apps` array and add your app's metadata:

```js
apps = [
    // ... existing apps
    {
        id: 'my-app',
        name: 'My App',
        description: 'My awesome mini-app',
        iconUrl: '/icons/my-app.svg',
        tags: ['Tool', 'Utility'],
        author: 'Your Name',
        version: '1.0.0',
        updatedDate: '2023-06-10',
        url: '/dashboard/apps/my-app'
    }
];
```

## Mini-App Configuration

The `MiniAppConfig` interface defines the configuration options for a mini-app:

```typescript
export interface MiniAppConfig {
  appId: string;           // Unique identifier for the app
  version: string;         // Version string (semver recommended)
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

## Registry API

The `miniAppRegistry` provides the following methods:

| Method | Description |
|--------|-------------|
| `registerApp(appModule)` | Register a single mini-app |
| `registerApps(appModules)` | Register multiple mini-apps |
| `unregisterApp(appId)` | Remove a mini-app from the registry |
| `setActiveApp(appId)` | Set the currently active mini-app |
| `loadApp(appId, appUrl)` | Dynamically load a mini-app from a URL |
| `getApp(appId)` | Get a specific mini-app by ID |
| `reset()` | Reset the registry to its initial state |

## State Persistence

To persist state between sessions, store your app's data in localStorage or another storage mechanism. You can implement this in your mini-app's onMount and onDestroy lifecycle methods. For example:

```js
// Load persisted state
onMount(() => {
    if (browser) {
        const savedState = localStorage.getItem(`${APP_ID}_state`);
        if (savedState) {
            try {
                const parsed = JSON.parse(savedState);
                myState = parsed.myState || 0;
            } catch (e) {
                console.error('Failed to parse saved state', e);
            }
        }
    }
});

// Save state on unmount
onDestroy(() => {
    if (browser) {
        localStorage.setItem(`${APP_ID}_state`, JSON.stringify({
            myState,
            lastUpdated: new Date().toISOString()
        }));
    }
});
```

## Styling Your Mini-App

You have several options for styling your mini-app:

1. **Inline styles**: Define styles directly in your components
2. **App-specific CSS**: Include a CSS file for your app
3. **Injected styles**: Use the `styles` property when registering your app
4. **shadcn/ui components**: Use the shared UI components for consistent styling

The recommended approach is to use shadcn/ui components for consistency with the main application and to add app-specific styles only when necessary.

## Event Handling

The MiniAppLoader emits several events that you can listen for in a parent component:

- `load`: Emitted when a mini-app is successfully loaded
- `error`: Emitted when there is an error loading a mini-app
- `unload`: Emitted when a mini-app is unloaded

For example:

```svelte
<MiniAppLoader 
    appId="my-app"
    appUrl="/dashboard/apps/my-app"
    on:load={handleAppLoad}
    on:error={handleAppError}
    on:unload={handleAppUnload}
/>
```

## Best Practices

1. **Use unique app IDs**: Ensure your app ID is unique to avoid conflicts
2. **Modular design**: Keep your mini-app self-contained
3. **Responsive UI**: Design your mini-app to work on different screen sizes
4. **Error handling**: Implement proper error handling to avoid crashing the main app
5. **Light & dark mode**: Support both light and dark themes
6. **Performance**: Optimize your mini-app for performance
7. **Accessibility**: Ensure your mini-app is accessible to all users

## Example Mini-App

Refer to the Template App at `src/routes/dashboard/apps/_template/+page.svelte` for a complete working example of a mini-app.

## Troubleshooting

### Common Issues

1. **Mini-app not loading**:
   - Check that your app is properly registered
   - Verify that your app URL is correct
   - Look for JavaScript errors in the console

2. **Styling issues**:
   - Ensure you're using the correct CSS classes
   - Check for conflicting styles
   - Verify that your app's styles are being loaded

3. **State not persisting**:
   - Check that you're saving and loading state in the correct format
   - Verify localStorage access
   - Ensure you have proper error handling

## Support

For additional support, contact the Mixcore development team or refer to the following resources:

- [Mixcore Documentation](https://docs.mixcore.org)
- [GitHub Repository](https://github.com/mixcore/mix.portal.svelte)
- [Community Forum](https://community.mixcore.org) 