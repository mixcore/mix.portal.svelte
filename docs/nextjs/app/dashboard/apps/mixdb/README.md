# MixDB Mini-App

MixDB is a powerful database management system for Mixcore that allows users to create, manage, and query database schemas and data.

## Features

- Create and manage database tables and schemas
- Define custom fields with various data types
- Import/export data in multiple formats
- Visual query builder for complex queries
- Data grid for viewing and editing records
- Role-based access control

## Getting Started

### Prerequisites

- Mixcore Portal with Next.js
- Proper authentication setup

### Usage

1. Navigate to the MixDB app from the dashboard
2. Create a new database table or select an existing one
3. Define fields and relationships
4. Start adding or importing data

## Development

### Directory Structure

```
mixdb/
├── components/        # UI components
├── config/            # Configuration files
├── hooks/             # Custom React hooks
├── layouts/           # Layout components
├── lib/               # Utility functions
├── app-globals.css    # App-specific styles
├── app-loader.ts      # Initialization logic
├── index.tsx          # Main entry point
└── README.md          # Documentation
```

### Key Components

- `TableList`: Displays all available tables
- `TableEditor`: UI for creating/editing table schema
- `DataGrid`: Component for viewing and editing table data
- `QueryBuilder`: Visual interface for building queries

### Adding New Features

1. Create new components in the `components/` directory
2. Add necessary hooks and utilities
3. Update the main UI in `index.tsx`
4. Update documentation

## Configuration

The app configuration is stored in `config/app.config.json` and includes:

- App metadata
- Permissions
- Integration settings
- Default configuration

## API Integration

MixDB uses the Mixcore API for data operations. Key endpoints:

- `GET /api/v2/mixdb/tables`: List all tables
- `POST /api/v2/mixdb/tables`: Create a new table
- `GET /api/v2/mixdb/tables/{id}/data`: Get table data
- `POST /api/v2/mixdb/tables/{id}/data`: Add or update records

## Related Documentation

- [Mixcore API Guide](../../../docs/guides/API-GUIDE.md)
- [Coding Standards](../../../docs/guides/CODING-STANDARDS.md) 