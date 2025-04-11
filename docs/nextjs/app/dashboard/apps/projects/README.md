# Projects Management Mini-App

This is a Microsoft Project-like project management application for Mixcore CMS. It provides comprehensive project management features including project listing, task management, Gantt charts, board views, and calendar views.

## Features

- Project dashboard with project listings and progress tracking
- Task management with priorities, assignments, and status tracking
- Gantt chart for timeline visualization
- Kanban board for task management
- Calendar view for scheduling
- Full-width layout support
- Deep linking and URL parameter support

## Deep Linking Support

The Projects app supports deep linking, allowing users to directly navigate to specific views and projects via URL parameters. This makes it easy to share links to specific projects or views with team members.

### URL Parameters

The following URL parameters are supported:

- `view`: The view to display (projects, tasks, gantt, board, calendar)
- `projectId`: The ID of the selected project (when in tasks view)

### Example URLs

- View all projects: `/dashboard/apps/projects?view=projects`
- View a specific project's tasks: `/dashboard/apps/projects?view=tasks&projectId=p1`
- View Gantt chart: `/dashboard/apps/projects?view=gantt`
- View Kanban board: `/dashboard/apps/projects?view=board`
- View calendar: `/dashboard/apps/projects?view=calendar`

### Sharing Links

The app provides several ways to share links:

1. **Share button in header**: Copies the current view URL to clipboard
2. **Copy View Link in view tabs**: Copies the current view URL
3. **Link buttons in views**: Each view has a link button to copy a direct link to that view

### Programmatic Deep Linking

For developers, the app provides a utility function to generate deep links programmatically:

```tsx
// Get current state as deep link
const deepLink = getDeepLink();

// Get link to specific view
const projectsLink = getDeepLink('projects');
const tasksLink = getDeepLink('tasks', 'p1'); // With project ID
const ganttLink = getDeepLink('gantt');
```

## Layout Modes

The app supports two layout modes:

1. **Normal View**: The app is displayed within the dashboard container
2. **Full Width**: The app expands to use the full width of the screen

The layout mode can be toggled using the button in the top-right corner of the app. The default layout mode is controlled by the `ui.layout.fluid` setting in the app configuration.

## Implementation Details

Deep linking is implemented using the Next.js router and URL parameters:

- The app reads URL parameters on initial load and whenever they change
- When changing views or selecting projects, the URL is updated using `history.replaceState`
- The app syncs its internal state with URL parameters using React effects

This approach ensures that:
- URLs can be shared and bookmarked
- Browser back/forward navigation works correctly
- The app state is always in sync with the URL

## Configuration

Deep linking behavior can be configured in the app's configuration file:

```json
{
  "settings": {
    "enableFullScreenByDefault": false
  },
  "ui": {
    "layout": {
      "fluid": true
    }
  }
}
```

- `enableFullScreenByDefault`: Controls whether the app uses full-screen mode by default
- `ui.layout.fluid`: Controls whether the app uses fluid layout by default

## Usage

To use deep linking in your code:

```tsx
import { useSearchParams } from 'next/navigation';

function MyComponent() {
  const searchParams = useSearchParams();
  const view = searchParams.get('view');
  const projectId = searchParams.get('projectId');
  
  // Use parameters to control component state
}
```

## Installation

The Projects mini-app comes bundled with Mixcore CMS. It will be automatically initialized when first accessed.

## Configuration

The app can be configured through the `app.config.json` file in the `config` directory. Key configuration options include:

- `enableFullScreenByDefault`: Whether to open in full-screen mode by default
- `ganttDefaultView`: Default view mode for the Gantt chart
- `calendarFirstDayOfWeek`: First day of the week for the calendar view (0 = Sunday)
- Various UI and display settings

## Development

### Directory Structure

