<script lang="ts">
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { page } from '$app/stores';
    
    // Components
    import ShellLayout from '$components/layout/ShellLayout.svelte';
    import { Button } from '$components/ui/button';
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$components/ui/card';
    import { Skeleton } from '$components/ui/skeleton';
    import { Badge } from '$components/ui/badge';
    import { Input } from '$components/ui/input';
    import { Search } from 'lucide-svelte';
    
    // Store imports
    import { auth, settings, navigationStore } from '$lib/stores';
    import { miniAppRegistry } from '$lib/mini-app/MiniAppRegistry';
    
    // Types
    interface AppCard {
        id: string;
        name: string;
        description: string;
        iconUrl: string;
        tags: string[];
        author: string;
        version: string;
        updatedDate: string;
        url?: string;
    }
    
    // State
    let loading = true;
    let searchQuery = '';
    let activeAppId: string | null = null;
    let miniAppUrl: string | null = null;
    let apps: AppCard[] = [];
    
    // Settings from store
    let isDarkMode = false;
    let isMobileMenuOpen = false;
    
    // Functions
    function toggleTheme() {
        isDarkMode = !isDarkMode;
        $settings.darkMode = isDarkMode;
    }
    
    function toggleMobileMenu() {
        isMobileMenuOpen = !isMobileMenuOpen;
    }
    
    function setContext(contextId: string) {
        $navigationStore.activeContext = contextId;
    }
    
    function loadApp(app: AppCard) {
        activeAppId = app.id;
        miniAppUrl = app.url || null;
    }
    
    function closeApp() {
        activeAppId = null;
        miniAppUrl = null;
        // Unregister from registry if needed
        if ($miniAppRegistry.activeAppId) {
            miniAppRegistry.setActiveApp(null);
        }
    }
    
    function handleMiniAppLoad(event: CustomEvent<{ appId: string, config: any }>) {
        console.log('Mini app loaded:', event.detail);
    }
    
    function handleMiniAppError(event: CustomEvent<{ error: Error, appId: string | null }>) {
        console.error('Mini app error:', event.detail.error);
        // Show error toast or notification
    }
    
    // Filter apps based on search query
    $: filteredApps = searchQuery 
        ? apps.filter(app => 
            app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        : apps;
    
    // Load data
    onMount(async () => {
        if (!browser) return;
        
        // Get dark mode from settings
        isDarkMode = $settings.darkMode;
        
        // Restore active app from registry if available
        if ($miniAppRegistry.activeAppId) {
            activeAppId = $miniAppRegistry.activeAppId;
            const activeApp = $miniAppRegistry.apps.find(a => a.id === activeAppId);
            if (activeApp && 'url' in activeApp.config) {
                miniAppUrl = activeApp.config.url as string;
            }
        }
        
        // Fetch available apps
        try {
            // In a real app, this would be an API call
            // For now, we'll use mock data
            setTimeout(() => {
                apps = [
                    {
                        id: 'template',
                        name: 'Template App',
                        description: 'A template for creating new Mixcore mini-apps',
                        iconUrl: '/icons/app-template.svg',
                        tags: ['Template', 'Starter'],
                        author: 'Mixcore Team',
                        version: '1.0.0',
                        updatedDate: '2023-05-15',
                        url: '/dashboard/apps/_template'
                    },
                    {
                        id: 'data-explorer',
                        name: 'Data Explorer',
                        description: 'Explore and visualize your data with interactive charts',
                        iconUrl: '/icons/data-explorer.svg',
                        tags: ['Data', 'Visualization', 'Analytics'],
                        author: 'Mixcore Team',
                        version: '1.2.0',
                        updatedDate: '2023-06-20',
                    },
                    {
                        id: 'content-manager',
                        name: 'Content Manager',
                        description: 'Manage all your content in one place',
                        iconUrl: '/icons/content-manager.svg',
                        tags: ['Content', 'CMS', 'Management'],
                        author: 'Mixcore Team',
                        version: '2.0.1',
                        updatedDate: '2023-07-10',
                    },
                    {
                        id: 'user-manager',
                        name: 'User Manager',
                        description: 'Manage users, roles and permissions',
                        iconUrl: '/icons/user-manager.svg',
                        tags: ['Users', 'Roles', 'Permissions'],
                        author: 'Mixcore Team',
                        version: '1.5.0',
                        updatedDate: '2023-04-05',
                    },
                    {
                        id: 'file-manager',
                        name: 'File Manager',
                        description: 'Upload, organize and manage your files',
                        iconUrl: '/icons/file-manager.svg',
                        tags: ['Files', 'Media', 'Storage'],
                        author: 'Mixcore Team',
                        version: '1.0.3',
                        updatedDate: '2023-03-12',
                    },
                    {
                        id: 'settings-manager',
                        name: 'Settings Manager',
                        description: 'Configure your Mixcore instance',
                        iconUrl: '/icons/settings-manager.svg',
                        tags: ['Settings', 'Configuration'],
                        author: 'Mixcore Team',
                        version: '1.1.0',
                        updatedDate: '2023-02-28',
                    }
                ];
                loading = false;
            }, 1000);
        } catch (error) {
            console.error('Failed to load apps:', error);
            loading = false;
        }
    });
</script>

<ShellLayout
    bind:isDarkMode
    bind:isMobileMenuOpen
    activeContext={$navigationStore.activeContext}
    appContexts={$navigationStore.contexts}
    activeNavItems={$navigationStore.items}
    {toggleTheme}
    {toggleMobileMenu}
    {setContext}
    showMiniApp={!!activeAppId}
    miniAppId={activeAppId}
    miniAppUrl={miniAppUrl}
    on:miniAppLoad={handleMiniAppLoad}
    on:miniAppError={handleMiniAppError}
>
    <!-- App Gallery -->
    <div class="space-y-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h1 class="text-2xl font-bold tracking-tight">Apps Marketplace</h1>
                <p class="text-muted-foreground">Browse and install applications for your Mixcore instance</p>
            </div>
            
            <!-- Search -->
            <div class="relative w-full sm:w-auto">
                <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search apps..."
                    class="w-full sm:w-[250px] pl-8"
                    bind:value={searchQuery}
                />
            </div>
        </div>
        
        <!-- App grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#if loading}
                {#each Array(6) as _, i}
                    <Card>
                        <CardHeader class="space-y-2">
                            <div class="flex items-center gap-4">
                                <Skeleton class="h-12 w-12 rounded-lg" />
                                <div class="space-y-2 flex-1">
                                    <Skeleton class="h-4 w-3/4" />
                                    <Skeleton class="h-3 w-1/2" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Skeleton class="h-16 w-full" />
                        </CardContent>
                        <CardFooter>
                            <Skeleton class="h-10 w-full" />
                        </CardFooter>
                    </Card>
                {/each}
            {:else if filteredApps.length === 0}
                <div class="col-span-3 py-12 text-center">
                    <h3 class="text-lg font-medium">No apps found</h3>
                    <p class="text-muted-foreground mt-1">Try adjusting your search query</p>
                </div>
            {:else}
                {#each filteredApps as app}
                    <Card>
                        <CardHeader>
                            <div class="flex items-start gap-4">
                                <div class="h-12 w-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                                    <img 
                                        src={app.iconUrl || '/icons/app-default.svg'} 
                                        alt={app.name} 
                                        class="h-10 w-10 object-contain"
                                        onError={(e) => e.target.src = '/icons/app-default.svg'}
                                    />
                                </div>
                                <div class="space-y-1 flex-1">
                                    <CardTitle class="text-lg">{app.name}</CardTitle>
                                    <CardDescription class="text-xs">
                                        v{app.version} · Updated {new Date(app.updatedDate).toLocaleDateString()}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p class="text-sm text-card-foreground mb-3">{app.description}</p>
                            <div class="flex flex-wrap gap-1">
                                {#each app.tags as tag}
                                    <Badge variant="secondary" class="text-xs">{tag}</Badge>
                                {/each}
                            </div>
                        </CardContent>
                        <CardFooter class="flex justify-between items-center">
                            <div class="text-xs text-muted-foreground">By {app.author}</div>
                            <Button 
                                variant="default"
                                size="sm"
                                on:click={() => loadApp(app)}
                                disabled={!app.url}
                            >
                                {app.url ? 'Open' : 'Coming Soon'}
                            </Button>
                        </CardFooter>
                    </Card>
                {/each}
            {/if}
        </div>
    </div>
</ShellLayout> 