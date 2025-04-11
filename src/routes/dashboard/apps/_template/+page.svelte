<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import ShellLayout from '../../../../components/layout/ShellLayout.svelte';
    import ErrorDisplay from '../../../../components/ErrorDisplay.svelte';
    
    // Import stores for the mini-app
    import { createAppStore } from './stores/app-store';
    import { createSettingsStore } from './stores/settings-store';
    import { createAuthStore } from './lib/auth';
    import { createCultureStore } from './lib/culture';
    import { createApiStore } from './lib/mixdb-api';
    
    // Types
    import type { AppItem, AppStats } from './lib/types';
    
    // Config
    import appConfig from './config/app.config.json';
    
    // Initialize app stores
    const appStore = createAppStore();
    const settingsStore = createSettingsStore();
    
    // Initialize auth store
    const authStore = createAuthStore({
        authEndpoint: '/api/auth',
        persistToken: true
    });
    
    // Initialize culture store
    const cultureStore = createCultureStore({
        defaultCulture: 'en-US',
        supportedCultures: ['en-US', 'fr-FR', 'es-ES']
    });
    
    // Initialize API client
    const apiStore = createApiStore({
        basePath: '/api/v2/mixdb',
        authStore,
        cultureStore,
        includeCulture: true
    });
    
    // App state
    let isLoading = true;
    let error: Error | null = null;
    let statusCode = 0;
    let appData: AppItem[] = [];
    let stats: AppStats = {
        totalItems: 0,
        activeUsers: 0,
        pendingTasks: 0
    };
    
    // Auth and permission helpers
    $: isAdmin = authStore.hasRole('Admin');
    $: canEditItems = authStore.hasPermission(`${appConfig.appId}.edit`);
    
    // Initialize app
    onMount(async () => {
        try {
            // Load app settings and initial data
            await settingsStore.loadSettings();
            
            // Simulate API call to load data
            isLoading = true;
            
            try {
                // Attempt to fetch data
                // In a real app, this would be an actual API call:
                // const response = await fetch('/api/data');
                // if (!response.ok) throw new Error(`Server returned ${response.status}`);
                
                // For demo, simulate delayed response
                await new Promise(resolve => setTimeout(resolve, 800));
                
                // Uncommenting the line below will simulate a 500 server error
                // throw new Error('Server error: Could not connect to database');
                
                // Set mock data - in real app, get from API
                stats = {
                    totalItems: 124,
                    activeUsers: 45,
                    pendingTasks: 8
                };
                
                appData = [
                    { id: 1, name: 'Item 1', status: 'Active', date: '2023-10-24' },
                    { id: 2, name: 'Item 2', status: 'Pending', date: '2023-10-23' },
                    { id: 3, name: 'Item 3', status: 'Inactive', date: '2023-10-22' },
                ];
                
            } catch (err) {
                console.error('API call failed:', err);
                error = err instanceof Error ? err : new Error('Unknown API error');
                statusCode = 500; // Server error
                return;
            }
            
            isLoading = false;
        } catch (err) {
            console.error('Failed to initialize app:', err);
            error = err instanceof Error ? err : new Error('Unknown error occurred');
            statusCode = 500;
            isLoading = false;
        }
    });
    
    // Handle retry
    function handleRetry() {
        error = null;
        statusCode = 0;
        isLoading = true;
        
        // Re-initialize in the next event loop
        setTimeout(() => {
            onMount(() => {});
        }, 0);
    }
    
    // Event handlers
    function handleAddNew() {
        console.log('Add new item');
    }
    
    function handleEdit(itemId: number | string) {
        console.log('Edit item:', itemId);
    }
    
    function handleDelete(itemId: number | string) {
        console.log('Delete item:', itemId);
    }
</script>

<!-- App specific styles -->
<svelte:head>
    <link rel="stylesheet" href="./app-globals.css">
</svelte:head>

