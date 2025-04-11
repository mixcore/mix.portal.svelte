'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Info, Download, Play, Copy, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';

// Template data for WhatsApp Customer Support workflow
const templateData = {
  id: 'whatsapp-support',
  name: 'WhatsApp Customer Support',
  description: 'Automate product training & customer support via WhatsApp, GPT-4 & Google Sheets',
  longDescription: 'This workflow automates both product data collection and customer support via WhatsApp. When a message starts with "train:", it extracts a URL, fetches content, and uses AI to structure product information. For regular messages, it provides intelligent customer support backed by product data.',
  version: '1.0.0',
  author: 'Mixcore',
  category: 'Support',
  tags: ['AI', 'WhatsApp', 'Automation', 'GPT-4', 'Google Sheets'],
  stats: {
    nodes: 15,
    connections: 18,
    downloads: 245,
    rating: 4.8
  },
  prerequisites: [
    'WhatsApp Business API account',
    'OpenAI API Key (for GPT-4)',
    'Google Sheets account',
    'Mixcore account with Workflow app enabled'
  ],
  steps: [
    {
      title: 'Set up WhatsApp connection',
      description: 'Connect your WhatsApp Business API to receive and send messages automatically.'
    },
    {
      title: 'Configure Google Sheets',
      description: 'Create a spreadsheet with "Products" and "Customer Issues" tabs to store data.'
    },
    {
      title: 'Add OpenAI integration',
      description: 'Connect your OpenAI API key for AI-powered content analysis and responses.'
    },
    {
      title: 'Customize prompts',
      description: 'Adjust the AI prompts to match your product terminology and support style.'
    }
  ]
};