```
/src/app/dashboard/apps/projects
├── app-globals.css          # App-specific styles
├── app-loader.ts            # App initialization module
├── index.tsx                # Main entry point
├── config/                  # Configuration files
│   ├── app.config.json      # App configuration
│   ├── demo-data.json       # Sample data for initialization
│   └── mixdb.schema.json    # MixDB schema definition
├── components/              # UI components
│   ├── GanttView.tsx        # Gantt chart view
│   ├── ProjectList.tsx      # Projects list view
│   ├── Task.tsx             # Task component
│   └── ...
├── hooks/                   # Custom React hooks
│   └── useContainerStatus.ts # Container status detection
├── layouts/                 # Layout components
│   └── AppShell.tsx         # Main app shell layout
└── lib/                     # Utilities and data
    ├── mockData.ts          # Sample data for development
    └── types.ts             # TypeScript type definitions
```

### Adding New Features

1. Create new components in the `components` directory
2. Update the schema in `config/mixdb.schema.json` if adding new data structures
3. Add new views by extending the `ViewType` type and adding a new case in the `renderView` function

### Styling

- App-specific styles are defined in `app-globals.css`
- The app uses Tailwind CSS for styling
- Dark mode is supported through CSS variables

## MixDB Integration

The app creates the following collections in MixDB:

- `projects`: Project records
- `tasks`: Task records
- `team_members`: Team member assignments

## Permissions

The app registers the following permissions:

- `projects.view`: View project listings and details
- `projects.create`: Create new projects
- `projects.edit`: Edit existing projects
- `projects.delete`: Delete projects
- `tasks.view`: View task listings and details
- `tasks.create`: Create new tasks
- `tasks.edit`: Edit existing tasks
- `tasks.delete`: Delete tasks

## Dashboard Integration

### Breadcrumbs Integration

The Projects mini-app integrates with the Mixcore dashboard's breadcrumb system to provide contextual navigation. Breadcrumbs are updated dynamically based on the current view and selected project.

#### Breadcrumb Structure

The breadcrumb structure follows this pattern:

- Dashboard > Apps > Projects > [View Name] > [Project Name]

For example:
- Dashboard > Apps > Projects (when viewing the projects list)
- Dashboard > Apps > Projects > Tasks > Website Redesign (when viewing tasks for a specific project)
- Dashboard > Apps > Projects > Gantt (when viewing the Gantt chart)

#### Implementation

Breadcrumb integration is implemented through:

1. **useBreadcrumb Hook**: A custom hook that dispatches events to update the dashboard's breadcrumb component
2. **AppShell Integration**: The AppShell component updates breadcrumbs whenever the view or selected project changes
3. **Event-Based Communication**: Custom events allow the mini-app to communicate with the dashboard header

```tsx
// Example of breadcrumb integration in AppShell
useEffect(() => {
  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Apps', href: '/dashboard/apps' },
    { label: 'Projects', href: '/dashboard/apps/projects' }
  ];

  if (activeView !== 'projects') {
    breadcrumbs.push({ 
      label: viewLabel, 
      href: `/dashboard/apps/projects?view=${activeView}` 
    });
  }

  if (selectedProjectId && selectedProjectTitle) {
    breadcrumbs.push({ 
      label: selectedProjectTitle, 
      href: `/dashboard/apps/projects?view=tasks&projectId=${selectedProjectId}` 
    });
  }

  setBreadcrumbs(breadcrumbs);
}, [activeView, selectedProjectId]);
```

### Dashboard Header Integration

The mini-app works seamlessly with the dashboard header, adapting its UI to maintain a cohesive experience:

1. **Full-Width Toggle**: The app can switch between contained mode and full-width mode
2. **Contextual Navigation**: The breadcrumb trail provides context about the current view
3. **App Icon and Title**: Displays the app icon and title in the header
4. **Sharing**: Provides sharing capabilities through the dashboard's sharing interface

This integration ensures users have a consistent experience when navigating between the dashboard and the Projects mini-app.

## License

MIT 