<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { authStore, isAuthenticated } from '$lib/stores/authStore';
    
    // Base API URL for all Mixcore requests
    const API_BASE_URL = 'https://mixcore.net';
    
    // Create a simple date formatter function
    function formatDate(dateString: string): string {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        const month = date.toLocaleString('default', { month: 'short' });
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month} ${day}, ${year}`;
    }
    
    // Import icons
    import { 
        Search, 
        Filter, 
        Plus, 
        MoreHorizontal, 
        Grid, 
        List,
        FileEdit,
        Trash2,
        EyeIcon,
        ArrowUpDown,
        AlertTriangle
    } from 'lucide-svelte';
    
    // Mixcore Post Content type
    interface PostContent {
        id: string;
        title: string;
        excerpt?: string;
        content: string;
        status: string;
        createdDateTime: string;
        createdBy: string;
        publishedDateTime?: string;
        image?: string; // API returns image instead of thumbnail
        template?: string;
        seoName?: string;
        seoTitle?: string;
        seoDescription?: string;
        seoKeywords?: string;
        source?: string;
        views?: number;
        type?: string;
        detailUrl?: string;
        postCategories?: string[];
        postTags?: string[];
        author?: {
            name: string;
            avatar: string;
        };
    }
    
    // State
    let loading = true;
    let error = '';
    let searchQuery = '';
    let selectedStatus = 'all';
    let viewMode = 'table'; // 'table' or 'grid'
    let selectedPosts: string[] = [];
    let sortField = 'publishedDateTime';
    let sortDirection = 'desc';
    
    // Pagination
    let currentPage = 1;
    let pageSize = 20;
    let totalItems = 0;
    let totalPages = 1;
    
    // Posts data
    let posts: PostContent[] = [];
    
    // Helper function to get auth headers for API requests
    function getAuthHeaders() {
        const token = localStorage.getItem('authToken') || '';
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        };
    }
    
    // Filter posts based on search query and status
    $: filteredPosts = posts
        .filter(post => 
            post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.seoKeywords?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.postCategories?.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase())) ||
            post.postTags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .filter(post => {
            if (selectedStatus === 'all') return true;
            if (selectedStatus === 'published') return post.status === 'Published';
            if (selectedStatus === 'draft') return post.status === 'Draft';
            return true;
        })
        .sort((a, b) => {
            // Handle different sort fields
            if (sortField === 'publishedDateTime' || sortField === 'createdDateTime') {
                const dateA = new Date(a[sortField] || a.createdDateTime);
                const dateB = new Date(b[sortField] || b.createdDateTime);
                return sortDirection === 'asc' 
                    ? dateA.getTime() - dateB.getTime() 
                    : dateB.getTime() - dateA.getTime();
            }
            
            if (sortField === 'title') {
                return sortDirection === 'asc'
                    ? (a.title || '').localeCompare(b.title || '')
                    : (b.title || '').localeCompare(a.title || '');
            }
            
            if (sortField === 'views') {
                return sortDirection === 'asc'
                    ? (a.views || 0) - (b.views || 0)
                    : (b.views || 0) - (a.views || 0);
            }
            
            return 0;
        });
    
    // Toggle all posts selection
    function toggleSelectAll(e: Event) {
        const target = e.target as HTMLInputElement;
        const checked = target?.checked || false;
        
        if (checked) {
            selectedPosts = filteredPosts.map(post => post.id);
        } else {
            selectedPosts = [];
        }
    }
    
    // Check if all posts are selected
    $: allSelected = filteredPosts.length > 0 && selectedPosts.length === filteredPosts.length;
    
    // Toggle individual post selection
    function toggleSelect(id: string) {
        if (selectedPosts.includes(id)) {
            selectedPosts = selectedPosts.filter(postId => postId !== id);
        } else {
            selectedPosts = [...selectedPosts, id];
        }
    }
    
    // Navigate to create new post page
    function handleCreatePost() {
        goto('/dashboard/posts/create');
    }
    
    // Navigate to edit post page
    function handleEditPost(id: string) {
        goto(`/dashboard/posts/${id}/edit`);
    }
    
    // Navigate to view post page
    function handleViewPost(id: string) {
        goto(`/dashboard/posts/${id}`);
    }
    
    // Delete post
    async function handleDeletePost(id: string) {
        try {
            // API call to delete post
            const response = await fetch(`${API_BASE_URL}/api/v2/rest/mix-portal/mix-post-content/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete post');
            }
            
            // Update local state
            posts = posts.filter(post => post.id !== id);
        } catch (err) {
            console.error('Error deleting post:', err);
            error = 'Failed to delete post. Please try again.';
        }
    }
    
    // Delete selected posts
    async function handleDeleteSelected() {
        try {
            // Delete each selected post individually
            const deletePromises = selectedPosts.map(id => 
                fetch(`${API_BASE_URL}/api/v2/rest/mix-portal/mix-post-content/${id}`, {
                    method: 'DELETE',
                    headers: getAuthHeaders()
                })
            );
            
            const results = await Promise.all(deletePromises);
            
            if (results.some(res => !res.ok)) {
                throw new Error('Some posts could not be deleted');
            }
            
            // Update local state
            posts = posts.filter(post => !selectedPosts.includes(post.id));
            selectedPosts = [];
        } catch (err) {
            console.error('Error deleting posts:', err);
            error = 'Failed to delete selected posts. Please try again.';
        }
    }
    
    // Update post status (publish/unpublish)
    async function handleUpdateStatus(ids: string[], status: string) {
        try {
            // Update each post individually
            const updatePromises = ids.map(id => {
                // First fetch the post
                return fetch(`${API_BASE_URL}/api/v2/rest/mix-portal/mix-post-content/${id}`, {
                    headers: getAuthHeaders()
                })
                    .then(res => res.json())
                    .then(post => {
                        // Then update with new status
                        const updatedPost = { ...post, status };
                        return fetch(`${API_BASE_URL}/api/v2/rest/mix-portal/mix-post-content/${id}`, {
                            method: 'PUT',
                            headers: getAuthHeaders(),
                            body: JSON.stringify(updatedPost)
                        });
                    });
            });
            
            const results = await Promise.all(updatePromises);
            
            if (results.some(res => !res.ok)) {
                throw new Error(`Failed to ${status === 'Published' ? 'publish' : 'unpublish'} some posts`);
            }
            
            // Update local state
            posts = posts.map(post => 
                ids.includes(post.id) ? { ...post, status } : post
            );
            
            selectedPosts = [];
        } catch (err) {
            console.error('Error updating post status:', err);
            error = `Failed to ${status === 'Published' ? 'publish' : 'unpublish'} posts. Please try again.`;
        }
    }
    
    // Change sort field
    function toggleSort(field: string) {
        if (sortField === field) {
            // Toggle direction
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            // New field, default to desc
            sortField = field;
            sortDirection = 'desc';
        }
    }
    
    // Fetch posts from Mixcore API
    async function fetchPosts() {
        loading = true;
        error = '';
        
        try {
            // In a real implementation you would fetch from your API
            const response = await fetch(`${API_BASE_URL}/api/v2/rest/mix-portal/mix-post-content/filter`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    pageSize: pageSize.toString(),
                    pageIndex: currentPage - 1,
                    status: selectedStatus === 'published' ? 'Published' : 
                           (selectedStatus === 'draft' ? 'Draft' : null),
                    sortBy: null,
                    direction: "Desc",
                    fromDate: null,
                    toDate: null,
                    keyword: searchQuery || "",
                    searchColumns: "title",
                    compareOperator: "Like",
                    conjunction: "Or",
                    culture: "en-us",
                    queries: [],
                    metadataQueries: [],
                    mixDatabaseName: ""
                })
            });
            
            if (!response.ok) {
                if (response.status === 401) {
                    // Handle unauthorized access
                    error = 'Session expired. Please log in again.';
                    goto('/auth/login?returnUrl=' + encodeURIComponent(window.location.pathname));
                    return;
                }
                throw new Error('Failed to fetch posts');
            }
            
            const data = await response.json();
            
            // Update pagination data
            totalItems = data.pagingData?.total || 0;
            totalPages = data.pagingData?.totalPage || 1;
            
            // Map API response to our PostContent structure
            posts = data.items.map((post: any) => ({
                id: post.id.toString(),
                title: post.title || 'Untitled',
                excerpt: post.content ? extractExcerpt(post.content) : '',
                content: post.content || '',
                status: post.status || 'Draft',
                createdDateTime: post.createdDateTime,
                createdBy: post.createdBy || 'Unknown',
                publishedDateTime: post.publishedDateTime || post.createdDateTime,
                image: post.image || '',
                template: post.template?.fileName || '',
                detailUrl: post.detailUrl || '',
                seoName: post.seoName || '',
                views: 0, // API doesn't provide views count
                postCategories: [], // API doesn't provide categories
                postTags: [], // API doesn't provide tags
                author: {
                    name: post.createdBy || 'Unknown',
                    avatar: '/avatars/default.png'
                }
            }));
        } catch (err) {
            console.error('Error fetching posts:', err);
            error = 'Failed to load posts. Please refresh the page.';
        } finally {
            loading = false;
        }
    }
    
    // Handle page change
    function handlePageChange(newPage: number) {
        if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
        currentPage = newPage;
        fetchPosts();
    }
    
    // Navigate to first, previous, next, or last page
    function goToFirstPage() {
        if (currentPage !== 1) {
            currentPage = 1;
            fetchPosts();
        }
    }
    
    function goToPreviousPage() {
        if (currentPage > 1) {
            currentPage--;
            fetchPosts();
        }
    }
    
    function goToNextPage() {
        if (currentPage < totalPages) {
            currentPage++;
            fetchPosts();
        }
    }
    
    function goToLastPage() {
        if (currentPage !== totalPages) {
            currentPage = totalPages;
            fetchPosts();
        }
    }
    
    // Helper function to extract excerpt from HTML content
    function extractExcerpt(htmlContent: string, maxLength: number = 150): string {
        // Remove HTML tags and extract the first few characters
        const plainText = htmlContent.replace(/<[^>]*>/g, '');
        if (plainText.length <= maxLength) return plainText;
        return plainText.substring(0, maxLength) + '...';
    }
    
    // Check authentication before loading
    $: if ($isAuthenticated === false) {
        goto('/auth/login?returnUrl=' + encodeURIComponent(window.location.pathname));
    }
    
    // Apply filters when search query or status changes
    $: {
        if (!loading && (searchQuery || selectedStatus !== 'all')) {
            fetchPosts();
        }
    }
    
    // Initialize data
    onMount(() => {
        if (!localStorage.getItem('authToken')) {
            goto('/auth/login?returnUrl=' + encodeURIComponent(window.location.pathname));
            return;
        }
        fetchPosts();
    });
