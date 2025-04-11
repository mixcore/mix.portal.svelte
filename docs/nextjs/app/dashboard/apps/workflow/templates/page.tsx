'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Search, MessagesSquare, Database, Filter, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Sample templates data
const templates = [
  {
    id: 'whatsapp-support',
    title: 'WhatsApp Customer Support',
    description: 'Automate product training & customer support via WhatsApp, GPT-4 & Google Sheets',
    category: 'Support',
    tags: ['AI', 'WhatsApp', 'Automation'],
    image: '/images/workflow-templates/whatsapp-support.png',
    author: 'Mixcore',
    nodes: 15,
    connections: 18
  },
  {
    id: 'data-processing',
    title: 'Data Processing Pipeline',
    description: 'Extract, transform and load data between different systems automatically',
    category: 'Data',
    tags: ['ETL', 'Database', 'API'],
    image: '/images/workflow-templates/data-pipeline.png',
    author: 'Mixcore',
    nodes: 8,
    connections: 10
  },
  {
    id: 'social-monitoring',
    title: 'Social Media Monitoring',
    description: 'Track mentions and engage with customers across multiple platforms',
    category: 'Marketing',
    tags: ['Social', 'Monitoring', 'Engagement'],
    image: '/images/workflow-templates/social-monitor.png',
    author: 'Mixcore',
    nodes: 12,
    connections: 15
  },
  {
    id: 'lead-generation',
    title: 'Lead Generation & Nurturing',
    description: 'Capture leads from your website and nurture them with automated follow-ups',
    category: 'Marketing',
    tags: ['Leads', 'Email', 'Forms'],
    image: '/images/workflow-templates/lead-generation.png',
    author: 'Mixcore',
    nodes: 10,
    connections: 12
  },
  {
    id: 'webhook-handler',
    title: 'Advanced Webhook Handler',
    description: 'Process webhook events from multiple services with customizable logic',
    category: 'Integration',
    tags: ['Webhook', 'API', 'Integration'],
    image: '/images/workflow-templates/webhook-handler.png',
    author: 'Mixcore',
    nodes: 6,
    connections: 7
  },
  {
    id: 'document-approval',
    title: 'Document Approval Workflow',
    description: 'Route documents for review and approval with notifications and tracking',
    category: 'Business',
    tags: ['Document', 'Approval', 'Notification'],
    image: '/images/workflow-templates/document-approval.png',
    author: 'Mixcore',
    nodes: 14,
    connections: 16
  },
  {
    id: 'ai-summarizer',
    title: 'AI Content Summarizer',
    description: 'Automatically analyze and summarize articles, reports, and other content',
    category: 'AI',
    tags: ['AI', 'Content', 'Summarization'],
    image: '/images/workflow-templates/ai-summarizer.png',
    author: 'Mixcore',
    nodes: 7,
    connections: 8
  },
  {
    id: 'inventory-sync',
    title: 'Inventory Sync',
    description: 'Keep inventory in sync across multiple platforms and marketplaces',
    category: 'E-commerce',
    tags: ['Inventory', 'Sync', 'E-commerce'],
    image: '/images/workflow-templates/inventory-sync.png',
    author: 'Mixcore',
    nodes: 13,
    connections: 15
  }
];

