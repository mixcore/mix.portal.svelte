<script lang="ts">
    import { page } from '$app/stores';
    import { Database, Layout, FileText, Settings, BarChart, Grid, ShoppingCart } from 'lucide-svelte';
    
    // List of available mini-apps
    // In a real app, these would be loaded from an API or config
    const miniApps = [
        {
            id: 'template',
            name: 'Template App',
            description: 'A starter template for creating mini-apps',
            icon: Database,
            category: 'Development',
            color: 'bg-blue-500',
            version: '1.0.0',
            author: 'Mixcore Team',
            path: '/dashboard/apps/template'
        },
        {
            id: 'mixdb',
            name: 'MixDB',
            description: 'Powerful database management and exploration',
            icon: Database,
            category: 'Data',
            color: 'bg-purple-500',
            version: '2.1.0',
            author: 'Mixcore Team',
            path: '/dashboard/apps/mixdb'
        },
        {
            id: 'cms',
            name: 'Content Manager',
            description: 'Advanced content management and editing',
            icon: FileText,
            category: 'Content',
            color: 'bg-green-500',
            version: '3.0.1',
            author: 'Mixcore Team',
            path: '/dashboard/apps/cms'
        },
        {
            id: 'design',
            name: 'Design Studio',
            description: 'Visual design and theme customization',
            icon: Layout,
            category: 'Design',
            color: 'bg-yellow-500',
            version: '1.5.0',
            author: 'Mixcore Team',
            path: '/dashboard/apps/design'
        },
        {
            id: 'analytics',
            name: 'Analytics',
            description: 'Insights and performance tracking',
            icon: BarChart,
            category: 'Business',
            color: 'bg-red-500',
            version: '2.0.0',
            author: 'Mixcore Team',
            path: '/dashboard/apps/analytics'
        },
        {
            id: 'ecommerce',
            name: 'E-Commerce',
            description: 'Products, orders, and customer management',
            icon: ShoppingCart,
            category: 'Business',
            color: 'bg-teal-500',
            version: '1.2.0',
            author: 'Mixcore Team',
            path: '/dashboard/apps/ecommerce'
        }
    ];
    
    // Filter and sort functions
    let searchQuery = '';
    let selectedCategory: string | null = null;
    let sortBy: 'name' | 'category' | 'recent' = 'name';
    
    $: categories = [...new Set(miniApps.map(app => app.category))];
    
    $: filteredApps = miniApps.filter(app => {
        // Filter by search
        const matchesSearch = searchQuery === '' ||
            app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.description.toLowerCase().includes(searchQuery.toLowerCase());
            
        // Filter by category
        const matchesCategory = selectedCategory === null || app.category === selectedCategory;
        
        return matchesSearch && matchesCategory;
    });
    
    $: sortedApps = [...filteredApps].sort((a, b) => {
        if (sortBy === 'name') {
            return a.name.localeCompare(b.name);
        } else if (sortBy === 'category') {
            return a.category.localeCompare(b.category);
        } else {
            // For 'recent', we would typically use access timestamp
            // Here we just use the name in reverse as a placeholder
            return b.name.localeCompare(a.name);
        }
    });
</script>

<div class="container mx-auto p-6">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
            <h1 class="text-3xl font-bold">Mini Apps</h1>
            <p class="text-muted-foreground">Discover and launch mini-applications for Mixcore</p>
        </div>
        
        <div class="flex flex-col sm:flex-row gap-3">
            <div class="relative">
                <input 
                    type="text" 
                    placeholder="Search apps..." 
                    class="input input-bordered w-full min-w-[200px]"
                    bind:value={searchQuery}
                />
            </div>
            
            <select 
                class="select select-bordered"
                bind:value={selectedCategory}
            >
                <option value={null}>All Categories</option>
                {#each categories as category}
                    <option value={category}>{category}</option>
                {/each}
            </select>
            
            <select 
                class="select select-bordered"
                bind:value={sortBy}
            >
                <option value="name">Sort by Name</option>
                <option value="category">Sort by Category</option>
                <option value="recent">Sort by Recent</option>
            </select>
        </div>
    </div>
    
    <!-- Apps grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each sortedApps as app}
            <a 
                href={app.path}
                class="group bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-all hover:border-primary/30 flex flex-col"
            >
                <div class="p-6 flex gap-4 items-start">
                    <div class={`p-3 rounded-lg ${app.color} text-white`}>
                        <svelte:component this={app.icon} size={24} />
                    </div>
                    
                    <div class="flex-1">
                        <div class="flex justify-between items-start">
                            <h2 class="text-xl font-semibold group-hover:text-primary transition-colors">
                                {app.name}
                            </h2>
                            <span class="text-xs px-2 py-1 rounded-full bg-muted/50">v{app.version}</span>
                        </div>
                        <p class="text-muted-foreground mt-1">{app.description}</p>
                    </div>
                </div>
                
                <div class="mt-auto p-4 border-t flex justify-between items-center text-sm text-muted-foreground">
                    <span>{app.category}</span>
                    <span>{app.author}</span>
                </div>
            </a>
        {/each}
        
        {#if sortedApps.length === 0}
            <div class="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <div class="p-4 rounded-full bg-muted mb-4">
                    <Grid size={32} class="text-muted-foreground" />
                </div>
                <h3 class="text-xl font-medium">No apps found</h3>
                <p class="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
        {/if}
    </div>
</div> 