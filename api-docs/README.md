# Mixcore API Documentation

This directory contains the Mixcore API documentation split into smaller, more manageable files to improve readability and make it easier for AI agents to process.

## Structure

The API documentation is organized as follows:

- **index.json**: Contains the OpenAPI metadata without paths
- **auth/**: Authentication and authorization API endpoints
  - index.json: All auth endpoints combined
  - part-*.json: Auth endpoints split into smaller files
- **automation/**: Workflow and automation API endpoints
  - index.json: All automation endpoints combined
  - part-*.json: Automation endpoints split into smaller files
- **mixservices/**: General MixCore services API endpoints
  - index.json: All mix services endpoints combined
  - part-*.json: Mix services endpoints split into smaller files
- **schemas/**: API schemas and component definitions
  - all-schemas.json: All schema definitions

## Usage

When working with the API documentation:

1. Start with the `index.json` file to understand the API structure
2. Reference the appropriate category file based on what you're looking for:
   - Authentication/Authorization: `auth/index.json`
   - Automation/Workflows: `automation/index.json`
   - Mix Services: `mixservices/index.json`
3. For detailed schema information, refer to the `schemas/all-schemas.json` file

## Regenerating the Documentation

To regenerate this documentation structure from a new API definition file:

1. Place the updated API definition file in the parent directory as `mixcore-api-enpoints.json`
2. Run the script: `node split-api-docs.js` 