// Mock nodes and edges to represent the workflow
const initialNodes = [
  {
    id: '1',
    type: 'default',
    data: { 
      label: 'WhatsApp Trigger', 
      type: 'trigger.webhook',
      icon: 'webhook'
    },
    position: { x: 50, y: 150 },
    className: 'workflow-node trigger-node'
  },
  {
    id: '2',
    type: 'default',
    data: { 
      label: 'Message Router', 
      type: 'logic.conditional',
      icon: 'branch'
    },
    position: { x: 250, y: 150 },
    className: 'workflow-node logic-node'
  },
  {
    id: '3',
    type: 'default',
    data: { 
      label: 'Extract URL', 
      type: 'text.extract',
      icon: 'edit'
    },
    position: { x: 450, y: 50 },
    className: 'workflow-node text-node'
  },
  {
    id: '4',
    type: 'default',
    data: { 
      label: 'Fetch HTML', 
      type: 'http.request',
      icon: 'globe'
    },
    position: { x: 650, y: 50 },
    className: 'workflow-node http-node'
  },
  {
    id: '5',
    type: 'default',
    data: { 
      label: 'Clean Content', 
      type: 'text.process',
      icon: 'edit'
    },
    position: { x: 850, y: 50 },
    className: 'workflow-node text-node'
  },
  {
    id: '6',
    type: 'default',
    data: { 
      label: 'Save Raw Data', 
      type: 'sheets.append',
      icon: 'database'
    },
    position: { x: 450, y: 250 },
    className: 'workflow-node database-node'
  },
  {
    id: '7',
    type: 'default',
    data: { 
      label: 'GPT-4 Analysis', 
      type: 'ai.complete',
      icon: 'brain'
    },
    position: { x: 650, y: 250 },
    className: 'workflow-node ai-node'
  },
  {
    id: '8',
    type: 'default',
    data: { 
      label: 'Update Sheet', 
      type: 'sheets.update',
      icon: 'database'
    },
    position: { x: 850, y: 250 },
    className: 'workflow-node database-node'
  },
  {
    id: '9',
    type: 'default',
    data: { 
      label: 'WhatsApp Reply', 
      type: 'whatsapp.send',
      icon: 'message'
    },
    position: { x: 1050, y: 150 },
    className: 'workflow-node message-node'
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3', animated: true, label: 'Train', className: 'edge-label' },
  { id: 'e2-6', source: '2', target: '6', animated: true, label: 'Support', className: 'edge-label' },
  { id: 'e3-4', source: '3', target: '4' },
  { id: 'e4-5', source: '4', target: '5' },
  { id: 'e5-6', source: '5', target: '6' },
  { id: 'e6-7', source: '6', target: '7' },
  { id: 'e7-8', source: '7', target: '8' },
  { id: 'e8-9', source: '8', target: '9' },
  { id: 'e6-9', source: '6', target: '9', type: 'step' },
];

export default function WhatsAppTemplateDetailPage() {
  const [nodes] = useState(initialNodes);
  const [edges] = useState(initialEdges);
  
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
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{templateData.name}</h1>
            <div className="flex items-center mt-1 text-muted-foreground">
              <span>By {templateData.author}</span>
              <div className="mx-2">•</div>
              <span>Version {templateData.version}</span>
              <div className="mx-2">•</div>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 mr-1 fill-yellow-400" />
                <span>{templateData.stats.rating}/5</span>
              </div>
              <div className="mx-2">•</div>
              <span>{templateData.stats.downloads} downloads</span>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="secondary">{templateData.category}</Badge>
              {templateData.tags.map((tag) => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Copy className="h-4 w-4 mr-2" />
              Clone
            </Button>
            <Button variant="secondary" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button size="sm" asChild>
              <Link href={`/dashboard/apps/workflow/editor/new?template=${templateData.id}`}>
                <Play className="h-4 w-4 mr-2" />
                Use Template
              </Link>
            </Button>
          </div>
        </div>
        
        <p className="mt-4 text-lg">{templateData.longDescription}</p>
      </div>
      
      <div className="h-[600px] border rounded-lg overflow-hidden mb-8 bg-slate-50">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          attributionPosition="bottom-right"
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#aaa" gap={16} />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="pt-6 text-center">
            <div className="mb-4 mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
              <Play className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Use Template</h3>
            <p className="text-muted-foreground mb-4">Start with this pre-built workflow and customize it for your needs.</p>
            <Button size="sm" className="w-full" asChild>
              <Link href={`/dashboard/apps/workflow/editor/new?template=${templateData.id}`}>
                Get Started <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="mb-4 mx-auto bg-slate-100 w-12 h-12 rounded-full flex items-center justify-center">
              <Copy className="h-6 w-6 text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Clone Template</h3>
            <p className="text-muted-foreground mb-4">Make a copy and modify this workflow without affecting the original.</p>
            <Button variant="outline" size="sm" className="w-full">
              Clone Template <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="mb-4 mx-auto bg-slate-100 w-12 h-12 rounded-full flex items-center justify-center">
              <Download className="h-6 w-6 text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Download</h3>
            <p className="text-muted-foreground mb-4">Download this template to import into another Mixcore instance.</p>
            <Button variant="outline" size="sm" className="w-full">
              Download JSON <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="mb-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="setup">Setup Guide</TabsTrigger>
          <TabsTrigger value="use-cases">Use Cases</TabsTrigger>
          <TabsTrigger value="customization">Customization</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div>
                <h2 className="text-xl font-bold mb-2">What This Workflow Does</h2>
                <p>
                  This automated workflow serves two main purposes:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>
                    <strong>Product Training:</strong> When you send a message starting with "train:" followed by a URL, 
                    the workflow will extract product information from the webpage, clean it, and store it in Google Sheets.
                  </li>
                  <li>
                    <strong>Customer Support:</strong> When customers send regular messages, the system uses AI to understand
                    their questions, fetch relevant product data, and provide helpful responses automatically.
                  </li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-xl font-bold mb-2">Key Features</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Automatic URL extraction and web scraping</li>
                  <li>AI-powered content analysis and structured data extraction</li>
                  <li>Intelligent message routing between training and support flows</li>
                  <li>Customer support with access to your product database</li>
                  <li>Automatic issue logging and categorization</li>
                  <li>Seamless WhatsApp integration for messaging</li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-xl font-bold mb-2">How It Works</h2>
                <div className="space-y-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">1</div>
                    <div>
                      <h3 className="font-medium">Incoming Message Detection</h3>
                      <p className="text-muted-foreground">The workflow listens for incoming WhatsApp messages and routes them based on content.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">2</div>
                    <div>
                      <h3 className="font-medium">Product Data Training</h3>
                      <p className="text-muted-foreground">For "train:" messages, it extracts URLs, fetches content, cleans HTML, and saves structured data.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">3</div>
                    <div>
                      <h3 className="font-medium">Customer Support Flow</h3>
                      <p className="text-muted-foreground">For regular messages, AI analyzes the question, fetches relevant product info, and generates a helpful response.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">4</div>
                    <div>
                      <h3 className="font-medium">Response & Logging</h3>
                      <p className="text-muted-foreground">The workflow sends the response back to the user and logs the interaction for future analysis.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-4">Prerequisites</h3>
                  <ul className="space-y-3">
                    {templateData.prerequisites.map((prereq, index) => (
                      <li key={index} className="flex items-start">
                        <Info className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                        <span>{prereq}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="text-xl font-bold mb-4">Stats</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-muted-foreground text-sm">Nodes</div>
                        <div className="text-xl font-bold">{templateData.stats.nodes}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-sm">Connections</div>
                        <div className="text-xl font-bold">{templateData.stats.connections}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-sm">Rating</div>
                        <div className="text-xl font-bold flex items-center">
                          {templateData.stats.rating}
                          <Star className="h-4 w-4 ml-1 text-yellow-400 fill-yellow-400" />
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-sm">Downloads</div>
                        <div className="text-xl font-bold">{templateData.stats.downloads}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="setup" className="mt-4">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Setup Guide</h2>
              <p>Follow these steps to get your WhatsApp Customer Support workflow up and running:</p>
            </div>
            
            {templateData.steps.map((step, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                  
                  <div className="mt-4 p-4 bg-slate-50 rounded-md border">
                    {index === 0 && (
                      <div className="space-y-3">
                        <p className="text-sm">Configure the WhatsApp Business Cloud API integration:</p>
                        <ul className="list-disc pl-6 text-sm space-y-2">
                          <li>Create a Meta developer account</li>
                          <li>Set up a WhatsApp Business API account</li>
                          <li>Generate API credentials and add them to your workflow</li>
                          <li>Configure the webhook URL to point to your workflow</li>
                        </ul>
                      </div>
                    )}
                    
                    {index === 1 && (
                      <div className="space-y-3">
                        <p className="text-sm">Set up your Google Sheets with the correct structure:</p>
                        <ul className="list-disc pl-6 text-sm space-y-2">
                          <li>Create a new Google Sheet with two tabs: "Products" and "Customer Issues"</li>
                          <li>In the Products tab, add columns: Product Link, Product Name, Product Price, Product Description, Product Topic, F&Q</li>
                          <li>In the Customer Issues tab, add columns: Support Problem, Solution, Category</li>
                          <li>Share the spreadsheet with appropriate access rights</li>
                        </ul>
                      </div>
                    )}
                    
                    {index === 2 && (
                      <div className="space-y-3">
                        <p className="text-sm">Connect your OpenAI API:</p>
                        <ul className="list-disc pl-6 text-sm space-y-2">
                          <li>Create an OpenAI account at platform.openai.com</li>
                          <li>Generate an API key with appropriate permissions</li>
                          <li>Add the API key to your workflow configuration</li>
                          <li>Select GPT-4 or a suitable model based on your needs</li>
                        </ul>
                      </div>
                    )}
                    
                    {index === 3 && (
                      <div className="space-y-3">
                        <p className="text-sm">Customize the AI prompts:</p>
                        <ul className="list-disc pl-6 text-sm space-y-2">
                          <li>Edit the system message for the AI assistant to match your brand voice</li>
                          <li>Adjust the data extraction prompts to focus on your specific product attributes</li>
                          <li>Customize the support response templates and issue categorization</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            <div className="mt-8 flex justify-center">
              <Button size="lg" asChild className="gap-2">
                <Link href={`/dashboard/apps/workflow/editor/new?template=${templateData.id}`}>
                  <Play className="h-4 w-4 mr-1" />
                  Use This Template
                </Link>
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="use-cases" className="mt-4">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Perfect For</h2>
              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-medium text-lg mb-2">E-commerce Businesses</h3>
                    <p className="text-muted-foreground">Quickly catalog products and provide instant support for customer inquiries about products, shipping, and returns.</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-medium text-lg mb-2">SaaS Companies</h3>
                    <p className="text-muted-foreground">Maintain an up-to-date knowledge base of features and provide immediate technical support through WhatsApp.</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-medium text-lg mb-2">Service Providers</h3>
                    <p className="text-muted-foreground">Document service offerings and automate booking inquiries, pricing questions, and availability checks.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Real-World Applications</h2>
              
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium text-lg mb-2">Product Catalog Management</h3>
                  <p>When new products are added to your website, simply send a WhatsApp message with "train:" followed by the URL. The workflow automatically extracts key product details, formats them, and adds them to your database.</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium text-lg mb-2">24/7 Customer Support</h3>
                  <p>Even outside business hours, customers can get immediate answers to common questions about your products, with the AI pulling information directly from your product database.</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium text-lg mb-2">Issue Tracking & Analysis</h3>
                  <p>The workflow automatically categorizes customer issues and logs them in your spreadsheet, giving you valuable data on common problems, frequent questions, and potential improvements.</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="customization" className="mt-4">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Customization Options</h2>
              <p>This template is designed to be easily customized for your specific needs:</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mt-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-lg mb-2">Modify Training Trigger</h3>
                <p>Change the "train:" trigger keyword to any prefix that makes sense for your workflow.</p>
                <div className="mt-3 bg-slate-50 p-3 rounded-md text-sm font-mono">
                  trigger_keyword = "train:"
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-lg mb-2">Customize AI Prompts</h3>
                <p>Edit the system messages to match your brand voice and specific data needs.</p>
                <div className="mt-3 bg-slate-50 p-3 rounded-md text-sm font-mono overflow-auto">
                  system_message = "You are a helpful product assistant..."
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-lg mb-2">Add More Data Sources</h3>
                <p>Extend the workflow to pull information from your CRM, knowledge base, or other systems.</p>
                <div className="mt-3 bg-slate-50 p-3 rounded-md text-sm font-mono">
                  // Add CRM integration node
                  crm_connection = createConnection("crm")
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-lg mb-2">Enhance Response Templates</h3>
                <p>Customize how responses are formatted with your branding and style guidelines.</p>
                <div className="mt-3 bg-slate-50 p-3 rounded-md text-sm font-mono">
                  response_template = "Hi {'{'}name{'}'}, thanks for reaching out..."
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h2 className="text-xl font-bold mb-4">Going Further</h2>
              <div className="p-4 bg-slate-50 rounded-lg">
                <h3 className="font-medium text-lg mb-2">Advanced Customizations</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Connect to your own LLM instead of OpenAI for privacy or cost reasons</li>
                  <li>Add real-time translation capabilities for multi-language support</li>
                  <li>Implement sentiment analysis to detect urgent or negative customer feedback</li>
                  <li>Add integration with your ticketing system for escalation of complex issues</li>
                  <li>Implement user authentication to provide personalized responses based on customer history</li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="bg-slate-50 p-6 rounded-lg border mt-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Ready to automate your customer support?</h2>
          <p className="text-lg text-muted-foreground mb-6">Start using this template in your Mixcore Workflow app.</p>
          <Button size="lg" asChild className="gap-2">
            <Link href={`/dashboard/apps/workflow/editor/new?template=${templateData.id}`}>
              <Play className="h-4 w-4 mr-1" />
              Use This Template
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 