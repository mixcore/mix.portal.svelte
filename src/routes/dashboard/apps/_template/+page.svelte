<script lang="ts">
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { 
        Database, Plus, BarChart, FileText, Grid3X3, Settings, 
        Users, Clock, Filter, RefreshCw, Search, Download, ChevronDown,
        ExternalLink, MoreHorizontal, Info, AlertTriangle
    } from 'lucide-svelte';
    
    // Demo data
    const dashboardStats = [
        { title: 'Total Records', value: '1,234', change: '+12%', icon: Database, color: 'bg-blue-500' },
        { title: 'Templates', value: '25', change: '+5%', icon: FileText, color: 'bg-purple-500' },
        { title: 'Components', value: '86', change: '-2%', icon: Grid3X3, color: 'bg-amber-500' },
        { title: 'Active Users', value: '42', change: '+8%', icon: Users, color: 'bg-green-500' },
    ];
    
    // Sample chart data
    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        values: [25, 40, 30, 70, 50, 60]
    };
    
    // Recent activity data
    const recentActivities = [
        { id: 1, type: 'update', title: 'Database schema updated', user: 'John Doe', time: '10 min ago', icon: Database, status: 'success' },
        { id: 2, type: 'create', title: 'New template created', user: 'Jane Smith', time: '1 hour ago', icon: FileText, status: 'success' },
        { id: 3, type: 'error', title: 'Backup process failed', user: 'System', time: '2 hours ago', icon: AlertTriangle, status: 'error' },
        { id: 4, type: 'info', title: 'System maintenance scheduled', user: 'Admin', time: '3 hours ago', icon: Info, status: 'info' },
        { id: 5, type: 'create', title: 'New user registered', user: 'Registration Service', time: 'Yesterday', icon: Users, status: 'success' }
    ];
    
    // Quick actions
    const quickActions = [
        { id: 'create-record', label: 'Add Record', icon: Plus },
        { id: 'generate-report', label: 'Report', icon: BarChart },
        { id: 'update-template', label: 'Templates', icon: FileText },
        { id: 'system-backup', label: 'Backup', icon: Database }
    ];
    
    // Component state
    let isLoading = false;
    let activeFilter = 'all';
    let showInfoBanner = true;
    
    // Handle action clicks
    function handleActionClick(actionId: string) {
        console.log(`Action clicked: ${actionId}`);
        // In a real app, you would trigger the appropriate action here
    }
    
    // Handle filter change
    function setFilter(filter: string) {
        activeFilter = filter;
        // In a real app, you would filter data based on the selected filter
    }
    
    // Close info banner
    function closeInfoBanner() {
        showInfoBanner = false;
    }
    
    onMount(() => {
        // Initialize page-specific functionality here
    });
</script>

