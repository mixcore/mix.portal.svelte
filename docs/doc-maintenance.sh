#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

show_help() {
  echo -e "${BLUE}Mixcore Documentation Maintenance${NC}"
  echo ""
  echo "Usage: ./doc-maintenance.sh [command]"
  echo ""
  echo "Available commands:"
  echo "  validate      - Check for broken links and missing files in documentation"
  echo "  toc           - Generate table of contents for a markdown file"
  echo "  find-orphans  - Find orphaned documentation files not linked from main docs"
  echo "  stats         - Show documentation statistics"
  echo "  help          - Show this help message"
  echo ""
}

validate_docs() {
  echo -e "${BLUE}Validating documentation...${NC}"
  echo ""
  
  # Find all markdown files in docs directory
  FILES=$(find . -name "*.md")
  
  # Initialize counters
  BROKEN_LINKS=0
  
  # Process each file
  for FILE in $FILES; do
    echo -e "Checking ${YELLOW}$FILE${NC}..."
    
    # Extract all relative links
    LINKS=$(grep -o -E '\[[^]]+\]\([^)]+\)' "$FILE" | grep -v "http" | grep -o -E '\([^)]+\)' | tr -d '()')
    
    # Check if links are valid
    for LINK in $LINKS; do
      # Skip anchor links
      if [[ "$LINK" == \#* ]]; then
        continue
      fi
      
      # Get base directory of the current file
      DIR=$(dirname "$FILE")
      
      # Handle relative links
      if [[ "$LINK" == ./* ]]; then
        TARGET="$DIR/${LINK#./}"
      elif [[ "$LINK" == ../* ]]; then
        TARGET="$DIR/$LINK"
      else
        TARGET="$DIR/$LINK"
      fi
      
      # Normalize path
      TARGET=$(realpath --relative-to="." "$TARGET" 2>/dev/null)
      
      # Check if file exists
      if [ ! -f "$TARGET" ]; then
        echo -e "  ${RED}Broken link:${NC} $LINK -> $TARGET"
        BROKEN_LINKS=$((BROKEN_LINKS + 1))
      fi
    done
  done
  
  echo ""
  if [ $BROKEN_LINKS -eq 0 ]; then
    echo -e "${GREEN}All documentation links are valid!${NC}"
  else
    echo -e "${RED}Found $BROKEN_LINKS broken links.${NC}"
  fi
}

generate_toc() {
  if [ -z "$1" ]; then
    echo -e "${RED}Error: File path is required${NC}"
    echo "Usage: ./doc-maintenance.sh toc path/to/file.md"
    exit 1
  fi
  
  FILE="$1"
  
  if [ ! -f "$FILE" ]; then
    echo -e "${RED}Error: File $FILE does not exist${NC}"
    exit 1
  fi
  
  echo -e "${BLUE}Generating table of contents for $FILE...${NC}"
  echo ""
  
  # Extract all headings
  HEADINGS=$(grep -E "^#+\s+" "$FILE" | sed 's/^#\+\s\+//')
  
  echo "## Table of Contents"
  echo ""
  
  # Process each heading
  LINE_NUM=1
  for HEADING in $HEADINGS; do
    # Get line number
    LINE_NUM=$(grep -n "^#\+\s\+$HEADING$" "$FILE" | cut -d: -f1)
    
    # Get heading level (number of # characters)
    LEVEL=$(grep -E "^#+\s+$HEADING$" "$FILE" | grep -o "^#\+" | wc -c)
    LEVEL=$((LEVEL - 1))
    
    # Generate indentation
    INDENT=""
    for i in $(seq 1 $((LEVEL - 2))); do
      INDENT="$INDENT  "
    done
    
    # Generate link-friendly version of heading
    LINK=$(echo "$HEADING" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/-\+/-/g' | sed 's/^-//' | sed 's/-$//')
    
    # Print entry
    echo "$INDENT- [$HEADING](#$LINK)"
  done
  
  echo ""
  echo -e "${GREEN}Table of contents generated.${NC}"
}

find_orphans() {
  echo -e "${BLUE}Finding orphaned documentation files...${NC}"
  echo ""
  
  # Get all markdown files
  ALL_FILES=$(find . -name "*.md" | sort)
  
  # Get all linked files
  LINKED_FILES=$(grep -o -E '\[[^]]+\]\([^)]+\)' $(find . -name "*.md") | grep -v "http" | grep -o -E '\([^)]+\)' | tr -d '()' | sort | uniq)
  
  # Check each file to see if it's linked
  for FILE in $ALL_FILES; do
    # Skip README.md at root level
    if [ "$FILE" == "./README.md" ]; then
      continue
    fi
    
    # Check if file is linked from anywhere
    LINKED=false
    FILE_BASENAME=$(basename "$FILE")
    for LINKED_FILE in $LINKED_FILES; do
      if [[ "$LINKED_FILE" == *"$FILE_BASENAME"* ]]; then
        LINKED=true
        break
      fi
    done
    
    if [ "$LINKED" = false ]; then
      echo -e "${YELLOW}Orphaned file:${NC} $FILE"
    fi
  done
  
  echo ""
}

show_stats() {
  echo -e "${BLUE}Documentation Statistics${NC}"
  echo ""
  
  # Count files by type
  TOTAL_FILES=$(find . -name "*.md" | wc -l)
  
  # Count lines of documentation
  TOTAL_LINES=$(wc -l $(find . -name "*.md") | tail -1 | awk '{print $1}')
  
  # Count headings
  TOTAL_HEADINGS=$(grep -E "^#+\s+" $(find . -name "*.md") | wc -l)
  
  # Count code blocks
  TOTAL_CODE_BLOCKS=$(grep -E "^\`\`\`" $(find . -name "*.md") | wc -l)
  TOTAL_CODE_BLOCKS=$((TOTAL_CODE_BLOCKS / 2))
  
  echo -e "Total Documentation Files: ${GREEN}$TOTAL_FILES${NC}"
  echo -e "Total Lines of Documentation: ${GREEN}$TOTAL_LINES${NC}"
  echo -e "Total Headings: ${GREEN}$TOTAL_HEADINGS${NC}"
  echo -e "Total Code Blocks: ${GREEN}$TOTAL_CODE_BLOCKS${NC}"
  
  # Show largest files
  echo ""
  echo -e "${BLUE}Largest Documentation Files:${NC}"
  wc -l $(find . -name "*.md") | sort -nr | head -5 | awk '{print $2 " - " $1 " lines"}'
  
  echo ""
}

# Main script execution

# Show help if no arguments
if [ $# -eq 0 ]; then
  show_help
  exit 0
fi

# Parse arguments
case "$1" in
  validate)
    validate_docs
    ;;
  toc)
    generate_toc "$2"
    ;;
  find-orphans)
    find_orphans
    ;;
  stats)
    show_stats
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