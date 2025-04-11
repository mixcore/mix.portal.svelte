# Template Mini-App Issues

This document outlines issues found in the Template Mini-App (`src/routes/dashboard/apps/_template/+page.svelte`) and provides guidance on how to fix them.

## Current Issues

The Template Mini-App has the following issues that need to be addressed:

### 1. Import Paths

Current import paths use the `$components` alias which doesn't exist in the workspace:

```svelte
import { Button } from '$components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$components/ui/card';
// and so on...
```

**Fix**: Change import paths to use the correct alias structure. For example:

```svelte
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
// or with a proper alias if defined in the project configuration
```

### 2. MiniApp Configuration Structure

The app registration doesn't follow the MiniAppConfig interface structure:

```svelte
miniAppRegistry.registerApp({
    id: APP_ID,
    name: APP_NAME,
    version: APP_VERSION,
    config: {
        url: '/dashboard/apps/_template',
        supportsDarkMode: true
    }
});
```

**Fix**: Update to use the correct interface structure:

```svelte
miniAppRegistry.registerApp({
    config: {
        appId: APP_ID,
        version: APP_VERSION,
        displayName: APP_NAME,
        description: 'A template for creating Mixcore mini-apps',
        category: 'Examples',
        icon: '/icons/app-template.svg',
        entryPoint: '/dashboard/apps/_template'
    },
    default: YourComponentReference, // The current component or a reference to it
});
```

### 3. Missing Registry Methods

The app uses methods that don't exist in the MiniAppRegistry:

```svelte
const appData = miniAppRegistry.getAppData(APP_ID);
// ...
miniAppRegistry.updateAppData(APP_ID, { ... });
```

**Fix**: Implement state persistence manually using localStorage:

```svelte
// Load data in onMount
onMount(() => {
    if (browser) {
        try {
            const savedData = localStorage.getItem(`miniapp_${APP_ID}_data`);
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                counter = parsedData.counter || 0;
                name = parsedData.name || '';
            }
        } catch (e) {
            console.error('Failed to load app data', e);
        }
    }
});

// Save data in onDestroy
onDestroy(() => {
    if (browser) {
        try {
            localStorage.setItem(`miniapp_${APP_ID}_data`, JSON.stringify({
                counter,
                name,
                lastUsed: new Date().toISOString()
            }));
        } catch (e) {
            console.error('Failed to save app data', e);
        }
    }
});
```

### 4. Type Safety Issues

The switch component is used without proper type safety:

```svelte
<Switch
    checked={darkMode}
    onCheckedChange={(checked) => darkMode = checked}
/>
```

**Fix**: Add proper typing for the event parameter:

```svelte
<Switch
    checked={darkMode}
    onCheckedChange={(checked: boolean) => darkMode = checked}
/>
```

## Next Steps

1. Fix the issues in the Template Mini-App
2. Update the mini-app documentation with these corrections
3. Add TypeScript interfaces for components that need them
4. Add tests to verify the mini-app framework functions correctly 