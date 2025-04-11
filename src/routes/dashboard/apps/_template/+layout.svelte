<script lang="ts">
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import MiniAppShell from '../../../../components/layout/MiniAppShell.svelte';
    import { Database, Home, Settings, Users, FileText, Grid, Layers, 
             Bell, Search, HelpCircle, Download, Filter, BarChart } from 'lucide-svelte';
    
    // Extract app ID from the URL
    $: appId = $page.params.app || 'template';
    
    // App configuration 
    const appConfig = {
        appId: 'template',
        title: 'Template App',
        description: 'A starter template for creating Mixcore mini-apps',
        version: '1.0.0',
        icon: Database,
        hasSidebar: true,
        hasToolbar: true,
        hasTabs: true,
        primaryColor: '#3b82f6',
        secondaryColor: '#6366f1'
    };
    
    // App tabs
    const appTabs = [
        { id: 'dashboard', title: 'Dashboard', icon: Home },
        { id: 'data', title: 'Data Explorer', icon: Database },
        { id: 'templates', title: 'Templates', icon: FileText },
        { id: 'reports', title: 'Reports', icon: BarChart },
        { id: 'settings', title: 'Settings', icon: Settings }
    ];
    
    // Active tab - can be controlled by route or state
    let activeTabId = 'dashboard';
    
    // Sidebar items - more extensive structure for app-like navigation
    const sidebarItems = [
        {
            title: 'Main',
            icon: Home,
            items: [
                { id: 'dashboard', title: 'Dashboard', icon: Home, path: '/dashboard' },
                { id: 'data', title: 'Data Explorer', icon: Database, path: '/data', badge: 3 }
            ]
        },
        {
            title: 'Content',
            icon: FileText,
            items: [
                { id: 'templates', title: 'Templates', icon: FileText, path: '/templates' },
                { id: 'components', title: 'Components', icon: Grid, path: '/components' },
                { id: 'libraries', title: 'Libraries', icon: Layers, path: '/libraries' }
            ]
        },
        {
            title: 'Analytics',
            icon: BarChart,
            items: [
                { id: 'reports', title: 'Reports', icon: BarChart, path: '/reports' },
                { id: 'statistics', title: 'Statistics', icon: BarChart, path: '/statistics' },
                { id: 'exports', title: 'Exports', icon: Download, path: '/exports' }
            ]
        },
        {
            title: 'Administration',
            icon: Settings,
            items: [
                { id: 'users', title: 'Users', icon: Users, path: '/users' },
                { id: 'permissions', title: 'Permissions', icon: Users, path: '/permissions' },
                { id: 'settings', title: 'Settings', icon: Settings, path: '/settings' }
            ]
        }
    ];
    
    // Define event types
    type AppReadyEvent = CustomEvent<{ appId: string }>;
    type AppErrorEvent = CustomEvent<{ error: Error, appId: string }>;
    type TabChangeEvent = CustomEvent<{ tabId: string }>;
    
    // Handle app ready event
    function handleAppReady(event: AppReadyEvent) {
        console.log('App ready:', event.detail.appId);
        
        // In a real app, you might initialize app data here
        document.body.classList.add('template-app');
    }
    
    // Handle app errors
    function handleAppError(event: AppErrorEvent) {
        console.error('App error:', event.detail.error);
    }
    
    // Handle tab changes
    function handleTabChange(event: TabChangeEvent) {
        console.log('Tab changed:', event.detail.tabId);
        activeTabId = event.detail.tabId;
        
        // You might handle routing or data loading here
    }
    
    // Clean up when component unmounts
    onMount(() => {
        return () => {
            document.body.classList.remove('template-app');
        };
    });
</script>

<MiniAppShell
    appId={appConfig.appId}
    title={appConfig.title}
    description={appConfig.description}
    version={appConfig.version}
    icon={appConfig.icon}
    hasSidebar={appConfig.hasSidebar}
    hasToolbar={appConfig.hasToolbar}
    hasTabs={appConfig.hasTabs}
    tabs={appTabs}
    activeTabId={activeTabId}
    sidebarItems={sidebarItems}
    primaryColor={appConfig.primaryColor}
    secondaryColor={appConfig.secondaryColor}
    on:ready={handleAppReady}
    on:error={handleAppError}
    on:tabChange={handleTabChange}
>
    <!-- Custom toolbar actions -->
    <div slot="toolbar-actions" class="flex items-center gap-2">
        <!-- Search box -->
        <div class="relative hidden md:block">
            <div class="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                <Search size={14} class="text-muted-foreground" />
            </div>
            <input 
                type="text" 
                placeholder="Search..." 
                class="pl-8 pr-3 py-1 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary w-40 lg:w-64"
            />
        </div>
        
        <!-- Action buttons -->
        <button class="p-2 rounded-full hover:bg-muted transition-colors relative">
            <Bell size={18} />
            <span class="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
        </button>
        
        <button class="p-2 rounded-full hover:bg-muted transition-colors">
            <HelpCircle size={18} />
        </button>
        
        <button class="p-2 rounded-full hover:bg-muted transition-colors">
            <Settings size={18} />
        </button>
    </div>
    
    <slot />
</MiniAppShell>

<style>
    /* App-specific global styles */
    :global(.template-app) {
        --app-primary: #3b82f6;
        --app-primary-rgb: 59, 130, 246;
        --app-secondary: #6366f1;
        --app-success: #22c55e;
        --app-error: #ef4444;
        --app-warning: #f59e0b;
        
        /* Apply app-specific theme */
        --primary: var(--app-primary);
        --primary-rgb: var(--app-primary-rgb);
        --accent: var(--app-secondary);
    }
    
    :global(.template-app .app-main-content) {
        background-color: var(--base-200, #f8f9fa);
    }
    
    :global(.template-app.dark .app-main-content) {
        background-color: var(--base-300, #1e293b);
    }
    
    /* Custom scrollbar for app content */
    :global(.template-app ::-webkit-scrollbar) {
        width: 8px;
        height: 8px;
    }
    
    :global(.template-app ::-webkit-scrollbar-thumb) {
        background-color: rgba(var(--app-primary-rgb), 0.2);
        border-radius: 4px;
    }
    
    :global(.template-app ::-webkit-scrollbar-thumb:hover) {
        background-color: rgba(var(--app-primary-rgb), 0.4);
    }
</style> 