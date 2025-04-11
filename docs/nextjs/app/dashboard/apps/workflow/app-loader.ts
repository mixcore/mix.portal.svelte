'use client';

import { getNodeTypes, getNodeCategories } from './lib/nodeRegistry';

// Default app configuration
const appConfig = {
  settings: {
    executionLimit: 100,
    loopLimit: 10,
    logLevel: 'info'
  },
  ui: {
    layout: {
      fluid: true
    },
    theme: {
      light: true,
      dark: true,
      custom: false
    }
  }
};

// Initialize the app
export async function initializeApp(): Promise<boolean> {
  try {
    console.log('Initializing Workflow Automation app...');
    
    // Register and load node types (already done in nodeRegistry.ts)
    const nodeTypes = getNodeTypes();
    const nodeCategories = getNodeCategories();
    console.log(`Registered ${Object.keys(nodeTypes).length} node types in ${nodeCategories.length} categories`);
    
    // Check if templates exist
    let templates = [];
    try {
      const storedTemplates = localStorage.getItem('mixcore_workflow_templates');
      if (!storedTemplates) {
        // Fetch templates from API
        const response = await fetch('/api/workflow/templates');
        if (response.ok) {
          templates = await response.json();
          localStorage.setItem('mixcore_workflow_templates', JSON.stringify(templates));
          console.log(`Loaded ${templates.length} workflow templates`);
        }
      } else {
        templates = JSON.parse(storedTemplates);
        console.log(`Found ${templates.length} cached workflow templates`);
      }
    } catch (err) {
      console.error('Failed to load templates:', err);
    }
    
    // Initialize empty workflows array if not exists
    if (!localStorage.getItem('mixcore_workflows')) {
      localStorage.setItem('mixcore_workflows', JSON.stringify([]));
    }
    
    console.log('Workflow Automation app initialized successfully');
    return true;
  } catch (err) {
    console.error('Failed to initialize Workflow Automation app:', err);
    return false;
  }
}

// Get app configuration
export function getAppConfig() {
  return appConfig;
} 