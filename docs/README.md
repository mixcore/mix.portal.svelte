# Mixcore Documentation

This directory contains the official documentation for the Mixcore React migration project.

## Documentation Structure

```
docs/
├── MIGRATION-GUIDE.md       # Main entry point and overview
├── guides/                  # Detailed development guides
│   ├── API-GUIDE.md         # API integration guidelines
│   ├── ANGULAR-TO-REACT-PATTERNS.md  # Migration patterns
│   ├── CODING-STANDARDS.md  # Coding standards & best practices
│   └── ...
├── tracking/                # Progress tracking documents
│   ├── IMPLEMENTATION-PLAN.md # Overall implementation plan
│   ├── PROGRESS-TRACKER.md  # Detailed status tracking
│   └── ...
└── reference/               # Reference documentation
    ├── COMPONENT-REGISTRY.md # Component library catalog
    └── ...
```

## Helper Scripts

The documentation includes several helper scripts to facilitate development and maintenance:

### Migration Helper

The `migration.sh` script provides tools for tracking and managing the migration process:

```bash
# View current migration status
./migration.sh status

# Show component implementation status
./migration.sh component-status

# Show API integration status
./migration.sh api-status

# Create a new component from template
./migration.sh create-component ComponentName

# Create a new page from template
./migration.sh create-page path/to/page
```

### Documentation Maintenance

The `doc-maintenance.sh` script helps maintain the documentation itself:

```bash
# Check for broken links in documentation
./doc-maintenance.sh validate

# Generate a table of contents for a markdown file
./doc-maintenance.sh toc path/to/file.md

# Find orphaned documentation files
./doc-maintenance.sh find-orphans

# Show documentation statistics
./doc-maintenance.sh stats
```

### Documentation Cleanup

The `cleanup.sh` script helps remove old documentation files that have been consolidated into the new structure:

```bash
# Remove old documentation files
./cleanup.sh
```

## Documentation Guidelines

When contributing to the documentation:

1. **Use the correct location**: Place new documentation in the appropriate directory based on its purpose.
2. **Follow the style guide**: Use consistent formatting and structure.
3. **Update links**: When moving or renaming documents, update all references to them.
4. **Keep it current**: Outdated documentation is worse than no documentation.
5. **Use helper scripts**: Leverage the provided scripts to maintain documentation quality.

## Getting Started

If you're new to the project, start with the [Migration Guide](./MIGRATION-GUIDE.md), which provides an overview of the migration process and current status.

## Development Workflow

When working on the migration, follow these steps:

1. Check the [Progress Tracker](./tracking/PROGRESS-TRACKER.md) to understand what's been completed and what's next
2. Consult the [Component Registry](./reference/COMPONENT-REGISTRY.md) to see what components are available for reuse
3. Review the [API Guide](./guides/API-GUIDE.md) if implementing API integration
4. Follow the [Coding Standards](./guides/CODING-STANDARDS.md) for implementation
5. Use the [AngularJS-to-React Patterns](./guides/ANGULAR-TO-REACT-PATTERNS.md) for converting existing components
6. Update the relevant tracking documents as you complete work

## Updating Documentation

As the project evolves, it's important to keep this documentation up to date:

1. Update the [Progress Tracker](./tracking/PROGRESS-TRACKER.md) when components or features are completed
2. Add new components to the [Component Registry](./reference/COMPONENT-REGISTRY.md)
3. Update the [Implementation Plan](./tracking/IMPLEMENTATION-PLAN.md) as phases are completed

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs) - Official Next.js documentation
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Official Tailwind CSS documentation
- [shadcn/ui Documentation](https://ui.shadcn.com/docs) - shadcn/ui component documentation
- [React Hook Form Documentation](https://react-hook-form.com/get-started) - Form handling library docs 