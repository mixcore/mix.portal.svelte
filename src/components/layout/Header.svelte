<script lang="ts">
    import { page } from '$app/stores';
    import { cn } from '$lib/utils';
    import { onMount, createEventDispatcher } from 'svelte';
    import { fade, scale, slide } from 'svelte/transition';
    import { 
        Search, 
        Bell, 
        User, 
        Moon, 
        Sun, 
        Menu, 
        X,
        ChevronDown,
        Settings,
        LogOut,
        HelpCircle,
        PanelLeft,
        Keyboard,
        Command,
        Clock,
        Home,
        MessageSquare,
        ChevronRight,
        CheckCircle
    } from 'lucide-svelte';
    import type { AppContext } from '$lib/stores/navigationStore';
    import DropdownMenu from '$lib/components/ui/dropdown/DropdownMenu.svelte';

    // Props
    export let isDarkMode: boolean;
    export let isMobileMenuOpen: boolean;
    export let activeContext: {id: string, name: string, icon: any, isChanging?: boolean};
    export let appContexts: {id: string, name: string, icon: any}[];
    export let condensed: boolean = false; // When true, use a constrained layout
    
    // Function props (events)
    export let toggleTheme: () => void;
    export let toggleMobileMenu: () => void;
    export let setContext: (contextId: AppContext) => void;
    
    // User props
    export let userFullName = 'John Doe';
    export let userEmail = 'john.doe@example.com';
    export let userInitials = 'JD';
    export let userAvatar = '';
    export let isAuthenticated = false;
    
    // Local state
    let isSearchOpen = false;
    let isContextMenuOpen = false;
    let isNotificationsOpen = false;
    let isUserMenuOpen = false;
    let searchQuery = '';
    let searchResults: any[] = [];
    let isSearching = false;
    let headerElement: HTMLElement;
    let showHeaderShadow = false;
    let userRole = 'Administrator';
    
    // Mock notifications
    const notifications = [
        { id: 1, title: 'New comment', message: 'Jane Doe commented on your post', time: '2 min ago', read: false, type: 'comment' },
        { id: 2, title: 'System update', message: 'Mixcore CMS has been updated to version 2.0.0', time: '1 hour ago', read: false, type: 'system' },
        { id: 3, title: 'Server notice', message: 'Server maintenance scheduled for tomorrow', time: '3 hours ago', read: true, type: 'alert' },
        { id: 4, title: 'New user', message: 'A new user has registered', time: '1 day ago', read: true, type: 'user' }
    ];
    
    // Create event dispatcher
    const dispatch = createEventDispatcher<{
        search: string;
        contextChange: AppContext;
        userAction: string;
        notificationRead: number;
        keyboardShortcutsOpen: void;
    }>();

    // Listen to scroll to add shadow on header when scrolled
    onMount(() => {
        const handleScroll = () => {
            if (!headerElement) return;
            showHeaderShadow = window.scrollY > 0;
        };
        
        window.addEventListener('scroll', handleScroll);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    });
    
    // Toggle search dialog
    function handleSearchToggle() {
        isSearchOpen = !isSearchOpen;
        if (isSearchOpen) {
            // Focus search input when opened
            setTimeout(() => {
                const searchInput = document.getElementById('global-search-input');
                if (searchInput) searchInput.focus();
            }, 100);
        }
    }
    
    // Handle search
    function handleSearch() {
        if (!searchQuery.trim()) return;
        isSearching = true;
        
        // Mock search results - in a real app, this would be an API call
        setTimeout(() => {
            searchResults = [
                { id: 1, title: 'Dashboard', type: 'page', url: '/' },
                { id: 2, title: 'User Management', type: 'page', url: '/users' },
                { id: 3, title: 'Site Settings', type: 'settings', url: '/settings' }
            ].filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));
            isSearching = false;
        }, 500);
        
        dispatch('search', searchQuery);
    }
    
    // Handle keyboard shortcut
    function handleKeyboardShortcut(event: KeyboardEvent) {
        // Cmd/Ctrl + K to open search
        if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
            event.preventDefault();
            handleSearchToggle();
        }
        // Esc to close search
        if (event.key === 'Escape' && isSearchOpen) {
            event.preventDefault();
            isSearchOpen = false;
        }
    }
    
    // Set app context
    function handleContextChange(contextId: AppContext) {
        setContext(contextId);
        isContextMenuOpen = false;
        dispatch('contextChange', contextId);
    }
    
    // Handle user menu item click
    function handleUserMenuAction(action: string) {
        isUserMenuOpen = false;
        dispatch('userAction', action);
    }
    
    // Mark notification as read
    function markNotificationAsRead(id: number) {
        // Update notifications in a real app
        // Here we're just updating the UI
        const index = notifications.findIndex(n => n.id === id);
        if (index !== -1) {
            notifications[index].read = true;
            dispatch('notificationRead', id);
        }
    }
    
    // Handle keyboard shortcuts dialog
    function openKeyboardShortcuts() {
        dispatch('keyboardShortcutsOpen');
    }
    
    // Watch for key events
    function handleKeydown(event: KeyboardEvent) {
        handleKeyboardShortcut(event);
    }
    
    // Close the context menu
    function closeContextMenu() {
        isContextMenuOpen = false;
    }
    
    // Close the notifications
    function closeNotifications() {
        isNotificationsOpen = false;
    }
    
    // Close the user menu
    function closeUserMenu() {
        isUserMenuOpen = false;
    }
