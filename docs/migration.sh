#!/bin/bash

# Mixcore Migration Helper Script
# This script helps automate common tasks during the migration process.

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOCS_DIR="$(dirname "$0")"
TRACKING_FILE="$DOCS_DIR/tracking/PROGRESS-TRACKER.md"
APP_DIR="$DOCS_DIR/../src/app"
COMPONENTS_DIR="$DOCS_DIR/../src/components"

# Function to display help
show_help() {
  echo -e "${BLUE}Mixcore Migration Helper${NC}"
  echo ""
  echo "Usage: ./migration.sh [command]"
  echo ""
  echo "Available commands:"
  echo "  status             - Show current migration status"
  echo "  component-status   - Show component implementation status"
  echo "  api-status         - Show API integration status" 
  echo "  create-component   - Create a new component from template"
  echo "  create-page        - Create a new page from template"
  echo "  update-progress    - Mark a component or page as completed"
  echo "  help               - Show this help message"
  echo ""
}

# Function to show current migration status
show_status() {
  echo -e "${BLUE}Current Migration Status${NC}"
  echo ""
  
  # Extract overall progress from tracker
  PROGRESS=$(grep -A 3 "Migration Status Summary" "$TRACKING_FILE" | grep "Overall Progress" | sed -E 's/.*: (.*)/\1/')
  PHASE=$(grep -A 3 "Migration Status Summary" "$TRACKING_FILE" | grep "Current Phase" | sed -E 's/.*: (.*)/\1/')
  FOCUS=$(grep -A 3 "Migration Status Summary" "$TRACKING_FILE" | grep "Current Focus" | sed -E 's/.*: (.*)/\1/')
  
  echo -e "Progress: ${GREEN}$PROGRESS${NC}"
  echo -e "Phase: ${YELLOW}$PHASE${NC}"
  echo -e "Current Focus: $FOCUS"
  echo ""
  
  # Show current sprint tasks
  echo -e "${BLUE}Current Sprint Tasks${NC}"
  echo ""
  
  grep -A 20 "Current Sprint" "$TRACKING_FILE" | grep -E "^\|" | grep -v "Task\|---" | 
    sed -E 's/\| (.*) \| (.*) \| (.*) \| (.*) \|/\1 - \3 (Due: \4)/' |
    sed -E "s/🔄 In Progress/${YELLOW}🔄 In Progress${NC}/" |
    sed -E "s/✅ Complete/${GREEN}✅ Complete${NC}/" |
    sed -E "s/🔜 Planned/${BLUE}🔜 Planned${NC}/" |
    sed -E "s/❌ Not Started/${RED}❌ Not Started${NC}/" |
    sed -E "s/⚠️ Blocked/${RED}⚠️ Blocked${NC}/"
  
  echo ""
}

# Function to show component implementation status
show_component_status() {
  echo -e "${BLUE}Component Implementation Status${NC}"
  echo ""
  
  # Count components by status
  TOTAL=$(grep -E "^\|" "$TRACKING_FILE" | grep -E "\| ✅ Complete \||\| 🔄 In Progress \||\| ❌ Not Started \||\| 🔜 Planned \||\| ⚠️ Blocked \|" | wc -l)
  COMPLETED=$(grep -E "^\|" "$TRACKING_FILE" | grep -E "\| ✅ Complete \|" | wc -l)
  IN_PROGRESS=$(grep -E "^\|" "$TRACKING_FILE" | grep -E "\| 🔄 In Progress \|" | wc -l)
  NOT_STARTED=$(grep -E "^\|" "$TRACKING_FILE" | grep -E "\| ❌ Not Started \|" | wc -l)
  PLANNED=$(grep -E "^\|" "$TRACKING_FILE" | grep -E "\| 🔜 Planned \|" | wc -l)
  BLOCKED=$(grep -E "^\|" "$TRACKING_FILE" | grep -E "\| ⚠️ Blocked \|" | wc -l)
  
  echo -e "Total Components/Pages: $TOTAL"
  echo -e "Completed: ${GREEN}$COMPLETED${NC}"
  echo -e "In Progress: ${YELLOW}$IN_PROGRESS${NC}"
  echo -e "Planned: ${BLUE}$PLANNED${NC}"
  echo -e "Not Started: ${RED}$NOT_STARTED${NC}"
  echo -e "Blocked: ${RED}$BLOCKED${NC}"
  echo ""
  
  # Show in-progress components
  echo -e "${YELLOW}Components In Progress${NC}"
  echo ""
  
  grep -E "^\|" "$TRACKING_FILE" | grep -E "\| 🔄 In Progress \|" | 
    sed -E 's/\| (.*) \| (.*) \| (.*) \| (.*) \|.*/\1 - \3/' | grep -v "---"
  
  echo ""
}

