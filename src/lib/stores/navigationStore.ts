import { writable } from 'svelte/store';
import { 
    LayoutDashboard,
    FileText,
    Database,
    Palette,
    Package
} from 'lucide-svelte';

// Types
export type AppContext = 'cms' | 'mixdb' | 'design' | 'modules';

export type NavItem = {
    name: string;
    path: string;
    icon: any; // Using 'any' for simplicity with the Lucide component types
};

export type NavSection = {
    section: string;
    items: NavItem[];
};

export type NavigationMap = Record<AppContext, NavSection[]>;

// App contexts for the context selector
export const appContexts = [
    { id: 'cms' as AppContext, name: 'CMS', icon: FileText },
    { id: 'mixdb' as AppContext, name: 'MixDB', icon: Database },
    { id: 'design' as AppContext, name: 'Design', icon: Palette },
    { id: 'modules' as AppContext, name: 'Modules', icon: Package }
];

// Navigation items organized by context
export const navigationItems: NavigationMap = {
    'cms': [
        {
            section: 'Dashboard',
            items: [
                { name: 'Overview', path: '/', icon: LayoutDashboard }
            ]
        },
        {
            section: 'Content',
            items: [
                { name: 'Pages', path: '/pages', icon: FileText },
                { name: 'Posts', path: '/posts', icon: FileText }
            ]
        }
    ],
    'mixdb': [
        {
            section: 'Dashboard',
            items: [
                { name: 'Overview', path: '/', icon: LayoutDashboard }
            ]
        },
        {
            section: 'Data',
            items: [
                { name: 'Databases', path: '/databases', icon: Database },
                { name: 'Models', path: '/models', icon: Database }
            ]
        }
    ],
    'design': [
        {
            section: 'Dashboard',
            items: [
                { name: 'Overview', path: '/', icon: LayoutDashboard }
            ]
        },
        {
            section: 'Design',
            items: [
                { name: 'Themes', path: '/themes', icon: Palette },
                { name: 'Templates', path: '/templates', icon: FileText }
            ]
        }
    ],
    'modules': [
        {
            section: 'Dashboard',
            items: [
                { name: 'Overview', path: '/', icon: LayoutDashboard }
            ]
        },
        {
            section: 'Extensions',
            items: [
                { name: 'Modules', path: '/modules', icon: Package },
                { name: 'Store', path: '/store', icon: Package }
            ]
        }
    ]
};

// Create the store
export const currentContext = writable<AppContext>('cms');

// Helper function to get navigation items for current context
export function getNavigationItems(context: AppContext): NavSection[] {
    return navigationItems[context] || navigationItems.cms;
}

// Helper function to get active context object
export function getActiveContext(context: AppContext) {
    return appContexts.find(ctx => ctx.id === context) || appContexts[0];
} 