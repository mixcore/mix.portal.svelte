import { NextResponse } from 'next/server';

// Sample template data
const templates = [
  {
    name: "Content Publishing Workflow",
    description: "Automated workflow for content review and publishing",
    category: "Content Management",
    featured: true,
    nodes: [
      {
        id: "node-1",
        type: "default",
        position: { x: 100, y: 100 },
        data: {
          type: "trigger.schedule",
          label: "Daily Check",
          properties: {
            schedule: "0 9 * * *",
            name: "Daily Check"
          }
        }
      },
      {
        id: "node-2",
        type: "default",
        position: { x: 400, y: 100 },
        data: {
          type: "database.query",
          label: "Query Draft Posts",
          properties: {
            collection: "posts",
            query: {
              status: "draft",
              scheduledPublish: { "$lte": "now" }
            }
          }
        }
      },
      {
        id: "node-3",
        type: "default",
        position: { x: 700, y: 100 },
        data: {
          type: "logic.foreach",
          label: "Process Each Post",
          properties: {}
        }
      },
      {
        id: "node-4",
        type: "default",
        position: { x: 1000, y: 100 },
        data: {
          type: "database.update",
          label: "Publish Post",
          properties: {
            collection: "posts",
            update: {
              status: "published",
              publishedAt: "now"
            }
          }
        }
      },
      {
        id: "node-5",
        type: "default",
        position: { x: 1300, y: 100 },
        data: {
          type: "notification.send",
          label: "Send Notification",
          properties: {
            channel: "system",
            template: "content-published"
          }
        }
      }
    ],
    edges: [
      { id: "edge-1-2", source: "node-1", target: "node-2", sourceHandle: "output", targetHandle: "input" },
      { id: "edge-2-3", source: "node-2", target: "node-3", sourceHandle: "output", targetHandle: "input" },
      { id: "edge-3-4", source: "node-3", target: "node-4", sourceHandle: "item", targetHandle: "input" },
      { id: "edge-4-5", source: "node-4", target: "node-5", sourceHandle: "output", targetHandle: "input" }
    ]
  },
  {
    name: "Form Submission Processing",
    description: "Process form submissions with data validation and notification",
    category: "Forms",
    featured: true,
    nodes: [
      {
        id: "node-1",
        type: "default",
        position: { x: 100, y: 100 },
        data: {
          type: "trigger.webhook",
          label: "Form Submission",
          properties: {
            path: "/api/forms/contact",
            method: "POST"
          }
        }
      },
      {
        id: "node-2",
        type: "default",
        position: { x: 400, y: 100 },
        data: {
          type: "logic.conditional",
          label: "Validate Form",
          properties: {
            condition: "return input.email && input.name && input.message;"
          }
        }
      },
      {
        id: "node-3",
        type: "default",
        position: { x: 700, y: 100 },
        data: {
          type: "database.update",
          label: "Store Submission",
          properties: {
            collection: "form_submissions",
            update: {}
          }
        }
      },
      {
        id: "node-4",
        type: "default",
        position: { x: 1000, y: 100 },
        data: {
          type: "http.request",
          label: "Send Email",
          properties: {
            url: "https://api.example.com/send-email",
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            }
          }
        }
      }
    ],
    edges: [
      { id: "edge-1-2", source: "node-1", target: "node-2", sourceHandle: "output", targetHandle: "input" },
      { id: "edge-2-3", source: "node-2", target: "node-3", sourceHandle: "true", targetHandle: "input" },
      { id: "edge-3-4", source: "node-3", target: "node-4", sourceHandle: "output", targetHandle: "input" }
    ]
  },
  {
    name: "Data Synchronization",
    description: "Sync data between Mixcore and an external API",
    category: "Integration",
    featured: false,
    nodes: [
      {
        id: "node-1",
        type: "default",
        position: { x: 100, y: 100 },
        data: {
          type: "trigger.schedule",
          label: "Every 2 hours",
          properties: {
            schedule: "0 */2 * * *",
            name: "Every 2 hours"
          }
        }
      },
      {
        id: "node-2",
        type: "default",
        position: { x: 400, y: 100 },
        data: {
          type: "http.request",
          label: "Fetch External Data",
          properties: {
            url: "https://api.example.com/data",
            method: "GET",
            headers: {
              "Authorization": "Bearer {{env.API_KEY}}"
            }
          }
        }
      },
      {
        id: "node-3",
        type: "default",
        position: { x: 700, y: 100 },
        data: {
          type: "logic.foreach",
          label: "Process Each Item",
          properties: {}
        }
      },
      {
        id: "node-4",
        type: "default",
        position: { x: 1000, y: 100 },
        data: {
          type: "database.update",
          label: "Update Database",
          properties: {
            collection: "synced_items",
            update: {}
          }
        }
      }
    ],
    edges: [
      { id: "edge-1-2", source: "node-1", target: "node-2", sourceHandle: "output", targetHandle: "input" },
      { id: "edge-2-3", source: "node-2", target: "node-3", sourceHandle: "output", targetHandle: "input" },
      { id: "edge-3-4", source: "node-3", target: "node-4", sourceHandle: "item", targetHandle: "input" }
    ]
  }
];

export async function GET() {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return NextResponse.json(templates);
} 