// Sample categories for filtering
const categories = [
  { name: 'All', count: templates.length },
  { name: 'Support', count: 1 },
  { name: 'Marketing', count: 2 },
  { name: 'Integration', count: 1 },
  { name: 'Business', count: 1 },
  { name: 'AI', count: 1 },
  { name: 'E-commerce', count: 1 },
  { name: 'Data', count: 1 }
];

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Filter templates based on search query and selected category
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = searchQuery === '' || 
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <div className="mb-6">
        <Link 
          href="/dashboard/apps?app=workflow" 
          className="flex items-center text-muted-foreground hover:text-primary transition-colors mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Workflow App
        </Link>
        
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Workflow Templates</h1>
          <Button asChild>
            <Link href="/dashboard/apps/workflow/editor/new">Create Your Own</Link>
          </Button>
        </div>
        <p className="text-muted-foreground mt-1">
          Browse and use pre-built workflow templates to automate your business processes
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar with filters */}
        <div className="w-full md:w-64">
          <div className="bg-card rounded-lg border p-4">
            <h2 className="font-medium mb-3 flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Category</h3>
                <div className="space-y-1">
                  {categories.map(category => (
                    <button
                      key={category.name}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`w-full text-left px-2 py-1 rounded text-sm flex justify-between items-center ${
                        selectedCategory === category.name ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'
                      }`}
                    >
                      <span>{category.name}</span>
                      <Badge variant="secondary" className="ml-1">
                        {category.count}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Complexity</h3>
                <div className="flex items-center">
                  <SlidersHorizontal className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Any complexity</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="flex-1">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search templates..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Templates</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="recent">Recently Added</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              {filteredTemplates.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium">No templates found</h3>
                  <p className="text-muted-foreground mt-1">Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTemplates.map((template) => (
                    <Link href={`/dashboard/apps/workflow/templates/${template.id}`} key={template.id}>
                      <Card className="overflow-hidden border hover:shadow-md transition-shadow h-full">
                        <div className="relative h-40 bg-slate-100 overflow-hidden">
                          {/* Workflow diagram representation */}
                          <div className="absolute inset-0 opacity-80 bg-gradient-to-tr from-blue-50 to-indigo-50">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary opacity-20"></div>
                            <div className="absolute top-1/4 left-1/4 w-8 h-8 rounded-full bg-blue-400 opacity-20"></div>
                            <div className="absolute bottom-1/4 right-1/4 w-8 h-8 rounded-full bg-indigo-400 opacity-20"></div>
                            <div className="absolute top-1/3 right-1/3 w-6 h-6 rounded-full bg-green-400 opacity-20"></div>
                            <div className="absolute bottom-1/3 left-1/3 w-6 h-6 rounded-full bg-purple-400 opacity-20"></div>
                            {/* Connection lines */}
                            <div className="absolute top-1/2 left-1/2 w-20 h-1 bg-gray-300 opacity-30 -rotate-45 -translate-x-10 -translate-y-2"></div>
                            <div className="absolute top-1/2 left-1/2 w-20 h-1 bg-gray-300 opacity-30 rotate-45 -translate-x-10 -translate-y-2"></div>
                            <div className="absolute top-1/3 left-1/3 w-15 h-1 bg-gray-300 opacity-30 rotate-90 -translate-x-5"></div>
                          </div>
                          <div className="absolute bottom-2 right-2">
                            <div className="flex items-center text-xs text-muted-foreground">
                              <span className="flex items-center mr-2"><MessagesSquare className="h-3 w-3 mr-1" />{template.nodes}</span>
                              <span className="flex items-center"><Database className="h-3 w-3 mr-1" />{template.connections}</span>
                            </div>
                          </div>
                        </div>
                        
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg font-medium">{template.title}</CardTitle>
                            <Badge variant="secondary" className="ml-2">{template.category}</Badge>
                          </div>
                          <CardDescription className="text-sm mt-1">
                            {template.description}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="pb-2">
                          <div className="flex flex-wrap gap-1">
                            {template.tags.map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                            ))}
                          </div>
                        </CardContent>
                        
                        <CardFooter className="flex justify-between items-center pt-2">
                          <div className="text-xs text-muted-foreground">
                            By {template.author}
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                            <Button size="sm" variant="default" asChild>
                              <Link href={`/dashboard/apps/workflow/editor/new?template=${template.id}`}>
                                Use
                              </Link>
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="popular" className="mt-6">
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">Popular templates coming soon</h3>
                <p className="text-muted-foreground mt-1">Check back for our most popular workflows</p>
              </div>
            </TabsContent>
            
            <TabsContent value="recent" className="mt-6">
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">Recently added templates coming soon</h3>
                <p className="text-muted-foreground mt-1">We're adding new templates regularly</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 