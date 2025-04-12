<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    
    // Components
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';
    import { Label } from '$lib/components/ui/label';
    import { Textarea } from '$lib/components/ui/textarea';
    import { Switch } from '$lib/components/ui/switch';
    import { Badge } from '$lib/components/ui/badge';
    import {
        Card,
        CardContent,
        CardDescription,
        CardFooter,
        CardHeader,
        CardTitle,
    } from '$lib/components/ui/card';
    import {
        Select,
        SelectContent,
        SelectItem,
        SelectTrigger,
        SelectValue,
    } from '$lib/components/ui/select';
    import {
        Tabs,
        TabsContent,
        TabsList,
        TabsTrigger,
    } from '$lib/components/ui/tabs';
    import {
        Drawer,
        DrawerContent,
        DrawerDescription,
        DrawerFooter,
        DrawerHeader,
        DrawerTitle,
        DrawerTrigger,
    } from '$lib/components/ui/drawer';
    import PageHeader from '$lib/components/shared/PageHeader.svelte';
    import PageContainer from '$lib/components/layout/PageContainer.svelte';
    import { Eye, Settings, Save } from 'lucide-svelte';
    
    // State
    let loading = false;
    let saving = false;
    let selectedTab = 'content';
    let showSettingsDrawer = false;
    
    // Form values
    let title = '';
    let content = '';
    let excerpt = '';
    let published = false;
    let publishDate = new Date().toISOString().slice(0, 16);
    let featured = false;
    let categories: string[] = [];
    let tags: string[] = [];
    let seoTitle = '';
    let seoDescription = '';
    let seoKeywords = '';
    
    // All available categories and tags for select dropdowns
    const availableCategories = [
        'Tutorials', 'CMS', 'Content Strategy', 'Advanced', 
        'Performance', 'Optimization', 'SEO', 'Marketing',
        'Design', 'Themes', 'Development', 'Plugins'
    ];
    
    const availableTags = [
        'beginner', 'setup', 'mixcore', 'advanced', 'content',
        'strategy', 'speed', 'performance', 'optimization',
        'seo', 'marketing', '2023', 'design', 'customization',
        'branding', 'tutorial', 'guide', 'how-to'
    ];
    
    // Save the post
    async function handleSave() {
        saving = true;
        
        try {
            // Create new post object
            const newPost = {
                id: Math.random().toString(36).substring(2, 12),
                title,
                content,
                excerpt,
                published,
                publishDate,
                featured,
                categories,
                tags,
                author: {
                    name: 'Current User',
                    avatar: '/avatars/default.png'
                },
                views: 0,
                seo: {
                    title: seoTitle || title,
                    description: seoDescription || excerpt,
                    keywords: seoKeywords
                }
            };
            
            // In a real app, we would send this to the API
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Success message or redirect
            goto('/dashboard/posts');
        } catch (error) {
            console.error('Error creating post:', error);
        } finally {
            saving = false;
        }
    }
</script>

