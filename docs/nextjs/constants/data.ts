import { NavItem } from '@/types';

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Content',
    url: '#', // Placeholder as there is no direct link for the parent
    icon: 'post',
    isActive: false,
    shortcut: ['c', 'm'],
    items: [
      {
        title: 'Posts',
        url: '/dashboard/posts',
        icon: 'post',
        shortcut: ['p', 's']
      },
      {
        title: 'Pages',
        url: '/dashboard/pages',
        icon: 'page',
        shortcut: ['p', 'g']
      },
      {
        title: 'Media',
        url: '/dashboard/media',
        icon: 'media',
        shortcut: ['m', 'd']
      },
      {
        title: 'Tags',
        url: '/dashboard/tags',
        icon: 'tag',
        shortcut: ['t', 'g']
      }
    ]
  },
  {
    title: 'Design',
    url: '#',
    icon: 'palette',
    isActive: false,
    shortcut: ['d', 's'],
    items: [
      {
        title: 'Templates',
        url: '/dashboard/templates',
        icon: 'code',
        shortcut: ['t', 'e']
      },
      {
        title: 'Themes',
        url: '/dashboard/themes',
        icon: 'palette',
        shortcut: ['t', 'h']
      }
    ]
  },
  {
    title: 'MixDb',
    url: '/dashboard/mixdb',
    icon: 'database',
    isActive: false,
    shortcut: ['m', 'd'],
    items: [
      {
        title: 'Dashboard',
        url: '/dashboard/mixdb',
        icon: 'dashboard',
        shortcut: ['m', 'o']
      },
      {
        title: 'Databases',
        url: '/dashboard/mixdb/databases',
        icon: 'database',
        shortcut: ['d', 'b']
      },
      {
        title: 'Form Builder',
        url: '/dashboard/mixdb/forms',
        icon: 'form',
        shortcut: ['f', 'b']
      }
    ]
  },
  {
    title: 'Management',
    url: '#',
    icon: 'settings',
    isActive: false,
    shortcut: ['m', 'g'],
    items: [
      {
        title: 'Tenants',
        url: '/dashboard/tenants',
        icon: 'building',
        shortcut: ['t', 'n']
      }
    ]
  },
  {
    title: 'Product',
    url: '/dashboard/product',
    icon: 'product',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Account',
    url: '#', // Placeholder as there is no direct link for the parent
    icon: 'billing',
    isActive: true,

    items: [
      {
        title: 'Profile',
        url: '/dashboard/profile',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
      {
        title: 'Login',
        shortcut: ['l', 'l'],
        url: '/',
        icon: 'login'
      }
    ]
  },
  {
    title: 'Kanban',
    url: '/dashboard/kanban',
    icon: 'kanban',
    shortcut: ['k', 'k'],
    isActive: false,
    items: [] // No child items
  }
];

export interface SaleUser {
  id: number;
  name: string;
  email: string;
  amount: string;
  image: string;
  initials: string;
}

export const recentSalesData: SaleUser[] = [
  {
    id: 1,
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    amount: '+$1,999.00',
    image: 'https://api.slingacademy.com/public/sample-users/1.png',
    initials: 'OM'
  },
  {
    id: 2,
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/2.png',
    initials: 'JL'
  },
  {
    id: 3,
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    amount: '+$299.00',
    image: 'https://api.slingacademy.com/public/sample-users/3.png',
    initials: 'IN'
  },
  {
    id: 4,
    name: 'William Kim',
    email: 'will@email.com',
    amount: '+$99.00',
    image: 'https://api.slingacademy.com/public/sample-users/4.png',
    initials: 'WK'
  },
  {
    id: 5,
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/5.png',
    initials: 'SD'
  }
];

// App contexts define different application areas
export const appContexts = [
  {
    id: 'website',
    name: 'Website',
    description: 'Website, eCommerce and online content',
    icon: 'fileText'
  },
  {
    id: 'sales',
    name: 'Sales',
    description: 'CRM, Sales and Point of Sale',
    icon: 'product'
  },
  {
    id: 'finance',
    name: 'Finance',
    description: 'Accounting, Invoicing and Documents',
    icon: 'billing'
  },
  {
    id: 'inventory',
    name: 'Inventory & Manufacturing',
    description: 'Manage stock, manufacturing and purchases',
    icon: 'folder'
  },
  {
    id: 'hr',
    name: 'Human Resources',
    description: 'Employees, Recruitment and Time Off',
    icon: 'user'
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'Marketing, Email campaigns and Events',
    icon: 'file'
  },
  {
    id: 'services',
    name: 'Services',
    description: 'Projects, Timesheet and Helpdesk',
    icon: 'help'
  },
  {
    id: 'productivity',
    name: 'Productivity',
    description: 'Discuss, Approvals and Knowledge',
    icon: 'check'
  },
  {
    id: 'customization',
    name: 'Customization',
    description: 'Studio and app customization',
    icon: 'settings'
  }
];

