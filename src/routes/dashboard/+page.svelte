<script lang="ts">
    import { page } from '$app/stores';
    import { Home, Database, FileText, Layout, Users, Settings, MessageSquare } from 'lucide-svelte';
    
    // Demo stats data
    const stats = [
        { title: 'Total Pages', count: 24, icon: Layout, change: '+12%', color: 'bg-blue-500' },
        { title: 'Total Posts', count: 128, icon: FileText, change: '+5%', color: 'bg-green-500' },
        { title: 'Active Users', count: 38, icon: Users, change: '+8%', color: 'bg-purple-500' },
        { title: 'Mini Apps', count: 12, icon: Database, change: '+2%', color: 'bg-amber-500' }
    ];
    
    // Recent activity
    const activity = [
        { type: 'edit', item: 'Homepage', user: 'John Doe', time: '5 minutes ago' },
        { type: 'create', item: 'New Blog Post', user: 'Jane Smith', time: '1 hour ago' },
        { type: 'comment', item: 'Product Review', user: 'Alice Johnson', time: '3 hours ago' },
        { type: 'settings', item: 'System Settings', user: 'Admin', time: '1 day ago' },
        { type: 'upload', item: 'New Media Files', user: 'Bob Martin', time: '2 days ago' }
    ];
</script>

<div class="container mx-auto p-6">
    <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold">Dashboard</h1>
        <div class="flex gap-2">
            <button class="btn btn-outline btn-sm">Export</button>
            <button class="btn btn-primary btn-sm">New Item</button>
        </div>
    </div>
    
    <!-- Stats grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {#each stats as stat}
            <div class="bg-card rounded-lg shadow p-6 flex items-center space-x-4">
                <div class="flex-shrink-0">
                    <div class="p-3 rounded-full {stat.color} text-white">
                        <svelte:component this={stat.icon} size={24} />
                    </div>
                </div>
                <div>
                    <p class="text-sm text-muted-foreground">{stat.title}</p>
                    <div class="flex items-baseline space-x-2">
                        <h3 class="text-2xl font-bold">{stat.count}</h3>
                        <span class="text-xs font-semibold text-green-500">{stat.change}</span>
                    </div>
                </div>
            </div>
        {/each}
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main chart section -->
        <div class="bg-card rounded-lg shadow p-6 lg:col-span-2">
            <h2 class="text-xl font-semibold mb-4">Activity Overview</h2>
            <!-- Placeholder for chart -->
            <div class="h-[300px] bg-muted/20 rounded flex items-center justify-center">
                <p class="text-muted-foreground">Activity Chart Placeholder</p>
            </div>
        </div>
        
        <!-- Recent activity section -->
        <div class="bg-card rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold mb-4">Recent Activity</h2>
            <div class="space-y-4">
                {#each activity as item}
                    <div class="flex items-start space-x-3 pb-3 border-b last:border-0">
                        <div class="p-2 rounded-full bg-muted">
                            <svelte:component this={
                                item.type === 'edit' ? FileText :
                                item.type === 'create' ? Layout :
                                item.type === 'comment' ? MessageSquare :
                                item.type === 'settings' ? Settings :
                                Home
                            } size={16} />
                        </div>
                        <div>
                            <p class="text-sm font-medium">{item.item}</p>
                            <div class="text-xs text-muted-foreground flex items-center gap-2">
                                <span>{item.user}</span>
                                <span class="inline-block w-1 h-1 rounded-full bg-muted-foreground"></span>
                                <span>{item.time}</span>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div> 