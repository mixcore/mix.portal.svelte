<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    
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
    import { Separator } from '$lib/components/ui/separator';
    import {
        Drawer,
        DrawerContent,
        DrawerDescription,
        DrawerFooter,
        DrawerHeader,
        DrawerTitle,
        DrawerTrigger,
    } from '$lib/components/ui/drawer';
    import {
        Dialog,
        DialogContent,
        DialogDescription,
        DialogFooter,
        DialogHeader,
        DialogTitle,
        DialogTrigger,
    } from '$lib/components/ui/dialog';
    import {
        DropdownMenu,
        DropdownMenuContent,
        DropdownMenuItem,
        DropdownMenuLabel,
        DropdownMenuSeparator,
        DropdownMenuTrigger,
    } from '$lib/components/ui/dropdown-menu';
    import PageHeader from '$lib/components/shared/PageHeader.svelte';
    import PageContainer from '$lib/components/layout/PageContainer.svelte';
    import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
    import { 
        ChevronLeft, 
        BookOpen, 
        Eye, 
        Settings, 
        Save, 
        Trash2, 
        Share, 
        Calendar, 
        MoreVertical
    } from 'lucide-svelte';
    
    // Types
    interface Post {
        id: string;
        title: string;
        excerpt: string;
        content: string;
        published: boolean;
        publishDate: string;
        author: {
            name: string;
            avatar: string;
        };
        categories: string[];
        tags: string[];
        featured: boolean;
        views: number;
        featuredImage?: string;
        seo: {
            title: string;
            description: string;
            keywords: string;
            ogImage?: string;
        };
    }
    
    // Get the post ID from the route
    const postId = $page.params.id;
    
    // State
    let loading = true;
    let saving = false;
    let post: Post | null = null;
    let selectedTab = 'content';
    let showSettingsDrawer = false;
    let showDeleteDialog = false;
    
    // Form values
    let title = '';
    let content = '';
    let excerpt = '';
    let published = false;
    let publishDate = '';
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
            // Update post object with form values
            if (post) {
                post.title = title;
                post.content = content;
                post.excerpt = excerpt;
                post.published = published;
                post.publishDate = publishDate;
                post.featured = featured;
                post.categories = categories;
                post.tags = tags;
                post.seo = {
                    title: seoTitle,
                    description: seoDescription,
                    keywords: seoKeywords,
                    ogImage: post.seo.ogImage
                };
                
                // In a real app, we would send this to the API
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Success message or redirect
                goto('/dashboard/posts');
            }
        } catch (error) {
            console.error('Error saving post:', error);
        } finally {
            saving = false;
        }
    }
    
    // Delete the post
    async function handleDelete() {
        try {
            // In a real app, we would send this to the API
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Redirect to posts list
            goto('/dashboard/posts');
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    }
    
    // Load post data
    onMount(async () => {
        try {
            // In a real app, we would fetch from the API
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Mock data
            const mockPosts = [
                {
                    id: '1',
                    title: 'Getting Started with Mixcore CMS',
                    excerpt: 'Learn how to set up your first Mixcore CMS website in minutes.',
                    content: `
# Getting Started with Mixcore CMS

Mixcore CMS is a powerful, open-source content management system that makes it easy to build
websites, blogs, and applications. This guide will walk you through the basics of setting up
your first Mixcore CMS website.

## Installation

Setting up Mixcore CMS is straightforward:

1. Clone the repository
2. Configure your database
3. Run the setup wizard
4. Start creating content

## Key Features

- **Flexible Content Management**: Create and manage content with ease
- **Powerful API**: Build custom applications with the robust API
- **Modular Design**: Extend functionality with plugins and modules
- **Modern Architecture**: Built with the latest web technologies
                    `,
                    published: true,
                    publishDate: '2023-08-15T10:30:00Z',
                    author: {
                        name: 'John Doe',
                        avatar: '/avatars/john-doe.png'
                    },
                    categories: ['Tutorials', 'CMS'],
                    tags: ['beginner', 'setup', 'mixcore'],
                    featured: true,
                    views: 1250,
                    featuredImage: '/images/posts/getting-started.jpg',
                    seo: {
                        title: 'Getting Started with Mixcore CMS - A Complete Guide',
                        description: 'Learn how to set up your first Mixcore CMS website in minutes with this comprehensive guide for beginners.',
                        keywords: 'mixcore, cms, getting started, setup, tutorial, beginners guide',
                        ogImage: '/images/posts/getting-started-og.jpg'
                    }
                },
                {
                    id: '2',
                    title: 'Advanced Content Management Techniques',
                    excerpt: 'Take your content strategy to the next level with these advanced techniques.',
                    content: `
# Advanced Content Management Techniques

Once you've mastered the basics of Mixcore CMS, it's time to explore advanced content management techniques.
This guide covers sophisticated strategies that will help you optimize your workflow and enhance your website.

## Content Modeling

Learn how to create complex content models that reflect your business needs:

- Custom fields and taxonomies
- Relationships between content types
- Advanced metadata management

## Workflow Optimization

Streamline your content production process:

- Editorial workflows
- Approval processes
- Scheduled publishing
- Content versioning
                    `,
                    published: true,
                    publishDate: '2023-08-10T14:45:00Z',
                    author: {
                        name: 'Jane Smith',
                        avatar: '/avatars/jane-smith.png'
                    },
                    categories: ['Content Strategy', 'Advanced'],
                    tags: ['advanced', 'content', 'strategy'],
                    featured: false,
                    views: 842,
                    featuredImage: '/images/posts/advanced-cms.jpg',
                    seo: {
                        title: 'Advanced Content Management Techniques for Mixcore CMS',
                        description: 'Master sophisticated content management strategies to optimize your Mixcore CMS website.',
                        keywords: 'advanced mixcore, content strategy, content modeling, workflow optimization',
                        ogImage: '/images/posts/advanced-cms-og.jpg'
                    }
                },
                {
                    id: '3',
                    title: 'Improving Website Performance',
                    excerpt: 'Tips and tricks to optimize your website for better performance.',
                    content: `
# Improving Website Performance

Website performance is critical for user experience and SEO. This guide explores various
techniques to optimize your Mixcore CMS website for maximum speed and efficiency.

## Caching Strategies

Implement effective caching to reduce server load:

- Page caching
- Object caching
- CDN integration

## Asset Optimization

Optimize your website assets:

- Image compression
- CSS and JavaScript minification
- Lazy loading
                    `,
                    published: false,
                    publishDate: '2023-08-05T09:15:00Z',
                    author: {
                        name: 'Mike Johnson',
                        avatar: '/avatars/mike-johnson.png'
                    },
                    categories: ['Performance', 'Optimization'],
                    tags: ['speed', 'performance', 'optimization'],
                    featured: false,
                    views: 567,
                    featuredImage: '/images/posts/website-performance.jpg',
                    seo: {
                        title: 'Improving Website Performance in Mixcore CMS',
                        description: 'Learn how to optimize your Mixcore CMS website for better performance and faster loading times.',
                        keywords: 'website performance, optimization, speed, caching, asset optimization',
                        ogImage: '/images/posts/website-performance-og.jpg'
                    }
                }
            ];
            
            // Find the post by ID
            post = mockPosts.find(p => p.id === postId) || null;
            
            if (post) {
                // Initialize form values
                title = post.title;
                content = post.content;
                excerpt = post.excerpt;
                published = post.published;
                publishDate = post.publishDate;
                featured = post.featured;
                categories = [...post.categories];
                tags = [...post.tags];
                seoTitle = post.seo.title;
                seoDescription = post.seo.description;
                seoKeywords = post.seo.keywords;
            }
        } catch (error) {
            console.error('Error loading post:', error);
        } finally {
            loading = false;
        }
    });
</script>

<PageContainer loading={loading}>
    {#if post}
        <PageHeader
            title={title || 'Untitled Post'}
            description={excerpt}
            backLink="/dashboard/posts"
        >
            <svelte:fragment slot="actions">
                <div class="flex items-center gap-2">
                    <!-- Preview button -->
                    <Button variant="outline" size="sm">
                        <Eye class="h-4 w-4 mr-2" />
                        Preview
                    </Button>
                    
                    <!-- Settings drawer trigger -->
                    <Button variant="outline" size="sm" on:click={() => showSettingsDrawer = true}>
                        <Settings class="h-4 w-4 mr-2" />
                        Settings
                    </Button>
                    
                    <!-- Save button -->
                    <Button on:click={handleSave} disabled={saving}>
                        <Save class="h-4 w-4 mr-2" />
                        {saving ? 'Saving...' : 'Save'}
                    </Button>
                    
                    <!-- Actions dropdown -->
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreVertical class="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem on:click={() => window.open(`/blog/${post.id}`, '_blank')}>
                                <Eye class="h-4 w-4 mr-2" />
                                View live
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Share class="h-4 w-4 mr-2" />
                                Share
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                                class="text-destructive focus:text-destructive"
                                on:click={() => showDeleteDialog = true}
                            >
                                <Trash2 class="h-4 w-4 mr-2" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </svelte:fragment>
        </PageHeader>
        
        <!-- Content tabs -->
        <Tabs value={selectedTab} onValueChange={(val) => selectedTab = val} class="mt-6">
            <TabsList>
                <TabsTrigger value="content">
                    <BookOpen class="h-4 w-4 mr-2" />
                    Content
                </TabsTrigger>
                <TabsTrigger value="seo">
                    <svg class="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                    </svg>
                    SEO
                </TabsTrigger>
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
                            <Input 
                                id="seoTitle" 
                                bind:value={seoTitle} 
                                placeholder="Enter SEO title" 
                                class="mt-2" 
                            />
                            <p class="text-xs text-muted-foreground mt-1">
                                {seoTitle.length} characters (Recommended: 50-60)
                            </p>
                        </div>
                        
                        <div>
                            <Label for="seoDescription" class="text-base">Meta Description</Label>
                            <Textarea 
                                id="seoDescription" 
                                bind:value={seoDescription} 
                                placeholder="Enter meta description" 
                                class="mt-2" 
                            />
                            <p class="text-xs text-muted-foreground mt-1">
                                {seoDescription.length} characters (Recommended: 140-160)
                            </p>
                        </div>
                        
                        <div>
                            <Label for="seoKeywords" class="text-base">Keywords</Label>
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
                                {#if post.seo.ogImage}
                                    <img 
                                        src={post.seo.ogImage} 
                                        alt="OpenGraph preview" 
                                        class="object-cover w-full h-full rounded-md" 
                                    />
                                {:else}
                                    <div class="text-muted-foreground text-sm">No featured image</div>
                                {/if}
                            </div>
                            <h3 class="font-medium line-clamp-1">{seoTitle || title}</h3>
                            <p class="text-sm text-muted-foreground line-clamp-2 mt-1">{seoDescription || excerpt}</p>
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
                                    {published ? 'This post is visible to readers' : 'This post is a draft'}
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
                            
                            <!-- Author info -->
                            <div>
                                <h3 class="text-sm font-medium mb-2">Author</h3>
                                <div class="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={post.author.avatar} alt={post.author.name} />
                                        <AvatarFallback>
                                            {post.author.name.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p class="text-sm font-medium">{post.author.name}</p>
                                        <p class="text-xs text-muted-foreground">Author</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <DrawerFooter>
                        <Button on:click={() => showSettingsDrawer = false}>Apply Settings</Button>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
        
        <!-- Delete confirmation dialog -->
        <Dialog open={showDeleteDialog} onOpenChange={(open) => showDeleteDialog = open}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure you want to delete this post?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete the post
                        and remove it from your website.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter class="flex items-center gap-2 justify-end">
                    <Button variant="outline" on:click={() => showDeleteDialog = false}>
                        Cancel
                    </Button>
                    <Button variant="destructive" on:click={handleDelete}>
                        <Trash2 class="h-4 w-4 mr-2" />
                        Delete Post
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    {:else if !loading}
        <div class="flex flex-col items-center justify-center py-12 text-center">
            <div class="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h2 class="text-xl font-semibold mb-2">Post Not Found</h2>
            <p class="text-muted-foreground mb-6">
                The post you're looking for doesn't exist or has been deleted.
            </p>
            <Button on:click={() => goto('/dashboard/posts')}>
                <ChevronLeft class="h-4 w-4 mr-2" />
                Back to Posts
            </Button>
        </div>
    {/if}
</PageContainer> 