</script>

<svelte:window on:keydown={handleKeydown} />

<header 
    class={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200",
        showHeaderShadow && "shadow-sm"
    )}
    bind:this={headerElement}
>
    <div class={cn(
        "flex h-14 items-center px-4",
        condensed && "container max-w-7xl mx-auto"
    )}>
        <!-- Mobile menu button -->
        <div class="mr-4 flex md:hidden">
            <button 
                type="button"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
                on:click={toggleMobileMenu}
                class="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
                {#if isMobileMenuOpen}
                    <div in:scale={{duration: 200}}>
                        <X class="h-5 w-5" aria-hidden="true" />
                    </div>
                {:else}
                    <div in:scale={{duration: 200}}>
                        <Menu class="h-5 w-5" aria-hidden="true" />
                    </div>
                {/if}
                <span class="sr-only">{isMobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
            </button>
        </div>
        
        <!-- Main navigation section -->
        <div class="flex-1 flex items-center justify-between">
            <!-- Left side - App context & breadcrumbs -->
            <div class="flex items-center">
                <!-- App Context Selector -->
                <div class="relative">
                    <button 
                        type="button" 
                        id="app-context-button"
                        aria-haspopup="true"
                        aria-expanded={isContextMenuOpen}
                        on:click={() => isContextMenuOpen = !isContextMenuOpen}
                        class={cn(
                            "inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium",
                            "ring-offset-background transition-colors",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                            "disabled:pointer-events-none disabled:opacity-50",
                            "hover:bg-accent hover:text-accent-foreground",
                            "border border-input bg-background shadow-sm",
                            isContextMenuOpen && "bg-accent text-accent-foreground"
                        )}
                    >
                        <svelte:component this={activeContext.icon} class="mr-2 h-4 w-4" aria-hidden="true" />
                        <span>{activeContext.name}</span>
                        <ChevronDown class={cn("ml-2 h-4 w-4 transition-transform", isContextMenuOpen && "rotate-180")} aria-hidden="true" />
                    </button>
                    
                    <!-- App Context Mega Dropdown Menu -->
                    {#if isContextMenuOpen}
                    <div
                        class="absolute left-0 z-50 mt-2 w-screen max-w-4xl rounded-md border bg-popover p-4 shadow-lg"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="app-context-button"
                        transition:slide={{ duration: 150 }}
                    >
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <!-- Finance Apps -->
                            <div>
                                <h3 class="font-medium text-sm mb-2 text-primary">Finance</h3>
                                <div class="space-y-1">
                                    <a href="/finance/accounting" class="flex items-center text-sm px-2 py-1.5 rounded-md hover:bg-accent">
                                        <span class="h-6 w-6 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center mr-2">A</span>
                                        <div>
                                            <span class="block font-medium">Accounting</span>
                                            <span class="block text-xs text-muted-foreground">Manage company finances</span>
                                        </div>
                                    </a>
                                    <a href="/finance/invoicing" class="flex items-center text-sm px-2 py-1.5 rounded-md hover:bg-accent">
                                        <span class="h-6 w-6 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center mr-2">I</span>
                                        <div>
                                            <span class="block font-medium">Invoicing</span>
                                            <span class="block text-xs text-muted-foreground">Create and send invoices</span>
                                        </div>
                                    </a>
                                    <a href="/finance/expenses" class="flex items-center text-sm px-2 py-1.5 rounded-md hover:bg-accent">
                                        <span class="h-6 w-6 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center mr-2">E</span>
                                        <div>
                                            <span class="block font-medium">Expenses</span>
                                            <span class="block text-xs text-muted-foreground">Track and manage expenses</span>
                                        </div>
                                    </a>
                                </div>
                            </div>
                            
                            <!-- Sales Apps -->
                            <div>
                                <h3 class="font-medium text-sm mb-2 text-primary">Sales</h3>
                                <div class="space-y-1">
                                    <a href="/sales/crm" class="flex items-center text-sm px-2 py-1.5 rounded-md hover:bg-accent">
                                        <span class="h-6 w-6 rounded-md bg-green-100 text-green-600 flex items-center justify-center mr-2">C</span>
                                        <div>
                                            <span class="block font-medium">CRM</span>
                                            <span class="block text-xs text-muted-foreground">Customer relationship management</span>
                                        </div>
                                    </a>
                                    <a href="/sales/point-of-sale" class="flex items-center text-sm px-2 py-1.5 rounded-md hover:bg-accent">
                                        <span class="h-6 w-6 rounded-md bg-green-100 text-green-600 flex items-center justify-center mr-2">P</span>
                                        <div>
                                            <span class="block font-medium">Point of Sale</span>
                                            <span class="block text-xs text-muted-foreground">In-store sales system</span>
                                        </div>
                                    </a>
                                    <a href="/sales/ecommerce" class="flex items-center text-sm px-2 py-1.5 rounded-md hover:bg-accent">
                                        <span class="h-6 w-6 rounded-md bg-green-100 text-green-600 flex items-center justify-center mr-2">E</span>
                                        <div>
                                            <span class="block font-medium">Ecommerce</span>
                                            <span class="block text-xs text-muted-foreground">Online store management</span>
                                        </div>
                                    </a>
                                </div>
                            </div>
                            
                            <!-- Websites Apps -->
                            <div>
                                <h3 class="font-medium text-sm mb-2 text-primary">Websites</h3>
                                <div class="space-y-1">
                                    <a href="/websites/cms" class="flex items-center text-sm px-2 py-1.5 rounded-md hover:bg-accent">
                                        <span class="h-6 w-6 rounded-md bg-purple-100 text-purple-600 flex items-center justify-center mr-2">C</span>
                                        <div>
                                            <span class="block font-medium">Content Management</span>
                                            <span class="block text-xs text-muted-foreground">Manage website content</span>
                                        </div>
                                    </a>
                                    <a href="/websites/blog" class="flex items-center text-sm px-2 py-1.5 rounded-md hover:bg-accent">
                                        <span class="h-6 w-6 rounded-md bg-purple-100 text-purple-600 flex items-center justify-center mr-2">B</span>
                                        <div>
                                            <span class="block font-medium">Blog</span>
                                            <span class="block text-xs text-muted-foreground">Publish articles and posts</span>
                                        </div>
                                    </a>
                                    <a href="/websites/forums" class="flex items-center text-sm px-2 py-1.5 rounded-md hover:bg-accent">
                                        <span class="h-6 w-6 rounded-md bg-purple-100 text-purple-600 flex items-center justify-center mr-2">F</span>
                                        <div>
                                            <span class="block font-medium">Forums</span>
                                            <span class="block text-xs text-muted-foreground">Community discussion boards</span>
                                        </div>
                                    </a>
                                </div>
                            </div>
                            
                            <!-- Supply Chain Apps -->
                            <div>
                                <h3 class="font-medium text-sm mb-2 text-primary">Supply Chain</h3>
                                <div class="space-y-1">
                                    <a href="/supply-chain/inventory" class="flex items-center text-sm px-2 py-1.5 rounded-md hover:bg-accent">
                                        <span class="h-6 w-6 rounded-md bg-amber-100 text-amber-600 flex items-center justify-center mr-2">I</span>
                                        <div>
                                            <span class="block font-medium">Inventory</span>
                                            <span class="block text-xs text-muted-foreground">Stock management system</span>
                                        </div>
                                    </a>
                                    <a href="/supply-chain/purchasing" class="flex items-center text-sm px-2 py-1.5 rounded-md hover:bg-accent">
                                        <span class="h-6 w-6 rounded-md bg-amber-100 text-amber-600 flex items-center justify-center mr-2">P</span>
                                        <div>
                                            <span class="block font-medium">Purchasing</span>
                                            <span class="block text-xs text-muted-foreground">Order and procurement</span>
                                        </div>
                                    </a>
                                    <a href="/supply-chain/manufacturing" class="flex items-center text-sm px-2 py-1.5 rounded-md hover:bg-accent">
                                        <span class="h-6 w-6 rounded-md bg-amber-100 text-amber-600 flex items-center justify-center mr-2">M</span>
                                        <div>
                                            <span class="block font-medium">Manufacturing</span>
                                            <span class="block text-xs text-muted-foreground">Production management</span>
                                        </div>
                                    </a>
                                </div>
                            </div>
                            
                            <!-- Human Resources Apps -->
                            <div>
                                <h3 class="font-medium text-sm mb-2 text-primary">Human Resources</h3>
                                <div class="space-y-1">
                                    <a href="/hr/recruitment" class="flex items-center text-sm px-2 py-1.5 rounded-md hover:bg-accent">
                                        <span class="h-6 w-6 rounded-md bg-pink-100 text-pink-600 flex items-center justify-center mr-2">R</span>
                                        <div>
                                            <span class="block font-medium">Recruitment</span>
                                            <span class="block text-xs text-muted-foreground">Hiring and applicant tracking</span>
                                        </div>
                                    </a>
                                    <a href="/hr/employees" class="flex items-center text-sm px-2 py-1.5 rounded-md hover:bg-accent">
                                        <span class="h-6 w-6 rounded-md bg-pink-100 text-pink-600 flex items-center justify-center mr-2">E</span>
                                        <div>
                                            <span class="block font-medium">Employees</span>
                                            <span class="block text-xs text-muted-foreground">Staff management</span>
                                        </div>
                                    </a>
                                    <a href="/hr/time-off" class="flex items-center text-sm px-2 py-1.5 rounded-md hover:bg-accent">
                                        <span class="h-6 w-6 rounded-md bg-pink-100 text-pink-600 flex items-center justify-center mr-2">T</span>
                                        <div>
                                            <span class="block font-medium">Time Off</span>
                                            <span class="block text-xs text-muted-foreground">Leave management</span>
                                        </div>
                                    </a>
                                </div>
                            </div>
                            
                            <!-- Marketing Apps -->
                            <div>
                                <h3 class="font-medium text-sm mb-2 text-primary">Marketing</h3>
                                <div class="space-y-1">
                                    <a href="/marketing/email" class="flex items-center text-sm px-2 py-1.5 rounded-md hover:bg-accent">
                                        <span class="h-6 w-6 rounded-md bg-red-100 text-red-600 flex items-center justify-center mr-2">E</span>
                                        <div>
                                            <span class="block font-medium">Email Marketing</span>
                                            <span class="block text-xs text-muted-foreground">Campaign management</span>
                                        </div>
                                    </a>
                                    <a href="/marketing/social" class="flex items-center text-sm px-2 py-1.5 rounded-md hover:bg-accent">
                                        <span class="h-6 w-6 rounded-md bg-red-100 text-red-600 flex items-center justify-center mr-2">S</span>
                                        <div>
                                            <span class="block font-medium">Social Media</span>
                                            <span class="block text-xs text-muted-foreground">Manage social accounts</span>
                                        </div>
                                    </a>
                                    <a href="/marketing/seo" class="flex items-center text-sm px-2 py-1.5 rounded-md hover:bg-accent">
                                        <span class="h-6 w-6 rounded-md bg-red-100 text-red-600 flex items-center justify-center mr-2">S</span>
                                        <div>
                                            <span class="block font-medium">SEO</span>
                                            <span class="block text-xs text-muted-foreground">Search engine optimization</span>
                                        </div>
                                    </a>
                                </div>
                            </div>
                            
                            <!-- Services Apps -->
                            <div>
                                <h3 class="font-medium text-sm mb-2 text-primary">Services</h3>
                                <div class="space-y-1">
                                    <a href="/services/projects" class="flex items-center text-sm px-2 py-1.5 rounded-md hover:bg-accent">
                                        <span class="h-6 w-6 rounded-md bg-indigo-100 text-indigo-600 flex items-center justify-center mr-2">P</span>
                                        <div>
                                            <span class="block font-medium">Project Management</span>
                                            <span class="block text-xs text-muted-foreground">Track and manage projects</span>
                                        </div>
                                    </a>
                                    <a href="/services/helpdesk" class="flex items-center text-sm px-2 py-1.5 rounded-md hover:bg-accent">
                                        <span class="h-6 w-6 rounded-md bg-indigo-100 text-indigo-600 flex items-center justify-center mr-2">H</span>
                                        <div>
                                            <span class="block font-medium">Helpdesk</span>
                                            <span class="block text-xs text-muted-foreground">Customer support system</span>
                                        </div>
                                    </a>
                                    <a href="/services/appointments" class="flex items-center text-sm px-2 py-1.5 rounded-md hover:bg-accent">
                                        <span class="h-6 w-6 rounded-md bg-indigo-100 text-indigo-600 flex items-center justify-center mr-2">A</span>
                                        <div>
                                            <span class="block font-medium">Appointments</span>
                                            <span class="block text-xs text-muted-foreground">Scheduling system</span>
                                        </div>
                                    </a>
                                </div>
                            </div>
                            
                            <!-- Productivity Apps -->
                            <div>
                                <h3 class="font-medium text-sm mb-2 text-primary">Productivity</h3>
                                <div class="space-y-1">
                                    <a href="/productivity/documents" class="flex items-center text-sm px-2 py-1.5 rounded-md hover:bg-accent">
                                        <span class="h-6 w-6 rounded-md bg-teal-100 text-teal-600 flex items-center justify-center mr-2">D</span>
                                        <div>
                                            <span class="block font-medium">Documents</span>
                                            <span class="block text-xs text-muted-foreground">Collaborative editing</span>
                                        </div>
                                    </a>
                                    <a href="/productivity/chat" class="flex items-center text-sm px-2 py-1.5 rounded-md hover:bg-accent">
                                        <span class="h-6 w-6 rounded-md bg-teal-100 text-teal-600 flex items-center justify-center mr-2">C</span>
                                        <div>
                                            <span class="block font-medium">Chat</span>
                                            <span class="block text-xs text-muted-foreground">Team messaging</span>
                                        </div>
                                    </a>
                                    <a href="/productivity/tasks" class="flex items-center text-sm px-2 py-1.5 rounded-md hover:bg-accent">
                                        <span class="h-6 w-6 rounded-md bg-teal-100 text-teal-600 flex items-center justify-center mr-2">T</span>
                                        <div>
                                            <span class="block font-medium">Tasks</span>
                                            <span class="block text-xs text-muted-foreground">To-do and task management</span>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Call to action at the bottom -->
                        <div class="mt-6 border-t pt-4 text-center">
                            <p class="text-sm text-muted-foreground mb-2">Can't find what you need?</p>
                            <a href="/app-store" class="inline-flex items-center justify-center rounded-md text-sm font-medium px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90">
                                Browse All Apps
                            </a>
                        </div>
                    </div>
                    {/if}
                    
                    <!-- App Context Dropdown Menu -->
                    {#if isContextMenuOpen}
                    <DropdownMenu open={isContextMenuOpen} align="left" onClose={closeContextMenu}>
                        <div class="p-1.5 space-y-0.5" role="none">
                            {#each appContexts as context}
                                <button 
                                    on:click={() => handleContextChange(context.id as AppContext)}
                                    class={cn(
                                        "flex w-full items-center rounded-md px-3 py-2 text-sm",
                                        context.id === activeContext.id 
                                            ? "bg-primary/10 text-primary font-medium" 
                                            : "text-popover-foreground hover:bg-accent hover:text-accent-foreground"
                                    )}
                                    role="menuitem"
                                >
                                    <svelte:component this={context.icon} class="mr-2 h-4 w-4" aria-hidden="true" />
                                    <span class="flex-1 text-left">{context.name}</span>
                                    {#if context.id === activeContext.id}
                                        <CheckCircle class="ml-2 h-4 w-4" />
                                    {/if}
                                </button>
                            {/each}
                        </div>
                        
                        <!-- Recent locations -->
                        <div class="border-t my-1 pt-1 px-2">
                            <h3 class="text-xs font-medium text-muted-foreground mb-1 px-2">Recent locations</h3>
                            <div class="space-y-0.5">
                                <a 
                                    href="/" 
                                    class="flex items-center text-sm rounded-md px-3 py-1.5 hover:bg-accent text-popover-foreground hover:text-accent-foreground"
                                >
                                    <Home class="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                                    <span>Dashboard</span>
                                </a>
                                <a 
                                    href="/content" 
                                    class="flex items-center text-sm rounded-md px-3 py-1.5 hover:bg-accent text-popover-foreground hover:text-accent-foreground"
                                >
                                    <PanelLeft class="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                                    <span>Content Management</span>
                                </a>
                            </div>
                        </div>
                    </DropdownMenu>
                    {/if}
                </div>
                
                <!-- Breadcrumb navigation -->
                <div class="ml-4 hidden md:flex items-center">
                    <nav class="flex" aria-label="Breadcrumb">
                        <ol class="flex items-center space-x-1 text-sm">
                            <li>
                                <a href="/" class="text-muted-foreground hover:text-foreground">Home</a>
                            </li>
                            {#if $page.url.pathname !== '/'}
                                <li class="flex items-center">
                                    <ChevronRight class="h-4 w-4 text-muted-foreground mx-1" />
                                    <a 
                                        href={$page.url.pathname.split('/').slice(0, 2).join('/')} 
                                        class="text-muted-foreground hover:text-foreground"
                                    >
                                        {$page.url.pathname.split('/')[1].charAt(0).toUpperCase() + $page.url.pathname.split('/')[1].slice(1)}
                                    </a>
                                </li>
                            {/if}
                            {#if $page.url.pathname.split('/').filter(Boolean).length > 1}
                                <li class="flex items-center">
                                    <ChevronRight class="h-4 w-4 text-muted-foreground mx-1" />
                                    <span class="font-medium text-foreground">
                                        {$page.url.pathname.split('/').filter(Boolean).pop()?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                    </span>
                                </li>
                            {/if}
                        </ol>
                    </nav>
                </div>
            </div>

            <!-- Right side - Header Actions -->
            <div class="flex items-center justify-end space-x-1 md:space-x-2">
                <!-- Search button -->
                <button 
                    type="button"
                    aria-label="Search"
                    on:click={handleSearchToggle}
                    class="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    <div class="flex items-center space-x-1 text-xs px-1">
                        <Search class="h-4 w-4" aria-hidden="true" />
                        <span class="hidden md:inline-flex">Search</span>
                        <kbd class="hidden md:inline-flex items-center rounded border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">⌘K</kbd>
                    </div>
                </button>
                
                <!-- Notifications button -->
                <div class="relative">
                    <button 
                        type="button"
                        aria-label="Notifications"
                        aria-haspopup="true"
                        aria-expanded={isNotificationsOpen}
                        on:click={() => isNotificationsOpen = !isNotificationsOpen}
                        class={cn(
                            "inline-flex items-center justify-center rounded-md p-2",
                            "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            isNotificationsOpen && "bg-accent text-accent-foreground"
                        )}
                    >
                        <div class="relative">
                            <Bell class="h-5 w-5" aria-hidden="true" />
                            {#if notifications.some(n => !n.read)}
                                <span class="absolute -top-1 -right-1 flex h-2 w-2">
                                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                            {/if}
                        </div>
                    </button>
                    
                    <!-- Notifications dropdown -->
                    <DropdownMenu open={isNotificationsOpen} align="right" width="w-80" onClose={closeNotifications}>
                        <div class="p-2 border-b">
                            <div class="flex items-center justify-between">
                                <h3 class="text-sm font-medium">Notifications</h3>
                                <button class="text-xs text-primary hover:underline">Mark all as read</button>
                            </div>
                        </div>
                        
                        <div class="max-h-[350px] overflow-y-auto">
                            {#if notifications.length === 0}
                                <div class="p-4 text-center text-sm text-muted-foreground">
                                    <p>No notifications</p>
                                </div>
                            {:else}
                                <div class="divide-y">
                                    {#each notifications as notification}
                                        <div 
                                            class={cn(
                                                "p-3 hover:bg-accent/50 transition-colors cursor-pointer",
                                                !notification.read && "bg-accent/20"
                                            )}
                                            on:click={() => markNotificationAsRead(notification.id)}
                                        >
                                            <div class="flex items-start">
                                                <div class="flex-shrink-0 pt-0.5">
                                                    {#if notification.type === 'comment'}
                                                        <MessageSquare class="h-5 w-5 text-blue-500" />
                                                    {:else if notification.type === 'system'}
                                                        <Settings class="h-5 w-5 text-purple-500" />
                                                    {:else if notification.type === 'alert'}
                                                        <Bell class="h-5 w-5 text-yellow-500" />
                                                    {:else if notification.type === 'user'}
                                                        <User class="h-5 w-5 text-green-500" />
                                                    {/if}
                                                </div>
                                                <div class="ml-3 flex-1">
                                                    <p class="text-sm font-medium">{notification.title}</p>
                                                    <p class="text-xs text-muted-foreground mt-1">{notification.message}</p>
                                                    <div class="flex items-center mt-1">
                                                        <Clock class="h-3 w-3 text-muted-foreground mr-1" />
                                                        <span class="text-xs text-muted-foreground">{notification.time}</span>
                                                    </div>
                                                </div>
                                                {#if !notification.read}
                                                    <span class="ml-2 h-2 w-2 rounded-full bg-primary"></span>
                                                {/if}
                                            </div>
                                        </div>
                                    {/each}
                                </div>
                            {/if}
                        </div>
                        
                        <div class="p-2 border-t bg-muted/50">
                            <a href="/notifications" class="block text-center text-xs text-primary hover:underline">
                                View all notifications
                            </a>
                        </div>
                    </DropdownMenu>
                </div>
                
                <!-- Theme toggle button -->
                <button 
                    type="button"
                    aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                    on:click={toggleTheme} 
                    class="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    {#if isDarkMode}
                        <div in:scale={{duration: 200}}>
                            <Sun class="h-5 w-5" aria-hidden="true" />
                        </div>
                    {:else}
                        <div in:scale={{duration: 200}}>
                            <Moon class="h-5 w-5" aria-hidden="true" />
                        </div>
                    {/if}
                </button>
                
                <!-- User menu -->
                <div class="relative">
                    <button 
                        type="button"
                        aria-label="User menu"
                        aria-haspopup="true"
                        aria-expanded={isUserMenuOpen}
                        on:click={() => isUserMenuOpen = !isUserMenuOpen}
                        class={cn(
                            "inline-flex items-center justify-center gap-2",
                            "text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            "group transition-colors"
                        )}
                    >
                        <div 
                            class={cn(
                                "flex h-8 w-8 items-center justify-center rounded-full",
                                "bg-primary/10 text-primary group-hover:bg-primary/20",
                                userAvatar ? "p-0 overflow-hidden border" : ""
                            )}
                        >
                            {#if userAvatar}
                                <img src={userAvatar} alt={userFullName} class="h-full w-full object-cover" />
                            {:else}
                                <span class="text-xs font-medium">{userInitials}</span>
                            {/if}
                        </div>
                        
                        <div class="hidden md:block text-left">
                            <p class="text-sm font-medium text-foreground">{userFullName}</p>
                            <p class="text-xs text-muted-foreground">{userRole}</p>
                        </div>
                        
                        <ChevronDown class={cn("h-4 w-4 text-muted-foreground transition-transform", isUserMenuOpen && "rotate-180")} aria-hidden="true" />
                    </button>
                    
                    <!-- User dropdown menu -->
                    <DropdownMenu open={isUserMenuOpen} align="right" width="w-64" onClose={closeUserMenu}>
                        <div class="p-4 border-b">
                            <div class="flex items-start gap-3">
                                <div 
                                    class={cn(
                                        "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full",
                                        "bg-primary/10 text-primary",
                                        userAvatar ? "p-0 overflow-hidden border" : ""
                                    )}
                                >
                                    {#if userAvatar}
                                        <img src={userAvatar} alt={userFullName} class="h-full w-full object-cover" />
                                    {:else}
                                        <span class="text-sm font-medium">{userInitials}</span>
                                    {/if}
                                </div>
                                <div>
                                    <p class="font-medium">{userFullName}</p>
                                    <p class="text-xs text-muted-foreground mt-0.5">{userEmail}</p>
                                    <p class="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded mt-1 inline-block">{userRole}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="p-1">
                            <a 
                                href="/profile"
                                class="flex items-center rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                            >
                                <User class="mr-2 h-4 w-4" />
                                Your Profile
                                <ChevronRight class="ml-auto h-4 w-4 text-muted-foreground" />
                            </a>
                            <button 
                                on:click={() => handleUserMenuAction('settings')}
                                class="flex w-full items-center rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                            >
                                <Settings class="mr-2 h-4 w-4" />
                                Settings
                                <ChevronRight class="ml-auto h-4 w-4 text-muted-foreground" />
                            </button>
                            <button 
                                on:click={openKeyboardShortcuts}
                                class="flex w-full items-center rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                            >
                                <Keyboard class="mr-2 h-4 w-4" />
                                Keyboard Shortcuts
                            </button>
                            <button 
                                on:click={() => handleUserMenuAction('help')}
                                class="flex w-full items-center rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                            >
                                <HelpCircle class="mr-2 h-4 w-4" />
                                Help & Documentation
                            </button>
                        </div>
                        
                        <div class="p-1 border-t">
                            <button 
                                on:click={() => handleUserMenuAction('logout')}
                                class="flex w-full items-center rounded-md px-3 py-2 text-sm text-red-500 hover:bg-red-500/10"
                            >
                                <LogOut class="mr-2 h-4 w-4" />
                                Sign out
                            </button>
                        </div>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    </div>
</header>

<!-- Global search dialog -->
{#if isSearchOpen}
    <div class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" transition:fade={{ duration: 100 }}>
        <div 
            class="fixed left-[50%] top-[40%] max-h-[85vh] w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] overflow-hidden rounded-xl border bg-background p-4 shadow-lg"
            transition:scale={{ duration: 150, start: 0.95 }}
        >
            <div class="flex items-center border-b pb-2">
                <Search class="mr-2 h-4 w-4 text-muted-foreground" />
                <input 
                    id="global-search-input"
                    type="text" 
                    placeholder="Search across Mixcore..." 
                    class="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    bind:value={searchQuery}
                    on:keydown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <div class="flex items-center gap-1">
                    <kbd class="inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">ESC</kbd>
                    <span class="text-xs text-muted-foreground">to close</span>
                </div>
            </div>
            
            <div class="mt-2 max-h-[70vh] overflow-y-auto pb-2">
                {#if isSearching}
                    <div class="py-6 text-center">
                        <div class="inline-block animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
                        <p class="mt-2 text-sm text-muted-foreground">Searching...</p>
                    </div>
                {:else if searchResults.length > 0}
                    <div class="space-y-1">
                        {#each searchResults as result}
                            <a 
                                href={result.url} 
                                class="flex items-center rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                                on:click={() => isSearchOpen = false}
                            >
                                {#if result.type === 'page'}
                                    <Home class="mr-2 h-4 w-4" />
                                {:else if result.type === 'settings'}
                                    <Settings class="mr-2 h-4 w-4" />
                                {/if}
                                <span>{result.title}</span>
                            </a>
                        {/each}
                    </div>
                {:else if searchQuery && !isSearching}
                    <div class="py-6 text-center">
                        <p class="text-sm text-muted-foreground">No results found</p>
                    </div>
                {:else}
                    <div class="py-6 text-center">
                        <Command class="h-10 w-10 text-muted-foreground mb-2" />
                        <p class="text-sm text-muted-foreground">Type to search across Mixcore</p>
                    </div>
                {/if}
            </div>
        </div>
    </div>
{/if} 