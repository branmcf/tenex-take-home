# Getting Started

<p align="center"> 
    <img 
src="https://github.com/user-attachments/assets/c1c538ac-e17b-456e-a051-497aa31dede1"
        alt="Hardwire" 
        height="70%"
        width="100%">
</p>

This guide walks you through setting up HardWire locally.

---

## Prerequisites

Before you begin, ensure you have:

- **Docker Desktop** installed and running ([download](https://www.docker.com/products/docker-desktop/))
- **A Resend API key** for email verification ([get key](https://resend.com/))
- **At least one LLM API key** from:
  - OpenAI ([get key](https://platform.openai.com/))
  - Anthropic ([get key](https://console.anthropic.com/))
  - Google AI ([get key](https://aistudio.google.com/))

---

## Step 1: Clone the Repository

```bash
# clone the repo
git clone https://github.com/branmcf/tenex-take-home.git

# move in to the tenex-take-home dir
cd tenex-take-home
```

---

## Step 2: Create Environment Files

Copy the example files to create your local configuration:

```bash
# copy example environment files to create .env files
cp backend/.env.example backend/.env && cp frontend/.env.local.example frontend/.env.local && cp mcp-tools-server/.env.example mcp-tools-server/.env
```

---

## Step 3: Add Your API Keys

Open `backend/.env` in your editor:

```bash
# edit with your preferred editor
cursor .
```

Find and open the `backend/.env` file. You need to set:

**1. Resend API key (required for email verification):**

```env
RESEND_API_KEY="re_your-actual-key-here"
```

**2. At least one LLM provider API key:**

```env
# LLM Providers (at least ONE required)
OPENAI_API_KEY="sk-your-actual-key-here"
ANTHROPIC_API_KEY="sk-ant-your-actual-key-here"
GOOGLE_GENERATIVE_AI_API_KEY="your-actual-key-here"
```

Save and close the file.

---

## Step 4: Run the Setup Script

Make the setup script executable and run it:

```bash
# make the script executable
chmod +x scripts/setup.sh

# run the script
./scripts/setup.sh
```

The script will:
1. Validate all required environment variables are set
2. Check that Docker and Docker Compose are available
3. Build and start all services

---

## Step 5: Verify Everything is Running

Once the script completes, you should see the services starting. Open your browser to:

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Main application |
| Backend API | http://localhost:3026 | REST API |
| GraphiQL | http://localhost:3026/graphiql | PostGraphile query explorer |
| MCP Tools | http://localhost:4010 | Tool execution server |

The frontend should load and you can create an account to start using the app.

**GraphiQL** is PostGraphile's interactive query explorer. Use it to browse the auto-generated GraphQL schema and test queries against the database.

---

## Troubleshooting

### "Port already in use" error

Another process is using one of the required ports. Either stop that process or check what's using it:

```bash
# Check what's using port 3000
lsof -i :3000

# Stop all HardWire containers
docker compose down
```

### "Missing environment variable" error

The setup script will tell you exactly which variable is missing. Double-check:

1. The file exists (e.g., `backend/.env`)
2. The variable is set to a real value, not a placeholder like `sk-...`

### Docker build fails

Ensure Docker Desktop is running and you have internet access (for pulling base images).

```bash
# Verify Docker is working
docker ps
```

### Database connection errors

The PostgreSQL container may need a moment to initialize. Wait 10-15 seconds and refresh.

---

## Optional: Run Individual Services

If you prefer running services individually (for development):

```bash
# Terminal 1: Start PostgreSQL only
docker compose up postgres -d

# Terminal 2: MCP Tools Server
cd mcp-tools-server && npm install && npm run dev

# Terminal 3: Backend
cd backend && npm install && npm run migrate:up && npm run dev

# Terminal 4: Frontend
cd frontend && npm install && npm run dev
```

---

## Optional: Documentation and Marketing Sites

These are not required for the main application:

```bash
# API Documentation (MkDocs - requires Python)
cd docs
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
mkdocs serve
# Open http://localhost:8000

# Marketing Site (Vite)
cd marketing && npm install && npm run dev
# Open http://localhost:5173
```

---

## Environment File Reference

### backend/.env

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `AUTH_SECRET` | Yes | Session secret (min 32 chars) |
| `API_URL` | Yes | Backend URL (http://localhost:3026) |
| `MCP_TOOLS_URL` | Yes | MCP server URL (http://localhost:4010) |
| `RESEND_API_KEY` | Yes | Resend API key for email verification |
| `OPENAI_API_KEY` | One of these | OpenAI API key |
| `ANTHROPIC_API_KEY` | One of these | Anthropic API key |
| `GOOGLE_GENERATIVE_AI_API_KEY` | One of these | Google AI API key |
| `GOOGLE_CLIENT_ID` | No | For Google OAuth sign-in |
| `GOOGLE_CLIENT_SECRET` | No | For Google OAuth sign-in |
| `EXA_API_KEY` | No | For web search feature |

### frontend/.env.local

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | Backend API URL |

### mcp-tools-server/.env

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: 4010) |
| `MCP_TOOLS_API_KEY` | No | Must match backend's key |

---

## Next Steps

Once running:

1. **Create an account** at http://localhost:3000/signup
2. **Create a workflow** describing what you want to automate
3. **Run the workflow** and watch the DAG execution in real-time

See [README.md](./README.md) for architecture details and what to look at in the code.