<PageContainer loading={loading}>
    <PageHeader
        title={title || 'New Post'}
        description="Create a new post for your website"
        backLink="/dashboard/posts"
    >
        <svelte:fragment slot="actions">
            <div class="flex items-center gap-2">
                <!-- Preview button (disabled until saved) -->
                <Button variant="outline" size="sm" disabled>
                    <Eye class="h-4 w-4 mr-2" />
                    Preview
                </Button>
                
                <!-- Settings drawer trigger -->
                <Button variant="outline" size="sm" on:click={() => showSettingsDrawer = true}>
                    <Settings class="h-4 w-4 mr-2" />
                    Settings
                </Button>
                
                <!-- Save button -->
                <Button on:click={handleSave} disabled={saving || !title.trim()}>
                    <Save class="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save'}
                </Button>
            </div>
        </svelte:fragment>
    </PageHeader>
    
    <!-- Content tabs -->
    <Tabs value={selectedTab} onValueChange={(val) => selectedTab = val} class="mt-6">
        <TabsList>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>
        
        <!-- Content tab -->
        <TabsContent value="content" class="space-y-4">
            <div class="grid grid-cols-1 gap-6">
                <!-- Title -->
                <div>
                    <Label for="title" class="text-base font-medium">Title</Label>
                    <Input 
                        id="title" 
                        bind:value={title} 
                        placeholder="Enter post title" 
                        class="text-lg mt-2" 
                    />
                </div>
                
                <!-- Content -->
                <div>
                    <Label for="content" class="text-base font-medium">Content</Label>
                    <div class="mt-1 text-xs text-muted-foreground mb-2">
                        Supports Markdown formatting
                    </div>
                    <Textarea 
                        id="content" 
                        bind:value={content} 
                        placeholder="Write your post content here..." 
                        class="mt-2 min-h-[400px]" 
                    />
                </div>
                
                <!-- Excerpt -->
                <div>
                    <Label for="excerpt" class="text-base font-medium">Excerpt</Label>
                    <div class="mt-1 text-xs text-muted-foreground mb-2">
                        A short summary that appears in search results and post listings
                    </div>
                    <Textarea 
                        id="excerpt" 
                        bind:value={excerpt} 
                        placeholder="Enter a short summary of your post..." 
                        class="mt-2" 
                    />
                </div>
            </div>
        </TabsContent>
        
        <!-- SEO tab -->
        <TabsContent value="seo" class="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Search Engine Optimization</CardTitle>
                    <CardDescription>Optimize your post for search engines</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                    <div>
                        <Label for="seoTitle" class="text-base">SEO Title</Label>
                        <div class="mt-1 text-xs text-muted-foreground mb-2">
                            Appears in search engine results and browser tabs
                        </div>
                        <Input 
                            id="seoTitle" 
                            bind:value={seoTitle} 
                            placeholder="Enter SEO title or leave blank to use post title" 
                            class="mt-2" 
                        />
                        <p class="text-xs text-muted-foreground mt-1">
                            {seoTitle.length} characters (Recommended: 50-60)
                        </p>
                    </div>
                    
                    <div>
                        <Label for="seoDescription" class="text-base">Meta Description</Label>
                        <div class="mt-1 text-xs text-muted-foreground mb-2">
                            A summary that appears in search engine results
                        </div>
                        <Textarea 
                            id="seoDescription" 
                            bind:value={seoDescription} 
                            placeholder="Enter meta description or leave blank to use post excerpt" 
                            class="mt-2" 
                        />
                        <p class="text-xs text-muted-foreground mt-1">
                            {seoDescription.length} characters (Recommended: 140-160)
                        </p>
                    </div>
                    
                    <div>
                        <Label for="seoKeywords" class="text-base">Keywords</Label>
                        <div class="mt-1 text-xs text-muted-foreground mb-2">
                            Keywords help search engines understand your content
                        </div>
                        <Input 
                            id="seoKeywords" 
                            bind:value={seoKeywords} 
                            placeholder="keyword1, keyword2, keyword3" 
                            class="mt-2" 
                        />
                        <p class="text-xs text-muted-foreground mt-1">
                            Separate keywords with commas
                        </p>
                    </div>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>Social Media Preview</CardTitle>
                    <CardDescription>How your post will appear when shared on social media</CardDescription>
                </CardHeader>
                <CardContent>
                    <div class="border rounded-md p-4">
                        <div class="aspect-video bg-muted rounded-md mb-3 flex items-center justify-center">
                            <div class="text-muted-foreground text-sm">No featured image</div>
                        </div>
                        <h3 class="font-medium line-clamp-1">{seoTitle || title || 'Your post title'}</h3>
                        <p class="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {seoDescription || excerpt || 'Your post description will appear here'}
                        </p>
                        <p class="text-xs text-muted-foreground mt-2">yourdomain.com</p>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    </Tabs>
    
    <!-- Settings drawer -->
    <Drawer open={showSettingsDrawer} onClose={() => showSettingsDrawer = false}>
        <DrawerContent>
            <div class="mx-auto w-full max-w-sm">
                <DrawerHeader>
                    <DrawerTitle>Post Settings</DrawerTitle>
                    <DrawerDescription>Configure post metadata and publishing options</DrawerDescription>
                </DrawerHeader>
                
                <div class="p-4 pb-0">
                    <div class="space-y-6">
                        <!-- Status -->
                        <div>
                            <h3 class="text-sm font-medium mb-2">Status</h3>
                            <div class="flex items-center justify-between">
                                <Label for="published" class="cursor-pointer">Published</Label>
                                <Switch id="published" bind:checked={published} />
                            </div>
                            <p class="text-xs text-muted-foreground mt-1">
                                {published ? 'This post will be visible to readers' : 'This post will be saved as a draft'}
                            </p>
                        </div>
                        
                        <!-- Publish date -->
                        <div>
                            <h3 class="text-sm font-medium mb-2">Publish Date</h3>
                            <div class="flex items-center gap-2">
                                <Input
                                    type="datetime-local"
                                    bind:value={publishDate}
                                />
                            </div>
                        </div>
                        
                        <!-- Categories -->
                        <div>
                            <h3 class="text-sm font-medium mb-2">Categories</h3>
                            <div class="flex flex-wrap gap-2 mb-2">
                                {#each categories as category}
                                    <Badge variant="secondary" class="flex items-center gap-1">
                                        {category}
                                        <button 
                                            class="ml-1 h-4 w-4 rounded-full flex items-center justify-center hover:bg-destructive/20"
                                            on:click={() => categories = categories.filter(c => c !== category)}
                                        >
                                            &times;
                                        </button>
                                    </Badge>
                                {/each}
                                {#if categories.length === 0}
                                    <span class="text-xs text-muted-foreground">No categories selected</span>
                                {/if}
                            </div>
                            <Select
                                onValueChange={(value) => {
                                    if (!categories.includes(value)) {
                                        categories = [...categories, value];
                                    }
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Add category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {#each availableCategories.filter(c => !categories.includes(c)) as category}
                                        <SelectItem value={category}>{category}</SelectItem>
                                    {/each}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <!-- Tags -->
                        <div>
                            <h3 class="text-sm font-medium mb-2">Tags</h3>
                            <div class="flex flex-wrap gap-2 mb-2">
                                {#each tags as tag}
                                    <Badge variant="outline" class="flex items-center gap-1">
                                        {tag}
                                        <button 
                                            class="ml-1 h-4 w-4 rounded-full flex items-center justify-center hover:bg-destructive/20"
                                            on:click={() => tags = tags.filter(t => t !== tag)}
                                        >
                                            &times;
                                        </button>
                                    </Badge>
                                {/each}
                                {#if tags.length === 0}
                                    <span class="text-xs text-muted-foreground">No tags added</span>
                                {/if}
                            </div>
                            <Select
                                onValueChange={(value) => {
                                    if (!tags.includes(value)) {
                                        tags = [...tags, value];
                                    }
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Add tag" />
                                </SelectTrigger>
                                <SelectContent>
                                    {#each availableTags.filter(t => !tags.includes(t)) as tag}
                                        <SelectItem value={tag}>{tag}</SelectItem>
                                    {/each}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <!-- Featured -->
                        <div>
                            <h3 class="text-sm font-medium mb-2">Featured Post</h3>
                            <div class="flex items-center justify-between">
                                <Label for="featured" class="cursor-pointer">Featured</Label>
                                <Switch id="featured" bind:checked={featured} />
                            </div>
                            <p class="text-xs text-muted-foreground mt-1">
                                {featured ? 'This post will be highlighted on your site' : 'This post will display normally'}
                            </p>
                        </div>
                    </div>
                </div>
                
                <DrawerFooter>
                    <Button on:click={() => showSettingsDrawer = false}>Apply Settings</Button>
                </DrawerFooter>
            </div>
        </DrawerContent>
    </Drawer>
</PageContainer> 