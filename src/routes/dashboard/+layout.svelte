<script lang="ts">
    import { page } from '$app/stores';
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    import ShellLayout from '../../components/layout/ShellLayout.svelte';
    
    // Icons (import as needed)
    import { 
        Home, 
        Layout, 
        Database, 
        FileText, 
        Image, 
        Tag, 
        Settings, 
        User,
        Users,
        MessageSquare,
        BarChart,
        PanelLeft
    } from 'lucide-svelte';

    // Types
    type AppContext = {
        id: string;
        name: string;
        icon: any;
        isChanging?: boolean;
    };

    // State
    let isDarkMode = false;
    let isMobileMenuOpen = false;
    
    // Context/App navigation
    let activeContext: AppContext = { id: 'dashboard', name: 'Dashboard', icon: Home };
    const appContexts: AppContext[] = [
        { id: 'dashboard', name: 'Dashboard', icon: Home },
        { id: 'cms', name: 'Content', icon: FileText },
        { id: 'mixdb', name: 'Database', icon: Database },
        { id: 'design', name: 'Design', icon: Layout }
    ];
    
    // Navigation items - in a real app, these would be loaded from an API or generated based on permissions
    const navigationItems = [
        {
            section: 'Core',
            items: [
                { name: 'Dashboard', path: '/dashboard', icon: Home },
                { name: 'Pages', path: '/dashboard/pages', icon: Layout },
                { name: 'Posts', path: '/dashboard/posts', icon: FileText },
                { name: 'Media', path: '/dashboard/media', icon: Image },
                { name: 'Tags', path: '/dashboard/tags', icon: Tag }
            ]
        },
        {
            section: 'Apps',
            items: [
                { name: 'Mini Apps', path: '/dashboard/apps', icon: PanelLeft },
                { name: 'Template App', path: '/dashboard/apps/template', icon: Database }
            ]
        },
        {
            section: 'Users',
            items: [
                { name: 'My Profile', path: '/dashboard/profile', icon: User },
                { name: 'User Management', path: '/dashboard/users', icon: Users },
                { name: 'Comments', path: '/dashboard/comments', icon: MessageSquare }
            ]
        },
        {
            section: 'System',
            items: [
                { name: 'Settings', path: '/dashboard/settings', icon: Settings },
                { name: 'Analytics', path: '/dashboard/analytics', icon: BarChart }
            ]
        }
    ];
    
    // Handle theme toggle
    function toggleTheme() {
        isDarkMode = !isDarkMode;
        if (browser) {
            localStorage.setItem('mixcore_dark_mode', isDarkMode.toString());
            document.documentElement.classList.toggle('dark', isDarkMode);
        }
    }
    
    // Handle mobile menu toggle
    function toggleMobileMenu() {
        isMobileMenuOpen = !isMobileMenuOpen;
    }
    
    // Handle context change
    function setContext(contextId: string) {
        const newContext = appContexts.find(ctx => ctx.id === contextId);
        if (newContext) {
            activeContext = { ...newContext, isChanging: true };
            // In a real app, you might also change the navigation items based on context
            setTimeout(() => {
                activeContext = { ...newContext, isChanging: false };
            }, 300);
        }
    }
    
    // Initialize theme from localStorage
    onMount(() => {
        if (browser) {
            const storedTheme = localStorage.getItem('mixcore_dark_mode');
            if (storedTheme !== null) {
                isDarkMode = storedTheme === 'true';
                document.documentElement.classList.toggle('dark', isDarkMode);
            } else {
                // Check system preference
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                isDarkMode = prefersDark;
                document.documentElement.classList.toggle('dark', prefersDark);
            }
            
            // Add listener for system theme changes
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = (e: MediaQueryListEvent) => {
                if (localStorage.getItem('mixcore_dark_mode') === null) {
                    isDarkMode = e.matches;
                    document.documentElement.classList.toggle('dark', e.matches);
                }
            };
            
            mediaQuery.addEventListener('change', handleChange);
            
            return () => {
                mediaQuery.removeEventListener('change', handleChange);
            };
        }
    });
</script>

<ShellLayout
    {isDarkMode}
    {isMobileMenuOpen}
    {activeContext}
    {appContexts}
    activeNavItems={navigationItems}
    {toggleTheme}
    {toggleMobileMenu}
    {setContext}
>
    <slot />
</ShellLayout> 