// Personas define different user types
export const personas = [
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Full access to all system features'
  },
  {
    id: 'website-manager',
    name: 'Website Manager',
    description: 'Manage website, blog, pages and eCommerce'
  },
  {
    id: 'sales-manager',
    name: 'Sales Manager',
    description: 'Manage CRM, sales and POS'
  },
  {
    id: 'finance-manager',
    name: 'Finance Manager',
    description: 'Manage accounting, invoicing and documents'
  },
  {
    id: 'inventory-manager',
    name: 'Inventory Manager',
    description: 'Manage inventory, manufacturing and purchases'
  },
  {
    id: 'hr-manager',
    name: 'HR Manager',
    description: 'Manage employees, recruitment and time off'
  },
  {
    id: 'marketing-manager',
    name: 'Marketing Manager',
    description: 'Manage marketing, email campaigns and events'
  },
  {
    id: 'service-manager',
    name: 'Service Manager',
    description: 'Manage projects, helpdesk and appointments'
  },
  {
    id: 'developer',
    name: 'Developer',
    description: 'Technical development and customization'
  }
];

// Extended navigation items with context, app and persona information
export const contextNavItems: NavItem[] = [
  // Dashboard - Available in all contexts
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [],
    priority: 0
  },
  
  // Moved second-level items to first level (Website context)
  {
    title: 'Pages',
    url: '/dashboard/pages',
    icon: 'page',
    shortcut: ['p', 'g'],
    contextId: 'website',
    appId: 'website',
    priority: 10,
    items: [
      {
        title: 'Recent Pages',
        url: '/dashboard/pages/recent',
        contextId: 'website',
        appId: 'website',
        items: [
          {
            title: 'Published Today',
            url: '/dashboard/pages/recent/today',
            contextId: 'website',
            appId: 'website'
          },
          {
            title: 'This Week',
            url: '/dashboard/pages/recent/week',
            contextId: 'website',
            appId: 'website'
          },
          {
            title: 'This Month',
            url: '/dashboard/pages/recent/month',
            contextId: 'website',
            appId: 'website'
          }
        ]
      },
      {
        title: 'Published',
        url: '/dashboard/pages/published',
        contextId: 'website',
        appId: 'website',
        items: [
          {
            title: 'Landing Pages',
            url: '/dashboard/pages/published/landing',
            contextId: 'website',
            appId: 'website'
          },
          {
            title: 'Content Pages',
            url: '/dashboard/pages/published/content',
            contextId: 'website',
            appId: 'website'
          },
          {
            title: 'System Pages',
            url: '/dashboard/pages/published/system',
            contextId: 'website',
            appId: 'website'
          }
        ]
      },
      {
        title: 'Drafts',
        url: '/dashboard/pages/drafts',
        contextId: 'website',
        appId: 'website',
        items: [
          {
            title: 'In Review',
            url: '/dashboard/pages/drafts/review',
            contextId: 'website',
            appId: 'website'
          },
          {
            title: 'Needs Approval',
            url: '/dashboard/pages/drafts/approval',
            contextId: 'website',
            appId: 'website'
          },
          {
            title: 'Work in Progress',
            url: '/dashboard/pages/drafts/wip',
            contextId: 'website',
            appId: 'website'
          }
        ]
      },
      {
        title: 'Templates',
        url: '/dashboard/pages/templates',
        contextId: 'website',
        appId: 'website',
        items: [
          {
            title: 'Blank Templates',
            url: '/dashboard/pages/templates/blank',
            contextId: 'website',
            appId: 'website'
          },
          {
            title: 'Section Templates',
            url: '/dashboard/pages/templates/sections',
            contextId: 'website',
            appId: 'website'
          },
          {
            title: 'Custom Templates',
            url: '/dashboard/pages/templates/custom',
            contextId: 'website',
            appId: 'website'
          }
        ]
      },
      {
        title: 'SEO Settings',
        url: '/dashboard/pages/seo',
        contextId: 'website',
        appId: 'website',
        items: [
          {
            title: 'Meta Descriptions',
            url: '/dashboard/pages/seo/meta',
            contextId: 'website',
            appId: 'website'
          },
          {
            title: 'Keywords',
            url: '/dashboard/pages/seo/keywords',
            contextId: 'website',
            appId: 'website'
          },
          {
            title: 'Analytics',
            url: '/dashboard/pages/seo/analytics',
            contextId: 'website',
            appId: 'website'
          }
        ]
      }
    ]
  },
  {
    title: 'eCommerce',
    url: '/dashboard/ecommerce',
    icon: 'product',
    shortcut: ['e', 'c'],
    contextId: 'website',
    appId: 'ecommerce',
    priority: 11,
    items: [
      {
        title: 'Products',
        url: '/dashboard/ecommerce/products',
        contextId: 'website',
        appId: 'ecommerce',
        items: [
          {
            title: 'Physical Products',
            url: '/dashboard/ecommerce/products/physical',
            contextId: 'website',
            appId: 'ecommerce'
          },
          {
            title: 'Digital Products',
            url: '/dashboard/ecommerce/products/digital',
            contextId: 'website',
            appId: 'ecommerce'
          },
          {
            title: 'Subscriptions',
            url: '/dashboard/ecommerce/products/subscriptions',
            contextId: 'website',
            appId: 'ecommerce'
          }
        ]
      },
      {
        title: 'Orders',
        url: '/dashboard/ecommerce/orders',
        contextId: 'website',
        appId: 'ecommerce',
        items: [
          {
            title: 'Pending Orders',
            url: '/dashboard/ecommerce/orders/pending',
            contextId: 'website',
            appId: 'ecommerce'
          },
          {
            title: 'Completed Orders',
            url: '/dashboard/ecommerce/orders/completed',
            contextId: 'website',
            appId: 'ecommerce'
          },
          {
            title: 'Returned Orders',
            url: '/dashboard/ecommerce/orders/returned',
            contextId: 'website',
            appId: 'ecommerce'
          }
        ]
      },
      {
        title: 'Customers',
        url: '/dashboard/ecommerce/customers',
        contextId: 'website',
        appId: 'ecommerce',
        items: [
          {
            title: 'New Customers',
            url: '/dashboard/ecommerce/customers/new',
            contextId: 'website',
            appId: 'ecommerce'
          },
          {
            title: 'Repeat Customers',
            url: '/dashboard/ecommerce/customers/repeat',
            contextId: 'website',
            appId: 'ecommerce'
          },
          {
            title: 'VIP Customers',
            url: '/dashboard/ecommerce/customers/vip',
            contextId: 'website',
            appId: 'ecommerce'
          }
        ]
      },
      {
        title: 'Inventory',
        url: '/dashboard/ecommerce/inventory',
        contextId: 'website',
        appId: 'ecommerce',
        items: [
          {
            title: 'Stock Levels',
            url: '/dashboard/ecommerce/inventory/stock',
            contextId: 'website',
            appId: 'ecommerce'
          },
          {
            title: 'Replenishment',
            url: '/dashboard/ecommerce/inventory/replenishment',
            contextId: 'website',
            appId: 'ecommerce'
          },
          {
            title: 'Warehouses',
            url: '/dashboard/ecommerce/inventory/warehouses',
            contextId: 'website',
            appId: 'ecommerce'
          }
        ]
      },
      {
        title: 'Discounts',
        url: '/dashboard/ecommerce/discounts',
        contextId: 'website',
        appId: 'ecommerce',
        items: [
          {
            title: 'Coupon Codes',
            url: '/dashboard/ecommerce/discounts/coupons',
            contextId: 'website',
            appId: 'ecommerce'
          },
          {
            title: 'Special Offers',
            url: '/dashboard/ecommerce/discounts/offers',
            contextId: 'website',
            appId: 'ecommerce'
          },
          {
            title: 'Bulk Discounts',
            url: '/dashboard/ecommerce/discounts/bulk',
            contextId: 'website',
            appId: 'ecommerce'
          }
        ]
      }
    ]
  },
  {
    title: 'Blog',
    url: '/dashboard/posts',
    icon: 'post',
    shortcut: ['b', 'l'],
    contextId: 'website',
    appId: 'blog',
    priority: 12,
    items: [
      {
        title: 'All Posts',
        url: '/dashboard/posts/all',
        contextId: 'website',
        appId: 'blog',
        items: [
          {
            title: 'Featured Posts',
            url: '/dashboard/posts/all/featured',
            contextId: 'website',
            appId: 'blog'
          },
          {
            title: 'Popular Posts',
            url: '/dashboard/posts/all/popular',
            contextId: 'website',
            appId: 'blog'
          },
          {
            title: 'Archives',
            url: '/dashboard/posts/all/archives',
            contextId: 'website',
            appId: 'blog'
          }
        ]
      },
      {
        title: 'Categories',
        url: '/dashboard/posts/categories',
        contextId: 'website',
        appId: 'blog',
        items: [
          {
            title: 'Category Management',
            url: '/dashboard/posts/categories/manage',
            contextId: 'website',
            appId: 'blog'
          },
          {
            title: 'Hierarchy Settings',
            url: '/dashboard/posts/categories/hierarchy',
            contextId: 'website',
            appId: 'blog'
          },
          {
            title: 'SEO for Categories',
            url: '/dashboard/posts/categories/seo',
            contextId: 'website',
            appId: 'blog'
          }
        ]
      },
      {
        title: 'Tags',
        url: '/dashboard/posts/tags',
        contextId: 'website',
        appId: 'blog',
        items: [
          {
            title: 'Popular Tags',
            url: '/dashboard/posts/tags/popular',
            contextId: 'website',
            appId: 'blog'
          },
          {
            title: 'Tag Groups',
            url: '/dashboard/posts/tags/groups',
            contextId: 'website',
            appId: 'blog'
          },
          {
            title: 'Unused Tags',
            url: '/dashboard/posts/tags/unused',
            contextId: 'website',
            appId: 'blog'
          }
        ]
      },
      {
        title: 'Comments',
        url: '/dashboard/posts/comments',
        contextId: 'website',
        appId: 'blog',
        items: [
          {
            title: 'Pending Approval',
            url: '/dashboard/posts/comments/pending',
            contextId: 'website',
            appId: 'blog'
          },
          {
            title: 'Reported Comments',
            url: '/dashboard/posts/comments/reported',
            contextId: 'website',
            appId: 'blog'
          },
          {
            title: 'Comment Settings',
            url: '/dashboard/posts/comments/settings',
            contextId: 'website',
            appId: 'blog'
          }
        ]
      }
    ]
  },
  
  // Moved second-level items to first level (Sales context)
  {
    title: 'CRM',
    url: '/dashboard/crm',
    icon: 'user',
    shortcut: ['c', 'r'],
    contextId: 'sales',
    appId: 'crm',
    priority: 20,
    items: [
      {
        title: 'Leads',
        url: '/dashboard/crm/leads',
        contextId: 'sales',
        appId: 'crm',
        items: [
          {
            title: 'New Leads',
            url: '/dashboard/crm/leads/new',
            contextId: 'sales',
            appId: 'crm'
          },
          {
            title: 'Qualified Leads',
            url: '/dashboard/crm/leads/qualified',
            contextId: 'sales',
            appId: 'crm'
          },
          {
            title: 'Lead Scoring',
            url: '/dashboard/crm/leads/scoring',
            contextId: 'sales',
            appId: 'crm'
          }
        ]
      },
      {
        title: 'Opportunities',
        url: '/dashboard/crm/opportunities',
        contextId: 'sales',
        appId: 'crm',
        items: [
          {
            title: 'Pipeline View',
            url: '/dashboard/crm/opportunities/pipeline',
            contextId: 'sales',
            appId: 'crm'
          },
          {
            title: 'Forecasting',
            url: '/dashboard/crm/opportunities/forecasting',
            contextId: 'sales',
            appId: 'crm'
          },
          {
            title: 'Won/Lost Analysis',
            url: '/dashboard/crm/opportunities/analysis',
            contextId: 'sales',
            appId: 'crm'
          }
        ]
      },
      {
        title: 'Contacts',
        url: '/dashboard/crm/contacts',
        contextId: 'sales',
        appId: 'crm',
        items: [
          {
            title: 'Individual Contacts',
            url: '/dashboard/crm/contacts/individual',
            contextId: 'sales',
            appId: 'crm'
          },
          {
            title: 'Contact Groups',
            url: '/dashboard/crm/contacts/groups',
            contextId: 'sales',
            appId: 'crm'
          },
          {
            title: 'Contact Enrichment',
            url: '/dashboard/crm/contacts/enrichment',
            contextId: 'sales',
            appId: 'crm'
          }
        ]
      },
      {
        title: 'Companies',
        url: '/dashboard/crm/companies',
        contextId: 'sales',
        appId: 'crm',
        items: [
          {
            title: 'Company Profiles',
            url: '/dashboard/crm/companies/profiles',
            contextId: 'sales',
            appId: 'crm'
          },
          {
            title: 'Industry Segments',
            url: '/dashboard/crm/companies/segments',
            contextId: 'sales',
            appId: 'crm'
          },
          {
            title: 'Account Hierarchy',
            url: '/dashboard/crm/companies/hierarchy',
            contextId: 'sales',
            appId: 'crm'
          }
        ]
      }
    ]
  },
  {
    title: 'Sales',
    url: '/dashboard/sales/orders',
    icon: 'billing',
    shortcut: ['s', 'o'],
    contextId: 'sales',
    appId: 'sales',
    priority: 21,
    items: [
      {
        title: 'Orders',
        url: '/dashboard/sales/orders',
        contextId: 'sales',
        appId: 'sales',
        items: [
          {
            title: 'New Orders',
            url: '/dashboard/sales/orders/new',
            contextId: 'sales',
            appId: 'sales'
          },
          {
            title: 'Processing',
            url: '/dashboard/sales/orders/processing',
            contextId: 'sales',
            appId: 'sales'
          },
          {
            title: 'Completed',
            url: '/dashboard/sales/orders/completed',
            contextId: 'sales',
            appId: 'sales'
          }
        ]
      },
      {
        title: 'Quotations',
        url: '/dashboard/sales/quotations',
        contextId: 'sales',
        appId: 'sales',
        items: [
          {
            title: 'Draft Quotes',
            url: '/dashboard/sales/quotations/draft',
            contextId: 'sales',
            appId: 'sales'
          },
          {
            title: 'Sent Quotes',
            url: '/dashboard/sales/quotations/sent',
            contextId: 'sales',
            appId: 'sales'
          },
          {
            title: 'Quote Templates',
            url: '/dashboard/sales/quotations/templates',
            contextId: 'sales',
            appId: 'sales'
          }
        ]
      },
      {
        title: 'Invoices',
        url: '/dashboard/sales/invoices',
        contextId: 'sales',
        appId: 'sales',
        items: [
          {
            title: 'Outstanding',
            url: '/dashboard/sales/invoices/outstanding',
            contextId: 'sales',
            appId: 'sales'
          },
          {
            title: 'Paid',
            url: '/dashboard/sales/invoices/paid',
            contextId: 'sales',
            appId: 'sales'
          },
          {
            title: 'Overdue',
            url: '/dashboard/sales/invoices/overdue',
            contextId: 'sales',
            appId: 'sales'
          }
        ]
      },
      {
        title: 'Performance',
        url: '/dashboard/sales/performance',
        contextId: 'sales',
        appId: 'sales',
        items: [
          {
            title: 'Team Analytics',
            url: '/dashboard/sales/performance/team',
            contextId: 'sales',
            appId: 'sales'
          },
          {
            title: 'Individual Performance',
            url: '/dashboard/sales/performance/individual',
            contextId: 'sales',
            appId: 'sales'
          },
          {
            title: 'KPI Tracking',
            url: '/dashboard/sales/performance/kpi',
            contextId: 'sales',
            appId: 'sales'
          }
        ]
      },
      {
        title: 'Sales Teams',
        url: '/dashboard/sales/teams',
        contextId: 'sales',
        appId: 'sales',
        items: [
          {
            title: 'Team Structure',
            url: '/dashboard/sales/teams/structure',
            contextId: 'sales',
            appId: 'sales'
          },
          {
            title: 'Territory Management',
            url: '/dashboard/sales/teams/territory',
            contextId: 'sales',
            appId: 'sales'
          },
          {
            title: 'Quota Management',
            url: '/dashboard/sales/teams/quota',
            contextId: 'sales',
            appId: 'sales'
          }
        ]
      }
    ]
  },
  
  // Moved second-level items to first level (Finance context)
  {
    title: 'Accounting',
    url: '/dashboard/accounting',
    icon: 'chart',
    shortcut: ['a', 'c'],
    contextId: 'finance',
    appId: 'accounting',
    priority: 30,
    items: [
      {
        title: 'Journal Entries',
        url: '/dashboard/accounting/journals',
        contextId: 'finance',
        appId: 'accounting',
        items: [
          {
            title: 'Create Entry',
            url: '/dashboard/accounting/journals/create',
            contextId: 'finance',
            appId: 'accounting'
          },
          {
            title: 'Review Entries',
            url: '/dashboard/accounting/journals/review',
            contextId: 'finance',
            appId: 'accounting'
          },
          {
            title: 'Entry Templates',
            url: '/dashboard/accounting/journals/templates',
            contextId: 'finance',
            appId: 'accounting'
          }
        ]
      },
      {
        title: 'Chart of Accounts',
        url: '/dashboard/accounting/accounts',
        contextId: 'finance',
        appId: 'accounting',
        items: [
          {
            title: 'Asset Accounts',
            url: '/dashboard/accounting/accounts/assets',
            contextId: 'finance',
            appId: 'accounting'
          },
          {
            title: 'Liability Accounts',
            url: '/dashboard/accounting/accounts/liabilities',
            contextId: 'finance',
            appId: 'accounting'
          },
          {
            title: 'Equity Accounts',
            url: '/dashboard/accounting/accounts/equity',
            contextId: 'finance',
            appId: 'accounting'
          }
        ]
      },
      {
        title: 'Financial Reports',
        url: '/dashboard/accounting/reports',
        contextId: 'finance',
        appId: 'accounting',
        items: [
          {
            title: 'Income Statement',
            url: '/dashboard/accounting/reports/income',
            contextId: 'finance',
            appId: 'accounting'
          },
          {
            title: 'Balance Sheet',
            url: '/dashboard/accounting/reports/balance',
            contextId: 'finance',
            appId: 'accounting'
          },
          {
            title: 'Cash Flow',
            url: '/dashboard/accounting/reports/cashflow',
            contextId: 'finance',
            appId: 'accounting'
          }
        ]
      }
    ]
  },
  {
    title: 'Invoicing',
    url: '/dashboard/invoicing',
    icon: 'billing',
    shortcut: ['i', 'n'],
    contextId: 'finance',
    appId: 'invoicing',
    priority: 31,
    items: [
      {
        title: 'Customer Invoices',
        url: '/dashboard/invoicing/customer',
        contextId: 'finance',
        appId: 'invoicing',
        items: [
          {
            title: 'Draft Invoices',
            url: '/dashboard/invoicing/customer/draft',
            contextId: 'finance',
            appId: 'invoicing'
          },
          {
            title: 'Sent Invoices',
            url: '/dashboard/invoicing/customer/sent',
            contextId: 'finance',
            appId: 'invoicing'
          },
          {
            title: 'Paid Invoices',
            url: '/dashboard/invoicing/customer/paid',
            contextId: 'finance',
            appId: 'invoicing'
          }
        ]
      },
      {
        title: 'Vendor Bills',
        url: '/dashboard/invoicing/vendor',
        contextId: 'finance',
        appId: 'invoicing',
        items: [
          {
            title: 'Pending Bills',
            url: '/dashboard/invoicing/vendor/pending',
            contextId: 'finance',
            appId: 'invoicing'
          },
          {
            title: 'Approved Bills',
            url: '/dashboard/invoicing/vendor/approved',
            contextId: 'finance',
            appId: 'invoicing'
          },
          {
            title: 'Paid Bills',
            url: '/dashboard/invoicing/vendor/paid',
            contextId: 'finance',
            appId: 'invoicing'
          }
        ]
      },
      {
        title: 'Recurring Invoices',
        url: '/dashboard/invoicing/recurring',
        contextId: 'finance',
        appId: 'invoicing',
        items: [
          {
            title: 'Active Subscriptions',
            url: '/dashboard/invoicing/recurring/active',
            contextId: 'finance',
            appId: 'invoicing'
          },
          {
            title: 'Upcoming Renewals',
            url: '/dashboard/invoicing/recurring/upcoming',
            contextId: 'finance',
            appId: 'invoicing'
          },
          {
            title: 'Subscription Plans',
            url: '/dashboard/invoicing/recurring/plans',
            contextId: 'finance',
            appId: 'invoicing'
          }
        ]
      }
    ]
  },
  
  // Moved second-level items to first level (HR context)
  {
    title: 'Employees',
    url: '/dashboard/employees',
    icon: 'user',
    shortcut: ['e', 'm'],
    contextId: 'hr',
    appId: 'employees',
    priority: 50,
    items: [
      {
        title: 'Directory',
        url: '/dashboard/employees/directory',
        contextId: 'hr',
        appId: 'employees',
        items: [
          {
            title: 'Active Employees',
            url: '/dashboard/employees/directory/active',
            contextId: 'hr',
            appId: 'employees'
          },
          {
            title: 'Contractors',
            url: '/dashboard/employees/directory/contractors',
            contextId: 'hr',
            appId: 'employees'
          },
          {
            title: 'Alumni',
            url: '/dashboard/employees/directory/alumni',
            contextId: 'hr',
            appId: 'employees'
          }
        ]
      },
      {
        title: 'Onboarding',
        url: '/dashboard/employees/onboarding',
        contextId: 'hr',
        appId: 'employees',
        items: [
          {
            title: 'New Hires',
            url: '/dashboard/employees/onboarding/new',
            contextId: 'hr',
            appId: 'employees'
          },
          {
            title: 'Paperwork',
            url: '/dashboard/employees/onboarding/paperwork',
            contextId: 'hr',
            appId: 'employees'
          },
          {
            title: 'Training',
            url: '/dashboard/employees/onboarding/training',
            contextId: 'hr',
            appId: 'employees'
          }
        ]
      },
      {
        title: 'Performance',
        url: '/dashboard/employees/performance',
        contextId: 'hr',
        appId: 'employees',
        items: [
          {
            title: 'Reviews',
            url: '/dashboard/employees/performance/reviews',
            contextId: 'hr',
            appId: 'employees'
          },
          {
            title: 'Goals',
            url: '/dashboard/employees/performance/goals',
            contextId: 'hr',
            appId: 'employees'
          },
          {
            title: 'Feedback',
            url: '/dashboard/employees/performance/feedback',
            contextId: 'hr',
            appId: 'employees'
          }
        ]
      }
    ]
  },
  {
    title: 'Recruitment',
    url: '/dashboard/recruitment',
    icon: 'userCircle',
    shortcut: ['r', 'c'],
    contextId: 'hr',
    appId: 'recruitment',
    priority: 51,
    items: [
      {
        title: 'Job Postings',
        url: '/dashboard/recruitment/jobs',
        contextId: 'hr',
        appId: 'recruitment',
        items: [
          {
            title: 'Active Postings',
            url: '/dashboard/recruitment/jobs/active',
            contextId: 'hr',
            appId: 'recruitment'
          },
          {
            title: 'Draft Postings',
            url: '/dashboard/recruitment/jobs/draft',
            contextId: 'hr',
            appId: 'recruitment'
          },
          {
            title: 'Job Templates',
            url: '/dashboard/recruitment/jobs/templates',
            contextId: 'hr',
            appId: 'recruitment'
          }
        ]
      },
      {
        title: 'Candidates',
        url: '/dashboard/recruitment/candidates',
        contextId: 'hr',
        appId: 'recruitment',
        items: [
          {
            title: 'All Applications',
            url: '/dashboard/recruitment/candidates/all',
            contextId: 'hr',
            appId: 'recruitment'
          },
          {
            title: 'Shortlisted',
            url: '/dashboard/recruitment/candidates/shortlisted',
            contextId: 'hr',
            appId: 'recruitment'
          },
          {
            title: 'Interviews',
            url: '/dashboard/recruitment/candidates/interviews',
            contextId: 'hr',
            appId: 'recruitment'
          }
        ]
      },
      {
        title: 'Hiring Pipeline',
        url: '/dashboard/recruitment/pipeline',
        contextId: 'hr',
        appId: 'recruitment',
        items: [
          {
            title: 'Pipeline View',
            url: '/dashboard/recruitment/pipeline/view',
            contextId: 'hr',
            appId: 'recruitment'
          },
          {
            title: 'Analytics',
            url: '/dashboard/recruitment/pipeline/analytics',
            contextId: 'hr',
            appId: 'recruitment'
          },
          {
            title: 'Hiring Team',
            url: '/dashboard/recruitment/pipeline/team',
            contextId: 'hr',
            appId: 'recruitment'
          }
        ]
      }
    ]
  },
  {
    title: 'Time Off',
    url: '/dashboard/timeoff',
    icon: 'userPen',
    shortcut: ['t', 'o'],
    contextId: 'hr',
    appId: 'timeoff',
    priority: 52,
    items: [
      {
        title: 'Requests',
        url: '/dashboard/timeoff/requests',
        contextId: 'hr',
        appId: 'timeoff',
        items: [
          {
            title: 'Pending Approval',
            url: '/dashboard/timeoff/requests/pending',
            contextId: 'hr',
            appId: 'timeoff'
          },
          {
            title: 'Approved Requests',
            url: '/dashboard/timeoff/requests/approved',
            contextId: 'hr',
            appId: 'timeoff'
          },
          {
            title: 'Denied Requests',
            url: '/dashboard/timeoff/requests/denied',
            contextId: 'hr',
            appId: 'timeoff'
          }
        ]
      },
      {
        title: 'Calendar',
        url: '/dashboard/timeoff/calendar',
        contextId: 'hr',
        appId: 'timeoff',
        items: [
          {
            title: 'Team Calendar',
            url: '/dashboard/timeoff/calendar/team',
            contextId: 'hr',
            appId: 'timeoff'
          },
          {
            title: 'Department Calendar',
            url: '/dashboard/timeoff/calendar/department',
            contextId: 'hr',
            appId: 'timeoff'
          },
          {
            title: 'Company Calendar',
            url: '/dashboard/timeoff/calendar/company',
            contextId: 'hr',
            appId: 'timeoff'
          }
        ]
      },
      {
        title: 'Policies',
        url: '/dashboard/timeoff/policies',
        contextId: 'hr',
        appId: 'timeoff',
        items: [
          {
            title: 'Vacation Policy',
            url: '/dashboard/timeoff/policies/vacation',
            contextId: 'hr',
            appId: 'timeoff'
          },
          {
            title: 'Sick Leave Policy',
            url: '/dashboard/timeoff/policies/sick',
            contextId: 'hr',
            appId: 'timeoff'
          },
          {
            title: 'Holiday Schedule',
            url: '/dashboard/timeoff/policies/holidays',
            contextId: 'hr',
            appId: 'timeoff'
          }
        ]
      }
    ]
  },
  {
    title: 'Appraisals',
    url: '/dashboard/appraisals',
    icon: 'chart',
    shortcut: ['a', 'p'],
    contextId: 'hr',
    appId: 'appraisals',
    priority: 53,
    items: [
      {
        title: 'Review Cycles',
        url: '/dashboard/appraisals/cycles',
        contextId: 'hr',
        appId: 'appraisals',
        items: [
          {
            title: 'Current Cycle',
            url: '/dashboard/appraisals/cycles/current',
            contextId: 'hr',
            appId: 'appraisals'
          },
          {
            title: 'Past Cycles',
            url: '/dashboard/appraisals/cycles/past',
            contextId: 'hr',
            appId: 'appraisals'
          },
          {
            title: 'Upcoming Cycles',
            url: '/dashboard/appraisals/cycles/upcoming',
            contextId: 'hr',
            appId: 'appraisals'
          }
        ]
      },
      {
        title: 'Templates',
        url: '/dashboard/appraisals/templates',
        contextId: 'hr',
        appId: 'appraisals',
        items: [
          {
            title: 'Performance Templates',
            url: '/dashboard/appraisals/templates/performance',
            contextId: 'hr',
            appId: 'appraisals'
          },
          {
            title: '360 Feedback Templates',
            url: '/dashboard/appraisals/templates/360',
            contextId: 'hr',
            appId: 'appraisals'
          },
          {
            title: 'Self-Assessment Templates',
            url: '/dashboard/appraisals/templates/self',
            contextId: 'hr',
            appId: 'appraisals'
          }
        ]
      },
      {
        title: 'Reports',
        url: '/dashboard/appraisals/reports',
        contextId: 'hr',
        appId: 'appraisals',
        items: [
          {
            title: 'Individual Reports',
            url: '/dashboard/appraisals/reports/individual',
            contextId: 'hr',
            appId: 'appraisals'
          },
          {
            title: 'Team Reports',
            url: '/dashboard/appraisals/reports/team',
            contextId: 'hr',
            appId: 'appraisals'
          },
          {
            title: 'Trend Analysis',
            url: '/dashboard/appraisals/reports/trends',
            contextId: 'hr',
            appId: 'appraisals'
          }
        ]
      }
    ]
  },
  {
    title: 'Marketing Automation',
    url: '/dashboard/marketing/automation',
    icon: 'refresh',
    shortcut: ['m', 'a'],
    contextId: 'marketing',
    appId: 'marketing',
    priority: 60,
    items: [
      {
        title: 'Campaigns',
        url: '/dashboard/marketing/automation/campaigns',
        contextId: 'marketing',
        appId: 'marketing',
        items: [
          {
            title: 'Active Campaigns',
            url: '/dashboard/marketing/automation/campaigns/active',
            contextId: 'marketing',
            appId: 'marketing'
          },
          {
            title: 'Scheduled Campaigns',
            url: '/dashboard/marketing/automation/campaigns/scheduled',
            contextId: 'marketing',
            appId: 'marketing'
          },
          {
            title: 'Completed Campaigns',
            url: '/dashboard/marketing/automation/campaigns/completed',
            contextId: 'marketing',
            appId: 'marketing'
          }
        ]
      },
      {
        title: 'Workflows',
        url: '/dashboard/marketing/automation/workflows',
        contextId: 'marketing',
        appId: 'marketing',
        items: [
          {
            title: 'Lead Nurturing',
            url: '/dashboard/marketing/automation/workflows/lead',
            contextId: 'marketing',
            appId: 'marketing'
          },
          {
            title: 'Customer Onboarding',
            url: '/dashboard/marketing/automation/workflows/onboarding',
            contextId: 'marketing',
            appId: 'marketing'
          },
          {
            title: 'Re-engagement',
            url: '/dashboard/marketing/automation/workflows/reengagement',
            contextId: 'marketing',
            appId: 'marketing'
          }
        ]
      },
      {
        title: 'Analytics',
        url: '/dashboard/marketing/automation/analytics',
        contextId: 'marketing',
        appId: 'marketing',
        items: [
          {
            title: 'Performance Metrics',
            url: '/dashboard/marketing/automation/analytics/performance',
            contextId: 'marketing',
            appId: 'marketing'
          },
          {
            title: 'Conversion Rates',
            url: '/dashboard/marketing/automation/analytics/conversion',
            contextId: 'marketing',
            appId: 'marketing'
          },
          {
            title: 'ROI Reporting',
            url: '/dashboard/marketing/automation/analytics/roi',
            contextId: 'marketing',
            appId: 'marketing'
          }
        ]
      }
    ]
  },
  {
    title: 'Discuss',
    url: '/dashboard/discuss',
    icon: 'help',
    shortcut: ['d', 'i'],
    contextId: 'productivity',
    appId: 'discuss',
    priority: 80,
    items: [
      {
        title: 'Channels',
        url: '/dashboard/discuss/channels',
        contextId: 'productivity',
        appId: 'discuss',
        items: [
          {
            title: 'Team Channels',
            url: '/dashboard/discuss/channels/team',
            contextId: 'productivity',
            appId: 'discuss'
          },
          {
            title: 'Project Channels',
            url: '/dashboard/discuss/channels/project',
            contextId: 'productivity',
            appId: 'discuss'
          },
          {
            title: 'Private Channels',
            url: '/dashboard/discuss/channels/private',
            contextId: 'productivity',
            appId: 'discuss'
          }
        ]
      },
      {
        title: 'Direct Messages',
        url: '/dashboard/discuss/direct',
        contextId: 'productivity',
        appId: 'discuss',
        items: [
          {
            title: 'Recent Messages',
            url: '/dashboard/discuss/direct/recent',
            contextId: 'productivity',
            appId: 'discuss'
          },
          {
            title: 'Starred Conversations',
            url: '/dashboard/discuss/direct/starred',
            contextId: 'productivity',
            appId: 'discuss'
          },
          {
            title: 'Message Requests',
            url: '/dashboard/discuss/direct/requests',
            contextId: 'productivity',
            appId: 'discuss'
          }
        ]
      },
      {
        title: 'Settings',
        url: '/dashboard/discuss/settings',
        contextId: 'productivity',
        appId: 'discuss',
        items: [
          {
            title: 'Notifications',
            url: '/dashboard/discuss/settings/notifications',
            contextId: 'productivity',
            appId: 'discuss'
          },
          {
            title: 'Integrations',
            url: '/dashboard/discuss/settings/integrations',
            contextId: 'productivity',
            appId: 'discuss'
          },
          {
            title: 'Privacy',
            url: '/dashboard/discuss/settings/privacy',
            contextId: 'productivity',
            appId: 'discuss'
          }
        ]
      }
    ]
  },
  {
    title: 'Studio',
    url: '/dashboard/studio',
    icon: 'settings',
    shortcut: ['s', 't'],
    contextId: 'customization',
    appId: 'studio',
    priority: 90,
    items: [
      {
        title: 'App Builder',
        url: '/dashboard/studio/app-builder',
        contextId: 'customization',
        appId: 'studio',
        items: [
          {
            title: 'My Apps',
            url: '/dashboard/studio/app-builder/my-apps',
            contextId: 'customization',
            appId: 'studio'
          },
          {
            title: 'Templates',
            url: '/dashboard/studio/app-builder/templates',
            contextId: 'customization',
            appId: 'studio'
          },
          {
            title: 'Components',
            url: '/dashboard/studio/app-builder/components',
            contextId: 'customization',
            appId: 'studio'
          }
        ]
      },
      {
        title: 'Automation',
        url: '/dashboard/studio/automation',
        contextId: 'customization',
        appId: 'studio',
        items: [
          {
            title: 'Workflows',
            url: '/dashboard/studio/automation/workflows',
            contextId: 'customization',
            appId: 'studio'
          },
          {
            title: 'Actions',
            url: '/dashboard/studio/automation/actions',
            contextId: 'customization',
            appId: 'studio'
          },
          {
            title: 'Triggers',
            url: '/dashboard/studio/automation/triggers',
            contextId: 'customization',
            appId: 'studio'
          }
        ]
      },
      {
        title: 'Code Studio',
        url: '/dashboard/studio/code',
        contextId: 'customization',
        appId: 'studio',
        items: [
          {
            title: 'Scripts',
            url: '/dashboard/studio/code/scripts',
            contextId: 'customization',
            appId: 'studio'
          },
          {
            title: 'API Integration',
            url: '/dashboard/studio/code/api',
            contextId: 'customization',
            appId: 'studio'
          },
          {
            title: 'Custom Widgets',
            url: '/dashboard/studio/code/widgets',
            contextId: 'customization',
            appId: 'studio'
          }
        ]
      }
    ]
  }
];