# Function to show API integration status
show_api_status() {
  echo -e "${BLUE}API Integration Status${NC}"
  echo ""
  
  echo -e "${YELLOW}API Services${NC}"
  grep -A 20 "API Service Status" "$TRACKING_FILE" | grep -E "^\|" | grep -v "Service\|---" | 
    sed -E 's/\| (.*) \| (.*) \| (.*) \| (.*) \|/\1 - \2 (\3)/' |
    sed -E "s/🔄 In Progress/${YELLOW}🔄 In Progress${NC}/" |
    sed -E "s/✅ Complete/${GREEN}✅ Complete${NC}/" |
    sed -E "s/❌ Not Started/${RED}❌ Not Started${NC}/"
  
  echo ""
  echo -e "${YELLOW}Pages with API Integration${NC}"
  
  grep -E "^\|" "$TRACKING_FILE" | grep -E "\| ✅ Complete \| ✅ Complete \|" | 
    sed -E 's/\| (.*) \| (.*) \| (.*) \| (.*) \| (.*) \|/\1 - API Integration Complete/'
  
  echo ""
  echo -e "${YELLOW}Pages with Pending API Integration${NC}"
  
  grep -E "^\|" "$TRACKING_FILE" | grep -E "\| ✅ Complete \| (🔄 In Progress|❌ Not Started) \|" | 
    sed -E 's/\| (.*) \| (.*) \| (.*) \| (.*) \| (.*) \|/\1 - \3/'
  
  echo ""
}

# Function to create a new component from template
create_component() {
  if [ -z "$1" ]; then
    echo -e "${RED}Error: Component name is required${NC}"
    echo "Usage: ./migration.sh create-component ComponentName"
    exit 1
  fi
  
  COMPONENT_NAME="$1"
  COMPONENT_PATH="$COMPONENTS_DIR/$COMPONENT_NAME.tsx"
  
  if [ -f "$COMPONENT_PATH" ]; then
    echo -e "${RED}Error: Component already exists at $COMPONENT_PATH${NC}"
    exit 1
  fi
  
  echo -e "${BLUE}Creating component $COMPONENT_NAME...${NC}"
  
  # Create the component file
  cat > "$COMPONENT_PATH" << EOL
'use client';

import { useState } from 'react';

interface ${COMPONENT_NAME}Props {
  // Define your props here
}

export function ${COMPONENT_NAME}({ ...props }: ${COMPONENT_NAME}Props) {
  // Component implementation
  return (
    <div className="container mx-auto p-4">
      {/* Component content */}
    </div>
  );
}
EOL
  
  echo -e "${GREEN}Component created at $COMPONENT_PATH${NC}"
  echo ""
  echo "Don't forget to add this component to the Component Registry:"
  echo "Edit docs/reference/COMPONENT-REGISTRY.md and add a new entry."
}

# Function to create a new page from template
create_page() {
  if [ -z "$1" ]; then
    echo -e "${RED}Error: Page path is required${NC}"
    echo "Usage: ./migration.sh create-page path/to/page"
    echo "Example: ./migration.sh create-page posts/[id]/edit"
    exit 1
  fi
  
  PAGE_PATH="$1"
  FULL_PATH="$APP_DIR/$PAGE_PATH/page.tsx"
  DIR_PATH="$(dirname "$FULL_PATH")"
  
  if [ -f "$FULL_PATH" ]; then
    echo -e "${RED}Error: Page already exists at $FULL_PATH${NC}"
    exit 1
  fi
  
  echo -e "${BLUE}Creating page at $PAGE_PATH...${NC}"
  
  # Create the directory if it doesn't exist
  mkdir -p "$DIR_PATH"
  
  # Create the page file
  cat > "$FULL_PATH" << EOL
'use client';

import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageHeader } from '@/components/layout/PageHeader';

export default function Page() {
  // Page implementation
  return (
    <PageLayout>
      <PageHeader title="Page Title" />
      <main className="container mx-auto p-4">
        {/* Page content */}
      </main>
    </PageLayout>
  );
}
EOL
  
  echo -e "${GREEN}Page created at $FULL_PATH${NC}"
  echo ""
  echo "Don't forget to update the Progress Tracker:"
  echo "Edit docs/tracking/PROGRESS-TRACKER.md and add/update the page entry."
}

# Function to update progress
update_progress() {
  echo -e "${YELLOW}This feature is not yet implemented.${NC}"
  echo "For now, please manually update the Progress Tracker:"
  echo "Edit docs/tracking/PROGRESS-TRACKER.md and update the relevant entries."
}

# Main script execution

# Show help if no arguments
if [ $# -eq 0 ]; then
  show_help
  exit 0
fi

# Parse arguments
case "$1" in
  status)
    show_status
    ;;
  component-status)
    show_component_status
    ;;
  api-status)
    show_api_status
    ;;
  create-component)
    create_component "$2"
    ;;
  create-page)
    create_page "$2"
    ;;
  update-progress)
    update_progress
    ;;
  help|--help|-h)
    show_help
    ;;
  *)
    echo -e "${RED}Unknown command: $1${NC}"
    show_help
    exit 1
    ;;
esac

exit 0 