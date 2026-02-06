#!/bin/bash

# HardWire Setup Script
# This script validates environment variables and starts all services

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                    HardWire Setup Script                      ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Track errors
ERRORS=()

# Function to check if a file exists
check_file() {
    local file=$1
    local example=$2
    if [[ ! -f "$file" ]]; then
        ERRORS+=("Missing: $file\n  → Copy from: $example")
        return 1
    fi
    return 0
}

# Function to check if a variable is set in a file
check_var() {
    local file=$1
    local var=$2
    local description=$3
    if ! grep -q "^${var}=" "$file" 2>/dev/null; then
        ERRORS+=("Missing variable: $var in $file\n  → $description")
        return 1
    fi
    # Check if it's set to a placeholder or empty
    local value=$(grep "^${var}=" "$file" | cut -d'=' -f2- | tr -d '"' | tr -d "'")
    if [[ -z "$value" || "$value" == "sk-..." || "$value" == "sk-ant-..." || "$value" == "AIza..." || "$value" == "your-super-secret-key-minimum-32-characters-long" ]]; then
        ERRORS+=("Placeholder value: $var in $file\n  → Please set a real value. $description")
        return 1
    fi
    return 0
}

# Function to check if at least one LLM key is set
check_llm_keys() {
    local file=$1
    local has_key=false

    for var in OPENAI_API_KEY ANTHROPIC_API_KEY GOOGLE_GENERATIVE_AI_API_KEY; do
        if grep -q "^${var}=" "$file" 2>/dev/null; then
            local value=$(grep "^${var}=" "$file" | cut -d'=' -f2- | tr -d '"' | tr -d "'")
            if [[ -n "$value" && "$value" != "sk-..." && "$value" != "sk-ant-..." && "$value" != "AIza..." ]]; then
                has_key=true
                break
            fi
        fi
    done

    if [[ "$has_key" == false ]]; then
        ERRORS+=("No LLM API key configured in $file\n  → Set at least one of: OPENAI_API_KEY, ANTHROPIC_API_KEY, or GOOGLE_GENERATIVE_AI_API_KEY")
        return 1
    fi
    return 0
}

echo -e "${YELLOW}Step 1: Checking environment files...${NC}\n"

# Check backend/.env
echo -n "  Checking backend/.env... "
if check_file "$ROOT_DIR/backend/.env" "backend/.env.example"; then
    echo -e "${GREEN}found${NC}"
else
    echo -e "${RED}missing${NC}"
fi

# Check frontend/.env.local
echo -n "  Checking frontend/.env.local... "
if check_file "$ROOT_DIR/frontend/.env.local" "frontend/.env.local.example"; then
    echo -e "${GREEN}found${NC}"
else
    echo -e "${RED}missing${NC}"
fi

# Check mcp-tools-server/.env
echo -n "  Checking mcp-tools-server/.env... "
if check_file "$ROOT_DIR/mcp-tools-server/.env" "mcp-tools-server/.env.example"; then
    echo -e "${GREEN}found${NC}"
else
    echo -e "${RED}missing${NC}"
fi

echo ""

# If any files are missing, show errors and exit
if [[ ${#ERRORS[@]} -gt 0 ]]; then
    echo -e "${RED}╔═══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║                    Missing Environment Files                   ║${NC}"
    echo -e "${RED}╚═══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    for error in "${ERRORS[@]}"; do
        echo -e "  ${RED}✗${NC} $error"
        echo ""
    done
    echo -e "Please create the missing files from their .example templates."
    echo -e "See README.md for detailed configuration instructions."
    exit 1
fi

echo -e "${YELLOW}Step 2: Validating required environment variables...${NC}\n"

# Check backend required variables
echo "  Backend configuration:"
echo -n "    DATABASE_URL... "
if check_var "$ROOT_DIR/backend/.env" "DATABASE_URL" "PostgreSQL connection string"; then
    echo -e "${GREEN}set${NC}"
else
    echo -e "${RED}missing/invalid${NC}"
fi

echo -n "    AUTH_SECRET... "
if check_var "$ROOT_DIR/backend/.env" "AUTH_SECRET" "Minimum 32 character secret for sessions"; then
    echo -e "${GREEN}set${NC}"
else
    echo -e "${RED}missing/invalid${NC}"
fi

echo -n "    API_URL... "
if check_var "$ROOT_DIR/backend/.env" "API_URL" "Backend API URL (e.g., http://localhost:3026)"; then
    echo -e "${GREEN}set${NC}"
else
    echo -e "${RED}missing/invalid${NC}"
fi

echo -n "    MCP_TOOLS_URL... "
if check_var "$ROOT_DIR/backend/.env" "MCP_TOOLS_URL" "MCP Tools Server URL (e.g., http://localhost:4010)"; then
    echo -e "${GREEN}set${NC}"
else
    echo -e "${RED}missing/invalid${NC}"
fi

echo -n "    LLM API Key (at least one)... "
if check_llm_keys "$ROOT_DIR/backend/.env"; then
    echo -e "${GREEN}set${NC}"
else
    echo -e "${RED}missing${NC}"
fi

echo ""
echo "  Frontend configuration:"
echo -n "    NEXT_PUBLIC_API_URL... "
if check_var "$ROOT_DIR/frontend/.env.local" "NEXT_PUBLIC_API_URL" "Backend API URL"; then
    echo -e "${GREEN}set${NC}"
else
    echo -e "${RED}missing/invalid${NC}"
fi

echo ""

# If validation errors, show them and exit
if [[ ${#ERRORS[@]} -gt 0 ]]; then
    echo -e "${RED}╔═══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║                    Configuration Errors                        ║${NC}"
    echo -e "${RED}╚═══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    for error in "${ERRORS[@]}"; do
        echo -e "  ${RED}✗${NC} $error"
        echo ""
    done
    echo -e "Please fix the configuration errors and run this script again."
    exit 1
fi

echo -e "${GREEN}✓ All environment variables validated successfully!${NC}"
echo ""

echo -e "${YELLOW}Step 3: Checking prerequisites...${NC}\n"

# Check for Docker
echo -n "  Docker... "
if command -v docker &> /dev/null; then
    echo -e "${GREEN}found${NC}"
else
    echo -e "${RED}not found${NC}"
    echo -e "\n${RED}Error: Docker is required but not installed.${NC}"
    echo "Please install Docker from https://www.docker.com/get-started"
    exit 1
fi

# Check for Docker Compose
echo -n "  Docker Compose... "
if docker compose version &> /dev/null; then
    echo -e "${GREEN}found${NC}"
else
    echo -e "${RED}not found${NC}"
    echo -e "\n${RED}Error: Docker Compose is required but not installed.${NC}"
    echo "Please install Docker Compose from https://docs.docker.com/compose/install/"
    exit 1
fi

echo ""
echo -e "${GREEN}✓ All prerequisites met!${NC}"
echo ""

echo -e "${YELLOW}Step 4: Starting services...${NC}\n"
echo "  This will start: PostgreSQL, Backend, MCP Tools Server, Frontend"
echo "  (Marketing site and Docs can be started separately with 'npm run dev')"
echo ""

cd "$ROOT_DIR"

# Start all services with Docker Compose
echo -e "${BLUE}Running: docker compose up --build${NC}"
echo ""

docker compose up --build