<div class="template-app-dashboard h-full overflow-auto flex flex-col">
    <!-- Info banner -->
    {#if showInfoBanner}
        <div class="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800 px-4 py-2 flex items-center justify-between">
            <div class="flex items-center gap-2">
                <Info size={16} class="text-blue-500" />
                <span class="text-sm text-blue-700 dark:text-blue-300">Welcome to the Template App! This is a starter template for creating mini-apps.</span>
            </div>
            <button class="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300" on:click={closeInfoBanner}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
        </div>
    {/if}
    
    <!-- Main content with padding -->
    <div class="flex-1 p-6">
        <!-- Page header with actions -->
        <div class="mb-6">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <h1 class="text-2xl font-bold">Dashboard</h1>
                
                <!-- Action buttons -->
                <div class="flex flex-wrap gap-2">
                    <div class="relative">
                        <button class="btn btn-outline btn-sm flex items-center gap-1">
                            <Filter size={14} />
                            <span>Filter</span>
                            <ChevronDown size={14} />
                        </button>
                    </div>
                    <button class="btn btn-outline btn-sm">
                        <RefreshCw size={14} />
                        <span class="ml-1 hidden sm:inline">Refresh</span>
                    </button>
                    <button class="btn btn-outline btn-sm">
                        <Download size={14} />
                        <span class="ml-1 hidden sm:inline">Export</span>
                    </button>
                    <button class="btn btn-primary btn-sm gap-1">
                        <Plus size={14} />
                        <span>New Item</span>
                    </button>
                </div>
            </div>
            
            <!-- Quick action buttons -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
                {#each quickActions as action}
                    <button 
                        class="flex flex-col items-center justify-center p-3 bg-white dark:bg-gray-800 rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors"
                        on:click={() => handleActionClick(action.id)}
                    >
                        <div class="p-2 rounded-full bg-primary/10 text-primary mb-2">
                            <svelte:component this={action.icon} size={18} />
                        </div>
                        <span class="text-sm">{action.label}</span>
                    </button>
                {/each}
            </div>
        </div>
        
        <!-- Stats section -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {#each dashboardStats as stat}
                <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                    <div class="p-3 rounded-full {stat.color} text-white">
                        <svelte:component this={stat.icon} size={24} />
                    </div>
                    <div>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">{stat.title}</p>
                        <div class="flex items-baseline gap-2">
                            <h3 class="text-2xl font-bold dark:text-white">{stat.value}</h3>
                            <span class={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                                {stat.change}
                            </span>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
        
        <!-- Main content grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Chart panel -->
            <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 col-span-2 shadow-sm">
                <div class="flex justify-between items-center mb-6">
                    <div>
                        <h2 class="text-lg font-semibold dark:text-white">Activity Overview</h2>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Activity trends over the last 6 months</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="flex rounded-md overflow-hidden">
                            <button 
                                class={`px-3 py-1 text-xs ${activeFilter === 'day' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                                on:click={() => setFilter('day')}
                            >
                                Day
                            </button>
                            <button 
                                class={`px-3 py-1 text-xs ${activeFilter === 'week' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                                on:click={() => setFilter('week')}
                            >
                                Week
                            </button>
                            <button 
                                class={`px-3 py-1 text-xs ${activeFilter === 'month' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                                on:click={() => setFilter('month')}
                            >
                                Month
                            </button>
                            <button 
                                class={`px-3 py-1 text-xs ${activeFilter === 'all' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                                on:click={() => setFilter('all')}
                            >
                                All
                            </button>
                        </div>
                        
                        <button class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                            <MoreHorizontal size={16} class="text-gray-500" />
                        </button>
                    </div>
                </div>
                
                <div class="h-64 flex items-center justify-center">
                    <!-- Chart placeholder with better styling -->
                    <div class="w-full h-full flex flex-col justify-end items-end">
                        <div class="w-full flex items-end justify-between h-56 px-2 relative">
                            <!-- Grid lines -->
                            <div class="absolute inset-0 flex flex-col justify-between">
                                {#each Array(5) as _, i}
                                    <div class="w-full border-t border-gray-100 dark:border-gray-700"></div>
                                {/each}
                            </div>
                            
                            <!-- Bars -->
                            {#each chartData.values as value, i}
                                <div class="z-10 flex flex-col items-center gap-2 relative">
                                    <div class="bg-primary/80 hover:bg-primary w-10 rounded-t-sm transition-all duration-200" style="height: {value * 0.7}px"></div>
                                    <span class="text-xs text-gray-500 dark:text-gray-400">{chartData.labels[i]}</span>
                                    
                                    <!-- Tooltip on hover -->
                                    <div class="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
                                        {value} records
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Recent activity panel -->
            <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
                <div class="flex justify-between items-center mb-4">
                    <div>
                        <h2 class="text-lg font-semibold dark:text-white">Recent Activity</h2>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Latest system activities</p>
                    </div>
                    <button class="text-xs text-primary hover:underline flex items-center gap-1">
                        <span>View All</span>
                        <ExternalLink size={12} />
                    </button>
                </div>
                
                <div class="space-y-4">
                    {#each recentActivities as activity}
                        <div class="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                            <div class="flex items-start gap-3">
                                <div class={`p-2 rounded-full ${
                                    activity.status === 'success' ? 'bg-green-100 text-green-500 dark:bg-green-900/30 dark:text-green-400' : 
                                    activity.status === 'error' ? 'bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400' : 
                                    'bg-blue-100 text-blue-500 dark:bg-blue-900/30 dark:text-blue-400'
                                }`}>
                                    <svelte:component this={activity.icon} size={14} />
                                </div>
                                <div>
                                    <p class="text-sm font-medium dark:text-white">{activity.title}</p>
                                    <div class="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        <span>{activity.user}</span>
                                        <span class="inline-block w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                                        <span class="flex items-center gap-1">
                                            <Clock size={10} />
                                            {activity.time}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    /* Dark mode support */
    :global(.dark) .template-app-dashboard {
        background-color: var(--base-300, #1e293b);
        color: var(--base-content, #f8fafc);
    }
    
    /* Add subtle hover effects */
    button {
        transition: all 0.2s ease;
    }
    
    /* Custom scrollbar for the dashboard */
    .template-app-dashboard {
        scrollbar-width: thin;
        scrollbar-color: rgba(var(--app-primary-rgb, 59, 130, 246), 0.2) transparent;
    }
</style> 