</script>

<div class="container mx-auto p-4">
    <div class="mb-6">
        <h1 class="text-2xl font-bold">Posts</h1>
        <p class="text-gray-600">Create and manage your blog posts</p>
        <div class="mt-4">
            <button 
                class="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center" 
                on:click={handleCreatePost}
            >
                <svg class="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                New Post
            </button>
        </div>
    </div>
    
    {#if error}
        <div class="bg-red-100 border border-red-400 text-red-700 p-3 rounded-md mb-4 text-sm flex items-center">
            <svg class="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <span>{error}</span>
            <button 
                class="ml-auto text-sm" 
                on:click={() => error = ''}
            >
                Dismiss
            </button>
        </div>
    {/if}
    
    <!-- Search & filters -->
    <div class="mb-6 flex flex-col sm:flex-row gap-4">
        <div class="relative flex-1">
            <svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
                type="text"
                placeholder="Search posts..."
                class="w-full pl-10 p-2 border rounded-md"
                bind:value={searchQuery}
            />
        </div>
        
        <div class="flex items-center gap-4">
            <select bind:value={selectedStatus} class="p-2 border rounded-md">
                <option value="all">All posts</option>
                <option value="published">Published</option>
                <option value="draft">Drafts</option>
            </select>
            
            <div class="flex border rounded-md">
                <button 
                    class={viewMode === 'grid' ? 'bg-blue-600 text-white p-2 rounded-l-md' : 'bg-white p-2 rounded-l-md'}
                    on:click={() => viewMode = 'grid'}
                >
                    <Grid class="h-4 w-4" />
                </button>
                <button 
                    class={viewMode === 'table' ? 'bg-blue-600 text-white p-2 rounded-r-md' : 'bg-white p-2 rounded-r-md'}
                    on:click={() => viewMode = 'table'}
                >
                    <List class="h-4 w-4" />
                </button>
            </div>
        </div>
    </div>
    
    <!-- Selected items actions -->
    {#if selectedPosts.length > 0}
        <div class="bg-gray-100 p-3 mb-4 rounded-md flex items-center justify-between">
            <p class="text-sm">{selectedPosts.length} item{selectedPosts.length > 1 ? 's' : ''} selected</p>
            <div class="flex items-center gap-2">
                <button 
                    class="px-3 py-1 text-sm border rounded-md"
                    on:click={() => handleUpdateStatus(selectedPosts, 'Published')}
                >
                    Publish
                </button>
                <button 
                    class="px-3 py-1 text-sm border rounded-md"
                    on:click={() => handleUpdateStatus(selectedPosts, 'Draft')}
                >
                    Unpublish
                </button>
                <button 
                    class="px-3 py-1 text-sm bg-red-600 text-white rounded-md flex items-center"
                    on:click={handleDeleteSelected}
                >
                    <Trash2 class="h-4 w-4 mr-1" />
                    Delete
                </button>
            </div>
        </div>
    {/if}
    
    <!-- Table view -->
    {#if viewMode === 'table'}
        <div class="border rounded-md overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="p-4 w-12">
                            <input 
                                type="checkbox" 
                                checked={allSelected} 
                                on:change={toggleSelectAll}
                                aria-label="Select all posts"
                                class="rounded"
                            />
                        </th>
                        <th class="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <button class="flex items-center" on:click={() => toggleSort('title')}>
                                Title 
                                <ArrowUpDown class="ml-2 h-3 w-3" />
                            </button>
                        </th>
                        <th class="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th class="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <button class="flex items-center" on:click={() => toggleSort('publishedDateTime')}>
                                Date 
                                <ArrowUpDown class="ml-2 h-3 w-3" />
                            </button>
                        </th>
                        <th class="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                        <th class="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categories</th>
                        <th class="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <button class="flex items-center" on:click={() => toggleSort('views')}>
                                Views 
                                <ArrowUpDown class="ml-2 h-3 w-3" />
                            </button>
                        </th>
                        <th class="p-4 w-12"></th>
                    </tr>
                </thead>
                
                <tbody class="bg-white divide-y divide-gray-200">
                    {#if loading}
                        {#each Array(5) as _}
                            <tr>
                                {#each Array(8) as _}
                                    <td class="p-4 animate-pulse">
                                        <div class="bg-gray-200 h-6 rounded-md" />
                                    </td>
                                {/each}
                            </tr>
                        {/each}
                    {:else if filteredPosts.length === 0}
                        <tr>
                            <td colspan="8" class="h-24 text-center p-4">
                                No posts found.
                            </td>
                        </tr>
                    {:else}
                        {#each filteredPosts as post (post.id)}
                            <tr class="cursor-pointer hover:bg-gray-50" on:dblclick={() => handleEditPost(post.id)}>
                                <td class="p-4">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedPosts.includes(post.id)} 
                                        on:change={() => toggleSelect(post.id)}
                                        aria-label={`Select ${post.title}`}
                                        on:click={(e) => e.stopPropagation()}
                                        class="rounded"
                                    />
                                </td>
                                <td class="p-4">
                                    <div class="flex items-start gap-3">
                                        {#if post.image}
                                            <img src={post.image} alt={post.title} class="w-10 h-10 object-cover rounded" />
                                        {/if}
                                        <div>
                                            <div class="font-medium truncate max-w-xs">
                                                {post.title || 'Untitled'}
                                            </div>
                                            <div class="text-xs text-gray-500 truncate max-w-xs">
                                                {post.excerpt || ''}
                                            </div>
                                            {#if post.template === 'featured'}
                                                <span class="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100">
                                                    Featured
                                                </span>
                                            {/if}
                                        </div>
                                    </div>
                                </td>
                                <td class="p-4">
                                    <span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${post.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {post.status || 'Draft'}
                                    </span>
                                </td>
                                <td class="p-4">
                                    {post.publishedDateTime ? formatDate(post.publishedDateTime) : (post.createdDateTime ? formatDate(post.createdDateTime) : 'N/A')}
                                </td>
                                <td class="p-4">
                                    <div class="flex items-center gap-2">
                                        <div class="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                                            {(post.createdBy || 'U').substring(0, 2).toUpperCase()}
                                        </div>
                                        <span class="text-sm">{post.createdBy || 'Unknown'}</span>
                                    </div>
                                </td>
                                <td class="p-4">
                                    <div class="flex flex-wrap gap-1">
                                        {#if post.postCategories && post.postCategories.length > 0}
                                            {#each post.postCategories.slice(0, 2) as category}
                                                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100">
                                                    {category}
                                                </span>
                                            {/each}
                                            {#if post.postCategories.length > 2}
                                                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100">
                                                    +{post.postCategories.length - 2}
                                                </span>
                                            {/if}
                                        {:else}
                                            <span class="text-xs text-gray-400">None</span>
                                        {/if}
                                    </div>
                                </td>
                                <td class="p-4">{post.views?.toLocaleString() || '0'}</td>
                                <td class="p-4">
                                    <div class="relative group">
                                        <button class="p-1 rounded-full hover:bg-gray-100">
                                            <MoreHorizontal class="h-4 w-4" />
                                        </button>
                                        <div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block z-10">
                                            <div class="py-1">
                                                <button class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center" on:click={() => handleViewPost(post.id)}>
                                                    <EyeIcon class="h-4 w-4 mr-2" />
                                                    View
                                                </button>
                                                <button class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center" on:click={() => handleEditPost(post.id)}>
                                                    <FileEdit class="h-4 w-4 mr-2" />
                                                    Edit
                                                </button>
                                                <button class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center" on:click={() => handleDeletePost(post.id)}>
                                                    <Trash2 class="h-4 w-4 mr-2" />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        {/each}
                    {/if}
                </tbody>
            </table>
        </div>
        
        <!-- Pagination for table view -->
        {#if !loading && filteredPosts.length > 0}
            <div class="flex items-center justify-between mt-4 px-2">
                <div class="text-sm text-gray-700">
                    Showing <span class="font-medium">{Math.min((currentPage - 1) * pageSize + 1, totalItems)}</span> to <span class="font-medium">{Math.min(currentPage * pageSize, totalItems)}</span> of <span class="font-medium">{totalItems}</span> results
                </div>
                <nav class="flex items-center space-x-2" aria-label="Pagination">
                    <button 
                        class="p-2 rounded-md border text-gray-500 {currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}"
                        on:click={goToFirstPage}
                        disabled={currentPage === 1}
                        aria-label="Go to first page"
                    >
                        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                    </button>
                    <button 
                        class="p-2 rounded-md border text-gray-500 {currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}"
                        on:click={goToPreviousPage}
                        disabled={currentPage === 1}
                        aria-label="Previous page"
                    >
                        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                    </button>
                    
                    <!-- Page number buttons -->
                    {#if totalPages <= 7}
                        {#each Array(totalPages) as _, i}
                            <button 
                                class="px-3 py-1 rounded-md text-sm {currentPage === i + 1 ? 'bg-blue-600 text-white' : 'border text-gray-700 hover:bg-gray-50'}"
                                on:click={() => handlePageChange(i + 1)}
                            >
                                {i + 1}
                            </button>
                        {/each}
                    {:else}
                        <!-- First page -->
                        <button 
                            class="px-3 py-1 rounded-md text-sm {currentPage === 1 ? 'bg-blue-600 text-white' : 'border text-gray-700 hover:bg-gray-50'}"
                            on:click={() => handlePageChange(1)}
                        >
                            1
                        </button>
                        
                        <!-- Ellipsis or second page -->
                        {#if currentPage > 3}
                            <span class="px-2 py-1">...</span>
                        {:else}
                            <button 
                                class="px-3 py-1 rounded-md text-sm {currentPage === 2 ? 'bg-blue-600 text-white' : 'border text-gray-700 hover:bg-gray-50'}"
                                on:click={() => handlePageChange(2)}
                            >
                                2
                            </button>
                        {/if}
                        
                        <!-- Current page range -->
                        {#each Array(Math.min(5, totalPages)).filter((_,i) => {
                            const pageNum = i + Math.max(2, currentPage - 2);
                            return pageNum > 2 && pageNum < totalPages - 1;
                        }) as _, i}
                            {@const pageNum = i + Math.max(2, currentPage - 2)}
                            <button 
                                class="px-3 py-1 rounded-md text-sm {currentPage === pageNum ? 'bg-blue-600 text-white' : 'border text-gray-700 hover:bg-gray-50'}"
                                on:click={() => handlePageChange(pageNum)}
                            >
                                {pageNum}
                            </button>
                        {/each}
                        
                        <!-- Ellipsis or second-to-last page -->
                        {#if currentPage < totalPages - 2}
                            <span class="px-2 py-1">...</span>
                        {:else}
                            <button 
                                class="px-3 py-1 rounded-md text-sm {currentPage === totalPages - 1 ? 'bg-blue-600 text-white' : 'border text-gray-700 hover:bg-gray-50'}"
                                on:click={() => handlePageChange(totalPages - 1)}
                            >
                                {totalPages - 1}
                            </button>
                        {/if}
                        
                        <!-- Last page -->
                        <button 
                            class="px-3 py-1 rounded-md text-sm {currentPage === totalPages ? 'bg-blue-600 text-white' : 'border text-gray-700 hover:bg-gray-50'}"
                            on:click={() => handlePageChange(totalPages)}
                        >
                            {totalPages}
                        </button>
                    {/if}
                    
                    <button 
                        class="p-2 rounded-md border text-gray-500 {currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}"
                        on:click={goToNextPage}
                        disabled={currentPage === totalPages}
                        aria-label="Next page"
                    >
                        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10l-3.293-3.293a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                        </svg>
                    </button>
                    <button 
                        class="p-2 rounded-md border text-gray-500 {currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}"
                        on:click={goToLastPage}
                        disabled={currentPage === totalPages}
                        aria-label="Go to last page"
                    >
                        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                        </svg>
                    </button>
                </nav>
            </div>
        {/if}
    {:else}
        <!-- Grid view -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#if loading}
                {#each Array(6) as _}
                    <div class="border rounded-md p-4 animate-pulse">
                        <div class="flex items-center justify-between mb-3">
                            <div class="bg-gray-200 h-6 w-1/2 rounded-md" />
                            <div class="bg-gray-200 h-6 w-8 rounded-md" />
                        </div>
                        <div class="bg-gray-200 h-16 rounded-md mb-3" />
                        <div class="flex items-center justify-between">
                            <div class="bg-gray-200 h-8 w-24 rounded-md" />
                            <div class="bg-gray-200 h-8 w-8 rounded-md" />
                        </div>
                    </div>
                {/each}
            {:else if filteredPosts.length === 0}
                <div class="col-span-3 py-12 text-center">
                    <h3 class="text-lg font-medium">No posts found</h3>
                    <p class="text-gray-500 mt-1">Try adjusting your search or filter</p>
                </div>
            {:else}
                {#each filteredPosts as post (post.id)}
                    <div class="border rounded-md overflow-hidden group hover:shadow-md transition-shadow">
                        {#if post.image}
                            <div class="h-40 overflow-hidden">
                                <img src={post.image} alt={post.title} class="w-full h-full object-cover" />
                            </div>
                        {/if}
                        <div class="p-5">
                            <div class="flex items-start gap-2 mb-2">
                                <input 
                                    type="checkbox" 
                                    checked={selectedPosts.includes(post.id)} 
                                    on:change={() => toggleSelect(post.id)}
                                    aria-label={`Select ${post.title}`}
                                    class="mt-1 rounded"
                                />
                                <div class="flex-1">
                                    <h3 class="font-medium truncate">{post.title || 'Untitled'}</h3>
                                    <p class="text-sm text-gray-500 line-clamp-2 mb-2">{post.excerpt || ''}</p>
                                    <div class="flex items-center gap-2 text-xs text-gray-500">
                                        <span class={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${post.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {post.status || 'Draft'}
                                        </span>
                                        {post.publishedDateTime ? formatDate(post.publishedDateTime) : (post.createdDateTime ? formatDate(post.createdDateTime) : 'N/A')}
                                    </div>
                                </div>
                            </div>
                            
                            <div class="flex flex-wrap gap-1 my-3">
                                {#if post.postCategories && post.postCategories.length > 0}
                                    {#each post.postCategories as category}
                                        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100">
                                            {category}
                                        </span>
                                    {/each}
                                {:else}
                                    <span class="text-xs text-gray-400">No categories</span>
                                {/if}
                            </div>
                            
                            <div class="flex items-center justify-between mt-4">
                                <div class="flex items-center gap-2">
                                    <div class="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                                        {(post.createdBy || 'U').substring(0, 2).toUpperCase()}
                                    </div>
                                    <span class="text-xs">{post.createdBy || 'Unknown'}</span>
                                </div>
                                <div class="flex opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button class="p-1 rounded-full hover:bg-gray-100" on:click={() => handleViewPost(post.id)}>
                                        <EyeIcon class="h-4 w-4" />
                                    </button>
                                    <button class="p-1 rounded-full hover:bg-gray-100" on:click={() => handleEditPost(post.id)}>
                                        <FileEdit class="h-4 w-4" />
                                    </button>
                                    <button class="p-1 rounded-full hover:bg-gray-100" on:click={() => handleDeletePost(post.id)}>
                                        <Trash2 class="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                {/each}
            {/if}
        </div>
        
        <!-- Pagination for grid view -->
        {#if !loading && filteredPosts.length > 0}
            <div class="flex items-center justify-between mt-6 px-2">
                <div class="text-sm text-gray-700">
                    Showing <span class="font-medium">{Math.min((currentPage - 1) * pageSize + 1, totalItems)}</span> to <span class="font-medium">{Math.min(currentPage * pageSize, totalItems)}</span> of <span class="font-medium">{totalItems}</span> results
                </div>
                <nav class="flex items-center space-x-2" aria-label="Pagination">
                    <button 
                        class="p-2 rounded-md border text-gray-500 {currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}"
                        on:click={goToFirstPage}
                        disabled={currentPage === 1}
                        aria-label="Go to first page"
                    >
                        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                    </button>
                    <button 
                        class="p-2 rounded-md border text-gray-500 {currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}"
                        on:click={goToPreviousPage}
                        disabled={currentPage === 1}
                        aria-label="Previous page"
                    >
                        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                    </button>
                    
                    <!-- Page number buttons - simplified for grid view -->
                    {#if totalPages <= 5}
                        {#each Array(totalPages) as _, i}
                            <button 
                                class="px-3 py-1 rounded-md text-sm {currentPage === i + 1 ? 'bg-blue-600 text-white' : 'border text-gray-700 hover:bg-gray-50'}"
                                on:click={() => handlePageChange(i + 1)}
                            >
                                {i + 1}
                            </button>
                        {/each}
                    {:else}
                        <!-- First page -->
                        <button 
                            class="px-3 py-1 rounded-md text-sm {currentPage === 1 ? 'bg-blue-600 text-white' : 'border text-gray-700 hover:bg-gray-50'}"
                            on:click={() => handlePageChange(1)}
                        >
                            1
                        </button>
                        
                        <!-- Ellipsis or page numbers -->
                        {#if currentPage > 3}
                            <span class="px-2 py-1">...</span>
                        {/if}
                        
                        <!-- Current page (if not first or last) -->
                        {#if currentPage > 1 && currentPage < totalPages}
                            <button 
                                class="px-3 py-1 rounded-md text-sm bg-blue-600 text-white"
                            >
                                {currentPage}
                            </button>
                        {/if}
                        
                        <!-- Ellipsis or page numbers -->
                        {#if currentPage < totalPages - 2}
                            <span class="px-2 py-1">...</span>
                        {/if}
                        
                        <!-- Last page -->
                        <button 
                            class="px-3 py-1 rounded-md text-sm {currentPage === totalPages ? 'bg-blue-600 text-white' : 'border text-gray-700 hover:bg-gray-50'}"
                            on:click={() => handlePageChange(totalPages)}
                        >
                            {totalPages}
                        </button>
                    {/if}
                    
                    <button 
                        class="p-2 rounded-md border text-gray-500 {currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}"
                        on:click={goToNextPage}
                        disabled={currentPage === totalPages}
                        aria-label="Next page"
                    >
                        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10l-3.293-3.293a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                        </svg>
                    </button>
                    <button 
                        class="p-2 rounded-md border text-gray-500 {currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}"
                        on:click={goToLastPage}
                        disabled={currentPage === totalPages}
                        aria-label="Go to last page"
                    >
                        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                        </svg>
                    </button>
                </nav>
            </div>
        {/if}
    {/if}
</div> 