<!-- Mini-App Template Structure -->
{#if isLoading}
    <!-- App Loading State -->
    <div class="flex items-center justify-center h-full w-full">
        <div class="flex flex-col items-center gap-4">
            <div class="loading loading-spinner loading-lg text-primary"></div>
            <p class="text-sm text-muted-foreground">Loading {appConfig.displayName}...</p>
        </div>
    </div>
{:else if error}
    <!-- App Error State - Using our ErrorDisplay component -->
    <ErrorDisplay 
        {error}
        statusCode={statusCode}
        title={statusCode === 500 ? "Server Error" : "Application Error"}
        onRetry={handleRetry}
    />
{:else}
    <!-- Mini-App Content Structure -->
    <div class="mini-app-container h-full flex flex-col">
        <!-- Mini-App Header -->
        <div class="mini-app-header flex items-center justify-between mb-4 pb-4 border-b">
            <div class="flex items-center gap-3">
                <div class="bg-primary/10 text-primary p-2 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                </div>
                <div>
                    <h1 class="text-lg font-semibold">{appConfig.displayName}</h1>
                    <p class="text-sm text-muted-foreground">{appConfig.description}</p>
                </div>
            </div>
            
            <!-- Mini-App Actions Toolbar -->
            <div class="flex items-center gap-2">
                {#if canEditItems}
                <button class="btn btn-sm btn-outline" on:click={handleAddNew}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add New
                </button>
                {/if}
                
                <div class="divider divider-horizontal"></div>
                
                <div class="btn-group btn-group-horizontal">
                    <button class="btn btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                    </button>
                    <button class="btn btn-sm btn-active">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
        
        <!-- Mini-App Content Area -->
        <div class="mini-app-content flex-1 overflow-auto">
            <!-- Cards Section Example -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <!-- Stats Card -->
                <div class="card bg-base-100 shadow-sm">
                    <div class="card-body">
                        <h2 class="card-title text-sm font-medium text-muted-foreground">Total Items</h2>
                        <p class="text-2xl font-bold">{stats.totalItems}</p>
                        <div class="text-xs text-success flex items-center mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                            <span>12% increase</span>
                        </div>
                    </div>
                </div>
                
                <!-- Stats Card -->
                <div class="card bg-base-100 shadow-sm">
                    <div class="card-body">
                        <h2 class="card-title text-sm font-medium text-muted-foreground">Active Users</h2>
                        <p class="text-2xl font-bold">{stats.activeUsers}</p>
                        <div class="text-xs text-success flex items-center mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                            <span>5% increase</span>
                        </div>
                    </div>
                </div>
                
                <!-- Stats Card -->
                <div class="card bg-base-100 shadow-sm">
                    <div class="card-body">
                        <h2 class="card-title text-sm font-medium text-muted-foreground">Pending Tasks</h2>
                        <p class="text-2xl font-bold">{stats.pendingTasks}</p>
                        <div class="text-xs text-error flex items-center mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                            <span>2 overdue</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Data Table Section Example -->
            <div class="card bg-base-100 shadow-sm overflow-hidden">
                <div class="card-body p-0">
                    <div class="p-4 border-b flex justify-between items-center">
                        <h3 class="font-medium">Recent Items</h3>
                        <div class="flex gap-2">
                            <div class="join">
                                <input type="text" placeholder="Search..." class="input input-sm input-bordered join-item" />
                                <button class="btn btn-sm btn-neutral join-item">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                            </div>
                            <button class="btn btn-sm btn-outline">Filter</button>
                        </div>
                    </div>
                    
                    <div class="overflow-x-auto">
                        <table class="table table-zebra">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each appData as item (item.id)}
                                <tr>
                                    <td>{item.name}</td>
                                    <td>
                                        <span class="badge {item.status === 'Active' ? 'badge-success' : 
                                                          item.status === 'Pending' ? 'badge-warning' : 
                                                          'badge-error'}">
                                            {item.status}
                                        </span>
                                    </td>
                                    <td>{item.date}</td>
                                    <td>
                                        <div class="flex gap-2">
                                            <button class="btn btn-xs btn-outline" on:click={() => handleEdit(item.id)}>Edit</button>
                                            <button class="btn btn-xs btn-error btn-outline" on:click={() => handleDelete(item.id)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="p-4 border-t flex justify-between items-center">
                        <span class="text-sm text-muted-foreground">Showing 1-{appData.length} of {stats.totalItems} items</span>
                        <div class="join">
                            <button class="join-item btn btn-sm">«</button>
                            <button class="join-item btn btn-sm btn-active">1</button>
                            <button class="join-item btn btn-sm">2</button>
                            <button class="join-item btn btn-sm">3</button>
                            <button class="join-item btn btn-sm">»</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if} 